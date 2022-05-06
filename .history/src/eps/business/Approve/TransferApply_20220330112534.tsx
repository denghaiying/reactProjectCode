import { useEffect, useState, useRef } from 'react';
import { observer, useObserver } from 'mobx-react';
import EpsRecordPanel from '@/eps/components/panel/EpsRecordPanel';
import { ITable, ITitle } from '@/eps/commons/declare';
import _ApplyService from './ApplyService';
import {
  Select,
  DatePicker,
  Space,
  Row,
  Col,
  Button,
  notification,
  Form,
  message,
  Tooltip,
  Tabs,
  Modal,
  Progress,
  Icon,
  Input,
} from 'antd';
import _ApplyStore from './ApplyStore';
import { DownloadOutlined } from '@ant-design/icons';
import { WflwButtons } from '@/components/Wflw';
const { RangePicker } = DatePicker;
import DapubStore from './DapubStore';
import applyDetailStore from './ApplyDetailStore';
import './index.less';
import './TransferApply.less';
import WfdefStore from '@/stores/workflow/WfdefStore';
import Print from '@/pages/dagl/Yjsp/Print';
import UploadReport from '@/pages/dagl/Yjsp/UploadReport';

import ZxyjStore from '@/stores/dagl/XZxyjStore';

import GszxyjcxStore from '@/stores/dagsyj/GszxyjcxStore';
import moment, { isMoment } from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import { EditOutlined } from '@ant-design/icons';
import EpsDeleteButton from '@/eps/components/buttons/EpsDeleteButton';
import SysStore from '@/stores/system/SysStore';
import EditDailog from './EditDailog';
import { useIntl } from 'umi';
import ApplyDetail from './ApplyDetailNoToolBar';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import ArchDetail from './ArchDetail';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import fetch from '../../../utils/fetch';
import records from '@/locales/zh-CN/ocroad/records';
import { RecordPanelProps } from '../../components/panel/EpsRecordPanel/index';
import { useParams } from 'umi';
import EpsReportButton from '@/eps/components/buttons/EpsReportButton';

const { TabPane } = Tabs;

const title: ITitle = {
  name: '档案移交',
};

interface DataType {
  autosubmit: boolean;
  bmid: string;
  dakid: string;
  dakmc: string;
  datbl: string;
  date: string;
  dwid: string;
  edittype: number;
  fjs: number;
  id: string;
  mbid: string;
  month: number;
  title: string;
  wfawaiter: string;
  wfhandler: string;
  wfid: string;
  wfinst: string;
  whsj: string;
  wpid: string;
  year: number;
  yjr: string;
  yjrid: string;
  zt: string;
}
const userinfo = SysStore.getCurrentUser();
const ApplyStore = new _ApplyStore('', true, true);

const TransferApply = observer((props) => {
  const approveParams = useParams();
  const wfinst = approveParams.wfinst || '';
  ApplyStore.setUrl(`/api/eps/control/main/${props.spurl}`);
  const ApplyService = new _ApplyService(
    `/api/eps/control/main/${props.spurl}`,
  );
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  // 审批默认列
  const defaultMainColumns = [
    {
      title: formatMessage({ id: 'e9.dagl.yjsp.zt' }),
      code: 'wpid',
      width: 80,
      render: (value) => {
        if (value === 'ZZZZ') {
          return '结束';
        }
        if (value === 'ZZZY') {
          return '否决';
        }
        const list = WfdefStore.proclist[props.wfCode];

        if (list) {
          for (let i = 0; i <= list.length - 1; i++) {
            if (list[i].wpid == value) {
              return list[i].name;
            }
          }
        }
        // return value;
      },
    },
    {
      title: '申请单号',
      code: 'bh',
      width: 100,
    },

    {
      title: '标题',
      code: 'title',
      width: 200,
    },
    {
      title: '申请人',
      code: 'sqrmc',
      width: 100,
    },
    {
      title: '申请日期',
      code: 'sqsj',
      width: 150,
    },
    {
      title: '真实性检测',
      code: 'zsx',
      width: 120,
    },
    {
      title: '完整性检测',
      code: 'qzx',
      width: 120,
    },
    {
      title: '可用性检测',
      code: 'kyx',
      width: 120,
    },
    {
      title: '安全性检测',
      code: 'aqx',
      width: 120,
    },
    {
      title: formatMessage({ id: 'e9.wflw.pub.wfawaiter' }),
      code: 'wfawaiter',
      width: 100,
    },
  ];

  const defaultMainColumnsJs = [
    {
      title: formatMessage({ id: 'e9.dagl.yjsp.zt' }),
      code: 'wpid',
      width: 70,
      render: (value) => {
        if (value === 'ZZZZ') {
          return '结束';
        }
        if (value === 'ZZZY') {
          return '否决';
        }
        const list = WfdefStore.proclist[props.wfCode];

        if (list) {
          for (let i = 0; i <= list.length - 1; i++) {
            if (list[i].wpid == value) {
              return list[i].name;
            }
          }
        }
        // return value;
      },
    },
    {
      title: '申请单号',
      code: 'bh',
      width: 80,
    },
    {
      title: '接收状态',
      code: 'jszt',
      width: 80,
      render: (value) => {
        if (value === 'Y') {
          return '已接收';
        } else {
          return '未接收';
        }
      },
    },
    {
      title: '标题',
      code: 'title',
      width: 200,
    },
    {
      title: '申请人',
      code: 'sqrmc',
      width: 100,
    },
    {
      title: '申请日期',
      code: 'sqsj',
      width: 120,
    },
    {
      title: '真实性检测',
      code: 'jszsx',
      width: 120,
    },
    {
      title: '完整性检测',
      code: 'jswzx',
      width: 120,
    },
    {
      title: '可用性检测',
      code: 'jskyx',
      width: 120,
    },
    {
      title: '安全性检测',
      code: 'jsaqx',
      width: 120,
    },
    {
      title: formatMessage({ id: 'e9.wflw.pub.wfawaiter' }),
      code: 'wfawaiter',
      width: 100,
    },
  ];
  const tmzt = props.tmzt;
  const [detailTableStore, setDetailTableStore] = useState<EpsTableStore>(
    new EpsTableStore(props.tableService),
  );

  const defaultDetailColumns: any[] = [
    {
      code: 'jdyj',
      align: 'center',
      title: '审批意见',
      width: '150px',
      render: (value, record, index) => (
        <Space size={8}>
          <span>
            同意<span style={{ color: '#f50' }}>({record.kfs})</span>
          </span>
          <span>
            不同意<span style={{ color: '#2db7f5' }}>({record.bkfs})</span>
          </span>
        </Space>
      ),
      // ="#f50">开放{record.kfs}</Tag>
      // <Tag color="#2db7f5
    },
    {
      title: '审批结果',
      code: 'spjg',
      align: 'center',
      width: 100,
      render: function (value) {
        return value == 'Y' ? '通过' : value == 'N' ? '不通过' : '未审批';
      },
    },
  ];

  const [tabkey, setTabkey] = useState('1');
  const [recordsid, setTecordsid] = useState('1');
  const [wflwType, setWflwType] = useState([
    'submit',
    'return',
    'reject',
    'logview',
  ]);
  const [sxjckj, setSxjckj] = useState(false);
  const [yjwg, setYjwg] = useState(false);
  const [jswg, setJswg] = useState(false);
  const [yjnrms, setYjnrms] = useState(false);
  const [yjsl, setYjsl] = useState(false);
  const [yjsjl, setYjsjl] = useState(false);
  const [yjqzh, setYjqzh] = useState(false);
  const [yjlxgg, setYjlxgg] = useState(false);
  const [editsj, setEditsj] = useState(false);
  const { columns } = props;
  const umid = props.umid;
  const jdlx = props.jdlx;

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   */
  const doSearchAction = (formData, tableStore) => {
    const { datebe, sw = 'W' } = formData;
    if (sfjs) {
      formData.sw = 'J';
    } else {
      formData.sw = 'W';
    }
    const dateb = datebe && datebe[0];
    const datee = datebe && datebe[1];
    const params = { sw };
    if (dateb && isMoment(dateb)) {
      params.dateb = dateb.format('YYYY-MM-DD');
    }
    if (datee && isMoment(datee)) {
      params.datee = datee.format('YYYY-MM-DD');
    }
    ApplyStore.setParams(params, true);
    tableStore.findByKey(tableStore.key, 1, tableStore.size, params);
    ref.current?.clearTableRowClick();
  };
  const ref = useRef();

  const showSxjction = async () => {
    var id = recordsid;
    if (id === '1') {
      message.warning({ type: 'warning', content: '请选择条目信息' });
    } else {
      ZxyjStore.progressValue = 0;
      ZxyjStore.jczt = false;
      ZxyjStore.opt = 'add';
      ZxyjStore.jsprogressValue = 0;
      setVisible(true);
    }
  };

  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const showJstion = async () => {
    var id = recordsid;
    if (id === '1') {
      message.warning({ type: 'warning', content: '请选择条目信息' });
    } else {
      const fd = new FormData();
      fd.append('id', id);
      fd.append('jsrid', SysStore.getCurrentUser().id);
      fd.append('jsr', SysStore.getCurrentUser().yhmc);
      fd.append('jssj', getDate);
      fd.append('jsdw', SysStore.getCurrentCmp().id);
      fd.append('jsdwmc', SysStore.getCurrentCmp().mc);
      const reponse = await fetch.post(
        `/api/eps/control/main/gsyjjssqd/updateJssj`,
        fd,
      );
      if (reponse.status === 200) {
        if (reponse.data?.success) {
          message.success({ content: '已接收!' });
        }
      }
      await fetch.post(`/api/eps/control/main/gsyjjssqd/updateJssj`, fd);
      const store = ref.current?.getTableStore();
      store.findByKey(store.key, 1, store.size, { sw: 'J' });
      doSearchAction({}, store);
      ref.current?.clearTableRowClick();
    }
  };

  const onChangeRow = async (value, tableStore, records) => {
    const record = records[0];
    if (records && records.length > 0) {
      ApplyStore.setSelectRows(
        records.map((item) => item.id),
        records,
      );
      const spkj = false;
      const fd = new FormData();
      fd.append('id', records[0].dakid);
      const jndak = await fetch.post(
        `/api/eps/control/main/dak/queryForId`,
        fd,
      );
      ApplyStore.setSpkj(spkj);
      if (props.wfCode === 'jgyjjs') {
        if (records[0].jszt === 'Y') {
          setWflwType(['submit', 'return', 'reject', 'logview']);
          setYjjs(false);
        } else {
          setWflwType([]);
          setYjjs(true);
        }
        setSfjs(true);
      }
      if (records[0].wpid === 'ZZZZ') {
        setEditsj(true);
      } else {
        setEditsj(false);
      }
      const list = WfdefStore.proclist[props.wfCode];
      if (list) {
        for (let i = 0; i <= list.length - 1; i++) {
          if (list[i].wpid == records[0].wpid) {
            if (list[i].name === '编制') {
              setSxjckj(true);
            } else {
              setSxjckj(false);
            }
          }
        }
      }

      DapubStore.getDaklist(records[0].dakid, tmzt);
      setTecordsid(records[0].id);
      setTabkey('1');
      ApplyStore.setDetailParams({
        zt: record.zt,
        wpid: record.wpid,
        fid: record.id,
        dakid: record.dakid,
        sqmxid: record.id,
        mbid: jndak.data.mbid,
        bmc: jndak.data.mbc,
      });
    }
  };

  useEffect(() => {
    if (props.wfCode === 'xjgyjsp') {
      ApplyStore.setColumns(columns || defaultMainColumns);
      setJswg(true);
      setYjwg(false);
      setYjnrms(false);
      setYjsl(false);
      setYjsjl(false);
      setYjqzh(false);
      setYjlxgg(false);
      setYjjs(false);
      setSfjs(false);
    } else {
      ApplyStore.setColumns(columns || defaultMainColumnsJs);
      setJswg(false);
      setYjwg(true);
      setYjnrms(true);
      setYjsl(true);
      setYjsjl(true);
      setYjqzh(true);
      setYjlxgg(true);
      setYjjs(true);
      setSfjs(true);
    }
    WfdefStore.getPorcs(props.wfCode);
    ApplyStore.getProcOpts(props.wfCode);
    OptrightStore.getFuncRight(umid);
  }, []);

  //<workdlofbegin
  const onBeforeWfAction = async (action) => {
    if (
      !ApplyStore.selectRowRecords ||
      ApplyStore.selectRowRecords.length !== 1
    ) {
      notification.open({
        message: '提示',
        description: '请选择一条数据',
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
      return false;
    }
    // if(ApplyStore.selectRowRecords[0].jczt==="Y"){
    //   return true;
    // }else{
    //   message.warning({ type: 'warning', content: '数据未检测，无法提交!' })
    //   return false;
    // }
    return true;
  };

  const onAfterWfAction = (data) => {
    //ApplyStore.queryForPage();
    const store = ref.current?.getTableStore();
    doSearchAction({}, store);
  };

  const getWfid = () => {
    if (ApplyStore.selectRowRecords && ApplyStore.selectRowRecords.length > 0) {
      return ApplyStore.selectRowRecords[0].wfid;
    }
    return '';
  };

  const getWfinst = () => {
    if (ApplyStore.selectRowRecords && ApplyStore.selectRowRecords.length > 0) {
      return ApplyStore.selectRowRecords[0].wfinst;
    }
    return '';
  };
  //>workflow end

  //<print begin
  function openUpload() {
    ApplyStore.uploadVisible = true;
  }

  function openPrint() {
    ApplyStore.printVisible = true;
  }

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onDetailPaginationChange = (current) => {
    applyDetailStore.setPageNo(current);
  };

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onDetailPageSizeChange = (pageSize) => {
    applyDetailStore.setPageSize(pageSize);
  };

  //>print end

  //<e9 begin
  const openDak = () => {
    DapubStore.getDDaklist(ApplyStore.detailParams.dakid);
  };

  /**
   * 删除 组件
   * @param record
   * @param store
   * @returns
   */
  const deleteTableAction = (record, store) => {
    return (
      <EpsDeleteButton
        data={record}
        store={store}
        key={'common-delete' + record.id}
      />
    );
  };

  /**
   *  修改记录
   * @param {* User} record
   */
  const edit = (record, store) => {
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });
    if (record.userEnable === 0) {
      json.userEnable = 0;
    }
    if (record.userQyrq === null) {
      json.userQyrq = null;
    }
    if (record.userTyrq === null) {
      json.userTyrq = null;
    }

    json.whrid = userinfo.id;
    json.whr = userinfo.yhmc;
    json.whsj = moment();
    // ApplyStore.setEditRecord(record);
    ApplyStore.showEditForm('edit', json, store);
  };
  /**
   * 编辑组件
   * @param record
   * @param store
   * @returns
   */
  const editTableAction = (record, store) => {
    return (
      <EpsModalButton
        key={`approveEdit_${record.id}`}
        isIcon={true}
        store={store}
        params={{ jgmxid: record.id }}
        url="/perfortest/jcjg/sxjcjgLog"
        title="编辑"
        width={1200}
        height={400}
        name="详情"
        icon={<EditOutlined />}
      ></EpsModalButton>
    );
  };

  const [uploadVisible, setUploadVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [yjjs, setYjjs] = useState(false);
  const [sfjs, setSfjs] = useState(false);
  const [form] = Form.useForm();
  const [formjf] = Form.useForm();
  // 自定义功能按钮
  const customAction = (store, ids) => {
    return [
      <>
        <Form
          onFinish={(formData) => doSearchAction(formData, store)}
          layout={'inline'}
          form={form}
          initialValues={{ sw: 'W' }}
        >
          <Form.Item name="sw">
            <Select style={{ width: 120 }}>
              <Select.Option value="W">待我处理</Select.Option>
              <Select.Option value="H">我已处理</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="datebe">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType={'submit'}>
              查询
            </Button>
          </Form.Item>
        </Form>

        {/* {ApplyStore.spkj && <UploadReport />}*/}
        <EpsReportButton
          store={store}
          umid={umid}
          reportDataSetNames={['GRID']}
          baseQueryMethod={ApplyStore.url + '/queryForPage'}
          //datilQueryMethod={'/api/eps/control/main/jydcx/queryDetailForPage'}
          fields={defaultMainColumns}
          records={ApplyStore.selectRowRecords[0]}
          //datilfields={defaultDetailColumns}
        />
        <WflwButtons
          style={{ marginLeft: '10px' }}
          offset={[18, 0]}
          type={wflwType}
          wfid={getWfid()}
          wfinst={getWfinst()}
          onBeforeAction={onBeforeWfAction}
          onAfterAction={onAfterWfAction}
        />
        {/* <Button type="primary" onClick={() => showSxjction()} >四性检测</Button>

       {yjjs && <Button type="primary" onClick={() => showJstion()} >确认接收</Button>} */}
      </>,
    ];
  };

  const customActionjs = (store, ids) => {
    return [
      <>
        <Form
          onFinish={(formData) => doSearchAction(formData, store)}
          layout={'inline'}
          form={formjf}
          initialValues={{ sw: 'W' }}
        >
          <Form.Item name="sw">
            <Select style={{ width: 120 }}>
              <Select.Option value="W">待我处理</Select.Option>
              <Select.Option value="H">我已处理</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="datebe">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType={'submit'}>
              查询
            </Button>
          </Form.Item>
        </Form>

        {/* {ApplyStore.spkj && <UploadReport />}*/}
        <EpsReportButton
          store={store}
          umid={umid}
          reportDataSetNames={['GRID']}
          baseQueryMethod={ApplyStore.url + '/queryForPage'}
          //datilQueryMethod={'/api/eps/control/main/jydcx/queryDetailForPage'}
          fields={defaultMainColumns}
          records={ApplyStore.selectRowRecords[0]}
          //datilfields={defaultDetailColumns}
        />
        <WflwButtons
          style={{ marginLeft: '10px' }}
          offset={[18, 0]}
          type={wflwType}
          wfid={getWfid()}
          wfinst={getWfinst()}
          onBeforeAction={onBeforeWfAction}
          onAfterAction={onAfterWfAction}
        />
        {/* <Button type="primary" onClick={() => showSxjction()} >四性检测</Button>

       {yjjs && <Button type="primary" onClick={() => showJstion()} >确认接收</Button>} */}
      </>,
    ];
  };

  const doEditOk = () => {
    const store = ref.current?.getTableStore();
    doSearchAction({}, store);
  };
  /**
   * 响应删除事件
   * @param {*} id
   */
  const onDeleteAction = (id) => {};

  const doDownloadAction = (record) => {
    const params = {
      dakid: record.dakid,
      yhmc: userinfo.yhmc,
      dwmc: record.dwmc,
      id: record.id,
    };
    // //旧
    // GszxyjcxStore.xdownloadEEP(params);
    //新
    GszxyjcxStore.packEEP_2022(params);
  };

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
        {[
          ApplyStore.canWfDelete(record) && deleteTableAction(record, store),
          // ApplyStore.canWfEdit(record) &&
          // editTableAction(record, store),
          Print(text, record, index, store),
        ]}
        {yjjs && record.wpid === 'ZZZZ' && (
          <Button
            size="small"
            style={{ fontSize: '12px' }}
            type="primary"
            shape="circle"
            icon={<DownloadOutlined />}
            onClick={() => doDownloadAction(record)}
          />
        )}
      </>
    );
  };

  const tableProp: ITable = {
    disableAdd: true,
    tableSearch: false,
    disableEdit: editsj,
    disableDelete: true,
    disableCopy: true,
    rowSelection: {
      type: 'radio',
    },
  };

  const handleCancel = () => {
    setVisible(false);
    const tableStores = ref.current?.getTableStore();
    tableStores.findByKey('', 1, 50, {});
    ref.current?.clearTableRowClick();
  };

  const handleOk = () => {
    setVisible(false);
    const tableStores = ref.current?.getTableStore();
    tableStores.findByKey('', 1, 50, {});
    ref.current?.clearTableRowClick();
  };

  const checkSxjc = () => {
    let timer = null;
    let newpprogressValue = 0;
    if (timer == null) {
      timer = setInterval(() => {
        newpprogressValue = ZxyjStore.progressValue + 10;
        // 这里的算法很重要，进度条容器的宽度为 400px 所以这里除以400再乘100就能得到 1-100的百分比了。
        if (ZxyjStore.progressValue === 20) {
          ZxyjStore.setTmmer(newpprogressValue);
          //  await fetch.post(`/api/eps/control/main/gszxyjsqd/duoJc`, fd);
          ZxyjStore.xduoJc(recordsid).then(() => {
            clearInterval(timer);
          });
        } else if (ZxyjStore.progressValue === 75) {
          clearInterval(timer);
        } else if (ZxyjStore.progressValue === 100) {
          clearInterval(timer);
        } else {
          ZxyjStore.setTmmer(newpprogressValue);
        }
      }, 900);
    }
  };
  const jscheckSxjc = () => {
    let jstimer = null;
    let jsnewpprogressValue = 0;
    if (jstimer == null) {
      jstimer = setInterval(() => {
        jsnewpprogressValue = ZxyjStore.jsprogressValue + 10;
        // 这里的算法很重要，进度条容器的宽度为 400px 所以这里除以400再乘100就能得到 1-100的百分比了。
        if (ZxyjStore.jsprogressValue === 20) {
          ZxyjStore.setTmmerjs(jsnewpprogressValue);
          //  await fetch.post(`/api/eps/control/main/gszxyjsqd/duoJc`, fd);
          ZxyjStore.jsxduoJc(recordsid).then(() => {
            clearInterval(jstimer);
          });
        } else if (ZxyjStore.jsprogressValue === 75) {
          clearInterval(jstimer);
        } else if (ZxyjStore.jsprogressValue === 100) {
          clearInterval(jstimer);
        } else {
          ZxyjStore.setTmmerjs(jsnewpprogressValue);
        }
      }, 900);
    }
  };

  const onTabChange = (key) => {
    if (key == '2') {
      const rs = detailTableStore.selectedRowKeys;
      if (!rs || rs.length <= 0) {
        // IceNotification.info({
        //   message: formatMessage({ id: "e9.info.info" }),
        //   description: formatMessage({ id: "e9.info.selectOneOnly" }),
        // });

        notification.open({
          message: '提示',
          description: formatMessage({ id: 'e9.info.selectOneOnly' }),
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
        return;
      }

      ApplyStore.setDetailSelectRowKeys(
        detailTableStore.selectedRowKeys,
        detailTableStore.checkedRows,
      );
      //openDak();
    }
    if (key == '3') {
      if (!ApplyStore.detailRecordParams.daid[0]) {
        notification.open({
          message: '提示',
          description: formatMessage({ id: 'e9.info.selectOneOnly' }),
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
        return;
      }
    }
    console.log('e3333', ApplyStore.detailRecordParams);
    setTabkey(key);
  };

  const bottomAction = (store, rows) => {
    const applyDetailColumns = DapubStore.mainColumns;
    return useObserver(() => (
      <div className="detail-container">
        <Tabs
          type="line"
          style={{ height: '100%' }}
          hideAdd
          activeKey={tabkey}
          // onEdit={onEdit}
          onChange={(key) => onTabChange(key)}
        >
          <TabPane
            key={1}
            tab={'条目明细'}
            style={{ height: '100%' }}
            closable={false}
          >
            <ApplyDetail
              setTableStore={(value) => {
                setDetailTableStore(value);
              }}
              jdlx={props.wfCode}
              approve={ApplyStore.spkj}
              columns={applyDetailColumns}
              fid={ApplyStore.fid}
              detailParams={ApplyStore.detailParams}
              spurl={props.spurl}
            />
          </TabPane>
          {/* 工程案卷或者案卷卷内 */}
          {ApplyStore.selectRowRecords &&
            ApplyStore.selectRowRecords.length &&
            DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid] &&
            ['02', '03', '0401', '04'].includes(
              DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid].daklx,
            ) && (
              <TabPane
                key={2}
                tab={
                  DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid]
                    .daklx == '04'
                    ? '工程案卷'
                    : '卷内'
                }
                style={{ height: '100%' }}
                closable={false}
              >
                <ArchDetail
                  key="archDetailAj"
                  onChangeRow={ApplyStore.archRecordsChangeRow}
                  setDakid={ApplyStore.setDakid}
                  archParams={{ fid: ApplyStore.detailParams.dakid, tmzt }}
                  fileCol
                  recordId={ApplyStore?.detailSelectRows[0]?.id}
                  jdlx={jdlx}
                />
              </TabPane>
            )}
          {ApplyStore.selectRowRecords &&
            ApplyStore.selectRowRecords.length &&
            DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid] &&
            ['04'].includes(
              DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid].daklx,
            ) && (
              <TabPane
                key={3}
                tab={'卷内'}
                style={{ height: '100%' }}
                closable={false}
              >
                <ArchDetail
                  key="archDetailJn"
                  archParams={{ fid: ApplyStore.ajDakid, tmzt }}
                  fileCol
                  recordId={ApplyStore.detailRecordParams?.daid}
                  jdlx={jdlx}
                />
              </TabPane>
            )}
        </Tabs>
      </div>
    ));
  };

  const span = 12;
  const _width = 240;
  const customForm = () => {
    return (
      <>
        <Row gutter={20}>
          <Col span={span}>
            <Form.Item label="交接工作名称:" name="title">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="内容描述:" name="nrms">
              <Input allowClear disabled={yjnrms} style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="移交电子档案数量:" name="dzdasl">
              <Input allowClear disabled={yjsl} style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="移交数据量:" name="sjl">
              <Input allowClear disabled={yjsjl} style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="载体起止顺序号:" name="ztqzxh">
              <Input allowClear disabled={yjqzh} style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="移交载体类型/规格:" name="ztlxgg">
              <Input allowClear disabled={yjlxgg} style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="移交单位:" name="dwmc">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="接收单位:" name="jsdwmc">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="准确性检测:" name="zsx">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="接收准确性检测:" name="jszsx">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="完整性检测:" name="qzx">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="接收完整性检测:" name="jswzx">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="可用性检测:" name="kyx">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="接收可用性检测:" name="jskyx">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="安全性检测:" name="aqx">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="接收安全性检测:" name="jsaqx">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="载体外观检验:" name="ztwgjc">
              <Input allowClear disabled={yjwg} style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="接收载体外观检验:" name="jsztwg">
              <Input allowClear disabled={jswg} style={{ width: _width }} />
            </Form.Item>
          </Col>
          {!sfjs && (
            <Col span={span}>
              <Form.Item label="填表人:" name="sqrmc">
                <Input disabled style={{ width: _width }} />
              </Form.Item>
            </Col>
          )}
          {sfjs && (
            <Col span={span}>
              <Form.Item label="填表人:" name="tbr">
                <Input disabled style={{ width: _width }} />
              </Form.Item>
            </Col>
          )}

          <Col span={span}>
            <Form.Item label="接收人:" name="jsr">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="移交审核人:" name="yjshr">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="接收审核人:" name="jsshr">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="移交审核时间:" name="yjshsj">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="接收审核时间:" name="jsshsj">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>

          <Col span={span}>
            <Form.Item label="wpid:" name="wpid" hidden>
              <Input name="wpid" disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
        </Row>
        {/* <Form.Item name="whrid" >
              <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
            </Form.Item> */}
      </>
    );
  };

  return (
    <>
      {sfjs && (
        <EpsRecordPanel
          customAction={customActionjs}
          customTableAction={customTableAction}
          tableProp={tableProp}
          //tableRowClick={onChangeRow}
          title={title}
          source={ApplyStore.columns}
          tableService={ApplyService}
          ref={ref}
          formWidth={900}
          bottomAction={bottomAction}
          onTabChange={onChangeRow}
          customForm={customForm}
          initParams={{ sw: 'W', wfinst }}
        />
      )}
      {!sfjs && (
        <EpsRecordPanel
          customAction={customAction}
          customTableAction={customTableAction}
          tableProp={tableProp}
          //tableRowClick={onChangeRow}
          title={title}
          source={ApplyStore.columns}
          tableService={ApplyService}
          ref={ref}
          formWidth={900}
          bottomAction={bottomAction}
          onTabChange={onChangeRow}
          customForm={customForm}
          initParams={{ sw: 'W', wfinst }}
        />
      )}
      <EditDailog ApplyStore={ApplyStore} doEditOk={doEditOk} />
      {sfjs && (
        <Modal
          title="四性检测"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          //footer={null}
          width="1300px"
        >
          <div id="app" className="main-page">
            <div className="banner">
              <div className="inner">
                <div className="bottom">
                  <div className="process">
                    <Progress
                      percent={ZxyjStore.jsprogressValue}
                      progressive
                      shape="circle"
                      size="large"
                    />
                  </div>
                  <div className="steps">
                    <li
                      className={
                        ZxyjStore.jsprogressValue > 10
                          ? 'first common on'
                          : 'first common'
                      }
                    >
                      <div className="node-d">
                        <span className="node">
                          <span className="el-icon-check"></span>
                        </span>
                        <img src="/api/eps/xsxjc/images/column-line.png"></img>
                        <span className="node-text">生成检测包</span>
                      </div>
                    </li>
                    <li
                      className={
                        ZxyjStore.jsprogressValue > 30
                          ? 'second common on'
                          : 'second common'
                      }
                    >
                      <div className="node-d">
                        <span className="node">
                          <span className="el-icon-check"></span>
                        </span>
                        <img src="/api/eps/xsxjc/images/column-line.png"></img>
                        <span className="node-text">检测中</span>
                      </div>
                    </li>
                    <li
                      className={
                        ZxyjStore.jsprogressValue > 80
                          ? 'third common on'
                          : 'third common'
                      }
                    >
                      <div className="node-d">
                        <span className="node">
                          <span className="el-icon-check"></span>
                        </span>
                        <img src="/api/eps/xsxjc/images/column-line.png"></img>
                        <span className="node-text">生成报告</span>
                      </div>
                    </li>
                    <li
                      className={
                        ZxyjStore.jsprogressValue === 100
                          ? 'fourth common on'
                          : 'fourth common'
                      }
                    >
                      <div className="node-d">
                        <span className="node">
                          <span className="el-icon-check"></span>
                        </span>
                        <img src="/api/eps/xsxjc/images/column-line.png"></img>
                        <span className="node-text">完成</span>
                      </div>
                    </li>
                  </div>
                  <div className="btn-group">
                    <Button
                      type="primary"
                      loading={false}
                      onClick={jscheckSxjc}
                      disabled={ZxyjStore.opt === 'edit'}
                    >
                      开始检测
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="list-content">
              <div className="correct">
                <p className="label-btn">提醒</p>
                {ZxyjStore.jczt && (
                  <div className="icon-style-demo">
                    <Icon
                      type="success"
                      style={{ color: '#1DC11D', marginRight: '10px' }}
                    />
                    <code style={{ color: '#1DC11D', marginRight: '10px' }}>
                      检测成功!
                    </code>
                  </div>
                )}
                {!ZxyjStore.jczt && (
                  <div className="icon-style-demo">
                    <code style={{ color: '#FF3333', marginRight: '10px' }}>
                      检测数量大可关闭界面,检测结束选择已填写的申请单继续完成步骤
                    </code>
                    <code style={{ color: '#FF3333', marginRight: '10px' }}>
                      {ZxyjStore.jcjg}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {!sfjs && (
        <Modal
          title="四性检测"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          //footer={null}
          width="1300px"
        >
          <div id="app" className="main-page">
            <div className="banner">
              <div className="inner">
                <div className="bottom">
                  <div className="process">
                    <Progress
                      percent={ZxyjStore.progressValue}
                      progressive
                      shape="circle"
                      size="large"
                    />
                  </div>
                  <div className="steps">
                    <li
                      className={
                        ZxyjStore.progressValue > 10
                          ? 'first common on'
                          : 'first common'
                      }
                    >
                      <div className="node-d">
                        <span className="node">
                          <span className="el-icon-check"></span>
                        </span>
                        <img src="/api/eps/xsxjc/images/column-line.png"></img>
                        <span className="node-text">生成检测包</span>
                      </div>
                    </li>
                    <li
                      className={
                        ZxyjStore.progressValue > 30
                          ? 'second common on'
                          : 'second common'
                      }
                    >
                      <div className="node-d">
                        <span className="node">
                          <span className="el-icon-check"></span>
                        </span>
                        <img src="/api/eps/xsxjc/images/column-line.png"></img>
                        <span className="node-text">检测中</span>
                      </div>
                    </li>
                    <li
                      className={
                        ZxyjStore.progressValue > 80
                          ? 'third common on'
                          : 'third common'
                      }
                    >
                      <div className="node-d">
                        <span className="node">
                          <span className="el-icon-check"></span>
                        </span>
                        <img src="/api/eps/xsxjc/images/column-line.png"></img>
                        <span className="node-text">生成报告</span>
                      </div>
                    </li>
                    <li
                      className={
                        ZxyjStore.progressValue === 100
                          ? 'fourth common on'
                          : 'fourth common'
                      }
                    >
                      <div className="node-d">
                        <span className="node">
                          <span className="el-icon-check"></span>
                        </span>
                        <img src="/api/eps/xsxjc/images/column-line.png"></img>
                        <span className="node-text">完成</span>
                      </div>
                    </li>
                  </div>
                  <div className="btn-group">
                    <Button
                      type="primary"
                      loading={false}
                      onClick={checkSxjc}
                      disabled={ZxyjStore.opt === 'edit'}
                    >
                      开始检测
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="list-content">
              <div className="correct">
                <p className="label-btn">提醒</p>
                {ZxyjStore.jczt && (
                  <div className="icon-style-demo">
                    <Icon
                      type="success"
                      style={{ color: '#1DC11D', marginRight: '10px' }}
                    />
                    <code style={{ color: '#1DC11D', marginRight: '10px' }}>
                      检测成功!
                    </code>
                  </div>
                )}
                {!ZxyjStore.jczt && (
                  <div className="icon-style-demo">
                    <code style={{ color: '#FF3333', marginRight: '10px' }}>
                      检测数量大可关闭界面,检测结束选择已填写的申请单继续完成步骤
                    </code>
                    <code style={{ color: '#FF3333', marginRight: '10px' }}>
                      {ZxyjStore.jcjg}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
});

export default TransferApply;

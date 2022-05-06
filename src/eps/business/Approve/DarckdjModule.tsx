import { useEffect, useState, useRef } from 'react';
import { observer, useObserver } from 'mobx-react';
import EpsRecordPanel from '@/eps/components/panel/EpsRecordPanel';
import { ITable, ITitle } from '@/eps/commons/declare';
import _ApplyService from './ApplyService';
import InspectionService from './ApplyDetailService';
import {
  Select,
  DatePicker,
  Space,
  Button,
  notification,
  Form,
  Tooltip,
  Tabs,
  TreeSelect,
  Input,
  InputNumber,
  Row,
  Col,
  Switch,
  Modal,
  message,
} from 'antd';
import _ApplyStore from './ApplyStore';
import { WflwButtons } from '@/components/Wflw';
const { RangePicker } = DatePicker;
import DapubStore from './DapubStore';
import applyDetailStore from './ApplyDetailStore';
import './index.less';
import WfdefStore from '@/stores/workflow/WfdefStore';
import Print from '@/pages/dagl/Yjsp/Print';
import UploadReport from '@/pages/dagl/Yjsp/UploadReport';
import NewDajyStore from '@/stores/daly/NewDajyStore';
import moment, { isMoment } from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import EpsDeleteButton from '@/eps/components/buttons/EpsDeleteButton';
import SysStore from '@/stores/system/SysStore';
import EditDailog from './EditDailog';
import { useIntl } from 'umi';
import ApplyDetail from './DarckdjModuleDetailNoToolbar';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import ArchDetail from './ArchDetail';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import ArchModuleAllEditButton from './ArchModuleAllEditButton';
import fetch from '../../../utils/fetch';
import EpsReportButton from '@/eps/components/buttons/EpsReportButton';
import { values } from 'mobx';
const { confirm } = Modal;
const { TabPane } = Tabs;
const { TextArea } = Input;
const title: ITitle = {
  name: '修改',
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
const DarckdjModule = observer((props) => {
  ApplyStore.setUrl(`/api/eps/control/main/${props.spurl}`);
  const ApplyService = new _ApplyService(
    `/api/eps/control/main/${props.spurl}`,
  );
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const [xhfk_visible, setXgfkVisible] = useState(false);
  const [jyRecords, setRecords] = useState({});
  // 审批默认列
  const defaultMainColumns = [
    {
      title: '出入库类型',
      code: 'lx',
      width: 100,
      render: (value) => {
        if (value === '1') {
          return '档案借阅';
        } else if (value === '2') {
          return '档案协查';
        } else if (value === '3') {
          return '实体出库单';
        } else if (value === '4') {
          return '查档审批';
        } else if (value === '5') {
          return '查档调卷';
        }
      },
    },
    {
      title: '单位名称',
      code: 'dwmc',
      width: 180,
    },
    {
      title: '所属部门',
      code: 'bm',
      width: 120,
    },
    {
      title: '出入库单号',
      code: 'id',
      width: 140,
    },
    {
      title: '查档人',
      code: 'jyr',
      width: 70,
    },
    {
      title: '申请人',
      code: 'yhmc',
      width: 70,
    },

    {
      title: '日期',
      code: 'sqrq',
      width: 110,
    },
    {
      title: '手机号',
      code: 'sj',
      width: 100,
    },
    {
      title: '电话',
      code: 'dh',
      width: 60,
    },
    {
      title: '邮箱',
      code: 'mail',
      width: 60,
    },
    {
      title: '已处理人',
      code: 'wfhandler',
      width: 60,
    },
    {
      title: '效果反馈',
      code: 'xgfk',
      width: 180,
    },
    {
      title: '查档价值',
      code: 'dajz',
      width: 100,
    },
  ];

  const tmzt = props.tmzt;
  const [detailTableStore, setDetailTableStore] = useState<EpsTableStore>(
    new EpsTableStore(props.tableService),
  );

  const defaultDetailColumns: any[] = [
    {
      code: 'mxspzt',
      align: 'center',
      title: '状态',
      width: '80px',
      render: (value) => {
        if (value === 0) {
          return '待出库';
        } else if (value === 1) {
          return '待领取';
        } else if (value === 2) {
          return '待归还';
        } else if (value === 3) {
          return '待入库';
        } else if (value === 9) {
          return '已入库';
        }
      },
    },
    {
      title: '题名',
      align: 'center',
      code: 'tm',
      width: 200,
    },
    {
      title: '档号',
      align: 'center',
      code: 'dh',
      width: 140,
    },
    {
      title: '盒号',
      align: 'center',
      code: 'hh',
      width: 140,
    },
    {
      title: '库位码',
      align: 'center',
      code: 'kwm',
      width: 140,
    },
    {
      title: '责任者',
      align: 'center',
      code: 'zrz',
      width: 100,
    },
    {
      title: '保管期限',
      align: 'center',
      code: 'bgqx',
      width: 80,
    },
    {
      title: '密级',
      align: 'center',
      code: 'mj',
      width: 60,
    },
    {
      title: '归档部门',
      align: 'center',
      code: 'gdbm',
      width: 140,
    },
    {
      title: '全宗号',
      align: 'center',
      code: 'qzh',
      width: 100,
    },
    {
      title: '全宗名称',
      align: 'center',
      code: 'qzmc',
      width: 140,
    },
    {
      title: '出库人员',
      align: 'center',
      code: 'ckry',
      width: 80,
    },
    {
      title: '出库时间',
      align: 'center',
      code: 'cksj',
      width: 120,
    },
    {
      title: '入库人员',
      align: 'center',
      code: 'rkry',
      width: 80,
    },
    {
      title: '入库时间',
      align: 'center',
      code: 'rksj',
      width: 120,
    },
    {
      title: '备注',
      align: 'center',
      code: 'bz',
      width: 140,
    },
  ];

  const {
    match: {
      params: { wfinst },
    },
  } = props;
  const [tabkey, setTabkey] = useState('1');
  const { columns } = props;
  const umid = props.umid;
  const jdlx = props.jdlx;

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   */
  const doSearchAction = (formData, tableStore) => {
    const {
      datebe,
      dwmc,
      bm,
      cx_jydh,
      cx_jyr,
      djlx,
      dj = 1,
      spzt = 1,
      isDj = 'Y',

      // sw = 'W',
    } = formData;
    const dateb = datebe && datebe[0];
    const datee = datebe && datebe[1];
    const params = { djlx };
    if (dateb && isMoment(dateb)) {
      params.cx_kssqrq = dateb.format('YYYY-MM-DD');
    }
    if (datee && isMoment(datee)) {
      //默认结束日期+1 天
      params.cx_jssqrq = moment(datee).add(1, 'days').format('YYYY-MM-DD');
    }
    if (dwmc) {
      params.dwid = dwmc;
    }
    if (bm) {
      params.bm = bm;
    }
    if (cx_jydh) {
      params.cx_jydh = cx_jydh;
    }
    if (cx_jyr) {
      params.cx_jyr = cx_jyr;
    }
    if (djlx) {
      params.djlx = djlx;
    }
    // if (lx) {
    //   //代表为出入库类型
    //   params.lx = lx;
    // }
    if (isDj) {
      //代表为出入库类型
      params.isDj = isDj;
    }
    if (spzt) {
      //代表为出入库类型
      params.spzt = spzt;
    }
    if (dj) {
      //代表为出入库类型
      params.dj = dj;
    }
    ApplyStore.setParams(params, true);
    tableStore.findByKey(tableStore.key, 1, tableStore.size, params);
  };
  const ref = useRef();

  const onChangeRow = (value, tableStore, records) => {
    setRecords(records[0]);
    const record = records[0];
    if (records && records.length > 0) {
      ApplyStore.setSelectRows(
        records.map((item) => item.id),
        records,
      );
      // const spkj = ApplyStore.ctrlWfVisile('P', record);

      // ApplyStore.setSpkj(spkj);
      // DapubStore.getDaklist(records[0].dakid, tmzt);
      setTabkey('1');
      ApplyStore.setDetailParams({
        zt: record.zt,
        wpid: record.wpid,
        fid: record.id,
        dakid: record.dakid,
        mbid: record.mbid,
        bmc: record.datbl,
        jylx: record.jylx,
        dj: 1,
      });
    }
  };

  useEffect(() => {
    WfdefStore.getPorcs(props.wfCode);
    ApplyStore.getProcOpts(props.wfCode);
    OptrightStore.getFuncRight(umid);
    ApplyStore.setColumns(columns || defaultMainColumns);
    NewDajyStore.findDw();
    NewDajyStore.findBm();
    NewDajyStore.querySjzdByLymd();
    NewDajyStore.querySjzdMc();
  }, [NewDajyStore.org_dw_id]);

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
    //判断状态为P时提交必须所有人明细都进行审批
    ApplyStore.checkAllApply();
    if (ApplyStore.selectRowRecords[0].zt == 'P' && !ApplyStore.allApply) {
      notification.open({
        message: '提示',
        description: '有未审批的的明记录，请进行审批!',
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
      return false;
    }
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
  const [treeValue, setTreeValue] = useState();

  const treeOnChange = (value) => {
    NewDajyStore.bm_id = value;

    setTreeValue(value);
  };
  const handleDwChange = (value) => {
    console.log('选中的值', value);
    NewDajyStore.dw_id = value;
    NewDajyStore.org_dw_id = value;
    // NewDajyStore.findBm();
    // form.setFieldsValue({
    //   bm: NewDajyStore.orgData
    // })
  };
  const [uploadVisible, setUploadVisible] = useState(false);
  const [form] = Form.useForm();
  const [xgfkForm] = Form.useForm();

  const showXgfk = async () => {
    var id = jyRecords.id;
    if (id) {
      if (jyRecords?.wpid === 'ZZZZ') {
        //将选中的数据赋值到xgfkForm下的xgfk/dajz 中
        xgfkForm.setFieldsValue({
          xgfk: jyRecords.xgfk,
          dajz: jyRecords.dajz,
        });
        setXgfkVisible(true);
      } else {
        message.warning({ type: 'warning', content: '抱歉,流程还未结束' });
      }
    } else {
      message.warning({ type: 'warning', content: '请选择条目信息' });
    }

    //else {
    // ZxyjStore.progressValue=0;
    // ZxyjStore.jczt=false;
    // ZxyjStore.opt="add";
    // ZxyjStore.jsprogressValue=0;

    // }
  };

  function showCk() {
    confirm({
      title: '确定出库吗?',
      icon: <ExclamationCircleOutlined />,
      okText: '出库',
      okType: 'danger',
      cancelText: '取消',
      onOk: ck,
      onCancel: handleCancel,
    });
  }
  const handleCancel = () => {
    console.log('Clicked cancel button');
  };
  function showRk() {
    confirm({
      title: '确定入库吗?',
      icon: <ExclamationCircleOutlined />,
      okText: '入库',
      okType: 'danger',
      cancelText: '取消',
      onOk: rk,
      onCancel: handleCancel,
    });
  }

  const updateDown = (value, tableStore, records) => {
    setRecords(records);
    const record = records;
    if (records) {
      ApplyStore.setSelectRows([records.id], [records]);
      // const spkj = ApplyStore.ctrlWfVisile('P', record);

      // ApplyStore.setSpkj(spkj);
      // DapubStore.getDaklist(records.dakid, tmzt);
      setTabkey('1');
      ApplyStore.setDetailParams({
        zt: record.zt,
        wpid: record.wpid,
        fid: record.id,
        dakid: record.dakid,
        mbid: record.mbid,
        bmc: record.datbl,
        jylx: record.jylx,
        lx: 1,
      });
    }
    //刷新detailTable明细数据
    detailTableStore.findByKey('', 1, 100, {
      fid: record.id,
      ...ApplyStore.detailParams,
    });
  };

  const ck = async (store, record, rows) => {
    var value = {};
    value.fid = jyRecords.id;
    value.spzt = 0;

    await NewDajyStore.queryJydmxForList(value);
    if (NewDajyStore.jydmxSpzt && NewDajyStore.jydmxSpzt.length !== 0) {
      if (jyRecords.id) {
        let value = {};
        value.id = jyRecords.id;
        value.spzt = 1;
        value.ckry = SysStore.getCurrentUser().yhmc;
        value.ckryid = SysStore.getCurrentUser().id;
        await NewDajyStore.updateJydMxSpztByJydIdAndZero(value);
        // const store = ref.current?.getTableStore();
        // await store.findByKey(store.key, 1, store.size, {
        //   spzt: '1',
        //   djlx: '1',
        //   isDj: 'Y'
        // });

        detailTableStore.findByKey;

        updateDown(value, store, jyRecords);
        // doSearchAction({}, store);
        // ref.current?.clearTableRowClick();
        message.success({ type: 'success', content: '出库成功!' });
      } else {
        message.error({ type: 'error', content: '请选择一条数据' });
      }
    } else {
      message.error({
        type: 'error',
        content: '该条数据不是待出库状态,请重试',
      });
    }
  };

  const rk = async (store, record, rows) => {
    var value = {};
    value.fid = jyRecords.id;
    value.spzt = 3;
    value.rkry = SysStore.getCurrentUser().yhmc;
    value.rkryid = SysStore.getCurrentUser().id;
    await NewDajyStore.queryJydmxForList(value);
    if (NewDajyStore.jydmxSpzt && NewDajyStore.jydmxSpzt.length !== 0) {
      if (jyRecords.id) {
        let value = {};
        value.id = jyRecords.id;
        value.spzt = 9;
        NewDajyStore.updateJydMxSpztByJydIdAndOne(value);
        const store = ref.current?.getTableStore();
        store.findByKey(store.key, 1, store.size, {
          spzt: '1',
          djlx: '1',
          isDj: 'Y',
        });
        // doSearchAction({}, store);
        ref.current?.clearTableRowClick();
        detailTableStore.findByKey;
        message.success({ type: 'success', content: '入库成功!' });
      } else {
        message.error({ type: 'error', content: '请选择一条数据' });
      }
    } else {
      message.error({
        type: 'error',
        content: '该条数据不是待入库状态,请重试',
      });
    }
  };

  // 自定义功能按钮
  const customAction = (store, record, rows) => {
    return [
      <>
        <Form
          onFinish={(formData) => doSearchAction(formData, store)}
          layout={'inline'}
          form={form}
        >
          <Form.Item name="djlx">
            {/*
            <Select placeholder="类型"
              style={{ width: 180 }}
              className="ant-select"
              options={NewDajyStore.lxdataSource} /> */}
            <Select style={{ width: 120 }} placeholder="登记类型" allowClear>
              <Select.Option value="1">档案借阅</Select.Option>
              <Select.Option value="2">档案协查</Select.Option>
              <Select.Option value="3">实体出库单</Select.Option>
              <Select.Option value="4">查档审批</Select.Option>
              <Select.Option value="5">查档调卷</Select.Option>
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
        {/* {ApplyStore.spkj && <UploadReport />} */}
        {/* <WflwButtons
          style={{ marginLeft: '10px'}}
          offset={[18, 0]}
          type={['submit', 'return', 'reject', 'logview']}
          wfid={getWfid()}
          wfinst={getWfinst()}
          onBeforeAction={onBeforeWfAction}
          onAfterAction={onAfterWfAction}
        /> */}
        &nbsp;
        {/* <Button type="primary" onClick={() => showXgfk(record, rows)} >效果反馈</Button>&nbsp; */}
        {/*  这个为按钮权限判断方法   OptrightStore.hasRight(umid, 'SYS101') */}
        {OptrightStore.hasRight(umid, 'SYS101') && (
          <Button type="primary" onClick={() => showCk(store, record, rows)}>
            出库
          </Button>
        )}
        &nbsp;
        {OptrightStore.hasRight(umid, 'SYS102') && (
          <Button type="primary" onClick={() => showRk(store, record, rows)}>
            {' '}
            入库
          </Button>
        )}
        &nbsp;
        {OptrightStore.hasRight(umid, 'SYS103') && (
          <EpsReportButton
            store={store}
            umid={umid}
            reportDataSetNames={['GRID_MASTER', 'GRID_SLAVE']}
            baseQueryMethod={'/api/eps/control/main/jydcx/queryForPage'}
            datilQueryMethod={'/api/eps/control/main/jydcx/queryDetailForPage'}
            fields={defaultMainColumns}
            records={jyRecords}
            datilfields={defaultDetailColumns}
          />
        )}
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
  const doDownloadAction = (record) => {
    const params = {
      dakid: record.dakid,
      // tmid: "DAIM202004031357510010",
      sqdwmc: record.dwmc,
      id: record.id,
      xtname: SysStore.xtname,
    };
    GszxyjcxStore.xdownloadEEP(params);
  };

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
        {[
          ApplyStore.canWfDelete(record) && deleteTableAction(record, store),
          Print(text, record, index, store),
        ]}

        {/* {[
          <Tooltip title="续借">
            <Button
              size="small"
              type="primary"
              shape="circle"
              icon={<ClockCircleOutlined />}
              onClick={() => doDownloadAction(record)}
            />
          </Tooltip>,
        ]} */}
        {/* {
          <Tooltip title="附件">
            <Button size="small" style={{ fontSize: '12px'}} type="primary" shape="circle" icon={<PaperClipOutlined />} onClick={() => doDownloadAction(record)} />
          </Tooltip>
        } */}
      </>
    );
  };

  const tableProp: ITable = {
    disableAdd: true,
    tableSearch: false,
    disableEdit: true,
    disableDelete: true,
    disableCopy: true,
    rowSelection: {
      type: 'radio',
    },
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
    setTabkey(key);
  };

  const operations = (
    <span style={{ padding: '20px' }}>
      <Space>
        {/* <ArchModuleAllEditButton
          key={'applybutton_sp'}
          column={[]}
          title={'批量审批'}
          isButton={true}
          refreshDetail={() => ApplyStore.refreshDetail()}
          data={{
            spr: SysStore.getCurrentUser().yhmc,
            sprid: SysStore.getCurrentUser().id,
            sprq: moment(),
            jdlx: jdlx,
            daid: detailTableStore.checkedRows
              .map((o) => {
                return o.tmid;
              })
              .join(','),
            kfjdmxid: detailTableStore.checkedRows
              .map((o) => {
                return o.id;
              })
              .join(','),
            zt: ApplyStore.detailParams.zt,
            wpid: ApplyStore.detailParams.wpid,
          }}
          customForm={customForm}
        /> */}
      </Space>
    </span>
  );

  const bottomAction = (store, rows) => {
    const applyDetailColumns = defaultDetailColumns.concat(
      DapubStore.mainColumns,
    );
    return useObserver(() => (
      <div className="detail-container">
        <Tabs
          type="line"
          style={{ height: '100%' }}
          hideAdd
          tabBarExtraContent={ApplyStore.spkj && operations}
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
              customForm={customForm}
              approveMark={props.approveMark || {}}
              jdlx={props.wfCode}
              approve={ApplyStore.spkj}
              //columns={ApplyStore.spspkj?defaultDetailColumns.concat(DapubStore.mainColumns):DapubStore.mainColumns}
              columns={defaultDetailColumns}
              fid={ApplyStore.fid}
              detailParams={ApplyStore.detailParams}
              spurl={props.spurl}
            />
          </TabPane>
          {ApplyStore.selectRowRecords &&
            ApplyStore.selectRowRecords.length &&
            DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid] &&
            ['02', '03', '0401'].includes(
              DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid].daklx,
            ) && (
              <TabPane
                key={2}
                tab={'卷内'}
                style={{ height: '100%' }}
                closable={false}
              >
                <ArchDetail
                  archParams={{ fid: ApplyStore.detailParams.dakid, tmzt }}
                  fileCol
                  recordId={ApplyStore?.detailSelectRows[0]?.daid}
                  jdlx={jdlx}
                />
              </TabPane>
            )}
        </Tabs>
      </div>
    ));
  };

  // const bottomAction = (store, record, rows) => {
  //   const applyDetailColumns = defaultDetailColumns.concat(DapubStore.mainColumns);
  //   //const applyDetailColumns = DapubStore.mainColumns;
  //   return useObserver(() => (
  //     <div className="detail-container">
  //       <Tabs
  //         type="line"
  //         style={{ height: '100%'}}
  //         hideAdd
  //         activeKey={tabkey}
  //         // onEdit={onEdit}
  //         onChange={(key) => onTabChange(key)}
  //       >
  //         <TabPane key={1} tab={'条目明细'} style={{ height: '100%'}} closable={false}>
  //           <ApplyDetail
  //             setTableStore={(value) => {
  //               setDetailTableStore(value);
  //             }}
  //             approveMark={props.approveMark || {}}
  //             jdlx={props.wfCode}
  //             approve={ApplyStore.spkj}
  //             columns={applyDetailColumns}
  //             fid={ApplyStore.fid}
  //             detailParams={ApplyStore.detailParams}
  //             spurl={props.spurl}
  //           />
  //         </TabPane>
  //         {ApplyStore.selectRowRecords &&
  //           ApplyStore.selectRowRecords.length &&
  //           DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid] &&
  //           ['02', '03', '0401'].includes(
  //             DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid].daklx,
  //           ) && (
  //             <TabPane key={2} tab={'卷内'} style={{ height: '100%'}} closable={false}>
  //               <ArchDetail
  //                 archParams={{ fid: ApplyStore.detailParams.dakid, tmzt }}
  //                 fileCol
  //                 recordId={ApplyStore?.detailSelectRows[0]?.daid}
  //                 jdlx={jdlx}
  //               />
  //             </TabPane>
  //           )}
  //       </Tabs>
  //     </div>
  //   ));
  // };

  const span = 12;
  const _width = 240;

  const customForm = () => {
    return (
      <>
        <Row gutter={20}>
          <Col span={span}>
            <Form.Item label="申请人:" name="yhmc">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="申请日期:" name="nrms">
              <Input allowClear disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="借阅天数:" name="jyts">
              <InputNumber min={1} max={100} style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="单位:" name="dwmc">
              <Input allowClear disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="部门:" name="bm">
              <Input allowClear disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="利用目的:" name="lymd">
              <Select
                style={{ width: 240 }}
                placeholder="请选择利用目的"
                options={NewDajyStore.lymdDataSelect}
              />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="借阅人岗位:" name="yhgw">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="借阅人密级:" name="yhlx">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="手机号:" name="sj">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="电话:" name="dh">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="邮箱:" name="mail">
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="借阅说明:" name="bz">
              <TextArea
                showCount
                maxLength={240}
                style={{ width: _width }}
                autoSize={{ minRows: 2, maxRows: 8 }}
              />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  /**
   * 修改效果反馈
   */
  const onPut_Xgfk = async (value) => {
    value.id = jyRecords.id;
    setXgfkVisible(false);

    NewDajyStore.updateXgfk(value);

    const store = ref.current?.getTableStore();
    store.findByKey(store.key, 1, store.size);
    doSearchAction({}, store);
    ref.current?.clearTableRowClick();
    message.success({ type: 'success', content: '修改成功!' });
    //props.store.findByKey(props.store.key, 1, props.store.size, props.store.params);
  };

  const searchFrom = () => {
    return (
      <>
        <Form.Item label="单位:" name="dwid">
          <TreeSelect
            style={{ width: 320 }}
            // defaultValue={RoleStore.dw_id}
            treeData={NewDajyStore.dwTreeData}
            placeholder="请选择单位"
            treeDefaultExpandAll
            allowClear
            onChange={handleDwChange}
            treeNodeFilterProp="title"
          />
        </Form.Item>
        <Form.Item label="部门:" name="bm">
          <TreeSelect
            style={{ width: 320 }}
            //value={treeValue}
            treeData={NewDajyStore.orgData}
            placeholder="请选择部门"
            treeDefaultExpandAll
            allowClear
            treeNodeFilterProp="title"
            // onChange={treeOnChange}
          />
        </Form.Item>
        <Form.Item label="出入库单号:" name="cx_jydh">
          <Input
            style={{ width: 320 }}
            allowClear
            name="yhcode"
            placeholder="请输入借阅单号"
            //onChange={getyhCode}
          ></Input>
        </Form.Item>
        <Form.Item label="操作人:" name="cx_jyr">
          <Input
            style={{ width: 320 }}
            allowClear
            name="yhcode"
            placeholder="请输入操作人"
            //onChange={getyhCode}
          ></Input>
        </Form.Item>

        {/* <Form.Item label="出入库类型:" name="jylx">
          <Select placeholder="请选择出入库类型"
            style={{ width: 320 }}
            className="ant-select"
            allowClear
            options={NewDajyStore.lxdataSource} />
        </Form.Item> */}
      </>
    );
  };

  return (
    <>
      <EpsRecordPanel
        customAction={customAction}
        customTableAction={customTableAction}
        tableProp={tableProp}
        //tableRowClick={onChangeRow}
        title={title}
        source={ApplyStore.columns}
        tableService={ApplyService}
        ref={ref}
        bottomAction={bottomAction}
        onTabChange={onChangeRow}
        customForm={customForm}
        searchForm={searchFrom}
        formWidth={800}
        initParams={{ spzt: '1', djlx: '1', isDj: 'Y' }}
      />
      <EditDailog ApplyStore={ApplyStore} doEditOk={doEditOk} />

      <Modal
        title={<span className="m-title">效果反馈</span>}
        visible={xhfk_visible}
        onOk={() => {
          xgfkForm.validateFields().then((values) => {
            form.resetFields();
            onPut_Xgfk(values);
          });
        }}
        onCancel={() => setXgfkVisible(false)}
        width="30%"
        //style={{ top: 50 }}
      >
        <Form className="schedule-form" name="xgfkForm" form={xgfkForm}>
          <Form.Item label="效果反馈:" name="xgfk">
            <TextArea
              showCount
              maxLength={500}
              style={{ width: 600 }}
              autoSize={{ minRows: 5, maxRows: 8 }}
            />
          </Form.Item>
          <Form.Item label="查档价值:" name="dajz">
            <TextArea
              showCount
              maxLength={500}
              style={{ width: 600 }}
              autoSize={{ minRows: 5, maxRows: 8 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default DarckdjModule;

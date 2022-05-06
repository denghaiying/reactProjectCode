import { useEffect, useState, useRef } from 'react';
import { observer, useObserver } from 'mobx-react';
import EpsRecordPanel from '@/eps/components/panel/EpsRecordPanel';
import { ITable, ITitle } from '@/eps/commons/declare';
import _ApplyService from './ApplyService';
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
  Radio,
} from 'antd';
import _ApplyStore from './ApplyStore';
import { WflwButtons } from '@/components/Wflw';
const { RangePicker } = DatePicker;
import DapubStore from './DapubStore';
import applyDetailStore from './ApplyDetailStore';
import './index.less';
import WfdefStore from '@/stores/workflow/WfdefStore';
import UploadReport from '@/pages/dagl/Yjsp/UploadReport';
import NewDajyStore from '@/stores/daly/NewDajyStore';
import moment, { isMoment } from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import {
  EditOutlined,
  PaperClipOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import EpsDeleteButton from '@/eps/components/buttons/EpsDeleteButton';
import SysStore from '@/stores/system/SysStore';
import EditDailog from './EditDailog';
import { useIntl } from 'umi';
import ApplyDetail from './ArchModuleDetailNoToolbar';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import ArchDetail from './ArchDetail';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import ArchModuleAllEditButton from './ArchModuleAllEditButton';
import { useParams } from 'umi';
import fetch from '../../../utils/fetch';
import EpsReportButton from '@/eps/components/buttons/EpsReportButton';

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

const ArchModule = observer((props) => {
  const approveParams = useParams();
  const wfinst = approveParams.wfinst || '';
  ApplyStore.setUrl(`/api/eps/control/main/${props.spurl}`);
  const ApplyService = new _ApplyService(
    `/api/eps/control/main/${props.spurl}`,
  );
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const [xhfk_visible, setXgfkVisible] = useState(false);
  const [jyRecords, setRecords] = useState({});
  const [radio, setRadio] = useState(false);
  const [plxzqx, setPlxzqx] = useState(false);
  // 审批默认列
  const defaultMainColumns = [
    {
      title: formatMessage({ id: 'e9.dagl.yjsp.zt' }),
      code: 'wpid',
      width: 60,
      render: (value) => {
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
      title: '单位名称',
      code: 'dwmc',
      width: 180,
    },
    {
      title: '申请部门',
      code: 'bm',
      width: 150,
    },
    {
      title: '借阅单号',
      code: 'id',
      width: 160,
    },
    // {
    //   title: '借阅类型',
    //   code: 'jylx',
    //   width: 70,
    //   render: (value) => {
    //     if (value === 0) {
    //       return '实体借阅';
    //     } else {
    //       return '电子借阅';
    //     }
    //   },
    // },
    {
      title: '用户名称',
      code: 'yhmc',
      width: 90,
    },
    {
      title: '日期',
      code: 'sqrq',
      width: 130,
    },
    {
      title: '借阅天数',
      code: 'jyts',
      width: 70,
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
    // {
    //   title: '借阅人岗位',
    //   code: 'yhgw',
    //   width: 70,
    // },
    {
      title: '利用目的',
      code: 'lymd',
      width: 90,

      render: (value) => {
        if (NewDajyStore.lymdData) {
          var lymdData = NewDajyStore.lymdData;
          for (var i = 0; i < lymdData.length; i++) {
            if (lymdData[i].bh === value) {
              return lymdData[i].bh + '|' + lymdData[i].mc;
            }
          }
        }
      },
    },
    {
      title: '借阅人密级',
      code: 'yhlx',
      width: 80,
    },
    {
      title: '借阅说明',
      code: 'bz',
      width: 100,
    },
    // {
    //   title: '待处理人',
    //   code: 'wfawaiter',
    //   width: 60,
    // },
    {
      title: '已处理人',
      code: 'wfhandler',
      width: 70,
    },
    {
      title: '水印文字',
      code: 'sywz',
      width: 80,
    },
    {
      title: '效果反馈',
      code: 'xgfk',
      width: 100,
      render: (value) => {
        if (value == 0) {
          return '非常满意';
        } else if (value == 1) {
          return '满意';
        } else if (value == 2) {
          return '基本满意';
        } else if (value == 3) {
          return '不满意';
        } else {
          return ' ';
        }
      },
    },
    {
      title: '改善建议',
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
      code: 'mxck',
      align: 'center',
      title: '查看',
      width: 60,

      render: (value, record) => {
        console.log('record', record);
        return record.dzjy === 'Y' ? (
          value === 'Y' ? (
            <font color="green">是</font>
          ) : (
            <font color="red">否</font>
          )
        ) : (
          ''
        );
      },
    },
    {
      title: '打印',
      code: 'mxdy',
      align: 'center',
      width: 60,
      render: (value, record) => {
        return record.dzjy === 'Y' ? (
          value === 'Y' ? (
            <font color="green">是</font>
          ) : (
            <font color="red">否</font>
          )
        ) : (
          ''
        );
      },
    },
    {
      title: '下载',
      code: 'mxxz',
      align: 'center',
      width: 60,
      render: (value, record) => {
        return record.dzjy === 'Y' ? (
          value === 'Y' ? (
            <font color="green">是</font>
          ) : (
            <font color="red">否</font>
          )
        ) : (
          ''
        );
      },
    },

    {
      title: '电子借阅',
      align: 'center',
      code: 'dzjy',
      width: 70,
      render: (value) => {
        return value === 'Y' ? (
          <font color="green">是</font>
        ) : (
          <font color="red">否</font>
        );
      },
    },

    {
      title: '实体借阅',
      align: 'center',
      code: 'stjy',
      width: 70,
      render: (value) => {
        return value === 'Y' ? (
          <font color="green">是</font>
        ) : (
          <font color="red">否</font>
        );
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
      width: 100,
    },
    {
      title: '库位码',
      align: 'center',
      code: 'kwm',
      width: 140,
    },
    {
      title: '成文日期',
      align: 'center',
      code: 'cwrq',
      width: 90,
    },
    {
      title: '页数',
      align: 'center',
      code: 'ys',
      width: 50,
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
      width: 70,
    },
    {
      title: '密级',
      align: 'center',
      code: 'mj',
      width: 50,
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
      title: '备注',
      align: 'center',
      code: 'bz',
      width: 60,
    },
  ];

  // const {
  //   match: {
  //     params: { wfinst },
  //   },
  // } = props;

  console.log('wfinst+++++wfinst', wfinst);
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
      jylx,
      sw = 'W',
      newdjlx = '1',
    } = formData;
    const dateb = datebe && datebe[0];
    const datee = datebe && datebe[1];
    const params = { sw };
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
    // if (jylx) {
    //   params.jylx = jylx;
    // }
    if (newdjlx) {
      params.newdjlx = newdjlx;
    }
    ApplyStore.setParams(params, true);
    tableStore.findByKey(tableStore.key, 1, tableStore.size, params);
  };
  const ref = useRef();

  const onChangeRow = async (value, tableStore, records) => {
    setRecords(records[0]);
    const record = records[0];
    if (records && records.length > 0) {
      const spkj = ApplyStore.ctrlWfVisile('P', record);
      const fjkj = ApplyStore.ctrlWfVisile('F', record);
      ApplyStore.setFjkj(fjkj);
      ApplyStore.setSpkj(spkj);
      let dqsj = new Date(record.sqrq);
      dqsj.setDate(dqsj.getDate() + record.jyts);
      if (dqsj != null && dqsj != '') {
        const today = new Date();
        if (dqsj.getTime() > today.getTime()) {
          ApplyStore.setFjkj(true);
        } else {
          ApplyStore.setFjkj(false);
        }
      }
      if (record.wpid == 'ZZZZ' && record.xz == 'Y' && ApplyStore.fjkj) {
        setPlxzqx(true);
      } else {
        setPlxzqx(false);
      }
      ApplyStore.setSelectRows(
        records.map((item) => item.id),
        records,
      );
      setTabkey('1');
      ApplyStore.setDetailParams({
        zt: record.zt,
        wpid: record.wpid,
        fid: record.id,
        dakid: record.dakid,
        // mbid: jndak.data.mbid,
        // bmc: jndak.data.mbc,
        // jylx: record.jylx,
        fjs: record.fjs,
      });
    }
  };

  useEffect(() => {
    WfdefStore.getPorcs(props.wfCode);
    ApplyStore.getProcOpts(props.wfCode);
    OptrightStore.getFuncRight(umid);
    // field.setValues({
    //   dateb: moment().startOf("month"),
    //   datee: moment().endOf("month"),
    //   sw: "W",
    // });
    ApplyStore.setColumns(columns || defaultMainColumns);
    NewDajyStore.findDw();
    NewDajyStore.findBm();
    NewDajyStore.querySjzdByLymd();
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
        // 将选中的数据赋值到xgfkForm下的xgfk/dajz 中
        xgfkForm.setFieldsValue({
          xgfk: jyRecords.xgfk == undefined ? '0' : jyRecords.xgfk,
          dajz: jyRecords.dajz,
        });
        if (!xgfkForm.getFieldValue('dajz')) {
          xgfkForm.validateFields();
          setRadio(false);
        }
        setXgfkVisible(true);
      } else {
        message.warning({ type: 'warning', content: '抱歉,流程还未结束' });
      }
    } else {
      message.warning({ type: 'warning', content: '请选择条目信息' });
    }
  };

  // 自定义功能按钮
  const customAction = (
    store,
    record,
    rows,
    control: { editEnable: false },
  ) => {
    return [
      <>
        <Form
          onFinish={(formData) => doSearchAction(formData, store)}
          layout={'inline'}
          form={form}
          initialValues={{
            // datebe: [moment().startOf("month"), moment().endOf("month")],
            sw: 'W',
          }}
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
          reportDataSetNames={['GRID_MASTER', 'GRID_SLAVE']}
          baseQueryMethod={'/api/eps/control/main/jydcx/queryForPage'}
          datilQueryMethod={'/api/eps/control/main/jydcx/queryDetailForPage'}
          fields={defaultMainColumns}
          records={jyRecords}
          datilfields={defaultDetailColumns}
        />
        <WflwButtons
          style={{ marginLeft: '10px' }}
          offset={[18, 0]}
          type={['submit', 'return', 'reject', 'logview']}
          wfid={getWfid()}
          wfinst={getWfinst()}
          onBeforeAction={onBeforeWfAction}
          onAfterAction={onAfterWfAction}
        />
        &nbsp;
        <Button type="primary" onClick={() => showXgfk(record, rows)}>
          效果反馈
        </Button>
        &nbsp;
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
          record.wpid !== 'ZZZZ' &&
            ApplyStore.canWfDelete(record) &&
            deleteTableAction(record, store),
          record.wpid !== 'ZZZZ',
        ]}

        {[
          record.wpid !== 'ZZZZ' && (
            <Tooltip title="续借">
              <Button
                size="small"
                type="primary"
                shape="circle"
                icon={<ClockCircleOutlined />}
                // onClick={() => doDownloadAction(record)} // 2021.12.17 续借？？？？
              />
            </Tooltip>
          ),
        ]}
        {/* {
          <Tooltip title="附件">
            <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<PaperClipOutlined />} onClick={() => doDownloadAction(record)} />
          </Tooltip>
        } */}
      </>
    );
  };
  const tableProp: ITable = {
    disableAdd: true,
    tableSearch: false,
    disableEdit: false,
    disableDelete: true,
    disableCopy: true,
    editBtnControl: (record) => {
      return record.wpid !== 'ZZZZ';
    },
    delBtnControl: (record) => {
      return record.wpid !== 'ZZZZ';
    },

    rowSelection: {
      type: 'radio',
    },
  };

  const onTabChange = (key) => {
    console.log(' detailTableStore.checkedRows', detailTableStore.checkedRows);
    if (key == '2') {
      const rs = detailTableStore.selectedRowKeys;
      if (!rs || rs.length <= 0) {
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

  const refsh = (fid) => {
    detailTableStore.findByKey('', 1, detailTableStore.size, {
      fid: fid ? fid : ApplyStore.fid,
      ...ApplyStore.detailParams,
    });
  };

  const clearTableRowClickmx = () => {
    detailTableStore.setCheckedRows([]);
    detailTableStore.setSelectedRowKeys([]);
  };

  const plfzdownload = (record) => {
    var rowmx = NewDajyStore.hangData;
    var str = 0;
    var jydmxjson = {};
    var params = {};
    if (rowmx.length > 0) {
      for (var i = 0; i < rowmx.length; i++) {
        if (rowmx[i].mxxz == 'N' || rowmx[i].dzjy != 'Y') {
          message.warning('正在为您筛选有下载权限的数据！');
          rowmx.remove(rowmx[i]);
          i--;
        } else {
          jydmxjson[rowmx[i].tmid] = rowmx[i].dakid;
          params = {
            jydid: rowmx[i].jydid,
            dakid: rowmx[i].dakid,
            jydmxjson: jydmxjson,
          };
        }
        if (rowmx.length == 0) {
          return message.error('您选择的数据没有下载权限');
        }
      }
      ApplyStore.plxzdownload(params).then((res) => {
        if (res != undefined) {
          return message.success('批量下载成功');
        } else {
          return message.error('下载数据有问题');
        }
      });
    } else {
      message.error('请选择一条明细');
      return;
    }
  };

  const operations = (
    <span style={{ padding: '20px' }}>
      {/* 这里 */}
      <Space>
        {ApplyStore.spkj && (
          <ArchModuleAllEditButton
            clearTableRowClickmx={clearTableRowClickmx}
            key={'applybutton_sp'}
            column={[]}
            title={'批量审批'}
            isButton={true}
            jyRecord={jyRecords}
            // refreshDetail={() => ApplyStore.refreshDetail()}
            refreshDetail={refsh}
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
              jydmxid: detailTableStore.checkedRows
                .map((o) => {
                  return o.id;
                })
                .join(','),
              zt: ApplyStore.detailParams.zt,
              wpid: ApplyStore.detailParams.wpid,
            }}
            customForm={customForm}
            // fid={ApplyStore.fid}
          />
        )}
        ,
        {plxzqx && (
          <Button onClick={plfzdownload} type="primary">
            批量下载
          </Button>
        )}
      </Space>
    </span>
  );

  const bottomAction = (store, rows, record) => {
    return useObserver(() => (
      <div className="detail-container">
        <Tabs
          type="line"
          style={{ height: '100%' }}
          hideAdd
          tabBarExtraContent={operations}
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
              clearTableRowClick={() => ref.current?.clearTableRowClick()}
              setTableStore={(value) => {
                setDetailTableStore(value);
              }}
              customForm={customForm}
              approveMark={props.approveMark || {}}
              jdlx={props.wfCode}
              approve={ApplyStore.spkj}
              appfjkj={ApplyStore.fjkj}
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
            <Form.Item label="申请日期:" name="sqrq">
              <Input allowClear disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="借阅天数:" name="jyts">
              <InputNumber min={1} max={100} style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="申请单位:" name="dwmc">
              <Input allowClear disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="申请部门:" name="bm">
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
    store.findByKey(store.key, 1, store.size, { sw: 'W' });
    doSearchAction({}, store);
    ref.current?.clearTableRowClick();
    message.success({ type: 'success', content: '提交成功!' });
    //props.store.findByKey(props.store.key, 1, props.store.size, props.store.params);
  };

  const changeRadio = (record) => {
    if (record.target.checked == true && record.target.value == '3') {
      setRadio(true);
      xgfkForm.validateFields();
    } else {
      setRadio(false);
    }
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
        <Form.Item label="借阅单号:" name="cx_jydh">
          <Input
            style={{ width: 320 }}
            allowClear
            name="yhcode"
            placeholder="请输入借阅单号"
            //onChange={getyhCode}
          ></Input>
        </Form.Item>
        <Form.Item label="借阅人:" name="cx_jyr">
          <Input
            style={{ width: 320 }}
            allowClear
            name="yhcode"
            placeholder="请输入借阅人"
            //onChange={getyhCode}
          ></Input>
        </Form.Item>
      </>
    );
  };

  return (
    <>
      <EpsRecordPanel
        customAction={customAction}
        customTableAction={customTableAction}
        tableProp={tableProp}
        // tableRowClick={onChangeRow}
        title={title}
        source={ApplyStore.columns}
        tableService={ApplyService}
        ref={ref}
        clearTableRowClick={() => ref.current?.clearTableRowClick()}
        bottomAction={bottomAction}
        onTabChange={onChangeRow}
        customForm={customForm}
        searchForm={searchFrom}
        formWidth={800}
        initParams={{ newdjlx: '1', wfinst }}
      />
      <EditDailog ApplyStore={ApplyStore} doEditOk={doEditOk} />

      <Modal
        title={<span className="m-title">效果反馈</span>}
        visible={xhfk_visible}
        onOk={() => {
          xgfkForm.validateFields().then((values) => {
            values.dajz = values.dajz == undefined ? '' : values.dajz;
            values.xgfk = values.xgfk == undefined ? '0' : values.xgfk;
            form.resetFields();
            onPut_Xgfk(values).then(() => {
              setRecords({});
              ApplyStore.fid = '';
            });
          });
        }}
        onCancel={() => setXgfkVisible(false)}
        width="30%"
        //style={{ top: 50 }}
      >
        <Form className="schedule-form" name="xgfkForm" form={xgfkForm}>
          <Form.Item label="效果反馈:" name="xgfk" dependencies={['dajz']}>
            <Radio.Group value="0">
              <Radio value="0" onChange={changeRadio}>
                非常满意
              </Radio>
              <Radio value="1" onChange={changeRadio}>
                满意
              </Radio>
              <Radio value="2" onChange={changeRadio}>
                基本满意
              </Radio>
              <Radio value="3" onChange={changeRadio}>
                不满意
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="改善建议:"
            name="dajz"
            dependencies={['xgfk']}
            rules={[
              {
                async validator(_, value) {
                  if (radio) {
                    if (!value) {
                      return Promise.reject(new Error('请输入改善建议'));
                    } else {
                      return;
                    }
                  }
                },
              },
            ]}
          >
            <TextArea
              showCount
              maxLength={500}
              style={{ width: '95%' }}
              autoSize={{ minRows: 5, maxRows: 8 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default ArchModule;

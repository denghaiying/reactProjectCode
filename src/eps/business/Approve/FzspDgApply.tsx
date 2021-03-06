import React, { useEffect, useState, useRef } from 'react';
import {observer, useLocalStore, useObserver} from 'mobx-react';
import EpsRecordPanel from '@/eps/components/panel/EpsRecordPanel';
import {EpsSource, ITable, ITitle} from '@/eps/commons/declare';
import { DownloadOutlined } from '@ant-design/icons';
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
  Input,
  Radio, TreeSelect, message, Modal,
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
import ApplyEditButton from './ApplyEditButton';
import TextArea from 'antd/lib/input/TextArea';
import { useParams } from 'umi';
import GszxyjcxStore from '@/stores/dagsyj/GszxyjcxStore';
import EpsFormType from "@/eps/commons/EpsFormType";
import fetch from "@/utils/fetch";
import NewDajyStore from "@/stores/daly/NewDajyStore";
import FzpsApplyDetail from "@/eps/business/Approve/Fzps";
import {IUpload} from "@/eps/components/upload/EpsUpload";
import KpService from "@/pages/fzps/ps/kp/service/KpService";
import Xsjqx from "@/pages/base/sjqx/Xsjqx";
import RoleStore from "@/stores/system/RoleStore";
import FzpsZj_bak from "@/eps/business/Approve/Fzps/FzpsZj_bak";
import FzpsZj from "@/eps/business/Approve/Fzps/FzpsZj";

const { TabPane } = Tabs;

const title: ITitle = {
  name: '??????',
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

const FzspDgApply = observer((props) => {
  /* ????????????????????????
    */
  const yhmc = SysStore.getCurrentUser().yhmc

  /**
   * ??????????????????ID
   */
  const yhid = SysStore.getCurrentUser().id
  /**
   * ??????????????????
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const approveParams = useParams();
  const wfinst = approveParams.wfinst || '';
  ApplyStore.setUrl(`/api/eps/control/main/${props.spurl}`);
  // ApplyStore.setUrl(`/api/eps/control/main/fzpsfj`);


  const FzspStore = useLocalStore(() => ({


    dwTreeData: [],

    dwData:[],

    fzpsid:'',

    fzpsmc:'',


    async queryForListByYhid() {
      const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid`);
      if (response.status === 200) {
        if (response.data.length > 0) {
          this.dwData = response.data;
        }
      }
    },


    async querydwTree() {
      const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid_ReactTree`);
      if (response.status === 200) {
        var sjData = [];
        if (response.data.length > 0) {
          for (var i = 0; i < response.data.length; i++) {
            let newKey = {};
            newKey = response.data[i];
            newKey.key = newKey.id
            newKey.title = newKey.mc
            sjData.push(newKey)
          }
          this.dwTreeData = sjData;
        }
      }
    },

  }));

  console.log('approveParams', approveParams);
  ApplyStore.setUrl(`/api/eps/control/main/${props.spurl}`);

  const ApplyService = new _ApplyService(
    `/api/eps/control/main/${props.spurl}`,
  );
  const intl = useIntl();
  const formatMessage = intl.formatMessage;

  const [jyRecords, setRecords] = useState({});

  const [modalVisit, setModalVisit]= useState(false);

  const [zjVisit, setZjVisit]= useState(true);



  // ???????????????
  const defaultMainColumns = [
    {
      title: formatMessage({ id: 'e9.dagl.yjsp.zt' }),
      code: 'wpid',
      width: 100,
      align: 'center',
      render: (value) => {
        if (value === 'ZZZY') {
          return '??????';
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
      title: '????????????',
      code: 'dw',
      align: 'center',
      width: 250,
      ellipsis: true,         // ???????????????????????????
      formType: EpsFormType.Input,
      render:function(value){
        let list=FzspStore.dwData;
        let mc = list.filter(ite => {
          return ite.id === value
        })
        return (<>{mc[0]?.mc}</>)
      },
    },
    {
      title: "????????????",
      code: "fzmc",
      align: 'center',
      ellipsis: true,         // ???????????????????????????
      formType: EpsFormType.Input

    }, {
      title: "??????",
      code: 'bz',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input
    }, {
      title: "??????",
      code: 'zb',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input
    }, {
      title: "?????????",
      code: 'fzb',
      ellipsis: true,         // ???????????????????????????
      align: 'center',
      width:200,
      formType: EpsFormType.Input
    },
    {
      title: "?????????",
      code: 'publisher',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '?????????',
      code: 'yjr',
      align: 'center',
      width: 100,
    },
    {
      title: '????????????',
      code: 'date',
      align: 'center',
      width: 130,
    },
    {
      title: formatMessage({ id: 'e9.wflw.pub.wfawaiter' }),
      code: 'wfawaiter',
      width: 100,
      align: 'center',
    },
  ];
  const tmzt = props.tmzt;
  const [detailTableStore, setDetailTableStore] = useState<EpsTableStore>(
    new EpsTableStore(props.tableService),
  );
  //?????????
  const defaultDetailColumns: any[] = [
    {
      code: 'FZPS',
      align: 'center',
      title: '????????????',
      width: '150px',
      render: (value, record, index) => (
        <Space size={8}>
          <span>
            {props?.approveMark?.agree || '??????'}
            <span style={{ color: '#f50' }}>({record.kfs})</span>
          </span>
          <span>
            {props?.approveMark?.disAgree || '?????????'}
            <span style={{ color: '#2db7f5' }}>({record.bkfs})</span>
          </span>
        </Space>
      ),
      // ="#f50">??????{record.kfs}</Tag>
      // <Tag color="#2db7f5
    },
  ];
  //const wfinst = approveParams.wfinst || '';
  const [tabkey, setTabkey] = useState('1');
  const { columns } = props;
  const umid = props.umid;
  const jdlx = props.jdlx;

  // begin ******************** ?????????????????????
  /**
   * ??????????????????????????????
   */
  const doSearchAction = (formData, tableStore) => {
    const {
      datebe,
      sw = 'W',
      dwmc,
      fzmc,
      status = '5',
    } = formData;
    const dateb = datebe && datebe[0];
    const datee = datebe && datebe[1];
    const params = { sw,status};
    if (dateb && isMoment(dateb)) {
      params.dateb = dateb.format('YYYY-MM-DD');
    }
    if (datee && isMoment(datee)) {
      params.datee = datee.format('YYYY-MM-DD');
    }
    if (dwmc) {
      params.dwmc = dwmc;
    }
    if (fzmc) {
      params.fzmc = fzmc;
    }
    ApplyStore.setParams(params, true);
    tableStore.findByKey(tableStore.key, 1, tableStore.size, params);
  };
  const ref = useRef();

  const onChangeRow = (value, tableStore, records) => {
    setRecords(records[0]);
    const record = records[0];
    debugger;
    if (records && records.length > 0) {
      ApplyStore.setSelectRows(
        records.map((item) => item.id),
        records,
      );
      const spkj = ApplyStore.ctrlWfVisile('P', record);
      debugger
      console.log("spkj=====",spkj);
      ApplyStore.setSpkj(spkj);
      //  DapubStore.getDaklist(records[0].dakid, tmzt);
      if(record.spzt === 'P'){
        setZjVisit(false);
      }else{
        setZjVisit(true);
      }

      setTabkey('1');
      ApplyStore.setDetailParams({
        zt: record.zt,
        wpid: record.wpid,
        fid: record.id,
        // dakid: record.dakid,
        // mbid: record.mbid,
        // bmc: record.datbl,
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
    FzspStore.querydwTree();
    FzspStore.queryForListByYhid();
  }, []);

  //<workdlofbegin
  const onBeforeWfAction = async (action) => {
    debugger
    if (
      !ApplyStore.selectRowRecords ||
      ApplyStore.selectRowRecords.length !== 1
    ) {
      notification.open({
        message: '??????',
        description: '?????????????????????',
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
      return false;
    }
    //???????????????P?????????????????????????????????????????????

    if (
      ApplyStore.selectRowRecords[0].zt == 'P' &&
      !ApplyStore.checkAllApply()
    ) {
      notification.open({
        message: '??????',
        description: '????????????????????????????????????????????????!',
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
      return false;
    }
    return true;
  };


  const refsh = (fid) => {
    detailTableStore.findByKey('', 1, detailTableStore.size, {
      fid: fid ? fid : ApplyStore.fid,
      ...ApplyStore.detailParams,
    });
  };

  const onAfterWfAction = (data) => {
    //  ApplyStore.queryForPage();
    //   ref.current?.clearTableRowClick();
    //   ApplyStore.setSelectRows('', []);
    const store = ref.current?.getTableStore();
    doSearchAction({}, store);
    ApplyStore.fid = '';
    ApplyStore.setDetailSelectRowKeys([], []);
    ApplyStore.setDetailParams({
      zt: '',
      wpid: '',
      fid: '',
    });

    setZjVisit(true);

    //  refsh();
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
   * ????????????????????????
   * @param {*} current
   */
  const onDetailPaginationChange = (current) => {
    applyDetailStore.setPageNo(current);
  };

  /**
   * ?????????????????????????????????????????????
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
   * ?????? ??????
   * @param record
   * @param store
   * @returns
   */
  const deleteTableAction = (record, store) => {
    return (
      <EpsDeleteButton
        // deleteMessage={
        //   '????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????'
        // }
        data={record}
        store={store}
        key={'common-delete' + record.id}
      />
    );
  };

  /**
   *  ????????????
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
   * ????????????
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
        title="??????"
        width={1200}
        height={400}
        name="??????"
        icon={<EditOutlined />}
      ></EpsModalButton>
    );
  };

  const onButtonClick = (val) => {
    if (
      !ApplyStore.selectRowRecords ||
      ApplyStore.selectRowRecords.length !== 1
    ) {
      notification.open({
        message: '??????',
        description: '?????????????????????',
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    } else {
      // childStore.roleid=val[0].id;
      // childStore.modalVisit=true;
      const app=ApplyStore.selectRowRecords[0];
      console.log(" FzspStore.fzpsid", FzspStore.fzpsid);
      FzspStore.fzpsid=app.id;
      FzspStore.fzpsmc=app.fzmc;
      setModalVisit(true);
    }
  }

  const [form] = Form.useForm();
  // ?????????????????????
  const customAction = (store, rows, ids: any[]) => {
    console.log(store,"-======",rows,"-======",ids);
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
              <Select.Option value="W">????????????</Select.Option>
              <Select.Option value="H">????????????</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="datebe">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType={'submit'}>
              ??????
            </Button>
          </Form.Item>
        </Form>
        <Button type="primary" hidden={zjVisit} onClick={() => onButtonClick(ids)}>????????????</Button>
        {/*<UploadReport />*/}
        {/*{ApplyStore.spkj  && <Button type="primary" onClick={() => onButtonClick(ids)}>????????????</Button>}*/}
        <WflwButtons
          style={{ marginLeft: '10px' }}
          offset={[18, 0]}
          type={['submit', 'return', 'reject', 'logview']}
          wfid={getWfid()}
          wfinst={getWfinst()}
          onBeforeAction={onBeforeWfAction}
          onAfterAction={onAfterWfAction}
        />
      </>,
    ];
  };

  const doEditOk = () => {
    const store = ref.current?.getTableStore();
    doSearchAction({}, store);
  };

  const doDownloadAction = (record) => {
    debugger;
    const params = {
      dakid: record.dakid,
      // tmid: "DAIM202004031357510010",
      sqdwmc: record.dwmc,
      id: record.id,
      xtname: SysStore.xtname,
    };
    console.log('dodownloan', params);
    GszxyjcxStore.xdownloadEEP(params);
  };


  /**
   * ????????????prop
   */
  const uploadProp: IUpload = {
    disableUpload: false, // ????????????
    disableBigUpload: true, // ?????????????????????
    disableDown: false, // ????????????
    disableYwDown: true, // ????????????
    disableViewDoc: true, // ??????
    disableYwViewDoc: true, // ????????????
    //  uploadUrl: '/api/eps/control/main/fzpsfj/upload', // ??????url??????
    uploadUrl: '/api/eps/wdgl/attachdoc/uploadFzps', // ??????url??????
    doctbl: 'FZPSFJ', // ????????????
    grptbl: 'FZPSDOCGROUP', // ??????????????????
    wrkTbl: 'FZPS', // ????????????
    // dakid: dakid,
    dw: SysStore.getCurrentCmp().id, // ????????????ID
    umId: 'FZPS003',
  };

  // ??????????????????
  const uploadtableProp: ITable = {
    disableEdit: true,
    disableAdd: true,
    disableCopy: true,
    tableSearch: false,
    labelColSpan: 8,
    rowSelection: {
      type: 'check',
    },
  };

  /**
   * ???????????? ??????source
   */
  const fjsource: EpsSource[] = [
    {
      title: '??????',
      code: 'title',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '?????????',
      code: 'filename',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '????????????',
      code: 'ext',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '????????????',
      code: 'fullsize',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '??????',
      code: 'desc',
      align: 'center',
      formType: EpsFormType.Input,
    },

  ];



  /**
   * ??????????????????
   * @param {*} id
   */
  const onDeleteAction = (id) => {};

  // ????????????????????????detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
        {[
          // ApplyStore.canWfDelete(record) && deleteTableAction(record, store),
          // ApplyStore.canWfEdit(record) &&
          // editTableAction(record, store),
          //  Print(text, record, index, store),
          //   <EpsUploadFzpsButton
          //     title={'????????????'} // ?????????????????????
          //     uploadProp={uploadProp} //????????????prop
          //     width={1250}
          //     source={fjsource}
          //     height={800}
          //     //  refesdata={refreshPage}
          //     grpid={record.filegrpid}
          //     fjs={record.fjs}
          //     params={{
          //       docTbl: 'FZPSFJ',
          //       docGrpTbl: 'FZPSDOCGROUP',
          //       grpid: record.filegrpid,
          //       docTblXt: 'FZPSFJ',
          //       idvs: JSON.stringify({ id: record.id }),
          //       wrkTbl: 'FZPS',
          //       lx: null,
          //       atdw: 'DEFAULT',
          //       tybz: 'N',
          //       whr: yhmc,
          //       whsj: getDate,
          //       fjsctrue: true,
          //
          //     }} //??????????????????
          //     tableProp={uploadtableProp} //????????????prop
          //     tableService={wdglAttachdocService} //????????????server
          //     tableparams={{
          //       doctbl: 'FZPSFJ',
          //       grptbl: 'FZPSDOCGROUP',
          //       grpid: record.filegrpid,
          //       sfzxbb: '1',
          //       lx: null,
          //       ordersql: 'N',
          //     }} //??????????????????
          //   />


        ]}
        {record.wpid === 'ZZZZ' && props.canDownloadAsip && (
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
          message: '??????',
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



  //??????form
  const customForm = () => {
    return (
      <>
        <Form.Item label="?????????" name="spr">
          <Input disabled style={{ width: 380 }} placeholder="" />
        </Form.Item>
        <Form.Item label="????????????" name="sprq">
          <DatePicker style={{ width: 380 }} showTime />
        </Form.Item>
        {
          <Form.Item label="??????" name="spzt">
            <Radio.Group defaultValue="a" buttonStyle="solid">
              <Radio.Button value="Y">
                {props.approveMark?.agree || '??????'}
              </Radio.Button>
              <Radio.Button value="N">
                {props.approveMark?.disAgree || '?????????'}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        }
        <Form.Item label="??????" name="remark">
          <TextArea rows={2} />
        </Form.Item>
      </>
    );
  };

  // const refsh = (fid) => {
  //   detailTableStore.findByKey('', 1, detailTableStore.size, {
  //     fid: fid ? fid : ApplyStore.fid,
  //     ...ApplyStore.detailParams,
  //   });
  // };

  const operations = (
    <span style={{ padding: '20px' }}>
      <Space>
        {/*<ApplyEditButton*/}
        {/*  key={'applybutton_sp'}*/}
        {/*  column={[]}*/}
        {/*  title={'????????????'}*/}
        {/*  isButton={true}*/}
        {/*  refreshDetail={refsh}*/}
        {/*  data={{*/}
        {/*    spr: SysStore.getCurrentUser().yhmc,*/}
        {/*    sprid: SysStore.getCurrentUser().id,*/}
        {/*    sprq: moment(),*/}
        {/*    jdlx: jdlx,*/}
        {/*    daid: detailTableStore.checkedRows*/}
        {/*      .map((o) => {*/}
        {/*        return o.daid;*/}
        {/*      })*/}
        {/*      .join(','),*/}
        {/*    kfjdmxid: detailTableStore.checkedRows*/}
        {/*      .map((o) => {*/}
        {/*        return o.id;*/}
        {/*      })*/}
        {/*      .join(','),*/}
        {/*    zt: ApplyStore.detailParams.zt,*/}
        {/*    wpid: ApplyStore.detailParams.wpid,*/}
        {/*  }}*/}
        {/*  customForm={customForm}*/}
        {/*/>*/}
        {/*<ApplyEditButton*/}
        {/*  key={'applybutton_all'}*/}
        {/*  column={[]}*/}
        {/*  title={'????????????'}*/}
        {/*  isButton={true}*/}
        {/*  allSelect={true}*/}
        {/*  fid={ApplyStore.selectRowKeys[0]}*/}
        {/*  refreshDetail={refsh}*/}
        {/*  data={{*/}
        {/*    spr: SysStore.getCurrentUser().yhmc,*/}
        {/*    sprid: SysStore.getCurrentUser().id,*/}
        {/*    sprq: moment(),*/}
        {/*    jdlx: jdlx,*/}

        {/*    daid: detailTableStore.checkedRows*/}
        {/*      .map((o) => {*/}
        {/*        return o.daid;*/}
        {/*      })*/}
        {/*      .join(','),*/}
        {/*    kfjdmxid: detailTableStore.checkedRows*/}
        {/*      .map((o) => {*/}
        {/*        return o.id;*/}
        {/*      })*/}
        {/*      .join(','),*/}
        {/*    zt: ApplyStore.detailParams.zt,*/}
        {/*    wpid: ApplyStore.detailParams.wpid,*/}
        {/*  }}*/}
        {/*  customForm={customForm}*/}
        {/*/>*/}
      </Space>
    </span>
  );

  const bottomAction = (store, rows) => {
    // const applyDetailColumns = defaultDetailColumns.concat(
    //   DapubStore.mainColumns,
    // );
    // const allDetailApplyColumns = [
    //   {
    //     title: '????????????',
    //     code: 'spjg',
    //     align: 'center',
    //     width: 100,
    //     render: function (value) {
    //       return value == 'Y'
    //         ? props?.approveMark?.agree || '??????'
    //         : value == 'N'
    //         ? props?.approveMark?.disAgree || '?????????'
    //         : '';
    //     },
    //   },
    // ].concat(DapubStore.mainColumns);
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
            tab={'??????'}
            style={{ height: '100%' }}
            closable={false}
          >
            {/*<ApplyDetail*/}
            {/*  setTableStore={(value) => {*/}
            {/*    setDetailTableStore(value);*/}
            {/*  }}*/}
            {/*  customForm={customForm}*/}
            {/*  approveMark={props.approveMark || {}}*/}
            {/*  jdlx={props.jdlx}*/}
            {/*  approve={ApplyStore.spkj}*/}
            {/*  canWfDelete={ApplyStore.canWfDelete()}*/}
            {/*  // columns={*/}
            {/*  //   ApplyStore.spkj ? applyDetailColumns : allDetailApplyColumns*/}
            {/*  // }*/}
            {/*  columns={defaultDetailColumns}*/}
            {/*  fid={ApplyStore.fid}*/}
            {/*  detailParams={ApplyStore.detailParams}*/}
            {/*  spurl={props.spurl}*/}
            {/*/>*/}


            <FzpsApplyDetail
              setTableStore={(value) => {
                setDetailTableStore(value);
              }}
              customForm={customForm}
              approveMark={props.approveMark || {}}
              jdlx={props.jdlx}
              approve={ApplyStore.spkj}
              canWfDelete={ApplyStore.canWfDelete()}
              // columns={
              //   ApplyStore.spkj ? applyDetailColumns : allDetailApplyColumns
              // }
              columns={defaultDetailColumns}
              fid={ApplyStore.selectRowKeys[0]}
              detailParams={ApplyStore.detailParams}
              spurl={props.spurl}
            />
          </TabPane>
          {/*{ApplyStore.selectRowRecords &&*/}
          {/*  ApplyStore.selectRowRecords.length &&*/}
          {/*  DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid] &&*/}
          {/*  ['04'].includes(*/}
          {/*    DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid].daklx,*/}
          {/*  ) && (*/}
          {/*    <TabPane*/}
          {/*      key={3}*/}
          {/*      tab={'????????????'}*/}
          {/*      style={{ height: '100%' }}*/}
          {/*      closable={false}*/}
          {/*    >*/}
          {/*      <ArchDetail*/}
          {/*        archParams={{ fid: ApplyStore.detailParams.dakid, tmzt }}*/}
          {/*        fileCol*/}
          {/*        recordId={ApplyStore?.detailSelectRows[0]?.daid}*/}
          {/*        jdlx={jdlx}*/}
          {/*      />*/}
          {/*    </TabPane>*/}
          {/*  )}*/}
          {/*{ApplyStore.selectRowRecords &&*/}
          {/*  ApplyStore.selectRowRecords.length &&*/}
          {/*  DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid] &&*/}
          {/*  ['02', '03', '0401', '04'].includes(*/}
          {/*    DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid].daklx,*/}
          {/*  ) && (*/}
          {/*    <TabPane*/}
          {/*      key={2}*/}
          {/*      tab={'??????'}*/}
          {/*      style={{ height: '100%' }}*/}
          {/*      closable={false}*/}
          {/*    >*/}
          {/*      <ArchDetail*/}
          {/*        archParams={{ fid: ApplyStore.detailParams.dakid, tmzt }}*/}
          {/*        fileCol*/}
          {/*        recordId={ApplyStore?.detailSelectRows[0]?.daid}*/}
          {/*        jdlx={jdlx}*/}
          {/*      />*/}
          {/*    </TabPane>*/}
          {/*  )}*/}
        </Tabs>
      </div>
    ));
  };

  const searchFrom = () => {
    return (
      <>
        <Form.Item label="??????:" name="dwmc">
          <TreeSelect
            style={{ width: 320 }}
            // defaultValue={RoleStore.dw_id}
            treeData={NewDajyStore.dwTreeData}
            placeholder="???????????????"
            treeDefaultExpandAll
            allowClear

            treeNodeFilterProp="title"
          />
        </Form.Item>

        <Form.Item label="????????????:" name="fzmc">
          <Input
            style={{ width: 320 }}
            allowClear
            name="yhcode"
            placeholder="?????????????????????"
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
        //    customTableAction={customTableAction}
        tableProp={tableProp}
        initParams={{ status:'5',wfinst }}
        //tableRowClick={onChangeRow}
        title={title}
        source={ApplyStore.columns}
        tableService={ApplyService}
        ref={ref}
        bottomAction={bottomAction}
        searchForm={searchFrom}
        onTabChange={onChangeRow}
      />
      <EditDailog ApplyStore={ApplyStore} doEditOk={doEditOk} />

      <Modal
        title= "????????????"
        visible={modalVisit}
        width={900}
        style={{height: (window.innerHeight - 300) + 'px'}}
        //    style={{maxHeight: (props.height || modalHeight) + 'px', height: (props.height || modalHeight) + 'px'}}
        footer={null}
        onCancel={() => setModalVisit(false)}
        onOk={() => setModalVisit(false)}
      >
        <FzpsZj fzpsid={FzspStore.fzpsid} fzpsmc={FzspStore.fzpsmc}/>
      </Modal>
    </>
  );
});

export default FzspDgApply;

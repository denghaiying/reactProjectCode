/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-restricted-syntax */
import {
  Input,
  Table,
  Tabs,
  message,
  Button,
  Modal,
  Form,
  Spin,
  Tooltip,
  Drawer,
  Upload,
  FormInstance,
  Space,
  Col,
  Row,
  InputNumber,
} from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';
import {
  UploadOutlined,
  SaveOutlined,
  DownloadOutlined,
  ProfileOutlined,
  PlusOutlined,
  PaperClipOutlined,
  ToolOutlined,
  YoutubeOutlined,
  SoundOutlined,
  InteractionOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  EpsTableProps,
  EpsSource,
  TableColumn,
  ITable,
} from '@/eps/commons/declare';
import EpsForm from '@/eps/inner/form/EpsForm';
import EpsFormType from '@/eps/commons/EpsFormType';
import moment from 'moment';
import { runInAction, values } from 'mobx';
import './index.less';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import { ITableService } from '@/eps/commons/panel';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import SysStore from '@/stores/system/SysStore';
import fetch from '@/utils/fetch';
import cookie from 'react-cookies';
import HttpRequest from '@/eps/commons/HttpRequest';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import form from 'antd/lib/form';
const { confirm } = Modal;

const getDate = moment().format('YYYY-MM-DD HH:mm:ss');
const yhmc = SysStore.getCurrentUser().yhmc;
const yhid = SysStore.getCurrentUser().yhid;

export interface IProps {
  sjgrpid: any;
  intableparams: any;
  Uploadparams: any;
  getMkregSync();
  getMkregMediaSync();
  mediamkreg: string;
  lmtmkreg: string;
  getGnregOfdViewSync();
  getGnregOfdMaskSync();
  getGnregOfdConvertSync();
  ofdViewGnreg: boolean;
  ofdMaskGnreg: boolean;
  ofdConvertGnreg: boolean;
  initGrpid(props: any);
  convert(val: any);
  mediaTwo(values: any, second: any);
  mediaSpilit(begin: any, end: any);
  mediaConcat(val: any);
  column: EpsSource[];
  title: string;
  width?: number;
  uploadProp?: IUpload; // ??????????????????
  customForm?: Function;
  source: EpsSource[];
  tableProp: ITable;
  params: {};
  tableService: ITableService;
  customTableAction?: Function;
  tableparams: {};
  grpid: string;
  mj: string;
  tmzt: string;
  daktmid: string;
}

export interface ITable {
  size?: SizeType; // ????????????
  rowSelection?: unknown; // ???????????????
  disableEdit?: boolean; // ??????????????????
  disableDelete?: boolean; // ??????????????????
  disableIndex?: boolean; // ?????????????????????
  disableAdd?: boolean; // ??????????????????
  tableSearch?: boolean; // ?????????????????????
  searchCode?: string; // ????????????
  refreshTree?: boolean; // ???????????????????????????????????????????????????
  disableCopy?: boolean; // ????????????????????????
  enableBatchDelete?: boolean; // ????????????????????????
  deleteMessage?: string; // ?????????????????????
  labelColSpan?: number; // ?????????????????????????????????????????????6
  onAddClick?: (form: FormInstance) => void; // ?????????????????????
  onEditClick?: (form: FormInstance, data: Record<string, any>) => void;
  onSearchClick?: (form: FormInstance, store: EpsTableStore) => void;
  onDeleteClick?: (data?: Record<string, unknown>) => boolean;
}

export interface IUpload {
  disableUpload?: Boolean; // ??????????????????
  disableBigUpload?: Boolean; // ???????????????????????????
  disableDown?: Boolean; // ??????????????????
  disableYwDown?: Boolean; // ????????????????????????
  disableViewDoc?: Boolean; // ??????????????????
  disableYwViewDoc?: Boolean; // ????????????????????????
  disableScanner?: Boolean;
  disableOfdmask?: Boolean;
  disableOfdview?: Boolean;
  disableConvertFiles?: Boolean; //?????????????????????
  uploadUrl: string;
  doctbl: string;
  grptbl: string;
  wktbl: string;
  dw: string;
  aprint: string;
  adown: string;
  wrkTbl: string;
  grpid: string;
  mj: string;
  umId: string;
  dakid: string;
  tmzt: string;
  daktmid: string;
}

const EpsUpload = observer((props, refs) => {
  const ref = useRef();
  const tableparams = props.tableparams;
  const [formTwo] = Form.useForm();
  const [formSpilit] = Form.useForm();
  console.log('Epsuploadprops', props);

  const initstore: IProps = useLocalObservable(() => ({
    modalHeight: window.innerHeight - 330,
    intableparams: {},
    sjgrpid: '',
    Uploadparams: {},
    lmtmkreg: '',
    mediamkreg: '',
    ofdViewGnreg: false,
    ofdMaskGnreg: false,
    ofdConvertGnreg: false,
    async initGrpid(props) {
      var xgrid;
      if (!props.grpid) {
        let url = '/api/eps/wdgl/attachdoc/getGuid';
        const response = await fetch.get(url, {});
        xgrid = response.data.message;
      } else {
        xgrid = props.grpid;
      }
      runInAction(() => {
        initstore.sjgrpid = xgrid;
        initstore.intableparams = props.tableparams;
        initstore.Uploadparams = props.params;
        initstore.intableparams.grpid = xgrid;
        initstore.Uploadparams.grpid = xgrid;
      });
    },

    async getMkregSync() {
      const response = await fetch.get(
        `/api/eps/control/main/getMkReg?mkbh=LMT`,
      );
      if (response.status === 200) {
        if (response.data) {
          this.lmtmkreg = response.data.message;
        }
      }
    },

    async getMkregMediaSync() {
      const response = await fetch.get(
        `/api/eps/control/main/getMkReg?mkbh=MEDIA`,
      );
      if (response.status === 200) {
        if (response.data) {
          //  this.mediamkreg = response.data.message;
          this.mediamkreg = 'Y';
          console.log('this.mediamkreg', this.mediamkreg);
        }
      }
    },

    async getGnregOfdViewSync() {
      const response = await fetch.get(
        `/api/eps/control/main/getGnsReg?gnids=OFD001`,
      );

      if (response.status === 200) {
        if (response.data) {
          this.ofdViewGnreg = response.data.OFD001;
        }
      }
    },

    async getGnregOfdMaskSync() {
      const response = await fetch.get(
        `/api/eps/control/main/getGnsReg?gnids=OFD002`,
      );
      if (response.status === 200) {
        if (response.data) {
          this.ofdMaskGnreg = response.data.OFD002;
        }
      }
    },

    async getGnregOfdConvertSync() {
      const response = await fetch.get(
        `/api/eps/control/main/getGnsReg?gnids=OFD003`,
      );
      if (response.status === 200) {
        if (response.data) {
          this.ofdConvertGnreg = response.data.OFD003;
        }
      }
    },

    async convert(val) {
      const aaaa = val[0];
      const list = [];
      const info = {
        doctbl: aaaa.doctbl,
        dqwz: aaaa.dqwz,
        ext: aaaa.ext,
        fhid: aaaa.fhid,
        fileid: aaaa.fileid,
        filename: aaaa.filename,
        fjbh: aaaa.fjbh,
        fjs: aaaa.fjs,
        fullsize: aaaa.fullsize,
        gn: aaaa.gn,
        grpid: aaaa.grpid,
        grptbl: props.uploadProp.grptbl,
        gsmc: aaaa.gsmc,
        id: aaaa.id,
        mc: aaaa.mc,
        mim: aaaa.mim,
        mj: aaaa.mj,
        ms: aaaa.ms,
        qmgz: aaaa.qmgz,
        qmjg: aaaa.qmjg,
        qmr: aaaa.qmr,
        qmsj: aaaa.qmsj,
        rjhjxx: aaaa.rjhjxx,
        rtdir: aaaa.rtdir,
        sfzxbb: aaaa.sfzxbb,
        size: aaaa.size,
        title: aaaa.title,
        tmid: aaaa.tmid,
        tybz: aaaa.tybz,
        whr: aaaa.whr,
        whsj: aaaa.whsj,
        wktbl: aaaa.wktbl,
        xtmc: aaaa.xtmc,
        yjhjxx: aaaa.yjhjxx,
        yys: aaaa.yys,
        daktmid: props.daktmid,
        bb: props.uploadProp.dakid,
        bz: props.tmzt,
        dw: props.uploadProp.dw,
        umid: props.uploadProp.umId,
        yhid: SysStore.getCurrentUser().id,
        yhbh: SysStore.getCurrentUser().bh,
        yhmc: SysStore.getCurrentUser().yhmc,
      };
      list.push(info);

      const response = await new HttpRequest('').post({
        url: `/api/eps/control/main/cqbcwjzh/wjzhButton`,
        params: info,
      });

      if (response && response.status === 200) {
        if (response.data.success === false) {
          message.error(`????????????!`);
        } else {
          if (response.data.message !== '') {
            if (response.data.message === '????????????') {
              message.success(`????????????!`);
            } else {
              message.error(response.data.message);
            }
          } else {
            message.error(`????????????!`);
          }
        }
      }
    },
    //????????????
    async mediaSpilit(begin, end) {
      const res = await fetch.post(
        `/api/eps/wdgl/attachdoc/queryForList?grptbl=${props.uploadProp.grptbl}&doctbl=${props.uploadProp.doctbl}&fileid=${props.tableProp.rowSelection.selectedRowKeys}&filegrpid=${props.grpid}`,
      );
      const aaaa = res.data[0];
      const list = [];
      var a = { id: props.daktmid };
      const info = {
        filegrpid: props.grpid,
        doctbl: props.uploadProp.doctbl,
        dqwz: aaaa.dqwz,
        ext: aaaa.ext,
        fhid: aaaa.fhid,
        fileid: aaaa.fileid,
        filename: aaaa.filename,
        fjbh: aaaa.fjbh,
        // fjs: aaaa.fjs,
        fullsize: aaaa.fullsize,
        gn: aaaa.gn,
        grpid: props.grpid,
        grptbl: props.uploadProp.grptbl,
        gsmc: aaaa.gsmc,
        id: aaaa.id,
        mc: aaaa.mc,
        mim: aaaa.mim,
        mj: aaaa.mj,
        // ms: aaaa.ms,
        qmgz: aaaa.qmgz,
        qmjg: aaaa.qmjg,
        qmr: aaaa.qmr,
        qmsj: aaaa.qmsj,
        rjhjxx: aaaa.rjhjxx,
        rtdir: aaaa.rtdir,
        sfzxbb: aaaa.sfzxbb,
        title: aaaa.title,
        tmid: aaaa.tmid,
        tybz: aaaa.tybz,
        whr: aaaa.whr,
        whsj: aaaa.whsj,
        wktbl: props.uploadProp.wrkTbl,
        xtmc: aaaa.xtmc,
        yjhjxx: aaaa.yjhjxx,
        yys: aaaa.yys,
        daktmid: props.daktmid,
        bb: props.uploadProp.dakid,
        bz: props.tmzt,
        dw: props.uploadProp.dw,
        umid: props.uploadProp.umId,
        yhid: SysStore.getCurrentUser().id,
        yhbh: SysStore.getCurrentUser().bh,
        yhmc: SysStore.getCurrentUser().yhmc,
        size: begin,
        fjs: end,
        idvs: JSON.stringify(a),
        ms: JSON.stringify(a),
      };
      list.push(info);

      const response = await new HttpRequest('').post({
        url: `/api/eps/wdgl/attachdoc/media/spilit`,
        params: info,
      });

      if (response && response.status === 200) {
        if (response.data.success === false) {
          message.error(`??????????????????!`);
        } else {
          if (response.data.message !== '') {
            if (response.data.message === '??????????????????!') {
              message.success(`??????????????????!`);
            } else {
              message.error(response.data.message);
            }
          } else {
            message.error(`??????????????????!`);
          }
        }
      }
    },

    //????????????
    async mediaTwo(val, size) {
      const res = await fetch.post(
        `/api/eps/wdgl/attachdoc/queryForList?grptbl=${props.uploadProp.grptbl}&doctbl=${props.uploadProp.doctbl}&fileid=${props.tableProp.rowSelection.selectedRowKeys}&filegrpid=${props.grpid}`,
      );

      const aaaa = res.data[0];
      const list = [];
      var a = { id: props.daktmid };
      const info = {
        filegrpid: props.grpid,
        doctbl: props.uploadProp.doctbl,
        dqwz: aaaa.dqwz,
        ext: aaaa.ext,
        fhid: aaaa.fhid,
        fileid: aaaa.fileid,
        filename: aaaa.filename,
        fjbh: aaaa.fjbh,
        fjs: aaaa.fjs,
        fullsize: aaaa.fullsize,
        gn: aaaa.gn,
        grpid: props.grpid,
        grptbl: props.uploadProp.grptbl,
        gsmc: aaaa.gsmc,
        id: aaaa.id,
        mc: aaaa.mc,
        mim: aaaa.mim,
        mj: aaaa.mj,
        // ms: aaaa.ms,
        qmgz: aaaa.qmgz,
        qmjg: aaaa.qmjg,
        qmr: aaaa.qmr,
        qmsj: aaaa.qmsj,
        rjhjxx: aaaa.rjhjxx,
        rtdir: aaaa.rtdir,
        sfzxbb: aaaa.sfzxbb,
        // size: aaaa.size,
        title: aaaa.title,
        tmid: aaaa.tmid,
        tybz: aaaa.tybz,
        whr: aaaa.whr,
        whsj: aaaa.whsj,
        wktbl: props.uploadProp.wrkTbl,
        xtmc: aaaa.xtmc,
        yjhjxx: aaaa.yjhjxx,
        yys: aaaa.yys,
        daktmid: props.daktmid,
        bb: props.uploadProp.dakid,
        bz: props.tmzt,
        dw: props.uploadProp.dw,
        umid: props.uploadProp.umId,
        yhid: SysStore.getCurrentUser().id,
        yhbh: SysStore.getCurrentUser().bh,
        yhmc: SysStore.getCurrentUser().yhmc,
        size: size,
        idvs: JSON.stringify(a),
        ms: JSON.stringify(a),
      };
      list.push(info);

      const response = await new HttpRequest('').post({
        url: `/api/eps/wdgl/attachdoc/media/spilitTwo`,
        params: info,
      });

      if (response && response.status === 200) {
        if (response.data.success === false) {
          message.error(`??????????????????!`);
        } else {
          if (response.data.message !== '') {
            if (response.data.message === '?????????????????????') {
              message.success(`??????????????????!`);
            } else {
              message.error(response.data.message);
            }
          } else {
            message.error(`??????????????????!`);
          }
        }
      }
    },

    //????????????
    async mediaConcat(val: any) {
      var a = { id: props.daktmid };
      debugger;
      const formData = new FormData();
      formData.append('aclist', JSON.stringify(val));
      formData.append('idvs', JSON.stringify(a));
      const response = await fetch.post(
        `/api/eps/wdgl/attachdoc/media/concat`,
        formData,
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            dataType: 'json',
          },
        },
      );

      if (response && response.status === 200) {
        if (response.data.success === false) {
          message.error(`??????????????????!?????????????????????????????????????????????`);
        } else {
          if (response.data.message !== '') {
            if (response.data.message === '??????????????????') {
              message.success(`??????????????????!`);
            } else {
              message.error(response.data.message);
            }
          } else {
            message.error(`??????????????????!?????????????????????????????????????????????`);
          }
        }
      }
    },
  }));

  // ??????????????????
  const enableUpload =
    props.uploadProp?.disableUpload === undefined
      ? false
      : !props.uploadProp?.disableUpload;
  const enableBigUpload =
    props.uploadProp?.disableBigUpload === undefined
      ? false
      : !props.uploadProp?.disableBigUpload;
  const enableDown =
    props.uploadProp?.disableDown === undefined
      ? false
      : !props.uploadProp?.disableDown;
  const enableYwDown =
    props.uploadProp?.disableYwDown === undefined
      ? false
      : !props.uploadProp?.disableYwDown;
  const enableViewDoc =
    props.uploadProp?.disableViewDoc === undefined
      ? false
      : !props.uploadProp?.disableViewDoc;
  const enableYwViewDoc =
    props.uploadProp?.disableYwViewDoc === undefined
      ? false
      : !props.uploadProp?.disableYwViewDoc;
  const enableScanner =
    props.uploadProp?.disableScanner === undefined
      ? false
      : !props.uploadProp?.disableScanner;
  const enableOfdmask =
    props.uploadProp?.disableOfdmask === undefined
      ? false
      : !props.uploadProp?.disableOfdmask;
  const enableOfdview =
    props.uploadProp?.disableOfdview === undefined
      ? false
      : !props.uploadProp?.disableOfdview;
  const enableConvertFiles =
    props.uploadProp?.disableConvertFiles === undefined
      ? false
      : !props.uploadProp?.disableConvertFiles;
  const enableMediaTwo =
    props.uploadProp?.disableMediaTwo === undefined
      ? false
      : !props.uploadProp?.disableMediaTwo;
  const enableMediaSpilit =
    props.uploadProp?.disableMediaSpilit === undefined
      ? false
      : !props.uploadProp?.disableMediaSpilit;
  const enableMediaConcat =
    props.uploadProp?.disableMediaConcat === undefined
      ? false
      : !props.uploadProp?.disableMediaConcat;

  const fjdyViewODC =
    props.uploadProp?.fjdyViewODC === undefined
      ? false
      : !props.uploadProp?.fjdyViewODC;

  const [lmtEnable, setLmtEnable] = useState(false);
  const [mediaEnable, setMediaEnable] = useState(true);
  const [showMediaTwo, setShowMediaTwo] = useState(false);
  const [showMediaSpilit, setShowMediaSpilit] = useState(false);
  const [showMediaSpilitOld, setShowMediaSpilitOld] = useState(false);
  const [selectRecord, setSelectRecord] = useState({});
  const [mediaTwoUrl, setMediaTwoUrl] = useState('');
  const [mediaSpilitUrl, setMediaSpilitUrl] = useState('');
  const [showMediaTwoOld, setShowMediaTwoOld] = useState(false);
  const [showOfdView, setShowOfdView] = useState(false);
  const [showOfdMask, setShowOfdMask] = useState(false);
  const [showOfdConvert, setShowOfdConvert] = useState(false);

  useEffect(() => {
    initstore.getMkregSync();
    initstore.getMkregMediaSync();
    initstore.getGnregOfdConvertSync();
    initstore.getGnregOfdMaskSync();
    initstore.getGnregOfdViewSync();
  }, []);

  const mediaShow = () => {
    const res = initstore.mediamkreg;
    // setMediaEnable(initstore.mediamkreg === 'Y');
    if (res === 'Y') {
      setMediaEnable(false);
    }
  };

  const ofdViewShow = () => {
    const res = initstore.ofdViewGnreg;
    setShowOfdView(res);
  };

  const ofdMaskShow = () => {
    const res = initstore.ofdMaskGnreg;
    setShowOfdMask(res);
  };

  const ofdConvertShow = () => {
    const res = initstore.ofdConvertGnreg;
    setShowOfdConvert(res);
  };

  const lmtShow = () => {
    //   const aa = initstore.lmtmkreg;
    //     if(aa ==='Y'){
    //       setLmtEnable(true);
    //     }else{
    //       setLmtEnable(false);
    //     }
    setLmtEnable(initstore.lmtmkreg === 'Y');
  };

  useEffect(() => {
    lmtShow();
    mediaShow();
    ofdViewShow();
    ofdMaskShow();
    ofdConvertShow();
  }, [
    initstore.lmtmkreg,
    initstore.mediamkreg,
    initstore.ofdViewGnreg,
    initstore.ofdMaskGnreg,
    initstore.ofdConvertGnreg,
  ]);

  useEffect(() => {
    let storeTable = ref.current?.getTableStore();
    if (storeTable && storeTable.findByKey) {
      storeTable.findByKey('', 1, storeTable.size, {
        ...initstore.intableparams,
        ...props.tableparams,
      });
    }
  }, [initstore.intableparams]);
  useEffect(() => {
    const init = async () => {
      initstore.initGrpid(props);
    };
    init();
  }, [props.grpid, props.params]);

  /**
   * ??????
   * @param val
   */
  const onDownClick = async (val) => {
    if (val.length == 0) {
      message.error('????????????,???????????????????????????');
    } else {
      var ulr =
        '/api/eps/wdgl/attachdoc/download?fileid=' +
        val[0].fileid +
        '&grpid=' +
        initstore.sjgrpid +
        '&doctbl=' +
        props.uploadProp.doctbl +
        '&grptbl=' +
        props.uploadProp.grptbl +
        '&atdw=' +
        props.uploadProp.dw +
        '&umid=' +
        props.uploadProp.umId +
        '&mkbh=' +
        null +
        '&downlx=01' +
        '&dakid=' +
        props.uploadProp.dakid +
        '&tmzt=' +
        props.tmzt +
        '&daktmid=' +
        props.daktmid +
        '&lylx=1&lymd=999&xz=Y';
      window.open(ulr);
    }
  };

  /**
   * ????????????
   * @param val
   */
  const onConvertClick = async (val) => {
    if (val.length != 1) {
      message.error('????????????,?????????????????????');
      return;
    } else {
      debugger;
      if (val[0].wjzh == '1') {
        message.error('???????????????????????????');
        return;
      } else {
        initstore.convert(val);
        //  const b =initstore.Uploadparams["docTblXt"];
        //   if(b === undefined){
        //     initstore.intableparams["doctbl"]=initstore.intableparams.wrkTbl+ "_FJ"
        //   }else{
        //     initstore.intableparams["doctbl"]=b;
        //   }
        ref.current
          ?.getTableStore()
          .findByKey('', 1, 50, initstore.intableparams);
      }
    }
  };

  /**
   * ????????????
   * @param val
   */
  const onYwDownClick = async (val) => {
    if (val.length == 0) {
      message.error('????????????,???????????????????????????');
    } else {
      var dowfilecont = 0;
      if (enableDown) {
        dowfilecont = 1;
      }
      var printfilecont = 0;
      if (fjdyViewODC) {
        printfilecont = 1;
      }
      var ulr =
        '/api/eps/wdgl/attachdoc/download?fileid=' +
        val[0].fileid +
        '&grpid=' +
        initstore.sjgrpid +
        '&doctbl=' +
        props.uploadProp.doctbl +
        '&printfile=' +
        printfilecont +
        '&downfile=' +
        dowfilecont +
        '&daktmid=' +
        props.daktmid +
        '&grptbl=' +
        props.uploadProp.grptbl +
        '&atdw=' +
        props.uploadProp.dw +
        '&umid=' +
        props.uploadProp.umId +
        '&mkbh=' +
        null +
        '&downlx=02' +
        '&dakid=' +
        props.uploadProp.dakid +
        '&tmzt=' +
        props.tmzt;
      window.open(ulr);
    }
  };
  /**
   * ???????????????
   * @param val
   */
  const onBigUpload = async (val) => {
    var a = { id: props.daktmid };
    var data = {
      wrkTbl: props.uploadProp.wrkTbl,
      docTbl: props.uploadProp.doctbl,
      docGrpTbl: props.uploadProp.grptbl,
      grpid: initstore.sjgrpid,
      tybz: 'N',
      atdw: props.uploadProp.dw,
      whr: yhmc,
      daktmid: props.daktmid,
      whsj: getDate,
      dakid: props.uploadProp.dakid,
      tmzt: props.tmzt,
      idvs: JSON.stringify(a),
      mj: props.mj,
    };
    localStorage.setItem('bigupdata', JSON.stringify(data));
    return true;
  };

  /**
   * ??????
   * @param val
   */
  const onViewDocClick = async (val) => {
    if (val.length != 1) {
      message.error('????????????,?????????????????????');
    } else {
      let url ='/api/eps/control/main/params/getUserOption?code=WDS003';
      const response = await fetch.get(url);
      var dowfilecont = 0;
      if (enableDown) {
        dowfilecont = 1;
      }
      var printfilecont = 0;
      if (fjdyViewODC) {
        printfilecont = 1;
      }
      if (response.data.message === 'Y') {
        if (
          val[0].ext.toLowerCase() == 'mp3' ||
          val[0].ext.toLowerCase() == 'mp4' ||
          val[0].ext.toLowerCase() == 'avi'
        ) {
          var pdfurl = encodeURIComponent(
            'http://' +
              location.hostname +
              ':' +
              location.port +
              '/api/eps/wdgl/attachdoc/download?fileid=' +
              val[0].fileid +
              '&daktmid=' +
              props.daktmid +
              '&grpid=' +
              initstore.sjgrpid +
              '&doctbl=' +
              props.uploadProp.doctbl +
              '&grptbl=' +
              props.uploadProp.grptbl +
              '&atdw=' +
              props.uploadProp.dw +
              '&umid=' +
              props.uploadProp.umId +
              '&mkbh=' +
              null +
              '&downlx=01&ext=.mp4' +
              '&tmzt=' +
              props.tmzt,
          );
          var dowfilecont = 0;
          if (enableDown) {
            dowfilecont = 1;
          }
          var printfilecont = 0;
          if (fjdyViewODC) {
            printfilecont = 1;
          }
          window.open(
            '/api/eps/control/main/app/lib/media/viewer.html?downfile=' +
              dowfilecont +
              '&printfile=' +
              printfilecont +
              '&file=' +
              pdfurl +
              '&filename=' +
              val[0].filename,
          );
          return;
        }
        const fext = val[0].ext;
        if (fext === 'ofd') {
          var pdfurl = encodeURIComponent(
            'http://' +
              location.hostname +
              ':' +
              location.port +
              '/api/eps/wdgl/attachdoc/OFDToPdf?fileid=' +
              val[0].fileid +
              '&grpid=' +
              initstore.sjgrpid +
              '&doctbl=' +
              props.uploadProp.doctbl +
              '&daktmid=' +
              props.daktmid +
              '&ext=' +
              val[0].ext +
              '&grptbl= ' +
              props.uploadProp.grptbl +
              '&atdw= ' +
              props.uploadProp.dw +
              '&umid=' +
              props.uploadProp.umId +
              '&tmzt= ' +
              props.tmzt +
              '&mkbh=null&downlx=02' +
              '&dakid=' +
              props.uploadProp.dakid,
          );
          window.open(
            '/api/eps/control/main/app/lib/pdf/web/viewer.html?downfile=0' +
              '&printfile=' +
              printfilecont +
              '&file=' +
              pdfurl +
              '&filename=' +
              val[0].filename +
              '&_timestamp=' +
              new Date().getTime(),
          );
        } else {
          var pdfurl = encodeURIComponent(
            'http://' +
              location.hostname +
              ':' +
              location.port +
              '/api/eps/wdgl/attachdoc/downPdf?fileid=' +
              val[0].fileid +
              '&grpid=' +
              initstore.sjgrpid +
              '&doctbl=' +
              props.uploadProp.doctbl +
              '&daktmid=' +
              props.daktmid +
              '&ext=' +
              val[0].ext +
              '&grptbl= ' +
              props.uploadProp.grptbl +
              '&atdw= ' +
              props.uploadProp.dw +
              '&umid=' +
              props.uploadProp.umId +
              '&mkbh=null&downlx=01&issy=f' +
              '&dakid=' +
              props.uploadProp.dakid +
              '&tmzt=' +
              props.tmzt,
          );
          window.open(
            '/api/eps/control/main/app/lib/pdf/web/viewer.html?downfile=' +
              dowfilecont +
              '&printfile=' +
              printfilecont +
              '&file=' +
              pdfurl +
              '&filename=' +
              val[0].filename +
              '&_timestamp=' +
              new Date().getTime(),
          );
        }
      } else {
        var epsurl = 'epssoft:@fileview@?';
        var params =
          'url=http://' +
          location.hostname +
          ':' +
          location.port +
          '/api/eps/wdgl/attachdoc/download&fileid=' +
          val[0].fileid +
          '&ext=' +
          val[0].ext +
          '&grpid=' +
          initstore.sjgrpid +
          '&doctbl=' +
          props.uploadProp.doctbl +
          '&daktmid=' +
          props.daktmid +
          '&grptbl=' +
          props.uploadProp.grptbl +
          '&printfile=' +
          printfilecont +
          '&viewpage=' +
          '' +
          '&token=' +
          cookie.load('ssotoken') +
          '&downfile=' +
          dowfilecont +
          '&atdw=' +
          props.uploadProp.dw +
          '&opt=view&umid=' +
          props.uploadProp.umId +
          '&mkbh=' +
          null +
          '&dakid=' +
          props.uploadProp.dakid +
          '&lylx=1&lymd=888&ck=Y&iscsuse=1';
        epsurl += params;
        window.location.href = epsurl;
      }
    }
  };
  /**
   * ????????????
   * @param val
   */
  const onYwViewDocClick = async (val) => {
    if (val.length != 1) {
      message.error('????????????,?????????????????????');
    } else {
      var dowfilecont = 0;
      if (enableDown) {
        dowfilecont = 1;
      }
      var printfilecont = 0;
      if (fjdyViewODC) {
        printfilecont = 1;
      }
      let url =
        '/api/eps/control/main/params/getUserOption?code=WDS003&gnid=WDGL0004&yhid=' +
        SysStore.getCurrentUser().id;
      const response = await fetch.get(url);
      if (response.data.message === 'Y') {
        if (
          val[0].ext.toLowerCase() == 'mp3' ||
          val[0].ext.toLowerCase() == 'mp4' ||
          val[0].ext.toLowerCase() == 'avi'
        ) {
          var pdfurl = encodeURIComponent(
            'http://' +
              location.hostname +
              ':' +
              location.port +
              '/api/eps/wdgl/attachdoc/download?fileid=' +
              val[0].fileid +
              '&daktmid=' +
              props.daktmid +
              '&grpid=' +
              initstore.sjgrpid +
              '&doctbl=' +
              props.uploadProp.doctbl +
              '&grptbl=' +
              props.uploadProp.grptbl +
              '&atdw=' +
              props.uploadProp.dw +
              '&umid=' +
              props.uploadProp.umId +
              '&mkbh=' +
              null +
              '&downlx=02&ext=.mp4' +
              '&tmzt=' +
              props.tmzt,
          );
          window.open(
            '/api/eps/control/main/app/lib/media/viewer.html?downfile=' +
              dowfilecont +
              '&printfile=' +
              printfilecont +
              '&file=' +
              pdfurl +
              '&filename=' +
              val[0].filename,
          );
          return;
        }

        var pdfurl = encodeURIComponent(
          'http://' +
            location.hostname +
            ':' +
            location.port +
            '/api/eps/wdgl/attachdoc/downPdf?fileid=' +
            val[0].fileid +
            '&grpid=' +
            initstore.sjgrpid +
            '&doctbl=' +
            props.uploadProp.doctbl +
            '&daktmid=' +
            props.daktmid +
            '&ext=' +
            val[0].ext +
            '&grptbl= ' +
            props.uploadProp.grptbl +
            '&atdw= ' +
            props.uploadProp.dw +
            '&umid=' +
            props.uploadProp.umId +
            '&mkbh=null&downlx=02' +
            '&dakid=' +
            props.uploadProp.dakid +
            '&tmzt=' +
            props.tmzt,
        );
        window.open(
          '/api/eps/control/main/app/lib/pdf/web/viewer.html?downfile=' +
            dowfilecont +
            '&printfile=' +
            printfilecont +
            '&file=' +
            pdfurl +
            '&filename=' +
            val[0].filename,
        );
      } else {
        var epsurl = 'epssoft:@fileview@?';
        var params =
          'url=http://' +
          location.hostname +
          ':' +
          location.port +
          '/api/eps/wdgl/attachdoc/download&fileid=' +
          val[0].fileid +
          '&ext=' +
          val[0].ext +
          '&grpid=' +
          initstore.sjgrpid +
          '&doctbl=' +
          props.uploadProp.doctbl +
          '&daktmid=' +
          props.daktmid +
          '&grptbl=' +
          props.uploadProp.grptbl +
          '&printfile=' +
          printfilecont +
          '&viewpage=' +
          '' +
          '&token=' +
          cookie.load('ssotoken') +
          '&downfile=' +
          dowfilecont +
          '&atdw=' +
          props.uploadProp.dw +
          '&opt=view&umid=' +
          props.uploadProp.umId +
          '&mkbh=' +
          null +
          '&downlx=02' +
          '&dakid=' +
          props.uploadProp.dakid +
          '&lylx=1&lymd=888&ck=Y&iscsuse=1';
        epsurl += params;
        window.location.href = epsurl;
      }
    }
  };

    /**
   * ??????
   * @param val
   */
  const onconvertViewClick = async (val) => {
      if (val.length != 1) {
        message.error('????????????,?????????????????????');
      } else {
        let url ='/api/eps/control/main/params/getUserOption?code=WDS003';
        const response = await fetch.get(url);
        var dowfilecont = 0;
        if (enableDown) {
          dowfilecont = 1;
        }
        var printfilecont = 0;
        if (fjdyViewODC) {
          printfilecont = 1;
        }

        let wjzhurl ='/api/eps/control/main/cqbcwjzh/queryForId?zhlx='+val[0].ext.toLowerCase();
        const wjzhresponse = await fetch.get(wjzhurl);

        debugger
        if (response.data.message === 'Y') {
          if (
            val[0].ext.toLowerCase() == 'mp3' ||
            val[0].ext.toLowerCase() == 'mp4' ||
            val[0].ext.toLowerCase() == 'avi'
          ) {
            var pdfurl = encodeURIComponent(
              'http://' +
                location.hostname +
                ':' +
                location.port +
                '/api/eps/wdgl/attachdoc/download?fileid=' +
                val[0].fileid +
                '&daktmid=' +
                props.daktmid +
                '&grpid=' +
                initstore.sjgrpid +
                '&doctbl=' +
                props.uploadProp.doctbl +
                '&grptbl=' +
                props.uploadProp.grptbl +
                '&atdw=' +
                props.uploadProp.dw +
                '&umid=' +
                props.uploadProp.umId +
                '&mkbh=' +
                null +
                '&downlx=01&ext=.mp4' +
                '&tmzt=' +
                props.tmzt,
            );
            var dowfilecont = 0;
            if (enableDown) {
              dowfilecont = 1;
            }
            var printfilecont = 0;
            if (fjdyViewODC) {
              printfilecont = 1;
            }
            window.open(
              '/api/eps/control/main/app/lib/media/viewer.html?downfile=' +
                dowfilecont +
                '&printfile=' +
                printfilecont +
                '&file=' +
                pdfurl +
                '&filename=' +
                val[0].filename,
            );
            return;
          }
          const fext = val[0].ext;
          if (fext === 'ofd') {
            var pdfurl = encodeURIComponent(
              'http://' +
                location.hostname +
                ':' +
                location.port +
                '/api/eps/wdgl/attachdoc/OFDToPdf?fileid=' +
                val[0].fileid +
                '&grpid=' +
                initstore.sjgrpid +
                '&doctbl=' +
                props.uploadProp.doctbl +
                '&daktmid=' +
                props.daktmid +
                '&ext=' +
                val[0].ext +
                '&grptbl= ' +
                props.uploadProp.grptbl +
                '&atdw= ' +
                props.uploadProp.dw +
                '&umid=' +
                props.uploadProp.umId +
                '&tmzt= ' +
                props.tmzt +
                '&mkbh=null&downlx=02' +
                '&dakid=' +
                props.uploadProp.dakid,
            );
            window.open(
              '/api/eps/control/main/app/lib/pdf/web/viewer.html?downfile=0' +
                '&printfile=' +
                printfilecont +
                '&file=' +
                pdfurl +
                '&filename=' +
                val[0].filename +
                '&_timestamp=' +
                new Date().getTime(),
            );
          } else {
            var pdfurl = encodeURIComponent(
              'http://' +
                location.hostname +
                ':' +
                location.port +
                '/api/eps/wdgl/attachdoc/downPdf?fileid=' +
                val[0].fileid +
                '&grpid=' +
                initstore.sjgrpid +
                '&doctbl=' +
                props.uploadProp.doctbl +
                '&daktmid=' +
                props.daktmid +
                '&ext=' +
                val[0].ext +
                '&grptbl= ' +
                props.uploadProp.grptbl +
                '&atdw= ' +
                props.uploadProp.dw +
                '&umid=' +
                props.uploadProp.umId +
                '&mkbh=null&downlx=01&issy=f' +
                '&dakid=' +
                props.uploadProp.dakid +
                '&tmzt=' +
                props.tmzt,
            );
            window.open(
              '/api/eps/control/main/app/lib/pdf/web/viewer.html?downfile=' +
                dowfilecont +
                '&printfile=' +
                printfilecont +
                '&file=' +
                pdfurl +
                '&filename=' +
                val[0].filename +
                '&_timestamp=' +
                new Date().getTime(),
            );
          }
        } else {
          var epsurl = 'epssoft:@fileview@?';
          var params =
            'url=http://' +
            location.hostname +
            ':' +
            location.port +
            '/api/eps/wdgl/attachdoc/download&fileid=' +
            val[0].fileid +
            '&ext=' +
            val[0].ext +
            '&grpid=' +
            initstore.sjgrpid +
            '&doctbl=' +
            props.uploadProp.doctbl +
            '&daktmid=' +
            props.daktmid +
            '&grptbl=' +
            props.uploadProp.grptbl +
            '&printfile=' +
            printfilecont +
            '&viewpage=' +
            '' +
            '&token=' +
            cookie.load('ssotoken') +
            '&downfile=' +
            dowfilecont +
            '&atdw=' +
            props.uploadProp.dw +
            '&opt=view&umid=' +
            props.uploadProp.umId +
            '&mkbh=' +
            null +
            '&dakid=' +
            props.uploadProp.dakid +
            '&lylx=1&lymd=888&ck=Y&iscsuse=1';
          epsurl += params;
          window.location.href = epsurl;
        }
      }
  };

  /**
   * ????????????
   * @param val
   */
  const onScannerClick = async (val) => {
    let url =
      "/api/eps/control/main/params/getUserOption?code=WDS012&gnid=''&yhid=" +
      SysStore.getCurrentUser().id;
    const response = await fetch.get(url);
    if (response.data.message === 'Y') {
      window.open(
        'http://' + location.hostname + ':' + location.port + '/Wjsm',
      );
    } else {
      var ivd = JSON.stringify({ id: props.daktmid });
      var epsurl = 'escan://scan?';
      var params =
        'token=' +
        cookie.load('ssotoken') +
        '&rooturl=http://' +
        location.hostname +
        ':' +
        location.port +
        '&tmzt=' +
        props.tmzt +
        '&userid=' +
        SysStore.getCurrentUser().id +
        '&username=' +
        yhmc +
        '&atdw=' +
        props.uploadProp.dw +
        '&dakid=' +
        props.uploadProp.dakid +
        '&wrkTbl=' +
        props.uploadProp.wrkTbl +
        '&idvs=' +
        ivd +
        '&grpid=' +
        initstore.sjgrpid +
        '&doctbl=' +
        props.uploadProp.doctbl +
        '&grptbl=' +
        props.uploadProp.grptbl;
      epsurl += params;
      window.location.href = epsurl;
    }
  };

  /**
   * OFD??????????????????
   * @param val
   */
  const onOfdmaskClick = async (val) => {
    if (val.length < 1) {
      message.error('????????????,???????????????');
    } else {
      if (
        val[0].ext.toLowerCase() == 'mp3' ||
        val[0].ext.toLowerCase() == 'mp4' ||
        val[0].ext.toLowerCase() == 'avi'
      ) {
        message.error('??????????????????????????????????????????');
      }

      return true;
    }
  };
  /**
   * ??????????????????
   * @param val
   */
  const onMediaTwoClick = async (val) => {
    if (val.length < 1) {
      message.error('????????????,???????????????');
    } else {
      if (
        val[0].ext.toLowerCase() !== 'flv' ||
        val[0].ext.toLowerCase() !== 'mp4' ||
        val[0].ext.toLowerCase() !== 'avi'
      ) {
        message.error('??????????????????????????????????????????');
      }
      return true;
    }
  };
  /**
   * OFD????????????
   * @param val
   */
  const onOfdviewClick = async (val) => {
    if (val.length < 1) {
      message.error('????????????,???????????????');
    } else {
      if (
        val[0].ext.toLowerCase() == 'mp3' ||
        val[0].ext.toLowerCase() == 'mp4' ||
        val[0].ext.toLowerCase() == 'avi'
      ) {
        message.error('??????????????????????????????????????????');
      }

      var pdfurl = encodeURIComponent(
        'http://' +
          location.hostname +
          ':' +
          location.port +
          '/api/eps/wdgl/attachdoc/OFDToPdf?fileid=' +
          val[0].fileid +
          '&grpid=' +
          initstore.sjgrpid +
          '&doctbl=' +
          props.uploadProp.doctbl +
          '&daktmid=' +
          props.daktmid +
          '&ext=' +
          val[0].ext +
          '&grptbl= ' +
          props.uploadProp.grptbl +
          '&atdw= ' +
          props.uploadProp.dw +
          '&umid=' +
          props.uploadProp.umId +
          '&tmzt= ' +
          props.tmzt +
          '&mkbh=null&downlx=02' +
          '&dakid=' +
          props.uploadProp.dakid,
      );

      const printUrl =
        '/api/eps/control/main/app/lib/pdf/web/viewer.html?file=' +
        pdfurl +
        '&printfile=1&downfile=0&_timestamp=' +
        new Date().getTime() +
        '&filename=' +
        val[0].filename;
      window.open(printUrl);
    }
  };

  /**
   * OFD??????
   * @param val
   */
  const onOfdownloadClick = async (val) => {
    if (val.length < 1) {
      message.error('????????????,???????????????');
    } else {
      if (
        val[0].ext.toLowerCase() == 'mp3' ||
        val[0].ext.toLowerCase() == 'mp4' ||
        val[0].ext.toLowerCase() == 'avi'
      ) {
        message.error('??????????????????????????????????????????');
      }

      var a = { id: props.daktmid };
      var data = {
        fileid: val[0].fileid,
        grpid: initstore.sjgrpid,
        doctbl: props.uploadProp.doctbl,
        daktmid: a,
        grptbl: props.uploadProp.grptbl,
        atdw: props.uploadProp.dw,
        umid: props.uploadProp.umId,
        tmzt: props.tmzt,
        downlx: '02',
        mkbh: null,
        dakid: props.uploadProp.dakid,
      };
      var ulr =
        '/api/eps/wdgl/attachdoc/downloadOFD?fileid=' +
        val[0].fileid +
        '&grpid=' +
        initstore.sjgrpid +
        '&doctbl=' +
        props.uploadProp.doctbl +
        '&printfile=' +
        props.uploadProp.aprint +
        '&downfile=' +
        props.uploadProp.adown +
        '&daktmid=' +
        props.daktmid +
        '&grptbl=' +
        props.uploadProp.grptbl +
        '&atdw=' +
        props.uploadProp.dw +
        '&umid=' +
        props.uploadProp.umId +
        '&mkbh=' +
        null +
        '&downlx=02' +
        '&dakid=' +
        props.uploadProp.dakid +
        '&tmzt=' +
        props.tmzt;
      window.open(ulr);
    }
  };

  /**
   * ????????????(?????????????????????)
   * @param val
   */
  //  const onMediaTwoClick = async (val) => {

  //   if (val.length < 1) {
  //     message.error('????????????,??????????????????');
  //   }else if(val.length>1){
  //     message.error('????????????,???????????????????????????');
  //   }else {
  //     const ext =val.ext;
  //     if( ext?.toLowerCase() !== 'mp4' && ext?.toLowerCase() !== 'flv' && ext?.toLowerCase() !== 'wmv'){
  //       message.error('????????????,???????????????????????????????????????');
  //     }
  //     setShowMediaTwo(true);
  //     setSelectRecord(val);
  //   }
  // };

  /**
   * ????????????????????????????????????,??????button;
   * @param val
   */
  const beforeOnMediaTwoClick = async (val) => {
    setMediaTwoUrl('');
    if (val) {
      if (val.length < 1) {
        message.error('????????????,??????????????????');
      } else if (val.length > 1) {
        message.error('????????????,???????????????????????????');
      } else {
        const ext = val[0].ext;

        if (
          ext?.toLowerCase() !== 'mp4' &&
          ext?.toLowerCase() !== 'flv' &&
          ext?.toLowerCase() !== 'wmv'
        ) {
          message.error('????????????,???????????????????????????????????????');
        }
        //????????????
        const record = val[0];
        const fileid = record.fileid;
        const ivd = { id: props.daktmid };
        const fjbh = record?.fjbh;
        const bbh = record?.bbh;
        const grpid = record?.grpid;

        const owner = {
          wrkTbl: props.uploadProp.wrkTbl,
          docTbl: props.uploadProp.doctbl,
          docGrpTbl: props.uploadProp.grptbl,
          lx: '',
          grpid: initstore.sjgrpid,
          tybz: 'N',
          atdw: SysStore.getCurrentCmp().id,
          idvs: ivd,
          fjbh: fjbh,
          bbh: bbh,
          whr: SysStore.getCurrentUser().yhmc,
          token: cookie.load('ssotoken'),
          psql: '',
          url:
            '&daktmid=' +
            props.daktmid +
            '&grpid=' +
            initstore.sjgrpid +
            '&doctbl=' +
            props.uploadProp.doctbl +
            '&grptbl=' +
            props.uploadProp.grptbl +
            '&atdw=' +
            props.uploadProp.dw +
            '&umid=' +
            props.uploadProp.umId +
            '&mkbh=' +
            null +
            '&downlx=02' +
            '&dakid=' +
            props.uploadProp.dakid +
            '&tmzt=' +
            props.tmzt,
        };
        //  debugger
        localStorage.setItem('lmtowner', JSON.stringify(owner));
        const url =
          '/api/eps/control/main/lmt/media/index?fileid=' +
          val[0].fileid +
          '&fjbh=' +
          val[0].fjbh +
          '&bbh=' +
          val[0].bbh +
          '&atdw=' +
          SysStore.getCurrentCmp().id +
          '&timetamp=' +
          Math.random();
        setMediaTwoUrl(url);
        return true;
      }
    } else {
      message.error('????????????,??????????????????');
      return false;
    }
  };

  /**
   * ????????????????????????????????????,??????epsmodealbutton;
   * @param val
   */
  const OnMediaTwoClickOld = async (val) => {
    setMediaTwoUrl('');
    if (val) {
      if (val.length < 1) {
        message.error('????????????,??????????????????');
      } else if (val.length > 1) {
        message.error('????????????,???????????????????????????');
      } else {
        const ext = val[0].ext;

        if (
          ext?.toLowerCase() !== 'mp4' &&
          ext?.toLowerCase() !== 'flv' &&
          ext?.toLowerCase() !== 'wmv'
        ) {
          message.error('????????????,???????????????????????????????????????');
        }
        //????????????
        const record = val[0];
        const fileid = record.fileid;
        const ivd = { id: props.daktmid };
        const fjbh = record?.fjbh;
        const bbh = record?.bbh;
        const grpid = record?.grpid;

        const owner = {
          wrkTbl: props.uploadProp.wrkTbl,
          docTbl: props.uploadProp.doctbl,
          docGrpTbl: props.uploadProp.grptbl,
          lx: '',
          grpid: initstore.sjgrpid,
          tybz: 'N',
          atdw: SysStore.getCurrentCmp().id,
          idvs: ivd,
          fjbh: fjbh,
          bbh: bbh,
          whr: SysStore.getCurrentUser().yhmc,
          token: cookie.load('ssotoken'),
          psql: '',
          url:
            '&daktmid=' +
            props.daktmid +
            '&grpid=' +
            initstore.sjgrpid +
            '&doctbl=' +
            props.uploadProp.doctbl +
            '&grptbl=' +
            props.uploadProp.grptbl +
            '&atdw=' +
            props.uploadProp.dw +
            '&umid=' +
            props.uploadProp.umId +
            '&mkbh=' +
            null +
            '&downlx=02' +
            '&dakid=' +
            props.uploadProp.dakid +
            '&tmzt=' +
            props.tmzt,
        };
        //  debugger
        localStorage.setItem('lmtowner', JSON.stringify(owner));
        const url =
          '/api/eps/control/main/lmt/media/two?fileid=' +
          val[0].fileid +
          '&fjbh=' +
          val[0].fjbh +
          '&bbh=' +
          val[0].bbh +
          '&atdw=' +
          SysStore.getCurrentCmp().id +
          '&timetamp=' +
          Math.random();
        setMediaTwoUrl(url);
        setShowMediaTwoOld(true);
      }
    } else {
      message.error('????????????,??????????????????');
    }
  };

  /**
   * ????????????,???????????????
   * @param val
   */
  const onMediaSpilitClickOld = async (val) => {
    setMediaSpilitUrl('');
    if (val) {
      if (val.length < 1) {
        message.error('????????????,??????????????????');
      } else if (val.length > 1) {
        message.error('????????????,???????????????????????????');
      } else {
        const ext = val[0].ext;
        if (
          ext?.toLowerCase() !== 'mp4' &&
          ext?.toLowerCase() !== 'flv' &&
          ext?.toLowerCase() !== 'wmv'
        ) {
          message.error('????????????,???????????????????????????????????????');
        }
        //????????????
        const record = val[0];
        const fileid = record.fileid;
        const ivd = { id: props.daktmid };
        const fjbh = record?.fjbh;
        const bbh = record?.bbh;
        const grpid = record?.grpid;

        const owner = {
          wrkTbl: props.uploadProp.wrkTbl,
          docTbl: props.uploadProp.doctbl,
          docGrpTbl: props.uploadProp.grptbl,
          lx: '',
          grpid: initstore.sjgrpid,
          tybz: 'N',
          atdw: SysStore.getCurrentCmp().id,
          idvs: ivd,
          fjbh: fjbh,
          bbh: bbh,
          whr: SysStore.getCurrentUser().yhmc,
          token: cookie.load('ssotoken'),
          psql: '',
          url:
            '&daktmid=' +
            props.daktmid +
            '&grpid=' +
            initstore.sjgrpid +
            '&doctbl=' +
            props.uploadProp.doctbl +
            '&grptbl=' +
            props.uploadProp.grptbl +
            '&atdw=' +
            props.uploadProp.dw +
            '&umid=' +
            props.uploadProp.umId +
            '&mkbh=' +
            null +
            '&downlx=02' +
            '&dakid=' +
            props.uploadProp.dakid +
            '&tmzt=' +
            props.tmzt,
        };
        debugger;
        localStorage.setItem('lmtowner', JSON.stringify(owner));
        const url =
          '/api/eps/control/main/lmt/media/spilit?fileid=' +
          val[0].fileid +
          '&fjbh=' +
          val[0].fjbh +
          '&bbh=' +
          val[0].bbh +
          '&atdw=' +
          SysStore.getCurrentCmp().id +
          '&timetamp=' +
          Math.random();
        setMediaSpilitUrl(url);
        setShowMediaSpilitOld(true);
      }
    } else {
      message.error('????????????,??????????????????');
    }
  };

  const handleOk = async (val) => {
    console.log('concatval', val);
    //   initstore.mediaConcat(val);

    const a = { id: props.daktmid };
    debugger;
    const formData = new FormData();
    formData.append('aclist', JSON.stringify(val));
    formData.append('idvs', JSON.stringify(a));
    const response = await fetch.post(
      `/api/eps/wdgl/attachdoc/media/concat`,
      formData,
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          dataType: 'json',
        },
      },
    );

    if (response && response.status === 200) {
      debugger;
      if (response.data.success === false) {
        message.error(`??????????????????!?????????????????????????????????????????????`);
      } else {
        if (response.data.message !== '') {
          if (response.data.message === '??????????????????') {
            message.success(`??????????????????!`);
          } else {
            message.error(response.data.message);
          }
        } else {
          message.error(`??????????????????!?????????????????????????????????????????????`);
        }
      }
    }

    ref.current?.getTableStore().findByKey('', 1, 50, initstore.intableparams);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
  };
  /**
   * ????????????
   * @param val
   */
  function onMediaConcatClick(val) {
    if (val.length < 2) {
      message.error('????????????,??????????????????????????????');
    } else {
      confirm({
        title: `???????????????????????????????`,
        icon: <ExclamationCircleOutlined />,
        content: '?????????????????????????????????????????????',
        okText: '??????',
        //   okType: 'danger',
        cancelText: '??????',
        onOk: () => {
          handleOk(val);
        },
        onCancel: handleCancel,
      });
    }
  }

  /**
   * ????????????
   * @param val
   */
  // const onMediaConcatClick = async (val) => {
  //   if (val.length < 2) {
  //     message.error('????????????,??????????????????????????????');
  //   }else {
  //       console.log("concatval",val);
  //    //   initstore.mediaConcat(val);

  //    const a = { id: props.daktmid };
  //     debugger;
  //     const formData = new FormData();
  //     formData.append('aclist', JSON.stringify(val));
  //     formData.append('idvs',  JSON.stringify(a));
  //     const response = await fetch.post(
  //       `/api/eps/wdgl/attachdoc/media/concat`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-type': 'application/x-www-form-urlencoded',
  //           dataType: 'json',
  //         },
  //       },
  //     );

  //     if (response && response.status === 200) {
  //       debugger
  //       if (response.data.success === false) {
  //         message.error(`??????????????????!?????????????????????????????????????????????`);
  //       } else {
  //         if (response.data.message !== '') {
  //           if (response.data.message === '??????????????????') {
  //             message.success(`??????????????????!`);
  //           } else {
  //             message.error(response.data.message);
  //           }
  //         } else {
  //           message.error(`??????????????????!?????????????????????????????????????????????`);
  //         }
  //       }
  //     }

  //       ref.current?.getTableStore().findByKey('', 1, 50, initstore.intableparams);
  //   }
  // };

  const beforeUpload = async (val) => {
    var a = initstore.Uploadparams['wrkTbl'];
    var b = initstore.Uploadparams['docTblXt'];
    if (a === undefined) {
      message.error('????????????,????????????????????????!');
      return false;
    } else {
      if (b === undefined) {
        initstore.Uploadparams['doctbl'] = a + '_FJ';
        initstore.intableparams['doctbl'] = a + '_FJ';
      } else {
        initstore.Uploadparams['doctbl'] = b;
        initstore.intableparams['doctbl'] = b;
      }
      return true;
    }
  };

  const customAction = (store: EpsTableStore, ids: any[]) => {
    console.log('customActionEpsttablestore,ids', store, ids);
    return [
      <>
        {' '}
        {enableUpload && (
          <Upload
            action={props.uploadProp.uploadUrl}
            onChange={onChange}
            name="Fdata"
            showUploadList={false}
            data={initstore.Uploadparams}
            beforeUpload={beforeUpload}
            multiple
          >
            <br />
            <Button
             // icon={<UploadOutlined />}
              type="primary"
              style={{ marginRight: 10, fontSize: 12, top: -10 }}
            >
              ??????
            </Button>
          </Upload>
        )}
        {enableBigUpload && (
          <EpsModalButton
            name="???????????????"
            title="???????????????"
            width={1450}
            useIframe={true}
            url={'/api/eps/wdgl/attachdoc/bigupE9'}
            beforeOpen={() => onBigUpload()}
          />
        )}
        {enableViewDoc && (
          <Button
            type="primary"
           // icon={<ProfileOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onViewDocClick(ids)}
          >
            ??????
          </Button>
        )}
        {enableYwViewDoc && (
          <Button
            type="primary"
         //   icon={<ProfileOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onYwViewDocClick(ids)}
          >
            ????????????
          </Button>
        )}
          {enableViewDoc && (
          <Button
            type="primary"
           // icon={<ProfileOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onconvertViewClick(ids)}
          >
            ??????????????????
          </Button>
        )}
        {enableDown && (
          <Button
            type="primary"
        //    icon={<DownloadOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onDownClick(ids)}
          >
            ??????
          </Button>
        )}
        {enableYwDown && (
          <Button
            type="primary"
           // icon={<DownloadOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onYwDownClick(ids)}
          >
            ????????????
          </Button>
        )}
        {enableYwDown && (
          <Button
            type="primary"
           // icon={<DownloadOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onYwDownClick(ids)}
          >
            ??????????????????
          </Button>
        )}
        {enableConvertFiles && (
          <Button
            type="primary"
         //   icon={<InteractionOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onConvertClick(ids)}
          >
            ????????????
          </Button>
        )}
        {enableScanner && (
          <Button
            type="primary"
          //  icon={<ProfileOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onScannerClick(ids)}
          >
            ????????????
          </Button>
        )}
        {enableOfdmask && showOfdMask && (
          <EpsModalButton
            name="OFD??????????????????"
            title="OFD??????????????????"
            width={1450}
            useIframe={true}
            url={'/api/eps/wdgl/attachdoc/ofdMask/ofdMask'}
            beforeOpen={(ids) => onOfdmaskClick(ids)}
            icon={<UploadOutlined />}
          />
        )}
        {enableOfdview && showOfdView && (
          <Button
            type="primary"
            icon={<ProfileOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onOfdviewClick(ids)}
          >
            OFD????????????
          </Button>
        )}

        {enableDown && (
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onOfdownloadClick(ids)}
          >
            OFD??????
          </Button>
        )}
        {enableMediaTwo && (
          //??????????????????
          // <Button
          //     type="primary"
          //     icon={<YoutubeOutlined />}
          //     style={{ marginRight: 10, fontSize: 12 }}
          //     onClick={() => onMediaTwoClick(ids)}
          //     hidden={mediaEnable}
          //   >
          //     ????????????
          //   </Button>
          //   <EpsModalButton
          //   name="????????????"
          //   title="????????????"
          //   width={1450}
          //   noFoot={true}
          //   useIframe={true}
          //   hidden={mediaEnable}
          //   beforeOpen={() => beforeOnMediaTwoClick(ids)}
          //   url={mediaTwoUrl}
          //   icon={<YoutubeOutlined style={{ color: 'white' }} />}
          //   height={500}
          // />

          //?????????????????????
          <Button
            type="primary"
            icon={<YoutubeOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => OnMediaTwoClickOld(ids)}
            hidden={mediaEnable}
          >
            ????????????
          </Button>
        )}
        {enableMediaSpilit && (
          //  <Button
          //  type="primary"
          //  icon={<YoutubeOutlined />}
          //  style={{ marginRight: 10, fontSize: 12 }}
          //  onClick={() => onMediaSpilitClick(ids)}
          //  hidden={mediaEnable}
          //  >
          //    ????????????
          //  </Button>

          //?????????????????????
          <Button
            type="primary"
            icon={<YoutubeOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onMediaSpilitClickOld(ids)}
            hidden={mediaEnable}
          >
            ????????????
          </Button>
        )}
        {enableMediaConcat && (
          <Button
            type="primary"
            icon={<YoutubeOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onMediaConcatClick(ids)}
            hidden={mediaEnable}
          >
            ????????????
          </Button>
        )}
      </>,
    ];
  };

  const onChange = (info) => {
    if (info.file.status !== 'uploading') {
    }
    if (info.file.status === 'done') {
      const res = info.file.response;
      if (!res.success) {
        message.error(`${res.message} `);
        return;
      }
      message.success(`${info.file.name} ??????????????????.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} ??????????????????.`);
    }
    var b = initstore.Uploadparams['docTblXt'];

    if (b === undefined) {
      initstore.intableparams['doctbl'] =
        initstore.intableparams.wrkTbl + '_FJ';
    } else {
      initstore.intableparams['doctbl'] = b;
    }

    ref.current?.getTableStore().findByKey('', 1, 50, initstore.intableparams);
  };
  const getCustomTableAction = (text, record, index, store) => {
    const exts = record.ext;
    const fileid = record?.fileid;

    //   var params ="token="+cookie.load('ssotoken') + "&rooturl=http://" + location.hostname + ':' + location.port+"&tmzt="+ props.tmzt
    //   + "&userid=" + SysStore.getCurrentUser().id + "&username=" + yhmc + "&atdw=" + props.uploadProp.dw
    //   + "&dakid=" + props.uploadProp.dakid+"&wrkTbl="+props.uploadProp.wrkTbl+"&idvs=" + ivd
    //  + "&grpid=" + initstore.sjgrpid + "&doctbl=" + props.uploadProp.doctbl
    //  + "&grptbl=" + props.uploadProp.grptbl

    //  var ulr= "/api/eps/wdgl/attachdoc/download?fileid=" + val[0].fileid
    //                       + "&grpid=" + initstore.sjgrpid + "&doctbl=" + props.uploadProp.doctbl
    //                       + "&grptbl=" + props.uploadProp.grptbl + "&atdw=" + props.uploadProp.dw + "&umid=" + props.uploadProp.umId + "&mkbh=" + null
    //                       + "&downlx=01" + "&dakid=" + props.uploadProp.dakid + "&tmzt=" + props.tmzt + "&daktmid=" + props.daktmid + "&lylx=1&lymd=999&xz=Y"
    //            window.open(ulr);
    //         bmc: "DAK0010002"
    //       dakid: "DAK201905080013030023"
    //       daklx: "01"
    //       dakmbid: "MB201904132039270004"
    //       daktmid: "DA202109241655190002"
    //       doctbl: "DAK0010002_FJ"
    //       downfile: 1
    //       fjck: true
    //       fjdown: true
    //       fjscan: true
    //       fjsctrue: true
    //       fjupd: true
    //       grpid: "9C8F8B9335ED56D92934DB67ED59263E"
    //       grptbl: "DAK0010002_FJFZ"
    //       id: "DA202109241655190002"
    //       mj: "??????"
    //       printfile: 1
    //       psql: "$S$KCgxPTEpKQ=="
    //       syfjck: true
    //       syfjdown: true
    //       tmsy: "N"
    //       tmzt: 3
    //       wjbt: undefined
    //       wrkTbl: "DAK0010002"
    //       ywindex: false

    // ivd = {id: "DA202109241655190002"}

    // _owner
    // atdw: "DW201408191440170001"
    // bbh: 1
    // docGrpTbl: "DAK0010002_FJFZ"
    // docTbl: "DAK0010002_FJ"
    // fjbh: "MIFACGXAFHEVKFFHOENKCATMNEFYGHBC"
    // grpid: "9C8F8B9335ED56D92934DB67ED59263E"
    // idvs: {id: "DA202109241655190002"}
    // lx: ""
    // psql: "$S$KCgxPTEpKQ=="
    // token: undefined
    // tybz: "N"
    // url: "/eps/wdgl/attachdoc/download?fileid=OITCASDZQLESUEYWPCYDAETYJHDZASUY&daktmid=DA202109241655190002&grpid=9C8F8B9335ED56D92934DB67ED59263E&doctbl=DAK0010002_FJ&grptbl=DAK0010002_FJFZ&atdw=DW201408191440170001&umid=WDGL0004&mkbh=null&downlx=02&dakid=DAK201905080013030023&tmzt=3"
    // whr: "?????????"
    // wrkTbl: "DAK0010002"
    const ivs = props.daktmid;
    const ivd = { id: props.daktmid };
    const fjbh = record?.fjbh;
    const bbh = record?.bbh;
    const grpid = record?.grpid;

    const owner = {
      wrkTbl: props.uploadProp.wrkTbl,
      docTbl: props.uploadProp.doctbl,
      docGrpTbl: props.uploadProp.grptbl,
      lx: '',
      grpid: initstore.sjgrpid,
      tybz: 'N',
      atdw: SysStore.getCurrentCmp().id,
      idvs: ivd,
      dakid: props.uploadProp.dakid,
      tmzt: props.tmzt,
      fjbh: fjbh,
      bbh: bbh,
      daktmid: ivs,
      whr: SysStore.getCurrentUser().yhmc,
      token: cookie.load('ssotoken'),
      psql: '',
      url:
        '&daktmid=' +
        props.daktmid +
        '&grpid=' +
        initstore.sjgrpid +
        '&doctbl=' +
        props.uploadProp.doctbl +
        '&grptbl=' +
        props.uploadProp.grptbl +
        '&atdw=' +
        props.uploadProp.dw +
        '&umid=' +
        props.uploadProp.umId +
        '&mkbh=' +
        null +
        '&downlx=02' +
        '&dakid=' +
        props.uploadProp.dakid +
        '&tmzt=' +
        props.tmzt,
    };

    localStorage.setItem('lmtowner', JSON.stringify(owner));

    return (
      <>
        <EpsModalButton
          name="?????????"
          title="?????????"
          width={1600}
          noFoot={true}
          isIcon={true}
          useIframe={true}
          hidden={
            exts?.toLowerCase() !== 'mp4' &&
            exts?.toLowerCase() !== 'flv' &&
            initstore.lmtmkreg === 'Y'
          }
          url={'/api/eps/control/main/lmt/index'}
          params={{
            fileid,
            fjbh,
            bbh,
            atdw: SysStore.getCurrentCmp().id,
            timetamp: Math.random(),
          }}
          icon={<SoundOutlined style={{ color: 'white' }} />}
          height={850}
        />
        {/* <EpsModalButton
        name="????????????"
        title="????????????"
        width={1600}
        noFoot={true}
        isIcon={true}
        useIframe={true}
        hidden={
          exts?.toLowerCase() !== 'mp4' &&
          exts?.toLowerCase() !== 'flv' &&
          initstore.mediamkreg === 'Y'
        }
        url={'/api/eps/control/main/lmt/media/index'}
        params={{
          fileid,
          fjbh,
          bbh,
          atdw: SysStore.getCurrentCmp().id,
          timetamp: Math.random(),
        }}
        icon={<YoutubeOutlined style={{ color: 'white' }} />}
        height={500}
      /> */}
      </>
    );
  };

  // ????????????????????????detail
  const customTableActionNew = (text, record, index, store) => {
    // const exts = record.ext;
    // if(exts?.toLowerCase() === "mp4" || exts?.toLowerCase() === "flv"){
    return getCustomTableAction(text, record, index, store);
    //   }
  };

  // ???????????????
  // const enableLmt = lmtEnable ? customTableActionNew : props.customTableAction;

  const onFinishMediaTow = (values: any) => {
    formTwo.validateFields().then(async (data) => {
      const res = await fetch.post(
        `/api/eps/wdgl/attachdoc/queryForList?grptbl=${props.uploadProp.grptbl}&doctbl=${props.uploadProp.doctbl}&fileid=${props.tableProp.rowSelection.selectedRowKeys}&filegrpid=${props.grpid}`,
      );
      debugger;
      const aaaa = res.data[0];
      const list = [];
      var a = { id: props.daktmid };
      const info = {
        filegrpid: props.grpid,
        doctbl: props.uploadProp.doctbl,
        dqwz: aaaa.dqwz,
        ext: aaaa.ext,
        fhid: aaaa.fhid,
        fileid: aaaa.fileid,
        filename: aaaa.filename,
        fjbh: aaaa.fjbh,
        fjs: aaaa.fjs,
        fullsize: aaaa.fullsize,
        gn: aaaa.gn,
        grpid: props.grpid,
        grptbl: props.uploadProp.grptbl,
        gsmc: aaaa.gsmc,
        id: aaaa.id,
        mc: aaaa.mc,
        mim: aaaa.mim,
        mj: aaaa.mj,
        // ms: aaaa.ms,
        qmgz: aaaa.qmgz,
        qmjg: aaaa.qmjg,
        qmr: aaaa.qmr,
        qmsj: aaaa.qmsj,
        rjhjxx: aaaa.rjhjxx,
        rtdir: aaaa.rtdir,
        sfzxbb: aaaa.sfzxbb,
        // size: aaaa.size,
        title: aaaa.title,
        tmid: aaaa.tmid,
        tybz: aaaa.tybz,
        whr: aaaa.whr,
        whsj: aaaa.whsj,
        wktbl: props.uploadProp.wrkTbl,
        xtmc: aaaa.xtmc,
        yjhjxx: aaaa.yjhjxx,
        yys: aaaa.yys,
        daktmid: props.daktmid,
        bb: props.uploadProp.dakid,
        bz: props.tmzt,
        dw: props.uploadProp.dw,
        umid: props.uploadProp.umId,
        yhid: SysStore.getCurrentUser().id,
        yhbh: SysStore.getCurrentUser().bh,
        yhmc: SysStore.getCurrentUser().yhmc,
        size: values.size,
        idvs: JSON.stringify(a),
        ms: JSON.stringify(a),
      };
      list.push(info);

      const response = await new HttpRequest('').post({
        url: `/api/eps/wdgl/attachdoc/media/spilitTwo`,
        params: info,
      });
      if (response && response.status === 200) {
        if (response.data.success === false) {
          message.error(`??????????????????!`);
        } else {
          if (response.data.message !== '') {
            if (response.data.message === '??????????????????') {
              message.success(`??????????????????!`);
            } else {
              message.error(response.data.message);
            }
          } else {
            message.error(`??????????????????!`);
          }
        }
      }
      formTwo.resetFields();
      ref.current
        ?.getTableStore()
        .findByKey('', 1, 50, initstore.intableparams);
      setShowMediaTwo(false);
    });
  };

  const onFinishMediaSpilit = (values: any) => {
    formSpilit.validateFields().then(async (data) => {
      const begin = values.begin;
      const end = values.end;
      //  initstore.mediaSpilit(begin,end);
      const second = values.size;
      //initstore.mediaTwo(values,second);
      const res = await fetch.post(
        `/api/eps/wdgl/attachdoc/queryForList?grptbl=${props.uploadProp.grptbl}&doctbl=${props.uploadProp.doctbl}&fileid=${props.tableProp.rowSelection.selectedRowKeys}&filegrpid=${props.grpid}`,
      );
      const aaaa = res.data[0];
      const list = [];
      var a = { id: props.daktmid };
      const info = {
        filegrpid: props.grpid,
        doctbl: props.uploadProp.doctbl,
        dqwz: aaaa.dqwz,
        ext: aaaa.ext,
        fhid: aaaa.fhid,
        fileid: aaaa.fileid,
        filename: aaaa.filename,
        fjbh: aaaa.fjbh,
        // fjs: aaaa.fjs,
        fullsize: aaaa.fullsize,
        gn: aaaa.gn,
        grpid: props.grpid,
        grptbl: props.uploadProp.grptbl,
        gsmc: aaaa.gsmc,
        id: aaaa.id,
        mc: aaaa.mc,
        mim: aaaa.mim,
        mj: aaaa.mj,
        // ms: aaaa.ms,
        qmgz: aaaa.qmgz,
        qmjg: aaaa.qmjg,
        qmr: aaaa.qmr,
        qmsj: aaaa.qmsj,
        rjhjxx: aaaa.rjhjxx,
        rtdir: aaaa.rtdir,
        sfzxbb: aaaa.sfzxbb,
        title: aaaa.title,
        tmid: aaaa.tmid,
        tybz: aaaa.tybz,
        whr: aaaa.whr,
        whsj: aaaa.whsj,
        wktbl: props.uploadProp.wrkTbl,
        xtmc: aaaa.xtmc,
        yjhjxx: aaaa.yjhjxx,
        yys: aaaa.yys,
        daktmid: props.daktmid,
        bb: props.uploadProp.dakid,
        bz: props.tmzt,
        dw: props.uploadProp.dw,
        umid: props.uploadProp.umId,
        yhid: SysStore.getCurrentUser().id,
        yhbh: SysStore.getCurrentUser().bh,
        yhmc: SysStore.getCurrentUser().yhmc,
        size: begin,
        fjs: end,
        idvs: JSON.stringify(a),
        ms: JSON.stringify(a),
      };
      list.push(info);

      const response = await new HttpRequest('').post({
        url: `/api/eps/wdgl/attachdoc/media/spilit`,
        params: info,
      });
      if (response && response.status === 200) {
        if (response.data.success === false) {
          message.error(`??????????????????!`);
        } else {
          if (response.data.message !== '') {
            if (response.data.message === '??????????????????') {
              message.success(`??????????????????!`);
            } else {
              message.error(response.data.message);
            }
          } else {
            message.error(`??????????????????!`);
          }
        }
      }
      formSpilit.resetFields();
      ref.current
        ?.getTableStore()
        .findByKey('', 1, 50, initstore.intableparams);
      setShowMediaSpilit(false);
    });
  };

  const OnMediaTwoCancelOld = () => {
    ref.current?.getTableStore().findByKey('', 1, 50, initstore.intableparams);
    localStorage.removeItem('lmtowner');
    setShowMediaTwoOld(false);
  };

  const OnMediaSpilitCancelOld = () => {
    ref.current?.getTableStore().findByKey('', 1, 50, initstore.intableparams);
    localStorage.removeItem('lmtowner');

    setShowMediaSpilitOld(false);
  };

  const span = 24;
  const _width = 300;
  const _wwidth = 1500;
  const _height = 480;
  const _sheight = 850;

  return (
    <>
      <EpsPanel
        title={props.title}
        source={props.source}
        ref={ref}
        initParams={initstore.intableparams}
        tableProp={props.tableProp}
        tableService={props.tableService}
        customForm={props.customForm}
        //    customTableAction={props.customTableAction}
        customTableAction={customTableActionNew}
        customAction={customAction}
        doctbl={props.uploadProp?.doctbl}
        wktbl={props.uploadProp?.wrkTbl}
        grptbl={props.uploadProp?.grptbl}
        tmid={props.daktmid}
      ></EpsPanel>

      <Modal
        title="????????????"
        centered
        visible={showMediaTwo}
        onCancel={() => setShowMediaTwo(false)}
        footer={null}
        width={500}
      >
        <div>
          <Space direction="vertical">
            <div style={{ width: 500 }}>
              <Form form={formTwo} onFinish={onFinishMediaTow} name="formTwo">
                <Row gutter={12}>
                  {/* <Col span={24}>
                <Form.Item
                  name="??????id"
                  label="???????????????"
                  hidden
                >
                  <Input hidden style={{ width: _width }} />
                </Form.Item>
              </Col> */}
                  <Col span={24}>
                    <Form.Item
                      label="????????????(???)"
                      name="size"
                      required
                      rules={[{ required: true, message: '????????????????????????' }]}
                    >
                      <InputNumber min={1} style={{ width: _width }} />
                    </Form.Item>
                  </Col>
                </Row>
                <div
                  className="btns"
                  style={{
                    textAlign: 'right',
                    height: '30px',
                    marginTop: '10px',
                    marginRight: '10px',
                    padding: ' 0 20px',
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ fontSize: '12px' }}
                    icon={<SaveOutlined />}
                  >
                    ??????
                  </Button>
                  &nbsp; &nbsp; &nbsp;
                  <Button
                    type="primary"
                    onClick={() => setShowMediaTwo(false)}
                    style={{ fontSize: '12px' }}
                    icon={<SaveOutlined />}
                  >
                    ??????
                  </Button>
                </div>
              </Form>
            </div>
          </Space>
        </div>
      </Modal>

      <Modal
        title="????????????"
        centered
        visible={showMediaSpilit}
        onCancel={() => setShowMediaSpilit(false)}
        footer={null}
        width={500}
      >
        <div>
          <Space direction="vertical">
            <div style={{ width: 500 }}>
              <Form
                form={formSpilit}
                onFinish={onFinishMediaSpilit}
                name="formSpilit"
              >
                <Row gutter={12}>
                  <Col span={24}>
                    <Form.Item
                      label="??????????????????(???)"
                      name="begin"
                      required
                      rules={[
                        { required: true, message: '??????????????????????????????' },
                      ]}
                    >
                      <InputNumber min={1} style={{ width: _width }} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="??????????????????(???)"
                      name="end"
                      required
                      rules={[
                        { required: true, message: '??????????????????????????????' },
                      ]}
                    >
                      <InputNumber min={2} style={{ width: _width }} />
                    </Form.Item>
                  </Col>
                </Row>
                <div
                  className="btns"
                  style={{
                    textAlign: 'right',
                    height: '30px',
                    marginTop: '10px',
                    marginRight: '10px',
                    padding: ' 0 20px',
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ fontSize: '12px' }}
                    icon={<SaveOutlined />}
                  >
                    ??????
                  </Button>
                  &nbsp; &nbsp; &nbsp;
                  <Button
                    type="primary"
                    onClick={() => setShowMediaSpilit(false)}
                    style={{ fontSize: '12px' }}
                    icon={<SaveOutlined />}
                  >
                    ??????
                  </Button>
                </div>
              </Form>
            </div>
          </Space>
        </div>
      </Modal>

      {/* ?????????????????????????????? */}
      <Modal
        title="????????????"
        centered
        visible={showMediaTwoOld}
        onCancel={() => OnMediaTwoCancelOld()}
        footer={null}
        width={_wwidth}
      >
        <div
          style={{
            maxHeight: (props.height || _height) + 'px',
            height: (props.height || _height) + 'px',
            width: _wwidth - 48 + 'px',
          }}
        >
          <iframe
            id="auxLcsp"
            name="auxLcsp"
            style={{
              width: (props.width || _wwidth) - 48,
              height: (props.height || _height) + 'px',
              border: 'solid 1px #f4f4f4',
            }}
            src={mediaTwoUrl}
          ></iframe>
        </div>
      </Modal>

      {/* ?????????????????????????????? */}
      <Modal
        title="????????????"
        centered
        visible={showMediaSpilitOld}
        onCancel={() => OnMediaSpilitCancelOld()}
        footer={null}
        width={_wwidth}
      >
        <div
          style={{
            maxHeight: (props.height || _sheight) + 'px',
            height: (props.height || _sheight) + 'px',
            width: _wwidth - 48 + 'px',
          }}
        >
          <iframe
            id="auxLcsp"
            name="auxLcsp"
            style={{
              width: (props.width || _wwidth) - 48,
              height: (props.height || _sheight) + 'px',
              border: 'solid 1px #f4f4f4',
            }}
            src={mediaSpilitUrl}
          ></iframe>
        </div>
      </Modal>
    </>
  );
});
export default EpsUpload;

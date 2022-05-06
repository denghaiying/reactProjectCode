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
  initGrpid(props: any);
  convert(val: any);
  mediaTwo(values: any, second: any);
  mediaSpilit(begin:any,end:any);
  mediaConcat(val: any);
  column: EpsSource[];
  title: string;
  width?: number;
  uploadProp?: IUpload; // 表格属性配置
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
  size?: SizeType; // 表格尺寸
  rowSelection?: unknown; // 行选择控制
  disableEdit?: boolean; // 是否禁用编辑
  disableDelete?: boolean; // 是否禁用删除
  disableIndex?: boolean; // 是否使用索引列
  disableAdd?: boolean; // 是否使用新增
  tableSearch?: boolean; // 右侧表格搜索框
  searchCode?: string; // 搜索字段
  refreshTree?: boolean; // 在新增或删除操作后，是否刷新左侧树
  disableCopy?: boolean; // 是否禁用复制按钮
  enableBatchDelete?: boolean; // 是否启用批量删除
  deleteMessage?: string; // 删除时提示信息
  labelColSpan?: number; // 设置自定义表单标签宽度，默认为6
  onAddClick?: (form: FormInstance) => void; // 点击新增时事件
  onEditClick?: (form: FormInstance, data: Record<string, any>) => void;
  onSearchClick?: (form: FormInstance, store: EpsTableStore) => void;
  onDeleteClick?: (data?: Record<string, unknown>) => boolean;
}

export interface IUpload {
  disableUpload?: Boolean; // 是否禁用上传
  disableBigUpload?: Boolean; // 是否禁用大文件上传
  disableDown?: Boolean; // 是否禁用下载
  disableYwDown?: Boolean; // 是否禁用水印下载
  disableViewDoc?: Boolean; // 是否禁用查阅
  disableYwViewDoc?: Boolean; // 是否禁用水印查阅
  disableScanner?: Boolean;
  disableOfdmask?: Boolean;
  disableOfdview?: Boolean;
  disableConvertFiles?: Boolean; //是否禁用文转换
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
          this.mediamkreg = response.data.message;
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
          message.error(`转换失败!`);
        } else {
          if (response.data.message !== '') {
            if (response.data.message === '转换成功') {
              message.success(`转换成功!`);
            } else {
              message.error(response.data.message);
            }
          } else {
            message.error(`转换失败!`);
          }
        }
      }

    },
    //视频截取
   async mediaSpilit(begin,end) {
    const res = await fetch.post(
      `/api/eps/wdgl/attachdoc/queryForList?grptbl=${props.uploadProp.grptbl}&doctbl=${props.uploadProp.doctbl}&fileid=${props.tableProp.rowSelection.selectedRowKeys}&filegrpid=${props.grpid}`,
    );
    debugger
    const aaaa = res.data[0];
    const list = [];
    var a = { id: props.daktmid };
    const info = {
      filegrpid : props.grpid,
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
      ms:JSON.stringify(a),
    };
    list.push(info);

    const response = await new HttpRequest('').post({
      url: `/api/eps/wdgl/attachdoc/media/spilit`,
      params: info,
    });


    if (response && response.status === 200) {
      if (response.data.success === false) {
        message.error(`视频截取失败!`);
      } else {
        if (response.data.message !== '') {
          if (response.data.message === '视频截取成功!') {
            message.success(`视频截取成功!`);
          } else {
            message.error(response.data.message);
          }
        } else {
          message.error(`视频截取失败!`);
        }
      }
    }

   },


    //视频拆分
    async mediaTwo(val,size) {
      const res = await fetch.post(
        `/api/eps/wdgl/attachdoc/queryForList?grptbl=${props.uploadProp.grptbl}&doctbl=${props.uploadProp.doctbl}&fileid=${props.tableProp.rowSelection.selectedRowKeys}&filegrpid=${props.grpid}`,
      );

      debugger
      const aaaa = res.data[0];
      const list = [];
      var a = { id: props.daktmid };
      const info = {
        filegrpid : props.grpid,
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
        ms:JSON.stringify(a),
      };
      list.push(info);

      const response = await new HttpRequest('').post({
        url: `/api/eps/wdgl/attachdoc/media/spilitTwo`,
        params: info,
      });


      if (response && response.status === 200) {
        if (response.data.success === false) {
          message.error(`视频拆分失败!`);
        } else {
          if (response.data.message !== '') {
            if (response.data.message === '视频拆分成功！') {
              message.success(`视频拆分成功!`);
            } else {
              message.error(response.data.message);
            }
          } else {
            message.error(`视频拆分失败!`);
          }
        }
      }

    },

      //合并视频
      async mediaConcat(val: any){
        var a = { id: props.daktmid };
        debugger;
        const formData = new FormData();
        formData.append('aclist', JSON.stringify(val));
        formData.append('idvs',  JSON.stringify(a));
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
          debugger
          if (response.data.success === false) {
            message.error(`视频合并失败!请选择相同格式的视频进行合并！`);
          } else {
            if (response.data.message !== '') {
              if (response.data.message === '视频合并成功') {
                message.success(`视频合并成功!`);
              } else {
                message.error(response.data.message);
              }
            } else {
              message.error(`视频合并失败!请选择相同格式的视频进行合并！`);
            }
          }
        }
      },

  }));

  // 表格相关配置
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
  const enableMedia =
      props.uploadProp?.disableMedia === undefined
        ? false
        : !props.uploadProp?.disableMedia;

  const fjdyViewODC =
      props.uploadProp?.fjdyViewODC === undefined
      ? false
      : !props.uploadProp?.fjdyViewODC;


  const [lmtEnable, setLmtEnable] = useState(false);
  const [mediaEnable, setMediaEnable] = useState(false);
  const [showMediaTwo,setShowMediaTwo]=useState(false);
  const [showMediaSpilit,setShowMediaSpilit]=useState(false);
  const [selectRecord,setSelectRecord]=useState({});


  useEffect(() => {
    initstore.getMkregSync();
    initstore.getMkregMediaSync();
  }, []);

  const mediaShow=()=>{
    setMediaEnable(initstore.mediamkreg === 'Y');
  }

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
  }, [initstore.lmtmkreg,initstore.mediamkreg]);

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
   * 下载
   * @param val
   */
  const onDownClick = async (val) => {
    if (val.length == 0) {
      message.error('操作失败,请至少选择一行数据');
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
   * 文件转换
   * @param val
   */
  const onConvertClick = async (val) => {
    if (val.length != 1) {
      message.error('操作失败,请选择一行数据');
      return;
    } else {
      debugger;
      if (val[0].wjzh == '1') {
        message.error('请选择未转换的文件');
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
   * 水印下载
   * @param val
   */
  const onYwDownClick = async (val) => {
    if (val.length == 0) {
      message.error('操作失败,请至少选择一行数据');
    } else {
      var dowfilecont=0;
      if(enableDown){
        dowfilecont=1;
      }
      var printfilecont=0;
      if(fjdyViewODC){
        printfilecont=1;
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
        dowfilecont+
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
   * 大文件上传
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
   * 查阅
   * @param val
   */
  const onViewDocClick = async (val) => {
    if (val.length != 1) {
      message.error('操作失败,请选择一行数据');
    } else {
      let url =
        '/api/eps/control/main/params/getUserOption?code=WDS003&gnid=WDGL0004&yhid=' +
        SysStore.getCurrentUser().id;
      const response = await fetch.get(url);
      var dowfilecont=0;
      if(enableDown){
        dowfilecont=1;
      }
      var printfilecont=0;
      if(fjdyViewODC){
        printfilecont=1;
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
          var dowfilecont=0;
          if(enableDown){
            dowfilecont=1;
          }
          var printfilecont=0;
          if(fjdyViewODC){
            printfilecont=1;
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
          '&dakid=' +
          props.uploadProp.dakid +
          '&lylx=1&lymd=888&ck=Y&iscsuse=1';
        epsurl += params;
        window.location.href = epsurl;
      }
    }
  };
  /**
   * 水印查阅
   * @param val
   */
  const onYwViewDocClick = async (val) => {
    if (val.length != 1) {
      message.error('操作失败,请选择一行数据');
    } else {
      var dowfilecont=0;
      if(enableDown){
        dowfilecont=1;
      }
      var printfilecont=0;
      if(fjdyViewODC){
        printfilecont=1;
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
   * 在线扫描
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
   * OFD文档遮罩设置
   * @param val
   */
  const onOfdmaskClick = async (val) => {
    if (val.length < 1) {
      message.error('操作失败,请选择数据');
    } else {
      if (
        val[0].ext.toLowerCase() == 'mp3' ||
        val[0].ext.toLowerCase() == 'mp4' ||
        val[0].ext.toLowerCase() == 'avi'
      ) {
        message.error('此格式的文件不支持转换查看！');
      }

      return true;
    }
  };
  /**
   * OFD文档查阅
   * @param val
   */
  const onOfdviewClick = async (val) => {
    if (val.length < 1) {
      message.error('操作失败,请选择数据');
    } else {
      if (
        val[0].ext.toLowerCase() == 'mp3' ||
        val[0].ext.toLowerCase() == 'mp4' ||
        val[0].ext.toLowerCase() == 'avi'
      ) {
        message.error('此格式的文件不支持转换查看！');
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
      let url = '/api/eps/wdgl/attachdoc/wjzhOFD';
      const response = await fetch.get(url, data);
      var purl = encodeURIComponent(
        'http://127.0.0.1:8089/web-reader/reader?file=' + response.data,
      );
      var a1 = encodeURI(response.data);
      var bb = encodeURI(response.data);
      window.open(bb);
    }
  };

  /**
   * OFD下载
   * @param val
   */
  const onOfdownloadClick = async (val) => {
    if (val.length < 1) {
      message.error('操作失败,请选择数据');
    } else {
      if (
        val[0].ext.toLowerCase() == 'mp3' ||
        val[0].ext.toLowerCase() == 'mp4' ||
        val[0].ext.toLowerCase() == 'avi'
      ) {
        message.error('此格式的文件不支持转换查看！');
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
   * 视频拆分
   * @param val
   */
   const onMediaTwoClick = async (val) => {
    if (val.length < 1) {
      message.error('操作失败,请选择数据！');
    }else if(val.length>1){
      message.error('操作失败,只能选择一条数据！');
    }else {

      setShowMediaTwo(true);
      setSelectRecord(val);
    }
  };

  /**
   * 视频截取
   * @param val
   */
   const onMediaSpilitClick = async (val) => {
    if (val.length < 1) {
      message.error('操作失败,请选择数据！');
    }else if(val.length>1){
      message.error('操作失败,只能选择一条数据！');
    }else {
      setShowMediaSpilit(true);

    }
  };

   /**
   * 视频合并
   * @param val
   */
    const onMediaConcatClick = async (val) => {
      if (val.length < 2) {
        message.error('操作失败,请选择至少两条数据！');
      }else {
          console.log("concatval",val);

       //   initstore.mediaConcat(val);
       const a = { id: props.daktmid };
        debugger;
        const formData = new FormData();
        formData.append('aclist', JSON.stringify(val));
        formData.append('idvs',  JSON.stringify(a));
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
          debugger
          if (response.data.success === false) {
            message.error(`视频合并失败!请选择相同格式的视频进行合并！`);
          } else {
            if (response.data.message !== '') {
              if (response.data.message === '视频合并成功') {
                message.success(`视频合并成功!`);
              } else {
                message.error(response.data.message);
              }
            } else {
              message.error(`视频合并失败!请选择相同格式的视频进行合并！`);
            }
          }
        }

          ref.current?.getTableStore().findByKey('', 1, 50, initstore.intableparams);
      }
    };


  const beforeUpload = async (val) => {
    var a = initstore.Uploadparams['wrkTbl'];
    var b = initstore.Uploadparams['docTblXt'];
    if (a === undefined) {
      message.error('上传失败,请刷新页面后重试!');
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
              icon={<UploadOutlined />}
              type="primary"
              style={{ marginRight: 10, fontSize: 12, top: -10 }}
            >
              上传文件
            </Button>
          </Upload>
        )}
        {enableBigUpload && (
          <EpsModalButton
            name="大文件上传"
            title="大文件上传"
            width={1450}
            useIframe={true}
            url={'/api/eps/wdgl/attachdoc/bigupE9'}
            beforeOpen={() => onBigUpload()}
            icon={<UploadOutlined />}
          />
        )}
        {enableDown && (
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onDownClick(ids)}
          >
            下载
          </Button>
        )}
        {enableYwDown && (
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onYwDownClick(ids)}
          >
            水印下载
          </Button>
        )}
        {enableViewDoc && (
          <Button
            type="primary"
            icon={<ProfileOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onViewDocClick(ids)}
          >
            查阅
          </Button>
        )}
        {enableYwViewDoc && (
          <Button
            type="primary"
            icon={<ProfileOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onYwViewDocClick(ids)}
          >
            水印查阅
          </Button>
        )}
        {enableScanner && (
          <Button
            type="primary"
            icon={<ProfileOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onScannerClick(ids)}
          >
            在线扫描
          </Button>
        )}
        {enableOfdmask && (
          <EpsModalButton
            name="OFD文档遮罩设置"
            title="OFD文档遮罩设置"
            width={1450}
            useIframe={true}
            url={'/api/eps/wdgl/attachdoc/ofdMask/ofdMask'}
            beforeOpen={(ids) => onOfdmaskClick(ids)}
            icon={<UploadOutlined />}
          />
        )}
        {enableOfdview && (
          <Button
            type="primary"
            icon={<ProfileOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onOfdviewClick(ids)}
          >
            OFD文档查阅
          </Button>
        )}
        {enableConvertFiles && (
          <Button
            type="primary"
            icon={<InteractionOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onConvertClick(ids)}
          >
            文件转换
          </Button>
        )}
        {enableDown && (
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onOfdownloadClick(ids)}
          >
            OFD下载
          </Button>
        )}
         {/* {enableMedia && (
           <> */}
          <Button
            type="primary"
            icon={<YoutubeOutlined />}
            style={{ marginRight: 10, fontSize: 12 }}
            onClick={() => onMediaTwoClick(ids)}
          >
            视频拆分
          </Button>

          <Button
          type="primary"
          icon={<YoutubeOutlined />}
          style={{ marginRight: 10, fontSize: 12 }}
          onClick={() => onMediaSpilitClick(ids)}
          >
            视频截取
          </Button>
          <Button
          type="primary"
          icon={<YoutubeOutlined />}
          style={{ marginRight: 10, fontSize: 12 }}
          onClick={() => onMediaConcatClick(ids)}
          >
            视频合并
          </Button>

        {/* </>
        )} */}
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
      message.success(`${info.file.name} 文件上传成功.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
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
    //       mj: "公开"
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
    // whr: "管理员"
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

    localStorage.setItem('lmtowner', JSON.stringify(owner));

    return (
      <EpsModalButton
        name="流媒体"
        title="流媒体"
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
    );
  };

  // 自定义表格行按钮detail
  const customTableActionNew = (text, record, index, store) => {
    // const exts = record.ext;
    // if(exts?.toLowerCase() === "mp4" || exts?.toLowerCase() === "flv"){
    return getCustomTableAction(text, record, index, store);
    //   }
  };

  // 流媒体控制
  // const enableLmt = lmtEnable ? customTableActionNew : props.customTableAction;

  const onFinishMediaTow = (values: any) => {
    formTwo
      .validateFields()
      .then(async (data) => {
        const res = await fetch.post(
          `/api/eps/wdgl/attachdoc/queryForList?grptbl=${props.uploadProp.grptbl}&doctbl=${props.uploadProp.doctbl}&fileid=${props.tableProp.rowSelection.selectedRowKeys}&filegrpid=${props.grpid}`,
        );
        debugger
        const aaaa = res.data[0];
        const list = [];
        var a = { id: props.daktmid };
        const info = {
          filegrpid : props.grpid,
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
          ms:JSON.stringify(a),
        };
        list.push(info);

        const response = await new HttpRequest('').post({
          url: `/api/eps/wdgl/attachdoc/media/spilitTwo`,
          params: info,
        });
        if (response && response.status === 200) {
          if (response.data.success === false) {
            message.error(`视频拆分失败!`);
          } else {
            if (response.data.message !== '') {
              if (response.data.message === '视频拆分成功') {
                message.success(`视频拆分成功!`);
              } else {
                message.error(response.data.message);
              }
            } else {
              message.error(`视频拆分失败!`);
            }
          }
        }
        formTwo.resetFields();
      ref.current?.getTableStore().findByKey('', 1, 50, initstore.intableparams);
      setShowMediaTwo(false);
      });

  };

  const onFinishMediaSpilit = (values: any) => {
    formSpilit
      .validateFields()
      .then(async (data) => {
        const begin = values.begin;
        const end=values.end;
      //  initstore.mediaSpilit(begin,end);
      const second = values.size;
      //initstore.mediaTwo(values,second);
      const res = await fetch.post(
        `/api/eps/wdgl/attachdoc/queryForList?grptbl=${props.uploadProp.grptbl}&doctbl=${props.uploadProp.doctbl}&fileid=${props.tableProp.rowSelection.selectedRowKeys}&filegrpid=${props.grpid}`,
      );
      debugger
      const aaaa = res.data[0];
      const list = [];
      var a = { id: props.daktmid };
      const info = {
        filegrpid : props.grpid,
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
        ms:JSON.stringify(a),
      };
      list.push(info);

      const response = await new HttpRequest('').post({
        url: `/api/eps/wdgl/attachdoc/media/spilit`,
        params: info,
      });
      debugger
      if (response && response.status === 200) {
        if (response.data.success === false) {
          message.error(`视频截取失败!`);
        } else {
          if (response.data.message !== '') {
            if (response.data.message === '视频截取成功') {
              message.success(`视频截取成功!`);
            } else {
              message.error(response.data.message);
            }
          } else {
            message.error(`视频截取失败!`);
          }
        }
      }
      formSpilit.resetFields();
      debugger
      ref.current?.getTableStore().findByKey('', 1, 50, initstore.intableparams);
      setShowMediaSpilit(false);
      });

  };


  const span = 24;
  const _width = 300;

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
    title="视频拆分"
    centered
    visible={showMediaTwo}
    onCancel={() => setShowMediaTwo(false)}
    footer={null}
    width={500}
  >
    <div>
      <Space direction="vertical">
        <div style={{ width: 500 }}>
          <Form form={formTwo}  onFinish={onFinishMediaTow} name="formTwo">
            <Row gutter={12}>
              {/* <Col span={24}>
                <Form.Item
                  name="附件id"
                  label="用户名称："
                  hidden
                >
                  <Input hidden style={{ width: _width }} />
                </Form.Item>
              </Col> */}
              <Col span={24}>
                <Form.Item
                  label="拆分时间(秒)"
                  name="size"
                  required
                  rules={[{ required: true, message: '请输入拆分时间！' }]}
                >
                  <InputNumber min={1}  style={{ width: _width }} />
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
                确定
              </Button>
              &nbsp; &nbsp; &nbsp;
              <Button
                type="primary"
                onClick={() => setShowMediaTwo(false)}
                style={{ fontSize: '12px' }}
                icon={<SaveOutlined />}
              >
                取消
              </Button>
            </div>
          </Form>
        </div>
      </Space>
    </div>
  </Modal>

  <Modal
    title="视频截取"
    centered
    visible={showMediaSpilit}
    onCancel={() => setShowMediaSpilit(false)}
    footer={null}
    width={500}
  >
    <div>
      <Space direction="vertical">
        <div style={{ width: 500 }}>
          <Form form={formSpilit}  onFinish={onFinishMediaSpilit} name="formSpilit">
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item
                  label="开始截取时间(秒)"
                  name="begin"
                  required
                  rules={[{ required: true, message: '请输入开始截取时间！' }]}
                >
                  <InputNumber min={1}  style={{ width: _width }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="结束截取时间(秒)"
                  name="end"
                  required
                  rules={[{ required: true, message: '请输入结束截取时间！' }]}
                >
                  <InputNumber min={2}  style={{ width: _width }} />
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
                确定
              </Button>
              &nbsp; &nbsp; &nbsp;
              <Button
                type="primary"
                onClick={() => setShowMediaSpilit(false)}
                style={{ fontSize: '12px' }}
                icon={<SaveOutlined />}
              >
                取消
              </Button>
            </div>
          </Form>
        </div>
      </Space>
    </div>
  </Modal>
  </>
  );
});
export default EpsUpload;

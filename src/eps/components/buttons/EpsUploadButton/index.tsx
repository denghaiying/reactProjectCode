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
  Badge,
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
import { runInAction } from 'mobx';
import './index.less';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import fetch from '@/utils/fetch';
import EpsUpload from '@/eps/components/upload/EpsUpload/index';
import GuidService from './GuidService';

const getDate = moment().format('YYYY-MM-DD HH:mm:ss');
const yhmc = SysStore.getCurrentUser().yhmc;

export interface IProps {
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
  umId: string;
  tmzt: string;
  daktmid: string;
  fjs: number;
  onUploadClick: (data?: Record<string, unknown>) => Promise<any>;
}

export interface IUpload {
  disableUpload?: Boolean; // 是否禁用上传
  disableBigUpload?: Boolean; // 是否禁用大文件上传
  disableDown?: Boolean; // 是否禁用下载
  disableYwDown?: Boolean; // 是否禁用水印下载
  disableViewDoc?: Boolean; // 是否禁用查阅
  disableYwViewDoc?: Boolean; // 是否禁用水印查阅
  disableConvertFiles?: Boolean; //是否禁用文转换

  disableConvertViewDoc?: Boolean; // 查阅转换
  disableConvertDown?: Boolean; // 下载转换
  uploadUrl: string;
  doctbl: string;
  grptbl: string;
  dw: string;
  aprint: string;
  adown: string;
  wrkTbl: string;
}

const EpsUploadButton = observer((props: IProp) => {
  const [visible, setVisible] = useState(false);
  const [tableStore, setTableStore] = useState();
  const [sjgrpid, setGrpid] = useState('');
  const [intableparams, setTableparams] = useState({});
  const [intuploadparams, setUploadparams] = useState({});
  const [sjdaktmid, setDaktmid] = useState([]);

  const ref = useRef();

  async function showConfrim() {
    if (props.grpid === undefined) {
      const guid = await GuidService.getGuid();
      setGrpid(guid.message);
      props.tableparams['grpid'] = guid.message;
      props.params['grpid'] = guid.message;
      console.log('Epsupload', guid.message);
    } else {
      setGrpid(props.grpid);
      props.tableparams['grpid'] = props.grpid;
      props.params['grpid'] = props.grpid;
    }
    setTableparams(props.tableparams);
    setDaktmid(props.daktmid);
    setUploadparams(props.params);
    setVisible(true);
  }
  function showModal() {
    // if(props.onUploadClick){
    //     props.onUploadClick(props.tableparams).then((data) => {
    //       showConfrim()
    //     }).catch(err => {
    //       message.error(err);
    //     })
    //   }
    // props.params["doctbl"]=data.docTbl;
    // props.tableparams["doctbl"]=data.doctbl;
    if (props.onUploadClick) {
      props
        .onUploadClick()
        .then((data) => {
          console.log('上级菜单参数', data);
          if (data.grpid === undefined) {
            fetch.get(`/api/eps/wdgl/attachdoc/getGuid`).then((response) => {
              setGrpid(response.data.message);
              props.params['grpid'] = response.data.message;
              props.params['doctbl'] = data.docTbl;
              props.params['grptbl'] = data.docGrpTbl;
              props.params['wrkTbl'] = data.wrkTbl;
              props.tableparams['grpid'] = response.data.message;
              props.tableparams['doctbl'] = data.docTbl;
              props.tableparams['grptbl'] = data.docGrpTbl;
              props.tableparams['wrkTbl'] = data.wrkTbl;
              console.log('Epsupload', response.data.message);
              setTableparams(props.tableparams);
              setDaktmid(props.daktmid);
              setUploadparams(props.params);
              setVisible(true);
            });
          } else {
            // localStore.sjgrpid=data.grpid;
            setGrpid(data.grpid);
            props.params['grpid'] = data.grpid;
            props.params['doctbl'] = data.docTbl;
            props.params['grptbl'] = data.docGrpTbl;
            props.params['wrkTbl'] = data.wrkTbl;
            props.tableparams['grpid'] = data.grpid;
            props.tableparams['doctbl'] = data.docTbl;
            props.tableparams['grptbl'] = data.docGrpTbl;
            props.tableparams['wrkTbl'] = data.wrkTbl;
            setTableparams(props.tableparams);
            setDaktmid(props.daktmid);
            setUploadparams(props.params);
            setVisible(true);
          }
        })
        .catch((err) => {
          message.error(err);
        });
    } else {
      setGrpid(props.grpid);
      setTableparams(props.tableparams);
      setUploadparams(props.params);
      setVisible(true);
    }
  }

  function closeModal() {
    localStorage.removeItem('lmtowner');
    setVisible(false);
  }

  useEffect(() => {
    setTableStore(ref.current?.getTableStore());
  }, []);

  return (
    <>
      <a
        key={`fileView_${props.daktmid}`}
        style={{ width: 22, margin: '0 2px' }}
        onClick={showModal}
      >
        <Badge size="small" count={props.fjs ? props.fjs : 0}>
          {' '}
          <PaperClipOutlined style={{ color: '#55acee' }} />
        </Badge>
      </a>
      <Modal
        title={props.title}
        centered
        visible={visible}
        footer={null}
        width={props.width}
        style={{ maxHeight: '600px', height: '600px' }}
        onCancel={() => closeModal()}
      >
        <div style={{ height: '600px' }}>
          <EpsUpload
            title={props.title}
            ref={ref}
            uploadProp={props.uploadProp} //附件上传prop
            width={props.width}
            source={props.source}
            params={intuploadparams} //附件上传参数
            tableProp={props.tableProp} //附件列表prop
            tableService={props.tableService} //附件列表server
            customForm={props.customForm}
            tableparams={intableparams} //附件列表参数
            grpid={sjgrpid} //附件列表参数
            daktmid={sjdaktmid} //附件列表参数
            refesdata={props.refesdata}
            tmzt={props.tmzt} //附件列表参数
            store={props.store}
            mj={props.mj} //附件列表参数
          ></EpsUpload>
        </div>
      </Modal>
    </>
  );
});
export default EpsUploadButton;

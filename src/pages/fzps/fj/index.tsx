import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  Collapse,
  Form,
  InputNumber,
  List,
  message, Modal,
  Row,
  Select, Space, Switch,
  Table,
  Tooltip
} from 'antd';

import {
  BookOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import SysStore from "@/stores/system/SysStore";
import moment from "moment";
import {observer, useLocalObservable} from "mobx-react";
import fetch from "@/utils/fetch";

import { showMessage } from '@/eps/components/message';
import EpsUploadSimple, {IUpload} from "@/eps/components/uploadSimple";
import xtfjService from "@/pages/sys/xt/xtfjService";
import {EpsSource, ITable} from "@/eps/commons/declare";
import EpsFormType from "@/eps/commons/EpsFormType";

const { confirm } = Modal;

interface IProp {
  //   store: EpsTableStore;
  record:{};
}

const Fzfj = observer((props: IProp) =>{


  const ref = useRef();

  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD');

  const [toolsDisabled, setToolsDisabled] = useState(false);
  const [modalHeight, setModalHeight] = useState(0);

  // 本地store
  const ssstore = useLocalObservable(() => (
    {

      dataSource:[],
      mcdataSource:[],
      logSource:[],
      items:[],
      logCount:0,

      async ss(record) {
        const response = await fetch.post(`/api/eps/control/main/fzsp/addFlow?status=2&id=`
          +record.id+`&whrid=`+SysStore.getCurrentUser().id+`&whr=`+yhmc);
        debugger
        console.log("resp+ss",response);
        if (response.status === 200) {
          debugger
          if (response.data.success) {
            showMessage('方志送审成功', 'info');
          } else {
            showMessage('方志送审失败！\r\n' + response.data.message, 'warn');
          }
        }
      },


    }
  ));

  useEffect(() => {
    // SearchStore.queryDw();
    // XtStore.getUserOptionXtgj();
    // XtStore.queryXt();
    // XtStore.getGnInfo();
    // setUmid('CONTROL0001');
    setModalHeight(window.innerHeight - 300);
    // setFormData(props.data)
  }, []);

  function showPopconfirm() {
   setToolsDisabled(true);
  }

  /**
   * 上传组件prop
   */
  const uploadProp: IUpload = {
    disableUpload: false, // 上传按钮
    disableBigUpload: true, // 大文件上传按钮
    disableDown: false, // 下载按钮
    disableYwDown: true, // 水印下载
    disableViewDoc: true, // 查阅
    disableYwViewDoc: true, // 水印查阅
    uploadUrl: '/api/eps/wdgl/attachdoc/upload', // 上传url地址
    doctbl: 'FZPSFJ', // 附件表名
    grptbl: 'FZPSDOCGROUP', // 附件分组表名
    wrkTbl: 'FZPS', // 数据表名
    // dakid: dakid,
    dw: SysStore.getCurrentCmp().id, // 用户单位ID
    umId: 'CONTROL0001',
    aprint: '', // 水印打印次数
    adown: '', // 水印下载 次数
  };

  // 附件列表信息
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
   * 附件列表 表格source
   */
  const fjsource: EpsSource[] = [
    {
      title: '标题',
      code: 'title',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '文件名',
      code: 'filename',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '文件类型',
      code: 'ext',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '文件大小',
      code: 'fullsize',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '有效日期',
      code: 'yxrq',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '停用',
      code: 'ty',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '备注',
      code: 'bz',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '版本号',
      code: 'bbh',
      align: 'center',
      formType: EpsFormType.Input,
    },
    // {
    //   title: '校验码',
    //   code: 'md5code',
    //   align: 'center',
    //   formType: EpsFormType.Input,
    // },
  ];


  return (
    <>
      <Tooltip title="送审">
        <Button size="small"  style={{fontSize: '12px'}} type={'primary'} shape="circle" icon={<BookOutlined />} onClick={showPopconfirm}/>
      </Tooltip>
      <Modal
        title={'系统工具'}
        centered
        visible={toolsDisabled}
        footer={null}
        width={1250}
        //    style={{maxHeight: (props.height || modalHeight) + 'px', height: (props.height || modalHeight) + 'px'}}
        style={{ maxHeight: modalHeight + 'px', height: modalHeight + 'px' }}
        onCancel={() => setToolsDisabled(false)}
      >
        <div style={{ height: '500px' }}>
          <EpsUploadSimple
            title={'方志文件'}
            ref={ref}
            uploadProp={uploadProp} //附件上传prop
            width={1250}
            source={fjsource}
            params={{
              docTbl: 'ATTACHDOC',
              docGrpTbl: 'DOCGROUP',
              grpid: XtStore.filegre,
              docTblXt: 'ATTACHDOC',
              idvs: JSON.stringify({ xtid: XtStore.xtid }),
              wrkTbl: 'XT',
              lx: null,
              atdw: 'DEFAULT',
              tybz: 'N',
              whr: yhmc,
              whsj: getDate,
              fjsctrue: XtStore.fjsc,
            }} //附件上传参数
            tableProp={uploadtableProp} //附件列表prop
            tableService={xtfjService} //附件列表server
            tableparams={{
              doctbl: 'ATTACHDOC',
              grptbl: 'DOCGROUP',
              grpid: XtStore.filegre,
              sfzxbb: '1',
              lx: null,
              ordersql: 'N',
            }} //附件列表参数
            grpid={XtStore.filegre} //附件列表参数
          ></EpsUploadSimple>
        </div>
      </Modal>

    </>
  );
})

export default Fzfj;

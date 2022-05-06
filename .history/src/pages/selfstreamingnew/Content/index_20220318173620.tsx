import React, {useEffect, useRef, useState} from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from "@/eps/commons/declare";
import {Col, DatePicker, Form, Input, Modal, Row, Select} from 'antd';
import {observer, useLocalObservable} from 'mobx-react';
import ContentService from './contentService';
import moment from "moment";
import fetch from "@/utils/fetch";
import SysStore from "@/stores/system/SysStore";

import Fb from "@/pages/selfstreamingnew/Content/Fb";
import Doc from "@/pages/selfstreamingnew/Content/Doc";
import EpsUploadSimpleButton from "@/eps/components/buttons/EpsUploadSimpleButton";
import EpsUploadButton from "@/eps/components/buttons/EpsUploadButton";
import contentFjService from "@/pages/selfstreamingnew/Content/contentFjService";
import EpsUploadSimple from "@/eps/components/uploadSimple";
import YhStore from "@/stores/system/YhStore";

const FormItem = Form.Item;

const tableProp: ITable = {
  tableSearch: true,
  disableEdit: false,
  disableDelete:false,
  disableAdd:false,
  disableCopy:true
}

const Content = observer((props) =>{

  console.log("contentprops",props)

  const [umid, setUmid] = useState('');

  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const [toolsDisabled, setToolsDisabled] = useState(false);

  const ref = useRef();



  // 创建右侧表格Store实例
  const [tableStore, setTableStore]= useState<EpsTableStore>(new EpsTableStore(ContentService));


  const Store = useLocalObservable(() => ({
    channelList: [],
    typeData:[],
    zslxData : [{value: 'mlfl', label: '目录分类展示'},{value: 'mllb', label: '目录列表展示'},
      {value: 'mlnr', label: '目录内容展示'},{value: 'tpfl', label: '图片分类展示'},
      {value: 'tplb', label: '图片列表展示'},{value: 'tpnr', label: '图片内容展示'},
      {value: 'spfl', label: '视频分类展示'},],



    async queryType() {
      const response = await fetch.post(`/api/streamingapi/new/channeltype/queryForList`);
      debugger
      if (response.status === 200) {
        this.typeData = response.data.map(o => ({ 'id': o.id, 'label': o.channeltypename, 'value': o.channeltypebh }));
        console.log('typedata',this.typeData);
      } else {
        return;
      }
    },

    async query() {
      const response = await fetch.post(`/api/streamingapi/new/channeltype/queryChannelForList`);
      debugger
      if (response.status === 200) {
        this.channelList = response.data.map(o => ({ 'id': o.channelid, 'label': o.channelname, 'value': o.channelid }));
        console.log('channelList',this.channelList);
      } else {
        return;
      }
    },

  }));




  useEffect(() => {
    // SearchStore.queryDw();
    setUmid('SELF003');
    Store.query();
  //  Store.queryType();
    setTableStore(ref.current?.getTableStore());
  }, []);

  // const customAction = (store: EpsTableStore) => {
  //   return ([<>
  //     {/* <EpsReportButton store={store} umid={umid} /> */}
  //     {/*        <EpsReportButton store={store} umid={umid} />*/}
  //   </>])
  // }

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
    doctbl: 'CONTENT_FJ', // 附件表名
    grptbl: 'CONTENT_FJFZ', // 附件分组表名
    wrkTbl: 'CONTENT', // 数据表名
    dw: SysStore.getCurrentCmp().id, // 用户单位ID
    umId: 'SELF003',
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
    {
      title: '校验码',
      code: 'md5code',
      align: 'center',
      formType: EpsFormType.Input,
    },
  ];

  const refreshPage = async () => {
   // tableStore.findByKey()
    debugger
    let storeTable = ref.current?.getTableStore();
    if (storeTable) {
      ref.current?.clearTableRowClick();
    }
    debugger
    tableStore.findByKey('', 1, 50,{});
    const res= await ContentService.findByKey('', 1, 50,{});


  };


  const customTableAction = (text, record, index, store) => {

    return (<>
      {[
        Fb(text, record, index, store),
        Doc(text, record, index, store),
        <EpsUploadSimpleButton
          title={'附件信息'} // 组件标题，必填
          uploadProp={uploadProp} //附件上传prop
          store={store}
          width={1250}
          source={fjsource}
          height={800}
          //  refesdata={refreshPage}
          grpid={record.contentfilegrpid}
          //   mj={record.mj}
          fjs={record.contentfjs}
          refesdata={refreshPage}
          params={{
            docTbl: 'CONTENT_FJ',
            docGrpTbl: 'CONTENT_FJFZ',
            //   grpid: record.filegrpid,
            docTblXt: 'CONTENT_FJ',
            idvs: JSON.stringify({ id: record.id }),
            wrkTbl: 'CONTENT',
            lx: null,
            atdw: 'DEFAULT',
            tybz: 'N',
            whr: SysStore.getCurrentUser().yhmc,
            whsj: getDate,
            fjsctrue: true,

          }} //附件上传参数
          tableProp={uploadtableProp} //附件列表prop
          tableService={contentFjService} //附件列表server
          tableparams={{
            doctbl: 'CONTENT_FJ',
            grptbl: 'CONTENT_FJFZ',
            grpid: record.contentfilegrpid,
            sfzxbb: '1',
            lx: null,
            ordersql: 'N',
          }} //附件列表参数
        />
      ]}
    </>)}


  const span = 24;
  const _width = 240


// 自定义表单

  const customForm = () => {
    //自定义表单校验


    return (
      <>
        <Row gutter={20}>

          <Col span={span}>
            <Form.Item required label="内容编号" name="contentbh" >
              <Input style={{width:  _width}} className="ant-input"/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item required label="内容标题" name="contenttitle" >
              <Input.TextArea allowClear
                             // showCount
                              // maxLength={500}
                rows={3}
                              style={{width:  _width}} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <FormItem required label="所属栏目" name="contentchannelid">
              <Select
                style={{ width: _width }} className="ant-select"
                placeholder="所属栏目" options={Store.channelList}
              >
                {/*{ChannelStore.channelList.map(item => (*/}
                {/*  <Select.Option key={item.channelid} value={item.channelid}>{item.channelname}</Select.Option>*/}
                {/*))}*/}
              </Select>
            </FormItem>
          </Col>

          <Col span={span}>
            <Form.Item  label="发布时间" name="contentcreatedate" >
              {/*<Input style={{width:  _width}} className="ant-input"/>*/}
              <DatePicker style={{width:  _width}} className="ant-picker-date-panel" />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item  label="发布人" name="contentauthor" initialValue={SysStore.getCurrentUser().yhmc}>
              <Input disabled style={{width:  _width}} className="ant-input"/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="维护时间" name="contentwhsj" initialValue={getDate}>
              <Input disabled style={{width:  _width}} className="ant-input"/>
            </Form.Item>
          </Col>

        </Row>
      </>
    )
  }

  const source: EpsSource[] = [{
    title: '内容编号',
    code: 'contentbh',
    align: 'center',
    formType: EpsFormType.Input
  },
    {
      title: '内容标题',
      code: 'contenttitle',
      align: 'center',
      formType: EpsFormType.Input
    },

    {
      title: '是否发布',
      code: 'contentfbstate',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text) {
          return text == '1' ? '发布' : '未发布';
        } else {
          return (text = '未发布');
        }
      },
    },
    {
      title: '所属栏目',
      code: 'contentchannelid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let lxlist = Store.channelList;
        let aa = lxlist.filter((item) => {
          return item.value === text;
        });
        return aa[0]?.label;
      },
    },
    {
      title: '发布人',
      code: 'contentauthor',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '维护时间',
      code: 'contentwhsj',
      align: 'center',
      formType: EpsFormType.Input
    }
  ]
  const title = {
    name: '内容管理'
  }

  const searchFrom = () => {
    return (
      <>
        <Form.Item label="内容标题" className="form-item" name="contenttitle">
          <input placeholder="请输入内容标题" className="ant-input" />
        </Form.Item>
        <Form.Item name="contentchannelid" className="form-item" label="所属栏目">
          <Select
            style={{ width: _width }} className="ant-select"
            placeholder="请选择所属栏目" options={Store.channelList}
          ></Select>
        </Form.Item>
      </>
    );
  };

  return (
    <>
    <EpsPanel
      title={title}
      source={source}
      tableProp={tableProp}
      formWidth={500}
      searchForm={searchFrom}
      customTableAction={customTableAction}                  // 高级搜索组件，选填
      tableService={ContentService}
      customForm={customForm}
      //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>
      </>
  );
})

export default Content;

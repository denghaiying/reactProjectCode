import React, {useEffect, useRef, useState} from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from "@/eps/commons/declare";
import {Button, Col, Form, Input, Row, Select, Tooltip, TreeSelect} from 'antd';
import { observer, useLocalStore } from 'mobx-react';
import KpService from './service/KpService';
import YhStore from '@/stores/system/YhStore';
import SysStore from '@/stores/system/SysStore';
import fetch from '@/utils/fetch';
import moment from 'moment';

import Fzes from './fzes';

import Fzys from "@/pages/fzps/ps/kp/fzys";
import EpsDeleteButton from "@/eps/components/buttons/EpsDeleteButton";
import Fzdel from "@/pages/fzps/ps/kp/fzpsdel";
import DwTableLayout from "@/eps/business/DwTableLayout";
import YhService from "@/services/system/yh/YhService";
import Fzfs from "@/pages/fzps/ps/kp/fzfs";
import Fzdg from "@/pages/fzps/ps/kp/fzdg";
const FormItem = Form.Item;
const { TextArea } = Input;



const Dj = observer((props) =>{

  const [umid, setUmid] = useState('');
  const ref = useRef();
  const [tableStore, setTableStore]= useState<EpsTableStore>(new EpsTableStore(KpService));


  /**
   * 获取当前用户名称
   */
  const yhmc = SysStore.getCurrentUser().yhmc

  /**
   * 获取当前用户ID
   */
  const yhid = SysStore.getCurrentUser().id
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const store = useLocalStore(() => ({

    dwTreeData: [],

    dwData:[],

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

    async refreshPage() {
      //props.store.findByKey(props.store.key, 1, props.store.size, props.store.params);
      // storeTable.findByKey('', 1, storeTable.size, {
      //   fid: props.fid,
      //   ...props.archParams,
      // });
      let storeTable = ref.current?.getTableStore();
      if (storeTable && storeTable.findByKey) {
        storeTable.findByKey('', 1, storeTable.size, {});

      }
    },

  }));


  useEffect(() => {
    // let storeTable = ref.current?.getTableStore();
    // if (storeTable && storeTable.findByKey) {
    //   storeTable.findByKey('', 1, storeTable.size, {
    //     ...initstore.intableparams,
    //     ...props.tableparams,
    //   });
    // }
    setTableStore(ref.current?.getTableStore());
  }, []);

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
    //  uploadUrl: '/api/eps/control/main/fzpsfj/upload', // 上传url地址
    uploadUrl: '/api/eps/wdgl/attachdoc/uploadFzps', // 上传url地址
    doctbl: 'FZPSFJ', // 附件表名
    grptbl: 'FZPSDOCGROUP', // 附件分组表名
    wrkTbl: 'FZPS', // 数据表名
    // dakid: dakid,
    dw: SysStore.getCurrentCmp().id, // 用户单位ID
    umId: 'FZPS003',
  };

  // 附件列表信息
  const uploadtableProp: ITable = {
    disableEdit: true,
    disableAdd: true,
    disableCopy: true,
    tableSearch: true,
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
      title: '备注',
      code: 'desc',
      align: 'center',
      formType: EpsFormType.Input,
    },

  ];

  const refreshPage = async () => {
    store.refreshPage();
  };


  const tableProp: ITable = {
    tableSearch: true,
    disableEdit: false,
    disableAdd:false,
    disableCopy:true,
    disableIndex: true,
    disableDelete:true,
  }





  const findByDataLx = (text, record, index, store) => {
    let res: Array<any> = []



    if (record.children ) {
      if (record.spzt === '3') {
        res.push(<Fzfs record={record} store={tableStore}/>)
        res.push(  <Fzdg  record={record} store={tableStore}/> )
      } else if (record.spzt === '4') {
           res.push(<Fzdg record={record} store={tableStore}/> )
      }

    }else {

      if (record.spzt === '1') {
        res.push(<Fzys record={record} store={tableStore}/>)
        res.push(<Fzfs record={record} store={tableStore}/>)
        res.push( <Fzdg  record={record} store={tableStore}/> )

        //      res.push(<Fzes record={record}/>)
        res.push(<Fzdel title="删除" record={record} store={tableStore}/>)
        //    res.push(<EpsDeleteButton  key={`fzpsdel`}
        //                               data={text}
        //                               store={tableStore}
        //                               deleteMessage={tableProp?.deleteMessage}
        //                               onClick={tableProp?.onDeleteClick}
        //                               afterDelete={tableProp?.afterDelete}/>)
        //  }else if(record.sptz ==='31')

      }
    }
    return (
      res
    )
  }



  // 创建右侧表格Store实例
  // const [tableStore] = useState<EpsTableStore>(new EpsTableStore(KpService));


  const customTableAction = (text, record, index, store) => {
    return findByDataLx(text, record, index, store)
  }

  useEffect(() => {
    store.querydwTree();
    store.queryForListByYhid();
    setUmid('FZPS002');
  }, []);


  const span = 24;
  const _width = 360


// 自定义表单

  const customForm = () => {
    //自定义表单校验
    return (
      <>
        <Row gutter={20}>
          <Col span={span}>
            <Form.Item label="单位" name="dw">
              <TreeSelect style={{width:  _width}} className="ant-select"
                          treeData={store.dwTreeData}
                          placeholder="单位"
                          treeDefaultExpandAll
                //  onChange={dwChange}
                          allowClear
              />

            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="志书名称" name="fzmc"  rules={[{ required: true, message: '请输入志书名称' }]}
            >
              <Input style={{width:  _width}} className="ant-input"/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="编者" name="bz"  rules={[{ required: true, message: '请输入编者' }]}
            >
              <Input style={{width:  _width}} className="ant-input"/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="主编" name="zb"  rules={[{ required: true, message: '请输入主编' }]}
            >
              <Input style={{width:  _width}} className="ant-input"/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="副主编" name="fzb" rules={[{ required: true, message: '请输入副主编' }]}
            >
              <Input style={{width:  _width}} className="ant-input" />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item
              label="志书说明"
              name="sm">

              <Input.TextArea
                style={{width:  _width}}
                placeholder="请输入志书简略说明"
                rows={4}>
              </Input.TextArea>

            </Form.Item>

          </Col>

          <Col span={span}>
            <Form.Item label="登记人" name="whr" initialValue={yhmc}>
              <Input disabled style={{width:  _width}} className="ant-input"/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="登记时间" name="whsj" initialValue={getDate}>
              <Input disabled style={{width:  _width}} className="ant-input"/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="状态" name="status" hidden>
              <Input hidden style={{width:  _width}} className="ant-input"/>
            </Form.Item>
          </Col>
        </Row>
      </>
    )
  }

  const source: EpsSource[] = [{
    title: '状态',
    code: 'status',
    align: 'center',
    width: 80,
    formType: EpsFormType.Input,
    render: (text, record, index) => {
      if(text=='1') {
        return '登记' ;
      }else if(text=='3'){
        return '初审';
      }else if(text=='4'){
        return '复审';
      }else if(text=='5'){
        return '终稿';
      }else if(text=='9'){
        return '发布';
      }else{
        return  "未知";
      }
    }
  },
    {
      title: '单位',
      code: 'dw',
      align: 'center',
      width: 120,
      ellipsis: true,         // 字段过长自动东隐藏
      formType: EpsFormType.Input,
      render:function(value){
        let list=store.dwData;
        let mc = list.filter(ite => {
          return ite.id === value
        })
        return (<>{mc[0]?.mc}</>)
      },
    }, {
      title: "志书名称",
      code: "fzmc",
      align: 'center',
      width: 150,
      ellipsis: true,         // 字段过长自动东隐藏
      formType: EpsFormType.Input

    }, {
      title: "编者",
      code: 'bz',
      align: 'center',
      width: 100,
      ellipsis: true,
      formType: EpsFormType.Input
    }, {
      title: "主编",
      code: 'zb',
      align: 'center',
      ellipsis: true,
      width: 100,
      formType: EpsFormType.Input
    }, {
      title: "副主编",
      code: 'fzb',
      ellipsis: true,         // 字段过长自动东隐藏
      align: 'center',
      width:120,
      formType: EpsFormType.Input
    },
    {
      title: "出版社",
      code: 'publisher',
      align: 'center',
      ellipsis: true,
      width:100,
      formType: EpsFormType.Input
    },
    {
      title: '登记人',
      code: 'whr',
      align: 'center',
      ellipsis: true,
      width: 100,
      formType: EpsFormType.Input
    },
    {
      title: '登记时间',
      code: 'whsj',
      align: 'center',
      ellipsis: true,
      width: 120,
      formType: EpsFormType.Input
    }
  ]
  const title = {
    name: '志鉴地情资料评审登记'
  }

  const searchFrom = () => {
    return (
      <>
        <Form.Item label="志书名称" className="form-item" name="fzmc">
          <Input placeholder="请输入志书名称"  className="ant-input"/>
        </Form.Item >
        <Form.Item label="单位" className="form-item" name="dw">
          <TreeSelect className="ant-select"
                      treeData={store.dwTreeData}
                      placeholder="单位"
                      treeDefaultExpandAll
                      allowClear
          />
        </Form.Item>
        <Form.Item name="status" className="form-item"  label="状态">
          <Select   className="ant-select">
            <option value="1">登记</option>
            <option value="3">初审</option>
            <option value="4">复审</option>
            <option value="5">终稿</option>
          </Select>

        </Form.Item>
      </>
    )
  }


  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  return (
    <EpsPanel
      title={title}
      source={source}
      tableProp={tableProp}
      formWidth={600}
      customTableAction={customTableAction}                  // 高级搜索组件，选填
      tableService={KpService}
      customForm={customForm}
      searchForm={searchFrom}
      ref={ref}
    >
    </EpsPanel>
  );
})

export default Dj;

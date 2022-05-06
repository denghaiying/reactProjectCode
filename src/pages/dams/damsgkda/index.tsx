import React, { useEffect, useRef, useState} from 'react';
import {EpsPanel, EpsTableStore} from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import { Col, Form, Input, Row,DatePicker, Select, TreeSelect} from 'antd';
import { EpsSource, ITable, ITitle, ITree, MenuData } from '@/eps/commons/declare';
import { observer, useLocalObservable } from 'mobx-react';

import YhStore from "@/stores/system/YhStore";

import yhUpPwd from "@/pages/sys/Yh/yhUpPwd";
import EpsModalButton from "@/eps/components/buttons/EpsModalButton";
import {ImportOutlined} from "@ant-design/icons";

import DwTableLayout from '@/eps/business/DwTableLayout';
import fetch from "../../../utils/fetch";
import EpsReportButton from '@/eps/components/buttons/EpsReportButton';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import SgkdaService from './sgkdaService';
const FormItem = Form.Item;


const tableProp: ITable = {
    tableSearch:false
}



const span = 24;
const _width = 240



const treeProp: ITree = {
  treeSearch: true,
  treeCheckAble: false
}



const Damsgkda = observer((props) => {


  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  const yhid=SysStore.getCurrentUser().id;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const [umid, setUmid] = useState('')

  const [tableStore, setTableStore]= useState<EpsTableStore>(new EpsTableStore(SgkdaService));

// 创建Store实例
  /**
   * childStore
   */
   const DamsgkdaStore = useLocalObservable(() => (
    {
        dwTreeData: [],
        dakDataSource : [],
        dwStore:[],
        dakStore:[],

 
      async queryTreeDwList()  {
       
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
             
        }else{
            return;
        }
    
      },


      
      async dwChange (dwid) {

            if(dwid === "") {
                dwid = SysStore.getCurrentUser().dwid;
            }
            const url="/api/eps/control/main/dak/queryTreeReact?dw="+dwid+"&isby=N&noshowdw=Y&node=root";
            const response=await fetch.post(url);
            if (response && response.status === 200) {
            this.dakDataSource=response.data;
            }else {
                return;
            }
        },

        async queryDwList() {

            const response = await fetch.get(`/api/eps/control/main/dw/queryForList`);
            if (response.status === 200) {
               if (response.data.length > 0) {
                this.dwStore = response.data;
              }
              return;
            }
  
        },


        async queryDakList() {

            const response = await fetch.get(`/api/eps/control/main/dak/queryForList`);
            if (response.status === 200) {
               if (response.data.length > 0) {
                this.dakStore= response.data;
              }
              console.log('sstredak==',this.dakStore)
              return;
            }
  
        },

    }
  ));



  useEffect(() => {

    DamsgkdaStore.queryTreeDwList();
    DamsgkdaStore.queryDwList();
    DamsgkdaStore.queryDakList();

    setUmid('CONTROL0003')
   
    setTableStore(ref.current?.getTableStore())
  }, []);

  const [dakSelectData, setDakSelectData] = useState<Array<{id:string;label:string;value:string}>>([]);




  const dwChange=(value) =>{

    if(value){
     // fetch.get(`/api/eps/control/main/dak/queryTreeReact?isby=N&noshowdw=Y&node=root&dw=`+value).then(res => {
        fetch.get(`/api/eps/control/main/dak/queryForList?dw=`+value).then(res => {
        if (res && res.status === 200) {
          if (res.data.length > 0) {
            const sdata = res.data.map(o => ({'id': o.id, 'label':  o.mc, 'value': o.id}));
            setDakSelectData(sdata);
          }
        }
      });

    }

  }


  // 自定义表单
  const customForm = () => {

    return (
      <>
        <Row gutter={20}>
          <Col span={span}>
            <Form.Item label="单位"  name="dwid" required>
              <TreeSelect style={{width:  _width}} className="ant-select"
                          treeData={DamsgkdaStore.dwTreeData}
                          placeholder="单位"
                          treeDefaultExpandAll
                          onChange={dwChange}
                          allowClear
              />

            </Form.Item>

          </Col>
         
          <Col span={span}>
            <Form.Item label="类型" name="lx" >
              <Select style={{width:  _width}}  className="ant-select">
              <option value="kfda">KFDA|开放档案</option>
                <option value="xxwj">XXWJ|现行文件</option>
                <option value="ljsy">LJSY|流金岁月</option>
              </Select>
            </Form.Item>
          </Col>
         
          <Col span={span}>
            <Form.Item label="所属档案库" required name="dakid">
              <Select    placeholder="档案库" className="ant-select"   options={dakSelectData} style={{width:  _width}}/>
            </Form.Item>
          </Col>
         
          <Col span={span}>
            <Form.Item label='维护人'
                       name="whr" initialValue={yhmc}>
              <Input  className="ant-input"
                      disabled style={{width:  _width}}
                      placeholder=''
              />
            </Form.Item>
          </Col>

          <Col span={span}>
            <Form.Item label='维护时间'
                       name="whsj" initialValue={getDate}>

              <Input  disabled className="ant-input"  style={{width:  _width}}/>

            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label='维护人id' hidden
                       name="whrid" initialValue={yhid}>
              <Input  className="ant-input" hidden
                      disabled style={{width:  _width}}
                      placeholder=''
              />
            </Form.Item>
          </Col>
        </Row>
      </>
    )
  }


  const ref = useRef();
  
  
  const source:EpsSource[] = [{
      title: '单位',
      code: 'wpid',
      align: 'center',
      ellipsis: true,         // 字段过长自动东隐藏
      fixed: 'left',
      width: 200,
      formType: EpsFormType.Input,
    //   render: (text) => {
    //     for (var i = 0; i < DamsgkdaStore.dwStore.length; i++) {
    //       var lx = DamsgkdaStore.dwStore[i];
    //       if (lx.id === text) {
    //         return lx.mc;
    //       }
    //     }
    //   }
  },   {
      title: "提醒类型",
      code: 'lx',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if(text==='kfda') {
          return text = "KFDA|开放档案";
        }if(text==='xxwj') {
            return text = "XXWJ|现行文件";
        }if(text==='ljsy') {
            return text = "LJSY|流金岁月";
        }else{
          return text = "未知";
        }
      }


  }, {
    title: '所属档案库',
    code: 'wfid',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    //   render: (text) => {
    //       if(DamsgkdaStore.dakStore.length>0){
              
    //         for (var i = 0; i < DamsgkdaStore.dakStore.length; i++) {
    //         var lx = DamsgkdaStore.dakStore[i];
    //         if (lx.id === text) {
    //             return lx.mc;
    //         }
    //         }
    //      }
    //     }
  }, {
          title: "维护人",
          code: 'whr',
          width: 100,
          align: 'center',
          formType: EpsFormType.Input,
  },{
      title: '维护时间',
      code: 'whsj',
      width: 160,
      align: 'center',
      formType: EpsFormType.None
  }]

  const title:ITitle = {
    name: '公开档案'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item name="cx_lx" className="form-item" label="类型">
        <Select style={{width:  _width}}  className="ant-select">
                <option value="">全部</option>
                <option value="kfda">KFDA|开放档案</option>
                <option value="xxwj">XXWJ|现行文件</option>
                <option value="ljsy">LJSY|流金岁月</option>
              </Select>
        </Form.Item>
        <FormItem hidden label="名称" className="form-item" name="cx_mc"><Input hidden placeholder="请输入名称" /></FormItem >

      </>
    )
  }

  return (

      <DwTableLayout title={title}                            // 组件标题，必填
                     source={source}                          // 组件元数据，必填
                     treeProp={treeProp}                      // 左侧树 设置属性,可选填
        //      treeService={DwService}                  // 左侧树 实现类，必填
                     tableProp={tableProp}                    // 右侧表格设置属性，选填
                     tableService={SgkdaService}                 // 右侧表格实现类，必填
                     ref={ref}                                // 获取组件实例，选填
                     formWidth={500}
        //     menuProp={menuProp}                      // 右侧菜单 设置属性，选填
                     tableRowClick={(record) => console.log('abcef', record) }
                     searchForm={searchFrom}
                     customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
             //        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
             //        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </DwTableLayout>

  );
})

export default Damsgkda;

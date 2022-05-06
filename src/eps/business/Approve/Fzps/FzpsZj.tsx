import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import {EpsSource, ITable, ITree} from '@/eps/commons/declare';
import {Button, Col, Form, Input, Modal, notification, Row, Select} from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import fetch from '@/utils/fetch'
import FzpsZjService from "@/eps/business/Approve/Fzps/FzpsZjService";
import YhStore from "@/stores/system/YhStore";
import yhUpPwd from "@/pages/sys/yh/yhUpPwd";
import FzpsZjAdd from "@/eps/business/Approve/Fzps/FzpsZjAdd";

const FormItem = Form.Item;



const FzpsZj = observer((props) =>{




  const tableProp: ITable = {
    tableSearch: true,
    disableEdit:true,
    disableCopy:true,
    disableAdd: true,
    onAddClick: (form) => {
      form.setFieldsValue({fzpsid:props.fzpsid});
    },

  }

  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const [sjgzlst , setSjgzlst]= useState<Array<Object>>([]);
  const [tableStore, setTableStore]= useState<EpsTableStore>();
  const [dakedit , setDakedit]= useState<Array<Object>>([]);
  const [dakeditdisable , setDakeditdisable]= useState(true);

  const [tmztEditData , setTmztEditData]= useState<Array<Object>>([]);

  const [modalAddVisit, setModalAddVisit]= useState(false);


  //const { TextArea } = Input;
  const ref = useRef();
 // const umid="JC061";
  /**
   * childStore
   */
  const zjStore = useLocalObservable(() => (
    {
      params: {},
      // rolerenderlist: [],
      // qwtmgzlstA: [],
      // qwywgzlstB:[],
      // roleData:[],
      // qwgzlst:[],
      // MkReg : false,
      // dakRoleList:[],
      yhByRoleDataSource:[],

      // async getMkReg() {
      //   const response = await fetch.get(`/api/eps/control/main/getMkReg?mkbh=DMZSGN`);
      //   if (response && response.status === 200) {
      //     if(response.data && response.data.success && "Y"==response.data.message){
      //       this.MkReg = true;
      //     }else {
      //       return;
      //     }
      //   }
      // },

      async queryYhByRole(fid) {
        debugger
        const response = await fetch.post(`/api/eps/control/main/fzspzj/queryByRole?rolecode=ZJJS&fzpsid=`+fid );

        if (response && response.status === 200) {
          //  this.yhByRoleDataTotal = response.data.total;
          debugger
          this.yhByRoleDataSource = response.data.map(o => ({ 'id': o.id, 'label': o.yhmc, 'value': o.id }));
          console.log("yhByRoleDataSource",this.yhByRoleDataSource);
        }else{
          return;
        }

      },

      // async getRolerenderlist(val) {
      //   let url="/api/eps/control/main/role/queryForList";
      //   if(val !=null){
      //     url=url+"?dwid="+val;
      //   }
      //   const response=await fetch.get(url);
      //   if (response.status === 200) {
      //     if (response.data.length > 0) {
      //       this.rolerenderlist = response.data.map(o => ({ 'id': o.id, 'label': o.code+'|'+o.name, 'value': o.id }));
      //
      //     }else{
      //       return;
      //     }
      //   }
      // },
      //
      //
      //
      // async queryQwtmgzList() {
      //   const response = await fetch.get(`/api/eps/control/main/sjqxgz/queryForList?lx=A`);
      //   if (response && response.status === 200) {
      //     this.qwtmgzlstA = response.data.map(o => ({ 'id': o.id, 'label': o.code+'|'+o.name, 'value': o.id }));
      //     //   console.log('qwjsqxStore.qwtmgzlst',this.qwtmgzlst)
      //   }else{
      //     return;
      //   }
      // },
      //
      // async queryQwywgzList() {
      //   const response = await fetch.get(`/api/eps/control/main/sjqxgz/queryForList?lx=B`);
      //   if (response && response.status === 200) {
      //     this.qwywgzlstB = response.data.map(o => ({ 'id': o.id, 'label': o.code+'|'+o.name, 'value': o.id }));
      //     //          console.log('qwjsqxStore.qwywgzlst',this.qwywgzlst)
      //   }else {
      //     return;
      //   }
      // },
      //
      // async queryQwgzList() {
      //   let a=[];
      //   let b=[];
      //
      //   const response1 = await fetch.get(`/api/eps/control/main/sjqxgz/queryForList?lx=A`);
      //   if (response1 && response1.status === 200) {
      //     a = response1.data.map(o => ({ 'id': o.id, 'label': o.code+'|'+o.name, 'value': o.id }));
      //   }else {
      //     return;
      //   }
      //   const response = await fetch.get(`/api/eps/control/main/sjqxgz/queryForList?lx=B`);
      //   if (response && response.status === 200) {
      //     b = response.data.map(o => ({ 'id': o.id, 'label': o.code+'|'+o.name, 'value': o.id }));
      //   }else {
      //     return;
      //   }
      //   this.qwgzlst=a.concat(b);
      // },
      //
      //
      // async queryDakRole() {
      //   // if (!this.dwData || this.dwData.length === 0) {
      //   const response = await fetch.get(`/api/eps/control/main/dakrole/queryForDakroleList`);
      //   if (response.status === 200) {
      //
      //     if (response.data.length > 0) {
      //
      //       this.dakRoleList = response.data;
      //     }
      //     return;
      //   }
      // },
      // async queryQjjsList(val){
      //   let url="/api/eps/control/main/role/queryForList?dwid="+val;
      //   const response=await fetch.get(url);
      //   if (response.status === 200) {
      //     if (response.data.length > 0) {
      //       debugger
      //       let  SjzdData = response.data.map(o => ({ 'id': o.id, 'label': o.code+'|'+o.name, 'value': o.id }));
      //       setQjjslist(SjzdData);
      //
      //     }else{
      //       setQjjslist(response.data);
      //     }
      //   }
      // },

    }

  ));




  const pcodeChange=(value) =>{
    if(value == "A"){
      setSjgzlst(zjStore.qwtmgzlstA);
    }else if(value == "B"){
      setSjgzlst(zjStore.qwywgzlstB)
    }

  }
  const editlxChange=(value) =>{
    if(value == "2"){
      setDakeditdisable(false);
      let dwid=props.dwid;
      fetch.get(`/api/eps/control/main/dak/queryForList?orderby=DAK_MBC&dw=`+dwid).then(res => {
        if (res && res.status === 200) {
          if (res.data.length > 0) {
            let sdata = res.data.map(o => ({'id': o.id, 'label': o.bh + '|' + o.mc, 'value': o.id}));
            setDakedit(sdata);
          }else{
            setTmztEditData([]);
          }
        }
      });
    }else{
      setTmztEditData([]);
      setDakeditdisable(true);
    }

  }


  const customTableAction = (text, record, index, store) => {

    return (<>
      {[
        //  <Detail title="模块详情" column={ource} data={record} store={tableStore} customForm={customForm} />,
      ]}
    </>)}


  // 创建Store实例
  /**
   * childStore
   */



  useEffect(() => {
    let storeTable = ref.current?.getTableStore();
    if (storeTable && props.fzpsid && storeTable.findByKey) {
      storeTable.findByKey('', 1, storeTable.size, {
        fzpsid: props.fzpsid,
        ...props.fzpsmc,
      });
      zjStore.queryYhByRole(props.fzpsid);
    }
  }, []);

  useEffect(() =>{

    debugger;
    let storeTable = ref.current?.getTableStore();
    if (storeTable && props.fzpsid && storeTable.findByKey) {
      storeTable.findByKey('', 1, storeTable.size, {
        fzpsid: props.fzpsid,
        ...props.fzpsmc,
      });
      zjStore.queryYhByRole(props.fzpsid);
    }
  },[props.fzpsid])


  const onButtonClick = () => {
    zjStore.queryYhByRole(props.fzpsid);
      setModalAddVisit(true);
  }

  const customAction = (store, rows, ids: any[]) => {
    console.log(store,"-======",rows,"-======",ids);
    return ([<>
      <Button type="primary" hidden={modalAddVisit} onClick={() => onButtonClick()}>分配</Button>
    </>])
  }

  const span = 24;
  const _width = 240
  const customForm = () => {

    return (
      <>
        <Row gutter={20}>

          <Col span={span}>
            <Form.Item label="志书名称:" name="fzpsmc" >
              <Input disabled defaultValue={props.fzpsmc} className="ant-input"  style={{width:  _width}} />
            </Form.Item>
          </Col>

          <Col span={span}>
            <Form.Item label="专家:" name="yhid" required rules={[{ required: true, message: '请选择专家' }]}>
              <Select  mode="multiple" allowClear  className="ant-select"   placeholder="请选择"
                       options={zjStore.yhByRoleDataSource}
                       style={{width:  _width}}/>
            </Form.Item>
          </Col>

          <Col span={span}>
            <Form.Item hidden label="专家:" name="fzpsid" initialValue={props.fzpsid}>
              <Input hidden  className="ant-input"  style={{width:  _width}} />

            </Form.Item>
          </Col>

          <Col span={span}>
            <Form.Item label="维护人:" name="whr" >
              <Input disabled defaultValue={yhmc} className="ant-input"  style={{width:  _width}} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="维护时间:" name="whsj" >
              <Input disabled defaultValue={getDate} className="ant-input"  style={{width:  _width}} />
            </Form.Item>
          </Col>
        </Row>

      </>
    )
  }

  const source: EpsSource[] = [

    // {
    //   title: '单位',
    //   code: 'dwmc',
    //   align: 'center',
    //   ellipsis: true,         // 字段过长自动东隐藏
    //   fixed: 'left',
    //   width: 150,
    //   formType: EpsFormType.Input
    // },
    {
      title: '专家编号',
      align: 'center',
      code: 'bh',
      width: 80,
      ellipsis: true,
      formType: EpsFormType.Select,
    },
    {
      title: '专家名称',
      align: 'center',
      code: 'yhmc',
      width: 100,
      ellipsis: true,
      formType: EpsFormType.Select,
    },
    // }, {
    //   title: '任职部门',
    //   code: 'orgmc',
    //   align: 'center',
    //   width: 100,
    //   formType: EpsFormType.Input
    // },
    // {
    //   title: "用户类型",
    //   code: 'lx',
    //   align: 'center',
    //   width: 100,
    //   formType: EpsFormType.Input,
      // render: (text, record, index) => {
      //   let lxlist=YhStore.lxDataSource;
      //   let aa = lxlist.filter(item => {
      //     return item.value === text
      //   })
      //   return aa[0]?.label
      // },
    //},
    {
      title: "手机号码",
      code: "sjh",
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    }
  ]
  const title = {
    name: '【'+props.fzpsmc+'】专家分配'
  }

  return (
    <>
    <EpsPanel
      title={title}
      source={source}
      ref={ref}
      tableProp={tableProp}
      formWidth={500}
      //customTableAction={customTableAction}                  // 高级搜索组件，选填
      tableService={FzpsZjService}
      customForm={customForm}
      initParams={{fzpsid:props.fzpsid}}
      customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>

    <Modal
      title= "分配"
      visible={modalAddVisit}
      width={800}
      style={{height: (window.innerHeight - 500) + 'px'}}
      //    style={{maxHeight: (props.height || modalHeight) + 'px', height: (props.height || modalHeight) + 'px'}}
      footer={null}
      onCancel={() => setModalAddVisit(false)}
      onOk={() => setModalAddVisit(false)}
    >
      <FzpsZjAdd fzpsid={props.fzpsid} fzpsmc={props.fzpsmc} store={props.store}/>
    </Modal>
</>
  );
})

export default FzpsZj;

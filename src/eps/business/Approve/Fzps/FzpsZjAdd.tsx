import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, TreeSelect, DatePicker, message, Modal } from 'antd';
import fetch from "@/utils/fetch";
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import { ITable, ITitle } from '@/eps/commons/declare';
import { observer, useLocalObservable } from 'mobx-react';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import { CloseCircleOutlined, UndoOutlined, DeleteOutlined, CheckOutlined, ExclamationCircleOutlined, SaveOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
const { confirm } = Modal;

import FzpsZjAddService from "@/eps/business/Approve/Fzps/FzpsZjAddService";
const tableProp: ITable = {
  tableSearch: true,
  disableEdit: true,
  disableDelete:true,
  disableAdd:true,
  disableCopy:true,
  rowSelection: { type: 'checkbox' }
}

export interface IProps{
  title: string;
  data: object;
  store: EpsTableStore;

}

// 归属部门调整
const FzpsZjAdd = observer((props) => {

  console.log('FzpsZjAddprops:',props);

  const [umid, setUmid] = useState('');

  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  const yhid = SysStore.getCurrentUser().id;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');


  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(FzpsZjAddService));

  const zjStore = useLocalObservable(() => (
    {

      org: {},
      filegre : "",
      xtid : "",
      xtgjDisabled: false,
      importDisabled: false,
      zcdate:"",
      gninfo:{},
      fjsc:false,


      async queryForId  (id) {

        if (id != "") {
          const response = await fetch.post(`/api/eps/control/main/org/queryForIdDetail?id=` + id);
          if (response && response.status === 200) {
            this.org = response.data;
          } else {
            this.loading = true;
          }
        }
      },


      async update(idss) {

      //  const yidss=props.store.selectRecords;
      //   const idss = [];
      //   if (yidss.length > 0) {
      //     for (let i = 0; i < yidss.length; i++) {
      //       idss.push(yidss[i].id);
      //     }
      //   } else {
      //     message.warning("操作失败,请至少选择一行数据!")
      //     return
      //   }

        debugger

        const res = await fetch.post("/api/eps/control/main/fzspzj/add",this.params,
          {
            params: {
              yhid: idss.toString(),
              fzpsid: props.fzpsid,
              whr: yhmc,
              whrid: yhid,
              whsj: getDate,
              ...this.params,
            }
          });
debugger
        if (res && res.status === 200 ) {
          if(!res.data.success){
            message.info(res.data.message);
          }else {
            message.info("操作成功！");
          }
        } else {
          message.error("操作失败！");
        }
      },

    }));

  const tzsave = async (ids) => {
    debugger
    // const yidss=props.store.selectRecords;
    const idss = [];
    if (ids.length > 0) {
      for (let i = 0; i < ids.length; i++) {
        idss.push(ids[i].id);
      }
    } else {
      message.warning("操作失败,请至少选择一行数据!")
      return
    }
    zjStore.update(idss);
    if(props.store){
      props.store.findByKey(props.store.key, props.store.page, props.store.size, props.store.params);
    }


  };


  const customAction = (store: EpsTableStore, ids: any[])=> {
    return ([<>
      {/* <EpsReportButton store={store} umid={umid} /> */}
      {/* <EpsReportButton store={store} umid={umid} /> */}
      <Button type="primary" onClick={() => tzsave(ids)} icon={<SaveOutlined />} >确定</Button>
    </>])
  }

  const span = 24;
  const _width = 240


// 自定义表单

  // const customForm = () => {
  //   //自定义表单校验
  //
  //
  //   return (
  //     <>
  //       <Row gutter={20}>
  //         <Col span={span}>
  //           <Form.Item label="编号" name="mkbh" >
  //             <Input style={{width:  _width}} className="ant-input"/>
  //           </Form.Item>
  //         </Col>
  //         <Col span={span}>
  //           <Form.Item label="名称" name="mc" >
  //             <Input style={{width:  _width}} className="ant-input"/>
  //           </Form.Item>
  //         </Col>
  //         <Col span={span}>
  //           <Form.Item label="版本" name="bb">
  //             <Input style={{width:  _width}} className="ant-input"/>
  //           </Form.Item>
  //         </Col>
  //         <Col span={span}>
  //           <Form.Item label="URL" name="url">
  //             <Input style={{width:  _width}} className="ant-input" />
  //           </Form.Item>
  //         </Col>
  //         <Col span={span}>
  //           <Form.Item label="停用" name="tymc">
  //             <Input style={{width:  _width}} className="ant-input"/>
  //           </Form.Item>
  //         </Col>
  //         <Col span={span}>
  //           <Form.Item label="停用日期" name="tyrq">
  //             <Input style={{width:  _width}} className="ant-input"/>
  //           </Form.Item>
  //         </Col>
  //         <Col span={span}>
  //           <Form.Item label="维护人" name="whr">
  //             <Input style={{width:  _width}} className="ant-input"/>
  //           </Form.Item>
  //         </Col>
  //         <Col span={span}>
  //           <Form.Item label="维护时间" name="whsj">
  //             <Input style={{width:  _width}} className="ant-input"/>
  //           </Form.Item>
  //         </Col>
  //       </Row>
  //     </>
  //   )
  // }

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
    {
      title: "手机号码",
      code: "sjh",
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    }
  ]
  const title = {
    name: '分配专家'
  }

  return (
    <div style={{height: '100%'}}>
      <EpsPanel
        title={title}
        source={source}
        tableProp={tableProp}
        formWidth={600}
        //customTableAction={customTableAction}                  // 高级搜索组件，选填
        tableService={FzpsZjAddService}
        initParams={{fzpsid:props.fzpsid}}
        //    customForm={customForm}
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </EpsPanel>
    </div>
  )
});
export default FzpsZjAdd;

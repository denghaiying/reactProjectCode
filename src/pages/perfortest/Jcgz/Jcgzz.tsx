import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import jcgzService from './service/JcgzService';
import { Form, Input, message, Radio, Switch, Select, Button, Modal } from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";

import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;
const _width = 400;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');




const hjflData = [{ value: '01', label: '接口' }, { value: '02', label: '收集' }, { value: '03', label: '整理' }, { value: '04', label: '移交' }, { value: '05', label: '归档' },{value: '06', label: '档案管理'} , { value: '07', label: '长期保存' },{ value: '08', label: 'EEP包' },{ value: '09', label: 'ASIP' }];

const Jcgzz = observer((props) => {

  const [statechecked, setCheckds] =useState(false);
  const ref = useRef();
  const [visible, setVisible] =useState(false);
  const [vids, setVids] =useState("");
  const [lxs, setlxlist] =useState("");

  const tableProp: ITable = {
  disableCopy: true,
  searchCode: 'sxjcjcgzname',
  rowSelection:{
    type:'radio'
  }
  }


  const handleCancel = () => {
    setVisible(false);
  };

  const onChangelx =  async (value) => {
    console.log(value);
    var lylxs = [];
      for (var i = 0; i < value.length; i++) {
        lylxs.push(value[i]);
      } 
      console.log(value);
      setlxlist(lylxs.toString());
  };

  const handleOk = async () => {
      let data: Object = {};
      data['ids'] = vids;
      data['hjs'] = lxs;
      let repeson=await jcgzService.copyData(data);
      if(repeson.status === 201){
          message.success("复制成功!")
          setVisible(false);
          const tableStores = ref.current?.getTableStore();
          tableStores.findByKey("",1,50,{});
      }
  };

  const onButtonClick = async (ids) => {
     var idss = [];
    if (ids.length <= 0) {
      message.warning({ type: 'warning', content: '请选择一行条目数据' })
    } else {
      for (var i = 0; i < ids.length; i++) {
              idss.push(ids[i].id);
      } 
      setVisible(true);
      setVids(idss.toString());
    }
    // var idss = [];
    // if (ids.length <= 0) {
    //   message.warning({ type: 'warning', content: '请选择一行条目数据' })
    // } else {
    //   for (var i = 0; i < ids.length; i++) {
    //           idss.push(ids[i].id);
    //   }

    //   let data: Object = {};
    //   data['ids'] = idss.toString();
    //   let repeson=await jcgzService.copyData(data);
    //   if(repeson.status === 201){
    //     message.success("复制成功!")
    //     const tableStores = ref.current?.getTableStore();
    //     tableStores.findByKey("",1,50,{});
    //   }
    // }

  };

  //select  mode="tags" 可输入
  const customForm = () => {
    return (
      <>
        <Form.Item label="名称:" name="sxjcjcgzname" required rules={[{ required: true, message: '请输入名称' }]}>
          <Input allowClear style={{ width: _width }} />
        </Form.Item>
        <Form.Item label="编号:" name="sxjcjcgzbh" required rules={[{ required: true, message: '请输入编号' }]}>
           <Input allowClear style={{ width: _width }} />
        </Form.Item>
         <Form.Item label="模板:" name="sxjcjcgzcode" required rules={[{ required: true, message: '请选择模板' }]}>
          <Select placeholder="请选择模板" options={mblist} style={{ width: _width}} />
        </Form.Item>
        <Form.Item label="类型:" name="sxjcjcgzhj" required rules={[{ required: true, message: '请选择类型' }]}>
          <Select placeholder="请选择类型" options={hjflData} style={{ width: _width}} />
        </Form.Item>
        <Form.Item name="sxjcjcgzstate" label="状态:" initialValue="true">
          <Radio.Group>
            <Radio.Button value="true">开启</Radio.Button>
            <Radio.Button value="false">关闭</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="备注:" name="sxjcjcgzbz" >
          <Input.TextArea  autoSize={{ minRows: 3, maxRows: 5 }}   style={{width: _width }}/>
        </Form.Item>
        <Form.Item label="维护时间:" name="whsj"  initialValue={getDate}>
          <Input disabled style={{ width: _width }} />
        </Form.Item>
        {/* <Form.Item name="whrid" >
              <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
            </Form.Item> */}
      </>
    )
  }
    // 全局功能按钮
    const customAction = (store: EpsTableStore, ids: any[]) => {
      return ([
        <>
         <Button type="primary" onClick={() => onButtonClick(ids)}>复制</Button>
        </>
      ])
    }

    // 创建右侧表格Store实例
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(jcgzService));
    const [mblist, setMblist]= useState<Array<{id:string;label:string;value:string}>>([]);
    // 自定义表格行按钮detail
    const customTableAction = (text, record, index, store) => {
      return (
        <>

        </>
      );
    }
    useEffect(() => {
      const queryMbList =  async (params) =>{
        if(tableStore){
          let url="/api/api/sxjcjcgz/findAllMb";
          const response =await fetch.post(url,params);
          if (response.status === 200) {
            if (response.data?.length > 0) {
              let  MbData = response.data?.map(o => ({ 'id': o.id, 'label': o.mc, 'value': o.id }));
              setMblist(MbData);
            }else{
              setMblist(response.data);
            }
          }
        }
      }
    queryMbList({});
      //YhStore.queryForPage();
    }, []);

    const source: EpsSource[] = [ {
        title: '名称',
        code: 'sxjcjcgzname',
        align: 'center',
        formType: EpsFormType.Input
      }, {
        title: '编号',
        code: 'sxjcjcgzbh',
        align: 'center',
        formType: EpsFormType.Input
      }, {
        title: '模板',
        code: 'sxjcjcgzcode',
        align: 'center',
        formType: EpsFormType.Input,
        render: (text, record, index) => {
        let lxlist=mblist;
        let aa = lxlist.filter(item => {
          return item.value === text
        })
        if(aa.length>0){
           return aa[0]?.label
        }else{
          return text
        }
        },
      },  {
        title: '类型',
        code: 'sxjcjcgzhj',
        align: 'center',
        formType: EpsFormType.Input,
        render: (text, record, index) => {
        let lxlist=hjflData;
        let aa = lxlist.filter(item => {
          return item.value === text
        })
        if(aa.length>0){
           return aa[0]?.label
        }else{
          return text
        }
        },
      },{
        title: '状态',
        code: 'sxjcjcgzstate',
        align: 'center',
        formType: EpsFormType.Input,
        render: (text, record, index) => {
        if(text==="true"){
          return '开启'
        }else{
          return '关闭'
        }
        },
      },
      {
        title: '维护人',
        code: 'whr',
        align: 'center',
        formType: EpsFormType.Input
      },
      {
        title: '维护时间',
        code: 'whsj',
        align: 'center',
        formType: EpsFormType.Input
      }]
    const title: ITitle = {
      name: '归档接口'
    }


    const searchFrom = () => {
      return (
        <>
          <Form.Item label="编号" className="form-item" name="archiveinfoCode"><Input placeholder="请输入业务号" /></Form.Item >
        </>
      )
    }

    return (
      <>

         <EpsPanel title={title}                    // 组件标题，必填
          source={source}                          // 组件元数据，必填
          tableProp={tableProp}                    // 右侧表格设置属性，选填
          tableService={jcgzService}             // 右侧表格实现类，必填
          ref={ref}                                // 获取组件实例，选填
          setCheckRows={props.checkrow}
          formWidth={700}
          customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
          customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        >
        </EpsPanel>

        <Modal
          title="规则复制"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          width='400px'
        >
          <div style={{ height: '100%'}}>
          <Form.Item label="类型:" name="sxjcjcgzhj" required rules={[{ required: true, message: '请选择类型' }]}>
            <Select placeholder="请选择类型" mode="multiple"  maxTagCount="3" allowClear options={hjflData}  style={{ width: 200}} onChange={onChangelx} />
          </Form.Item>
          </div>
        </Modal>
      </>
    );
  })

export default Jcgzz;

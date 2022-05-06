import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import zdgxService from './service/CqbcZdgxService';
import { Form, Input, message, Select, Checkbox, Modal, Table, Button, Popconfirm} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';

import fetch from "../../../utils/fetch";
import moment from 'moment';
import EditTable from './EditTable';

const yhmc = SysStore.getCurrentUser().yhmc;

const lxData = [{value: "C", label: "文本型"}, {value: "N", label: "数值型"}, {value: "D", label: "日期型"}, {value: "T", label: "日期时间型"}, {value: "B",label: "大文本型"}];
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  tableSearch: false,
  disableCopy: true,
  disableEdit: true,
  disableAdd: true,
  searchCode: 'name',
  onEditClick:(form, record) =>{
    if(record.bgqx === "Y"){
      record.bgqx= true;
    }else{
      record.bgqx= false;
    }
    form.setFieldsValue(record);
  },
}



const Zddy = observer((props) => {
const [form] = Form.useForm();
const ref = useRef();
const [zlxlist, setZlxlist]= useState<Array>([]);
const [zjklist, setZjkzdlist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [daklist, setDaklist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [jkpzlist, setJkpzlist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [visible, setVisible] =useState(false);
const [selectedRowMxKeys, setSelectedMxRowKeys] = useState([]);
const [checkedRows, setCheckedRows] = useState<any>([]);


const _width = 360


const customForm = () => {
  return (
    <>
    </>
  )
}
  // 全局功能按钮
  const customAction = (store: EpsTableStore) => {
    return ([
      <>
      <Button type="primary" onClick={() => onButtonClick()}>
          新建
      </Button>
      </>
    ])
  }

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(zdgxService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>

      </>
    );
  }

  const onButtonClick =()=> {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    const tableStores = ref.current?.getTableStore();
    tableStores.findByKey("",1,50,{'jkid':props.jkpzid});
  };

  const handleOk = async () => {
    setVisible(false);
    const tableStores = ref.current?.getTableStore();
    tableStores.findByKey("",1,50,{'jkid':props.jkpzid});
  };

  const onSelectChange = (value, row) => {
    console.log('selectedRowKeys changed: ', value);
    setSelectedMxRowKeys(value);
    setCheckedRows(row)
  };

  const selectRow = (record) => {
    const selectedRowKeys = selectedRowMxKeys;
      if (selectedRowKeys.indexOf(record.key) >= 0) {
        selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
      } else {
        selectedRowKeys.push(record.key);
      }
    setSelectedMxRowKeys(selectedRowKeys);
  }


  const rowMxSelection = {
    selectedRowMxKeys,
    onChange: onSelectChange,
  };



  useEffect(() => {
    const tableStores = ref.current?.getTableStore();
    tableStores.findByKey("",1,50,{'jkid':props.jkpzid});
    const querymbzlxList =  async (params) =>{
        const kkdyponse =await fetch.post("/api/eps9/tyjk/kkdy/findForKeyMb",{jkid:props.jkpzid});
         if(kkdyponse.data.length ==1){
          let url="/api/eps/control/main/mbzlx/queryForList";
          const response =await fetch.post(url+"?mbid="+kkdyponse.data[0].mb);
          if (response.status === 200) {
            if (response.data.length > 0) {
              let  mbData = response.data.map(o => ({ 'id': o.mc, 'label': o.mc+"|"+o.ms, 'value': o.mc }));
              setDaklist(mbData);
            }else{
              setDaklist(response.data);
            }
          }
         }else if(kkdyponse.data.length >1){
            message.error(props.jkpzid+"接口,库库对应,只能配置一个模板！");
         }else{
          message.error('请先配置接口：'+props.jkpzid+",对应库库对应！");
         }
    }


    const queryzjkzdList =  async () =>{
      const zjkzdresponse =await fetch.post("/api/eps9/tyjk/zdgx/findAllMbzlx",{bmc:props.midtbname});
      if (zjkzdresponse.status === 200) {
      if (zjkzdresponse.data.length > 0) {
        zjkzdresponse.data?.map(o => (o.key=o.id));
     // let  mbData = zjkzdresponse.data.map(o => ({ 'id': o.name, 'label': o.name, 'value': o.name}));
       setZlxlist(zjkzdresponse.data);
      }
     }
}


    const queryjkpzList =  async () =>{
          let url="/api/eps9/tyjk/jkpz/findForKey";
          const response =await fetch.post(url,{'jkid':props.jkpzid});
          if (response.status === 200) {
            if (response.data) {
                let  mbData ={ 'id': response.data.id, 'label': response.data.name, 'value': response.data.id };
                setJkpzlist(mbData);
            }
          }
    }
    querymbzlxList({});
    queryzjkzdList();
    queryjkpzList();
  }, [props.jkpzid]);



  const source: EpsSource[] = [{
      title: '接口ID',
      code: 'jkid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let sjjkpz=jkpzlist;
        if(text === sjjkpz.value){
           return sjjkpz.label;
        }else{
          return text;
        }
      }
    }, {
      title: '接口名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '档案库字段名',
      code: 'dakzd',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '中间库字段',
      code: 'zjkzd',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '字段名称',
      code: 'zdmc',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '默认值',
      code: 'zdmrz',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '字段类型',
      code: 'zdlx',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let lxlist=lxData;
        let aa = lxlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      }
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
    name: '字段对应'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="接口名称" className="form-item" name="name"><Input placeholder="请输入接口名称" /></Form.Item >
        <Form.Item label="名称" className="form-item" name="xysjlxmc"><Input placeholder="请输入名称" /></Form.Item >

      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={zdgxService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={900}
       // searchForm={searchFrom}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        initParams={{'jkid':props.jkpzid}}
      >
      </EpsPanel>

      <Modal
          title="字段对应"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          width='1000px'
          footer={null}
          style={{ top: 20, height:480 }}
        >

        <div  style={{ height:'70%'}}>
            <EditTable jkpzid={props.jkpzid} jkpname={props.jkpname} midtbname={props.midtbname}/>
          </div>
        </Modal>
    </>
  );
})

export default Zddy;

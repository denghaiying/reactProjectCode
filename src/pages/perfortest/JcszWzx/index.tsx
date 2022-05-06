import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import sxjcjcszService from './service/JcszWzxService';
import xysjsxService from '@/services/perfortest/XysjsxService';
import { Form, Input, message, InputNumber, Select, Button} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import { history } from 'umi';
import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  disableCopy: true,
  searchCode: 'sxjcjcszname',
}

const sxjclxData = ['元数据','电子文件','归档信息包'];
const sxjcjcmxData =  {
    元数据: [{ value: 'sxjcxBl', label: '必录' },{ value: 'GD-2-3', label: '数据齐全' }],
  电子文件:[{ value: 'wz01', label: '检测电子文件大小相等' }, { value: 'wz02', label: '检测电子文件数量相等' }, { value: 'wz04', label: '数据完整齐全' }],
  归档信息包:[{ value: 'GD-2-6', label: '连续性元数据项检测' },{ value: 'GD-2-9', label: '归档范围检测'},{ value: 'GD-2-11', label: '信息包内容数据完整性检测' }]
};


const zsxflData = [{ value: '电子文件数据总量', label: '电子文件数据总量' }, { value: '电子文件元数据完整性', label: '电子文件元数据完整性' }, { value: '电子文件内容完整性', label: '电子文件内容完整性' }, { value: '归档信息报完整性', label: '归档信息报完整性' }];

const jcdata = [{ value: 'sxjcxBl', label: '必录' },{ value: 'GD-2-3', label: '数据齐全' },{ value: 'wz01', label: '检测电子文件大小相等' }, { value: 'wz02', label: '检测电子文件数量相等' }, { value: 'wz04', label: '数据完整齐全' },{ value: 'GD-2-6', label: '连续性元数据项检测' },{ value: 'GD-2-9', label: '归档范围检测'},{ value: 'GD-2-11', label: '信息包内容数据完整性检测' }];

const JcszWzx = observer((props) => {

const ref = useRef();
const _width = 400;
const [sxlist, setSxlist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [mxlist, setJcmx]= useState<Array<{id:string;label:string;value:string}>>(sxjcjcmxData[sxjclxData[0]]);
const [lxlist, setLxlist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [secondJcmx, setSecondJcmx] = React.useState(sxjcjcmxData[sxjclxData[0]][0]);
const handleSxlxChange = value => {
    setJcmx(sxjcjcmxData[value]);
    setSecondJcmx(sxjcjcmxData[value][0]);
  };
 const onSecondJcmxChange = value => {
    setSecondJcmx(value);
  };
  const returnSy = () => {
    history.push("/runRFunc/sxjcsxsz");
   };

  const onysjlxChange = async (value) => {
    let url="/api/eps/control/main/ysjwh/queryForList?cx_lx="+value;
    const response =await fetch.get(url);
     if (response.status === 200) {
      if (response.data?.length > 0) {
        let  SxData = response.data?.map(o => ({ 'id': o.id, 'label': o.zdms, 'value': o.id }));
        setSxlist(SxData);
      }else{
        setSxlist(response.data);
      }
    }
  };
const [tableStore] = useState<EpsTableStore>(new EpsTableStore(sxjcjcszService));

    useEffect(() => {
    const queryXysjsxList =  async () =>{
      if(tableStore){
        let url="/api/eps/control/main/ysjwh/queryForList";
        const response =await fetch.get(url);
         if (response.status === 200) {
          if (response.data?.length > 0) {
            let  SxData = response.data?.map(o => ({ 'id': o.id, 'label': o.zdms, 'value': o.id }));
            setSxlist(SxData);
          }else{
            setSxlist(response.data);
          }
        }
        }
    }

    const queryYsjlxList =  async () =>{

      let url="/api/eps/control/main/ysjlxwh/queryForList";
      const response =await fetch.get(url);
       if (response.status === 200) {
        if (response.data?.length > 0) {
          debugger
          let  SxData = response.data?.map(o => ({ 'id': o.id, 'label': o.mc, 'value': o.id }));
          setLxlist(SxData);
        }else{
          setLxlist(response.data);
        }
      }
  }
    queryXysjsxList();
    queryYsjlxList();
    //YhStore.queryForPage();
  }, []);

const customForm = (form) => {
    const  sxlx= form.getFieldValue("sxjcjcszsxlx");
    if(sxlx){
      handleSxlxChange(sxlx);
    }
  return (
    <>

      <Form.Item label="检测类型:" name="sxjcjcszsxlx" required rules={[{ required: true, message: '请选择检测类型' }]}>
            <Select  style={{ width: _width }} onChange={(val)=>handleSxlxChange(val)} >
              {sxjclxData.map(sxjclx => (
                <Option key={sxjclx}>{sxjclx}</Option>
              ))}
            </Select>
      </Form.Item>
      <Form.Item label="检测名称:" name="sxjcjcszname" value={secondJcmx}  required rules={[{ required: true, message: '请选择检测名称' }]}>
         <Select  style={{ width: _width }} onChange={onSecondJcmxChange}>
           {mxlist.map(jcmx => (
          <Option key={jcmx.value}>{jcmx.label}</Option>
        ))}
           </Select>
      </Form.Item>
      <Form.Item label="检测编号:" name="sxjcjcszbh">
        <Input  style={{ width: _width }} />
      </Form.Item>
       <Form.Item label="属性类型:" name="sxjcjcszfl" required rules={[{ required: true, message: '请选择属性类型' }]}>
         <Select   placeholder="请选择属性类型"   options={zsxflData} style={{width:  _width}}/>
      </Form.Item>
      <Form.Item label="元数据类型:" name="ysjlx">
         <Select   placeholder="请选择元数据类型"    options={lxlist} style={{width:  _width}} onChange={onysjlxChange}/>
      </Form.Item>
      <Form.Item label="对应属性:" name="sxjcjcszsxid" >
      <Select   showSearch placeholder="请选择对应属性"  style={{width:  _width}}
           optionFilterProp="children"
           filterOption={(input, option) =>
            option.children.indexOf(input) >= 0
          }
         >
         {sxlist.map(ysjlx => (<Option key={ysjlx.value}>{ysjlx.label}</Option> ))}
        </Select>
      </Form.Item>
      <Form.Item label="属性数值:" name="sxjcjcszz">
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="备注:" name="sxjcjcszbz" >
        <Input.TextArea  autoSize={{ minRows: 3, maxRows: 5 }}
              style={{width: _width }}/>
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj"  initialValue={getDate}>
        <Input disabled style={{ width: _width }} />
      </Form.Item>

     <Form.Item label="类型:" name="sxjcjcszlx"  initialValue='完整性'  hidden>
          <Input name="sxjcjcszlx" disabled style={{ width: _width }}  />
        </Form.Item>
      {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
    </>
  )
}
  // 全局功能按钮
  const customAction = (store: EpsTableStore) => {
    return ([
      <>
       <Button type="primary" onClick={() => returnSy()}>返回首页</Button>
      </>
    ])
  }


  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>

      </>
    );
  }


  const source: EpsSource[] = [ {
      title: '属性类型',
      code: 'sxjcjcszfl',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '检测编号',
      code: 'sxjcjcszbh',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '检测名称',
      code: 'sxjcjcszname',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let sjlist=jcdata;
        let aa = sjlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },
     {
      title: '检测类型',
      code: 'sxjcjcszsxlx',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '属性数值',
      code: 'sxjcjcszz',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '对应属性',
      code: 'sxjcjcszsxid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let alist=sxlist;
        let aa = alist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },{
      title: '备注',
      code: 'sxjcjcszbz',
      align: 'center',
      formType: EpsFormType.Input
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
    name: '完整性'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="检测编号" className="form-item" name="sxjcjcszbh"><Input placeholder="请输入检测编号" /></Form.Item >
        <Form.Item label="检测名称" className="form-item" name="sxjcjcszname"><Input placeholder="请输入检测名称" /></Form.Item >
        <Form.Item label="检测类型" className="form-item" name="sxjcjcszsxlx">
          <Select  placeholder="请选择检测类型"> {sxjclxData.map(sxjclx => (<Option key={sxjclx}>{sxjclx}</Option> ))}</Select>
        </Form.Item >
         <Form.Item label="属性类型" className="form-item" name="sxjcjcszfl">
          <Select   placeholder="请选择属性类型"   options={zsxflData} />
        </Form.Item >
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={sxjcjcszService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={700}
      //  initParams={{'jclx':'真实性'}}           //默认参数
        tableRowClick={(record) => console.log('abcef', record)}
        searchForm={searchFrom}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </EpsPanel>
    </>
  );
})

export default JcszWzx;

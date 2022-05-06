import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import sxjcjcszService from './service/JcszZsxService';
import xysjsxService from '@/services/perfortest/XysjsxService';
import { Form, Input, message, InputNumber, Select, Button, Tooltip} from 'antd';
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
  searchCode: 'sxjcjcszname'
}

const sxjclxData = ['元数据','电子', '数字化','归档信息包'];
const sxjcjcmxData =  {
     元数据: [{ value: 'sxjcxCddy', label: '长度等于' }, { value: 'sxjcxCdd', label: '长度大于' }, { value: 'sxjcxCdxy', label: '长度小于' }, { value: 'sxjcxgsh', label: '格式化' }, { value: 'sxjcxgshcd', label: '格式化长度' }, { value: 'sxjcxisnumber', label: '必须数字' }, { value: 'sxjcxdy', label: '必须等于' }, { value: 'sxjcxnumberdy', label: '必须数字，并大于' }, { value: 'sxjcxnumberxy', label: '必须数字，并小于' }
    , { value: 'sxjcxZyz', label: '值域值' }, { value: 'sxjcxRqdy', label: '日期等于' }, { value: 'sxjcxRqd', label: '日期大于' }, { value: 'sxjcxRqx', label: '日期小于' }, { value: 'sxjcxRqdanddy', label: '日期大于等于' }, { value: 'sxjcxRqxyanddy', label: '日期小于等于' }, { value: 'sxjcxBhtszf', label: '包含特殊字符' }
     ,{ value: 'GD-1-5', label: '合理性年度检测' },{ value: 'GD-1-3', label: '数据类型' },{ value: 'sxjcxSjcf', label: '数据重复性' }
    ],
    电子: [{ value: 'sxjcxwjgs', label: '扩展名' }, { value: 'sxjcxwjbl', label: '文件必录' }, { value: 'sxjcxywBb', label: '文件版本' }, { value: 'sxjcxwjywMd5', label: '文件MD5码' }, { value: 'sxjcwjsize', label: '文件属性大小' }, { value: 'sxjcwjgs', label: '文件属性格式'}, { value: 'sxjcwjname', label: '文件属性文件名称'}, { value: 'sxjcwjglwj', label: '元数据关联文件检测'}, { value: 'sxjcwjsj', label: '文件属性创建时间'}, { value: 'sxjcwjHjserver', label: '文件软硬件环境server'}, { value: 'sxjcwjHjprogram', label: '文件软硬件环境program'},{ value: 'sxjcwjHjsystem', label: '文件软硬件环境system'}],
    数字化: [{ value: 'sxjcszhtWdith', label: '尺寸Wdith' }, { value: 'sxjcszhtHgith', label: '尺寸Hgith' }, { value: 'sxjcszhtColor', label: '彩色' }, { value: 'sxjcxwjgs', label: '图片格式' }],
    归档信息包:[{ value: 'GD-1-7', label: '档号规范性 ' },{ value: 'GD-1-8', label: '元数据项数据重复性' },{ value: 'GD-1-12', label: '文件和目录文件规范性' },{ value: 'GD-1-13', label: '信息包目录结构规范性' },{ value: 'GD-1-14', label: '信息包一致性' }]};


const zsxflData = [{ value: '电子文件来源真实性', label: '电子文件来源真实性' }, { value: '电子文件元数据准确性', label: '电子文件元数据准确性' }, { value: '电子文件内容真实性', label: '电子文件内容真实性' }, { value: '元数据与内容关联一致性', label: '元数据与内容关联一致性' }, { value: '归档信息包真实性', label: '归档信息包真实性' }];

const jcdata = [{ value: 'sxjcxCddy', label: '长度等于' }, { value: 'sxjcxCdd', label: '长度大于' }, { value: 'sxjcxCdxy', label: '长度小于' }, { value: 'sxjcxgsh', label: '格式化' }, { value: 'sxjcxgshcd', label: '格式化长度' }, { value: 'sxjcxisnumber', label: '必须数字' }, { value: 'sxjcxdy', label: '必须等于' }, { value: 'sxjcxnumberdy', label: '必须数字，并大于' }, { value: 'sxjcxnumberxy', label: '必须数字，并小于' }
    , { value: 'sxjcxZyz', label: '值域值' }, { value: 'sxjcxRqdy', label: '日期等于' }, { value: 'sxjcxRqd', label: '日期大于' }, { value: 'sxjcxRqx', label: '日期小于' }, { value: 'sxjcxRqdanddy', label: '日期大于等于' }, { value: 'sxjcxRqxyanddy', label: '日期小于等于' }, { value: 'sxjcxBhtszf', label: '包含特殊字符' },{ value: 'sxjcxwjgs', label: '扩展名' }, { value: 'sxjcwjsize', label: '文件大小' }, { value: 'sxjcxwjlx', label: '类型' }, { value: 'sxjcxwjbl', label: '必须' }, { value: 'sxjcxywBb', label: '文件版本' }, { value: 'sxjcxwjywMd5', label: '文件MD5码' }
    , { value: 'sxjcszhtWdith', label: '尺寸Wdith' }, { value: 'sxjcszhtHgith', label: '尺寸Hgith' }, { value: 'sxjcszhtColor', label: '彩色' }, { value: 'sxjcxwjgs', label: '图片格式' },{ value: 'zssjly', label: '数据来源' }, { value: 'sxjcwjsize', label: '文件属性大小' }, { value: 'sxjcwjgs', label: '文件属性格式'}, { value: 'sxjcwjsj', label: '文件属性创建时间'}, { value: 'sxjcwjname', label: '文件属性文件名称'}, { value: 'sxjcwjglwj', label: '元数据关联文件检测'}, { value: 'sxjcwjHjserver', label: '文件软硬件环境server'}, { value: 'sxjcwjHjprogram', label: '文件软硬件环境program'},{ value: 'sxjcwjHjsystem', label: '文件软硬件环境system'}
   ,{ value: 'GD-1-5', label: '合理性年度检测' },{ value: 'GD-1-3', label: '数据类型' },{ value: 'GD-1-12', label: '文件和目录文件规范性' },{ value: 'GD-1-13', label: '信息包目录结构规范性' },{ value: 'GD-1-14', label: '信息包一致性' },{ value: 'GD-2-9', label: '归档范围检测'},{ value: 'GD-3-1', label: '信息包中元数据的可读性'},{ value: 'GD-3-2', label: '目标数据库中元数据可访问性'},{ value: 'GD-1-7', label: '档号规范性 ' },{ value: 'GD-1-8', label: '元数据项数据重复性' },{ value: 'GD-4-3', label: '载体中多余文件'},{ value: 'GD-3-8', label: '信息包中包含的内容数据格式合规范性'},{ value: 'sxjcxSjcf', label: '数据重复性' }];

const JcszZsx = observer((props) => {

const ref = useRef();
const _width = 400;

const [sxlist, setSxlist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [lxlist, setLxlist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [mxlist, setJcmx]= useState<Array<{id:string;label:string;value:string}>>(sxjcjcmxData[sxjclxData[0]]);
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


  // 创建右侧表格Store实例
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
      <Form.Item label="检测类型:" name="sxjcjcszsxlx" tooltip="注：检测为：值域值时,需在数值里填入检测的日期格式如'yyyy-MM-dd', 若检测为日期时：需在数值里填入比较的基体日期如'2020-01-03',若检测为特殊字符时：需在数值里填入需检测的包含的特殊字符" required rules={[{ required: true, message: '请选择检测类型' }]}>
          <Select  style={{ width: _width }} onChange={handleSxlxChange}  >
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
         <Select   placeholder="请选择属性类型"    options={zsxflData} style={{width:  _width}}/>
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


     <Form.Item label="类型:" name="sxjcjcszlx"  initialValue='真实性'  hidden>
          <Input name="sxjcjcszlx" disabled style={{ width: 300 }}  />
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
    name: '真实性'
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

export default JcszZsx;

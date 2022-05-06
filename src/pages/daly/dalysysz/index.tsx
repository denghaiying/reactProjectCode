import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import dalysyszService from './service/dalysyszService';
import { Form, Input, message, Select, FormInstance, InputNumber} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import fetch from "../../../utils/fetch";

import lydj from './assets/img/icon_lydj.png'; //利用登记
import daly from './assets/img/icon_daly.png'; //档案利用
import dlyqktj from './assets/img/icon_lyqktj.png'; //利用情况统计
import hyda from './assets/img/icon_hyda.png'; //婚姻档案
import dszn from './assets/img/icon_dszn.png'; //独生子女
import zqda from './assets/img/icon_zqda.png'; //知青档案
import xzda from './assets/img/icon_xzda.png'; //新增档案

import hunyindengji from './assets/img/img_hunyindengji.png';
import dushengzinv from './assets/img/img_dushengzinv.png';
import zhaogong from './assets/img/img_zhaogong.png';
import zhiqinghuihu from './assets/img/img_zhiqinghuihu.png';
import shanlin from './assets/img/img_shanlin.png';
import zaishengyu from './assets/img/img_zaishengyu.png';
import fangchan from './assets/img/img_fangchan.png';
import tuiwujunren from './assets/img/img_tuiwujunren.png';
import { Label } from '@icon-park/react';

const yhmc = SysStore.getCurrentUser().yhmc;

const lxData = [{value: "1", label: "电子阅览室首页"},{value: "2", label: "利用首页"}];
const tpData =[{value: "img01", label: "ORACLE"},{value: "img02", label: "SQLSERVER"}, {value: "img03", label: "MYSQL"},
                                {value: "img03", label: "H2"},{value: "img04", label: "人大金仓"},{value: "img05", label: "达梦"},{value: "img06", label: "达梦"},{value: "img07", label: "达梦"},{value: "img08", label: "达梦"} ];

const sxjcjcmxData =  {
  1: [{value: "img01", label: "Ylimg01"},{value: "img02", label: "Ylimg02"}, {value: "img03", label:"Ylimg03"},
   {value: "img04", label: "Ylimg04"},{value: "img05", label: "Ylimg05"},{value: "img06", label: "Ylimg06"},
  {value: "img07", label:"Ylimg07"},{value: "img08", label: "Ylimg08"} ],
  2:[{ value: 'img01', label: 'Lyimg01' }, { value: 'img02', label: 'Lyimg02' },{value: 'img04', label:'Lyimg04'}]
          
};                                
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const Dalysysz = observer((props) => {

const [form, setForm] = useState();

const tableProp: ITable = {
  disableCopy: true,
  searchCode: 'dakmc',
  onEditClick: (form, record) => {
    setSecondJcmx(sxjcjcmxData[record.lx]);
    setItemimg('');
  }
}

const [daklist, setDaklist]= useState<Array<{id:string;label:string;value:string}>>([]);


const [secondJcmx, setSecondJcmx] = React.useState(sxjcjcmxData[0]);
const [itemimg, setItemimg] = React.useState();

const handleSxlxChange = value => {
  setSecondJcmx(sxjcjcmxData[value]);
};
const handleChange = (value,b) => {
  var imgs='';
  switch (b.label) {
    case 'Ylimg01': imgs=hunyindengji; break;
    case 'Ylimg02': imgs=dushengzinv;break;
    case 'Ylimg03':
      imgs=zhaogong; break;
    case 'Ylimg04':
      imgs=zhiqinghuihu; break;
    case 'Ylimg05':
      imgs=shanlin; break;
    case 'Ylimg06':
      imgs=zaishengyu; break;
    case 'Ylimg07':
      imgs=fangchan; break;
    case 'Ylimg08':
      imgs=tuiwujunren; break;
    case 'Lyimg01':
      imgs=hyda; break;
    case 'Lyimg02':
      imgs=dszn; break;
    case 'Lyimg04':
      imgs=zqda; break;
  }
  setItemimg(imgs);
};

const ref = useRef();

const _width = 380


const customForm = (form: FormInstance) => {

  return (
    <>
      <Form.Item label="编号:" name="bh" required rules={[{ required: true, message: '请输入名称' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="显示名称:" name="dakmc"  required rules={[{ required: true, message: '请输入显示名称' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="对应档案库:" name="dakid" required rules={[{ required: true, message: '请选择对应档案库' }]}>
        <Select   placeholder="对应档案库"   options={daklist} style={{width:  _width}}/>
      </Form.Item>
      <Form.Item label="类型:" name="lx" required rules={[{ required: true, message: '类型' }]}>
         <Select   placeholder="类型"   options={lxData} style={{width:  _width}}  onChange={(val)=>handleSxlxChange(val)}/>
      </Form.Item>
      <Form.Item label="图片:" name="tph"  required rules={[{ required: true, message: '请选择对应档案库' }]}>
        <Select   placeholder="类型"   options={secondJcmx} style={{width:  _width}}  onChange={(val,va)=>handleChange(val,va)}/>
      </Form.Item>
      <Form.Item label="序号:" name="xh"  required rules={[{ required: true, message: '请输入连接密码' }]}>
        <InputNumber  type="inline" step={1}  name="fgxh"  min={1}  max={2000}  defaultValue={0} style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
        <Input disabled  style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj" initialValue={getDate}>
        <Input disabled  style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="图片预览:">
          <img src={itemimg}></img>
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
      <></>
    ])
  }

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(dalysyszService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>

      </>
    );
  }
  useEffect(() => {
    const querydakList =  async () =>{
        let url="/api/eps/control/main/dak/queryForList";
        const response =await fetch.post(url);
        if (response.status === 200) {
          if (response.data.length > 0) {
            let  dakData = response.data.map(o => ({ 'id': o.id, 'label': o.mc, 'value': o.id }));
            setDaklist(dakData);
          }else{
            setDaklist(response.data);
          }
        }
    }
    querydakList();
  }, []);

  const source: EpsSource[] = [ {
      title: '编号',
      code: 'bh',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '对应档案库',
      code: 'dakid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let lxlist=daklist;
        let aa = lxlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },{
      title: '显示名称',
      code: 'dakmc',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '图片',
      code: 'tph',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '序号',
      code: 'xh',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '类型',
      code: 'lx',
      align: 'center',
      formType: EpsFormType.Input,   
      render: (text, record, index) => {
        let lxlist=lxData;
        let aa = lxlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
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
    name: '利用首页设置'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="显示名称" className="form-item" name="dakmc"><Input placeholder="请输入显示名称" /></Form.Item >
        <Form.Item label="编号" className="form-item" name="bh"><Input placeholder="请输入编号" /></Form.Item >
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={dalysyszService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={600}
        searchForm={searchFrom}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </EpsPanel>
    </>
  );
})

export default Dalysysz;

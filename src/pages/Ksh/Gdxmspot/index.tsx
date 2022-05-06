import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import gdxmspotService from './service/GdxmspotService';
import { Form, Input, message, InputNumber, Select} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone, UploadOutlined  } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import gdxmService from '../Gdxm/service/GdxmService';

const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');


const Gdxmspot = observer((props) => {
const [gdxmlist, setGdxmlist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [gdxmstatelist, setGdxmstatelist]= useState<Array<{id:string;label:string;value:string}>>([]);
const ref = useRef();

const handleChange = async(value) => {
      let url="/api/eps/ksh/gdxmstate/findList";
        const response =await fetch.post(url,{gdxmid:value});
         if (response.status === 200) {
          if (response.data?.length > 0) {
            let  SxData = response.data?.map(o => ({ 'id': o.id, 'label': o.gdxmstateListmc, 'value': o.gdxmstateListmc }));
            setGdxmstatelist(SxData);
          }else{
            setGdxmstatelist(response.data);
          }
        }
}

const tableProp: ITable = {
  disableCopy: true,
  searchCode: 'gdmapmc',
  onAddClick: (form) => {
      handleChange('1111');
  },
  onEditClick:async (form, record) =>{
    handleChange(record.gdmapxmid);
  },
}
const _width=400;

const customForm = () => {
  return (
    <>
      <Form.Item label="项目名称:" name="gdmapmc" required rules={[{ required: true, message: '请输入项目名称' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="设置级别:" name="gdmapjb" required rules={[{ required: true, message: '请输入设置级别' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
       <Form.Item label="项目经度:" name="gdmapjd" required rules={[{ required: true, message: '请输入项目经度' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="项目纬度:" name="gdmapwd" required rules={[{ required: true, message: '请输入项目纬度' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="所属项目:" name="gdmapxmid" required rules={[{ required: true, message: '请选择所属项目' }]} >
         <Select   placeholder="所属项目"   options={gdxmlist} style={{width:  _width }} onChange={handleChange}/>
      </Form.Item>
      <Form.Item label="项目状态:" name="gdmapstate" required rules={[{ required: true, message: '请选择项目状态' }]}>
         <Select   placeholder="项目状态"   options={gdxmstatelist} style={{width:  _width }}/>
      </Form.Item>
       <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
        <Input disabled  style={{ width: _width }} />
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
      </>
    ])
}

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(gdxmspotService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
      </>
    );
  }
useEffect(() => {
    const queryGdxmList =  async () =>{
      if(tableStore){
        let url="/api/eps/ksh/gdxm/findList";
        const response =await fetch.post(url,{});
         if (response.status === 200) {
          if (response.data?.length > 0) {
            let  SxData = response.data?.map(o => ({ 'id': o.id, 'label': o.gdxmmc, 'value': o.id }));
            setGdxmlist(SxData);
          }else{
            setGdxmlist(response.data);
          }
        }
        }
    }
    queryGdxmList();
}, []);

  const source: EpsSource[] = [ {
      title: '项目名称',
      code: 'gdmapmc',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '设置级别',
      code: 'gdmapjb',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '项目经度',
      code: 'gdmapjd',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '项目纬度',
      code: 'gdmapwd',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '所属项目',
      code: 'gdmapxmid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let xmlist=gdxmlist;
        let aa = xmlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    }, {
      title: '项目状态',
      code: 'gdmapstate',
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
    name: '地图项目状态'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="项目状态编号" className="form-item" name="gdxmstateListbh"><Input placeholder="请输入项目状态编号" /></Form.Item >
        <Form.Item label="项目状态名称" className="form-item" name="gdxmstateListmc"><Input placeholder="请输入项目状态名称" /></Form.Item >
        <Form.Item label="所属项目" name="gdmapxmid"><Select   placeholder="所属项目"   options={gdxmlist} onChange={handleChange}/></Form.Item>
        <Form.Item label="项目状态" name="gdmapstate" > <Select   placeholder="项目状态"   options={gdxmstatelist} /></Form.Item>
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        treeService={gdxmService}                  // 左侧树 实现类，必填
        tableService={gdxmspotService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={640}
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

export default Gdxmspot;

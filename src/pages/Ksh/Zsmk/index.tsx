import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import zsmkService from './service/ZsmkService';
import { Form, Input, message,InputNumber, Radio, Select} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone, UploadOutlined  } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import fgService from '../Fg/service/FgService';

const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  disableCopy: true,
  searchCode: 'zsmkmc',
  onAddClick:(form) =>{
    form.setFieldsValue({ zsmkxh: 1 });
  },
}

const Zsmk = observer((props) => {

const [fglist, setFglist]= useState<Array<{id:string;label:string;value:string}>>([]);
const ref = useRef();

const _width=400;
const customForm = () => {
  return (
    <>
      <Form.Item label="菜单编号:" name="zsmkbh" required rules={[{ required: true, message: '请输入菜单编号' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="菜单名称:" name="zsmkmc" required rules={[{ required: true, message: '请输入菜单名称' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="所属系统:" name="zsmkfgid" required rules={[{ required: true, message: '请选择所属系统' }]}>
         <Select   placeholder="所属系统"  options={fglist} style={{width:  _width }}/>
      </Form.Item>
        <Form.Item label="菜单序号:" name="zsmkxh" >
           <InputNumber  type="inline" step={1}  name="zsmkxh"  min={1}  max={2000}  defaultValue={1} style={{ width: _width }} />
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
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(zsmkService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
      </>
    );
  }
 useEffect(() => {
    const queryFgList =  async () =>{
      if(tableStore){
        let url="/api/eps/ksh/fg/findList";
        const response =await fetch.post(url,{});
         if (response.status === 200) {
          if (response.data?.length > 0) {
            let  SxData = response.data?.map(o => ({ 'id': o.id, 'label': o.fgmc, 'value': o.id }));
            setFglist(SxData);
          }else{
            setFglist(response.data);
          }
        }
        }
    }
    queryFgList();
    //YhStore.queryForPage();
  }, []);

  const source: EpsSource[] = [ {
      title: '菜单编号',
      code: 'zsmkbh',
      align: 'center',
      formType: EpsFormType.Input,
      width:200
    }, {
      title: '菜单名称',
      code: 'zsmkmc',
      align: 'center',
      formType: EpsFormType.Input,
      width:350
    }, {
      title: '所属系统',
      code: 'zsmkfgid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let xfglist=fglist;
        let aa = xfglist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
      width:200
    },
     {
      title: '菜单序号',
      code: 'zsmkxh',
      align: 'center',
      formType: EpsFormType.Input,
      width:120
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      width:200
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      width:200
    }]
  const title: ITitle = {
    name: '菜单管理'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="编号" className="form-item" name="zsmkbh"><Input placeholder="请输入编号" /></Form.Item >
        <Form.Item label="名称" className="form-item" name="zsmkmc"><Input placeholder="请输入名称" /></Form.Item >
        <Form.Item label="名称" className="form-item" name="zsmkfgid"><Select   placeholder="所属系统"  options={fglist} /></Form.Item >      
        </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        treeService={fgService}                  // 左侧树 实现类，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={zsmkService}             // 右侧表格实现类，必填
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

export default Zsmk;

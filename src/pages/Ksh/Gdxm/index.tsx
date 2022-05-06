import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import gdxmService from './service/GdxmService';
import { Form, Input, message,InputNumber,Select,} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone, UploadOutlined  } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import gmapService from '../Gmap/service/GmapService';

const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  disableCopy: true,
  searchCode: 'gdxmmc',
}

const Gdxm = observer((props) => {

const [gmaplist, setGmaplist]= useState<Array<{id:string;label:string;value:string}>>([]);
const ref = useRef();

const _width=400;
const customForm = () => {
  return (
    <>
      <Form.Item label="项目编号:" name="gdxmbh" required rules={[{ required: true, message: '请输入项目编号' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="项目名称:" name="gdxmmc" required rules={[{ required: true, message: '请输入项目名称' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="项目类型:" name="gdxmlx" required rules={[{ required: true, message: '请输入项目类型' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="项目经理:" name="gdxmjlr" required rules={[{ required: true, message: '请输入项目经理' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="项目单位:" name="gdxmdw" required rules={[{ required: true, message: '请输入项目单位' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="项目介绍：" name="gdxmjs">
           <Input.TextArea  autoSize={{ minRows: 5, maxRows: 8 }}
              style={{width: _width }} />
        </Form.Item>
        <Form.Item label="所属地图:" name="gdxmgmapid" required rules={[{ required: true, message: '请选择所属地图' }]}>
         <Select   placeholder="所属地图"   options={gmaplist} style={{width:  _width }}/>
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
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(gdxmService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
      </>
    );
  }
useEffect(() => {
    const queryGmapList =  async () =>{
      if(tableStore){
        let url="/api/eps/ksh/gmap";
        const response =await fetch.get(url);
         if (response.status === 200) {
          if (response.data?.length > 0) {
            let  SxData = response.data?.map(o => ({ 'id': o.id, 'label': o.gmapmc, 'value': o.id }));
            setGmaplist(SxData);
          }else{
            setGmaplist(response.data);
          }
        }
        }
    }
    queryGmapList();
}, []);

  const source: EpsSource[] = [ {
      title: '项目编号',
      code: 'gdxmbh',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '项目名称',
      code: 'gdxmmc',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '项目类型',
      code: 'gdxmlx',
      align: 'center',
      formType: EpsFormType.Input
    },  {
      title: '项目经理',
      code: 'gdxmjlr',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '项目单位',
      code: 'gdxmdw',
      align: 'center',
      formType: EpsFormType.Input
    },  {
      title: '项目介绍',
      code: 'gdxmjs',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '所属地图',
      code: 'gdxmgmapid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let fglist=gmaplist;
        let aa = fglist.filter(item => {
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
    name: '地图设置'
  }


  const searchFrom = () => {
    return (
      <>
         <Form.Item label="项目编号" name="gdxmbh"> <Input placeholder="请输入项目编号"  /> </Form.Item>
        <Form.Item label="项目名称" name="gdxmmc"><Input placeholder="请输入项目名称"/></Form.Item>
        <Form.Item label="所属地图" name="gdxmgmapid"><Select   placeholder="所属地图"   options={gmaplist}/></Form.Item>
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        treeService={gmapService}                  // 左侧树 实现类，必填
        tableService={gdxmService}             // 右侧表格实现类，必填
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

export default Gdxm;

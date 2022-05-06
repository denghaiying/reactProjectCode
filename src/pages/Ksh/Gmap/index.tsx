import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import gmapService from './service/GmapService';
import { Form, Input, message,InputNumber,Select, Tooltip} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone, UploadOutlined  } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import zsmkService from '../Zsmk/service/ZsmkService';

const yhmc = SysStore.getCurrentUser().yhmc;
const xsData =[{value: 0, label: '不显示'},{value: 1, label: '显示'}];
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  disableCopy: true,
  searchCode: 'gmapmc',
  onAddClick: (form) => {
    form.setFieldsValue({ gmapwidth: 1 });
    form.setFieldsValue({ gmapheight: 1 });
  },
}

const Gmap = observer((props) => {

const [zsmklist, setZsmklist]= useState<Array<{id:string;label:string;value:string}>>([]);
const ref = useRef();
const _width=400;

const customForm = () => {
  return (
    <>
    <div style={{ margin: '0 0 10px 480px' }}>
     <Tooltip   title="图表宽度、图表高度、横坐标、纵坐标设置说明：图表的显示区域划分为36*36的单元格，每个图表的宽高按照单元格的数量来表示。显示区域的原点为左上角，可用相对位置的单元格数表示横纵坐标，体现图表所在的位置">
      <font color="#40a9ff">设置说明</font>
    </Tooltip>
    </div>
      <Form.Item label="默认城市名称:" name="gmapmc" required rules={[{ required: true, message: '请输入默认城市名称' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
       <Form.Item label="图表宽度:" name="gmapwidth" tooltip="取值范围1-36，表示图表宽度的单元格数" required rules={[{ required: true, message: '请输入图表宽度' }]}>
             <InputNumber  type="inline" step={1}  name="gmapwidth"  min={1}  max={36}   style={{ width: _width }} />
      </Form.Item>

       <Form.Item label="图表高度:" name="gmapheight" tooltip="取值范围1-36，表示图表高度的单元格数" required rules={[{ required: true, message: '请输入图表高度' }]} >
            <InputNumber  type="inline" step={1}  name="gmapheight"  min={1}  max={36}  style={{ width: _width }} />
      </Form.Item>

        <Form.Item label="横坐标:" name="gmappositionX" tooltip="取值范围 0-35，表情所在位置距离显示区域左边边界的单元格数">
                <InputNumber  type="inline" step={1}  name="gmappositionX"  min={0}  max={35}  style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="纵坐标:" name="gmappositionY" tooltip="取值范围 0-35，表情所在位置距离显示区域顶部边界的单元格数"  >
           <InputNumber  type="inline" step={1}  name="gmappositionY"  min={0}  max={35}   style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="显示地图:" name="gmapmenuid" required rules={[{ required: true, message: '请选择显示地图' }]}>
         <Select   placeholder="显示地图"   options={xsData} style={{width:  _width }}/>
      </Form.Item>
        <Form.Item label="所属菜单:" name="gmapzsmkid" required rules={[{ required: true, message: '请选择所属菜单' }]}>
         <Select   placeholder="所属菜单"   options={zsmklist} style={{width:  _width }}/>
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
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(gmapService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
      </>
    );
  }
useEffect(() => {
    const queryZsmkList =  async () =>{
      if(tableStore){
        let url="/api/eps/ksh/zsmk";
        const response =await fetch.get(url);
         if (response.status === 200) {
          if (response.data?.length > 0) {
            let  SxData = response.data?.map(o => ({ 'id': o.id, 'label': o.zsmkmc, 'value': o.id }));
            setZsmklist(SxData);
          }else{
            setZsmklist(response.data);
          }
        }
        }
    }
    queryZsmkList();
}, []);

  const source: EpsSource[] = [ {
      title: '默认城市名称',
      code: 'gmapmc',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '显示地图',
      code: 'gmapmenuid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let xslist=xsData;
        let aa = xslist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },{
      title: '图表宽度',
      code: 'gmapwidth',
      align: 'center',
      formType: EpsFormType.Input
    },
       {
      title: '图表高度',
      code: 'gmapheight',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '横坐标',
      code: 'gmappositionX',
      align: 'center',
      formType: EpsFormType.Input
    },  {
      title: '纵坐标',
      code: 'gmappositionY',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '所属菜单',
      code: 'gmapzsmkid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let fglist=zsmklist;
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
        <Form.Item label="城市名称" className="form-item" name="gmapmc"><Input placeholder="请输入城市名称" /></Form.Item >
        <Form.Item label="所属菜单:" name="gmapzsmkid"> <Select   placeholder="所属菜单"  options={zsmklist} /> </Form.Item>
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        treeService={zsmkService}                  // 左侧树 实现类，必填
        tableService={gmapService}             // 右侧表格实现类，必填
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

export default Gmap;

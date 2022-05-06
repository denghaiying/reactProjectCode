import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import eepgsmbService from './service/EepgsmbService';
import { Form, Input, message,InputNumber , Select} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  disableCopy: true,
  searchCode: 'mc'
}


const lxData =[{value: 0, label: '通用'},{value: 1, label: '长期保存'}];

const Eepgsmb = observer((props) => {
  const eepmblxList = [
    { value: 0, label: '一文一件' },
    {
      value: 1,
      label: '案卷',
    },
    {
      value: 2,
      label: '党政机关一文一件',
    },
    {
      value: 3,
      label: '会计档案一文一件',
    },
    {
      value: 4,
      label: '财务档案案卷',
    },
    {
      value: 5,
      label: '苏州地铁案卷',
    },
    {
      value: 6,
      label: '中交二公局一文一件',
    },
    {
      value: 7,
      label: '溧水档案馆一文一件',
    },
    {
      value: 8,
      label: '申万宏源案卷',
    },
  ];

  const eepmbtypeList = [
    { value: 0, label: '标准版(T48)' },
    {
      value: 1,
      label: '档案库版',
    },
  ];

  const [mblist, setMblist]= useState<Array<{id:string;label:string;value:string}>>([]);

const ref = useRef();
const _width=400;

const customForm = () => {

  return (
    <>
      <Form.Item label="编号:" name="bh" required rules={[{ required: true, message: '请输入编号' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="名称:" name="mc" required rules={[{ required: true, message: '请输入名称' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="模板:" name="mb" required>
          <Select
            placeholder="请选择"
            options={mblist}
            style={{ width: 300 }}
          />
        </Form.Item>
      <Form.Item label="类型:" name="lx" required>
          <Select style={{ width: 300 }} placeholder="请选择" options={lxData} />
        </Form.Item>

        <Form.Item label="数据包模板类型:" name="eepmbtype" required>
          <Select
            placeholder="请选择"
            options={eepmbtypeList}
            style={{ width: 300 }}
          />
        </Form.Item>
        <Form.Item label="数据包模版结构:" name="eepmblx" required>
          <Select
            placeholder="请选择"
            options={eepmblxList}
            style={{ width: 300 }}
          />
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
  const customAction = (store: EpsTableStore) => {
    return ([
      <></>
    ])
  }

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(eepgsmbService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>

      </>
    );
  }
  useEffect(() => {
    const queryFlList =  async () =>{
      if(tableStore){
        let url="/api/eps/control/main/mb/queryForPage?dwid="+SysStore.getCurrentCmp().id;
        const response =await fetch.get(url);
         if (response.status === 200) {
          if (response.data?.length > 0) {
            let  SxData = response.data?.map(o => ({ 'id': o.id, 'label': o.mc, 'value': o.id }));
            setMblist(SxData);
          }else{
            setMblist(response.data);
          }
        }
        }
    }
    queryFlList();
    //YhStore.queryForPage();
  }, []);

  const source: EpsSource[] = [{
      title: '名称',
      code: 'mc',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '编号',
      code: 'bh',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '类型',
      code: 'lx',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text) => {
        for (var i = 0; i < lxData.length; i++) {
          var lx = lxData[i];
          if (lx.value === text) {
            return lx.label;
          }
        }
      }
    },{
      title: '模板',
      code: 'mb',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text) => {
        for (var i = 0; i < mblist.length; i++) {
          var lx = mblist[i];
          if (lx.value === text) {
            return lx.label;
          }
        }
      }
    },
    {
      title: '数据包模板类型',
      code: 'eepmbtype',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text) => {
        for (var i = 0; i < eepmbtypeList.length; i++) {
          var lx = eepmbtypeList[i];
          if (lx.value === text) {
            return lx.label;
          }
        }
      }
    }, {
      title: '数据包模版结构',
      code: 'eepmblx',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text) => {
        for (var i = 0; i < eepmblxList.length; i++) {
          var lx = eepmblxList[i];
          if (lx.value === text) {
            return lx.label;
          }
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
    name: 'EEP包格式模板'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="编号" className="form-item" name="bh"><Input placeholder="请输入编号" /></Form.Item >
        <Form.Item label="名称" className="form-item" name="mc"><Input placeholder="请输入名称" /></Form.Item >
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={eepgsmbService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={700}
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

export default Eepgsmb;

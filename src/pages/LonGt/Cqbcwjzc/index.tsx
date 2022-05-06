import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import cqbcwjzcService from './service/CqbcwjzcService';
import { Form, Input, message, Select, FormInstance } from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';

import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;

/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const Cqbcwjzc = observer((props) => {

const tableProp: ITable = {
  disableAdd: true,
  disableEdit: true,
  disableDelete: true,
  disableCopy: true,
  searchCode: 'ext',
}

const ref = useRef();

const _width = 380


const customForm = (form: FormInstance) => {

  return (
    <>

      <Form.Item label="类型:" name="ext" required rules={[{ required: true, message: '请输入类型' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="备注:" name="bz"  >
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
        <Input disabled  style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj" initialValue={getDate}>
        <Input disabled  style={{ width: _width }} />
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

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>

      </>
    );
  }
  useEffect(() => {

    //YhStore.queryForPage();
  }, []);

  const source: EpsSource[] = [ {
      title: '类型',
      code: 'ext',
      align: 'center',
      formType: EpsFormType.Input,
      width:400
    },{
      title: '备注',
      code: 'bz',
      align: 'center',
      formType: EpsFormType.Input,
      width:400
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      width:380
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      width:380
    }]
  const title: ITitle = {
    name: '文件注册'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="类型" className="form-item" name="ext"><Input placeholder="请输入类型" /></Form.Item >
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={cqbcwjzcService}             // 右侧表格实现类，必填
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

export default Cqbcwjzc;

import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import frontIntService from './service/FrontIntService';
import { Form, Input, message, Radio, Switch } from 'antd';
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

const tableProp: ITable = {
  tableSearch: false,
  disableCopy: true,
  searchCode: 'name'
}

const FrontInt = observer((props) => {

const ref = useRef();

const customForm = () => {

  return (
    <>
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
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(frontIntService));

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
      title: '编号',
      code: 'code',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '字段',
      code: 'field',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '表名',
      code: 'tb',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '查询字段',
      code: 'search',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '页数',
      code: 'page',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '每页大小',
      code: 'size',
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
    name: '前置接口'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="名称" className="form-item" name="name"><Input placeholder="请输入名称" /></Form.Item >
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={frontIntService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={1100}
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

export default FrontInt;

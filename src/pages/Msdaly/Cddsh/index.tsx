import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import React, { useEffect, useState, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import {
  Form,
  Input,
  TreeSelect,
  Row,
  Col,
  Select,
  Tooltip,
  Button,
  message,
} from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import { ArrowDownOutlined } from '@ant-design/icons';
import SysStore from '../../../stores/system/SysStore';
import moment from 'moment';
import fetch from '../../../utils/fetch';
import CddshService from './service/CddshService';
import Dshyw from './dshyw';

const FormItem = Form.Item;
/**
 * 民生档案利用---待审核业务
 */
const Cddsh = observer((props) => {
  const ref = useRef();
  const location: locationType = props.location;
  const cddshParams = location.query;

  useEffect(() => {
    console.log(cddshParams);
    debugger;
  }, []);
  /**
   * childStore
   */
  const CddshStore = useLocalObservable(() => ({}));

  // 高级搜索框
  const searchFrom = () => {
    return (
      <>
        <FormItem label="利用者姓名" name="lyzxm">
          <Input style={{ width: 300 }} placeholder="请输入利用者姓名" />
        </FormItem>
      </>
    );
  };
  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
    disableEdit: true, // 是否禁用编辑
    disableAdd: true, // 是否使用新增
    disableDelete: true,
  };

  // 表单名称
  const title: ITitle = {
    name: '待审核业务',
  };

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '查档档案馆',
      code: 'cdgmc',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '受理流水号',
      code: 'id',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '受理时间',
      code: 'jdsj',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '受理档案馆',
      code: 'sldagmc',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '受理人',
      code: 'jdr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '办理状态',
      code: 'status',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
      render: (text, record, index) => {
        if (text === 0) {
          return '待受理申请';
        }
        if (text === 3) {
          return '待审核';
        }
        if (text === 4) {
          return '待出证';
        }
        if (text === 7) {
          return '完成';
        }
      },
    },
  ];
  // 自定义表格行按钮
  const customTableAction = (text, record, index, store) => {
    const res: any[] = [];
    res.push(<Dshyw record={record} key={`Dshyw${index}`} store={store} />);
    return res;
  };
  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={CddshService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        initParams={cddshParams}
        formWidth={500}
        searchForm={searchFrom} // 高级搜索查询框
        customTableAction={customTableAction} // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
      />
    </>
  );
});

export default Cddsh;

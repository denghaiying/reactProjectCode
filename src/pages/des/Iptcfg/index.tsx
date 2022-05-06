import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { useEffect, useRef, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import IptcfgService from './IptcfgService';
import SysStore from '../../../stores/system/SysStore';
import moment from 'moment';
import IpapplyStore from '@/stores/des/IpapplyStore';

const Iptcfg = observer((props) => {
  const ref = useRef();
  const [formDisabled, setDisabled] = useState(false);

  // 获取当前用户名称和维护时间
  const whr = SysStore.getCurrentUser().yhmc;
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');

  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: true,
    disableDelete: false,
    disableCopy: true,
    disableAdd: false,
    disableEdit: false,
    searchCode: 'name',
  }

  // 表单名称
  const title: ITitle = {
    name: '检测设置',
  }

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '类型',
      code: 'type',
      align: 'center',
      formType: EpsFormType.Select,
      width: 100,
      render: (text: string) => (IpapplyStore.typelist[text] || text),
      dataSource: IpapplyStore.typelistArray(),
    },
    {
      title: '编码',
      code: 'code',
      align: 'center',
      formType: EpsFormType.Input,
      width: 50,
    },
    {
      title: '名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200
    },
    {
      title: '表达式',
      code: 'expr',
      align: 'center',
      formType: EpsFormType.TextArea,
      width: 300,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      disabled: true,
      width: 120,
      defaultValue: whr
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      disabled: true,
      width: 160,
      defaultValue: whsj
    },
  ]

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={IptcfgService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={500}
      >
      </EpsPanel>
    </>
  );
})

export default Iptcfg;


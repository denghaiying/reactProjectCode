import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { Button, message } from 'antd';
import {Message } from '@alifd/next';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { SmileOutlined } from '@ant-design/icons';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import JcsqmxService from './Service/JcsqmxService';
import IpapplyStore from '../../../stores/des/IpapplyStore';
import ZhuLx from './ZhuLX';
import YuanWenZlx from './YuanWenZlx';
import BaoCunWmb from './BaoCunWmb';
import ChongMoBbdr from './ChongMoBbdr';
import e from '@umijs/deps/compiled/express';

const SetInfo = observer((props) => {
  const { values } = props;
  const ref = useRef();
  const [zlxvisible, setZlxvisible] = useState(false);
  const [yuanwenvisible, setYuanwenvisible] = useState(false);
  const [template, setTemplate] = useState(false);
  const [module, setModule] = useState(false);

  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: true,
    disableCopy: true,
    disableDelete: false,
    disableEdit: true,
    disableAdd: true,
    searchCode: 'zlx',
  };

  // 表单名称
  const title: ITitle = {
    name: '检测申请明细',
  };

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '检测类型',
      code: 'iptcfgType',
      align: 'center',
      formType: EpsFormType.Input,
      dataSource: IpapplyStore.typelistArray(),
    },
    {
      title: '检测对象',
      code: 'zlx',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '检测编码',
      code: 'iptcfgCode',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '检测名称',
      code: 'iptcfgName',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '检测表达式',
      code: 'expr',
      align: 'center',
      formType: EpsFormType.Input,
    },
  ];
  const onZLXSetClick = () => {
    setZlxvisible(true);
  };
  const onYuanWenSetClick = () => {
    setYuanwenvisible(true);
  };
  const onsatAction = () => {
    setTemplate(true);
  };
  /**
   * 从模版导入
   */
  const importFromTempl = () => {
    // if (IpapplyStore.opt === 'add') {
    //   message.error('请先将该条数据保存再点击');
    // } else {
      IpapplyStore.queryModule().then(() => {
        setModule(true);
      }).catch((err)=>{
        Message.error("服务器内部异常");
      });
    // }
  };

  //自定义布局组件（上班、下班按钮）
  const customAction = (store: EpsTableStore) => {
    return [
      <>
        {(values.jcfw === 'A' || values.jcfw === 'B') && (
          <Button
            type="primary"
            style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }}
            icon={<SmileOutlined />}
            onClick={onZLXSetClick}
          >
            著录项检测设置
          </Button>
        )}
        {(values.jcfw === 'A' || values.jcfw === 'C') && (
          <Button
            type="primary"
            style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }}
            icon={<SmileOutlined />}
            onClick={onYuanWenSetClick}
          >
            原文检测设置
          </Button>
        )}
        {
          <Button
            type="primary"
            style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }}
            icon={<SmileOutlined />}
            onClick={onsatAction}
          >
            保存为模板
          </Button>
        }
        {
          <Button
            type="primary"
            style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }}
            icon={<SmileOutlined />}
            onClick={importFromTempl}
          >
            从模板导入
          </Button>
        }
      </>,
    ];
  };
  return (
    <div style={{ height: 500 }}>
      <EpsPanel
        initParams={{ sqid: IpapplyStore.editRecord.id }}
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={JcsqmxService} // 右侧表格实现类，必填
        formWidth={500}
        ref={ref}
        customAction={customAction} // 自定义全局按钮（如新增、导入、查询条件、全局打印 等），选填
      ></EpsPanel>
      {zlxvisible && (
        <ZhuLx
          zlxvisible={zlxvisible}
          setZlxvisible={setZlxvisible}
          tableStore={ref.current?.getTableStore()}
        />
      )}
      {yuanwenvisible && (
        <YuanWenZlx
          zlxvisible={yuanwenvisible}
          setZlxvisible={setYuanwenvisible}
          tableStore={ref.current?.getTableStore()}
        />
      )}
      {template && (
        <BaoCunWmb
          zlxvisible={template}
          setZlxvisible={setTemplate}
          tableStore={ref.current?.getTableStore()}
        />
      )}
      {module && (
        <ChongMoBbdr
          zlxvisible={module}
          setZlxvisible={setModule}
          tableStore={ref.current?.getTableStore()}
        />
      )}
    </div>
  );
});
export default SetInfo;

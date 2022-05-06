import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import jcjgzService from './service/JcjgzService';
import { Form, Input, message, Radio, Switch, Select, Button} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";

import {BarChartOutlined} from "@ant-design/icons";

import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;

/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const tableProp: ITable = {
  disableCopy: true,
  disableEdit: true,
  disableAdd: true,
  disableDelete: true,
  searchCode: 'xsxjcjgzjcbc',
  rowSelection:{
    type:'radio'
    }
  }

const Jcjgz = observer((props) => {
  const ref = useRef();

  const onOpenpdf = async (value) => {
    const response =await fetch.post("/api/api/sxjcjgz/createPdf?id="+value);
        if (response.status === 201) {
           window.open("/api/api/sxjcjgz/preview?patch="+response.data);
        }
  };

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
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(jcjgzService));
    // 自定义表格行按钮detail
    const customTableAction = (text, record, index, store) => {
      return (
      <>
        <Button danger={false} style={{fontSize: '12px'}} type={'primary'}  title="报告" icon={<BarChartOutlined />} onClick={() => onOpenpdf(record.id)}/>
        </>
      );
    }
    useEffect(() => {
    }, []);

    const source: EpsSource[] = [ {
        title: '检测来源',
        code: 'xsxjcjgzjcly',
        align: 'center',
        formType: EpsFormType.Input,
        width:120
      }, {
        title: '检测批次',
        code: 'xsxjcjgzjcbc',
        align: 'center',
        formType: EpsFormType.Input
      }, {
        title: '检测单位',
        code: 'xsxjcjgdw',
        align: 'center',
        formType: EpsFormType.Input
      },{
        title: '检测规则',
        code: 'xsxjcjgzjclx',
        align: 'center',
        formType: EpsFormType.Input
      },
      {
        title: '检测结果',
        code: 'xsxjcjgzjcjg',
        align: 'center',
        formType: EpsFormType.Input
      },{
        title: '检测时间',
        code: 'whsj',
        align: 'center',
        formType: EpsFormType.Input
      }]
    const title: ITitle = {
      name: '检测结果'
    }


    const searchFrom = () => {
      return (
        <>
          <Form.Item label="编号" className="form-item" name="archiveinfoCode"><Input placeholder="请输入业务号" /></Form.Item >
        </>
      )
    }

    return (
      <>

         <EpsPanel title={title}                    // 组件标题，必填
          source={source}                          // 组件元数据，必填
          tableProp={tableProp}                    // 右侧表格设置属性，选填
          treeService={jcjgzService}                  // 左侧树 实现类，必填
          tableService={jcjgzService}             // 右侧表格实现类，必填
          ref={ref}                                // 获取组件实例，选填
          setCheckRows={props.checkrow}
          formWidth={1100}
          customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
          customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
          customTableAction={customTableAction}
        >
        </EpsPanel>
      </>
    );
  })

export default Jcjgz;

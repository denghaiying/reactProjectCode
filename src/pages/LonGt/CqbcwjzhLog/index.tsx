import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import cqbcwjzhlogService from './service/CqbcwjzhlogService';
import { Form, Input, message, Select, FormInstance } from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable, IUpload} from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import { Params } from '../../list/search/projects/data';

const yhmc = SysStore.getCurrentUser().yhmc;

/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const CqbcwjzhLog = observer((props) => {

const tableProp: ITable = {
  disableDelete: true,
  disableEdit: true,
  disableAdd: true,
  disableCopy: true,
  searchCode: 'zhqlx',
}






const [cjdata, setcjData]= useState<Array<{}>>([]);


const ref = useRef();
const _width = 380

const customForm = (form: FormInstance) => {
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


  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>

      </>
    );
  }
  useEffect(() => {

  }, []);

  const source: EpsSource[] = [
    {
      title: '文件名称',
      code: 'wjname',
      align: 'center',
      formType: EpsFormType.Input,
      width:200
    },
    {
      title: '转换前类型',
      code: 'zhqlx',
      align: 'center',
      formType: EpsFormType.Input,
      width:200
    },
    {
      title: '转换后类型',
      code: 'zhhlx',
      align: 'center',
      formType: EpsFormType.Input,
      width:200
    },{
      title: '来源',
      code: 'ly',
      align: 'center',
      formType: EpsFormType.Input,
      width:300
    },{
      title: '转换结果',
      code: 'zhjg',
      align: 'center',
      formType: EpsFormType.Input,
      width:300
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      width:300
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      width:300
    }]
  const title: ITitle = {
    name: '转换日志'
  }

  const wjsource: EpsSource[] = [ {
      title: '文件名称',
      dataIndex: 'name',
      align: 'center',
      formType: EpsFormType.Input,
      width:200
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      align: 'center',
      formType: EpsFormType.Input,
      width:200
    }]


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="标题" className="form-item" name="name"><Input placeholder="请输入标题" style={{ width: 300 }}/></Form.Item >
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={cqbcwjzhlogService}             // 右侧表格实现类，必填
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

export default CqbcwjzhLog;

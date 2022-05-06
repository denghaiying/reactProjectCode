import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import dzwjdjmxService from './service/DzwjdjmxService';
import { Form, Input, message, Radio, Switch, DatePicker } from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { ContainerOutlined } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";


import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;

/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const tableProp: ITable = {
  tableSearch: false,
  disableCopy: true,
  searchCode: 'name',  
  onEditClick:(form, record) =>{
    record.dzwjdjxcsj = moment(record.dzwjdjxcsj);
    form.setFieldsValue(record);
  },
  }

const Dzwjdjmx = observer((props) => {

  const ref = useRef();


  const customForm = () => {

    return (
      <>
      <Form.Item label="文件编号:" name="dzwjdjwjbh" required rules={[{ required: true, message: '请输入文件编号' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="题名:" name="dzwjdjtm" required rules={[{ required: true, message: '请输入题名' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="形成时间:" name="dzwjdjxcsj" required rules={[{ required: true, message: '请输入形成时间:' }]}>
        <DatePicker   style={{width:  300}} />
      </Form.Item>
      <Form.Item label="文件稿本代码:" name="dzwjdjwjgbdm" required rules={[{ required: true, message: '请输入文件稿本代码' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
       <Form.Item label="文件类别代码:" name="dzwjdjwjlbdm" required rules={[{ required: true, message: '请输入文件类别代码' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="文件载体编号:" name="dzwjdjwjztbh" required rules={[{ required: true, message: '请输入文件载体编号' }]}>
          <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="保管期限:" name="dzwjdjbgqx" required rules={[{ required: true, message: '请输入保管期限' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="文件大小:" name="dzwjdjsize" required rules={[{ required: true, message: '请输入文件大小' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="备注:" name="dzwjdjbz" >
        <Input.TextArea  autoSize={{ minRows: 3, maxRows: 5 }}
              style={{width: 300 }}/>
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj"  initialValue={getDate}>
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
        <Form.Item label="接口code:" name="dzwjdjdzwjinfoid"  initialValue={props.dzwjdjinfoid}  hidden>
          <Input disabled style={{ width: 300 }}  />
        </Form.Item>
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
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(dzwjdjmxService));
    // 自定义表格行按钮detail
    const customTableAction = (text, record, index, store) => {
      return (
        <>

        </>
      );
    }
    useEffect(() => {
    }, []);

    const source: EpsSource[] = [ {
        title: '文件编号',
        code: 'dzwjdjwjbh',
        align: 'center',
        formType: EpsFormType.Input
      }, {
        title: '题名',
        code: 'dzwjdjtm',
        align: 'center',
        formType: EpsFormType.Input
      }, 
      {
        title: '文件稿本代码',
        code: 'dzwjdjwjgbdm',
        align: 'center',
        formType: EpsFormType.Input
      }, {
        title: '文件类别代码',
        code: 'dzwjdjwjlbdm',
        align: 'center',
        formType: EpsFormType.Input
      },
      {
        title: '文件载体编号',
        code: 'dzwjdjwjztbh',
        align: 'center',
        formType: EpsFormType.Input
      },
      {
        title: '保管期限',
        code: 'dzwjdjbgqx',
        align: 'center',
        formType: EpsFormType.Input
      },
      {
        title: '文件大小',
        code: 'dzwjdjsize',
        align: 'center',
        formType: EpsFormType.Input
      },
      {
        title: '形成时间',
        code: 'dzwjdjxcsj',
        align: 'center',
        formType: EpsFormType.Input
      },
      {
        title: '备注',
        code: 'dzwjdjbz',
        align: 'center',
        formType: EpsFormType.Input
      },{
        title: '完成日期',
        code: 'whsj',
        align: 'center',
        formType: EpsFormType.Input
      }]
    const title: ITitle = {
      name: '电子文件登记续表'
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
            tableService={dzwjdjmxService}             // 右侧表格实现类，必填
            ref={ref}                                // 获取组件实例，选填
            formWidth={500}
            customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
            customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
            initParams={{'dzwjdjdzwjinfoid':props.dzwjdjinfoid}}
            customTableAction={customTableAction}
          > 
        </EpsPanel>
      </>
    );
  })

export default Dzwjdjmx;

import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import archiveInfoService from '../ArchiveInfo/service/ArchiveInfoService';
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
  searchCode: 'name',
  rowSelection:{
    type:'radio'
    }
  }
const ArchiveInfojc = observer((props) => {

  const ref = useRef();

  const customForm = () => {

    return (
      <>

        <Form.Item label="业务号:" name="archiveinfoCode" required rules={[{ required: true, message: '请输入编号' }, { max: 10, message: '编号长度不能大于10个字符', }]}>
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
          <Form.Item label="业务名称:" name="archiveinfoName" required rules={[{ required: true, message: '请输入编号' }, { max: 10, message: '编号长度不能大于10个字符', }]}>
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
          <Form.Item label="ftp路径:" name="archiveinfoPath" required rules={[{ required: true, message: '请输入编号' }, { max: 10, message: '编号长度不能大于10个字符', }]}>
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
          <Form.Item label="启用:" name="archiveinfoUsing">
            <Switch name="archiveinfoUsing" defaultChecked={true} />
        </Form.Item>
        <Form.Item label="类型:" name="archiveinfoType">
          <Radio.Group name="archiveinfoType" defaultValue="json">
              <Radio value="json">json</Radio>
              <Radio value="xml">xml</Radio>
              <Radio value="wxXml">ASIP</Radio>
            </Radio.Group>
        </Form.Item>
          <Form.Item label="备注:" name="archiveinfoComments" >
          <Input.TextArea  autoSize={{ minRows: 3, maxRows: 5 }}
                style={{width: 300 }}/>
        </Form.Item>
        <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
        <Input disabled  style={{ width: 300 }} />
      </Form.Item>
        <Form.Item label="维护时间:" name="whsj"  initialValue={getDate}>
          <Input disabled style={{ width: 300 }} />
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
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(archiveInfoService));

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
        title: '业务号',
        code: 'archiveinfoCode',
        align: 'center',
        formType: EpsFormType.Input
      }, {
        title: '业务名称',
        code: 'archiveinfoName',
        align: 'center',
        formType: EpsFormType.Input
      }, {
        title: 'ftp路径',
        code: 'archiveinfoPath',
        align: 'center',
        formType: EpsFormType.Input
      }, {
        title: '类型',
        code: 'archiveinfoType',
        align: 'center',
        formType: EpsFormType.Input
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
      name: '归档接口'
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
          tableService={archiveInfoService}             // 右侧表格实现类，必填
          ref={ref}                                // 获取组件实例，选填
          setCheckRows={props.checkrow}
          formWidth={500}
          customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
          customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        >
        </EpsPanel>
      </>
    );
  })

export default ArchiveInfojc;

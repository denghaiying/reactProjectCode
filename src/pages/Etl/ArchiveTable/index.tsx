import React, { useEffect, useRef, useState } from 'react';
import {EpsPanel, EpsTableStore} from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import archiveInfoService from './service/ArchiveTableService';
import archivecolumneService from './service/ArchivecolumneService';
import { Form, Input, message, Radio, Switch , Select, InputNumber, Button } from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';

import DwTableLayout from '@/eps/business/DwTableLayout';
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

const treeProp: ITree = {
    treeSearch: true,
    treeCheckAble: false
}

const ArchiveTable = observer((props) => {
  const ref = useRef();
  const tableProp: ITable = {
  tableSearch: false,
  disableCopy: true,
  searchCode: 'name',
  onAddClick: (form) => {
    const tableStores = ref.current?.getTableStore();
    if(tableStores.key !==""){
        var att=tableStores.key.split(",");
        form.setFieldsValue({archiveinfoId: att[0],archiveinfoCode:att[1]});
    }else{
        message.warning('请先选择左边树数据!');
        return false;
    }
  }
}

const doCreateTemplateString = ()=> {
    const tableStores = ref.current?.getTableStore();
    if(tableStores.key !==""){
        var att=tableStores.key.split(",");
        window.open("/api/api/example/"+att[2]+"/"+ att[0])
    }else{
        message.warning('请先选择左边树数据!');
        return false;
    }
  
 };

  const [archivecolumnlist, setArchivecolumnlist]= useState<Array<{id:string;label:string;value:string}>>([]);

  const customForm = () => {

    return (
      <>
        <Form.Item label="编号:" name="archivecolumnCode" required rules={[{ required: true, message: '请输入编号' }]}>
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
          <Form.Item label="名称:" name="archivecolumnName" required rules={[{ required: true, message: '请输入名称' }]}>
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="元数据属性:" name="archivecolumnMetadata" required rules={[{ required: true, message: '请选择元数据属性' }]}>
            <Select   placeholder="元数据属性"   options={archivecolumnlist} style={{width:  300/** ,zIndex:999*/}}/>
        </Form.Item>

        <Form.Item label="类型:" name="archivecolumnType"  initialValue="VARCHAR">
          <Radio.Group name="archivecolumnType" defaultValue="VARCHAR">
              <Radio.Button value="VARCHAR">字符</Radio.Button>
              <Radio.Button value="NUMERIC">数值</Radio.Button>
              <Radio.Button value="DATE">日期</Radio.Button>
            </Radio.Group>
        </Form.Item>
          <Form.Item label="字段长度:" name="archivecolumnLength" initialValue="50">
            <InputNumber  type="inline"
                              step={10}
                              name="archivecolumnLength"
                              min={1}
                              max={2000}
                              defaultValue={50} style={{ width: 300 }} />
        </Form.Item>

          <Form.Item label="备注:" name="archivecolumnComments" >
          <Input.TextArea  autoSize={{ minRows: 3, maxRows: 5 }}
                style={{width: 300 }}/>
        </Form.Item>
      <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
        <Input disabled  style={{ width: 300 }} />
      </Form.Item>
        <Form.Item label="维护时间:" name="whsj"  initialValue={getDate}>
          <Input disabled style={{ width: 300 }} />

        </Form.Item>
        <Form.Item label="接口ID:" name="archiveinfoId" hidden >
          <Input name="archiveinfoId" disabled style={{ width: 300 }}  />
        </Form.Item>
        <Form.Item label="接口code:" name="archiveinfoCode" hidden>
          <Input name="archiveinfoCode" disabled style={{ width: 300 }}  />
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
        <>
         <Button type="primary" onClick={() => doCreateTemplateString()}>生成样例</Button>
        </>
      ])
    }

    // 创建右侧表格Store实例
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(archivecolumneService));

    // 自定义表格行按钮detail
    const customTableAction = (text, record, index, store) => {
      return (
        <>

        </>
      );
    }
    useEffect(() => {
      const queryXysjsxList =  async () =>{
          let url="/api/api/archivecolumn/findMetadata";
          const response =await fetch.post(url);
          if (response.status === 200) {
            if (response.data.length > 0) {
              let  SxData = response.data;
              setArchivecolumnlist(SxData);
            }else{
              setArchivecolumnlist(response.data);
            }
          }
      }
      queryXysjsxList();
      //YhStore.queryForPage();
    }, []);

    const source: EpsSource[] = [{
      title: '编号',
      code: 'archivecolumnCode',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '名称',
      code: 'archivecolumnName',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '类型',
      code: 'archivecolumnType',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '长度',
      code: 'archivecolumnLength',
      align: 'center',
      formType: EpsFormType.Input
    }]
    const title: ITitle = {
      name: '归档表'
    }


    const searchFrom = () => {
      return (
        <>
           <Form.Item label="编号" className="form-item" name="archivecolumnCode"><Input placeholder="请输入编号" /></Form.Item >
           <Form.Item label="名称" className="form-item" name="archivecolumnName"><Input placeholder="请输入名称" /></Form.Item >
        </>
      )
    }

    return (
      <>
          <EpsPanel title={title}                            // 组件标题，必填
                     source={source}                          // 组件元数据，必填
                     treeProp={treeProp}                      // 左侧树 设置属性,可选填
                     treeService={archiveInfoService}                  // 左侧树 实现类，必填
                     tableProp={tableProp}                    // 右侧表格设置属性，选填
                     tableService={archivecolumneService}                 // 右侧表格实现类，必填
                     ref={ref}                                // 获取组件实例，选填
                     formWidth={500}
        //     menuProp={menuProp}                      // 右侧菜单 设置属性，选填
                     tableRowClick={(record) => console.log('abcef', record) }
                     searchForm={searchFrom}
                     customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
                     customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
                     customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </EpsPanel>
      </>
    );
  })

export default ArchiveTable;

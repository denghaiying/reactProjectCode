import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import dzwjdjzService from './service/DzwjdjzService';
import { Form, Input, message, Radio, DatePicker, Select, Tabs, Table, Row, Col } from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";

import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;


const span = 8;
const _width = 240
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const tableProp: ITable = {
  tableSearch: false,
  disableCopy: true,
  searchCode: 'name',
  onEditClick:(form, record) =>{
    record.dzwjinfosqrq = moment(record.dzwjinfosqrq);
    record.dzwjinfowcrq = moment(record.dzwjinfowcrq);
    record.dzwjinfotbrq = moment(record.dzwjinfotbrq);
    form.setFieldsValue(record);
  },
  rowSelection:{
    type:'radio'
    }
  }

const jllxdata = [{ label: '定长', value: '定长' },{ label: '可变长', value: '可变长' },{ label: '其他', value: '其他' }];

const Dzwjdjz = observer((props) => {

  const ref = useRef();
  const dateFormat = "YYYY-MM-DD";

  const customForm = () => {

    return (
      <>
        <Row gutter={20}>
          <Col span={span}>
            <Form.Item label="载体编号"  name="dzwjinfoztbh" required  rules={[{ required: true, message: '请输入载体编号名称' }]}>
              <Input className="ant-input"
                                  name="dzwjinfoztbh"
                                  placeholder="载体编号"
                                  style={{width:  _width}}
                            />
            </Form.Item>

          </Col>
          <Col span={span}>
            <Form.Item  required  label="载体类型" name='dzwjinfoztlx' rules={[{ required: true, message: '请选择载体类型' }]}>
              <Input className="ant-input"
                     name="dzwjinfoztlx"
                     placeholder="载体类型"
                     style={{width:  _width}}
              />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item
              required
              name="dzwjinfoxcbm"
              label="形成部门" rules={[{ required: true, message: '请输入形成部门' }]}
            >
              <Input placeholder="形成部门" style={{width:  _width}}  className="ant-input"/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="操作系统" name="dzwjinfoczxt" required rules={[{ required: true, message: '请输入操作系统' }]}>
               <Input placeholder="操作系统" style={{width:  _width}}  className="ant-input"/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="记录类型" name="dzwjinfojllx" required rules={[{ required: true, message: '请输入记录类型' }]}>
              <Select    placeholder="记录类型" className="ant-select"  options={jllxdata} style={{width:  _width}}/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="电话" required name="dzwjinfoztphone" required rules={[{ required: true, message: '请输入电话' }]}>
                <Input placeholder="电话" style={{width:  _width}}  className="ant-input"/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="数据库系统"  name="dzwjinfosjkxt" required rules={[{ required: true, message: '请输入数据库系统' }]}> 
               <Input placeholder="数据库系统" style={{width:  _width}}  className="ant-input"/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="记录数量" name="dzwjinfojlsl" required  rules={[{ required: true, message: '请输入记录数量' }]}>
              <Input placeholder="记录数量"   className="ant-input" style={{width:  _width}}/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="制造厂商" name="dzwjinfozzcs" required  rules={[{ required: true, message: '请输入制造厂商' }]}>
              <Input   placeholder="制造厂商"   className="ant-input" style={{width:  _width}}/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="审核日期"  name="dzwjinfosqrq" required  rules={[{ required: true, message: '请输入审核日期' }]}>
              <DatePicker placeholder="审核日期"    style={{width:   _width}} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="完成日期"  name="dzwjinfowcrq" required rules={[{ required: true, message: '请输入完成日期' }]}>
              <DatePicker placeholder="完成日期"    style={{width:   _width}} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="填表日期"  name="dzwjinfotbrq" required rules={[{ required: true, message: '请输入填表日期' }]}>
              <DatePicker placeholder="填表日期"    style={{width:   _width}} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="记录总数" name="dzwjinfojlzs" required rules={[{ required: true, message: '请输入记录总数' }]}>
              <Input   placeholder="记录总数:" className="ant-input" style={{width:  _width}}/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="总字节数" name="dzwjinfozzjs" required  rules={[{ required: true, message: '请输入总字节数' }]}>
              <Input placeholder="总字节数" className="ant-input" style={{width:  _width}}/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="记录型号"  name="dzwjinfojlxh" required rules={[{ required: true, message: '请输入记录型号' }]}>
              <Input placeholder="记录型号" className="ant-input" style={{width:  _width}}/>
            </Form.Item>
          </Col>

          <Col span={span}>
            <Form.Item label="相关软件" name="dzwjinfoxgrj" required rules={[{ required: true, message: '请输入相关软件' }]}>
               <Input.TextArea
              rows={3}
              style={{width:  _width}}
              />
            </Form.Item>
          </Col>
           <Col span={span}>
            <Form.Item label="记录结构" name="dzwjinfojljg" required rules={[{ required: true, message: '请输入记录结构' }]}>
               <Input.TextArea
              rows={3}
              style={{width:  _width}}
              />
            </Form.Item>
          </Col>
           <Col span={span}>
            <Form.Item label="通讯地址" name="dzwjinfoztaddress" required rules={[{ required: true, message: '请输入通讯地址' }]}>
               <Input.TextArea
              rows={3}
              style={{width:  _width}}
              />
            </Form.Item>
          </Col>

          <Col span={span}>
            <Form.Item label='网络服务器型号' name='dzwjinfowlfwqxh' required rules={[{ required: true, message: '请输入网络服务器型号' }]}>
              <input   className="ant-input" style={{width:  _width}}/>
            </Form.Item>

          </Col>
          <Col span={span} >
            <Form.Item label='记录备份数' name='dzwjinfojlbfs' required rules={[{ required: true, message: '请输入记录备份数' }]}>
              <input   className="ant-input" style={{width:  _width}}/>
            </Form.Item>

          </Col>
          <Col span={span}>
            <Form.Item label='文件载体型号' name='dzwjinfowjztxh' required  rules={[{ required: true, message: '请输入文件载体型号' }]}>
              <input   className="ant-input" style={{width:  _width}}/>
            </Form.Item>
          </Col>

           <Col span={span}>
            <Form.Item label='文件载体数量' name='dzwjinfowjztsl' required  rules={[{ required: true, message: '请输入文件载体数量' }]}>
              <input   className="ant-input" style={{width:  _width}}/>
            </Form.Item>

          </Col>
          <Col span={span} >
            <Form.Item label='文件载体备份数' name='dzwjinfowjztbfs' required rules={[{ required: true, message: '请输入文件载体备份数' }]}>
              <input   className="ant-input" style={{width:  _width}}/>
            </Form.Item>

          </Col>
          <Col span={span}>
            <Form.Item label='填表人名称' name='dzwjinfotbrmc' required rules={[{ required: true, message: '请输入填表人名称' }]}>
              <input   className="ant-input" style={{width:  _width}}/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label='联系人名称' name='dzwjinfoztlxrmc' required rules={[{ required: true, message: '请输入联系人名称' }]}>
              <input   className="ant-input" style={{width:  _width}}/>
            </Form.Item>
          </Col>
          <Col span={span} >
            <Form.Item label='审核人名称' name='dzwjinfosqrmc' required rules={[{ required: true, message: '请输入审核人名称' }]}>
              <input   className="ant-input" style={{width:  _width}}/>
            </Form.Item>

          </Col>
          <Col span={span}>
            <Form.Item label='维护时间'
                       name="whsj" initialValue={getDate}>
              <Input  disabled className="ant-input"  style={{width:  _width}}/>
            </Form.Item>
          </Col>
      
        </Row>
        <Row gutter={20}>
          <Col span={18}>
              <Form.Item label='其他' name="dzwjinfoqt" labelCol={{ span: 2 }} >
                <Input.TextArea rows={3} style={{width: 600}}/>
            </Form.Item>
          </Col>
        </Row>
        
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
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(dzwjdjzService));
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
        title: '载体编号',
        code: 'dzwjinfoztbh',
        align: 'center',
        formType: EpsFormType.Input
      }, {
        title: '载体类型',
        code: 'dzwjinfoztlx',
        align: 'center',
        formType: EpsFormType.Input
      }, {
        title: '完成日期',
        code: 'dzwjinfowcrq',
        align: 'center',
        formType: EpsFormType.Input
      }, {
        title: '形成部门',
        code: 'dzwjinfoxcbm',
        align: 'center',
        formType: EpsFormType.Input
      },
      {
        title: '通讯地址',
        code: 'dzwjinfoztaddress',
        align: 'center',
        formType: EpsFormType.Input
      },
       {
        title: '电话',
        code: 'dzwjinfoztphone',
        align: 'center',
        formType: EpsFormType.Input
      },
       {
        title: '联系人',
        code: 'dzwjinfoztlxr',
        align: 'center',
        formType: EpsFormType.Input
      },
       {
        title: '联系人名称',
        code: 'dzwjinfoztlxrmc',
        align: 'center',
        formType: EpsFormType.Input
      },
       {
        title: '网络服务器型号',
        code: 'dzwjinfowlfwqxh',
        align: 'center',
        formType: EpsFormType.Input
      },
       {
        title: '制造厂商',
        code: 'dzwjinfozzcs',
        align: 'center',
        formType: EpsFormType.Input
      },
       {
        title: '其他',
        code: 'dzwjinfoqt',
        align: 'center',
        formType: EpsFormType.Input
      },
       {
        title: '操作系统',
        code: 'dzwjinfoczxt',
        align: 'center',
        formType: EpsFormType.Input
      },
       {
        title: '数据库系统',
        code: 'dzwjinfosjkxt',
        align: 'center',
        formType: EpsFormType.Input
      },
        {
        title: '相关软件',
        code: 'dzwjinfoxgrj',
        align: 'center',
        formType: EpsFormType.Input
      },
        {
        title: '记录结构',
        code: 'dzwjinfojljg',
        align: 'center',
        formType: EpsFormType.Input
      },  {
        title: '记录类型',
        code: 'dzwjinfojllx',
        align: 'center',
        formType: EpsFormType.Input
      },{
        title: '记录总数',
        code: 'dzwjinfojlzs',
        align: 'center',
        formType: EpsFormType.Input
      }, {
        title: '总字节数',
        code: 'dzwjinfozzjs',
        align: 'center',
        formType: EpsFormType.Input
      },{
        title: '记录型号',
        code: 'dzwjinfojlxh',
        align: 'center',
        formType: EpsFormType.Input
      },{
        title: '记录数量',
        code: 'dzwjinfojlsl',
        align: 'center',
        formType: EpsFormType.Input
      },{
        title: '记录备份数',
        code: 'dzwjinfojlbfs',
        align: 'center',
        formType: EpsFormType.Input
      },{
        title: '文件载体型号',
        code: 'dzwjinfowjztxh',
        align: 'center',
        formType: EpsFormType.Input
      },{
        title: '文件载体数量',
        code: 'dzwjinfowjztsl',
        align: 'center',
        formType: EpsFormType.Input
      },{
        title: '文件载体备份数',
        code: 'dzwjinfowjztbfs',
        align: 'center',
        formType: EpsFormType.Input
      },{
        title: '填表人名称',
        code: 'dzwjinfotbrmc',
        align: 'center',
        formType: EpsFormType.Input
      },{
        title: '填表日期',
        code: 'dzwjinfotbrq',
        align: 'center',
        formType: EpsFormType.Input
      },{
        title: '审核人名称',
        code: 'dzwjinfosqrmc',
        align: 'center',
        formType: EpsFormType.Input
      },{
        title: '审核日期',
        code: 'dzwjinfosqrq',
        align: 'center',
        formType: EpsFormType.Input
      }]
    const title: ITitle = {
      name: '电子文件登记'
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
          tableService={dzwjdjzService}             // 右侧表格实现类，必填
          ref={ref}                                // 获取组件实例，选填
          setCheckRows={props.checkrow}
          formWidth={1300}
          customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
          customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        > 
        </EpsPanel>
      </>
    );
  })

export default Dzwjdjz;

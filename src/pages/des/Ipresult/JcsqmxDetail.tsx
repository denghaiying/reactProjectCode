import { observer } from 'mobx-react';
import React, { useState, useRef, useEffect } from 'react';
import { Select, Button, Modal, Tooltip, Input, Form, Row, Col } from 'antd';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import JcsqmxService from '../Ipapply/Service/JcsqmxService';
import { FundViewOutlined } from '@ant-design/icons';
import './index.scss';
import IpapplyStore from '../../../stores/des/IpapplyStore';
import JcjgErrDialog from './JcjgErrDialog';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const JcsqmxDetail = observer((props) => {
  const { mxvisable, SetMxVisable, editrecord } = props;
  const [form] = Form.useForm();
  const ref = useRef();
  const [errvisable, SetErrVisable] = useState(false);
  const [mxeditRecord, setMxeditRecord] = useState({});

  useEffect(() => {
    form.setFieldsValue(editrecord);
    IpapplyStore.queryFields(editrecord.id);
  }, []);

  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
    disableDelete: true,
    disableEdit: true,
    disableAdd: true,
  };

  // 表单名称
  const title: ITitle = {
    name: '检测结构',
  };
  const source: EpsSource[] = [
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
      title: '检测类型',
      code: 'iptcfgType',
      align: 'center',
      formType: EpsFormType.Input,
      dataSource: IpapplyStore.typelistArray(),
    },
    {
      title: '检测对象',
      code: '',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '不合格数量',
      code: 'bhgsl',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '说明',
      code: 'sm',
      align: 'center',
      formType: EpsFormType.Input,
    },
  ];

  const onViewClick = (record, index, store) => {
    setMxeditRecord(record);
    SetErrVisable(true);
  };

  const customTableAction = (
    text: any,
    record: any,
    index: any,
    store: any,
  ) => {
    return [
      <Tooltip title="浏览">
        <Button
          size="small"
          style={{ fontSize: '12px' }}
          type="primary"
          shape="circle"
          icon={<FundViewOutlined />}
          onClick={() => onViewClick(record, index, store)}
        />
      </Tooltip>,
    ];
  };

  return (
    <Modal
      title="检测结果【浏览】"
      visible={mxvisable}
      onCancel={() => SetMxVisable(false)}
      footer={false}
      width={1000}
    >
      <Form
        name="advanced_search"
        form={form}
        {...formItemLayout}
        className="ant-advanced-search-form2"
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="sqdw" label="申请单位：" className="ant-form-item">
              <Input disabled={true} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="sqrq" label="申请日期：" className="ant-form-item">
              <Input disabled={true} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="jcfw" label="检测范围：" className="ant-form-item">
              <Select disabled={true}>
                <Select.Option value="A">条目和原文</Select.Option>
                <Select.Option value="B">仅条目</Select.Option>
                <Select.Option value="C">仅原文</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="ppgz" label="匹配规则：" className="ant-form-item">
              <Select options={IpapplyStore.exprData} disabled={true} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="tms" label="条目数量：" className="ant-form-item">
              <Input disabled={true} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="yws" label="原文数量：" className="ant-form-item">
              <Input disabled={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="sqsm"
              label="申请说明："
              className="ant-form-item"
              {...tailFormItemLayout}
            >
              <Input.TextArea disabled={true} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <EpsPanel
        initParams={{ sqid: editrecord.id }}
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={JcsqmxService} // 右侧表格实现类，必填
        formWidth={500}
        ref={ref}
        customTableAction={customTableAction}
        // tableAutoLoad={false}
      ></EpsPanel>
      {errvisable && (
        <JcjgErrDialog
          errvisable={errvisable}
          SetErrVisable={SetErrVisable}
          modaltitle={'错误条目数据'}
          mxeditRecord={mxeditRecord}
        />
      )}
    </Modal>
  );
});
export default JcsqmxDetail;

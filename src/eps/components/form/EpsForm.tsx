import { EpsSource } from '@/eps/commons/declare';
import EpsFormType from '@/eps/commons/EpsFormType';
import {
  Input,
  Form,
  FormInstance,
  Select,
  InputNumber,
  Checkbox,
  DatePicker,
  Radio,
  Switch,
  TreeSelect,
  Upload,
  Row,
  Col,
} from 'antd';
import Password from 'antd/es/input/Password';
import React, { useEffect, useState } from 'react';

import './index.less';

interface ISource {
  source: Array<EpsSource>;
  form: FormInstance;
  data: any;
  customForm?: Function;
  labelColSpan?: number;
  modal: 'view' | 'add' | 'modify';
}

const getComp = (item: EpsSource, form: FormInstance, props: ISource) => {
  if (item.formType === EpsFormType.Input) {
    return (
      <Form.Item
        label={item.title}
        key={item.code}
        name={item.code}
        rules={item.roles || []}
        required={item.require || false}
      >
        <Input
          placeholder={`请输入${item.title}`}
          disabled={item.disabled || props.modal === 'view'}
        ></Input>
      </Form.Item>
    );
  } else if (item.formType === EpsFormType.Select) {
    const options =
      item.dataSource &&
      item.dataSource.map((it) => {
        return { label: it.title, value: it.key };
      });
    return (
      <Form.Item
        label={item.title}
        key={item.code}
        name={item.code}
        rules={item.roles || []}
        required={item.require || false}
      >
        <Select
          placeholder={`请输入${item.title}`}
          options={options}
          disabled={item.disabled || props.modal === 'view'}
        ></Select>
      </Form.Item>
    );
  } else if (item.formType === EpsFormType.InputNumber) {
    return (
      <Form.Item
        label={item.title}
        key={item.code}
        name={item.code}
        rules={item.roles || []}
        required={item.require || false}
      >
        <InputNumber
          placeholder={`请输入${item.title}`}
          disabled={item.disabled || props.modal === 'view'}
        ></InputNumber>
      </Form.Item>
    );
  } else if (item.formType === EpsFormType.Password) {
    return (
      <Form.Item
        label={item.title}
        key={item.code}
        name={item.code}
        rules={item.roles || []}
        required={item.require || false}
      >
        <Password
          placeholder={`请输入${item.title}`}
          disabled={item.disabled || props.modal === 'view'}
        ></Password>
      </Form.Item>
    );
  } else if (item.formType === EpsFormType.Checkbox) {
    return (
      <Form.Item
        label={item.title}
        key={item.code}
        name={item.code}
        rules={item.roles || []}
        required={item.require || false}
        valuePropName="checked"
      >
        <Checkbox disabled={item.disabled || props.modal === 'view'}></Checkbox>
      </Form.Item>
    );
  } else if (item.formType === EpsFormType.DatePicker) {
    return (
      <Form.Item
        label={item.title}
        key={item.code}
        name={item.code}
        rules={item.roles || []}
        required={item.require || false}
      >
        <DatePicker
          placeholder={`请输入${item.title}`}
          disabled={item.disabled || props.modal === 'view'}
        ></DatePicker>
      </Form.Item>
    );
  } else if (item.formType === EpsFormType.Radio) {
    return (
      <Form.Item
        label={item.title}
        key={item.code}
        name={item.code}
        rules={item.roles || []}
        required={item.require || false}
      >
        <Radio disabled={item.disabled || props.modal === 'view'}></Radio>
      </Form.Item>
    );
  } else if (item.formType === EpsFormType.Switch) {
    return (
      <Form.Item
        label={item.title}
        key={item.code}
        name={item.code}
        rules={item.roles || []}
        required={item.require || false}
      >
        <Switch
          disabled={item.disabled || props.modal === 'view'}
          checkedChildren={item.dataSource ? item.dataSource[0]?.title : '正常'}
          unCheckedChildren={
            item.dataSource ? item.dataSource[1]?.title : '禁用'
          }
          defaultChecked={item[item.code] === item.dataSource[0].key}
        ></Switch>
      </Form.Item>
    );
  } else if (item.formType === EpsFormType.TreeSelect) {
    return (
      <Form.Item
        label={item.title}
        key={item.code}
        name={item.code}
        rules={item.roles || []}
        required={item.require || false}
      >
        <TreeSelect
          placeholder={`请输入${item.title}`}
          disabled={item.disabled || props.modal === 'view'}
        ></TreeSelect>
      </Form.Item>
    );
  } else if (item.formType === EpsFormType.Upload) {
    return (
      <Form.Item
        label={item.title}
        key={item.code}
        name={item.code}
        rules={item.roles || []}
        required={item.require || false}
      >
        <Upload disabled={item.disabled || props.modal === 'view'}></Upload>
      </Form.Item>
    );
  } else if (item.formType === EpsFormType.TextArea) {
    return (
      <Form.Item
        label={item.title}
        key={item.code}
        name={item.code}
        rules={item.roles || []}
        required={item.require || false}
      >
        <Input.TextArea
          placeholder={`请输入${item.title}`}
          disabled={item.disabled || props.modal === 'view'}
        />
      </Form.Item>
    );
  } else {
    return '';
  }
};

function EpsForm(props: ISource) {
  const [colNum, setColNum] = useState(1); // 设置表格列数， 以6为基数

  const [record, setRecord] = useState({});

  const formItemLayout = {
    colon: false,
    labelCol: {
      span: props.labelColSpan || 6,
      fixedSpan: 4,
    },

    wrapperCol: {
      span: 18,
    },
  };

  const autoForm = (source: EpsSource[], form: FormInstance) => {
    return (
      <Row gutter={20}>
        {source.map((item) => (
          <Col span={colNum} key={item.code}>
            {getComp(item, form, props)}
          </Col>
        ))}
      </Row>
    );
  };

  useEffect(() => {
    if (props.source && props.source.length > 0) {
      let res1 = parseInt(props.source.length / 10);
      let res2 = props.source.length % 10;
      let res3 =
        res1 + (res2 === 0 ? 0 : 1) >= 4 ? 4 : res1 + (res2 === 0 ? 0 : 1);
      setColNum(24 / res3);

      console.log('asdfsdfadfdsfdsfds', props.labelColSpan);
      // 设置默认初始值
      if (props.modal === 'add') {
        let rcd = props.data;
        props.source.forEach((item) => {
          let obj = {};
          obj[`${item.code}`] = item.defaultValue;
          rcd = Object.assign(rcd, obj);
        });
        setRecord(rcd);
      } else {
        setRecord(props.data);
      }
    }
  }, []);
  // return useMemo(() => {
  return (
    <div className="form-field">
      <Form form={props.form} {...formItemLayout} initialValues={record}>
        {props.modal === 'view'
          ? autoForm(props.source, props.form)
          : props.customForm || autoForm(props.source, props.form)}
      </Form>
    </div>
  );
  // }, [ props.customForm, props.source])
}

export default EpsForm;

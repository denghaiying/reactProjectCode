import { Form, FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import { EpsSource } from '../../commons/declare/EpsSource';
import './index.less'

interface ISource {
  source: Array<EpsSource>;
  form: FormInstance;
  data: any;
  customForm?: Function;
}
const formItemLayout = {
  colon: false,
  labelCol: {
    span: 6
  },
};

function EpsForm(props: ISource) {
  const [record, setRecord] = useState({});

  useEffect(() => {
    if (props.source && props.source.length > 0) {
      let rcd = props.data;
      props.source.forEach(item => {
        let obj = {}
        obj[`${item.code}`] = item.defaultValue
        rcd = Object.assign(rcd, obj)
      })
      setRecord(rcd)
    }
  }, [])

  return (
    <div className="form-field">
      <Form form={props.form} {...formItemLayout} initialValues={record} >
        {props.customForm}
      </Form>
    </div>
  );
}

export default EpsForm;

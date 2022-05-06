import React, { useEffect, useState } from 'react';
import {
  Input,
  DatePicker,
  Switch,
  Select,
  Message,
  Form,
  Checkbox,
  Radio,
  Grid,
  Button,
  Dialog,
} from '@alifd/next';
import { injectIntl } from 'react-intl';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import EditForm from '../../../components/EditForm';
import Store from '../../../stores/system/YhStore';
import SearchStore from '@/stores/datj/SearchStore';
const { Group: RadioGroup } = Radio;
const { Row, Col } = Grid;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    fixedSpan: 4,
  },
  // wrapperCol: {
  //   span: 14,
  // },
};
const UpdatPwdDailog = observer((props) => {
  const {
    intl: { formatMessage },
  } = props;
  const { Item: FormItem } = Form;

  const savedata = (values, errors) => {
    if (!errors) {
      /*  const { whsj } = values;
            if (isMoment(whsj)) {
                values.whsj = whsj.format("YYYY-MM-DD HH:mm:ss");
            }*/

      Store.changepassword(values);
    }
  };

  /*    const checkPass=(rule, value, callback) => {
        const { validate } = this.field;
        if (value) {
            validate(['rePasswd']);
        }
        callback();
    }

   const  checkPass2=(rule, value, callback)  => {
        const { getValue } = this.field;
        if (value && value !== getValue('passwd')) {
            return callback('Inconsistent password input twice!');
        } else {
            return callback();
        }
    }*/

  const close = () => {
    Store.updatPwdVisible = false;
  };

  return (
    <EditForm
      title={formatMessage({ id: '用户管理' })}
      visible={Store.updatPwdVisible}
      footer={false}
      hasMask={true}
      onClose={close}
      opt={Store.opt}
      style={{ width: '350px' }}
      responsive
    >
      <Form
        value={Store.editRecord}
        inline
        label
        fullWidth={true}
        onChange={Store.onRecordChange}
        {...formItemLayout}
      >
        <FormItem required label="用户名:" labelWidth={205}>
          <Input
            name="yhmc"
            placeholder="用户名称"
            style={{ width: 200 }}
            disabled
          />
        </FormItem>

        <FormItem
          label="新密码:"
          labelWidth={205}
          required
          requiredMessage="请输入新密码"
        >
          <Input.Password
            id="pwd"
            name="pwd"
            style={{ width: 200 }}
            placeholder="新密码"
          />
        </FormItem>

        <Row>
          <Col style={{ width: 200 }}>
            <Input htmlType="hidden" name="id" />
          </Col>
          <Col style={{ textAlign: 'right', width: 150 }}>
            <FormItem>
              <Form.Submit
                validate
                type="primary"
                onClick={savedata}
                style={{ marginRight: '5px' }}
              >
                {formatMessage({ id: 'e9.btn.save' })}
              </Form.Submit>
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                onClick={close}
                style={{ marginRight: '5px' }}
              >
                关闭
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </EditForm>
  );
});

export default injectIntl(UpdatPwdDailog);

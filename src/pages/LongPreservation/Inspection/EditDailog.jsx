import React from 'react';
import { Button, Input, DatePicker, Switch, Select,Form } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';

import EditForm from "../../../components/EditForm";
import UserStore from '../../../stores/user/UserStore';

const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const EditDialog = observer(props => {
  const { intl: { formatMessage } } = props;
  const { Item: FormItem } = Form;

  const savedata = () => {
    const { validateFields } = form.current;
    validateFields((errors, values) => {
      if (!errors) {
        const { whsj, userQyrq, userTyrq } = values;

        if (isMoment(whsj)) {
          values.whsj = whsj.format('YYYY-MM-DD HH:mm:ss');
        }
        if (userQyrq && isMoment(userQyrq)) {
          values.userQyrq = userQyrq.format('YYYY-MM-DD');
        }
        if (userTyrq && isMoment(userTyrq)) {
          values.userTyrq = userTyrq.format('YYYY-MM-DD');
        }
        UserStore.saveData(values);
      }
    });
  };

  return (
    <EditForm
      title={formatMessage({ id: 'e9.sys.user.title' })}
      visible={UserStore.editVisible}
      footer={<Button type="primary" onClick={savedata}>{formatMessage({ id: 'e9.btn.save' })}</Button>}
      onClose={() => UserStore.closeEditForm()}
      opt={UserStore.opt}
      style={{ width: '450px' }}
    >
      <Form value={UserStore.editRecord} onChange={UserStore.resetEditRecord}  {...formItemLayout}>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.user.userLoginname' })}：`} name="userLoginname" message="">
          <Input
            maxLength={20} size="small"
            placeholder={formatMessage({ id: 'e9.sys.user.userLoginname' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.user.userName' })}：`} name="userName">
          <Input
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.user.userName' })}
          />
        </FormItem>
        <FormItem required name="userEnname" label={`${formatMessage({ id: 'e9.sys.user.userEnname' })}：`}>
          <Input
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.user.userEnname' })}
          />
        </FormItem>
        <FormItem required name="userType" label={`${formatMessage({ id: 'e9.sys.user.userType' })}：`}>
          <Select
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.user.userType' })}
          >
            <Select.Option value="0">{formatMessage({ id: 'e9.sys.user.type.v0' })}</Select.Option>
            <Select.Option value="1">{formatMessage({ id: 'e9.sys.user.type.v1' })}</Select.Option>
            <Select.Option value="2">{formatMessage({ id: 'e9.sys.user.type.v2' })}</Select.Option>
            <Select.Option value="3">{formatMessage({ id: 'e9.sys.user.type.v3' })}</Select.Option>
          </Select>
        </FormItem>
        <FormItem name="userPost" label={`${formatMessage({ id: 'e9.sys.user.userPost' })}：`}>
          <Input
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.user.userPost' })}
          />
        </FormItem>
        <FormItem name="userTel" label={`${formatMessage({ id: 'e9.sys.user.userTel' })}：`}>
          <Input
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.sys.user.userTel' })}
          />
        </FormItem>
        <FormItem name="userTax" label={`${formatMessage({ id: 'e9.sys.user.userTax' })}：`}>
          <Input
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.sys.user.userTax' })}
          />
        </FormItem>
        <FormItem name="userMail" label={`${formatMessage({ id: 'e9.sys.user.userMail' })}：`}>
          <Input
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.user.userMail' })}
          />
        </FormItem>
        <FormItem name="userEnable" label={`${formatMessage({ id: 'e9.sys.user.userEnable' })}：`}>
          <Switch
            size="small"
            checked={UserStore.editRecord.uenable}
            checkedChildren={formatMessage({ id: 'e9.pub.enable' })}
            unCheckedChildren={formatMessage({ id: 'e9.pub.disable' })}
          />
        </FormItem>
        <FormItem name="userQyrq" required label={`${formatMessage({ id: 'e9.sys.user.userQyrq' })}：`}>
          <DatePicker
            placeholder={formatMessage({ id: 'e9.sys.user.userQyrq' })}
          />
        </FormItem>
        <FormItem name="userTyrq" label={`${formatMessage({ id: 'e9.sys.user.userTyrq' })}：`}>
          <DatePicker
            placeholder={formatMessage({ id: 'e9.sys.user.userTyrq' })}
          />
        </FormItem>
        <FormItem name="whr" label={`${formatMessage({ id: 'e9.pub.whr' })}：`}>
          <Input
            maxLength={20}
            readOnly
            placeholder={formatMessage({ id: 'e9.pub.whr' })}
          />
        </FormItem>
        <FormItem name="whsj" label={`${formatMessage({ id: 'e9.pub.whsj' })}：`}>
          <DatePicker
            showTime
            disabled
            placeholder={formatMessage({ id: 'e9.pub.whsj' })}
          />
        </FormItem>
      </Form>
    </EditForm >
  );
});

export default injectIntl(EditDialog);

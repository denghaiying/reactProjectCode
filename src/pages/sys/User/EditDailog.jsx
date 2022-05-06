import React, { useState } from 'react';
import { Input, DatePicker, Switch, Select, Message, Form, Button, Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import EditForm from '../../../components/EditForm';
import UserStore from '../../../stores/user/UserStore';

const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const EditDialog = observer(props => {
  const { intl: { formatMessage } } = props;
  const { Item: FormItem } = Form;
  const [field, setField] = useState(null);

  const savedata = (() => {
    field.validate((errors, values) => {
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
        // 停用日期不能小于启用日期
        if (values.userTyrq != null && values.userTyrq.valueOf() < values.userQyrq.valueOf()) {
          return Message.warning({ title: formatMessage({ id: 'e9.info.data.warning' }), duration: 1500 });
        }
        UserStore.saveData(values);
      }
    });
  });

  return (
    <EditForm
      title={formatMessage({ id: 'e9.sys.user.title' })}
      visible={UserStore.editVisible}
      footer={false}
      onClose={() => UserStore.closeEditForm()}
      opt={UserStore.opt}
      style={{ width: '500px' }}
      extra={
        <span>
          <Button.Group style={{ marginLeft: '10px' }} >
            <Button type="primary" onClick={savedata}><Icon className="iconfont iconsave" />{formatMessage({ id: 'e9.btn.save' })}</Button>
          </Button.Group>
        </span >}
    >
      <Form
        value={UserStore.editRecord}
        onChange={UserStore.onRecordChange}
        {...formItemLayout}
        saveField={(f) => {
          setField(f);
        }}
      >
        <FormItem required label={`${formatMessage({ id: 'e9.sys.user.userLoginname' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="userLoginname"
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.sys.user.userLoginname' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.user.userName' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="userName"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.user.userName' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.user.userEnname' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="userEnname"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.user.userEnname' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.sys.user.orgId' })}：`} required requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Select
            name="orgId"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.sys.user.orgId' })}
          >
            {UserStore.orgList.map(item => (
              <Select.Option key={item.id} value={item.id}>{item.orgName}</Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.user.userType' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Select
            name="userType"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.sys.user.userType' })}
          >
            <Select.Option key="4" value="4">{formatMessage({ id: 'e9.sys.user.type.v0' })}</Select.Option>
            <Select.Option key="1" value="1">{formatMessage({ id: 'e9.sys.user.type.v1' })}</Select.Option>
            <Select.Option key="2" value="2">{formatMessage({ id: 'e9.sys.user.type.v2' })}</Select.Option>
            <Select.Option key="3" value="3">{formatMessage({ id: 'e9.sys.user.type.v3' })}</Select.Option>
          </Select>
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.sys.user.userPost' })}：`}>
          <Input
            name="userPost"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.user.userPost' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.sys.user.userTel' })}：`}>
          <Input
            name="userTel"
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.sys.user.userTel' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.sys.user.userTax' })}：`}>
          <Input
            name="userTax"
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.sys.user.userTax' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.sys.user.userMail' })}：`}>
          <Input
            name="userMail"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.user.userMail' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.sys.user.userEnable' })}：`}>
          <Switch
            name="userEnable"
            size="small"
            style={{ width: '25%' }}
            checked={UserStore.editRecord.bUserEnable}
            checkedChildren={formatMessage({ id: 'e9.pub.enable' })}
            unCheckedChildren={formatMessage({ id: 'e9.pub.disable' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.user.userQyrq' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`} >
          <DatePicker
            name="userQyrq"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.sys.user.userQyrq' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.sys.user.userTyrq' })}：`}>
          <DatePicker
            name="userTyrq"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.sys.user.userTyrq' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.pub.whr' })}：`}>
          <Input
            name="whr"
            maxLength={20}
            disabled
            placeholder={formatMessage({ id: 'e9.pub.whr' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.pub.whsj' })}：`}>
          <DatePicker
            name="whsj"
            style={{ width: '100%' }}
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

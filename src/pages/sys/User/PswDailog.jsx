import React, { useState } from 'react';
import { Input, Form, Button, Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import IceNotification from '@icedesign/notification';
import UserStore from '../../../stores/user/UserStore';
import EditForm from '../../../components/EditForm';

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
        UserStore.changepassword(values.id, values.password).then(() => {
          UserStore.showPasswordDailog(false);
          IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.sys.user.info.changepasswordSuccess' }) });
        });
      }
      UserStore.setSelectRows([], []);
    });
  });
  return (
    <EditForm
      title={formatMessage({ id: 'e9.sys.user.btn.changepassword' })}
      visible={UserStore.pswModalVisible}
      footer={false}
      onClose={() => UserStore.showPasswordDailog(false)}
      opt="edit"
      style={{ width: '400px' }}
      extra={
        <span>
          <Button.Group style={{ marginLeft: '10px' }} >
            <Button type="primary" onClick={savedata}><Icon className="iconfont iconsave" />{formatMessage({ id: 'e9.btn.save' })}</Button>
          </Button.Group>
        </span>
      }
    >
      <Form
        value={UserStore.passwordValues}
        onChange={UserStore.setPasswordValues}
        {...formItemLayout}
        saveField={(f) => {
          setField(f);
        }}
      >
        <FormItem label={`${formatMessage({ id: 'e9.sys.user.userName' })}：`}  {...formItemLayout}>
          <Input
            name="userName"
            maxLength={50}
            disabled
            placeholder={formatMessage({ id: 'e9.sys.user.userName' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.user.userPassword' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`} {...formItemLayout}>
          <Input
            name="password"
            maxLength={20}
            htmlType="password"
            placeholder={formatMessage({ id: 'e9.sys.user.userPassword' })}
          />
        </FormItem>
      </Form>
    </EditForm>
  );
});

export default injectIntl(EditDialog);

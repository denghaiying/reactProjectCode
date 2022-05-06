import React from 'react';
import { Button, Input, Dialog } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import IceNotification from '@icedesign/notification';
import { E9FormBinderWrapper, EFormBinder } from '../../../components/EFormBinder';
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

  const form = React.createRef();
  const savedata = () => {
    const { validateFields } = form.current;
    validateFields((errors, values) => {
      if (!errors) {
        UserStore.changepassword(values.id, values.password).then(() => {
          UserStore.showPasswordDailog(false);
          IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.sys.user.info.changepasswordSuccess' }) });
        });
      }
    });
  };

  return (
    <Dialog
      title={formatMessage({ id: 'e9.sys.user.btn.changepassword' })}
      visible={UserStore.pswModalVisible}
      footer={<Button type="primary" onClick={savedata} >{formatMessage({ id: 'e9.btn.save' })}</Button>}
      onClose={() => UserStore.showPasswordDailog(false)}
      onOk={() => UserStore.showPasswordDailog(false)}
      onCancel={() => UserStore.showPasswordDailog(false)}
    >
      <E9FormBinderWrapper value={UserStore.passwordValues} onChange={UserStore.setPasswordValues} formItemLayout={formItemLayout} refForm={form}>
        <EFormBinder name="userName" label={`${formatMessage({ id: 'e9.sys.user.userName' })}：`}>
          <Input
            maxLength={50}
            disabled
            placeholder={formatMessage({ id: 'e9.sys.user.userName' })}
          />
        </EFormBinder>
        <EFormBinder required name="password" label={`${formatMessage({ id: 'e9.sys.user.userPassword' })}：`}>
          <Input
            maxLength={20}
            htmlType="password"
            placeholder={formatMessage({ id: 'e9.sys.user.userPassword' })}
          />
        </EFormBinder>
      </E9FormBinderWrapper>
    </Dialog >
  );
});

export default injectIntl(EditDialog);

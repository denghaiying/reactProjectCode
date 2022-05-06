import React from 'react';
import { Button, Transfer, Dialog } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import IceNotification from '@icedesign/notification';
import UserStore from '../../../stores/user/UserStore';


const RoleSetDailog = observer(props => {
  const { intl: { formatMessage } } = props;

  const getDataSource = (data) => {
    return data.map(d => {
      return { value: d.id, label: d.roleName };
    });
  };

  const savedata = () => {
    UserStore.saveUserrole().then(() => {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.sys.user.info.setroleSuccess' }) });
    });
  };

  const handleChange = (value) => {
    UserStore.reSetroleData(value);
  };

  return (
    <Dialog
      title={formatMessage({ id: 'e9.sys.user.btn.setrole' })}
      visible={UserStore.rsModalVisible}
      footer={<Button type="primary" onClick={savedata} >{formatMessage({ id: 'e9.btn.save' })}</Button>}
      onClose={() => UserStore.showRsDailog(false)}
      onOk={() => UserStore.showRsDailog(false)}
      onCancel={() => UserStore.showRsDailog(false)}
    >
      <Transfer showSearch
        value={UserStore.userroleIds}
        dataSource={getDataSource(UserStore.roleData)}
        onChange={handleChange}
        titles={[formatMessage({ id: 'e9.sys.user.setrole.alltitle' }),
        formatMessage({ id: 'e9.sys.user.setrole.owntitle' })]}
      />
    </Dialog>
  );
});


export default injectIntl(RoleSetDailog);

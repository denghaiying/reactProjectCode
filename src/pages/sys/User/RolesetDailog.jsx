import React from 'react';
import { Button, Transfer, Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import IceNotification from '@icedesign/notification';
import UserStore from '../../../stores/user/UserStore';
import EditForm from '../../../components/EditForm';

const RoleSetDailog = observer(props => {
  const { intl: { formatMessage } } = props;

  const getDataSource = (data) => {
    return data.map(d => {
      return { value: d.id, label: d.roleName };
    });
  };

  const savedata = () => {
    UserStore.saveUserrole().then(() => {
      UserStore.showRsDailog(false);
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.sys.user.info.setroleSuccess' }) });
    });
    UserStore.setSelectRows([], []);
  };

  const handleChange = (value) => {
    UserStore.reSetroleData(value);
  };

  return (
    <EditForm
      title={formatMessage({ id: 'e9.sys.user.btn.setrole' })}
      visible={UserStore.rsModalVisible}
      footer={false}
      onClose={() => UserStore.showRsDailog(false)}
      opt="add"
      extra={
        <span>
          <Button.Group style={{ marginLeft: '10px' }} >
            <Button type="primary" onClick={savedata}><Icon className="iconfont iconsave" />{formatMessage({ id: 'e9.btn.save' })}</Button>
          </Button.Group>
        </span>
      }
    >
      <Transfer showSearch
        value={UserStore.userroleIds}
        dataSource={getDataSource(UserStore.roleData)}
        onChange={handleChange}
        titles={[formatMessage({ id: 'e9.sys.user.setrole.alltitle' }),
        formatMessage({ id: 'e9.sys.user.setrole.owntitle' })]}
      />
    </EditForm >
  );
});


export default injectIntl(RoleSetDailog);

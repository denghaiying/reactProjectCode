import React from 'react';
import { observer } from 'mobx-react';
import { injectIntl } from 'react-intl';

import { getLocale } from '../../utils/locale';
import LoginStore from '../../stores/system/LoginStore';

import './infoContent.less';

const local = getLocale();

const InfoContent = observer(props => {
  const { intl: { formatMessage } } = props;

  const handleMenuClick = () => {
    LoginStore.loginout();
  };
  return (
    <div className="setInfo-content">
      <div className="info">
        <img src={[require('../../styles/img/user-logo.png')]} alt="" />
        <span className="drop-name">{LoginStore.userinfo.userLoginname}</span>
        <span style={{ fontSize: 14 }}>{local && local === 'en-US' ? LoginStore.userinfo.userEnname : LoginStore.userinfo.userName}</span>
      </div>
      <div className="iconfont iconlock drop-item drop-item1" onClick={props.showChangePswD}><span className="text">{formatMessage({ id: 'e9.main.changepsw' })}</span></div>
      <div className="iconfont iconpoweroff1 drop-item drop-item2" onClick={handleMenuClick}>
        <span className="text">{formatMessage({ id: 'e9.main.logout' })}</span>
      </div>
    </div>
  );
});

export default injectIntl(InfoContent);

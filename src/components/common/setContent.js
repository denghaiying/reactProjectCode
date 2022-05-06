import React from 'react';
import { Switch } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import LoginStore from '@/stores/system/LoginStore';
import PtinfoStore from '@/stores/system/PtinfoStore';
import './setContent.less';


const SetContent = observer(props => {
  const { intl: { formatMessage } } = props;


  const onLeftMenuChange = () => {
    LoginStore.changeMenuType('L');
  };

  const onTopMenuChange = () => {
    LoginStore.changeMenuType('T');
  };

  const onMainMenuChange = () => {
    LoginStore.changeMenuType('M');
  };

  // const onChangeTheme = (value) => {
  //   if (this.props.theme !== value) {
  //     this.props.onChangeTheme(value)
  //     localStorage.setItem('theme', value)
  //   }
  // }
  return (
    <div className="setInfo">
      <div className="settext">
        <p className="title"><img src={[require('@/styles/img/setting-black.png')]} alt="" />{formatMessage({ id: 'e9.main.setting' })}</p>
        <p className="detail">{formatMessage({ id: 'e9.main.setting.context' })}</p>
      </div>
      <p className="choose" style={{ marginTop: 20 }}>{formatMessage({ id: 'e9.main.setting.layout' })}</p>
      <div className="switch">
        <span>{formatMessage({ id: 'e9.main.setting.leftmenu' })}</span>
        <Switch onChange={onLeftMenuChange}
          checked={LoginStore.menutype === 'L'}
          disabled={LoginStore.menutype === 'L'}
        />
      </div>
      <div className="switch">
        <span>{formatMessage({ id: 'e9.main.setting.topmenu' })}</span>
        <Switch onChange={onTopMenuChange}
          checked={LoginStore.menutype === 'T'}
          disabled={LoginStore.menutype === 'T'}
        />
      </div>
      <div className="switch">
        <span>{formatMessage({ id: 'e9.main.setting.mainpagemenu' })}</span>
        <Switch onChange={onMainMenuChange}
          checked={LoginStore.menutype !== 'L' && LoginStore.menutype !== 'T'}
          disabled={LoginStore.menutype !== 'L' && LoginStore.menutype !== 'T'}
        />
      </div>
      {/* <div className="choose">{formatMessage({ id: 'e9.main.setting.skin' })}</div>
      <div className="skin-default" onClick={() => PtinfoStore.setTheme('default')}>{formatMessage({ id: 'e9.main.setting.skin.default' })}</div>
      <div className="skin-orange" onClick={() => PtinfoStore.setTheme('orange')}>{formatMessage({ id: 'e9.main.setting.skin.orange' })}</div> */}
    </div>
  );
});

export default injectIntl(SetContent);

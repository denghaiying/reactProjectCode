import React, { useState } from 'react';
import { Icon, Balloon, Dialog, Form, Field, Input } from '@alifd/next';
import IceNotification from '@icedesign/notification';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import LoginStore from '@/stores/system/LoginStore';
import PtinfoStore from '@/stores/system/PtinfoStore';
import UserStore from '@/stores/user/UserStore';
import { getLocale } from '@/utils/locale';
import SetContent from './setContent';
import InfoContent from './infoContent';

import './hFooter.less';

const local = getLocale();

const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const { Item: FormItem } = Form;

const HFooter = observer(props => {
  const { intl: { formatMessage } } = props;
  const { menupage } = props;
  const rebackHome = () => {
    props.history.push('/');
  };

  const field = Field.useField();

  const [pdVisible, setPdVisible] = useState(false);

  const showChangePassword = () => {
    field.setValues({ userName: LoginStore.userinfo.userName }); setPdVisible(true);
  };

  const handleChangePsw = (values, errors) => {
    if (!errors) {
      LoginStore.changepassword(LoginStore.userinfo.id, values.password, values.oldpassword).then(() => {
        IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.sys.user.info.changepasswordSuccess' }) });
        setPdVisible(false);
      }).catch(err => {
        IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: err.message });
      });
    }
  };

  const checkPassword = (rule, value, callback) => {
    const { getValue } = field;
    if (value && value !== getValue('password')) {
      return callback(formatMessage({ id: 'e9.sys.user.info.errortwicepsw' }));
    }
    return callback();
  };


  return (
    <div className="nav-footer pull-right">
      {!menupage &&
        <div className="pull-left">
          <div className="header-home pull-left" onClick={rebackHome}>
            <img className="pull-left" src={[require('@/styles/img/home_white.png')]} alt="" />
          </div>
          {/* <div className="header-tips pull-left">
            <Badge count={0}>
              <Balloon
                trigger={<img src={[require('@/styles/img/tips-icon-white.png')]} alt="" />}
                triggerType="hover"
                align="br"
                alignEdge
                style={{ width: 250, height: 300 }}
              >
                <TipsContent />
              </Balloon>
            </Badge>
          </div> */}
          {/* <div className="header-collect pull-left">
            <img  ```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````className="pull-left" src={[require('@/styles/img/collect-star.png')]} alt="" />
          </div> */}
          {/* <div className="header-setting pull-left">
            <Balloon
              className="setting-balloon"
              trigger={<img src={[require('@/styles/img/setting-white.png')]} alt="" />}
              triggerType="click"
              align="br"
              alignEdge
              style={{ width: 280 }}
            >
              <SetContent />
            </Balloon>
          </div> */}
          <div className={`pull-left line${PtinfoStore.theme === 'orange' && '-orange' || ''}`} />
        </div>
      }
      <div className="header-setInfo pull-left">
        <img className="pull-left" src={[require('@/styles/img/user-logo.png')]} alt="" />
        <Balloon
          className="info-balloon"
          trigger={
            <div className="user"
              style={{ fontSize: 14 }}
            >
              {local && local === 'en-US' ? LoginStore.userinfo.userEnname : LoginStore.userinfo.yhmc}<Icon
                type="arrow-down"
              />
            </div>}
          triggerType="click"
          align="br"
          alignEdge
          style={{ width: 350 }}
        >
          <InfoContent showChangePswD={showChangePassword} />
        </Balloon>
        <div className="clear" />
      </div>
      <div className="clear" />
      <Dialog
        title={formatMessage({ id: 'e9.sys.user.btn.changepassword' })}
        visible={pdVisible}
        footer={false}
        onClose={() => { setPdVisible(false); }}
        onOk={() => { setPdVisible(false); }}
        onCancel={() => { setPdVisible(false); }}
        style={{ width: 300 }}
      >
        <Form size="small" field={field} {...formItemLayout}>
          <FormItem label={`${formatMessage({ id: 'e9.sys.user.userName' })}：`}>
            <Input
              name="userName"
              maxLength={50}
              disabled
              placeholder={formatMessage({ id: 'e9.sys.user.userName' })}
            />
          </FormItem>
          <FormItem required label={`${formatMessage({ id: 'e9.sys.user.oldPassword' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
            <Input
              name="oldpassword"
              maxLength={20}
              htmlType="password"
              placeholder={formatMessage({ id: 'e9.sys.user.oldPassword' })}
            />
          </FormItem>
          <FormItem required label={`${formatMessage({ id: 'e9.sys.user.userPassword' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
            <Input
              name="password"
              maxLength={20}
              htmlType="password"
              placeholder={formatMessage({ id: 'e9.sys.user.userPassword' })}
            />
          </FormItem>
          <FormItem required validator={checkPassword} label={`${formatMessage({ id: 'e9.sys.user.repeatPassword' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
            <Input
              name="repeatpassword"
              maxLength={20}
              htmlType="password"
              placeholder={formatMessage({ id: 'e9.sys.user.repeatPassword' })}

            />
          </FormItem>
          <FormItem wrapperCol={{ offset: 20 }} style={{ marginTop: 24 }}>
            <Form.Submit validate type="primary" onClick={(v, e) => handleChangePsw(v, e)}>{formatMessage({ id: 'e9.btn.save' })}</Form.Submit>
          </FormItem>
        </Form>
      </Dialog >
    </div>
  );
});

export default withRouter(injectIntl(HFooter));

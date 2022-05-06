/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import { Grid, Balloon } from '@alifd/next';
import Header from '@/layout/header';
import LoginStore from '@/stores/system/LoginStore';
import PtinfoStore from '@/stores/system/PtinfoStore';
import { getLocale } from '@/utils/locale';
import history from '@/utils/history';
import util from '@/utils/util';
import defaultImg from '@/styles/img/sys/icon_default.png';
import defaultImgHover from '@/styles/img/sys/icon_default_hover.png';
import defaultImgOrange from '@/styles/img/sys/icon_default_orange.png';
import '@/styles/css/style.less';
import './mainPageMenu.less';

const local = getLocale();

const { Row, Col } = Grid;
// const Tooltip = Balloon.Tooltip;

const MainPageMenu = observer((props) => {
  const {
    intl: { formatMessage },
  } = props;
  const [activeItem, setActiveItem] = useState('0');

  useEffect(() => {
    document.title = formatMessage({ id: 'e9.main.title' });
    PtinfoStore.find();
    LoginStore.findSystem({ allshow: 1 });
  }, []);

  const getImg = (url) => {
    // try {
    return require(url);
    // } catch (e) {
    //   console.log('err:' + e);
    //   return null;
    // }
  };

  const getSystems = () => {
    const modules = [];
    LoginStore.systems
      .filter(
        (item) =>
          item.systemShowtype !== 0 ||
          (LoginStore.userinfo.userType === 1 && item.id === 'sysuser'),
      )
      .filter((item) => item.systemShowtype !== 0)
      .forEach((item) => {
        let img = null;
        let imghvr = null;
        let imgorg = null;
        try {
          img = require(`@/styles/img/sys/icon_${item.id}_hover.png`);
          imghvr = require(`@/styles/img/sys/icon_${item.id}.png`);
          imgorg = require(`@/styles/img/sys/icon_${item.id}_orange.png`);
        } catch {}
        modules.push({
          title:
            local && local === 'en-US' ? item.systemEnname : item.systemName,
          icon_hover:
            item.systemIcon ||
            (item.systemType !== 9 && imghvr) ||
            defaultImgHover,
          icon: item.systemIcon || (item.systemType !== 9 && img) || defaultImg,
          icon_orange:
            item.systemIcon ||
            (item.systemType !== 9 && imgorg) ||
            defaultImgOrange,
          systype: item.systemType,
          url: item.systemUrl,
          key: item.id,
          type: item.systemShowtype,
        });
      });
    return modules;
  };

  const clickItem = (item) => {
    if (item.type === 1) {
      history.push(`/run/${item.key}`);
    } else if (item.type === 2) {
      window.open(
        util.addUrlParam(item.url, { token: LoginStore.token }),
        item.title,
      );
    }
  };

  const mainmenu = (
    <div
      className={`main-page ${
        (PtinfoStore.theme === 'orange' && 'main-page-orange') || ''
      }`}
    >
      <Header menupage />
      <div
        className={`page-container ${
          (PtinfoStore.theme === 'orange' && 'page-container-orange') || ''
        }`}
      >
        <div className="inner-div">
          <div className="inner-row">
            <Row wrap gutter={16}>
              {getSystems().map((item, index) => (
                <Col span={3} key={index} className="my-col">
                  <div
                    className="item"
                    key={item.key}
                    onClick={() => clickItem(item)}
                    onMouseOver={() => setActiveItem(item.key)}
                  >
                    <img
                      src={[
                        (activeItem === item.key && item.icon_hover) ||
                          (PtinfoStore.theme === 'orange' &&
                            item.icon_orange) ||
                          item.icon,
                      ]}
                      alt=""
                    />
                    <p className="name">{item.title}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          {PtinfoStore.theme !== 'orange' && <div className="top-light" />}
          {PtinfoStore.theme !== 'orange' && <div className="bottom-light" />}
        </div>
        {/* <div className="menu-change">
          <div className="menu-change-logo">
            <Tooltip trigger={<div className={`logo-dot logo${props.theme || '' && '-y'}-dot1`} onClick={() => { }} />} align="t" triggerType="hover">首页</Tooltip>
            <Tooltip trigger={<div className={`logo-dot logo${props.theme || '' && '-y'}-dot2`} />} align="t" triggerType="hover">text1</Tooltip>
            <Tooltip trigger={<div className={`logo-dot logo${props.theme || '' && '-y'}-dot3`} />} align="t" triggerType="hover">text2</Tooltip>
          </div>
        </div> */}
      </div>
      {/* <div className="page-footer">
        {PtinfoStore.record.reg && `${formatMessage({ id: 'e9.main.licto' })} ${PtinfoStore.record.ptinfoConame}`}
        {!PtinfoStore.record.reg && formatMessage({ id: 'e9.main.nolic' })}
      </div> */}
    </div>
  );

  return <div>{mainmenu}</div>;
});

export default injectIntl(MainPageMenu);

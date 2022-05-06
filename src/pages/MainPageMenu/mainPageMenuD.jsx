import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useIntl } from 'umi';
import { observer } from 'mobx-react';
import LoginStore from '@/stores/system/LoginStore';
import PtinfoStore from '@/stores/system/PtinfoStore';
import { getLocale } from '@/utils/locale';
import { history } from 'umi';
import util from '@/utils/util';
import defaultImg from '@/styles/img/mpmd/icon/elp/icon_default.png';
import defaultImg_t from '@/styles/img/mpmd/icon/btf/icon_default.png';
import CanvBg from './canvBg';
import './mainPageMenuD.less';

const local = getLocale();

const MainPageMenuD = (props) => {
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  debugger;
  useEffect(() => {
    document.title = formatMessage({ id: 'e9.main.title' });
    debugger;
    PtinfoStore.find();
    LoginStore.findXTname();
    LoginStore.findSystem({ allshow: 1 });
  }, []);
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
        let img_t = null;
        try {
          img = require(`@/styles/img/mpmd/icon/elp/icon_${item.id}.png`);
          img_t = require(`@/styles/img/mpmd/icon/btf/icon_${item.id}.png`);
        } catch {}
        modules.push({
          title: local && local === 'en-US' ? item.systemEnname : item.text,
          icon:
            `/api${item.icon}` || (item.systemType !== 9 && img) || defaultImg,
          icon_t:
            `/api${item.icon}` ||
            (item.systemType !== 9 && img_t) ||
            defaultImg_t,
          systype: item.systemType,
          url: item.url,
          furl: item.furl,
          opentype: item.openlx,
          key: item.umid,
          type: item.systemShowtype,
        });
      });
    return modules;
  };

  const clickItem = (item) => {
    if (item.opentype === '3') {
      window.open(
        util.addUrlParam(item.url === '0' ? '/eps/control/main' : item.url, {
          mid: item.key,
          title: encodeURIComponent(item.title),
          murl: item.furl,
        }),
        item.title,
      );
    } else if (item.opentype === '4') {
      window.location.href = util.addUrlParam(
        item.url === '0' ? '/eps/control/main' : item.url,
        {
          mid: item.key,
          title: encodeURIComponent(item.title),
          murl: item.url,
        },
      );
    } else {
      history.push(`/user/main/${item.key}`);
    }
  };

  return (
    <div className="main-page-Menu">
      <div className="main-cover" />
      <div className="bg-canvas">
        <CanvBg className="canvas" />
      </div>
      <div className="inner-content">
        <div className="left-border" />
        <div className="right-border" />
        <div
          className="exit"
          onClick={() => {
            LoginStore.loginout();
          }}
        >
          <img src={require('@/styles/img/mpmd/exit-btn.png')} alt="" />
          {/* <p className="exit-text">退出</p> */}
        </div>
        <div className="top">
          <p className="title" style={{ fontSize: '20px' }}>
            {LoginStore.xtname}
            {/* // formatMessage({ id: "e9.main.title" })} */}
          </p>
        </div>
        <div className="item-group">
          <div style={{ position: 'relative', zIndex: 10, height: '100%' }}>
            {getSystems().map((item, index) => (
              <li
                className="item"
                key={item.key}
                onClick={() => clickItem(item)}
              >
                <img
                  src={(index % 2 === 0 && item.icon) || item.icon_t}
                  className="my-img"
                  alt=""
                />
                <p className="item-name">{item.title}</p>
              </li>
            ))}
          </div>
        </div>
      </div>
      <p className="footer"></p>
    </div>
  );
};

export default observer(MainPageMenuD);

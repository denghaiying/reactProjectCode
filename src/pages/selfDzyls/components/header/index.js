import { useEffect, useState, useRef } from 'react';
import { history } from 'umi';
import style from './index.less';
import fanhui from '../../assets/images/icon_fanhui.png';
import { observer, useLocalStore } from 'mobx-react';

const Header = observer((props) => {
  const goBack = () => {
    history.go(-1);
  };
  const store = useLocalStore(() => ({
    titlename: '局馆介绍',
  }));
  useEffect(() => {
    store.titlename=props.name;
  }, [props.name]);

  return (
    <div className={`${style['header-area']}`}>
    <div className={`${style['title']}`}>民生档案电子阅览室</div>
    <div className={`${style['sub-title']}`}>{store.titlename}</div>
    <div className={`${style['return']}`} onClick={() => goBack()}>
      <img src={fanhui} />
      返回
    </div>
  </div>
  );
});
export default Header;

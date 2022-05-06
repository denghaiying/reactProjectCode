import React from 'react';
import { history } from 'umi';
import style from './index.less';
import fanhui from '../../assets/images/icon_fanhui.png';

class Header extends React.Component {
  goBack() {
    history.go(-1);
  }

  render() {
    return (
      <div className={`${style['header-area']}`}>
        <div className={`${style['title']}`}>民生档案自助服务一体机</div>
        <div className={`${style['sub-title']}`}>局馆介绍</div>
        <div className={`${style['return']}`} onClick={this.goBack}>
          <img src={fanhui} />
          返回
        </div>
      </div>
    );
  }
}
export default Header;

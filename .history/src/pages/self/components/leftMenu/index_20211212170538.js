import React from 'react';
import style from './index.less';
import danweijeishao from '@/assets/images/icon_danweijeishao.png';
import zuzhijiagou from '@/assets/images/icon_zuzhijiagou.png';
import renyuaninxi from '@/assets/images/icon_renyuaninxi.png';
import zhengfugongkai from '@/assets/images/icon_zhengfugongkai.png';
import gongzuodongtai from '@/assets/images/icon_gongzuodongtai.png';
import gongshigonggao from '@/assets/images/icon_gongshigonggao.png';

class LeftMenu extends React.Component {
  state = {
    active: 6,
    menus: [
      { id: 1, name: '单位介绍', icon: danweijeishao },
      { id: 2, name: '组织架构', icon: zuzhijiagou },
      { id: 3, name: '人员信息', icon: renyuaninxi },
      { id: 4, name: '政府公开', icon: zhengfugongkai },
      { id: 5, name: '工作动态', icon: gongzuodongtai },
      { id: 6, name: '公示公告', icon: gongshigonggao },
    ],
  };

  handleClick(item) {
    this.setState({ active: item.id });
  }

  renderMenu() {
    const { menus, active } = this.state;
    return menus.map((item) => {
      return (
        <div
          key={item.id}
          onClick={this.handleClick.bind(this, item)}
          className={
            active === item.id
              ? `${style['menu-list-det']} ${style['active']}`
              : `${style['menu-list-det']}`
          }
        >
          <img src={item.icon} />
          <span>{item.name}</span>
        </div>
      );
    });
  }

  render() {
    return <div className={`${style['left-menu']}`}>{this.renderMenu()}</div>;
  }
}
export default LeftMenu;

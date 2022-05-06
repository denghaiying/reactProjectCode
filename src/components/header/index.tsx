import { useEffect } from 'react';
import './index.less';
import { Badge, Tooltip, Space } from 'antd';
import Logo from '/public/favicon.ico';
import UserOrg from '@/components/UserOrg';
import SysStore from '@/stores/system/SysStore';
import NoticeIconView from '../NoticeIcon';
import Avatar from '../RightContent/AvatarDropdown';
import ToolsIcon from '@/components/ToolsIcon';
import { observer, Observer } from 'mobx-react';
import icon_jyc from '@/styles/assets/img/icon_jyc.png';
import icon_mark from '@/styles/assets/img/icon_mark.png';
import icon_todo2 from '@/styles/assets/img/icon_todo2.png';
import icon_home from '@/styles/img/home_white.png';
import RightStore from '@/components/RightContent/RightStore';
import { history, Link } from 'umi';

let sysname = localStorage.getItem('sysname');
sysname = sysname.replaceAll('"', '');
const header = observer((props) => {
  useEffect(() => {
    RightStore.queryAllDbswCount();
    RightStore.queryAllCartCount();
    RightStore.querygjx();
    RightStore.queryAllWdscCount();
    RightStore.getUserOption('CONTROLYHXX');
    window.RightStore = RightStore;
  }, []);

  return (
    <div className="header">
      <div className="left">
        {/* <span style={{ fontSize: '30px', fontWeight: 'bold' }}>
          <img height={'70px'} src={Logo} />
        </span> */}
        <span className="title">{props.mainStore?.mkmc || sysname}</span>
        {/* <img
          src={require('../../styles/assets/img/icon_yingyong.png')}
          className="app-img"
          alt=""
        /> */}
        {/* <span className="app">应用中心</span>
        <Select defaultValue="库房管理" style={{ width: 180 }}>
          <Option value="库房管理">库房管理</Option>
          <Option value="门禁管理">门禁管理</Option>
          <Option value="登陆管理">登陆管理</Option>
        </Select> */}
      </div>
      <div className="right">
        <Space size={[20, 16]} wrap>
          {props.showMainHome && (
            <Tooltip title="平台首页">
              <a href="/user/mainPageMenuD">
                <img src={icon_home} className="right-img" alt="" />
              </a>
            </Tooltip>
          )}
          <UserOrg />
          <NoticeIconView />
          <Tooltip title="待办事务">
            <Badge size={'small'} count={RightStore.dbswCount}>
              <a
                onClick={() => {
                  props.mainStore.addTab(
                    { name: '待办事务', path: '/runRfunc/dbsw', key: 'dbsw' },
                    'dbsw',
                  );
                }}
              >
                <img src={icon_todo2} className="right-img" alt="" />
              </a>
            </Badge>
          </Tooltip>

          <Tooltip title="我的收藏">
            <a
              onClick={() => {
                props.mainStore.addTab(
                  { name: '我的收藏', path: '/runRfunc/wdsc', key: 'wdsc' },
                  'wdsc',
                );
              }}
            >
              <Badge size={'small'} count={RightStore.wdscCount}>
                <img src={icon_mark} className="right-img" alt="" />
              </Badge>
            </a>
          </Tooltip>
          <Tooltip title="档案借阅车">
            <a
              onClick={() => {
                RightStore.yhxxpx
                  ? props.mainStore.addTab(
                      {
                        name: '档案借阅车',
                        path: '/runRfunc/newdajyc',
                        key: 'newdajyc',
                      },
                      'newdajyc',
                    )
                  : props.mainStore.addTab(
                      {
                        name: '档案借阅车',
                        path: '/runRfunc/dajyc',
                        key: 'dajyc',
                      },
                      'dajyc',
                    );
              }}
            >
              <Badge size={'small'} count={RightStore.cartCount}>
                <img src={icon_jyc} className="right-img" alt="" />
              </Badge>
            </a>
          </Tooltip>

          <ToolsIcon />

          <Avatar menu />
        </Space>
      </div>
    </div>
  );
});

export default header;

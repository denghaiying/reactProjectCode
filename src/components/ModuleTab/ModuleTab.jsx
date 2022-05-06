import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Balloon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import './ModuleTab.scss';
import SystemService from '../../services/system/SystemService';
import { getLocale } from '../../utils/locale';


@withRouter
@injectIntl
export default class ModuleTab extends Component {
  constructor(props) {
    super(props);
    const {
      intl: { formatMessage },
    } = props;
    this.state = {
      items: [{ path: '/', title: formatMessage({ id: 'e9.desktop' }), active: true }],
    };
    this.local = getLocale();
  }

  pushItem (location) {
    // eslint-disable-next-line no-nested-ternary
    const pathname = location.pathname.startsWith('/rurl/') ? decodeURIComponent(location.pathname.substring(6)) :
      (location.pathname.startsWith('/run') ? location.pathname.substring(4) : location.pathname);

    const sys = location.pathname.startsWith('/rurl/') ? SystemService.getSystemByPath(pathname)
      : SystemService.getSystem(pathname.substring(1));
    if (sys || pathname === '/') {
      const { items } = this.state;
      let exist = false;
      items.forEach(item => {
        if (item.path === pathname) {
          item.active = true;
          exist = true;
        } else {
          item.active = false;
        }
      });
      if (!exist) {
        items.push({ path: pathname, title: this.local && this.local === 'en-US' ? sys.systemEnname : sys.systemName, active: true });
      }
      this.setState({ items });
    }
  }

  popItem (path) {
    const { items } = this.state;
    let exist = true;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.path === path) {
        if (item.active) {
          exist = false;
        }
        items.splice(i, 1);
      }
    }
    if (!exist) {
      this.props.history.push(items[items.length - 1].path);// 打开最后一个页面
    } else {
      this.setState({ items });
    }
  }

  componentWillReceiveProps (newProps) {
    if (this.props.location.pathname !== newProps.location.pathname) {
      //  let path = newProps.location.pathname;
      this.pushItem(newProps.location);
    }
  }

  render () {
    const { items } = this.state;
    return (
      <ul>{items.map(item => (
        <li className={`item ${item.active ? 'active' : null}`} key={item.path}>
          <Balloon.Tooltip trigger={
            <Link to={item.path.match(/^(https|http)?:\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/) ? `/rurl/${encodeURIComponent(item.path)}` : `/run${item.path}`}><button tabIndex="-1" />
            </Link>}
            align="t"
          >
            {item.title}
          </Balloon.Tooltip>
        </li>))}
      </ul>
    );
  }
}

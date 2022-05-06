
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Tab } from '@alifd/next';


const MainTab = withRouter((props) => {
  const { intl: { formatMessage } } = props;
  const [tabs, setTabs] = useState([{ umid: '0', path: '/', title: formatMessage({ id: 'e9.desktop' }), active: true }]);

  useEffect(() => {
    pushItem(props.location);
  }, [props.location.pathname])

  const clickTopNav=(item)=>{
    console.log(item);
    //alert(item.umid);
  }

  const pushItem = (location) => {
    // eslint-disable-next-line no-nested-ternary
    const pathname = location.pathname.startsWith('/rurl/') ? decodeURIComponent(location.pathname.substring(6)) :
      (location.pathname.startsWith('/run') ? location.pathname.substring(4) : location.pathname);
    if (pathname != "/midPage") {
      // const realPath =
      const items = Array.from(tabs);
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
        items.push({ path: pathname, title: pathname, active: true });
      }
      setTabs(items);
    }
  }

  return <Tab
  // onChange={UserMenuStore.setSelectedTab}
  // onClose={UserMenuStore.onRemoveTab}
  // activeKey={UserMenuStore.selectedTab}
  >
    {tabs && tabs.map(item => <Tab.Item title={item.title} onClick={()=>clickNav(item)} key={item.umid}></Tab.Item>)}
  </Tab>;
});

export default injectIntl(MainTab);

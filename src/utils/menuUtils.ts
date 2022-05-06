import { fetchMenuData } from '@/services/ant-design-pro/menu';

import util from '@/utils/util';
import { history } from 'umi';
// 修改菜单树结构兼容antdpro menu
const getTreeMenuData = (treeNodes: any, parentKey) => {
  let nodes = treeNodes.map((node) => {
    // node.icon = getIconByType(node.lx);
    let modules = {
      // icon: `${node.icon}` || (node.systemType !== 9 && img) || defaultImg,
      // icon_t:
      //   `${node.icon}` || (node.systemType !== 9 && img_t) || defaultImg_t,
      systype: node.systemType,
      url: node.url,
      furl: node.furl,
      name: node.text,
      openlx: node.openlx,
      lx: node.lx,
      key: node.umid,
      type: node.systemShowtype,
      umid: node.umid,
      locale: false,
    };
    if (node.mkurl != '0') {
      if (node.openlx == '5') {
        modules['path'] = `/eps/control/main/iframePage?rungn=${node.umid}`;
      } else {
        modules['path'] = `/runRfunc/${node.url}`;
      }
      modules['parentKeys'] = parentKey;
      modules['lx'] = node.lx;
      modules['openlx'] = node.openlx;
      modules['compent'] = `./${node.mkurl}/${node.url}`;
      modules['icon'] = `/api/eps/control/main/${node.icon}`.replace('@2x', '');
    } else {
      modules['component'] = '@/layouts/BaseLayout';
      modules['path'] = node.umid;
      modules['key'] = node.umid;
      modules['lx'] = node.lx;
      modules['openlx'] = node.openlx;
      modules['icon'] = `/api/eps/control/main/${node.icon}`.replace('@2x', '');
    }

    if (node.children && node.children.length > 0) {
      // // let img = null;
      // // let img_t = null;
      // try {
      //   // img = require(`@/styles/img/mpmd/icon/elp/icon_${item.id}.png`);
      //   // img_t = require(`@/styles/img/mpmd/icon/btf/icon_${item.id}.png`);
      // } catch { }
      modules.routes = getTreeMenuData(node.children, node.key);
    }

    return modules;
  });
  return nodes;
};

// const getRunFuncMenuData = (treeNodes) => {
//   let modules = {
//     path: '/runFunc',
//     layout: false,
//     locale: false,
//   };
//   let routes = [];
//   treeNodes.forEach(node => {
//     // node.icon = getIconByType(node.lx);
//     if (node.children && node.children.length > 0) {
//       const list = node.children.forEach(children => {
//         routes.push(
//           {
//             path: `/runFunc/${children.mkurl}/${children.url}`,
//             name: children.text,
//             locale: false,
//             layout: false,
//             openlx: children.openlx,
//             key: children.umid,
//             type: children.systemShowtype,
//             umid: children.umid,
//            // component: `./${children.mkurl}/${children.url}`,
//           })
//       })

//       // // let img = null;
//       // // let img_t = null;
//       // try {
//       //   // img = require(`@/styles/img/mpmd/icon/elp/icon_${item.id}.png`);
//       //   // img_t = require(`@/styles/img/mpmd/icon/btf/icon_${item.id}.png`);
//       // } catch { }
//     }

//   })
//   modules["routes"] = routes;
//   return modules;

// }

export const fetchMenuInfo = async () => {
  const treeNodes = await fetchMenuData();
  const normalMenus = getTreeMenuData(treeNodes, null);
  //   const funcMenus = getRunFuncMenuData(treeNodes);
  //  const result= normalMenus.concat(funcMenus)
  return normalMenus;
};

export const runFunc = (params) => {
  if (top.mainStore) {
    window.top.mainStore.addTab(
      { name: params.umname, path: params.path, key: params.path },
      params.path,
      params,
    );
    return;
  }
  if (params.type && params.dakid) {
    params.lx = params.type;
  }
  if (params.type && params.dakid) {
    params.lx = params.type;
  }
  window.top.runFunc(params.umid, params);
};

export const getMenuList = (mk: string) => {
  const menuList = util.getLStorage('menuData');
  if (mk) {
    return menuList.find((item) => item.key == mk).routes || [];
  }
  return menuList;
};

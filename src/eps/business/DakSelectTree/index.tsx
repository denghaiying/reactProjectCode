import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import tree3 from '@/styles/assets/img/oa-manage/icon_tree3.png';
import tree1 from '@/styles/assets/img/oa-manage/icon_tree1.png';
import tree2 from '@/styles/assets/img/oa-manage/icon_tree2.png';
import treeService from './treeService';
import SysStore from '@/stores/system/SysStore';

const DakSelectTree = observer((props) => {
  let [treeData, setTreeData] = useState([]);

  useEffect(() => {
    // content
    const params = {
      isby: 'N',
      noshowdw: 'Y',
      node: 'root',
      dw: SysStore.getCurrentCmp().id,
      dayh: SysStore.getCurrentUser().id,
    };
    treeService.findTree(params).then((o) => {
      debugger;
      console.log(o);
      setTreeData(o);
    });
  }, []);

  const getIconByType = (type) => {
    if (type == 'F') {
      return <img src={tree1} />;
    }
    if (type == '01') {
      return <img src={tree3} />;
    }
    if (type == '02') {
      return <img src={tree2} />;
    } else {
      return <img src={tree3} />;
    }
  };

  const getTreeNodeData = (treeNodes) => {
    let nodes = treeNodes.map((node) => {
      node.icon = getIconByType(node.lx);
      if (node.children && node.children.length > 0) {
        node.children = getTreeNodeData(node.children);
      }
      node.value = node.id;
      return node;
    });
    return nodes;
    debugger;
  };

  const getTreeComp = () => {
    if (props.disableChecked) {
      return (
        <TreeSelect
          style={{ width: props.width }}
          //    showIcon
          {...props}
          //    defaultExpandAll
          onSelect={props.onSelect}
          //     onCheck={props.store.onChecked}
          treeData={getTreeNodeData(JSON.parse(JSON.stringify(treeData)))}
        />
      );
    } else {
      return (
        <TreeSelect
          style={{ width: props.width }}
          //  checkable
          //    showIcon
          //     defaultExpandAll
          {...props}
          onSelect={props.onSelect}
          //     onCheck={props.store.onChecked}
          treeData={getTreeNodeData(JSON.parse(JSON.stringify(treeData)))}
        />
      );
    }
  };

  return getTreeComp();
});

export default DakSelectTree;

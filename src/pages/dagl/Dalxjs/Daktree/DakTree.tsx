import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import './index.less';
import tree3 from '@/styles/assets/img/oa-manage/icon_tree3.png';
import tree1 from '@/styles/assets/img/oa-manage/icon_tree1.png';
import tree2 from '@/styles/assets/img/oa-manage/icon_tree2.png';

const DakTree = observer((props) => {
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
      return node;
    });
    return nodes;
  };

  return (
    <Tree
      showIcon
      defaultExpandAll
      onSelect={props.onSelect}
      treeData={getTreeNodeData(JSON.parse(JSON.stringify(props.treeData)))}
    />
  );
});

export default DakTree;

import React, { useState } from 'react';
import { Tree } from 'antd';
import { observer } from 'mobx-react';
import tree3 from '@/styles/assets/img/oa-manage/icon_tree3.png';
import tree1 from '@/styles/assets/img/oa-manage/icon_tree1.png';
import tree2 from '@/styles/assets/img/oa-manage/icon_tree2.png';

const DakTree = observer((props) => {
  // const [autoExpandParent, setAutoExpandParent] = useState(true);
  // const [defaultExpandedKeys, setDefaultExpandedKeys] = useState(['kkjs']);
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
        var sjData = [];
        for (var i = 0; i < node.children.length; i++) {
          let newKey = {};
          newKey = node.children[i];
          newKey.key = newKey.id;
          sjData.push(newKey);
        }
        node.children = sjData;
      }
      return node;
    });
    return nodes;
  };

  const getdefaultExpandedKeys = (treeNodes) => {
    debugger;
    if (treeNodes && treeNodes.length > 0) {
      const aa = [];
      aa.push(treeNodes[0].key);
      console.log('props.treeData.0key', aa);
      setDefaultExpandedKeys(aa);
      return aa;
    }
    return ['kkjs'];
  };

  const getTreeComp = () => {
    // if(props.treeData && JSON.parse(JSON.stringify(props.treeData)).length>0) {
    //   console.log("props.treeData", JSON.parse(JSON.stringify(props.treeData)));
    //   console.log("props.treeData[0]", (JSON.parse(JSON.stringify(props.treeData)))[0]);
    // }
    if (props.disableChecked) {
      return (
        <Tree
          showIcon
          
          defaultExpandAll
          onSelect={props.onSelect}
          onCheck={props.store.onChecked}
          treeData={getTreeNodeData(JSON.parse(JSON.stringify(props.treeData)))}
        />
      );
    } else {
      return (
        <Tree
          checkable={props.checkable || true}
          showIcon
          defaultExpandAll={true}
          autoExpandParent={true}
          onSelect={props.onSelect}
          onCheck={props.store.onChecked}
          treeData={getTreeNodeData(JSON.parse(JSON.stringify(props.treeData)))}
        />
        //    <Tree
        //      checkable={props.checkable || true}
        //      showIcon
        // //     defaultExpandAll
        //      expandedKeys={ defaultExpandedKeys}
        //      autoExpandParent={autoExpandParent}

        // onExpand={async (keys, { expanded, node }) => {
        //   setAutoExpandParent(false);
        //   setDefaultExpandedKeys(getdefaultExpandedKeys(JSON.parse(JSON.stringify(props.treeData))));
        // }}
        // onExpand={async (keys, { expanded, node }) => {
        //   setAutoExpandParent(false);
        //   if (expanded) {
        //     await props.store.loadAsyncTreeData(node,
        //       <img src={tree1} />,
        //       <img src={tree2} />,
        //       <img src={tree3} />,
        //       );
        //   }
        //   runInAction(() => {
        //     props.store.expandedKeys = keys;
        //   });
        // }}
        //   onSelect={props.onSelect}
        //   onCheck={props.store.onChecked}
        //   treeData={getTreeNodeData(JSON.parse(JSON.stringify(props.treeData)))}
        // />
      );
    }
  };

  return getTreeComp();
});

export default DakTree;

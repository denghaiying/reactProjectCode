import React from 'react';
// import { Divider } from 'antd';
import { Toolbar, withPropsAPI } from 'gg-editor';

import { Divider, Tooltip } from 'antd';
import {
  SaveOutlined
} from '@ant-design/icons';
import ToolbarButton from './ToolbarButton';
import styles from './index.less';

const FlowToolbar = (props: any) => {
  const saveAction = () => {
    const { save, currentPage } = props.propsAPI;
    const sd = save();
    const d = currentPage.get('data');
    d.nodes = sd.nodes;
    d.edges = sd.edges;
    props.save.action(d);
  };
  return (
    <Toolbar className={styles.toolbar}>
      <ToolbarButton command="undo" text="撤销" />
      <ToolbarButton command="redo" text="重做" />
      <Divider type="vertical" />
      <ToolbarButton command="copy" text="复制" />
      <ToolbarButton command="paste" text="黏贴" />
      <ToolbarButton command="delete" text="删除" />
      <Divider type="vertical" />
      <ToolbarButton command="zoomIn" icon="zoom-in" text="放大" />
      <ToolbarButton command="zoomOut" icon="zoom-out" text="缩小" />
      <ToolbarButton command="autoZoom" icon="fit-map" text="适应页面" />
      <ToolbarButton command="resetZoom" icon="actual-size" text="原始尺寸" />
      {/* <Divider type="vertical" />
      <ToolbarButton command="toBack" icon="to-back" text="To Back" />
      <ToolbarButton command="toFront" icon="to-front" text="To Front" /> */}
      <Divider type="vertical" />
      {/* <ToolbarButton command="multiSelect" icon="multi-select" text="Multi Select" />
      <ToolbarButton command="addGroup" icon="group" text="Add Group" />
      <ToolbarButton command="unGroup" icon="ungroup" text="Ungroup" /> */}
      {props.save && <div className="saveCommand" onClick={() => saveAction()}><Tooltip
        title="保存"
        placement="bottom"
        overlayClassName={styles.tooltip}
      ><SaveOutlined /></Tooltip></div>} {/* <IconFont type={`${props.save.cmp}`} /> */}
      {props.otherCmp}
    </Toolbar >
  );
};

export default withPropsAPI(FlowToolbar as any );

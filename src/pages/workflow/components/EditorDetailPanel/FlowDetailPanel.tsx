import React from 'react';
import { Card } from 'antd';
import { NodePanel, EdgePanel, GroupPanel, MultiPanel, CanvasPanel, DetailPanel, withPropsAPI } from 'gg-editor';
import DetailForm from './DetailForm';
import DefForm from './DefForm';
import styles from './index.less';

const FlowDetailPanel = () => {
  return (
    <DetailPanel className={styles.detailPanel} >
      <NodePanel>
        <DetailForm type="node" />
      </NodePanel>
      <EdgePanel>
        <DetailForm type="edge" />
      </EdgePanel>
      <GroupPanel>
        <DetailForm type="group" />
      </GroupPanel>
      <MultiPanel>
        <Card type="inner" size="small" title="Multi Select" />
      </MultiPanel>
      <CanvasPanel>
        <DefForm />
      </CanvasPanel>
    </DetailPanel>
  );
};

export default withPropsAPI(FlowDetailPanel as any)

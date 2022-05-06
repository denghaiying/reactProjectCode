import React from 'react';
import { Card } from 'antd';
import { Minimap } from 'gg-editor';

const EditorMinimap = () => (
  <Card title="缩略图">
    <Minimap height={200} />
  </Card>
);

export default EditorMinimap;

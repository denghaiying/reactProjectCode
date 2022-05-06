import React from 'react';

import './index.less';
import EmptyPng from './empty.png'

const EmptyData = props => {
  return (
    <div className="table-empty-block">
      <div className="result-image">
        <img alt="empty data" src={EmptyPng} />
      </div>
      <div className="result-title">
        没有数据
      </div>
    </div>
  );
}

export default EmptyData;

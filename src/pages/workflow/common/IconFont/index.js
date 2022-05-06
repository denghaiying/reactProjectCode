// import React, { Component } from 'react';
// import Icon from '@ant-design/icons';
// import './font_workflow.css';

// export default class IconFont extends Component {
//   render () {
//     const {
//       type,
//     } = this.props;
//     return <i className={`iconfont ${type}`} size={12} />;
//   }
// }

import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: require('./font_workflow.js'),
});

export default IconFont;

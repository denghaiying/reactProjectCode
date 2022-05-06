import React, { Component } from 'react';
import classNames from 'classnames';
import './index.scss';


export default class DialogPanel extends Component {
  static defaultProps = { dashed: false, type: 'horizontal' };

  render () {
    const { dashed = false, type = 'horizontal', className, orientation = 'center', children, ...restProps } = this.props;
    const orientationPrefix = orientation.length > 0 ? `-${orientation}` : orientation;
    const classstring = classNames(className, 'e9-divider', `e9-divider-${type}`, { [`e9-divider-with-text${orientationPrefix}`]: children, 'e9-divider-dashed': !!dashed });
    return (<div className={classstring} {...restProps}>{children && <span className="e9-divider-inner-text">{children}</span>}</div>);
  }
}

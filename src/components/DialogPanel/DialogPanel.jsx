import React, { Component } from 'react';
import { Dialog } from '@alifd/next';
import { injectIntl } from 'react-intl';

@injectIntl
export default class DialogPanel extends Component {
  render () {
    const { children, ...props } = this.props;
    return (<Dialog {...props} > {this.props.children}</Dialog >);
  }
}

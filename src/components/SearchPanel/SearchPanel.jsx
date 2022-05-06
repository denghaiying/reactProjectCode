import React, { Component } from 'react';
import { Icon } from '@alifd/next';
//import './index.scss';
import { useIntl, FormattedMessage } from 'umi'

export default class SearchPanel extends Component {

  // const intl =  useIntl();
  // const formatMessage=intl.formatMessage;
  

  render () {
    return (
      <div className="searchpanel">
        <div className="ice-panel-heading" style={{ lineHeight: '10px' }}>
          <Icon size="small" className="iconfont iconform_search" style={{ paddingRight: '20px' }} /><FormattedMessage id="e9.searchpanel.title" />
        </div>
        <div className="ice-panel-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}

/*
* 本组件的iframe实现高度自适应的前提是只能使用<html>标签
* */
import React, {Component} from 'react';
import './iframe.less'

export default class Iframe extends Component {
  static defaultProps = {
    id: '',
    url: '',
    width: '100%',
    height: '100%'
  }

  render() {
    return (
      <div className="iframe-element">
        <iframe id={this.props.id} ref="iframeRef" className="iframe-frame" width={this.props.width} height={this.props.height} src={ this.props.url }></iframe>
      </div>
    )
  }
}

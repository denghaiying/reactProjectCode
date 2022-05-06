import React from 'react';
import './index.less'
import { Icon } from '@alifd/next';

export default class collapse extends React.Component {
  constructor(props) {
    super(props)
    console.log(props.rightExpand)
  }
  expand(type) {
    this.props.getExpand(type)
  }
  render() {
    const likeList = [1, 2, 3, 4, 5, 6]

    return (
      <div className="collapse-right">
        {
          this.props.rightExpand ?
          <span className="arrow" onClick={this.expand.bind(this, false)}><Icon type="arrow-right" className="arrow-icon arrow-right"/></span> :
          <span className="arrow" onClick={this.expand.bind(this, true)}><Icon type="arrow-left" className="arrow-icon arrow-left"/></span>
        }
        <div className="like">
          <p className="title">猜你喜欢</p>
          {
            likeList.map(item => (
              <li className="item" key={item}>统一应用框架上线服务</li>
            ))
          }
        </div>
        <div className="hot">
          <p className="title">热点搜索</p>
          {
            likeList.map(item => (
              <li className="item" key={item}>
                {item === 1 ? <span className="hot-num first">1</span> : ''}
                {item === 2 ? <span className="hot-num second">2</span> : ''}
                {item === 3 ? <span className="hot-num third">3</span> : ''}
                统一应用框架上线服务
              </li>
            ))
          }
        </div>
      </div>
    )
  }
}

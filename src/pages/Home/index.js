import React from 'react';
import './index.less'
import { Calendar, Button, Input, Badge, Icon } from '@alifd/next'

export default class home extends React.Component {
  render() {
    const itemsList = [1,2,3,4,5,6,7,8]
    return (
      <div className="home-page">
        <div className="col1">
          <p className="title">
            <img src={require('../../styles/assets/img/icon_rili.png')} alt=""/><span>日历</span>
          </p>
          <div className="part">
            <div className="part-top">
              <div className="part-left"><img src={require('../../styles/assets/img/icon_todo.png')} alt=""/>待办</div>
              <span className="circle">8</span>
            </div>
            {
              itemsList.map(item => (
                <li key={item} className="item">
                  <p>关于财务费用报销试行条例关于财务费用报销试行条例</p>
                  <span>11月25日</span>
                </li>
              ))
            }
            <p className="bottom">{'<更多>'}</p>
          </div>
          <div className="part" style={{height: '340px'}}>
            <Calendar shape="card" className="calendar"/>
          </div>
        </div>
        <div className="col2">
          <p className="title">
            <img src={require('../../styles/assets/img/icon_photo.png')} alt=""/><span>照片墙</span>
          </p>
          <div className="part">
            <div className="part-top">
              <div className="part-left"><img src={require('../../styles/assets/img/icon_notice.png')} alt=""/>通知公告</div>
              <span className="circle">6</span>
            </div>
            {
              itemsList.map(item => (
                <li key={item} className="item">
                  <p>关于财务费用报销试行条例档案归档查看申请关于财务费用报销试行条例档案归档查看申请</p>
                  <span>11月25日</span>
                </li>
              ))
            }
            <p className="bottom">{'<更多>'}</p>
          </div>
          <div className="photo-part">
            <div className="left-img img-cell">
              <img src={require('../../styles/assets/img/photo-wall2.png')} alt=""/>
            </div>
            <div className="right-img">
              <div className="img-cell" style={{height: '48%'}}>
                <img src={require('../../styles/assets/img/photo-wall3.png')} alt=""/>
              </div>
              <div className="img-cell" style={{height: '48%'}}>
                <img src={require('../../styles/assets/img/photo-wall1.png')} alt=""/>
              </div>
            </div>
          </div>
        </div>
        <div className="col3">
          <p className="title">
            <img src={require('../../styles/assets/img/icon_search.png')} alt=""/><span>全文搜索</span>
            <span className="seperate">/</span>
            <img src={require('../../styles/assets/img/icon_download.png')} alt=""/><span>下载中心</span>
          </p>
          <div className="part search-part">
            <div className="search">
              <Input placeholder="请输入搜索内容" innerBefore={<Icon type="search" style={{marginLeft: 10, color: '#999', fontSize: 14}}/>} style={{width: '80%'}} />
              <Button type="primary">搜索</Button>
            </div>
          </div>
          <div className="part-cart part" style={{height: '340px'}}>
            <div className="circle">
              <Badge count={18} offset={[-5, 0]} className="badge">
                <img src={require('../../styles/assets/img/icon_cart.png')} style={{width: '26px'}} alt=""/>
              </Badge>
            </div>
            {
              itemsList.map(item => (
                <li key={item} className="item">
                  <p>关于财务费用报销试行条例档案归档查看申请关于财务费用报销试行条例档案归档查看申请</p>
                  <span>11月25日</span>
                </li>
              ))
            }
            <p className="bottom">{'<更多>'}</p>
          </div>
        </div>
      </div>
    )
  }
}
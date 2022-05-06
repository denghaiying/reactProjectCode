import React from 'react';
import './index.less'
import { Pagination } from '@alifd/next';

export default class videoTab extends React.Component {
  render() {
    const videoList = [1, 2, 3, 4, 5, 6]
    return (
      <div className="video-tab">
        {
          videoList.map(item => (
            <li className="item">
              <div className="video-left">
                <img src={import('../assets/img/video-bg-temp.png')} alt="" className="video-bg"/>
                <div className="video-time"><span className="iconfont icon-play"></span>01:30</div>
              </div>
              <div className="video-right">
                <p className="video-title">外媒评出中国十大最富<span style={{color: '#FF6860'}}>城市</span>，香港只排第六</p>
                <p className="brief">简介：外媒近日列出中国十大富<span style={{color: '#FF6860'}}>城市</span>的最新排名</p>
                <p className="date">来源：好看视频<span style={{marginLeft: 10}}>发布时间：10天前</span></p>
              </div>
            </li>
          ))
        }
        <Pagination shape="arrow-only" defaultCurrent={2} total={50} className="paginate"/>
      </div>
    )
  }
}
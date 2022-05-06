import React from 'react';
import './index.less'
import { Pagination } from '@alifd/next';

export default class picTab extends React.Component {
  render() {
    const picList = [{img: import('../assets/img/temp/temp_pic1.png')},
                     {img: import('../assets/img/temp/temp_pic2.png')},
                     {img: import('../assets/img/temp/temp_pic3.png')},
                     {img: import('../assets/img/temp/temp_pic4.png')},
                     {img: import('../assets/img/temp/temp_pic1.png')},
                     {img: import('../assets/img/temp/temp_pic3.png')},
                     {img: import('../assets/img/temp/temp_pic4.png')},
                     {img: import('../assets/img/temp/temp_pic2.png')},
                     {img: import('../assets/img/temp/temp_pic1.png')},
                     {img: import('../assets/img/temp/temp_pic2.png')},
                     {img: import('../assets/img/temp/temp_pic1.png')},
                     {img: import('../assets/img/temp/temp_pic3.png')},
                     {img: import('../assets/img/temp/temp_pic4.png')},
                     {img: import('../assets/img/temp/temp_pic2.png')},
                     {img: import('../assets/img/temp/temp_pic1.png')},
                     {img: import('../assets/img/temp/temp_pic4.png')},
                     {img: import('../assets/img/temp/temp_pic1.png')},
                     {img: import('../assets/img/temp/temp_pic3.png')},
                     {img: import('../assets/img/temp/temp_pic2.png')},
                     {img: import('../assets/img/temp/temp_pic4.png')},]
    return (
      <div className="pic-tab">
        {
          picList.map(item => (
            <div className="box">
              <div className="pic">
                <img src={item.img} alt=""></img>
                <div className="shadow">
                  <p className="shdow-text">城市建设展览馆</p>
                </div>
              </div>
            </div>
          ))
        }
        <Pagination shape="arrow-only" defaultCurrent={2} total={50} className="paginate"/>
      </div>
    )
  }
}

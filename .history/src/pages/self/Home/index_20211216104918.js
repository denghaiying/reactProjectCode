import React from 'react';
import { Carousel } from 'antd';
import dayjs from 'dayjs';
import { history } from 'umi';
import style from './index.less';
import Technology from '../components/technology';

import tianqi from '../assets/images/icon_tianqi.png';
import bendiyansge from '../assets/images/icon_bendiyansge.png';
import guancang from '../assets/images/icon_guancang.png';
import hanzhonglishi from '../assets/images/icon_hanzhonglishi.png';
import hanzhongrenwen from '../assets/images/icon_hanzhongrenwen.png';
import juguanjieshao from '../assets/images/icon_juguanjieshao.png';
import xianxingwenjian from '../assets/images/icon_xianxingwenjian.png';
import yijianxiang from '../assets/images/icon_yijianxiang.png';
import zhengcefagui from '../assets/images/icon_zhengcefagui.png';
import zhengmingdayin from '../assets/images/icon_zhengmingdayin.png';
import banner1 from '../assets/images/banner2.png';
import banner2 from '../assets/images/banner1.png';
import banner3 from '../assets/images/banner3.png';

class Home extends React.Component {
  state = {
    timer: null,
    time: '',
    week: '',
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.getTime();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getTime() {
    const date = new Date();
    const weekArr = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ];
    this.setState({
      time: dayjs(date).format('HH:mm:ss'),
      week: weekArr[date.getDay()],
    });
  }

  jump(type) {
    console.log(type);
    history.push('/list');
  }

  render() {
    const { time, week } = this.state;
    const info = (
      <>
        <div className={`${style['time']}`}>
          <span>{time}</span>
          <span>{week}</span>
        </div>
        <div className={`${style['weather']}`}>
          <img src={tianqi} />
          <div className={`${style['w-det']}`}>
            <span>多云</span>
            <span>12℃ - 7℃</span>
          </div>
        </div>
      </>
    );
    return (
      <div className={`${style['home-content']}`}>
        <Carousel autoplay>
          <div className={`${style['banner']}`}>
            <img src={banner1} />
            {info}
          </div>
          <div className={`${style['banner']}`}>
            <img src={banner2} />
            {info}
          </div>
          <div className={`${style['banner']}`}>
            <img src={banner3} />
            {info}
          </div>
        </Carousel>
        <div className={`${style['body']}`}>
          <div className={`${style['common']}`}>
            <div className={`${style['left']}`}>
              <div className={`${style['half-h']}`}>
                <div
                  className={`${style['common-s']} ${style['color-1']} ${style['mb-20']}`}
                >
                  <img src={guancang} />
                  <div className={`${style['words']}`}>
                    <div>馆藏展厅</div>
                    <div className={`${style['s-words']}`}>House rental</div>
                  </div>
                </div>
                <div className={`${style['common-s']} ${style['color-2']}`}>
                  <img src={zhengmingdayin} />
                  <div className={`${style['words']}`}>
                    <div>证明打印</div>
                    <div className={`${style['s-words']}`}>House rental</div>
                  </div>
                </div>
              </div>
              <div className={`${style['full-h']} ${style['color-3']}`}>
                <img src={juguanjieshao} />
                <div className={`${style['words']}`}>
                  <div>局馆介绍</div>
                  <div className={`${style['s-words']}`}>House rental</div>
                </div>
                <div
                  className={`${style['btns']} ${style['mt-46']}`}
                  onClick={this.jump.bind(this, 'yj')}
                >
                  点我查看
                </div>
              </div>
            </div>
            <div className={`${style['right']}`}>
              <div className={`${style['half-w']}`}>
                <div className={`${style['common-s']} ${style['color-4']}`}>
                  <img src={zhengcefagui} />
                  <div className={`${style['words']}`}>
                    <div>政策法规</div>
                    <div className={`${style['s-words']}`}>House rental</div>
                  </div>
                </div>
                <div className={`${style['common-s']} ${style['color-5']}`}>
                  <img src={bendiyansge} />
                  <div className={`${style['words']}`}>
                    <div>本地沿革</div>
                    <div className={`${style['s-words']}`}>House rental</div>
                  </div>
                </div>
              </div>
              <div
                className={`${style['full-w']} ${style['mt-20']} ${style['color-6']}`}
              >
                <img src={xianxingwenjian} />
                <div className={`${style['words']}`}>
                  <div>现行文件查询</div>
                  <div className={`${style['s-words']}`}>House rental</div>
                </div>
                <div
                  className={`${style['btns']}`}
                  onClick={this.jump.bind(this, 'xxwj')}
                >
                  点我查看
                </div>
              </div>
            </div>
          </div>
          <div className={`${style['common']} ${style['mt-20']}`}>
            <div className={`${style['left']}`}>
              <div className={`${style['full-w']} ${style['color-7']}`}>
                <img src={yijianxiang} />
                <div className={`${style['words']}`}>
                  <div>意见箱</div>
                  <div className={`${style['s-words']}`}>House rental</div>
                </div>
                <div
                  className={`${style['btns']}`}
                  onClick={this.jump.bind(this, 'yj')}
                >
                  点我查看
                </div>
              </div>
            </div>
            <div className={`${style['right']}`}>
              <div className={`${style['half-w']}`}>
                <div className={`${style['common-s']} ${style['color-8']}`}>
                  <img src={hanzhongrenwen} />
                  <div className={`${style['words']}`}>
                    <div>汉中人文</div>
                    <div className={`${style['s-words']}`}>House rental</div>
                  </div>
                </div>
                <div className={`${style['common-s']} ${style['color-9']}`}>
                  <img src={hanzhonglishi} />
                  <div className={`${style['words']}`}>
                    <div>汉中历史</div>
                    <div className={`${style['s-words']}`}>House rental</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Technology />
      </div>
    );
  }
}
export default Home;

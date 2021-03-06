import { useEffect, useState, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';
import fetch from '../../../utils/fetch';
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
import { runFunc } from '@/utils/menuUtils';

const Home = observer((props) => {
  const store = useLocalStore(() => ({
    timer: null,
    time: '',
    week: '',
    async queryDzylssy() {
      const response = await fetch.get(
        `/api/eps/control/main/dzylssy/queryForList?lx=1`,
      );
      if (response.status === 200) {
        var sjData = [];
        if (response.data?.length > 0) {
          for (var i = 0; i < response.data?.length; i++) {
            var ysj = response.data[i];
            let newKey = {};
            newKey.name = ysj.dakmc;
            if (ysj.tph === 'img01') {
              newKey.img = hunyindengji;
            }
            if (ysj.tph === 'img02') {
              newKey.img = dushengzinv;
            }
            if (ysj.tph === 'img03') {
              newKey.img = zhaogong;
            }
            if (ysj.tph === 'img04') {
              newKey.img = zhiqinghuihu;
            }
            if (ysj.tph === 'img05') {
              newKey.img = shanlin;
            }
            if (ysj.tph === 'img06') {
              newKey.img = zaishengyu;
            }
            if (ysj.tph === 'img07') {
              newKey.img = fangchan;
            }
            if (ysj.tph === 'img08') {
              newKey.img = tuiwujunren;
            }
            sjData.push(newKey);
          }
          this.dzylsData = sjData;
        }
      }
    },
  }));


  const componentDidMount=()=> {
    this.timer = setInterval(() => {
      this.getTime();
    }, 1000);
  }

  const componentWillUnmount=()=> {
    clearInterval(this.timer);
  }

  const getTime=()=> {
    const date = new Date();
    const weekArr = [
      '?????????',
      '?????????',
      '?????????',
      '?????????',
      '?????????',
      '?????????',
      '?????????',
    ];
    store.time=dayjs(date).format('HH:mm:ss');
    store.week=weekArr[date.getDay()];
  }


  useEffect(() => {
    store.queryDzylssy();
  }, []);

  const info = (
    <>
      <div className={`${style['time']}`}>
        <span>{store.time}</span>
        <span>{store.week}</span>
      </div>
      <div className={`${style['weather']}`}>
        <img src={tianqi} />
        <div className={`${style['w-det']}`}>
          <span>??????</span>
          <span>12??? - 7???</span>
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
            <a href="javascript:;" onClick={() => this.cgzs()}>
            <div
              className={`${style['common-s']} ${style['color-1']} ${style['mb-20']}`}
            >
              <img src={guancang} />
              <div className={`${style['words']}`}>
                <div>????????????</div>
                <div className={`${style['s-words']}`}>House rental</div>
              </div>
            </div>
            </a>
            <div className={`${style['common-s']} ${style['color-2']}`}>
              <img src={guancang} />
              <div className={`${style['words']}`}>
                <div>???????????????</div>
                <div className={`${style['s-words']}`}>House rental</div>
              </div>
            </div>
          </div>
          <div className={`${style['full-h']} ${style['color-3']}`}>
            <img src={juguanjieshao} />
            <div className={`${style['words']}`}>
              <div>????????????</div>
              <div className={`${style['s-words']}`}>House rental</div>
            </div>
            <div
              className={`${style['btns']} ${style['mt-46']}`}
              onClick={this.jump.bind(this, 'yj')}
            >
              ????????????
            </div>
          </div>
        </div>
        <div className={`${style['right']}`}>
          <div className={`${style['half-w']}`}>
          <a href="javascript:;" onClick={() => this.zcfg('????????????')}>
            <div className={`${style['common-s']} ${style['color-4']}`}>
              <img src={zhengcefagui} />
              <div className={`${style['words']}`}>
                <div>????????????</div>
                <div className={`${style['s-words']}`}>House rental</div>
              </div>
            </div>
            </a>
            <a href="javascript:;" onClick={() => this.zcfg('????????????')}>
            <div className={`${style['common-s']} ${style['color-5']}`}>
              <img src={bendiyansge} />
              <div className={`${style['words']}`}>
                <div>????????????</div>
                <div className={`${style['s-words']}`}>House rental</div>
              </div>
            </div>
            </a>
          </div>
          <a href="javascript:;" onClick={() => this.xxfj()}>
          <div className={`${style['full-w']} ${style['mt-20']} ${style['color-6']}`}>
            <img src={xianxingwenjian} />
            <div className={`${style['words']}`}>
              <div>??????????????????</div>
              <div className={`${style['s-words']}`}>House rental</div>
            </div>
          </div>
          </a>
        </div>
      </div>
      <div className={`${style['common']} ${style['mt-20']}`}>
        <div className={`${style['left']}`}>
          <div className={`${style['full-w']} ${style['color-7']}`}>
            <img src={yijianxiang} />
            <div className={`${style['words']}`}>
              <div>?????????</div>
              <div className={`${style['s-words']}`}>House rental</div>
            </div>
            <div
              className={`${style['btns']}`}
              onClick={this.jump.bind(this, 'yj')}
            >
              ????????????
            </div>
          </div>
        </div>
        <div className={`${style['right']}`}>
          <div className={`${style['half-w']}`}>
            <div className={`${style['common-s']} ${style['color-8']}`}>
              <img src={hanzhongrenwen} />
              <div className={`${style['words']}`}>
                <div>????????????</div>
                <div className={`${style['s-words']}`}>House rental</div>
              </div>
            </div>
            <div className={`${style['common-s']} ${style['color-9']}`}>
              <img src={hanzhonglishi} />
              <div className={`${style['words']}`}>
                <div>????????????</div>
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
});
export default Home;

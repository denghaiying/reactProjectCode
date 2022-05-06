import React, { useEffect, useState } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';

import fetch from '@/utils/fetch';
import { Carousel } from 'antd';

const ArchivesIntro = observer((props) => {
  const store = useLocalStore(() => ({
    keyparams: '',
    sjdata: [],
    daylsyData: [],
    contentOne: {},
    contentTwo: {},
    contentThree: {},
    contentFour: {},

    async queryContent1() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhintro`,
      );
      debugger;
      if (response.status === 200) {
        this.contentOne = response.data[0];
      }
    },

    async queryContent2() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhhistory`,
      );

      if (response.status === 200) {
        this.contentTwo = response.data[0];
      }
    },

    async queryContent3() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhsource`,
      );

      if (response.status === 200) {
        this.contentThree = response.data[0];
      }
    },

    async queryContent4() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhfwzz`,
      );

      if (response.status === 200) {
        this.contentFour = response.data[0];
      }
    },
  }));

  const [activeTab, setActiveTab] = useState(1);

  const [channelType, setChannelType] = useState('');

  // const state = {
  //   activeTab: 1,
  // }

  useEffect(() => {
    //setChannelType("wxgzhintro");
    store.queryContent1();
    store.queryContent2();
    store.queryContent3();
    store.queryContent4();
  }, []);

  const tabsList = [
    { text: '信息简介', value: 1 },
    { text: '发展历史', value: 2 },
    { text: '馆藏资源信息', value: 3 },
    { text: '服务宗旨', value: 4 },
  ];

  return (
    <div className="archieve">
      <Carousel autoplay className="carousel">
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
      </Carousel>
      <div className="tabs">
        {tabsList.map((item) => (
          <div
            key={item.value}
            className={activeTab === item.value ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(item.value)}
          >
            {item.text}
          </div>
        ))}
      </div>
      <div className="gap"></div>
      <div className="tab-content">
        {
          activeTab === 1 ? (
            // <p className="text">
            //   {/*案馆是收集、保管档案的机构。负责的接收、征集、管理档案和开展档案利用等。中国周代的天府，汉代的石渠阁，唐代的甲库，宋元的架阁库，明清的皇史宬等，*/}
            //   {/*都是历代保管档案的机构。建国后，从中央到地方都成立了档案馆。*/}
            //   {store.contentOne.contentDesc}
            // </p> : ''
            <p
              className="text"
              dangerouslySetInnerHTML={{ __html: store.contentOne.contentDesc }}
            ></p>
          ) : (
            ''
          )
          // <p dangerouslySetInnerHTML = {{ __html: store.contentOne.contentDes }}>
          //
          // </p>: ''
        }
        {
          activeTab === 2 ? (
            <p
              className="text"
              dangerouslySetInnerHTML={{ __html: store.contentTwo.contentDesc }}
            ></p>
          ) : (
            ''
          )
          // <Timeline>
          //   <Timeline.Item>
          //     <p className="time-item">
          //       <span>档案馆正式创办</span><span>2001年01月</span>
          //     </p>
          //   </Timeline.Item>
          //   <Timeline.Item>
          //     <p className="time-item">
          //       <span>档案馆重新修建</span><span>2008年01月</span>
          //     </p>
          //   </Timeline.Item>
          //   <Timeline.Item>
          //     <p className="time-item">
          //       <span>档案馆正式创办</span><span>2001年01月</span>
          //     </p>
          //   </Timeline.Item>
          //   <Timeline.Item>
          //     <p className="time-item">
          //       <span>档案馆重新修建</span><span>2008年01月</span>
          //     </p>
          //   </Timeline.Item>
          // </Timeline> : ''
        }
        {activeTab === 3 ? (
          // <p className="text">
          //   馆藏资源信息，案馆是收集、保管档案的机构。负责的接收、征集、管理档案和开展档案利用等。中国周代的天府，汉代的石渠阁，唐代的甲库，宋元的架阁库，明清的皇史宬等，
          //   都是历代保管档案的机构。建国后，从中央到地方都成立了档案馆。
          // </p> : ''
          <p
            className="text"
            dangerouslySetInnerHTML={{ __html: store.contentThree.contentDesc }}
          ></p>
        ) : (
          ''
        )}
        {
          activeTab === 4 ? (
            <p
              className="text"
              dangerouslySetInnerHTML={{
                __html: store.contentFour.contentDesc,
              }}
            ></p>
          ) : (
            ''
          )
          // <p className="text">
          //   服务宗旨，馆藏资源信息，案馆是收集、保管档案的机构。负责的接收、征集、管理档案和开展档案利用等。中国周代的天府，汉代的石渠阁，唐代的甲库，宋元的架阁库，明清的皇史宬等，
          //   都是历代保管档案的机构。建国后，从中央到地方都成立了档案馆。
          // </p> : ''
        }
      </div>
    </div>
  );
});
export default ArchivesIntro;

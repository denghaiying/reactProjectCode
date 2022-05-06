import React, { useEffect, useState } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';
import Card1 from '../components/Card1';
import ProjectPanelList from '../components/ProjectPanelList';

import fetch from '@/utils/fetch';
import moment from 'moment';

const ProjectDisplay = observer((props) => {
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const store = useLocalStore(() => ({
    list: [],

    async queryContent1() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhzt`,
      );
      debugger;
      if (response.status === 200) {
        this.list = response.data;
      }
    },
  }));

  useEffect(() => {
    store.queryContent1();
  }, []);

  return (
    <div className="project-display">
      <Card1
        title="专题展览"
        intro="方便快捷"
        background="linear-gradient(-90deg, #D64F52, #F2C769)"
      ></Card1>
      <ProjectPanelList list={store.list}></ProjectPanelList>
      {/*{*/}
      {/*  num.map((item, index) => (*/}
      {/*    <div key={index} className="display-item">*/}
      {/*      <div className="title">新年档案馆的参观</div>*/}
      {/*      <img src={require('../../assets/img/carousel-img.png')} alt=""></img>*/}
      {/*      <div className="text">为了避免高峰期人流大、时间过长等事情的发生，商务部分门张开张工作会议</div>*/}
      {/*      <div className="bottom">*/}
      {/*        <span style={{marginRight: 30}}>张三</span>*/}
      {/*        <span>2022-02-22</span>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  ))*/}
      {/*}*/}
    </div>
  );
});
export default ProjectDisplay;

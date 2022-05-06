import React, { useEffect, useState } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';
import Card1 from '../components/Card1'
import PanelList from '../components/PanelList'


import fetch from '@/utils/fetch';
import moment from "moment";

const Notice = observer((props) => {

  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const store = useLocalStore(() => ({

    list:[],


    async queryContent1() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhzytz`,
      );
      debugger
      if (response.status === 200) {

        this.list =response.data;

      }
    },

  }));



  useEffect(() => {
    store.queryContent1();
  }, []);


  return (
    <div className="notice-page">
      <p className="time">{getDate}</p>
      <Card1 title="重要通知" intro="通知通告" background="linear-gradient(-90deg, #E81B3D, #ED944B)"></Card1>
      <PanelList list={store.list}></PanelList>
    </div>
  );
});
export default Notice;

import React, { useEffect, useState } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';
import Card1 from '../components/Card1'
import PanelList from '../components/PanelList'


import fetch from '@/utils/fetch';

const ArchivesMessage = observer((props) => {



  const store = useLocalStore(() => ({

    content:[],


    async queryContent1() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhdazx`,
      );
      debugger
      if (response.status === 200) {

        this.content =response.data;

      }
    },

  }));



  useEffect(() => {
    store.queryContent1();
  }, []);





  return (
    <div className="archives-message">
      <Card1 title="档案资讯" intro="资讯内容" background="linear-gradient(-90deg, #5081EE, #9069F2)"></Card1>
      <PanelList list={store.content}></PanelList>
    </div>
  );
});
export default ArchivesMessage;

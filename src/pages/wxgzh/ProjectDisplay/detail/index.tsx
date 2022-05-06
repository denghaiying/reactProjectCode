import React, { useEffect, useState } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';

import fetch from '@/utils/fetch';


const ProjectDisplayDetail = observer((props) => {
  console.log('messagedetailprpos===', props);

  const store = useLocalStore(() => ({
    content: {},

    async queryContent1() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/findById?id=` + props.location.state.id,
      );
      debugger;
      if (response.status === 200) {
        this.content = response.data;
      }
    },
  }));

  useEffect(() => {
    //setChannelType("wxgzhintro");
    store.queryContent1();
  }, []);

  return (
    <div className="message-detail">
      <div className="title-section">
        <p dangerouslySetInnerHTML={{ __html: store.content.title }}></p>
        <div className="bot-title">
          {/*<span>{store.content.author}</span>*/}
          {/*<span style={{color: '#3B74A0'}}>{store.content.channelName}</span>*/}
          <span>{store.content.whsj}</span>
          {/* <span>18:07</span> */}
        </div>
      </div>
      <div className="message-content">
        <div
          style={{ color: '#666', lineHeight: '22px', textIndent: 28 }}
          dangerouslySetInnerHTML={{ __html: store.content.contentDesc }}
        ></div>
      </div>
    </div>
  );
});
export default ProjectDisplayDetail;

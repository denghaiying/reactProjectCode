import React, { useEffect, useState } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';


import fetch from '@/utils/fetch';
import {Carousel} from "antd";

const MessageDetail = observer((props) => {

console.log("messagedetailprpos===",props)

  const store = useLocalStore(() => ({

    content:{},

    async queryContent1() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/findById?id=`+props.location.state.id,
      );
      debugger
      if (response.status === 200) {

        this.content =response.data;

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
            <p dangerouslySetInnerHTML = {{ __html: store.content.title }}>
            </p>
            <div className="bot-title">
          <span>{store.content.author}</span>
          <span style={{color: '#3B74A0'}}>{store.content.channelName}</span>
          <span>{store.content.whsj}</span>
          {/* <span>18:07</span> */}
        </div>
      </div>
      <div className="message-content">
        <div style={{color: '#666', lineHeight: '22px', textIndent: 28}}
        dangerouslySetInnerHTML={{__html: store.content.contentDesc}}>
          {/* 端午节，又称端阳节、龙舟节、重午节、天中节等，是集
          拜神祭祖、祈福辟邪、欢庆娱乐和饮食为一体的民俗大节。
          端午节源于自然天象崇拜，由上古时代祭龙演变而来。仲夏
          端午，苍龙七宿飞升于正南中央，处在全年最“中正”之位，
          正如《易经·乾卦》第五爻：“飞龙在天”。端午是“飞龙在天”
          吉祥日，龙及龙舟文化始终贯穿在端午节的传承历史中。 */}
        </div>
        {/* <img src={require('../../assets/img/carousel-img.png')} alt="" style={{width: '100%', margin: '15px 0'}}></img> */}
        {/* <div className="btns">
          <span style={{color: '#3B74A0', marginRight: 15}}>收藏</span>
          <span style={{flex: 2}}>阅读108</span>
          <img src={require('../../assets/img/icon_warning.png')} alt=""></img>举报
        </div> */}
      </div>
    </div>
  );
});
export default MessageDetail;

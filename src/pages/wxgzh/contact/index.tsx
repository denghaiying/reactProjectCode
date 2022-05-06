import React, { useEffect, useState } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';


import fetch from '@/utils/fetch';
import {Carousel} from "antd";

const Contact = observer((props) => {

  console.log("messagedetailprpos===",props)

  const store = useLocalStore(() => ({

    content:{},
    contentThree:{},

    async queryContent1() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryContact`,
      );

      if (response.status === 200) {

        this.content =response.data;

      }
    },

    async queryContent3() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhlxwm`,
      );

      if (response.status === 200) {

        this.contentThree =response.data[0];

      }
    },
  }));



  useEffect(() => {
    //setChannelType("wxgzhintro");
    store.queryContent3();

  }, []);



  return (
    <div className="contact-page">
      <p className="top-p">联系我们</p>
      <div className="time">
        <span style={{color: '#3B74A0', marginRight: 12}}>{store.content.dwmc}</span>
        <span>2022-01-02  18:07</span>
      </div>
      <div className="contact-content">
        <div className="title-row">
          <div className="line"></div>
          <span className="title">联系我们</span>
          <div className="line"></div>
        </div>
        <div className="contact-list">
          {/*<p>电话：{store.content.phone}</p>*/}
          {/*<p>地址：{store.content.address}</p>*/}
          {/*<p>网址：{store.content.waladdress}</p>*/}
          {/*<p>邮政编码：{store.content.postcode}</p>*/}
          {/*<p>电子邮箱：{store.content.email}</p>*/}
          <p  className="text" dangerouslySetInnerHTML={{__html: store.contentThree.contentDesc}}></p>:''

        </div>
      </div>
    </div>
  );
});
export default Contact;

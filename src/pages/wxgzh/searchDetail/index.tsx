import React, { useEffect, useState } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';

import fetch from '@/utils/fetch';
import { Card } from 'antd';

const SearchDetail = observer((props) => {
  const store = useLocalStore(() => ({
    content: {},
    fj: [],

    async queryContent() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/findById?id=` + props.location.state.id,
      );
      debugger;
      if (response.status === 200) {
        this.content = response.data;
      }
    },

    async queryFj() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryFj?id=` + props.location.state.id,
      );
      debugger;
      if (response.status === 200) {
        this.fj = response.data;
      }
    },
  }));

  useEffect(() => {
    //setChannelType("wxgzhintro");
    store.queryContent();
    store.queryFj();
  }, []);

  /**
   * 下载
   * @param val
   */
  const onDownClick = async (currentItem) => {
    // if (currentItem.length == 0) {
    //   message.error('操作失败,请至少选择一行数据');
    // } else {
    var ulr =
      '/api/eps/portal/wxcontent/downloadfj?id=' + store.content.id+'&fileid='+currentItem.fileid
    window.open(ulr);
    //  }
  };

  return (
    <div className="message-detail">
      <div className="title-section">
        <p dangerouslySetInnerHTML={{ __html: store.content.title }}></p>
        <div className="bot-title">
          <span>{store.content.author}</span>
          <span style={{ color: '#3B74A0' }}>{store.content.channelName}</span>
          <span>{store.content.whsj}</span>
          {/* <span>18:07</span> */}
        </div>
      </div>
      <div className="message-content">
        <div
          style={{ color: '#666', lineHeight: '22px', textIndent: 28 }}
          dangerouslySetInnerHTML={{ __html: store.content.contentDesc }}
        ></div>
        <br />
        <br />
        <div>附件 </div>
        <Card>
          <ul>
          {store.fj.map((it) => (

            <li> <a
              key="down"
              onClick={(key) => onDownClick(it)}>
            {it.filename}
            </a></li>

          ))}
          {/*<p>Card content</p>*/}
          {/*<p>Card content</p>*/}
          {/*<p>Card content</p>*/}
          </ul>
        </Card>
        ,
        {/* <div className="btns">
          <span style={{color: '#3B74A0', marginRight: 15}}>收藏</span>
          <span style={{flex: 2}}>阅读108</span>
          <img src={require('../../assets/img/icon_warning.png')} alt=""></img>举报
        </div> */}
      </div>
    </div>
  );
});
export default SearchDetail;

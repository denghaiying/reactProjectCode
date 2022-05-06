import React, { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';


import fetch from '@/utils/fetch';
import { RightOutlined } from '@ant-design/icons';
const Rule = observer((props) => {

  console.log("gudiprops====",props)

  const store = useLocalStore(() => ({
    keyparams: '',
    sjdata: [],
    daylsyData: [],

    content:{},



    async queryContent3() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhgzzd`,
      );

      if (response.status === 200) {

        this.content =response.data[0];

      }
    },


  }));



  let { path } = props.match
  const type = path === '/runRfunc/archivesguide' ? 'guide' : 'notice'




  useEffect(() => {
    //setChannelType("wxgzhintro");

    store.queryContent3();

  }, []);


  return (
    <div className="archives-rule">
      <div className="title-section">
        <p>规章制度管理规定</p>
        <div className="bot-title">
          <span>{store.content.author}</span>
          <span> {store.content.title }</span>
          <span>{store.content.whsj}</span>
        </div>
      </div>
      <div className="rule-content">
        <div
          // style={{color: '#666', lineHeight: '22px', textIndent: 28}}
             dangerouslySetInnerHTML={{__html: store.content.contentDesc}}>
        </div>
        {/*<p style={{marginBottom: 20, color: '#000'}}>为了避免请假流程重复、时间过长等事情的发生，针对此问题，即日实施以下管理机制</p>*/}
        {/*<div className="row">*/}
        {/*  <span>{'1)'}</span>*/}
        {/*  <span>请假1天以及以内:不需要填写请假申请表</span>*/}
        {/*</div>*/}
        {/*<div className="row">*/}
        {/*  <span>{'2)'}</span>*/}
        {/*  <span>找本班班主任/导师批准即可</span>*/}
        {/*</div>*/}
        {/*<div className="row">*/}
        {/*  <span>{'3)'}</span>*/}
        {/*  <span>只能请病假和非常严重的事假</span>*/}
        {/*</div>*/}
        {/*<div className="row">*/}
        {/*  <span>{'4)'}</span>*/}
        {/*  <span>只接受申请表请假,邮件、电话、微信、QQ等请假均 不接受</span>*/}
        {/*</div>*/}
      </div>
    </div>
  );
});
export default Rule;

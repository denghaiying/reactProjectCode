import  { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './indexGuid.less';


import fetch from '@/utils/fetch';
import { RightOutlined } from '@ant-design/icons';
import {Link} from "react-router-dom";
const ArchivesGuide = observer((props) => {

console.log("gudiprops====",props)

  const store = useLocalStore(() => ({
    keyparams: '',
    sjdata: [],
    daylsyData: [],
    contentOne:{},
    contentTwo:{},
    contentThree:{},
    contentFour:{},
    contentFive:{},
    contentSix:{},

    async queryContent1() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhcdzn`,
      );
      debugger
      if (response.status === 200) {

        this.contentOne =response.data[0];

      }
    },

    async queryContent2() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhcdznsqrzg`,
      );

      if (response.status === 200) {

        this.contentTwo =response.data[0];

      }
    },

    async queryContent3() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhcdzncdfw`,
      );

      if (response.status === 200) {

        this.contentThree =response.data[0];

      }
    },

    async queryContent4() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhcdznqlyw`,
      );

      if (response.status === 200) {

        this.contentFour =response.data[0];

      }
    },

    async queryContent5() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhcdzncdlc`,
      );

      if (response.status === 200) {

        this.contentFive =response.data[0];

      }
    },

    // async queryContent6() {
    //   const response = await fetch.get(
    //     `/api/eps/portal/content/queryBychannelType?channeltype=wxgzhqlyw`,
    //   );
    //
    //   if (response.status === 200) {
    //
    //     this.contentSix =response.data[0];
    //
    //   }
    // },

  }));



  let { path } = props.match
  const type = path === '/runRfunc/archivesguide' ? 'guide' : 'notice'




  useEffect(() => {
    //setChannelType("wxgzhintro");
    store.queryContent1();
    store.queryContent2();
    store.queryContent3();
    store.queryContent4();
    store.queryContent5();
  }, []);


  return (
      <div className={ type === 'guide' ? 'archives-guide' : 'archives-guide archives-notice'}>
        <div className="card">
          <div className="card-content">
            <div className="title-row">
              <div className="line"></div>
              <span className="title">{type === 'guide' ? '查档指南' : '查档须知'}</span>
              <div className="line"></div>
            </div>
            <p  className="text" dangerouslySetInnerHTML={{__html: store.contentOne.contentDesc}}></p>
            {/*<p className="text">*/}
            {/*  北京冬奥会开幕次日，国家主席习近平和夫人彭丽媛举行宴会，欢迎出席冬奥会开幕式的国际贵宾。在宴会开始前，记者用镜头记录下了这样的珍贵瞬间。*/}
            {/*</p>*/}
          </div>
        </div>
        <div className="menu-group">
          <li className="menu-item">
            <Link key="sqrzg" className="panel-item"
                  to={
                    {
                      pathname:`/runRfunc/messagedetail`,
                      state:{id:store.contentTwo.id}
                    }
                  }
            >
            <img src={require('../assets/img/icon_person.png')} alt=""></img>
            <span className="menu-text">申请人资格</span>
            <RightOutlined className="icon" />
            {/*<div dangerouslySetInnerHTML={{__html: store.contentTwo.contentDesc}}></div>*/}

              {/*<div className="left">*/}
              {/*  <div className="title">{store.contentTwo.title}</div>*/}
              {/*  { store.contentTwo.whsj ? <div className="time">{store.contentTwo.whsj}</div> : '' }*/}
              {/*</div>*/}
            </Link>
          </li>
          <li className="menu-item">
            <Link key="sqrzg" className="panel-item"
                  to={
                    {
                      pathname:`/runRfunc/messagedetail`,
                      state:{id:store.contentThree.id}
                    }
                  }
            >
            <img src={require('../assets/img/icon_area.png')} alt=""></img>
            <span className="menu-text">查档范围</span>
            <RightOutlined className="icon" />

              {/*<div className="left">*/}
              {/*  <div className="title">{store.contentThree.title}</div>*/}
              {/*  { store.contentThree.whsj ? <div className="time">{store.contentThree.whsj}</div> : '' }*/}
              {/*</div>*/}
            </Link>
          </li>
          {
            type === 'guide' ? '' :
              <li className="menu-item">
                <Link key="sqrzg" className="panel-item"
                      to={
                        {
                          pathname:`/runRfunc/messagedetail`,
                          state:{id:store.contentFive.id}
                        }
                      }
                >
                <img src={require('../assets/img/icon_process.png')} alt=""></img>
                <span className="menu-text">查档流程</span>
                <RightOutlined className="icon" />
                {/*<div dangerouslySetInnerHTML={{__html: store.contentFive.contentDesc}}></div>*/}

                  {/*<div className="left">*/}
                  {/*  <div className="title">{store.contentFive.title}</div>*/}
                  {/*  { store.contentFive.whsj ? <div className="time">{store.contentFive.whsj}</div> : '' }*/}
                  {/*</div>*/}
                </Link>
              </li>
          }
          <li className="menu-item">
            <Link key="sqrzg" className="panel-item"
                  to={
                    {
                      pathname:`/runRfunc/messagedetail`,
                      state:{id:store.contentFour.id}
                    }
                  }
            >
            <img src={require('../assets/img/icon_response.png')} alt=""></img>
            <span className="menu-text">权利义务</span>
            <RightOutlined className="icon" />
            {/*<div dangerouslySetInnerHTML={{__html: store.contentFour.contentDesc}}></div>*/}
            </Link>
          </li>
        </div>
      </div>
  );
});
export default ArchivesGuide;

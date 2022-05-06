
import React, { useEffect } from 'react';
import './index.less'
import { Calendar, Select, Radio, Input, Button } from 'antd';
import { Slider ,TreeSelect} from '@alifd/next'
import { SearchOutlined } from '@ant-design/icons';
const { Option } = Select;
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import { observer } from 'mobx-react';
import E9Config from '../../../utils/e9config';
import RgjhomeStore from "../../../stores/dashboard/RgjhomeStore";
import fetch from '../../../utils/fetch';
import { useIntl } from 'umi';
import calendarbg from './assets/img/icon_calendar_bg.png';
import notice from './assets/img/icon_notice.png';
import bianyan from './assets/img/icon_bianyan.png';
import search from './assets/img/icon_search.png';
import todo from './assets/img/icon_todo.png';
import photo from './assets/img/icon_photo.png';
import downCenter from './assets/img/icon_down_center.png';
import tongji from './assets/img/icon_tongji.png';
import viewNum from './assets/img/icon_viewNum.png';
import { useModel, history } from 'umi';
import { runFunc } from '@/utils/menuUtils';


const newRgjhome = observer(props => {
  const { xzpkList} = props;
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  const { channelsList, radioValue, dataSource,findAllsz, dwData, dakDataSource, dbpage, dbList, tzggList, dabyList, xzzList, zpkList, tzggpage, dabypage, zpkPage, xzzxPage, morecilke, fwtjcount, zsl, jrsl, zrsl, pjsl, datjcount, ajsl, jsl, wjsize, dbsize, tzgglist, dabylist, xzzxlist, dabysize, xzzxsize, tzggbsize, bsw, ajsw } = RgjhomeStore;

//   fetch.post('/eps/portalui/portalui/queryForChanelName?page=1&start=0&limit=6&bh=tpda').then((result) => {
//
//               xzpkList=result.data.results;

//             })
  useEffect(() => {
    channelsList();
    findAllsz();
    dbpage();
    tzggpage();
    zpkPage();
    dabypage();
    xzzxPage();
    fwtjcount();
    datjcount();
    tzgglist();
    dabylist();
    xzzxlist();

  }, []);


  const handledwChange=(value,a) =>{
    RgjhomeStore.dwChange(value,a);
  }


  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    kshflStore.setPageNo(current);
  });



  const openym =  ((current) => {
    RgjhomeStore.morecilke(current);
  });

  const getChannelIdByName =  ((name,id) => {
    RgjhomeStore.opencilke(name,id)
  });

  const dakChange=(value) =>{
    RgjhomeStore.setdakids(value);
  }

  const radioValueChange=(e) =>{
    RgjhomeStore.setradioValue(e.target.value);
  }

  const onkeyChange=(e) =>{
    RgjhomeStore.setkeyvalue(e.target.value);
  }

  const doSearch=() =>{

    RgjhomeStore.doSearch();
  }

  const opencgll=() =>{
    RgjhomeStore.opencgll();
  }

  const opendb=() =>{
   // RgjhomeStore.opendb();
    const params = {
      umid:  'WORKFLOW0002',
      umname: '待办事务',
      path:'/runRfunc/dbsw'
    };
    runFunc(params);
  }

  const handleSw=(record) =>{
    const params = {
      umid:  record.umid,
      umname: record.wfname,
      wfinst:record.wfinst,
      path:`/runRfunc/${record.gnurl}`
    };
    runFunc(params);
  //  history.push({ pathname: `/runRfunc/${record.gnurl}`, query: { umname: record.wfname, wfinst:record.wfinst } });
  }



  // end **************

  return (
      <div className="home-page">
        <div className="left">
          <div className="part part1">
            <div className="head">
              <span className="head-left">
                <img src={calendarbg} className="icon-label" alt="" style={{marginRight: 10}}/><span>日历</span>
              </span>
            </div>
            <Calendar fullscreen={false} />
          </div>
          <div className="part part2">
            <div className="head">
              <span className="head-left">
                <img src={notice} className="icon-label" alt="" style={{marginRight: 10}}/><span> 通知公告 </span>
              </span>
              <span className="num">{tzggbsize}</span>

            </div>
            <div className="inner">
               {
                tzggList && tzggList.map(item => (
                    <li key={item.contentId} className="p_item">
                      <a href="javascript:;" onClick={() => getChannelIdByName("tzgg",item.content.id)}>{item.content.title}</a>
                      <span>{moment(item.content.whsj).format('YYYY-MM-DD')}</span>
                    </li>
                ))
              }
              <p className="bottom" onClick={() => openym("tzgg")}>{'<更多>'}</p>
            </div>
          </div>
          <div className="part part3">
            <div className="head">
              <span className="head-left">
                <img src={bianyan} className="icon-label" alt="" style={{marginRight: 10}}/><span>档案编研</span>
              </span>
                 <span className="num">{dabysize}</span>

            </div>
            <div className="inner">
              {
                dabyList && dabyList.map(item => (
                    <li key={item.contentId} className="p_item">
                      <a href="javascript:;" onClick={() => getChannelIdByName("byfb",item.content.id)}>{item.content.title}</a>
                      <span>{moment(item.content.whsj).format('YYYY-MM-DD')}</span>
                    </li>
                ))
              }
              <p className="bottom" onClick={() => openym("byfb")}>{'<更多>'}</p>
            </div>
          </div>
        </div>
        <div className="center">
          <div className="part part4">
            <div className="head">
              <span className="head-left">
                <img src={search} className="icon-label" alt="" style={{marginRight: 10}}/><span>档案检索</span>
              </span>
              <span className="right-link" onClick={opencgll}>馆藏浏览</span>
            </div>
            <div className="inner-row">

              <div className="row" style={{marginBottom: 50,marginTop: 30}}>
                <Input prefix={<SearchOutlined style={{ margin: '4px 10px', fontSize: 16, color: '#999' }}/>} placeholder="请输入搜索内容" style={{width: '82%'}} onChange={onkeyChange}></Input>
                <Button type="primary" style={{marginLeft: 20, width: 70}} onClick={doSearch}>搜索</Button>
              </div>
               <div className="row">
                <span className='label'>单位</span>
                <Select placeholder="请选择单位"  allowClear  onChange={handledwChange} style={{width: '11vw', marginRight: '1vw'}}>
                  {
                    dwData && dwData.map(dw => (
                        <Option value={dw.value}>{dw.label}</Option>
                    ))
                  }
                </Select>
                <span className='label'>档案库</span>
                <TreeSelect   treeCheckable   treeCheckedStrategy="child" dataSource={dakDataSource} mode="multiple" style={{width: '11vw'}} tagInline onChange={dakChange}></TreeSelect>
                <Radio.Group onChange={radioValueChange} style={{marginLeft: '3vw'}} value={radioValue}>
                  <Radio value="1">全文检索</Radio>
                  <Radio value="2">目录检索</Radio>

                </Radio.Group>
              </div>
            </div>
          </div>
          <div className="part part5">
            <div className="head">
              <span className="head-left">
                <img src={import('./assets/img/icon_todo.png')} alt="" style={{marginRight: 10}}/><span>待办事项</span>
              </span>
             <span className="num">{dbsize}</span>
            </div>
            <div className="inner">

              {
                dbList && dbList.map(item => (
                    <li key={item.wfinst} className="p_item">
                      <a href="javascript:;"  onClick={() => handleSw(item)}>{item.title ? item.title.substring(0, 15):item.title}</a>
                      <span>{moment(item.pbegin).format('YYYY-MM-DD')}</span>
                    </li>
                ))
              }
              <p className="bottom" onClick={() => opendb()}>{'<更多>'}</p>
            </div>
          </div>
          <div className="part part6">
            <div className="head">
              <span className="head-left">
                <img src={import('./assets/img/icon_photo.png')} alt="" style={{marginRight: 10}}/><span>档案动态</span>
              </span>
              <span className="right-link" onClick={() => openym("tpda")}>{'<更多>'}</span>
            </div>
            <div className="carousel">
              <Slider slidesToShow={3} dots={false} autoplay autoplaySpeed={2000} arrows={false}>
                {

                  zpkList && zpkList.map(item => (
                      <li className="slide" key={item.contentId}>
                        <div className="item">
                          { item.docs[0] !==undefined ?
                              <div className="inner"  onClick={() => getChannelIdByName("tpda",item.content.id)}><img src={'data:image/png;base64,'+item.docs[0].thumb}/></div>
                              :
                              <div className="inner"  onClick={() => getChannelIdByName("tpda",item.content.id)}><img src={import('../../../styles/assets/img/icon_photo.png')}/></div>
                          }
                         <p className="shadow">{item.title}</p>
                        </div>
                      </li>
                  ))
                }
              </Slider>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="part part2">
            <div className="head">
              <span className="head-left">
                <img src={import('./assets/img/icon_down_center.png')} alt="" style={{marginRight: 10}}/><span>下载中心</span>
              </span>
              <span className="num">{xzzxsize}</span>
            </div>
            <div className="inner">
              {
                xzzList && xzzList.map(item => (
                    <li key={item.contentId} className="p_item">
                      <a href="javascript:;" onClick={() => getChannelIdByName("flgf",item.content.id)}>{item.content.title}</a>
                      <span>{moment(item.content.whsj).format('YYYY-MM-DD')}</span>
                    </li>
                ))
              }
              <p className="bottom"  onClick={() => openym("flgf")}>{'<更多>'}</p>
            </div>
          </div>
          <div className="part part8">
            <div className="head">
              <span className="head-left">
                <img src={import('./assets/img/icon_tongji.png')} alt="" style={{marginRight: 10}}/><span>馆藏统计</span>
              </span>
            </div>
            <div className="count-content">
              <li className="count-bg">
                <p className="desc-name">卷数</p>
                <div className="inner-center">
                  <p className="num-p">{ajsl}</p>
                  {ajsw > 0 ? <p>（万卷）</p> : <p>（卷）</p>}
                </div>
              </li>
              <li className="count-bg">
                <p className="desc-name">件数</p>
                <div className="inner-center">
                  <p className="num-p">{jsl}</p>
                  {bsw > 0 ? <p>（万件）</p> : <p>（件）</p>}
                </div>
              </li>
              <li className="count-bg">
                <p className="desc-name">电子档案</p>
                <div className="inner-center">
                  <p className="num-p">{wjsize}</p>
                  <p>（TB）</p>
                </div>
              </li>
            </div>
          </div>
          <div className="part part9">
            <div className="head">
              <span className="head-left">
                <img src={import('./assets/img/icon_viewNum.png')} alt="" style={{marginRight: 10}}/><span>访问量</span>
              </span>
            </div>
            <div className="content">
              <div className="grid">
                <li className="cell">
                  <p className="num">{jrsl}</p>
                  <p className="num-text">今日</p>
                </li>
                <li className="cell">
                  <p className="num">{pjsl}</p>
                  <p className="num-text">日均</p>
                </li>
                <li className="cell">
                  <p className="num">{zrsl}</p>
                  <p className="num-text">昨日</p>
                </li>
                <li className="cell">
                  <p className="num">{zsl}</p>
                  <p className="num-text">累计</p>
                </li>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
});
export default newRgjhome;



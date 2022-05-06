import React, { useEffect } from 'react';
import './index.less';
import { Select, Input, Button, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const { Option } = Select;
import moment from 'moment';
import { observer } from 'mobx-react';
import SwhyhomeStore from '../../../stores/dashboard/SwhyhomeStore';
import { useIntl } from 'umi';
import calendarbg from './assets/img/icon_calendar_bg.png';
import notice from './assets/img/icon_notice.png';
import bianyan from './assets/img/icon_bianyan.png';
import search from './assets/img/icon_search.png';
import todo from './assets/img/icon_todo.png';
import photo from './assets/img/icon_photo.png';
import downCenter from './assets/img/icon_down_center.png';
import tongji from './assets/img/icon_tongji.png';
import viewNum from './assets/img/icon_viewNum.png';
import { useModel, history } from 'umi';
import { runFunc } from '@/utils/menuUtils';

const SwhyHome = observer((props) => {
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const {
    channelsList,
    radioValue,
    dataSource,
    findAllsz,
    dwData,
    dakDataSource,
    dbpage,
    dbList,
    tzggList,
    dazxList,
    xzzList,
    tzggpage,
    dazxpage,
    morecilke,
    fwtjcount,
    zsl,
    jrsl,
    zrsl,
    pjsl,
    datjcount,
    ajsl,
    jsl,
    wjsize,
    dbsize,
    tzgglist,
    dazxlist,
    dazxsize,
    tzggbsize,
    bsw,
    ajsw,
    findgpc,
    findrcjl,
    daglzdlist,
    daglzdsize,
    daglzdList,
    daglzdPage,
    flfglist,
    flfgsize,
    flfgList,
    flfgpage,
  } = SwhyhomeStore;

  //   fetch.post('/eps/portalui/portalui/queryForChanelName?page=1&start=0&limit=6&bh=tpda').then((result) => {
  //
  //               xzpkList=result.data.results;

  //             })
  useEffect(() => {
    daglzdlist();
    daglzdPage();
    flfglist();
    flfgpage();

    channelsList();
    dbpage();
    tzggpage();
    dazxpage();
    fwtjcount();
    datjcount();
    tzgglist();
    dazxlist();
    findgpc();
    findrcjl();
  }, []);

  const handledwChange = (value, a) => {
    SwhyhomeStore.dwChange(value, a);
  };

  const gpcOnchange = (record, values) => {
    const gpcData = [];
    for (var i = 0; i < values.length; i++) {
      gpcData.push(values[i].label);
    }
    SwhyhomeStore.setkeyvalue(gpcData.toString().replaceAll(',', ' '));
  };

  const buttonclick = (record) => {
    SwhyhomeStore.setkeyvalue(record.target.innerText.replaceAll(' ', ''));
    SwhyhomeStore.doSearch();
  };

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = (current) => {
    kshflStore.setPageNo(current);
  };

  const openym = (current) => {
    SwhyhomeStore.morecilke(current);
  };

  const getChannelIdByName = (name, id) => {
    SwhyhomeStore.opencilke(name, id);
  };

  const dakChange = (value) => {
    SwhyhomeStore.setdakids(value);
  };

  const radioValueChange = (e) => {
    SwhyhomeStore.setradioValue(e.target.value);
  };

  const onkeyChange = (e) => {
    SwhyhomeStore.setkeyvalue(e.target.value);
  };

  const doSearch = () => {
    SwhyhomeStore.doSearch();
  };

  const opencgll = () => {
    SwhyhomeStore.opencgll();
  };

  const opendb = () => {
    // SwhyhomeStore.opendb();
    const params = {
      umid: 'WORKFLOW0002',
      umname: '待办事务',
      path: '/runRfunc/dbsw',
    };
    runFunc(params);
  };

  const handleSw = (record) => {
    const params = {
      umid: record.umid,
      umname: record.wfname,
      wfinst: record.wfinst,
      path: `/runRfunc/${record.gnurl}/${record.wfinst}`,
    };
    runFunc(params);
    //  history.push({ pathname: `/runRfunc/${record.gnurl}`, query: { umname: record.wfname, wfinst:record.wfinst } });
  };

  // end **************

  return (
    <div className="home-page">
      <div className="left">
        <div className="part part1">
          <div className="head">
            <span className="head-left">
              <img
                src={calendarbg}
                className="icon-label"
                alt=""
                style={{ marginRight: 10 }}
              />
              <span>法律法规</span>
            </span>
            <span className="num">{flfgsize}</span>
          </div>
          <div className="inner">
            {flfgList &&
              flfgList.map((item) => (
                <li key={item.contentId} className="p_item">
                  <a
                    href="javascript:"
                    onClick={() => getChannelIdByName('flfg', item.content.id)}
                  >
                    {item.content.title}
                  </a>
                  <span>{moment(item.content.whsj).format('YYYY-MM-DD')}</span>
                </li>
              ))}
            <p className="bottom" onClick={() => openym('flfg')}>
              {'<更多>'}
            </p>
          </div>
        </div>
        <div className="part part2">
          <div className="head">
            <span className="head-left">
              <img
                src={notice}
                className="icon-label"
                alt=""
                style={{ marginRight: 10 }}
              />
              <span>通知公告</span>
            </span>
            <span className="num">{tzggbsize}</span>
          </div>
          <div className="inner">
            {tzggList &&
              tzggList.map((item) => (
                <li key={item.contentId} className="p_item">
                  <a
                    href="javascript:"
                    onClick={() => getChannelIdByName('tzgg', item.content.id)}
                  >
                    {item.content.title}
                  </a>
                  <span>{moment(item.content.whsj).format('YYYY-MM-DD')}</span>
                </li>
              ))}
            <p className="bottom" onClick={() => openym('tzgg')}>
              {'<更多>'}
            </p>
          </div>
        </div>
        <div className="part part3">
          <div className="head">
            <span className="head-left">
              <img
                src={bianyan}
                className="icon-label"
                alt=""
                style={{ marginRight: 10 }}
              />
              <span>档案资讯</span>
            </span>
            <span className="num">{dazxsize}</span>
          </div>
          <div className="inner">
            {dazxList &&
              dazxList.map((item) => (
                <li key={item.contentId} className="p_item">
                  <a
                    href="javascript:"
                    onClick={() => getChannelIdByName('dazx', item.content.id)}
                  >
                    {item.content.title}
                  </a>
                  <span>{moment(item.content.whsj).format('YYYY-MM-DD')}</span>
                </li>
              ))}
            <p className="bottom" onClick={() => openym('dazx')}>
              {'<更多>'}
            </p>
          </div>
        </div>
      </div>
      <div className="center">
        <div className="part part4">
          <div className="head">
            <span className="head-left">
              <img
                src={search}
                className="icon-label"
                alt=""
                style={{ marginRight: 10 }}
              />
              <span>档案搜索</span>
            </span>
          </div>
          <div className="inner-row" style={{ marginTop: '30px' }}>
            <Card style={{ marginTop: '0px' }} bordered={false}>
              <div
                className="row"
                style={{ marginBottom: '10px', marginTop: '0px' }}
              >
                <Input
                  value={SwhyhomeStore.keyparams}
                  prefix={
                    <SearchOutlined
                      style={{
                        margin: '4px 10px',
                        fontSize: 16,
                        color: '#999',
                      }}
                    />
                  }
                  placeholder="请输入搜索内容"
                  style={{ width: '82%', height: '35px' }}
                  onChange={onkeyChange}
                ></Input>
                <Button
                  type="primary"
                  style={{ marginLeft: 20, width: 70, height: '35Px' }}
                  onClick={doSearch}
                >
                  搜索
                </Button>
              </div>
            </Card>
            <Card
              title="高频借阅档案："
              style={{ marginTop: '0px' }}
              bordered={false}
            >
              <div
                className="row"
                style={{ marginBottom: '10px', marginTop: '0px' }}
              >
                <span className="label">高频借阅词汇</span>
                <Select
                  showArrow
                  filterOption={(input, option) => {
                    return (
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    );
                  }}
                  placeholder="请选择高频词汇"
                  allowClear
                  style={{ width: '80%', marginLeft: '20px', height: '35px' }}
                  options={SwhyhomeStore.gpcData}
                  mode="multiple"
                  onChange={gpcOnchange}
                />
              </div>
            </Card>
            <Card
              style={{ marginTop: '0px' }}
              title="检索热词排行榜："
              bordered={false}
            >
              <div
                className="row1"
                style={{
                  marginBottom: '0px',
                  marginTop: '0px',
                  marginLeft: '-50px',
                }}
              >
                {SwhyhomeStore.rcglData1.map((f) => (
                  <Button
                    style={{
                      marginLeft: '40px',
                      height: '35px',
                      marginTop: '0px',
                    }}
                    onClick={buttonclick}
                    type="link"
                  >
                    {f.ms}
                  </Button>
                ))}
              </div>
              <div
                className="row1"
                style={{
                  marginBottom: '0px',
                  marginTop: '0px',
                  marginLeft: '-50px',
                }}
              >
                {SwhyhomeStore.rcglData2.map((f) => (
                  <Button
                    style={{
                      marginLeft: '40px',
                      height: '35px',
                      marginTop: '0px',
                    }}
                    onClick={buttonclick}
                    type="link"
                  >
                    {f.ms}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>
        <div className="part part5">
          <div className="head">
            <span className="head-left">
              <img src={todo} alt="" style={{ marginRight: 10 }} />
              <span>待办事项</span>
            </span>
            <span className="num">{dbsize}</span>
          </div>
          <div className="inner">
            {dbList &&
              dbList.map((item) => (
                <li key={item.wfinst} className="p_item">
                  <a href="javascript:" onClick={() => handleSw(item)}>
                    {item.title ? item.title.substring(0, 15) : item.title}
                  </a>
                  <span>{moment(item.pbegin).format('YYYY-MM-DD')}</span>
                </li>
              ))}
            <p className="bottom" onClick={() => opendb()}>
              {'<更多>'}
            </p>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="part part2">
          <div className="head">
            <span className="head-left">
              <img src={bianyan} alt="" style={{ marginRight: 10 }} />
              <span>档案制度</span>
            </span>
            <span className="num">{daglzdsize}</span>
          </div>
          <div className="inner">
            {daglzdList &&
              daglzdList.map((item) => (
                <li key={item.contentId} className="p_item">
                  <a
                    href="javascript:"
                    onClick={() =>
                      getChannelIdByName('daglzd', item.content.id)
                    }
                  >
                    {item.content.title}
                  </a>
                  <span>{moment(item.content.whsj).format('YYYY-MM-DD')}</span>
                </li>
              ))}
            <p className="bottom" onClick={() => openym('daglzd')}>
              {'<更多>'}
            </p>
          </div>
        </div>
        {/* <div className="part part8">
          <div className="head">
            <span className="head-left">
              <img src={tongji} alt="" style={{ marginRight: 10 }} />
              <span>资源统计</span>
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
        </div> */}

<div className="part part8">
          <div className="head">
            <span className="head-left">
            <img src={tongji} className="icon-label" alt="" style={{marginRight: 10}}/><span>馆藏统计</span>
            </span>
          </div>
          <div className="count-content">
            <li className="count-bg">
              <p className="desc-name">卷数:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
              {/* 卷数:{ajsl}（卷） */}
              <div className="inner-center">
                <p className="num-paa">{ajsl}</p>
                <p className='text-spana'>（卷）</p>
                {/* <span className='text-span'>
                {ajsw > 0 ? <p>（万卷）</p> : <p>（卷）</p>}
                </span> */}
                
              </div>
            </li>
            <li className="count-bg">
              <p className="desc-name">件数:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
              {/* 件数: <p  >{jsl}</p>（件） */}
              <div className="inner-center">
                <p className="num-paa">{jsl}</p>
                <p className='text-spana'>（件）</p>
                {/* <p className='text-span'>
                  {bsw > 0 ? <p>（万件）</p> : <p>（件）</p>}
                </p> */}
                
              </div>
            </li>
            <li className="count-bg">
              <p className="desc-name">电子档案:</p>
              {/* 电子档案:{wjsize}（TB） */}
              <div className="inner-center">
                <p className="num-paa">{wjsize}</p>
                <p className='text-spana'>（GB）</p>
              </div>
            </li>
          </div>
        </div>
        <div className="part part9">
          <div className="head">
            <span className="head-left">
              <img src={viewNum} alt="" style={{ marginRight: 10 }} />
              <span>访问量</span>
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
  );
});
export default SwhyHome;

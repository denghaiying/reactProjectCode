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
   * ????????????????????????
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
      umname: '????????????',
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
              <span>????????????</span>
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
              {'<??????>'}
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
              <span>????????????</span>
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
              {'<??????>'}
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
              <span>????????????</span>
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
              {'<??????>'}
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
              <span>????????????</span>
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
                  placeholder="?????????????????????"
                  style={{ width: '82%', height: '35px' }}
                  onChange={onkeyChange}
                ></Input>
                <Button
                  type="primary"
                  style={{ marginLeft: 20, width: 70, height: '35Px' }}
                  onClick={doSearch}
                >
                  ??????
                </Button>
              </div>
            </Card>
            <Card
              title="?????????????????????"
              style={{ marginTop: '0px' }}
              bordered={false}
            >
              <div
                className="row"
                style={{ marginBottom: '10px', marginTop: '0px' }}
              >
                <span className="label">??????????????????</span>
                <Select
                  showArrow
                  filterOption={(input, option) => {
                    return (
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    );
                  }}
                  placeholder="?????????????????????"
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
              title="????????????????????????"
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
              <span>????????????</span>
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
              {'<??????>'}
            </p>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="part part2">
          <div className="head">
            <span className="head-left">
              <img src={bianyan} alt="" style={{ marginRight: 10 }} />
              <span>????????????</span>
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
              {'<??????>'}
            </p>
          </div>
        </div>
        {/* <div className="part part8">
          <div className="head">
            <span className="head-left">
              <img src={tongji} alt="" style={{ marginRight: 10 }} />
              <span>????????????</span>
            </span>
          </div>
          <div className="count-content">
            <li className="count-bg">
              <p className="desc-name">??????</p>
              <div className="inner-center">
                <p className="num-p">{ajsl}</p>
                {ajsw > 0 ? <p>????????????</p> : <p>?????????</p>}
              </div>
            </li>
            <li className="count-bg">
              <p className="desc-name">??????</p>
              <div className="inner-center">
                <p className="num-p">{jsl}</p>
                {bsw > 0 ? <p>????????????</p> : <p>?????????</p>}
              </div>
            </li>
            <li className="count-bg">
              <p className="desc-name">????????????</p>
              <div className="inner-center">
                <p className="num-p">{wjsize}</p>
                <p>???TB???</p>
              </div>
            </li>
          </div>
        </div> */}

<div className="part part8">
          <div className="head">
            <span className="head-left">
            <img??src={tongji}??className="icon-label"??alt="" style={{marginRight: 10}}/><span>????????????</span>
            </span>
          </div>
          <div className="count-content">
            <li className="count-bg">
              <p className="desc-name">??????:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
              {/* ??????:{ajsl}????????? */}
              <div className="inner-center">
                <p className="num-paa">{ajsl}</p>
                <p className='text-spana'>?????????</p>
                {/* <span className='text-span'>
                {ajsw > 0 ? <p>????????????</p> : <p>?????????</p>}
                </span> */}
                
              </div>
            </li>
            <li className="count-bg">
              <p className="desc-name">??????:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
              {/* ??????: <p  >{jsl}</p>????????? */}
              <div className="inner-center">
                <p className="num-paa">{jsl}</p>
                <p className='text-spana'>?????????</p>
                {/* <p className='text-span'>
                  {bsw > 0 ? <p>????????????</p> : <p>?????????</p>}
                </p> */}
                
              </div>
            </li>
            <li className="count-bg">
              <p className="desc-name">????????????:</p>
              {/* ????????????:{wjsize}???TB??? */}
              <div className="inner-center">
                <p className="num-paa">{wjsize}</p>
                <p className='text-spana'>???GB???</p>
              </div>
            </li>
          </div>
        </div>
        <div className="part part9">
          <div className="head">
            <span className="head-left">
              <img src={viewNum} alt="" style={{ marginRight: 10 }} />
              <span>?????????</span>
            </span>
          </div>
          <div className="content">
            <div className="grid">
              <li className="cell">
                <p className="num">{jrsl}</p>
                <p className="num-text">??????</p>
              </li>
              <li className="cell">
                <p className="num">{pjsl}</p>
                <p className="num-text">??????</p>
              </li>
              <li className="cell">
                <p className="num">{zrsl}</p>
                <p className="num-text">??????</p>
              </li>
              <li className="cell">
                <p className="num">{zsl}</p>
                <p className="num-text">??????</p>
              </li>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
export default SwhyHome;

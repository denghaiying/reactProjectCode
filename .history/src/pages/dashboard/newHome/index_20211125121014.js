import React, { useEffect } from 'react';
import './index.less';
import {
  Calendar,
  Button,
  Input,
  Icon,
  Select,
  Radio,
  Slider,
  TreeSelect,
} from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
const RadioGroup = Radio.Group;
import E9Config from '../../../utils/e9config';
import RgjhomeStore from '../../../stores/dashboard/RgjhomeStore';
import fetch from '../../../utils/fetch';
import search from '../../../styles/assets/img/icon_search.png';
import todo from '../../../styles/assets/img/icon_todo.png';
import notice from '../../../styles/assets/img/icon_notice.png';
import bianyan from '../../../styles/assets/img/icon_bianyan.png';
import photo from '../../../styles/assets/img/icon_photo.png';
import rili from '../../../styles/assets/img/icon_rili.png';
import downCenter from '../../../styles/assets/img/icon_down_center.png';
import tongji from '../../../styles/assets/img/icon_tongji.png';
import viewcount from '../../../styles/assets/img/icon_view_count.png';

import { useIntl } from 'umi';

//var xzpkList=[];
const Rgjhome = observer((props) => {
  const { xzpkList } = props;
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
    dabyList,
    xzzList,
    zpkList,
    tzggpage,
    dabypage,
    zpkPage,
    xzzxPage,
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
  } = RgjhomeStore;

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
  }, []);

  const handledwChange = (value, a, item) => {
    RgjhomeStore.dwChange(value, item);
  };

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = (current) => {
    kshflStore.setPageNo(current);
  };

  const openym = (current) => {
    RgjhomeStore.morecilke(current);
  };

  const getChannelIdByName = (name, id) => {
    RgjhomeStore.opencilke(name, id);
  };

  const dakChange = (value) => {
    RgjhomeStore.setdakids(value);
  };

  const radioValueChange = (value) => {
    RgjhomeStore.setradioValue(value);
  };

  const onkeyChange = (value) => {
    RgjhomeStore.setkeyvalue(value);
  };

  const doSearch = () => {
    RgjhomeStore.doSearch();
  };

  const opencgll = () => {
    RgjhomeStore.opencgll();
  };

  const opendb = () => {
    RgjhomeStore.opendb();
  };

  const dodetailDbs = (umid, wfid, wfinst, wfname, gnurl) => {
    RgjhomeStore.dodetailDbs(umid, wfid, wfinst, wfname, gnurl);
  };

  // end **************

  return (
    <div className="home-page">
      <div className="left">
        <div className="part1 part">
          <p className="title">
            <span className="title-left">
              <img src={search} className="icon-label" alt="" />
              <span>档案检索</span>
            </span>
            <span className="right-text" onClick={opencgll}>
              馆藏浏览
            </span>
          </p>
          <div className="row">
            <span className="label">单位</span>
            <Select
              placeholder="请选择单位"
              hasClear
              dataSource={dwData}
              style={{ width: 230 }}
              onChange={handledwChange}
            ></Select>
            <span className="label">档案库</span>
            <TreeSelect
              treeCheckable
              treeCheckedStrategy="child"
              dataSource={dakDataSource}
              mode="multiple"
              style={{ width: 230 }}
              tagInline
              onChange={dakChange}
            ></TreeSelect>
            <RadioGroup
              value={radioValue}
              aria-labelledby="groupId"
              style={{ marginLeft: 40 }}
              onChange={radioValueChange}
            >
              <Radio id="1" value="1">
                全文检索
              </Radio>
              <Radio id="2" value="2">
                目录检索
              </Radio>
            </RadioGroup>
          </div>
          <div className="row" style={{ marginBottom: 10 }}>
            <Input
              innerBefore={
                <Icon type="search" size="xs" style={{ margin: '4px 10px' }} />
              }
              placeholder="请输入搜索内容"
              style={{ marginLeft: 20, width: '80%' }}
              onChange={onkeyChange}
            ></Input>
            <Button
              type="primary"
              style={{ marginLeft: 20, width: 70 }}
              onClick={doSearch}
            >
              搜索
            </Button>
          </div>
        </div>
        <div className="center">
          <div className="part2 part">
            <p className="title">
              <span className="title-left">
                {' '}
                <img src={todo} className="icon-label" alt="" />
                <span>待办事项</span>
              </span>
              <span className="num">{dbList ? dbList.length : 0}</span>
            </p>
            {dbList &&
              dbList.map((item) => (
                <li key={item.id} className="p_item">
                  <p
                    onClick={() =>
                      dodetailDbs(
                        item.umid,
                        item.wfid,
                        item.wfinst,
                        item.wfname,
                        item.gnurl,
                      )
                    }
                  >
                    {item.title ? item.title.substring(0, 15) : item.title}
                  </p>
                  <span>{moment(item.pbegin).format('YYYY-MM-DD')}</span>
                </li>
              ))}
            <p className="bottom" onClick={() => opendb()}>
              {dbList && dbList.length >= 5 ? '更多' : ''}{' '}
            </p>
          </div>
          <div className="part2 part">
            <p className="title">
              <span className="title-left">
                <img src={notice} className="icon-label" alt="" />
                <span>通知公告</span>
              </span>
              <span className="num">{tzggList ? tzggList.length : 0}</span>
            </p>
            {tzggList &&
              tzggList.map((item) => (
                <li key={item.id} className="p_item">
                  <a
                    href="javascript:;"
                    onClick={() => getChannelIdByName('tzgg', item.content.id)}
                  >
                    {item.content.title}
                  </a>
                  <span>{moment(item.content.whsj).format('YYYY-MM-DD')}</span>
                </li>
              ))}
            <p className="bottom" onClick={() => openym('tzgg')}>
              {tzggList && tzggList.length >= 5 ? '更多' : ''}
            </p>
          </div>
          <div className="part2 part">
            <p className="title">
              <span className="title-left">
                {' '}
                <img src={bianyan} className="icon-label" alt="" />
                <span>档案编研</span>
              </span>
              <span className="num">{dabyList ? dabyList.length : 0}</span>
            </p>
            {dabyList &&
              dabyList.map((item) => (
                <li key={item.id} className="p_item">
                  <a
                    href="javascript:;"
                    onClick={() => getChannelIdByName('byfb', item.content.id)}
                  >
                    {item.content.title}
                  </a>
                  <span>{moment(item.content.whsj).format('YYYY-MM-DD')}</span>
                </li>
              ))}
            <p className="bottom" onClick={() => openym('byfb')}>
              {'<更多>'}
            </p>
          </div>
        </div>
        <div className="part part3" style={{ marginBottom: 0, height: 310 }}>
          <p className="title">
            <span className="title-left">
              <img src={photo} className="icon-label" alt="" />
              <span>照片墙</span>
            </span>
            <span
              className="bottom"
              style={{ fontWeight: 'normal' }}
              onClick={() => openym('tpda')}
            >
              {'<更多>'}
            </span>
          </p>
          <div className="carousel">
            <Slider
              slidesToShow={4}
              dots={false}
              autoplay={true}
              autoplaySpeed={2000}
              arrows={false}
            >
              {zpkList &&
                zpkList.map((item, index) => (
                  <li className="slide" key={index}>
                    <div className="item">
                      {item.docs[0] != undefined ? (
                        <div
                          className="inner"
                          onClick={() =>
                            getChannelIdByName('tpda', item.content.id)
                          }
                        >
                          <img
                            src={'data:image/png;base64,' + item.docs[0].thumb}
                          />
                        </div>
                      ) : (
                        <div
                          className="inner"
                          onClick={() =>
                            getChannelIdByName('tpda', item.content.id)
                          }
                        >
                          <img src={photo} className="icon-label" />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
            </Slider>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="part part4">
          <p className="title" style={{ marginBottom: 0 }}>
            <span className="title-left">
              <img src={rili} className="icon-label" alt="" />
              <span>日历</span>
            </span>
            <span></span>
          </p>
          <Calendar shape="card" className="calendar" style={{ height: 210 }} />
        </div>
        <div className="part part4">
          <p className="title" style={{ marginBottom: 7 }}>
            <span className="title-left">
              <img src={downCenter} className="icon-label" alt="" />
              <span>下载中心</span>
            </span>
            <span></span>
          </p>
          {xzzList &&
            xzzList.map((item) => (
              <li key={item.id} className="p_item">
                <a
                  href="javascript:;"
                  onClick={() => getChannelIdByName('flgf', item.content.id)}
                >
                  {item.content.title}
                </a>
                <span>{moment(item.content.whsj).format('YYYY-MM-DD')}</span>
              </li>
            ))}
          <p className="bottom" onClick={() => openym('flgf')}>
            {'<更多>'}
          </p>
        </div>
        <div className="part part5">
          <p className="title">
            <span className="title-left">
              <img src={tongji} className="icon-label" alt="" />
              <span>馆藏统计</span>
            </span>
            <span></span>
          </p>
          <div className="count-content">
            <li className="count-bg">
              <span className="text">卷数</span>
              <span className="count">{ajsl}</span>
            </li>
            <li className="count-bg">
              <span className="text">件数</span>
              <span className="count">{jsl}</span>
            </li>
            <li className="count-bg">
              <span className="text">存量</span>
              <span className="count">{wjsize}</span>
            </li>
          </div>
        </div>
        <div className="part part6" style={{ marginBottom: 0 }}>
          <p className="title">
            <span className="title-left">
              {' '}
              <img src={viewcount} className="icon-label" alt="" />
              <span>访问量</span>
            </span>
            <span></span>
          </p>
          <div className="view-content">
            <li className="item">
              <span style={{ color: '#5AA9FF' }}>{jrsl}</span>
              <span>今日</span>
            </li>
            <li className="item">
              <span style={{ color: '#B7A3FB' }}>{zrsl}</span>
              <span>昨日</span>
            </li>
            <li className="item">
              <span style={{ color: '#54E3B5' }}>{pjsl}</span>
              <span>平均</span>
            </li>
            <li className="item">
              <span style={{ color: '#FF736C' }}>{zsl}</span>
              <span>累计</span>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
});
export default Rgjhome;

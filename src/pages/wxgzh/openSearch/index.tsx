import React, { useEffect, useState } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';
import Card1 from '../components/Card1';
import PanelList from '../components/PanelList';
import { Button, Col, Form, Input, message, Radio, Row, Select } from 'antd';

import fetch from '@/utils/fetch';
import moment from 'moment';
import PanelListNoDate from '@/pages/wxgzh/components/PanelListNoDate';
const { Search } = Input;

const OpenSearch = observer((props) => {
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const [radioValue, setRadioValue] = useState('');

  const store = useLocalStore(() => ({
    lxlist: [],
    list: [],

    async queryLx() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/channel/queryForList?type=wxgzhkfda`,
      );
      debugger;
      if (response.status === 200) {
        this.lxlist = response.data.map((o) => ({
          label: o.name,
          value: o.id,
        }));
      }
    },

    // async query(param) {
    //   let url=`/api/eps/portal/content/queryBychannelType?channeltype=wxgzhkfda`;
    //   if(param && param !=''){
    //     url=`/api/eps/portal/content/queryBychannelType?channeltype=wxgzhkfda&channelid=`+param
    //   }
    //   const response = await fetch.get(url );
    //   debugger
    //   if (response.status === 200) {
    //
    //     this.list =response.data;
    //
    //   }
    // },

    async query(param) {
      debugger;

      const radio = param['channelid'];
      const search = param['searchs'];

      let url = `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhkfda`;
      if (radio && radio != '') {
        url =
          `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhkfda&channelid=` +
          radio;
        if (search && search != '') {
          url =
            `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhkfda&channelid=` +
            radio +
            `&search=` +
            search;
        }
      } else {
        if (search && search != '') {
          url =
            `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhkfda&search=` +
            search;
        }
      }

      const response = await fetch.get(url);
      debugger;
      if (response.status === 200) {
        this.list = response.data;
      }
    },
  }));

  useEffect(() => {
    store.query({});
    store.queryLx();
  }, []);

  const onClickRadio = (values: any) => {
    setRadioValue(values);
    const param = { channelid: values };
    store.query(param);
  };

  const onTableSearch = (tableSearchValue) => {
    debugger;
    let param = { searchs: tableSearchValue };
    if (radioValue && radioValue != '') {
      param = { channelid: radioValue, searchs: tableSearchValue };
    }
    store.query(param);
  };

  return (
    <div className="open-search">
      <Card1
        title="开放档案搜索"
        intro="方便快捷"
        background="linear-gradient(-90deg, #5081EE, #9069F2)"
      ></Card1>
      <div className="bot-content">
        <div className="c-input">
          {/*<input placeholder="请输入搜索内容..."></input>*/}
          {/*<span className="search-btn">搜索</span>*/}
          <Search
            placeholder="请输入搜索内容"
            allowClear
            enterButton="搜索"
            // style={{ width: calc(100% - 170px);, marginRight: 10 }}
            onSearch={(val) => onTableSearch(val)}
          />
        </div>
        <Radio.Group
          options={store.lxlist}
          value={radioValue}
          onChange={(e) => onClickRadio(e.target.value)}
          className="radios"
        ></Radio.Group>

        {/* <Radio.Button options={store.lxlist} value={radioValue}
                      onClick={() => { setRadioValue(e.target.value); store.query(store.key, 1, store.size, { channelid: e.target.value,channeltype:"wxgzhkfda" }) }}></Radio.Button> */}

        <PanelListNoDate list={store.list}></PanelListNoDate>
      </div>
    </div>
  );
});
export default OpenSearch;

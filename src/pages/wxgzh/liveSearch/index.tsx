import React, { useEffect, useState } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';
import { Button, Col, Form, Input, message, Row, Select } from 'antd';
import Card1 from '../components/Card1';
const { Option } = Select;
const { Search } = Input;

import fetch from '@/utils/fetch';
import moment from 'moment';
import PanelListNoDate from "@/pages/wxgzh/components/PanelListNoDate";

const LiveSearch = observer((props) => {
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const [radioValue, setRadioValue] = useState('');

  const store = useLocalStore(() => ({
    lxlist: [],
    list: [],

    async queryLx() {
      const response = await fetch.get(
        `/api/eps/portal/wxcontent/channel/queryForList?type=wxgzhmsda`,
      );
      debugger;
      if (response.status === 200) {
        //  this.lxlist =response.data;
        this.lxlist = response.data.map((o) => ({
          id: o.id,
          label: o.name,
          value: o.id,
        }));
      }
    },

    async query(param) {
      debugger;
      const radio = param['channelid'];
      const search = param['searchs'];

      let url = `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhmsda`;
      if (radio && radio != '') {
        url =
          `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhmsda&channelid=` +
          radio;
        if (search && search != '') {
          url =
            `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhmsda&channelid=` +
            radio +
            `&search=` +
            search;
        }
      } else {
        if (search && search != '') {
          url =
            `/api/eps/portal/wxcontent/queryBychannelType?channeltype=wxgzhmsda&search=` +
            search;
        }
      }

      //  const url=`/api/eps/portal/content/queryBychannelType?channeltype=wxgzhmsda&channelid=`+radio+`&search=`+search
      const response = await fetch.get(url);

      //  const param = { params: { moduleId: value } };
      //  const response = await fetch.get('/api/eps/portal/content/queryBychannelType?channeltype=wxgzhmsda', { params: param });
      debugger;
      if (response.status === 200) {
        this.list = response.data;
      }
    },
  }));

  // const [form] = Form.useForm();

  useEffect(() => {
    store.queryLx();
    store.query({});
  }, []);

  const onClickRadio = (values: any) => {
    setRadioValue(values);
    const param = { channelid: values };
    store.query(param);
  };

  const onTableSearch = (tableSearchValue) => {
    debugger;
    //   const code = props.tableProp?.searchCode || 'key';
    //  const params: Record<string, unknown> = tableStore.params;
    //  params[code] = tableSearchValue;
    let param = { searchs: tableSearchValue };
    if (radioValue && radioValue != '') {
      param = { channelid: radioValue, searchs: tableSearchValue };
    }
    store.query(param);
  };

  return (
    <div className="live-search">
      <Card1
        title="民生档案搜索"
        intro="方便快捷"
        background="linear-gradient(-90deg, #D64F52, #F2C769)"
      ></Card1>
      <div className="bot-content">
        <div className="c-input">
          <Select options={store.lxlist} onChange={onClickRadio}></Select>
          {/*<input placeholder="请输入搜索内容..." id="search" name="search"></input>*/}
          {/*<span className="search-btn" onClick={onClickRadio}>搜索</span>*/}
          <Search
            placeholder="请输入搜索内容"
            allowClear
            enterButton="搜索"
            // style={{ width: calc(100% - 170px);, marginRight: 10 }}
            onSearch={(val) => onTableSearch(val)}
          />
        </div>
        <PanelListNoDate list={store.list}></PanelListNoDate>
      </div>
    </div>
  );
});
export default LiveSearch;

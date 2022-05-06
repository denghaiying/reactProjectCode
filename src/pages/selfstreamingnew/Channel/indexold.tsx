import React, {useEffect, useState} from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from "@/eps/commons/declare";
import {Col, Form, Input, Row,Select} from 'antd';
import {observer, useLocalObservable} from 'mobx-react';
import ChannelService from './channelService';
import moment from "moment";
import fetch from "@/utils/fetch";
import HttpRequest from '@/eps/commons/v2/HttpRequest';
const FormItem = Form.Item;

const tableProp: ITable = {
  tableSearch: true,
  disableEdit: false,
  disableDelete:false,
  disableAdd:false,
  disableCopy:true
}

const Channelold = observer((props) =>{

  const [umid, setUmid] = useState('');

  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');
  //
  // const [typelist, setOrglist] = useState<
  //   Array<{ id: string; label: string; value: string }>
  //   >([]);
  //
  // const [orglist, setOrglist] = useState<
  //   Array<{ id: string; label: string; value: string }>
  //   >([]);


  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(ChannelService));
  // const customTableAction = (text, record, index, store) => {
  //
  //   return (<>
  //     {[
  //       //  <Detail title="模块详情" column={ource} data={record} store={tableStore} customForm={customForm} />,
  //     ]}
  //   </>)}

  const Store = useLocalObservable(() => ({
    channelList: [],
    typeData:[],
    zslxData : [{value: 'mlfl', label: '目录分类展示'},{value: 'mllb', label: '目录列表展示'},
      {value: 'mlnr', label: '目录内容展示'},{value: 'tpfl', label: '图片分类展示'},
      {value: 'tplb', label: '图片列表展示'},{value: 'tpnr', label: '图片内容展示'},
      {value: 'spfl', label: '视频分类展示'},],



    async queryType() {
      const response = await fetch.post(`/api/streamingapi/new/channeltype/queryForList`);
      debugger
      if (response.status === 200) {
        this.typeData = response.data.map(o => ({ 'id': o.id, 'label': o.channeltypename, 'value': o.channeltypebh }));
        console.log('typedata',this.typeData);
      } else {
        return;
      }
    },


    async query() {
      const response = await fetch.post(`/api/streamingapi/new/channeltype/queryChannelForList`);
      debugger
      if (response.status === 200) {
        this.channelList = response.data.map(o => ({ 'id': o.channelid, 'label': o.channelname, 'value': o.channelid }));
        console.log('channelList',this.channelList);
      } else {
        return;
      }
    },

  }));




  useEffect(() => {
    // SearchStore.queryDw();
    setUmid('SELF002');
    Store.query();
    Store.queryType();
  }, []);

  // const customAction = (store: EpsTableStore) => {
  //   return ([<>
  //     {/* <EpsReportButton store={store} umid={umid} /> */}
  //     {/*        <EpsReportButton store={store} umid={umid} />*/}
  //   </>])
  // }


  const span = 24;
  const _width = 240


// 自定义表单

  const customForm = () => {
    //自定义表单校验


    return (
      <>
        <Row gutter={20}>
          <Col span={span}>
            <FormItem  label="上级栏目" name="channelfid">
              <Select
                style={{ width: _width }} className="ant-select"
                placeholder="上级栏目" options={Store.channelList}
              >
                {/*{ChannelStore.channelList.map(item => (*/}
                {/*  <Select.Option key={item.channelid} value={item.channelid}>{item.channelname}</Select.Option>*/}
                {/*))}*/}
              </Select>
            </FormItem>
          </Col>
          <Col span={span}>
            <Form.Item required label="栏目编号" name="channelbh" >
              <Input style={{width:  _width}} className="ant-input"/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item required label="栏目名称" name="channelname" >
              <Input style={{width:  _width}} className="ant-input"/>
            </Form.Item>
          </Col>
          <Col span={span}>
            <FormItem required label="栏目类型" name="channeltype">
              <Select  style={{ width: _width }} className="ant-select"
                       options={Store.typeData}
                       placeholder="栏目类型"
              >
                {/*{ChannelStore.typeData.map(item => (*/}
                {/*  <Select.Option key={item.channeltypebh} value={item.channeltypebh}>{item.channeltypename}</Select.Option>*/}
                {/*))}*/}
              </Select>
            </FormItem>
          </Col>
          <Col span={span}>
            <FormItem label="展示类型" name="channelzslx">
              <Select
                options={Store.zslxData}
                style={{ width: _width }} className="ant-select"
                placeholder="展示类型"
              >
              </Select>
            </FormItem>

          </Col>
          <Col span={span}>
            <Form.Item label="维护时间" name="channelwhsj" initialValue={getDate}>
              <Input disabled style={{width:  _width}} className="ant-input"/>
            </Form.Item>
          </Col>

        </Row>
      </>
    )
  }

  const source: EpsSource[] = [{
    title: '栏目编号',
    code: 'channelbh',
    align: 'center',
    formType: EpsFormType.Input
  },
    {
      title: '栏目名称',
      code: 'channelname',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '展示类型',
      code: 'channelzslx',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let lxlist = Store.zslxData;
        let aa = lxlist.filter((item) => {
          return item.value === text;
        });
        return aa[0]?.label;
      },
    },
    {
      title: '栏目类型',
      code: 'channeltype',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let lxlist = Store.typeData;
        let aa = lxlist.filter((item) => {
          return item.value === text;
        });
        return aa[0]?.label;
      },
    },
    {
      title: '维护人',
      code: 'channelwhr',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '维护时间',
      code: 'channelwhsj',
      align: 'center',
      formType: EpsFormType.Input
    }
  ]
  const title = {
    name: '栏目管理'
  }

  return (
    <EpsPanel
      title={title}
      source={source}
      tableProp={tableProp}
      formWidth={500}
      //customTableAction={customTableAction}                  // 高级搜索组件，选填
      tableService={ChannelService}
      customForm={customForm}
      //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>
  );
})

export default Channelold;

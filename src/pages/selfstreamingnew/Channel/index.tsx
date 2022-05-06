import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';

import GnService from '@/services/system/GnService';

import { Col, Form, Input, Row, Select } from 'antd';
import {
  EpsSource,
  ITable,
  ITitle,
  ITree,
  MenuData,
} from '@/eps/commons/declare';

import { observer, useLocalObservable } from 'mobx-react';
import ChannelService from '@/pages/selfstreamingnew/Channel/channelService';
import ChannelTypeService from '@/pages/selfstreamingnew/Channel/channelTypeService';
import moment from 'moment';
import fetch from '@/utils/fetch';
import ChannelType from '@/pages/selfstreamingnew/Channeltype';
const FormItem = Form.Item;

const tableProp: ITable = {
  tableSearch: true,
  disableAdd: false,
  disableEdit: false,
  disableDelete: false,
  disableCopy: true,
};

const span = 24;
const _width = 240;

const treeProp: ITree = {
  treeSearch: false,
  treeCheckAble: false,
};

const Channelnew = observer((props) => {
  const [umid, setUmid] = useState('');
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const Store = useLocalObservable(() => ({
    channelList: [],
    typeData: [],
    zslxData: [
      { value: 'mlfl', label: '目录分类展示' },
      { value: 'mllb', label: '目录列表展示' },
      { value: 'mlnr', label: '目录内容展示' },
      { value: 'tpfl', label: '图片分类展示' },
      { value: 'tplb', label: '图片列表展示' },
      { value: 'tpnr', label: '图片内容展示' },
      { value: 'spfl', label: '视频分类展示' },
    ],
    sylxData: [
      {value: "flfg",label: "法律法规"},
      {value: "tzgg",label: "通知公告"},
      {value: "dazx",label: "档案资讯"},
      {value: "flgf",label: "下载中心"},
      {value: "jgda",label: "局馆档案"},
      {value: "xwdt",label: "新闻动态"},
      {value: "spda",label: "视频档案"},
      {value: "tpda",label: "图片档案"},
      {value: "ztda",label: "专题档案"},
      {value: "gzzd",label: "规章制度"},
      {value: "jjfa",label: "解决方案"},
      {value: "cgal",label: "成功案例"},
      {value: "yqlj",label: "友情链接"},
      {value: "byfb",label: "编研档案"},
      {value: "dwjs",label: "单位简介"},
      {value: "daglzd",label: "档案管理制度"},
      {value: "banner",label: "首页Banner"},
      {value: "dayd",label: "档案园地"}
      ],

    async queryType() {
      const response = await fetch.post(
        `/api/streamingapi/new/channeltype/queryForList`,
      );
      debugger;
      if (response.status === 200) {
        this.typeData = response.data.map((o) => ({
          id: o.channeltypebh,
          label: o.channeltypename,
          value: o.channeltypebh,
        }));
        console.log('typedata', this.typeData);
      } else {
        return;
      }
    },

    async query() {
      const response = await fetch.post(
        `/api/streamingapi/new/channeltype/queryChannelForList`,
      );
      debugger;
      if (response.status === 200) {
        this.channelList = response.data.map((o) => ({
          id: o.channelid,
          label: o.channelname,
          value: o.channelid,
        }));
        console.log('channelList', this.channelList);
      } else {
        return;
      }
    },
  }));

  // 自定义表单
  const customForm = () => {
    return (
      <>
        <Row gutter={20}>
          <Col span={span}>
            <FormItem label="上级栏目" name="channelfid">
              <Select
                style={{ width: _width }}
                className="ant-select"
                placeholder="上级栏目"
                options={Store.channelList}
              >
                {/*{ChannelStore.channelList.map(item => (*/}
                {/*  <Select.Option key={item.channelid} value={item.channelid}>{item.channelname}</Select.Option>*/}
                {/*))}*/}
              </Select>
            </FormItem>
          </Col>
          <Col span={span}>
            <Form.Item required label="栏目编号" name="channelbh">
              <Input style={{ width: _width }} className="ant-input" />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item required label="栏目名称" name="channelname">
              <Input style={{ width: _width }} className="ant-input" />
            </Form.Item>
          </Col>
          <Col span={span}>
            <FormItem required label="栏目类型" name="channeltypelx">
              <Select
                options={Store.typeData}
                style={{ width: _width }}
                className="ant-select"
                placeholder="栏目类型"
              ></Select>
            </FormItem>
          </Col>
          {/* <Col span={span}>*/}
          {/*  <FormItem required label="栏目类型" name="channeltype">*/}
          {/*    <Select  style={{ width: _width }} className="ant-select"*/}
          {/*             options={Store.typeData}*/}
          {/*             placeholder="栏目类型"*/}
          {/*    >*/}
          {/*      /!*{ChannelStore.typeData.map(item => (*!/*/}
          {/*      /!*  <Select.Option key={item.channeltypebh} value={item.channeltypebh}>{item.channeltypename}</Select.Option>*!/*/}
          {/*      /!*))}*!/*/}
          {/*    </Select>*/}
          {/*  </FormItem>*/}
          {/*</Col> */}
          <Col span={span}>
            <FormItem label="展示类型" name="channelzslx">
              <Select
                options={Store.zslxData}
                style={{ width: _width }}
                className="ant-select"
                placeholder="展示类型"
              ></Select>
            </FormItem>
          </Col>
          <Col span={span}>
            <FormItem label="对应首页栏目" name="channelsylm">
              <Select allowClear
                options={Store.sylxData}
                style={{ width: _width }}
                className="ant-select"
                placeholder="对应首页栏目"
              ></Select>
            </FormItem>
          </Col>
          <Col span={span}>
            <Form.Item
              label="维护时间"
              name="channelwhsj"
              initialValue={getDate}
            >
              <Input disabled style={{ width: _width }} className="ant-input" />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  const ref = useRef();
  // const FChild = forwardRef(EpsPanel);

  // 自定义功能按钮
  const customAction = (store: EpsTableStore) => {
    return [
      <>
        {/* <EpsReportButton store={store} umid={umid} />
            <EpsModalButton name="批量导入" title="批量导入" width={1200}   useIframe={true}  url={'/api/eps/control/main/yh/yhpldr'}  icon={<ImportOutlined />}/>
            <EpsModalButton name="组织机构用户" title="组织机构用户"  width={1200}   useIframe={true}  url={'/api/eps/control/main/org/openOrgyh'}  icon={<ClusterOutlined />}/> */}
      </>,
    ];
  };

  const [initParams, setInitParams] = useState({});
  const [tableStore, setTableStore] = useState<EpsTableStore>(
    new EpsTableStore(ChannelService),
  );

  // 创建右侧表格Store实例
  //   const [tableStore] = useState<EpsTableStore>(new EpsTableStore(YhService));

  // 自定义表格行按钮detail
  // const customTableAction = (text, record, index, store) => {
  //   return (<>
  //     {[
  //       <DetailGn title="查看" column={source} data={record} store={tableStore} customForm={customForm} />,
  //
  //     ]}
  //   </>);
  // }

  useEffect(() => {
    setUmid('SELF002');
    Store.query();
    Store.queryType();

    setTableStore(ref.current?.getTableStore());
  }, []);

  useEffect(() => {
    //    YhStore.queryOrg(tableStore?.key);
    console.log('左侧菜单值: ', tableStore?.key);
  }, [tableStore?.key]);

  const Lxs = [
    { value: 'F', label: '业务功能' },
    { value: 'I', label: '信息功能' },
    { value: 'U', label: '网址' },
    { value: 'K', label: '档案库' },
    { value: 'G', label: 'GTK自定义' },
  ];

  const source: EpsSource[] = [
    {
      title: '栏目编号',
      code: 'channelbh',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '栏目名称',
      code: 'channelname',
      align: 'center',
      formType: EpsFormType.Input,
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
      code: 'channeltypelx',
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
      title: '对应首页栏目',
      code: 'channelsylm',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let lxlist = Store.sylxData;
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
      formType: EpsFormType.Input,
    },
    {
      title: '维护时间',
      code: 'channelwhsj',
      align: 'center',
      formType: EpsFormType.Input,
    },
  ];
  const title = {
    name: '栏目管理',
  };
  //
  // const menuProp: MenuData[] = [
  //   {
  //     title: '导入',
  //     icon: 'file-transfer/icon_edit',
  //     onClick: (record , store, rows) => console.log('这是导入按钮', record , rows),
  //     color: '#CCCCFF'
  //   }, {
  //     title: '打印',
  //     icon: 'file-transfer/icon_book',
  //     onClick: (record , store, rows) => console.log('这是打印按钮', record, rows),
  //     color: '#FFCCFF'
  //   }
  //
  // ]

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        treeService={ChannelTypeService}
        treeProp={treeProp} // 左侧树 设置属性,可选填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={ChannelService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        formWidth={480}
        initParams={initParams}
        tableRowClick={(record) => console.log('abcef', record)}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      ></EpsPanel>
    </>
  );
});

export default Channelnew;

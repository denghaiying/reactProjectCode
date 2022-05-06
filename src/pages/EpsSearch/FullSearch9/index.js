import React, { useEffect, useState } from 'react';
import './index.less';
import {
  Search,
  Tab,
  Tag,
  Button,
  DatePicker,
  Icon,
  Switch,
  Dialog,
  NumberPicker,
} from '@alifd/next';
import {
  Table,
  Pagination,
  Form,
  Modal,
  Row,
  Col,
  Input,
  TreeSelect,
  Select,
  Checkbox,
  Divider,
} from 'antd';
import IceNotification from '@icedesign/notification';
import { observer } from 'mobx-react';
import E9Config from '../../../utils/e9config';
import TabsAll from './all';
import CollapseRight from './collapse-right';
import VideoTab from './video-tab';
import PicTab from './pic-tab';
import { useIntl, FormattedMessage } from 'umi';

import Store from '../../../stores/EpsSearch/EpsSearchStore';
import SysStore from '../../../stores/system/SysStore';
import DwStore from '../../../stores/system/DwStore';
import NewDajyStore from '../../../stores/daly/NewDajyStore';
import ParamsManageStore from '../../../stores/system/ParamsManageStore';

const { Group: TagGroup, Closeable: CloseableTag } = Tag;
const FormItem = Form.Item;

const FullSearch9 = observer((props) => {
  //const { intl: { formatMessage } } = props;

  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const {
    years = [],
    mbmcList = [],
    ndList = [],
    flhList = [],
    yearId,
    companys,
    companyId,
    dakType,
    dakTypeId,
    tagList,
    rightExpand,
    showMenu,
    showNdsortMenu,
    showDakmcsortMenu,
    showMbmcsortMenu,
    showDwmcsortMenu,
    currentTab,
    type,
    data = [],
    queryForPage,
    keywords,
    quePage,
  } = Store;
  const { currentCmpList } = SysStore;
  const [form] = Form.useForm();
  const [xcdForm] = Form.useForm();
  const shortContent = (
    <p>Start your business here by searching a popular product</p>
  );
  const span = 8;
  const longContent = [
    <p key="0">Start your business here by searching a popular product</p>,
    <p key="1">Start your business here by searching a popular product</p>,
    <p key="2">Start your business here by searching a popular product</p>,
    <p key="3">Start your business here by searching a popular product</p>,
  ];

  useEffect(() => {
    debugger;
    quePage();
    SysStore.setCurrentCmpList();
    Store.findDistinctbyField_Nd();
    Store.findDistinctbyField_Mbmc();
    Store.findDistinctbyField_Flh();
    Store.findParamsValueById();
    queryForPage();
    DwStore.queryTreeDwList();
    NewDajyStore.querySjzdByLymd();
    Store.getUserOptionByDALYF002();

    // Store.setColumns([
    //   {
    //     title: "流程状态",
    //     dataIndex: "lczt",
    //     key: "lczt",
    //     width: 30,
    //     lock: true,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.lczt - b.lczt,
    //   },
    //   {
    //     title: "申请人",
    //     dataIndex: "sqr",
    //     key: "sqr",
    //     width: 30,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.sqr - b.sqr,
    //   },

    //   {
    //     title: "所属卷宗",
    //     dataIndex: 'ssjz',
    //     key: 'ssjz',
    //     width: 50,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.ssjz - b.ssjz,
    //   },
    //   {
    //     title: "手机",
    //     dataIndex: 'sj',
    //     key: 'sj',
    //     width: 50,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.sj - b.sj,
    //   },
    //   {
    //     title: "邮箱",
    //     dataIndex: 'yx',
    //     key: 'yx',
    //     width: 30,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.yx - b.yx,
    //   },
    //   {
    //     title: "协查内容",
    //     dataIndex: 'xcnr',
    //     key: 'xcnr',
    //     width: 50,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.xcnr - b.xcnr,
    //   },
    //   {
    //     title: "简要说明",
    //     dataIndex: 'jysm',
    //     key: 'jysm',
    //     width: 50,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.jysm - b.jysm,
    //   },
    //   {
    //     title: "借阅天数",
    //     dataIndex: 'jyts',
    //     key: 'jyts',
    //     width: 25,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.jyts - b.jyts,
    //   },
    //   {
    //     title: "查看",
    //     dataIndex: 'ck',
    //     key: 'ck',
    //     width: 20,
    //     defaultSortOrder: 'descend'
    //   },
    //   {
    //     title: "打印",
    //     dataIndex: 'dy',
    //     key: 'dy',
    //     width: 10,
    //     defaultSortOrder: 'descend'
    //   },
    //   {
    //     title: "下载",
    //     dataIndex: 'xz',
    //     key: 'xz',
    //     width: 10,
    //     defaultSortOrder: 'descend'
    //   }

    // ]);
    // Store.getDakTypeList();
  }, []);

  const closeTag = (val) => {
    Store.removeTaglist(val);
  };

  const handleClickCompanys = (val) => {
    if (val.id != null) {
      // Store.companyId = val.id

      Store.getDwTaglist(val);
      // queryForPage();
    }
  };

  const showXcdApply = () => {
    if (
      ParamsManageStore.xcdStatus &&
      ParamsManageStore.xcdStatus.message == 'Y'
    ) {
      return (
        <Button onClick={onOpen} type="primary" size="large">
          {' '}
          协查申请
        </Button>
      );
    }
  };

  const plainOptions = ['查看', '打印', '下载'];

  const defaultVals = [
    { value: 'ck', name: '查看' },
    { value: 'dy', name: '打印' },
    { value: 'xz', name: '下载' },
  ];

  const [checkedData, setCheckedData] = React.useState([]);

  const onChange = (list) => {
    setCheckedData(list);
  };

  const handleClickYears = (val) => {
    console.log(val);
    if (val != null) {
      Store.yearId = val;
      Store.getYearTaglist(val);
    }
  };

  const handleClickFlhs = (val) => {
    console.log(val);
    if (val.name != null) {
      Store.flhId = val.name;
      Store.getFlhTaglist(val);
    }
  };

  const handleClickDakType = (val) => {
    if (val.name != null) {
      Store.dakTypeId = val.name;
      Store.getDakTypeTaglist(val);
    }
  };

  const handleTabChange = (val) => {
    Store.setTypes(val);
  };

  const getExpand = (type) => {
    //    this.setState({rightExpand: type})
  };

  const setShowMenu = (value) => {
    Store.showMenu = value;
  };

  const showIsNdsortMenu = (value) => {
    debugger;
    if (value === 'nd_desc') {
      Store.showNdsortMenu = false;
      Store.onSortClick('nd_desc');
    } else {
      Store.showNdsortMenu = true;
      Store.onSortClick('nd_asc');
    }
  };

  const showIsDakmcsortMenu = (value) => {
    debugger;
    if (value === 'dakmc_desc') {
      Store.showDakmcsortMenu = false;
      Store.onSortClick('dakmc_desc');
    } else {
      Store.showDakmcsortMenu = true;
      Store.onSortClick('dakmc_asc');
    }
  };

  const showIsMbmcsortMenu = (value) => {
    debugger;
    if (value === 'mbmc_desc') {
      Store.showMbmcsortMenu = false;
      Store.onSortClick('mbmc_desc');
    } else {
      Store.showMbmcsortMenu = true;
      Store.onSortClick('mbmc_asc');
    }
  };

  const showIsDwmcsortMenu = (value) => {
    debugger;
    if (value === 'dwmc_desc') {
      Store.showDwmcsortMenu = false;
      Store.onSortClick('dwmc_desc');
    } else {
      Store.showDwmcsortMenu = true;
      Store.onSortClick('dwmc_asc');
    }
  };

  const doSearchAction = (values) => {
    queryForPage();
  };

  //const [keyWordsValues, setKeyWordsValues] = useState({})

  useEffect(() => {
    form.setFieldsValue({ searchValue: keywords });
  }, [keywords]);

  const formItemLayout = {
    colon: false,
    labelCol: {
      span: 8,
    },
  };

  const onOpen = () => {
    (Store.visible = true), (Store.short = true);
  };

  const onCloseG = (val) => {
    Store.visible = val;
  };

  const toggleShouldUpdatePosition = () => {
    Store.shouldUpdatePosition = !Store.shouldUpdatePosition;
  };
  const modifyContent = () => {
    Store.short = !Store.short;
  };
  const applyOnChange = (value) => {
    //    this.setState({rightExpand: type})
  };
  const getTimeAndtotal = () => {
    if (data.length <= 0 || data.code == 500) {
      return <p className="total">检索耗时 0 秒，为你找到相关结果约 0 条</p>;
    } else {
      return (
        <p className="total">
          检索耗时{data.responseTime / 1000000000}秒，为你找到相关结果约{' '}
          {data.total} 条
        </p>
      );
    }
  };

  const getIsShowFlh = () => {
    if (Store.codeValue.value == 'Y') {
      return (
        <div className="expand-menu">
          <div
            className="expand-li"
            style={{ borderBottom: '1px dashed #E5E5E5' }}
          >
            <span className="title">单位：</span>
            <div className="group">
              {currentCmpList &&
                currentCmpList.map((item) => (
                  <li
                    className="item"
                    key={item}
                    onClick={() => handleClickCompanys(item)}
                  >
                    {item.dwname}
                  </li>
                ))}
            </div>
            {/* <span className="multi">多选</span> */}
          </div>

          <div
            className="expand-li"
            style={{ borderBottom: '1px dashed #E5E5E5' }}
          >
            <span className="title">年度：</span>
            <div className="group">
              {ndList &&
                ndList.map((item) => (
                  <li
                    className="item"
                    key={item}
                    onClick={() => handleClickYears(item)}
                  >
                    {item}
                  </li>
                ))}
            </div>
            {/* <span className="multi">多选</span> */}
          </div>

          <div
            className="expand-li"
            style={{ borderBottom: '1px dashed #E5E5E5' }}
          >
            <span className="title">档案库类型：</span>
            <div className="group">
              {dakType &&
                dakType.map((item) => (
                  <li
                    className="item"
                    key={item}
                    onClick={() => handleClickDakType(item)}
                  >
                    {item.name}
                  </li>
                ))}
            </div>
          </div>
          <div
            className="expand-li"
            style={{ borderBottom: '1px dashed #E5E5E5' }}
          >
            <span className="title">分类号：</span>
            <div className="group">
              {flhList &&
                flhList.map((item) => (
                  <li
                    className="item"
                    key={item}
                    onClick={() => handleClickFlhs(item)}
                  >
                    {item.name}
                  </li>
                ))}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="expand-menu">
          <div
            className="expand-li"
            style={{ borderBottom: '1px dashed #E5E5E5' }}
          >
            <span className="title">单位：</span>
            <div className="group">
              {currentCmpList &&
                currentCmpList.map((item) => (
                  <li
                    className="item"
                    key={item}
                    onClick={() => handleClickCompanys(item)}
                  >
                    {item.dwname}
                  </li>
                ))}
            </div>
          </div>

          <div
            className="expand-li"
            style={{ borderBottom: '1px dashed #E5E5E5' }}
          >
            <span className="title">年度：</span>
            <div className="group">
              {ndList &&
                ndList.map((item) => (
                  <li
                    className="item"
                    key={item}
                    onClick={() => handleClickYears(item)}
                  >
                    {item}
                  </li>
                ))}
            </div>
          </div>
          <div
            className="expand-li"
            style={{ borderBottom: '1px dashed #E5E5E5' }}
          >
            <span className="title">档案库类型：</span>
            <div className="group">
              {dakType &&
                dakType.map((item) => (
                  <li
                    className="item"
                    key={item}
                    onClick={() => handleClickDakType(item)}
                  >
                    {item.name}
                  </li>
                ))}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Form form={form}>
        <div className="full-search">
          <div className="control">
            <FormItem name="searchValue">
              <Search
                hasIcon={false}
                type="secondary"
                searchText={<span>搜索</span>}
                onChange={Store.onChange}
                onSearch={doSearchAction}
              />
            </FormItem>
            {/* <FormItem>
           <span className="link" style={{margin: '0 25px'}}><Icon type="search" className="icon"/>在结果中检索</span>
      </FormItem> */}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {/* 协查申请  显示 */}
            <FormItem>{showXcdApply()}</FormItem>
          </div>

          <div className="tabs">
            <Tab onChange={handleTabChange}>
              <Tab.Item title="全部" key="1"></Tab.Item>
              <Tab.Item title="目录" key="2"></Tab.Item>
              <Tab.Item title="电子文件" key="3"></Tab.Item>
              {/* <Tab.Item title="图片" key="4"></Tab.Item>
    <Tab.Item title="视频" key="5"></Tab.Item> */}
            </Tab>
          </div>
          <div
            className={rightExpand ? 'main-content' : 'main-content hideRight'}
          >
            <div className={showMenu ? 'tab-content' : 'tab-content hideMenu'}>
              {getTimeAndtotal()}
              {/* <p className="total">检索耗时{data.responseTime / 1000000000}秒，为你找到相关结果约 {data.total} 条</p> */}
              <div className="classify">
                <span className="label">所有分类{' >'}</span>
                <TagGroup>
                  {tagList.map((item) => (
                    <CloseableTag key={item.id} onClose={() => closeTag(item)}>
                      {item.name}
                    </CloseableTag>
                  ))}
                </TagGroup>

                {showMenu ? (
                  <Button
                    type="normal"
                    className="expand"
                    onClick={() => setShowMenu(false)}
                  >
                    收起筛选
                    <Icon type="arrow-up" />
                  </Button>
                ) : (
                  <Button
                    type="normal"
                    className="expand"
                    onClick={() => setShowMenu(true)}
                  >
                    展开筛选
                    <Icon type="arrow-down" />
                  </Button>
                )}
              </div>
              {/* 根据参数控制是否显示分类号类型查询 */}
              {getIsShowFlh()}
              <div className="sort">
                <span className="label">排序：</span>
                <Tab shape="capsule" size="small">
                  <Tab.Item
                    title={
                      <span>
                        默认<span className="iconfont icon-arrowsdown"></span>
                      </span>
                    }
                    className="sort-tab"
                    key="random"
                    onClick={() => Store.onSortClick('random')}
                  ></Tab.Item>

                  {showDwmcsortMenu ? (
                    <Tab.Item
                      title={
                        <span>
                          单位{' '}
                          <span className="iconfont icon-arrowsdown"></span>
                        </span>
                      }
                      className="sort-tab"
                      key="attr_dwmc"
                      onClick={() => showIsDwmcsortMenu('dwmc_desc')}
                    ></Tab.Item>
                  ) : (
                    <Tab.Item
                      title={
                        <span>
                          单位{' '}
                          <span className="iconfont icon-arrowsdown"></span>
                        </span>
                      }
                      className="sort-tab"
                      key="attr_dwmc"
                      onClick={() => showIsDwmcsortMenu('dwmc_asc')}
                    ></Tab.Item>
                  )}

                  {showMbmcsortMenu ? (
                    <Tab.Item
                      title={
                        <span>
                          档案库类型
                          <span className="iconfont icon-arrowsdown"></span>
                        </span>
                      }
                      className="sort-tab"
                      key="attr_mbmc"
                      onClick={() => showIsMbmcsortMenu('mbmc_desc')}
                    ></Tab.Item>
                  ) : (
                    <Tab.Item
                      title={
                        <span>
                          档案库类型
                          <span className="iconfont icon-arrowsdown"></span>
                        </span>
                      }
                      className="sort-tab"
                      key="attr_mbmc"
                      onClick={() => showIsMbmcsortMenu('mbmc_asc')}
                    ></Tab.Item>
                  )}

                  {showDakmcsortMenu ? (
                    <Tab.Item
                      title={
                        <span>
                          档案库
                          <span className="iconfont icon-arrowsdown"></span>
                        </span>
                      }
                      className="sort-tab"
                      key="attr_dakmc"
                      onClick={() => showIsDakmcsortMenu('dakmc_desc')}
                    ></Tab.Item>
                  ) : (
                    <Tab.Item
                      title={
                        <span>
                          档案库
                          <span className="iconfont icon-arrowsdown"></span>
                        </span>
                      }
                      className="sort-tab"
                      key="attr_dakmc"
                      onClick={() => showIsDakmcsortMenu('dakmc_asc')}
                    ></Tab.Item>
                  )}

                  {showNdsortMenu ? (
                    <Tab.Item
                      title={
                        <span>
                          年度<span className="iconfont icon-arrowsdown"></span>
                        </span>
                      }
                      className="sort-tab"
                      key="nd"
                      onClick={() => showIsNdsortMenu('nd_desc')}
                    ></Tab.Item>
                  ) : (
                    <Tab.Item
                      title={
                        <span>
                          年度<span className="iconfont icon-arrowsdown"></span>
                        </span>
                      }
                      className="sort-tab"
                      key="nd"
                      onClick={() => showIsNdsortMenu('nd_asc')}
                    ></Tab.Item>
                  )}
                </Tab>
              </div>
              <div className="tab-inner">
                {currentTab === '1' ? <TabsAll></TabsAll> : ''}
                {currentTab === '2' ? <TabsAll></TabsAll> : ''}
                {currentTab === '3' ? <TabsAll></TabsAll> : ''}
                {currentTab === '4' ? <PicTab></PicTab> : ''}
                {currentTab === '5' ? <VideoTab></VideoTab> : ''}
              </div>
            </div>
            {/* 右部展示 猜你喜欢 / 热点搜索*/}
            
            {/* 
            <div className="right">
              <CollapseRight rightExpand={rightExpand} getExpand={getExpand}></CollapseRight>
            </div> 
            */}

          </div>
        </div>
        <div>
          <div style={{ display: 'block', marginBottom: '10px' }}></div>
          {/* <Switch style={{ display: 'block', marginBottom: '10px' }} checked={Store.shouldUpdatePosition} onChange={Store.toggleShouldUpdatePosition} />
           */}
        </div>
      </Form>

      <Modal
        title="协查申请"
        visible={Store.visible}
        style={{ top: 50 }}
        width="1000px"
        onClose={() => onCloseG(this)}
        onOk={() => {
          xcdForm
            .validateFields()
            .then((values) => {
              xcdForm.resetFields();
              Store.addXcdApply(values);
            })
            .catch((info) => { });
        }}
        onCancel={() => onCloseG(this)}
      >
        <div style={{ height: 450 }}>
          <Form form={xcdForm} {...formItemLayout}>
            <Row>
              <Divider orientation="left" plain>
                协查信息
              </Divider>
              <Col span={span}>
                {/* <div style={style}> */}
                <FormItem
                  label="申请人员:"
                  name="yhmc"
                  initialValue={SysStore.getCurrentUser().yhmc}
                  labelCol={{ span: 6 }}
                >
                  <Input hasClear placeholder="请输入申请人" disabled />
                </FormItem>
                {/* </div> */}
              </Col>

              <Col span={span}>
                {/* <div style={style}> */}
                <FormItem
                  label="申请单位:"
                  name="dwmc"
                  initialValue={SysStore.getCurrentCmp().mc}
                >
                  <Input hasClear placeholder="请输申请单位" disabled />
                </FormItem>
                {/* </div> */}
              </Col>

              <Col span={span}>
                {/* <div style={style}> */}
                <FormItem
                  label="申请部门:"
                  name="bm"
                  initialValue={SysStore.getCurrentUser().orgmc}
                >
                  <Input hasClear placeholder="请输入申请部门" disabled />
                </FormItem>
                {/* </div> */}
              </Col>
              <Col span={span}>
                {/* <div style={style}> */}
                <FormItem
                  label="手机号码:"
                  name="sj"
                  rules={[
                    {
                      pattern: /^1[3456789]\d{9}$/,
                      message: '请输入有效的手机号!',
                    },
                  ]}
                  labelCol={{ span: 6 }}
                  initialValue={SysStore.getCurrentUser().sjh}
                >
                  <Input hasClear placeholder="请输入手机号码：" />
                </FormItem>
                {/* </div> */}
              </Col>

              <Col span={8}>
                {/* <div style={style}> */}
                <FormItem
                  label="电子邮箱:"
                  name="mail"
                  rules={[
                    {
                      pattern:
                        /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                      message: '请输入有效的邮箱!',
                    },
                  ]}
                  initialValue={SysStore.getCurrentUser().mail}
                >
                  <Input hasClear placeholder="请输入电子邮箱" />
                </FormItem>
                {/* </div> */}
              </Col>

              <Divider orientation="left" plain>
                协查操作
              </Divider>
              <Col span={span}>
                {/* <div style={style}> */}
                <FormItem
                  label="所属全宗:"
                  name="ssjzid"
                  style={{ height: 40 }}
                  labelCol={{ span: 6 }}
                >
                  <TreeSelect
                    style={{ width: 210 }}
                    treeData={DwStore.dwTreeData}
                    placeholder="请选择所属全宗"
                    treeDefaultExpandAll
                    allowClear
                  />
                </FormItem>
                {/* </div> */}
              </Col>
              <Col span={span}>
                <FormItem
                  label="利用目的:"
                  name="lymd"
                  rules={[{ required: true, message: '请选择利用目的' }]}
                >
                  <Select
                    style={{ width: 210 }}
                    placeholder="请选择利用目的"
                    options={NewDajyStore.lymdDataSelect}
                  />
                </FormItem>
              </Col>
              <Col span={span}>
                {/* <div style={style}> */}
                <FormItem
                  label="借阅天数:"
                  name="jyts"
                  initialValue={Store.pDALYF002}
                  rules={[{ required: true, message: '借阅天数不允许为空!' }]}
                >
                  <NumberPicker style={{ width: 210 }} min={1} mix={99} />
                </FormItem>
                {/* </div> */}
              </Col>
              <Col span={24}>
                <Form.Item
                  label=""
                  name="opetionGroup"
                  labelCol={{ span: 1 }}
                  style={{ height: 40 }}
                >
                  <Checkbox.Group
                    key={defaultVals}
                    options={plainOptions}
                    defaultValue={defaultVals}
                    onChange={onChange}
                  />
                </Form.Item>
              </Col>

              <Col span={24} style={{ height: 98 }}>
                <FormItem
                  label="借阅说明:"
                  name="bz"
                  labelCol={{ span: 2 }}
                  rules={[{ required: true, message: '请输入借阅说明' }]}
                >
                  <Input.TextArea
                    placeholder="请输入借阅说明："
                    showCount
                    rows={3}
                    maxLength={500}
                    style={{ width: 870 }}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
});
export default FullSearch9;

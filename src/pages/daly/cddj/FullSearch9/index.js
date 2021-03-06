import React, { useEffect, useState } from 'react';
import './index.less'
import { Search, Tab, Tag, Button, DatePicker, Icon, Switch, Dialog, NumberPicker } from '@alifd/next';
import { Table, Pagination, Form, Modal, Row, Col, Input, TreeSelect, Select, Checkbox, Divider } from 'antd';
import IceNotification from '@icedesign/notification';
import { observer } from 'mobx-react';
import E9Config from '../../../../utils/e9config';
import TabsAll from './all'
import CollapseRight from './collapse-right'
import VideoTab from './video-tab'
import PicTab from './pic-tab'
import { useIntl, FormattedMessage } from 'umi';

import Store from "@/stores/EpsSearch/EpsSearchStore";
import SysStore from "@/stores/system/SysStore";
import DwStore from '@/stores/system/DwStore';
import NewDajyStore from '@/stores/daly/NewDajyStore';
import ParamsManageStore from "@/stores/system/ParamsManageStore";
const { s } = Search;





const { Group: TagGroup, Closeable: CloseableTag } = Tag;
const FormItem = Form.Item;

const FullSearch9 = observer(props => {


  //const { intl: { formatMessage } } = props;

  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const { years = [], mbmcList = [], ndList = [], flhList = [], yearId, companys, companyId, dakType, dakTypeId, tagList, rightExpand, showMenu, currentTab, type, data = [], queryForPage, keywords, quePage } = Store;
  const { currentCmpList } = SysStore;
  const [form] = Form.useForm()
  const [xcdForm] = Form.useForm()
  const shortContent = <p>Start your business here by searching a popular product</p>;
  const span = 8;
  const longContent = [
    <p key="0">Start your business here by searching a popular product</p>,
    <p key="1">Start your business here by searching a popular product</p>,
    <p key="2">Start your business here by searching a popular product</p>,
    <p key="3">Start your business here by searching a popular product</p>
  ];



  useEffect(() => {
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
    //     title: "????????????",
    //     dataIndex: "lczt",
    //     key: "lczt",
    //     width: 30,
    //     lock: true,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.lczt - b.lczt,
    //   },
    //   {
    //     title: "?????????",
    //     dataIndex: "sqr",
    //     key: "sqr",
    //     width: 30,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.sqr - b.sqr,
    //   },

    //   {
    //     title: "????????????",
    //     dataIndex: 'ssjz',
    //     key: 'ssjz',
    //     width: 50,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.ssjz - b.ssjz,
    //   },
    //   {
    //     title: "??????",
    //     dataIndex: 'sj',
    //     key: 'sj',
    //     width: 50,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.sj - b.sj,
    //   },
    //   {
    //     title: "??????",
    //     dataIndex: 'yx',
    //     key: 'yx',
    //     width: 30,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.yx - b.yx,
    //   },
    //   {
    //     title: "????????????",
    //     dataIndex: 'xcnr',
    //     key: 'xcnr',
    //     width: 50,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.xcnr - b.xcnr,
    //   },
    //   {
    //     title: "????????????",
    //     dataIndex: 'jysm',
    //     key: 'jysm',
    //     width: 50,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.jysm - b.jysm,
    //   },
    //   {
    //     title: "????????????",
    //     dataIndex: 'jyts',
    //     key: 'jyts',
    //     width: 25,
    //     defaultSortOrder: 'descend',
    //     sorter: (a, b) => a.jyts - b.jyts,
    //   },
    //   {
    //     title: "??????",
    //     dataIndex: 'ck',
    //     key: 'ck',
    //     width: 20,
    //     defaultSortOrder: 'descend'
    //   },
    //   {
    //     title: "??????",
    //     dataIndex: 'dy',
    //     key: 'dy',
    //     width: 10,
    //     defaultSortOrder: 'descend'
    //   },
    //   {
    //     title: "??????",
    //     dataIndex: 'xz',
    //     key: 'xz',
    //     width: 10,
    //     defaultSortOrder: 'descend'
    //   }

    // ]);
    // Store.getDakTypeList();

  }, []);

  const closeTag = ((val) => {
    Store.removeTaglist(val)
  });

  const handleClickCompanys = (val) => {
    if (val.id != null) {
      // Store.companyId = val.id

      Store.getDwTaglist(val);
      // queryForPage();
    }
  };



  const showXcdApply = () => {

    if (ParamsManageStore.xcdStatus && ParamsManageStore.xcdStatus.message == "Y") {
      return <Button onClick={onOpen} type="primary" size="large"> ????????????</Button>
    }
  };


  const plainOptions = ['??????', '??????', '??????'];

  const defaultVals = [
    { value: 'ck', name: '??????' },
    { value: 'dy', name: '??????' },
    { value: 'xz', name: '??????' },
  ];


  const [checkedData, setCheckedData] = React.useState([]);

  const onChange = (list) => {
    setCheckedData(list);
  };

  const handleClickYears = (val) => {
    console.log(val)
    if (val.name != null) {
      Store.yearId = val.name
      Store.getYearTaglist(val);
    }
  };

  const handleClickFlhs = (val) => {
    console.log(val)
    if (val.name != null) {
      Store.flhId = val.name
      Store.getFlhTaglist(val);
    }
  };

  const handleClickDakType = (val) => {
    if (val.name != null) {
      Store.dakTypeId = val.name
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
    Store.showMenu = value
  };

  const doSearchAction = (values) => {
    queryForPage();
  };

  //const [keyWordsValues, setKeyWordsValues] = useState({})

  useEffect(() => {
    form.setFieldsValue({ searchValue: keywords });

  }, [keywords])


  const formItemLayout = {
    colon: false,
    labelCol: {
      span: 8
    },
  };


  const onOpen = () => {
    Store.visible = true,
      Store.short = true
  };

  const onCloseG = (val) => {
    Store.visible = val
  };


  const toggleShouldUpdatePosition = () => {
    Store.shouldUpdatePosition = !Store.shouldUpdatePosition

  };
  const modifyContent = () => {

    Store.short = !Store.short

  };
  const applyOnChange = (value) => {
    //    this.setState({rightExpand: type})
  };
  const getTimeAndtotal = () => {
    if (data.length <= 0 || data.code == 500) {
      return (
        <p className="total" style={{ marginLeft:'30px'}}>???????????? 0 ????????????????????????????????? 0 ???</p>)
    } else {
      return (
        <p className="total" style={{ marginLeft:'30px'}}>????????????{data.responseTime / 1000000000}????????????????????????????????? {data.total} ???</p>)
    }
  }

  const getIsShowFlh = () => {
    if (Store.codeValue.value == 'Y') {
      return (
        <div className="expand-menu">
          <div className="expand-li" style={{ borderBottom: '1px dashed #E5E5E5' }}>
            <span className="title">?????????</span>
            <div className="group">
              {
                currentCmpList && currentCmpList.map(item => (
                  <li className="item" key={item} onClick={() => handleClickCompanys(item)}>{item.dwname}</li>
                ))
              }
            </div>
            {/* <span className="multi">??????</span> */}
          </div>

          <div className="expand-li" style={{ borderBottom: '1px dashed #E5E5E5' }}>
            <span className="title">?????????</span>
            <div className="group">
              {
                ndList && ndList.map(item => (
                  <li className="item" key={item} onClick={() => handleClickYears(item)}>{item}</li>
                ))
              }
            </div>
            {/* <span className="multi">??????</span> */}
          </div>

          <div className="expand-li" style={{ borderBottom: '1px dashed #E5E5E5' }}>
            <span className="title">??????????????????</span>
            <div className="group">
              {
                dakType && dakType.map(item => (
                  <li className="item" key={item} onClick={() => handleClickDakType(item)}>{item.name}</li>
                ))
              }
            </div>
          </div>
          <div className="expand-li" style={{ borderBottom: '1px dashed #E5E5E5' }}>
            <span className="title">????????????</span>
            <div className="group">
              {
                flhList && flhList.map(item => (<li className="item" key={item} onClick={() => handleClickFlhs(item)}>{item.name}</li>))
              }
            </div>
          </div>
        </div>
      )
    } else {

      return (
        <div className="expand-menu-noflh">
          <div className="expand-li" style={{ borderBottom: '1px dashed #E5E5E5' }}>
            <span className="title">?????????</span>
            <div className="group">
              {
                currentCmpList && currentCmpList.map(item => (
                  <li className="item" key={item} onClick={() => handleClickCompanys(item)}>{item.dwname}</li>
                ))
              }
            </div>
            {/* <span className="multi">??????</span> */}
          </div>

          <div className="expand-li" style={{ borderBottom: '1px dashed #E5E5E5' }}>
            <span className="title">?????????</span>
            <div className="group">
              {
                ndList && ndList.map(item => (
                  <li className="item" key={item} onClick={() => handleClickYears(item)}>{item}</li>
                ))
              }
            </div>
            {/* <span className="multi">??????</span> */}
          </div>

          <div className="expand-li" style={{ borderBottom: '1px dashed #E5E5E5' }}>
            <span className="title">??????????????????</span>
            <div className="group">
              {
                dakType && dakType.map(item => (
                  <li className="item" key={item} onClick={() => handleClickDakType(item)}>{item.name}</li>
                ))
              }
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <>

      <Form form={form}>
        <div className="full-search">
          <div className="control">
            <FormItem name="searchValue">
              <Search type="secondary"  style={{height:'33px'}}  size='medium'  searchText={<span>??????</span>} onChange={Store.onChange} onSearch={doSearchAction} />
            </FormItem>
          </div>
          <div className={rightExpand ? "main-content" : "main-content hideRight"}>
            <div className={showMenu ? "tab-content" : "tab-content hideMenu"}  >

              {getTimeAndtotal()}
              <div className="tab-inner">
                {currentTab === '1' ? <TabsAll></TabsAll> : ''}
                {currentTab === '2' ? <TabsAll></TabsAll> : ''}
                {currentTab === '3' ? <TabsAll></TabsAll> : ''}
                {currentTab === '4' ? <PicTab></PicTab> : ''}
                {currentTab === '5' ? <VideoTab></VideoTab> : ''}
              </div>
            </div>
            {/* ??????????????????*/}
            {/* <div className="right">
      <CollapseRight rightExpand={rightExpand} getExpand={getExpand}></CollapseRight>
    </div> */}
          </div>
        </div>
        <div>
          <div style={{ display: 'block', marginBottom: '10px' }}>

          </div>
          {/* <Switch style={{ display: 'block', marginBottom: '10px' }} checked={Store.shouldUpdatePosition} onChange={Store.toggleShouldUpdatePosition} />
     */}
        </div>
      </Form>

      <Modal title="????????????"
        visible={Store.visible}
        style={{ top: 50 }}
        width='1000px'
        onClose={() => onCloseG(this)}
        onOk={() => {
          xcdForm
            .validateFields()
            .then(values => {
              xcdForm.resetFields();
              Store.addXcdApply(values)
            })
            .catch(info => {

            });
        }}
        onCancel={() => onCloseG(this)}
      >
        <div style={{ height: 450 }}>
          <Form form={xcdForm} {...formItemLayout}>
            <Row >

              <Divider orientation="left" plain>????????????</Divider>
              <Col span={span}>
                {/* <div style={style}> */}
                <FormItem label="????????????:" name="yhmc" initialValue={SysStore.getCurrentUser().yhmc} labelCol={{ span: 6 }}>
                  <Input
                    hasClear
                    placeholder="??????????????????"
                    disabled />
                </FormItem>
                {/* </div> */}
              </Col>

              <Col span={span}>
                {/* <div style={style}> */}
                <FormItem label="????????????:" name="dwmc" initialValue={SysStore.getCurrentCmp().mc}>

                  <Input
                    hasClear
                    placeholder="??????????????????"
                    disabled />

                </FormItem>
                {/* </div> */}
              </Col>

              <Col span={span} >
                {/* <div style={style}> */}
                <FormItem label="????????????:" name="bm" initialValue={SysStore.getCurrentUser().orgmc}>
                  <Input
                    hasClear
                    placeholder="?????????????????????"
                    disabled />
                </FormItem>
                {/* </div> */}
              </Col>
              <Col span={span} >
                {/* <div style={style}> */}
                <FormItem label="????????????:" name="sj" rules={[{ pattern: /^1[3456789]\d{9}$/, message: '???????????????????????????!' },]} labelCol={{ span: 6 }} initialValue={SysStore.getCurrentUser().sjh}>
                  <Input
                    hasClear
                    placeholder="????????????????????????"
                  />
                </FormItem>
                {/* </div> */}
              </Col>

              <Col span={8} >
                {/* <div style={style}> */}
                <FormItem label="????????????:" name="mail" rules={[{ pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '????????????????????????!' }]}  initialValue={SysStore.getCurrentUser().mail}>
                  <Input
                    hasClear
                    placeholder="?????????????????????"
                  />
                </FormItem>
                {/* </div> */}
              </Col>


              <Divider orientation="left" plain>????????????</Divider>
              <Col span={span}>
                {/* <div style={style}> */}
                <FormItem label="????????????:" name="ssjzid" style={{ height: 40 }} labelCol={{ span: 6 }} >
                  <TreeSelect style={{ width: 210 }}
                    treeData={DwStore.dwTreeData}
                    placeholder="?????????????????????"
                    treeDefaultExpandAll
                    allowClear
                  />
                </FormItem>
                {/* </div> */}
              </Col>
              <Col span={span} >
                <FormItem label="????????????:" name="lymd" rules={[{ required: true, message: '?????????????????????' }]}>
                  <Select
                    style={{ width: 210 }}
                    placeholder="?????????????????????"
                    options={NewDajyStore.lymdDataSelect}
                  />
                </FormItem>
              </Col>
              <Col span={span} >
                {/* <div style={style}> */}
                <FormItem label="????????????:" name="jyts" initialValue={Store.pDALYF002} rules={[{ required: true, message: '???????????????????????????!' }]}>
                  <NumberPicker style={{ width: 210 }} min={1} mix={99} />
                </FormItem>
                {/* </div> */}
              </Col>
              <Col span={24}>
                <Form.Item label="" name="opetionGroup" labelCol={{ span: 1 }} style={{ height: 40 }}>
                  <Checkbox.Group
                    key={defaultVals}
                    options={plainOptions}
                    defaultValue={defaultVals}
                    onChange={onChange}
                  />
                </Form.Item>
              </Col>

              <Col span={24} style={{ height: 98 }}>
                <FormItem label="????????????:" name="bz" labelCol={{ span: 2 }} rules={[{ required: true, message: '?????????????????????' }]} >
                  <Input.TextArea placeholder="????????????????????????"
                    showCount
                    rows={3}
                    maxLength={500}
                    style={{ width: 870 }} />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>

    </>
  )
});
export default FullSearch9;

import React, { useEffect, useState } from 'react';
import { Search, Tab, Input, Button, Form, DatePicker, Checkbox, Pagination, Icon, Grid,Tree,TreeSelect , Switch,Select, Field, Notification } from '@alifd/next';

import IceNotification from '@icedesign/notification';
import moment from 'moment';
import ContainerTitle from '../../../components/ContainerTitle';
import LoginStore from '../../../stores/system/LoginStore';
import Store from "../../../stores/datj/DacltjStore";
import E9Config from '../../../utils/e9config';
import SysStore from '../../../stores/system/SysStore';

import { Observer } from 'mobx-react';

import 'antd/dist/antd.css';
/*
import '../style/index.less';
*/
import '../style/search.less';
import SearchStore from "../../../stores/datj/SearchStore";
import { Table, Typography } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import {action} from "mobx";
import { useIntl, FormattedMessage } from 'umi';
import { USERWHITESPACABLE_TYPES } from '@babel/types';

moment.locale('zh-cn');

const { Row, Col } = Grid;

const FormItem = Form.Item;
const { Text } = Typography;


const Dacltj =()=>{
 //  const { intl: { formatMessage } } = props;
    const intl =  useIntl();
    const formatMessage=intl.formatMessage;
    const { data, columns, loading, pageno, pagesize,queryData } = Store;
    const { dwDataSource, bgqxDataSource, dakDataSource } = SearchStore;
    const { userinfo } = LoginStore;
    const field = Field.useField();
    const Option = Select.Option;
    const TreeNode = TreeSelect.Node;


    const [isExpand, setExpand] = useState(false);
    const { RangePicker, MonthPicker, YearPicker } = DatePicker;




    const searchStyle = {
        marginTop:"15px",
        padding: '20px',

    };

// 本地store
// const DacltjStore = useLocalObservable(() => (
//     {

//        data = [],
//        record = {},
//        params = {},

//       async getUserOptionByDxtxtShow() {
//         const url="api/eps/control/main/params/getParamsDevOption?code=WFM003&yhid="+SysStore.getCurrentUser().id;
//         const response=await fetch.get(url);

//         if (response.status === 200) {

//           this.pdxtxtshow=response.data;
//         }else{
//           return;
//         }
//       },

//     }
//   ));



    const tjxsdataSource = [
        {
            value: "dwsx",
            label: "单位名称"
        }, {
            value: "daklbsx",
            label: "档案库类别"
        } ,{
            value: "daksx",
            label: "档案库名称"
        }, {
            value: "daklxsx",
            label: "档案库类型"
        }, {
            value: "tmztsx",
            label: "档案库状态"
        }, {
            value: "ndsx",
            label: "年度"
        }, {
            value: "bgqxsx",
            label: "保管期限"
        }, {
            value: "gdrmcsx",
            label: "归档人"
        }];


    const daklxDataSource=[{
        value: "01",
        label: "一文一件"
    }, {
        value: "02",
        label: "传统立卷"
    }, {
        value: "0201",
        label: "卷内"
    }];





    useEffect(() => {
        SearchStore.queryDw();
        SearchStore.queryBgqx();
        SearchStore.queryDak();
        Store.setColumns([{
            title: "条目数量",
            dataIndex: "tms",
            key:"tms",
            width: 200,
            lock: true,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.tms - b.tms,
        },
            {
                title: "原文数量",
                dataIndex: "fjs",
                key:"fjs",
                width: 200,
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.fjs - b.fjs,
            }, {
                title: "页数",
                dataIndex: 'ys',
                key:'ys',
                width: 200,
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.ys - b.ys,
            }]);
      }, []);








    const openNotification = (a,type) => { Notification.open({ title: a, type, }); };
    // begin ******************** 以下是事件响应
    /**
     * 查询条件按钮点击事件
     * @param {*} values
     * @param {*} errors
     */
    const doSearchAction = (() => {
        var df=true;
        let dw = Store.dw;
        let dakid = Store.dakid;
        let xslx = Store.xslx;
        let bgqx = Store.bgqx;
        let daklx = Store.daklx;
        let tjxs = Store.tjxs;
        let tmzt = Store.tmzt;

        let nd=Store.nd;
        let ks ="";
        let js="";
        if(nd) {
            ks = nd[0];
            js = nd[1];
            if (js === undefined) {
                js = "";
            }

            if (ks === undefined) {
                ks = "";
            }
            // if ((ks === "" && js !== "") || (ks !== "" && js === "")) {
            //     openNotification('年度需输入起止日期', 'warning');
            //     df = false;

            // }
            // if (Date.parse(ks) - Date.parse(js) > 0) {
            //     openNotification('起始年度要在结束年度之前', 'warning');
            //     df = false;
            // }
        }
        ;
        let values= {};
        values["dw"]=dw;
        values["dakid"]=dakid;
        values["xslx"]=xslx;
        values["bgqx"]=bgqx;
        values["daklx"]=daklx;
        values["tjxs"]=tjxs;
        values["tmzt"]=tmzt;
        if(nd) {
            values["ndksrq"] = ks;
            values["ndjsrq"] = js;
        }

        if(df) {
            Store.setParams(values);
        }
    });

    const [dwData, setDwData]= useState([]);

    function handleChange(value) {
        value= value;
        console.log(value);
    }


    /**
     * 分页器，切换页数
     * @param {*} current
     */
    const onPaginationChange = ((current) => {
        Store.setPageNo(current);
    });

    /**
     * 分页器，每页显示记录数发生变化
     * @param {*} pageSize
     */
    const onPageSizeChange = ((pageSize) => {
        Store.setPageSize(pageSize);
    });

    /**
     * 最后一列操作列绘制修改 删除按钮
     * @param {*} value
     * @param {*} index
     * @param {*} record
     */
    const renderTableCell = (value, index, record) => {
        return (
            <div>
                <a href="javascript:;" onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>
                <a href="javascript:;" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.id)}><FormattedMessage id="e9.btn.delete" /></a>
            </div>);
    };

    /**
     * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
     * @param {*} selectedRowKeys
     * @param {*} records
     */
    const onTableRowChange = (selectedRowKeys, records) => {
        Store.setSelectRows(selectedRowKeys, records);
    };

    const handledwChange=(value) =>{
        Store.setDw(value) ;
        SearchStore.dwChange(value);
        console.log(SearchStore.dakDataSource);
    }

    const handledakChange=(value) =>{
        this.setState({dakid: value});
        console.log(this.state.dwid, value);
    }





    // end ********************



    // begin *************以下是自定义函数区域


    const handleDakid = (dakid) => {
        Store.setDakid(dakid);
      };

      const handleXslx = (xslx) => {
          Store.setXslx(xslx);
            };

    const handleBgqx = (bgqx) => {
        Store.setBgqx(bgqx) ;
    };

    const handleDaklx = (daklx) => {
        Store.setDaklx(daklx);
    };

    const handleTjxs = (tjxs) => {
        Store.setTjxs(tjxs) ;
    }

    const handleTmzt = (tmzt) => {
        Store.setTmzt(tmzt)
    }

    const handleNd = (nd) => {
        Store.setNd(nd);
    }


    const toggle = () => {
        setExpand(!isExpand);
    }

    // end **************
    return (
        /*<div className="hall-regist">*/
        <Observer>{() =>(
            <div className="statistic-page">
                <div className="search-content">
                   {/* <Form inline style={{marginTop:"15px"}} >*/}
                        <div className="cell">
                            {/*<FormItem  className="label"  label="单位：" labelAlign="left">*/}
                            <span className="label">单位</span>
                            <Select  className="input" name="dw" mode="multiple"
                                     placeholder={formatMessage({ id: 'e9.datj.select' })}
                                     onChange={handledwChange}
                                     hasSelectAll  tagInline
                                     dataSource={SearchStore.dwDataSource}
                                     defaultValue={SysStore.getCurrentUser.dwid} >
                            </Select>
                            {/*</FormItem>*/}
                        </div>
                        <div className="cell">
                            <span className="label">档案库名称</span>
                            {/*<FormItem  className="label"  label="档案库名称：" labelAlign="left">*/}
                            <TreeSelect {...field.init('dakid', {})}  placeholder={formatMessage({ id: 'e9.datj.select' })}
                                        hasClear name="dakid" className="input"
                                        onChange={handleDakid}  value={Store.dakid}
                                        tagInline  treeCheckedStrategy="child"
                                        treeCheckable  dataSource={SearchStore.dakDataSource}   />
                            {/*</FormItem>*/}
                        </div>
                        <div className="cell" >
                            <span className="label">显示类型</span>
                            {/*<FormItem label="显示类型：" className="label" labelAlign="left">*/}
                                <Select tagInline  className="input"  defaultValue="tjlb" onChange={handleXslx}
                                         name="xslx" placeholder={formatMessage({ id: 'e9.datj.select' })}>
                                    <Option value="tjlb">统计列表</Option>
                                </Select>
                            {/*</FormItem>*/}
                        </div>
                        <div className="cell">
                            <span className="label">保管期限</span>
                            {/*<FormItem   label="保管期限：" labelAlign="left">*/}
                                <Select tagInline className="input" name="bgqx" mode="multiple"
                                         placeholder={formatMessage({ id: 'e9.datj.select' })}
                                         dataSource={SearchStore.bgqxDataSource} onChange={handleBgqx}
                                >
                                </Select>
                            {/*</FormItem>*/}
                        </div>
                        <div className="cell" className={isExpand ? "cell" : 'cell hidden'}>
                            <span className="label">档案库类型</span>
                           {/* <FormItem   label="档案库类型：" labelAlign="left">*/}
                                <Select tagInline className="input" name="daklx" mode="multiple"
                                         placeholder={formatMessage({ id: 'e9.datj.select' })}
                                         dataSource={daklxDataSource} onChange={handleDaklx}
                                >
                                </Select>
                           {/* </FormItem>*/}
                        </div>
                        <div className="cell" className={isExpand ? "cell" : 'cell hidden'}>
                            <span className="label">年度</span>
                           {/* <FormItem    >*/}

                            <RangePicker  onChange={handleNd}    className="input"  name="nd" type="year" placeholder={["起始年度","结束年度"]}></RangePicker>
                            {/*</FormItem>*/}
                        </div>
                        <div className="cell"  className={isExpand ? "cell" : 'cell hidden'}>
                            <span className="label">统计显示</span>
                            {/*<FormItem   label="统计显示：" labelAlign="left">*/}
                                <Select tagInline className="input" name="tjxs" mode="multiple"
                                         placeholder={formatMessage({ id: 'e9.datj.select' })}
                                         dataSource={tjxsdataSource} onChange={handleTjxs}
                                >
                                </Select>
                           {/* </FormItem>*/}
                        </div>
                        <div className="cell" className={isExpand ? "cell" : 'cell hidden'}>
                            <span className="label">档案库状态</span>
                            {/*<FormItem   label="档案库状态：" labelAlign="left" labelTextAlign="right">*/}
                                <Select tagInline  name="tmzt" className="input"  onChange={handleTmzt}
                                          placeholder={formatMessage({ id: 'e9.datj.select' })}  mode="multiple">
                                    <Option value="1">文件收集</Option>
                                    <Option value="2">文件整理</Option>
                                    <Option value="3">档案管理</Option>
                                </Select>
                            {/*</FormItem>*/}
                        </div>

                        <div className="collapse" style={{textAlign: 'center'}}>
                            {/*<FormItem label=" " labelAlign="left">*/}
                               {/* <Form.Reset >重置</Form.Reset>*/}
                                <Form.Submit  style={{marginRight: 20}} htmlType="submit"  type="primary" onClick={doSearchAction}>{formatMessage({ id: 'e9.btn.search' })}</Form.Submit>
                                <a type="link"  onClick={toggle}>{isExpand ? '收起' : '展开'}<UpOutlined className={isExpand ? 'up' : 'up rotate'}/></a>
                            {/*</FormItem>*/}
                        </div>
                  {/*  </Form>*/}

                </div>
       {/* </div>*/}
       <div className="btns">

            <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" />
            </Button>
            <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.preview" />
            </Button>
            <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" />
            </Button>
            <Button type="primary" style={{ marginRight: 10 }}><Icon type="download" /><FormattedMessage id="e9.btn.file.export.excel" />
            </Button>
            <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.help" />
            </Button>

        </div>
        {/*<div className="common-table">*/}
            <Table
                columns={columns}

                dataSource={Store.data}
                pagination={false}
                rowkey="id"

                bordered
                summary={pageData => {
                    let totaltms = 0;
                    let totalfjs = 0;
                    let totalys=0;

                    const colcount=Store.columns?.length-2;

                    pageData.forEach(({ tms, fjs,ys }) => {
                        totaltms += tms;
                        totalfjs += fjs;
                        totalys +=ys;
                    });

                    return (
                        <>
                            <Table.Summary.Row >

                                <Table.Summary.Cell  colSpan={colcount} className="textAlignRight">
                                    <Text >条目数量总计：{totaltms} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell>
                                    <Text>原文数量总计：{totalfjs}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell>
                                    <Text>页数总计：{totalys}</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>

                        </>
                    );
                }}
            />
        </div>)}</Observer>
    )


};

export default Dacltj;

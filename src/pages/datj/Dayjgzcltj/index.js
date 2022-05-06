import React, { useEffect, useState } from 'react';
import { Search, Tab, Input, Button, Form, DatePicker, Checkbox, Pagination, Icon, Grid,Tree,TreeSelect , Switch,Select, Field, Notification } from '@alifd/next';
import {  injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import ContainerTitle from '../../../components/ContainerTitle';
import LoginStore from '../../../stores/system/LoginStore';
import Store from "../../../stores/datj/Dayjgzcltj";
import E9Config from '../../../utils/e9config';
import SysStore from '../../../stores/system/SysStore';

import 'antd/dist/antd.css';
import '../style/index.less';
import '../style/search.less'
import SearchStore from "../../../stores/datj/SearchStore";
import { Table, Typography } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import {action} from "mobx";
import { useIntl, FormattedMessage } from 'umi';
import ExportJsonExcel from 'js-export-excel';



moment.locale('zh-cn');

const { Row, Col } = Grid;

const FormItem = Form.Item;
const { Text } = Typography;

/**
 * @Author: Mr.Wang
 * @Date: 2019/9/16 15:45
 * @Version: 9.0
 * @Content:
 *    2019/12/10 王祥
 *    修改：
 *      1.状态组件由IceStore改成mobx
 *    2019/9/16 王祥
 *      新增代码
 */
const Dayjgzcltj = observer(props => {
  //  const { intl: { formatMessage } } = props;
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
    const { data, columns, loading, pageno, pagesize,queryData } = Store;
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

    const tjxsdataSource = [
        {
            value: "dwsx",
            label: "单位名称"
        }, {
            value: "daksx",
            label: "档案库名称"
        }, {
            value: "daklxsx",
            label: "档案库类型"
        }, {
            value: "daklbsx",
            label: "档案库类别"
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
            label: "人员名称"
        }];



    const daklxDataSource=[{
        value: "0",
        label: "全部"
    },{
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
        SearchStore.queryDw();
        SearchStore.queryBgqx();
        SearchStore.queryDak();
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
        ;

        let dw = Store.dw;
        let dakid = Store.dakid;
        let daklx = Store.daklx;
        let daklb = Store.daklb;
        let bgqx = Store.bgqx;
        let tmzt = Store.tmzt;
        let xslx = Store.xslx;
        let gdrmc = Store.gdrmc;
        let tjxs = Store.tjxs;
        let nd=Store.nd;
        let ks ="";
        let js="";
        if(nd) {
            ks = nd[0];
            js = nd[1];

            if (js == undefined) {
                js = "";
            }

            if (ks == undefined) {
                ks = "";
            }
            if ((ks == "" && js != "") || (ks != "" && js == "")) {
                openNotification('利用日期需输入起止日期', 'warning');
                df = false;

            }
            if (Date.parse(ks) - Date.parse(js) > 0) {
                openNotification('起始日期要在结束日期之前!', 'warning');
                df = false;
            }
        }
        ;
        let values= {};
        values["dw"]=dw;
        values["dakid"]=dakid;
        values["daklx"]=daklx;
        values["daklb"]=daklb;
        values["bgqx"]=bgqx;
        values["tmzt"]=tmzt;
        values["xslx"]=xslx;
        values["gdrmc"]=gdrmc;
        values["tjxs"]=tjxs;
        if(nd) {
            values["ndksrq"] = ks;
            values["ndjsrq"] = js;
        }
        if(df) {
            Store.setParams(values);
        }
    });


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
        Store.setDdakid(dakid);
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

    const handleDaklb = (daklb) => {
        Store.setDaklb(daklb);
    };

    const handleTjxs = (tjxs) => {
        Store.setTjxs(tjxs) ;
    };


    const handleGdrmc = (gdrmc) => {
        Store.setGdrmc(gdrmc)
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

    const downloadFileToExcel = (() => {
        const  getRepaymentPlanList  =data.results;  //获取数据源
        const getcolumnameList=Store.columnameList;
        
        let option = {};  //option代表的就是excel文件
        let dataTable = [];  //excel文件中的数据内容
        if (getRepaymentPlanList && getRepaymentPlanList.length > 0) {
            let ttms=0;
            let tfjs=0;
            let tys=0;
            for (let i in getRepaymentPlanList) {  //循环获取excel中每一行的数据
    
                ttms +=getRepaymentPlanList[i].tms;
                tfjs +=getRepaymentPlanList[i].fjs;
                tys +=getRepaymentPlanList[i].ys;
        }
       dataTable=Store.columnResult;
            let tobj = {
              
              '条目数量': '条目数量总计：'+ttms,
              '原文数量': '原文数量总计：'+tfjs,
              '页数': '页数总计：'+tys,
           }
           dataTable.push(tobj);  //设置excel中总计的数据源
        }
            option.fileName = '档案移交工作量统计';  //excel文件名称
            option.datas = [
                  {
                    sheetData: dataTable,  //excel文件中的数据源
                    sheetName: '档案移交工作量统计',  //excel文件中sheet页名称
                    sheetFilter:getcolumnameList,
                    sheetHeader:getcolumnameList,
                }
            ]
            let toExcel = new ExportJsonExcel(option);  //生成excel文件
            toExcel.saveExcel();  //下载excel文件
      });

    // end **************
    return (
            <div className="statistic-page">
                <div className="search-content">
                    <div className="cell">
                    <span className="label">单位</span>
                    <Select  className="input" name="dw" mode="multiple"
                             placeholder={formatMessage({ id: 'e9.datj.select' })}
                             onChange={handledwChange} tagInline
                             dataSource={SearchStore.dwDataSource}
                             defaultValue={SysStore.getCurrentUser().dwid}
                             hasSelectAll
                    >
                    </Select>
                </div>

                <div className="cell">
                    <span className="label">档案库名称</span>
                    <TreeSelect className="input" {...field.init('dakid', {})}  placeholder={formatMessage({ id: 'e9.datj.select' })}
                                hasClear name="dakid"  onChange={handleDakid}  value={Store.dakid}
                                treeCheckable  dataSource={SearchStore.dakDataSource}
                                tagInline  treeCheckedStrategy="child"
                    />
                </div>

                <div className="cell" >
                    <span className="label">档案库类型</span>
                    <Select tagInline className="input" name="daklx" mode="multiple"
                             placeholder={formatMessage({ id: 'e9.datj.select' })}
                             dataSource={daklxDataSource} onChange={handleDaklx}
                    >
                    </Select>
                </div>

                <div className="cell" >
                    <span className="label">档案库类别</span>
                    <Select tagInline className="input"name="daklb" mode="multiple"
                             placeholder={formatMessage({ id: 'e9.datj.select' })}
                             dataSource={SearchStore.daklbDataSource} onChange={handleDaklb} >
                    </Select>
                </div>
                <div className="cell" className={isExpand ? "cell" : 'cell hidden'}>
                    <span className="label">保管期限</span>
                    <Select tagInline className="input" name="bgqx" mode="multiple"
                             placeholder={formatMessage({ id: 'e9.datj.select' })}
                             dataSource={SearchStore.bgqxDataSource}
                             onChange={handleBgqx}
                    >
                    </Select>
                </div>
                <div className="cell" className={isExpand ? "cell" : 'cell hidden'}>
                    <span className="label">档案库状态</span>
                    <Select tagInline  name="tmzt" className="input" onChange={handleTmzt} placeholder={formatMessage({ id: 'e9.datj.select' })}  mode="multiple">
                        <Option value="0">全部</Option>
                        <Option value="1">文件收集</Option>
                        <Option value="2">文件整理</Option>
                        <Option value="3">档案管理</Option>
                    </Select>
                </div>
                <div className="cell" className={isExpand ? "cell" : 'cell hidden'}>
                    <span className="label">操作人员</span>
                    <Input name="gdrmc" className="input" placeholder="请输入操作人员姓名"/>
                </div>
                <div className="cell" className={isExpand ? "cell" : 'cell hidden'}>
                    <span className="label">显示类型</span>
                    <Select tagInline className="input" onChange={handleXslx} defaultValue="tjlb"  name="xslx" placeholder={formatMessage({ id: 'e9.datj.select' })}>
                        <Option value="tjlb">统计列表</Option>
                    </Select>
                </div>

                <div className="cell"  className={isExpand ? "cell" : 'cell hidden'}>
                    <span className="label">统计显示</span>

                    <Select tagInline className="input" name="tjxs" mode="multiple"
                             placeholder={formatMessage({ id: 'e9.datj.select' })}
                             dataSource={tjxsdataSource} onChange={handleTjxs}
                    >
                    </Select>
                </div>
                <div className="cell" className={isExpand ? "cell" : 'cell hidden'}>
                    <span className="label">年度</span>

                    <RangePicker  onChange={handleNd}    className="input"  name="nd" type="year" placeholder={["起始年度","结束年度"]}></RangePicker>
                </div>
                    <div className="collapse" style={{textAlign: 'center'}}>

                    <Form.Submit  style={{marginRight: 20}} htmlType="submit"  type="primary" onClick={doSearchAction}>{formatMessage({ id: 'e9.btn.search' })}</Form.Submit>
                    <a type="link"  onClick={toggle}>{isExpand ? '收起' : '展开'}<UpOutlined className={isExpand ? 'up' : 'up rotate'}/></a>
                </div>

                </div>

                <div className="btns">
                    {/* <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" />
                    </Button>
                    <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.preview" />
                    </Button>
                    <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" />
                    </Button> */}
                    <Button type="primary" style={{ marginRight: 10 }} onClick={downloadFileToExcel}><Icon type="download" /><FormattedMessage id="e9.btn.file.export.excel" />
                    </Button>
                    {/* <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.help" />
                    </Button> */}

                </div>
                    <Table
                        columns={columns}
                        dataSource={data.results}
                        pagination={false}
                        rowkey="id"
                        bordered
                        summary={pageData => {
                            let totaltms = 0;
                            let totalfjs = 0;
                            let totalys=0;

                            let colcount=columns.length-2;

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
                </div>
    );
});

export default Dayjgzcltj;

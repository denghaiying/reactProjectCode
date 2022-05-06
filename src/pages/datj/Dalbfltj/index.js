import React, { useEffect , useState} from 'react';
import { Search, Tab, Input, Button, Form, DatePicker, Checkbox, Pagination, Icon, Grid,Tree,TreeSelect , Switch,Select, Field, Notification } from '@alifd/next';
import {  injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import ContainerTitle from '../../../components/ContainerTitle';
import LoginStore from '../../../stores/system/LoginStore';
import Store from "../../../stores/datj/Dalbfltj";
import E9Config from '../../../utils/e9config';

import 'antd/dist/antd.css';
import '../style/index.less';
import '../style/search.less'
import SearchStore from "../../../stores/datj/SearchStore";
import { Table, Typography } from 'antd';
import SysStore from '../../../stores/system/SysStore';
import SearchService from "@/services/datj/SearchService";
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import {action} from "mobx";
import { useIntl, FormattedMessage } from 'umi';
import ExportJsonExcel from 'js-export-excel';


const { Row, Col } = Grid;

const FormItem = Form.Item;
const { Text } = Typography;


const Dalbfltj = observer(props => {
 //   const { intl: { formatMessage } } = props;
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
        },{
            value: "ndsx",
            label: "年度"
        },{
            value: "yssx",
            label: "页数"
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
        let tjxs = Store.tjxs;
        let tmzt = Store.tmzt;
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
                openNotification('年度需输入起止日期', 'warning');
                df = false;

            }
            if (Date.parse(ks) - Date.parse(js) > 0) {
                openNotification('起始年度要在结束年度之前', 'warning');
                df = false;
            }
        }

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


    function handleChange(value) {
        value= value.join();
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
            option.fileName = '分类统计';  //excel文件名称
            option.datas = [
                  {
                    sheetData: dataTable,  //excel文件中的数据源
                    sheetName: '分类统计',  //excel文件中sheet页名称
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
                        <Select className="input" name="dw" mode="multiple"
                                 placeholder={formatMessage({ id: 'e9.datj.select' })}
                                 onChange={handledwChange} tagInline
                                 defaultValue={SysStore.getCurrentUser().dwid}
                                 dataSource={SearchStore.dwDataSource}
                                 hasSelectAll
                        >
                        </Select>
                    </div>

                    <div className="cell">
                        <span className="label">档案库名称</span>
                        <TreeSelect {...field.init('dakid', {})}  placeholder={formatMessage({ id: 'e9.datj.select' })}
                                    hasClear name="dakid"  onChange={handleDakid}  value={Store.dakid}
                                    tagInline  treeCheckedStrategy="child"
                                    treeCheckable  dataSource={SearchStore.dakDataSource}   className="input"/>
                    </div>

                    <div className="cell" >
                        <span className="label">统计显示</span>
                        <Select  className="input" name="tjxs" mode="multiple"
                                 placeholder={formatMessage({ id: 'e9.datj.select' })}
                                 dataSource={tjxsdataSource} tagInline
                                 onChange={handleTjxs}
                        >
                        </Select>
                    </div>

                    <div className="cell" >
                        <span className="label">档案库状态</span>
                        <Select   name="tmzt" className="input" placeholder={formatMessage({ id: 'e9.datj.select' })}
                                  mode="multiple"  onChange={handleTmzt}   tagInline >
                            <Option value="1">文件收集</Option>
                            <Option value="2">文件整理</Option>
                            <Option value="3">档案管理</Option>
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

export default Dalbfltj;

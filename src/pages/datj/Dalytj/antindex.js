import React, { useEffect } from 'react';
import { Search, Tab,   Checkbox, Pagination, Icon, Grid,Tree,TreeSelect , Switch, Field, Notification } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';

import { observer } from 'mobx-react';
import LoginStore from '../../../stores/system/LoginStore';
import Store from "../../../stores/datj/DalytjStore";
import SysStore from '../../../stores/system/SysStore';

import 'antd/dist/antd.css';
import '../style/index.less';
import SearchStore from "../../../stores/datj/SearchStore";
import { Table, Typography, Form,DatePicker, Row, Col, Input, Button,Select } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

//const { Row, Col } = Grid;

/*const FormItem = Form.Item;*/
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
const Dalytj = observer(props => {
    const { intl: { formatMessage } } = props;
    const { data, columns, loading, pageno, pagesize,queryData } = Store;
    const { userinfo } = LoginStore;
    const field = Field.useField();
    //  const Option = Select.Option;
    const TreeNode = TreeSelect.Node;
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const { Option } = Select;


    const getFields = () => {
        const children = [];

        children.push(
            <Col span={8} key="dwid">
                <Form.Item name="dwid" label="单位" labelAlign={"right"}>
                    <Select placeholder={formatMessage({id: 'e9.datj.select'})}
                            name="dwid" mode="multiple"
                            onChange={handledwChange}
                            allowClear
                            dataSource={SearchStore.dwDataSource}
                            defaultValue={SysStore.currentUser.dwid}
                            hasSelectAll
                            style={{ width: '80%' }}
                    />
                </Form.Item>
            </Col>
        );
        children.push(
            <Col span={8} key="dakid">
                <Form.Item name="dakid" label="档案库名称：">
                    <TreeSelect {...field.init('dakid', {})} placeholder={formatMessage({id: 'e9.datj.select'})}
                                hasClear name="dakid" treeCheckable dataSource={SearchStore.dakDataSource} style={{ width: '80%' }}/>
                </Form.Item>
            </Col>
        );
        children.push(
            <Col span={8} key="rq">
                <Form.Item name="rq" label="利用日期：">
                    <DatePicker name="ksrq" placeholder="请输入起始日期"/> 至：<DatePicker name="jsrq" placeholder="请输入结束日期"/>
                </Form.Item>
            </Col>
        );
        children.push(
            <Col span={8} key="yhmc">
                <Form.Item name="yhmc" label="借阅人：">
                    <Input name="yhmc" placeholder="请输入借阅人姓名" style={{ width: '80%' }}/>
                </Form.Item>
            </Col>
        );
        children.push(
            <Col span={8} key="tjxs">
                <Form.Item name="tjxs" label="统计显示：">
                    <Select name="tjxs" mode="multiple"
                            placeholder={formatMessage({id: 'e9.datj.select'})}
                            dataSource={tjxsdataSource}
                            style={{ width: '80%' }}
                    >
                    </Select>
                </Form.Item>
            </Col>
        );
        children.push(
            <Col span={8} key="tjlb">
                <Form.Item name="tjlb" label="显示类型：">
                    <Select defaultValue="tjlb" style={{ width: '80%' }} name="xslx" placeholder={formatMessage({id: 'e9.datj.select'})}>
                        <Option value="tjlb">统计列表</Option>
                    </Select>
                </Form.Item>
            </Col>
        );


        return children;
    };





    const searchStyle = {
        marginTop:"15px",
        padding: '20px',

    };

    const tjxsdataSource = [
        {
            value: "dwsx",
            label: "单位名称"
        } ,{
            value: "daksx",
            label: "档案库名称"
        }, {
            value: "ndsx",
            label: "年度"
        }, {
            value: "monthsx",
            label: "月份"
        }, {
            value: "jyyhsx",
            label: "借阅人"
        },  {
            value: "czyhsx",
            label: "操作员"
        },{
            value: "daklxsx",
            label: "档案库类型"
        }, {
            value: "tmsx",
            label: "题名"
        }, {
            value: "bgqxsx",
            label: "保管期限"
        }, {
            value: "lymdsx",
            label: "利用目的"
        }, {
            value: "jylxsx",
            label: "借阅类型"
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
        Store.setColumns([{
            title: "利用人次",
            dataIndex: "rc",
            key: "rc",
            width: 200,
            lock: true,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.rc - b.rc,
        },
            {
                title: "利用卷次",
                dataIndex: "ajc",
                key: "ajc",
                width: 200,
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.ajc - b.ajc,
            }, {
                title: "利用件次",
                dataIndex: 'jc',
                key: 'jc',
                width: 200,
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.jc - b.jc,
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
    const doSearchAction = ((values) => {
        var df=true;
        if(values){
            ;
            var ks=values["ksrq"];
            var js=values["jsrq"];
            if(js==undefined){
                js="";
            }

            if(ks==undefined){
                ks="";
            }
            if ((ks == "" && js != "") || (ks != "" && js == "")) {
                openNotification('利用日期需输入起止日期', 'warning');
                df=false;

            }
            if (Date.parse(ks) - Date.parse(js) > 0) {
                openNotification('起始日期要在结束日期之前!', 'warning');
                df=false;
            }
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

        SearchStore.dwChange(value);
        console.log(SearchStore.dakDataSource);
    }

    const handledakChange=(value) =>{
        this.setState({dakid: value});
        console.log(this.state.dwid, value);
    }





    // end ********************



    // begin *************以下是自定义函数区域


    // end **************
    return (
        <div className="hall-regist">
            <div className="control">

                <Form   form={form}
                        name="advanced_search"
                        className="ant-advanced-search-form"
                        onFinish={doSearchAction} >
                    <Row gutter={24}>{getFields()}</Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                            <Button
                                style={{ margin: '0 8px' }}
                                onClick={() => {
                                    form.resetFields();
                                }}
                            >
                                Clear
                            </Button>

                        </Col>
                    </Row>
                </Form>

            </div>
            <div className="main-content">
                <div className="btns-control">


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
                <div className="table-container">
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

                            pageData.forEach(({ rc, ajc,jc }) => {
                                totaltms += rc;
                                totalfjs += ajc;
                                totalys +=jc;
                            });

                            return (
                                <>
                                    <Table.Summary.Row >

                                        <Table.Summary.Cell  colSpan={colcount} className="textAlignRight">
                                            <Text >利用人次总计：{totaltms} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell>
                                            <Text>利用卷次总计：{totalfjs}</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell>
                                            <Text>利用件次总计：{totalys}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>

                                </>
                            );
                        }}
                    />
                </div>
            </div>
        </div>

    );
});

export default injectIntl(Dalytj);
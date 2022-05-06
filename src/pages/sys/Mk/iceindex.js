import React, { useEffect, useState } from 'react';
import './index.less'
import {
    Select,
    Field,
    TreeSelect,
    Icon,
    Button,
    Dialog, Notification,Form
} from '@alifd/next';
import AdvancedSearch from '@/components/advancedSearch'
import Store from "../../../stores/system/MkStore";
import { observer } from 'mobx-react';
import 'antd/dist/antd.css';
import './editDailog.less'
import { Table, Typography ,Pagination,Tree, Switch,Input,Radio, Divider} from 'antd';
import {FormattedMessage, injectIntl} from "react-intl";
import LoginStore from "@/stores/system/LoginStore";

import { CarryOutOutlined, FormOutlined,AudioOutlined  } from '@ant-design/icons';


const { Option } = Select;
const { Search } = Input;

const Mk = observer(props => {
    // const { selectionType, setSelectionType } = useState('radio');
    const { intl: { formatMessage } } = props;
    const { data, columns,mkbh, loading, pageno, pagesize,queryData } = Store;
    const { userinfo } = LoginStore;
    const field = Field.useField();
    const Option = Select.Option;
    const TreeNode = TreeSelect.Node;
    const Search = Input.Search;
    const { TextArea } = Input;

    /*   constructor(props) {
           super(props)
           this.state = {
               searchResult: [],       // 左侧搜索结果
               drawVisible: false,
               selectedRowKeys: [],
               addModalVisible: false,
           }
       }*/

    useEffect(() => {
        Store.setColumns([
            /*            {
                        title: "序列",
                        dataIndex: "xl",
                        key:"xl",
                        width: 100,
                        lock: true,
                    },*/
            {
                title: "编号",
                dataIndex: "mkbh",
                key: "mkbh",
                width: 120,
                /*defaultSortOrder: 'descend',
                sorter: (a, b) => a.id - b.id,*/
            }, {
                title: "名称",
                dataIndex: 'mc',
                key: "mc",
                width: 120,
                /*  defaultSortOrder: 'descend',
                  sorter: (a, b) => a.mc - b.mc,*/
            },
            {
                title: "版本",
                dataIndex: "bb",
                key: "bb",
                width: 120,
                /*defaultSortOrder: 'descend',
                sorter: (a, b) => a.lx - b.lx,*/
            }, {
                title: "URL",
                dataIndex: 'baseurl',
                key: "baseurl",
                width: 120,
                /*defaultSortOrder: 'descend',
                sorter: (a, b) => a.url - b.url,*/
            }, {
                title: "停用",
                dataIndex: 'tymc',
                key: "tymc",
                width: 120,
                /* defaultSortOrder: 'descend',
                 sorter: (a, b) => a.bz - b.bz,*/
            }, {
                title: "停用日期",
                dataIndex: 'tyrq',
                key: "tyrq",
                width: 120,
                /* defaultSortOrder: 'descend',
                 sorter: (a, b) => a.bz - b.bz,*/
            }, {
                title: "维护人",
                dataIndex: 'whr',
                key: "whr",
                width: 120,
                /* defaultSortOrder: 'descend',
                 sorter: (a, b) => a.whr - b.whr,*/
            }, {
                title: "维护时间",
                dataIndex: 'whsj',
                key: "whsj",
                width: 120,
                /*defaultSortOrder: 'descend',
                sorter: (a, b) => a.whsj - b.whsj,*/
            }]);
        Store.queryForPage();
    }, []);

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


    const onChange = (e) => {
        const value = e.target.value;
        const expandedKeys = dataList.map((item) => {
            if (item.title.indexOf(value) > -1) {
                return getParentKey(item.title, this.state.gData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        Store.setSearchValue(value);

    };

    const onSelect = (selectedKeys, info) => {
        Store.mkbh = selectedKeys[0];
        Store.queryForPage();
    };


    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            Store.setSelectId(selectedRowKeys);
            Store.setSelectedRow(selectedRows[0]);
            ;
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    const onOpen  = () => {
        ;
        let sid = Store.selectid;
        if (sid) {
            Store.visible = true;
        }else{
            openNotification('请选择一条记录', 'warning');
        }
    };

    const onClose = () => {

        Store.visible = false

    };

    const onCloseDetail=() =>{
        Store.visible = false
    }

    const openNotification = (a,type) => { Notification.open({ title: a, type, }); };

    const ShowDetail = () => {
        let sid = Store.selectid;
        if (sid) {

            const dialog = Dialog.show({
                title: '详情',
                content: 'custom content custom content...',
                footer: (
                    <Button warning type="primary" onClick={() => dialog.hide()}>
                        Custom button
                    </Button>
                )
            });
        }else{
            openNotification('请选择一条记录', 'warning');
        }

    };

    /*
        <Pagination
            total={Store.total}
            showSizeChanger
            showQuickJumper
            showTotal={total => `Total ${total} items`}
        />
    */


    const changePage=(current) =>{

        const { dispatch } = this.props;
        const params = {
            pageNum: current,
            pageSize: this.state.pageSize,
        };
        dispatch({
            type: 'lutList/fetch',
            payload: params,
        })
    };


    function onShowSizeChange(current, pageSize) {
        console.log(current, pageSize);
        Store.setPageSize(pageSize);
    }
    const ptotals = Store.total;
    // 表格分页属性
    const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: () => `共${ptotals}条`,
        defaultPageSize: 20,
        defaultCurrent: 1,
        pageSize:pagesize,
        current: pageno,
        total: Store.total,
        onChange:onPaginationChange,
        onShowSizeChange:onShowSizeChange,
        //   onShowSizeChange: (current,pageSize) => this.changePageSize(pageSize,current),
        //  onChange: (current) => this.changePage(current),
    };

    return (
        <div className="my-schedule">
            <div className="banner">
                <div className="left">
                    <span className="banner-title"><img  alt=""/><span>模块</span></span>
                </div>
                <div>
                    <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" />
                    </Button>
                    <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.preview" />
                    </Button>
                    <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" />
                    </Button>
                    <Button type="primary" onClick={onOpen} style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.look" />
                    </Button>
                    <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.help" />
                    </Button>

                </div>
            </div>
            <div className="container">

                <div className="right">
                    <Table
                        rowSelection={{
                            type: "radio",
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={data}
                        pagination={ paginationProps }
                    />

                </div>
                <div className="editDailog-schedule">
                    <Dialog title={<span className="m-title">详情</span>}
                            visible={Store.visible}
                            className="scheduleModal"
                            footer={<Button  type="primary" onClick={onCloseDetail}>关  闭</Button>}
                            onClose={onCloseDetail}>
                        <Form labelCol={{ span: 5 }} className="schedule-form">
                            <Form.Item label="编号" name="mkbh" >
                                <Input defaultValue={Store.selectedRow.mkbh} disabled />
                            </Form.Item>
                            <Form.Item label="名称" name="mc" >
                                <Input defaultValue={Store.selectedRow.mc} disabled/>
                            </Form.Item>
                            <Form.Item label="版本" name="bb">
                                <Input defaultValue={Store.selectedRow.bb}  disabled/>
                            </Form.Item>
                            <Form.Item label="URL" name="url">
                                <Input defaultValue={Store.selectedRow.baseurl} disabled  />
                            </Form.Item>
                            <Form.Item label="停用" name="tymc">
                                <Input disabled defaultValue={Store.selectedRow.tymc}   format="YYYY-MM-DD HH:mm:ss"/>
                            </Form.Item>
                            <Form.Item label="停用日期" name="tyrq">
                                <Input disabled defaultValue={Store.selectedRow.tyrq}   format="YYYY-MM-DD"/>
                            </Form.Item>
                            <Form.Item label="维护人" name="whr">
                                <Input defaultValue={Store.selectedRow.whr} disabled />
                            </Form.Item>
                            <Form.Item label="维护时间" name="whsj">
                                <Input disabled defaultValue={Store.selectedRow.whsj}   format="YYYY-MM-DD HH:mm:ss"/>
                            </Form.Item>

                        </Form>
                    </Dialog>
                </div>
            </div>
        </div>
    );
});
export default injectIntl(Mk);
import React, { useEffect, useState } from 'react';
import './index.less'
import {
    Select,
    Field,
    TreeSelect,
    Icon,
    Button,
    Dialog, Notification,Form,Grid
} from '@alifd/next';
import AdvancedSearch from '@/components/advancedSearch'
import Store from "../../../stores/system/YhStore";
import { observer } from 'mobx-react';
import 'antd/dist/antd.css';
import EditDailog from './EditDailog';
import RoleDailog from './RoleDailog';
import{  Tooltip,
    Table,
    Typography,
    Pagination,
    Tree,
    Switch,
    Input,
    Radio,
    Divider,
    Space,
    Popconfirm,
    message,
    Modal,
    Tabs
} from 'antd';
import {FormattedMessage, injectIntl} from "react-intl";
import SysStore from '@/stores/system/SysStore';
import LoginStore from "@/stores/system/LoginStore";

import {DeleteOutlined, ExclamationCircleOutlined, CarryOutOutlined, FormOutlined,AudioOutlined  } from '@ant-design/icons';
import SearchStore from "@/stores/datj/SearchStore";
import moment from "moment";
import UpdatPwdDailog from "@/pages/sys/Yh/UpdatPwdDailog";



const { Option } = Select;
const { Search } = Input;
const { Row, Col } = Grid;
const FormItem = Form.Item;
const { TabPane } = Tabs;

const Yh = observer(props => {
   // const { selectionType, setSelectionType } = useState('radio');
    const { intl: { formatMessage } } = props;
    const { data, columns,mkbh, loading, pageno, pagesize,queryData } = Store;
    const { userinfo } = LoginStore;
    const field = Field.useField();
    const Option = Select.Option;
    const TreeNode = TreeSelect.Node;
    const Search = Input.Search;
    const { TextArea } = Input;


    useEffect(() => {
        Store.setColumns([
            {
                title: "单位",
                dataIndex: "dwmc",
                key: "dwmc",
                width: 120,
                ellipsis: {
                    showTitle: false,
                },
                render: address => (
                    <Tooltip placement="topLeft" title={address}>
                        {address}
                    </Tooltip>
                ),
                /*defaultSortOrder: 'descend',
                sorter: (a, b) => a.id - b.id,*/
            }, {
                title: "登录号",
                dataIndex: 'bh',
                key: "bh",
                width: 120,
                /*  defaultSortOrder: 'descend',
                  sorter: (a, b) => a.mc - b.mc,*/
            },
            {
                title: "用户名称",
                dataIndex: "yhmc",
                key: "yhmc",
                width: 120,
                /*defaultSortOrder: 'descend',
                sorter: (a, b) => a.lx - b.lx,*/
            }, {
                title: "性别",
                dataIndex: 'xbmc',
                key: "xbmc",
                width: 120,


            }, {
                title: "任职部门",
                dataIndex: 'orgmc',
                key: "orgmc",
                width: 120,
                /* defaultSortOrder: 'descend',
                 sorter: (a, b) => a.bz - b.bz,*/
            }, {
                title: "用户类型",
                dataIndex: 'lx',
                key: "lx",
                width: 120,
                render:function(value){
                    let lxlist=Store.lxDataSource;

                    let mc = lxlist.filter(ite => {

                        return ite.value === value
                    })
                    return (<>{mc[0]?.label}</>)
                },

            }, {
                title: "用户密级",
                dataIndex: "yhmj",
                key: "yhmj",
                width: 120,
                render:function(value){
                    let lxlist=Store.mjDataSource;

                    let mc = lxlist.filter(ite => {

                        return ite.value === value
                    })
                    return (<>{mc[0]?.label}</>)
                },
            }, {
                title: "岗位",
                dataIndex: 'gw',
                key: "gw",
                width: 120,
                render:function(value){
                    let lxlist=Store.gwDataSource;

                    let mc = lxlist.filter(ite => {

                        return ite.value === value
                    })
                    return (<>{mc[0]?.label}</>)
                },
            }, {
                title: "电子邮件",
                dataIndex: 'mail',
                key: "mail",
                width: 120,
                /* defaultSortOrder: 'descend',
                 sorter: (a, b) => a.bz - b.bz,*/
            }, {
                title: "QQ",
                dataIndex: 'qq',
                key: "qq",
                width: 120,
                /*  defaultSortOrder: 'descend',
                  sorter: (a, b) => a.mc - b.mc,*/
            },
            {
                title: "手机号码",
                dataIndex: "sjh",
                key: "sjh",
                width: 100,
                /*defaultSortOrder: 'descend',
                sorter: (a, b) => a.lx - b.lx,*/
            }, {
                title: "固定电话",
                dataIndex: 'dh',
                key: "dh",
                width: 100,
                /*defaultSortOrder: 'descend',
                sorter: (a, b) => a.url - b.url,*/
            }, {
                title: "部职别",
                dataIndex: 'bzb',
                key: "bzb",
                width: 120,
                /* defaultSortOrder: 'descend',
                 sorter: (a, b) => a.bz - b.bz,*/
            }, {
                title: "启用日期",
                dataIndex: 'qyrq',
                key: "qyrq",
                width: 180,
                format:"YYYY-MM-DD"
            }, {
                title: "停用",
                dataIndex: "tymc",
                key: "tymc",
                width: 80,
                /*defaultSortOrder: 'descend',
                sorter: (a, b) => a.lx - b.lx,*/
            }, {
                title: "停用日期",
                dataIndex: 'tyrq',
                key: "tyrq",
                width: 180,
                /*defaultSortOrder: 'descend',
                sorter: (a, b) => a.url - b.url,*/
            }, {
                title: "维护人",
                dataIndex: 'whr',
                key: "whr",
                width: 120,
                /* defaultSortOrder: 'descend',
                 sorter: (a, b) => a.whr - b.whr,*/
            },{
                title: "维护时间",
                dataIndex: 'whsj',
                key: "whsj",
                width: 180,
                /*defaultSortOrder: 'descend',
                sorter: (a, b) => a.whsj - b.whsj,*/
            },{
                title: '操作',
                key: 'action',
                fixed: 'right',
                width: 300,
                render: (text, record) => (

                    <Space size="middle">
                        <a href="javascript:;" onClick={() => onEditAction(record)}><Tooltip title='修改'><img src={require('../../../styles/assets/img/hall-regist/icon_dengji.png')} style={{width:20}}/></Tooltip></a>
                        <a href="javascript:;" onClick={() => onCopyAction(record)}><Tooltip title='复制'><img src={require('../../../styles/assets/img/hall-regist/icon_dengji.png')} style={{width:20}}/></Tooltip></a>
                        <Popconfirm
                            title='确定要删除该条数据么?'
                            icon= {<ExclamationCircleOutlined  />}
                            okType= 'danger'
                            onConfirm= {() => handleOk(record)}
                            onCancel= {handleCancel}
                            okText="删除"
                            cancelText="取消"
                        >
                            <a href="#" ><Tooltip title='删除'><img src={require('../../../styles/assets/img/hall-regist/icon_dengji.png')} style={{width:20}}/></Tooltip></a>
                        </Popconfirm>
                        <a href="javascript:;" onClick={() => onLookAction(record)}><Tooltip title='查看'><img src={require('../../../styles/assets/img/hall-regist/icon_dengji.png')} style={{width:20}}/></Tooltip></a>
                        <a href="javascript:;" onClick={() => onRoleAction(record)}><Tooltip title='角色'><img src={require('../../../styles/assets/img/hall-regist/icon_dengji.png')} style={{width:20}}/></Tooltip></a>
                        <Popconfirm
                            title='确定要解除此用户的锁定么?'
                            icon= {<ExclamationCircleOutlined  />}
                            okType= 'danger'
                            onConfirm= {() => handleUnLockOk(record)}
                            onCancel= {handleCancel}
                            okText="解锁"
                            cancelText="取消"
                        >
                            <a href="#" ><Tooltip title='解除锁定'><img src={require('../../../styles/assets/img/hall-regist/icon_dengji.png')} style={{width:20}}/></Tooltip></a>
                        </Popconfirm>
                        <a href="javascript:;" onClick={() => onUpdatPwdAction(record)}><Tooltip title='修改密码'><img src={require('../../../styles/assets/img/hall-regist/icon_dengji.png')} style={{width:20}}/></Tooltip></a>
                        <Popconfirm
                            title='确定要重置密码么?重置后的密码为888'
                            icon= {<ExclamationCircleOutlined  />}
                            okType= 'danger'
                            onConfirm= {() => handleRestPwdOk(record)}
                            onCancel= {handleCancel}
                            okText="重置"
                            cancelText="取消"
                        >
                            <a href="javascript:;" ><Tooltip title='密码重置'><img src={require('../../../styles/assets/img/hall-regist/icon_dengji.png')} style={{width:20}}/></Tooltip></a>
                    </Popconfirm>
                        </Space>
                ),
            },]);
        Store.queryDwTree();
        Store.queryYhLx();
        Store.queryGw();
        Store.queryYhMj();
        Store.queryYhZj();
        Store.queryOrg();
        Store.queryForPage();
    }, []);

    function confirm(e) {
        console.log(e);
        message.success('Click on Yes');
    }

    /**
     * 重置密码
     * @param record
     * @returns {Promise<void>}
     */
    const handleRestPwdOk = async (record) => {

        const res=  await Store.resepassword(record);
        if (res && res.status === 200) {
            //   openNotification('解除锁定成功', 'warning');
        }
    };

    /**
     * 点击角色按钮事件响应
     * @type {onLookAction}
     */
    const onRoleAction= ((record) => {

        Store.showRoleForm(record);
    });
    /**
     * 修改密码
     * @type {onUpdatPwdAction}
     */
    const onUpdatPwdAction=((record) => {

        Store.showUpdatePwdForm('changepassword',record);
    });

    /**
     * 删除
     * @param record
     * @returns {Promise<void>}
     */
    const handleOk = async (record) => {

        let id="";
        id=record.id;
        ;
        console.log("recorddelete:"+record.id);
        const res=  await Store.delete(id);
        if (res && res.status === 200) {
            openNotification('删除用户成功', 'warning');
        }else{
            openNotification('删除用户失败', 'warning');
        }
    };

    /**
     * 解除锁定
     * @param record
     * @returns {Promise<void>}
     */
    const handleUnLockOk = async (record) => {
        if (record.cwcs < 3) {
            openNotification('此用户没有锁定', 'warning');
            return;
        }
     //   const yh = {cwcs: 0, id: record.id};
        const res=  await Store.updateJc(record);
        if (res && res.status === 200) {
         //   openNotification('解除锁定成功', 'warning');
        }
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
    };

    /**
     * 查询条件按钮点击事件
     * @param {*} values
     * @param {*} errors
     */
    const doSearchAction = ((values) => {
            Store.setParams(values);
    });


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

   const loop = (data ) =>data.map((item) => {
       let {searchValue} = Store.searchValue;
       const index = item.title.indexOf(searchValue);
       const beforeStr = item.title.substr(0, index);
       const afterStr = item.title.substr(index + searchValue.length);
       const title = index > -1 ? (
           <span>
                {beforeStr}
               <span style={{color: '#f50'}}>{searchValue}</span>
               {afterStr}
                </span>
       ) : <span>{item.title}</span>;
       if (item.children) {
           return (
               <TreeNode key={item.key} title={title} dataRef={item}>
                   {this.loop(item.children)}
               </TreeNode>
           );
       }
       return <TreeNode dataRef={item} key={item.key} title={title}/>;
   });




    /*    const onSelect = (selectedKeys, info) => {
            ;
            Store.mkbh = value && value[0];
            Store.queryForPage();
        };*/


    const onSelect = (selectedKeys, info) => {
        Store.treeDwid = selectedKeys[0];
        ;
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
                title: '功能详情',
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

    /**
     * 点击新增按钮事件响应
     */
    const onAddAction = (() => {
        let dmc="";
        if(Store.dwid.dwid){
            dmc=Store.dwid.dwmc;
        }else {
            dmc=Store.dwid.mc;
        }
        const json = {dwmc: dmc,whrid: SysStore.currentUser.id, whr: SysStore.currentUser.yhmc, whsj: moment()};
        Store.showEditForm('add', json);
    });
    /**
     * 点击修改按钮事件响应
     */
    const onEditAction = ((record) => {

        /*let sid = Store.selectid;
        if (sid) {
            Store.setDwstatus(false);
            /!*const json = {dwmc: Store.dwid.mc, did:Store.dwid.id, whrid: SysStore.currentUser.id, whr: SysStore.currentUser.yhmc, whsj: moment()};*!/
           const json=Store.selectedRow;
            Store.showEditForm('edit', json);
        }else{
            openNotification('请选择一条记录', 'warning');
        }*/
        const json=record;
        Store.showEditForm('edit',record);
    });


    /**
     * 点击复制按钮事件响应
     */
    const onCopyAction = ((record) => {
       /* let sid = Store.selectid;
        if (sid) {
            Store.setDwstatus(false);
            let  ss=Store.selectedRow;
            ss.id="";
            const json=ss;
            Store.showEditForm('add', json);
        }else{
            openNotification('请选择一条记录', 'warning');
        }*/
        Store.showEditForm('copy',record);
    });


    /**
     * 点击删除按钮事件响应
     */
 /*   const onDeleteAction = ((rid) => {

            Store.setDwstatus(false);
            let  ss=Store.selectedRow;
            ss.id="";
            const json=ss;
            Store.showEditForm('add', json);
    });*/

    /**
     * 点击查看按钮事件响应
     * @type {onLookAction}
     */
    const onLookAction= ((record) => {

        Store.showEditForm('look',record);
    });

    return (
            <div className="my-schedule">
                <div className="banner">
                    <div className="left">
                        <span className="banner-title"><img  alt=""/><span>用户</span></span>
                    </div>
                    <div>

                            <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" />
                            </Button>

                            <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.preview" />
                            </Button>


                        <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" />
                        </Button>
                        <Button type="primary" onClick={onAddAction} style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.add" />
                        </Button>
                        {/*<Button type="primary" onClick={onEditAction} style={{ marginRight: 10 }}><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.edit" />
                        </Button>
                       <Button type="primary" onClick={onCopyAction} style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.copy" />
                        </Button>
                        <Button type="primary" onClick={onOpenDelete} style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.delete" />
                        </Button>
                        <Button type="primary" onClick={onOpenLook} style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.look" />
                        </Button>
                        <Button type="primary" onClick={onOpenRole} style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.role" />
                        </Button>
                        <Button type="primary" onClick={onOpenJcsd} style={{ marginRight: 10 }}><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.jcsd" />
                        </Button>
                        <Button type="primary" onClick={onOpenChangePassword} style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.changepassword" />
                        </Button>
                        <Button type="primary" onClick={onOpenResPassword} style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.resepassword" />
                        </Button>
                        <Button type="primary" onClick={onOpenYhpldr} style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.yhpldr" />
                        </Button>

                        <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.help" />
                        </Button>*/}


                    </div>
                </div>
                <div className="container">
                    <div className="left">

                        <div className="tab-content">
                            <div className="search-content">
{/*
                                <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
*/}
                                <Tree
                                    defaultExpandAll  treeData={Store.dwDataSource} showLine onSelect={onSelect}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="condition">
                            <Form inline style={{ marginTop: "15px" }} name="form">
                                <FormItem>
                                    <Input name="bh" style={{ width: 180 }} size="small" placeholder="登录号" />
                                </FormItem>
                                <FormItem>
                                    <Input name="yhmc" style={{ width: 180 }} size="small" placeholder="用户名称"  />
                                </FormItem>

                                <FormItem>
                                    <Input name="bmid" style={{ width: 180 }} size="small" placeholder="部门名称"  />
                                </FormItem>
                                <FormItem >
                                    <Select tagInline name="lx" style={{ width: 180 }}  placeholder="用户类型" hasClear  dataSource={Store.lxDataSource} />
                                </FormItem>
                                <FormItem>
                                    <Form.Submit type="primary" size="small" onClick={doSearchAction}>查询</Form.Submit>
                                </FormItem>
                            </Form>

                        </div>

                        <Table
                            rowSelection={{
                                type: "radio",
                                ...rowSelection,
                            }}
                            columns={columns}
                            dataSource={data}
                            pagination={ paginationProps }
                            scroll={{ x: 1300 }}/>
                    </div>
                    {/*<div className="editDailog-schedule">
                    <Dialog title={<span className="m-title">详情</span>}
                            visible={Store.visible}
                            className="scheduleModal"
                            footer={<Button  type="primary" onClick={onCloseDetail}>关  闭</Button>}
                            onClose={onCloseDetail}>
                        <Form labelCol={{ span: 5 }} className="schedule-form">
                            <Form.Item label="功能编号" name="id" >
                                <Input defaultValue={Store.selectedRow.id} disabled />
                            </Form.Item>
                            <Form.Item label="功能名称" name="mc" >
                                <Input defaultValue={Store.selectedRow.mc} disabled/>
                            </Form.Item>
                            <Form.Item label="类型" name="lx">
                                <Input defaultValue={Store.selectedRow.lxname}  disabled/>
                            </Form.Item>
                            <Form.Item label="URL" name="url">
                                <Input defaultValue={Store.selectedRow.url} disabled  />
                            </Form.Item>
                            <Form.Item label="维护人" name="whr">
                                <Input defaultValue={Store.selectedRow.whr} disabled />
                            </Form.Item>
                            <Form.Item label="维护时间" name="whsj">
                                <Input disabled defaultValue={Store.selectedRow.whsj}   format="YYYY-MM-DD HH:mm:ss"/>
                            </Form.Item>
                            <Form.Item label="备注" name="bz">
                                <TextArea disabled  defaultValue={Store.selectedRow.bz} />
                            </Form.Item>
                        </Form>
                    </Dialog>
                    </div>*/}
                </div>
                <EditDailog/>
                <RoleDailog/>
                <UpdatPwdDailog/>
               </div>
        );
});
export default injectIntl(Yh);
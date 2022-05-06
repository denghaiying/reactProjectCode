import { Input, Table, Tree, Tabs, message, Button, Divider  } from "antd";
import { observer } from "mobx-react";
import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { EpsTableStore } from ".";
import EpsAddButton from "../../../buttons/EpsAddButton";
import EpsDeleteButton from "../../../buttons/EpsDeleteButton";
import EpsEditButton from "../../../buttons/EpsEditButton";
import AdvancedSearch from './advancedSearch'

import './index.less'
import { LeftOutlined, RightOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Icon, Tab } from "@alifd/next";
import { EpsProps, EpsSource, TabData, TableColumn } from "@/eps/commons/declare";


const { Search } = Input;
const { TabPane } = Tabs;
const PerImgWidth = 42;         // 表格按钮列宽

const EpsPanel = observer(forwardRef((props: EpsProps, ref) => {

    console.log("EpsPanelprops"+props);

    const [treeSelectData, setTreeSelectData] = useState('')
    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const onTreeSelect = props.onTreeSelect

    const treeCheckAble = props.treeProp?.treeCheckAble || false;


    // 左上 tab
    const tabData = props.tabProps?.tabData || []
    const [tabCheckKey, setTabCheckKey] = useState('')

    // 左侧树选择后，设置选中值
    const onSelect  = async e => {
        onTreeSelect ? onTreeSelect(e && e[0]) : setTreeSelectData(e && e[0]);
    }

    // 左侧树伸缩
    const [isExpand, setIsExpand] = useState(true);

    // 左侧表格搜索框
    const [treeSearch, setTreeSearch] = useState(true)
    // 右侧表格搜索框
    const [tableSearch, setTableSearch] = useState(true);
    const [drawVisible, setDrawVisible] =useState(false);
    // 创建左侧树Store实例

    // 创建右侧表格Store实例
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(props.tableService))
    const [columns, setColumns] = useState<TableColumn[]>([])
    const [treeHeight, setTreeHeight] = useState(0)

    // 暴露tableStore
    useImperativeHandle(ref, () => ({
        getTableStore: () => tableStore

    }));

    // 表格相关配置
    const enableEdit = !props.tableProp?.disableEdit;
    const enableDelete = !props.tableProp?.disableDelete;
    const enableAdd = !props.tableProp?.disableAdd;
    /*const enableDetail = !props.tableProp?.disableDetail;
    const enableDesign = !props.tableProp?.disableDesign;
    const enableImport = !props.tableProp?.disableImport;
    const enableExport = !props.tableProp?.disableExport;*/




    // 表格选中行时，设置key值
    const [rowSelection, setRowSelection] = useState(props.tableProp?.rowSelection);
    // 表格选中行时， 设置行属性
    const [checkedRows, setCheckedRows] = useState<Array<any>>([]);
    let actionWidth = 0 + (enableEdit ? PerImgWidth : 0) + (enableDelete ? PerImgWidth : 0);


    // 右侧菜单按钮控制
    const menuProp = props.menuProp || undefined;
    if(rowSelection) {
        rowSelection['onChange'] =  (value, row ) => {setSelectedRowKeys(value); setCheckedRows(row)}
    }

    if (menuProp){
        // 使用menu，初始化 行选择数据
        if(!rowSelection) {
            setRowSelection({type: 'radio', onChange: (value, row) => {setSelectedRowKeys(value); setCheckedRows(row)} })
        }
    }

    // 自定义表单，用于替换默认表单
    const customForm = props.customForm || undefined;
    // 搜索表单，如有设置，则显示高级搜索
    const searchForm = props.searchForm;
    // 自定义功能按钮
    const customAction = props.customAction || undefined;
    // 自定义表格行按钮
    const customTableAction = props.customTableAction || undefined;
    if(customTableAction){
        const {props : {children}}= customTableAction('',{},0, tableStore)
        if(children){
            if (Object.prototype.toString.call(children) === '[object Object]') {
                actionWidth += PerImgWidth
            }
            if(Array.isArray(children)) {
                actionWidth += children.length * PerImgWidth
            }
        }
    }

    // 获取表格列
    const getTableColumn = (list: Array<EpsSource>) => {
        const columns: Array<any> = [{
            title: '序号',
            align: 'center',
            fixed: 'left',
            width: 50,
            render: (_, __, index: number) => index + (tableStore.page-1) * tableStore.size +1,
        }];
        if(list){
            for (let item of list) {
                item && columns.push(new TableColumn(item.code, item.title, item.align, item.render, item.width, item.ellipsis, item.fixed));
            }
        }
        if (enableDelete || enableEdit || actionWidth > 0) {
            columns.push({
                title: '操作',
                align: 'center',
                key: 'action',
                fixed: actionWidth > 0 ? 'right' : false,
                width: actionWidth === PerImgWidth ? 50: actionWidth,
               /* render: (text,record,index) => (
                    <>
                        {enableEdit && <EpsEditButton column={props.source} title={props.title.name} data={record} store={tableStore} customForm={customForm}/>}
                        {enableDelete && <EpsDeleteButton data={text} store={tableStore} />}
                        {customTableAction && customTableAction(text, record, index, tableStore)}
                    </>
                ),*/
            });
        }
        return columns;
    }

    const showTab = (tabData: Array<TabData>) => {
        if (!tabData || tabData.length === 0){
            return (<></>)
        }
        return (
            <Tabs defaultActiveKey={tabCheckKey} onChange={key => setTabCheckKey(key)}>
                {tabData.map(item =>
                    <TabPane tab={item.tab} key={item.key}></TabPane>
                )}
            </Tabs>
        )
    }


    let {tableList, loading, page, size, total} = tableStore

    const onPageSizeChange = (page, size) => {
        page != tableStore.page && (tableStore.page = page);
        size !== tableStore.size && (tableStore.size = size);

    }

    // 左侧树区域展开收缩
    const [showMenus, setShowMenus] = useState(false);
    const [addBtnArr, setAddBtnArr] = useState<Array<any>>([])
    const [editFlag, setEditFlag]= useState(false)
    // const tempArr: Array<string> = []
    // for(let i = 0; i < 48; i++ ) {
    //   tempArr.push(`批量导入${i+1}`)
    // }
    // const colorArr = ['#30B0D5', '#CFA32A', '#3F8EFF', '#1DA291', '#D1C61C', '#7A8EFC', '#3F8EFF', '#1DA291', '#30B0D5', '#7956EF', '#3F8EFF', '#8DDE04', '#3F8EFF',
    //                   '#1DA291', '#30B0D5', '#2C75DE', '#3F8EFF', '#1DA291', '#30B0D5', '#2C75DE', '#3CA2E3', '#1DA291', '#30B0D5', '#3F8EFF', '#2C75DE', '#94C343',
    //                   '#7956EF', '#3F8EFF', '#1DA291', '#94C343', '#FB9770', '#3F8EFF', '#8DDE04', '#1DA291', '#D1C61C', '#4BB4C3', '#1DA291', '#FB9770', '#259BAD',
    //                   '#1DA291', '#94C343', '#4B98E8', '#28A0B7', '#3F8EFF', '#30B0D5', '#3F8EFF', '#30B0D5', '#1DA291', '#7A8EFC', '#2C75DE', '#94C343', '#1DA291']


    const clickAdd = (item) => {      // 添加菜单
        let newAddArr: Array<any> = [...addBtnArr]
        if(newAddArr.includes(item)) {
            message.warning({type: 'warning', content: '请勿重复添加'})
            return
        } else {
            newAddArr.push(item)
            setAddBtnArr(newAddArr)
        }
    }

    const delBtn = (item) => {      // 删除菜单
        let newAddArr = [...addBtnArr]
        newAddArr.splice(newAddArr.findIndex(val => val === item), 1)
        setAddBtnArr(newAddArr)
    }


    useEffect(() => {
        tableStore.findByKey(treeSelectData, tableStore.page, tableStore.size, tableStore.params);
    }, [page, size])

    useEffect(() => {
        props.tabProps?.onTabChange(tabCheckKey);
    }, [tabCheckKey])

/*    const onTableSearch = (tableSearchValue) => {
        tableStore.findByKey(tableStore.key, 1, tableStore.size, {'key': tableSearchValue});
    }*/

    let _height = window.innerHeight - 314

    useEffect(() => {

        // 设置左侧tab
        if (tabData && tabData.length >0){
            setTabCheckKey(tabData[0].key)
        }

        let _flag = props.treeProp?.treeSearch === undefined ? true : props.treeProp?.treeSearch
        if(_flag){
            _height = _height - 20
        }
        // 设置左侧树高度
        setTreeHeight(_height)
        // 是否显示左侧树查询框
        setTreeSearch(props.treeProp?.treeSearch === undefined ? true : props.treeProp?.treeSearch)         //左侧树搜索框
        // 是否显示右侧表格查询框
        setTableSearch(props.tableProp?.tableSearch === undefined ? true : props.tableProp?.tableSearch)       //右侧树搜索框
        // 设置表格列
        setColumns(getTableColumn(props.source));

    }, [])


    useEffect(() => {
        setColumns(getTableColumn(props.source));
    }, [props.source])

    // 选中值变化时，重新渲染右侧表格
    useEffect(() => {
        if(page != 1){
            tableStore.page = 1
        }
        tableStore.findByKey(treeSelectData, tableStore.page, tableStore.size, tableStore.params)
    }, [treeSelectData])

    return(
        <>
            <div className="office-manage">
                {
                    showTab(tabData)
                }

                <div className='main-content'>
                    <div className="file-content">
                        {/* <OfficeChild showAdvance={() => setDrawVisible(true)}/> */}
                        <div className={showMenus ? 'office-child show-menus' : 'office-child'}>
                            <div className="condition">
                               {/* {
                                    searchForm && <><Button type="primary" dashed onClick={() => setDrawVisible(true)}>高级搜索</Button><Divider type="vertical" style={{ height: 36, borderColor: '#3F8EFF' }} dashed /></>
                                }
                                {   // 右侧表格搜索框
                                    tableSearch &&  <><Search placeholder="请输入搜索内容" style={{ width: 300, marginRight: 10 }} onSearch={(val) => onTableSearch(val)}/></>
                                }
                                {
                                    searchForm && <><Button type="dashed" onClick={() => setDrawVisible(true)}>高级搜索</Button><Divider type="vertical" style={{ height: 36, borderColor: '#3F8EFF' }} dashed /></>
                                }*/}

                                {enableAdd && <EpsAddButton column={props.source} title={props.title.name} service={props.tableService} store={tableStore} customForm={customForm}></EpsAddButton>}
                                { <EpsEditButton column={props.source} title={props.title.name} data={checkedRows} store={tableStore} customForm={customForm}/>}
                                {<EpsDeleteButton data={selectedRowKeys} store={tableStore} />}
                                {<EpsAddButton column={props.source} title={props.title.name} service={props.tableService} store={tableStore} customForm={customForm}></EpsAddButton>}
                                {<EpsAddButton column={props.source} title={props.title.name} service={props.tableService} store={tableStore} customForm={customForm}></EpsAddButton>}
                                {<EpsAddButton column={props.source} title={props.title.name} service={props.tableService} store={tableStore} customForm={customForm}></EpsAddButton>}
                                {<EpsAddButton column={props.source} title={props.title.name} service={props.tableService} store={tableStore} customForm={customForm}></EpsAddButton>}

                                {
                                    // 自定义功能按钮
                                    customAction && customAction(tableStore)
                                }
                                <Tab shape="wrapped" excessMode="slide" className="add-btn-tab">
                                    {
                                        addBtnArr.map((item, index) => (
                                            <Tab.Item
                                                title={
                                                    <div className="add-btn">
                                                        {/* <img src={require(`../../../../../styles/assets/img/${item.icon}.png`)}/> */}
                                                        {item.title}
                                                        {editFlag ? <Icon type="delete-filling" className="del-icon" onClick={() => delBtn(item)}/> : ''}
                                                    </div>
                                                }
                                                key={item.title} onClick={() => item.onClick(selectedRowKeys, tableStore, checkedRows)}>
                                                {item.title}
                                            </Tab.Item>
                                        ))
                                    }
                                </Tab>
                                {
                                    menuProp &&
                                    <div className="menu-right" style={{display: 'block'}} onClick={() => setShowMenus(true)}><UnorderedListOutlined className="more"/>菜单</div>
                                }
                            </div>
                            <div className="table-container">
                                <Table pagination={{
                                    showQuickJumper: true,
                                    showSizeChanger: true,
                                    defaultCurrent: page,
                                    defaultPageSize: size,
                                    pageSize:size,
                                    current: page,
                                    showTotal: (total, range) => `共 ${total} 条数据`,
                                    onChange: onPageSizeChange,
                                    total: total}} bordered={true} columns={columns} loading={loading} dataSource={tableList}  className="common-table"
                                       scroll={ tableStore.size>10 ? { y: _height,x: 1800 }: {x: 1800}}
                                       rowSelection={rowSelection}
                                />
                            </div>
                            <div className="menu-collapse">
                                <div className="group">
                                    {
                                        menuProp && menuProp.map((item, index) => (
                                            <>
                                                <li className="item" key={index} style={{backgroundColor: item.color}}>
                                                    <img style={{width: '28px'}}  src={require(`../../../../../styles/assets/img/${item.icon}.png`)} onClick={() => item.onClick(selectedRowKeys, tableStore, checkedRows)}/>
                                                    <span>{item.title}</span>
                                                    <div className="shadow"></div>
                                                    {editFlag ? <img src={require('../../../../../styles/assets/img/icon_add_border.png')} className="add-icon" onClick={() => clickAdd(item)}/> : ''}
                                                </li>
                                            </>
                                        ))
                                    }
                                </div>
                                <div className="btns">
                                    <Button type="primary" onClick={() => setEditFlag(true)}>编 辑</Button>
                                    <Button style={{margin: '0 20px'}} onClick={() => setEditFlag(false)}>重 置</Button>
                                    <Button onClick={() => {setShowMenus(false), setEditFlag(false)}}>取 消</Button>
                                </div>
                            </div>
                            <span className="cover"></span>
                        </div>
                    </div>
                </div>
                <AdvancedSearch drawVisible={drawVisible} changeVisible={() => setDrawVisible(false)} searchForm={searchForm} tableStore={tableStore}></AdvancedSearch>
            </div>
        </>
    );
}))

export default EpsPanel;

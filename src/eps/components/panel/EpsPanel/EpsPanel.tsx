import EpsFormType from "@/eps/commons/EpsFormType";
import {ITableService, ITreeService} from "@/eps/commons/panel";
import { DatePicker, Input, Table, Select, Tree  } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { useEffect } from "react";
import { EpsTableStore } from ".";
import EpsAddButton from "../../buttons/EpsAddButton";
import EpsDeleteButton from "../../buttons/EpsDeleteButton";
import EpsEditButton from "../../buttons/EpsEditButton";
import EpsTreeStore from "./EpsTreeStore";
import EmptyPng from '@/styles/assets/img/icon_empty.png'

const { Search } = Input;
const { Option } = Select;
const PerImgWidth = 42;         // 表格按钮列宽


import './index.less'

export interface EpsProps {
    treeService: ITreeService;       // 树 service
    tableService: ITableService;     // 表格 service
    source: EpsSource[];            // 数据解构
    treeSearch?: boolean;           // 左侧树搜索框
    tableProp?: ITable;             // 表格属性配置
    title: ITitle;                  // 组件名称
    customForm?: Function;           // 自定义表单
    customAction?: (store: EpsTableStore) => any   //自定义功能按钮
    customTableAction: (text: string, record, index: number, store: EpsTableStore) => any  // 自定义表格功能按钮
    doctbl: String;
    wktbl: String;
    grptbl: String;
    tmid: String;
}

export interface ITitle {
    name: string;                   // 组件名称
    icon?: string;                  // 组件图标
}


export interface EpsSource {
    title: string;                  // 元数据名称
    code?: string;                  // 元数据属性，对应待操作数据的属性
    align?: string;                 // 表格对齐方式
    view?: boolean;                 // 详情时是否在自动表单中显示(未实现)
    edit?: boolean;                 // 编辑时是否在自动表单中显示(未实现)
    render?: Function;              // 表格列表中自定义渲染
    width?: string | number;        // 表格宽度
    formType: EpsFormType;          // 自动表单对应类型
}


export interface ITable {
    size?: SizeType;                // 表格尺寸
    onRowClick?: Function;
    onRowMouseEnter?: Function;
    onRowMouseLeave?: Function;
    onSort?: Function;
    onFilter?: Function;
    onResizeChange?: Function;      // 尺寸发生变化时事件
    rowProps?: Function;            // 行属性
    cellProps?: Function;           // 列属性
    hasBorder?: Boolean;            // 是否加粗
    hasHeader?: Boolean;            // 是否启用表头
    disableEdit?: Boolean;          // 是否禁用编辑
    disableDelete?: Boolean;        // 是否禁用删除
    disableIndex?: Boolean;         // 是否使用索引列
    disableAdd?: Boolean;         // 是否使用索引列
    tableSearch?: boolean;          // 右侧表格搜索框
    actions?: Function;             // 自定义表格
  }

// 表格列
class TableColumn {
    constructor(dataIndex: string = '', title: string, align: string = 'left', render: Function = (text?, record?, index?) => text, width: number| string| undefined){
        this.dataIndex = dataIndex;
        this.title = title;
        this.align = align;
        this.width = width;
        this.render = render;
        this.key = dataIndex
    }

    dataIndex?: string;
    title: string;
    align: string;
    render: Function;
    key: string;
    width: number| string| undefined;
}

const EpsPanel = observer((props: EpsProps) => {

    const [treeSelectData, setTreeSelectData] = useState('')

    // 左侧树选择后，设置选中值
    const onSelect  = async e => {
        setTreeSelectData(e && e[0]);
    }


    // 左侧表格搜索框
    const [treeSearch, setTreeSearch] = useState(true)
    // 右侧表格搜索框
    const [tableSearch, setTableSearch] = useState(true);
    // 创建左侧树Store实例
    const [treeStore] = useState<EpsTreeStore>(new EpsTreeStore(props.treeService))
    // 创建右侧表格Store实例
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(props.tableService))
    const [columns, setColumns] = useState<TableColumn[]>([])
    const [treeHeight, setTreeHeight] = useState(0)

    // 表格相关配置
    const enableEdit = !props.tableProp?.disableEdit;
    const enableDelete = !props.tableProp?.disableDelete;
    const enableAdd = !props.tableProp?.disableAdd;
    let actionWidth = 0 + (enableEdit ? PerImgWidth : 0) + (enableDelete ? PerImgWidth : 0);

    // 自定义表单，用于替换默认表单
    const customForm = props.customForm || undefined;
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
            width: 60,
            render: (_, __, index: number) => index + (tableStore.page-1) * tableStore.size +1,
        }];
        if(list){
            for (let item of list) {
               item && columns.push(new TableColumn(item.code, item.title, item.align, item.render, item.width));
            }
        }
        if (enableDelete || enableEdit || actionWidth > 0) {
            columns.push({
              title: '操作',
              key: 'action',
              fixed: actionWidth > 0 ? 'right' : false,
              width: actionWidth,
              render: (text,record,index) => (
                <>
                  {enableEdit && <EpsEditButton column={props.source} title={props.title.name} data={record} store={tableStore} customForm={customForm}/>}
                  {enableDelete && <EpsDeleteButton data={text} store={tableStore} />}
                  {customTableAction &&  customTableAction(text, record, index, tableStore)}
                </>
              ),
            });
          }
        return columns;
    }

    let {treeList} = treeStore;
    let {tableList, loading, page, size, total} = tableStore

    const onPageSizeChange = (page, size) => {
        page != tableStore.page && (tableStore.page = page);
        size !== tableStore.size && (tableStore.size = size);

    }

    useEffect(() => {
        tableStore.findByKey(treeSelectData);
    }, [page, size])

    useEffect(() => {

        let _height = window.innerHeight - 314
        let _flag = props.treeSearch === undefined ? true : props.treeSearch
        if(_flag){
            _height = _height - 20
        }
        // 设置左侧树高度
        setTreeHeight(_height)
        // 是否显示左侧树查询框
        setTreeSearch(props.treeSearch === undefined ? true : props.treeSearch)         //左侧树搜索框
        // 是否显示右侧表格查询框
        setTableSearch(props.tableProp?.tableSearch === undefined ? true : props.tableProp?.tableSearch)       //右侧树搜索框
        // 设置表格列
        setColumns(getTableColumn(props.source));
        treeStore.findTree({});
    }, [])

    // 选中值变化时，重新渲染右侧表格
    useEffect(() => {

        if(page != 1){
            tableStore.page = 1
        }
        tableStore.findByKey(treeSelectData)
    }, [treeSelectData])

    return(
        <div className="my-schedule">
            <div className="banner">
                <div className="left">
                    <span className="banner-title">
                        {/* 页面图标 */}
                        {/* <img src={require('../../../../styles/assets/img/icon_rili.png')} alt=""/> */}
                        <span>{props.title.name}</span>
                    </span>
                </div>
                <div>
                    {customAction && customAction(tableStore)}
                    {enableAdd && <EpsAddButton column={props.source} title={props.title.name} service={props.tableService} store={tableStore} customForm={customForm}></EpsAddButton>}
                </div>
            </div>
            <div className="container">
            <div className="left">

                <div className="tab-content">
                    {
                        // 左侧树搜索框
                        treeSearch &&  <Search placeholder="搜索" type="normal"  style={{ width: '100%', marginBottom: 30 }} onSearch={treeStore.findTree}/>
                    }
                    <div className="search-content">
                        {
                        !treeList.length ? <div className="empty"><img src={EmptyPng}/><p>暂无数据</p></div> : <div>
                            <Tree
                                checkable
                                height={treeHeight}
                                onSelect={onSelect}
                                treeData={treeList}
                            />
                        </div>
                        }
                    </div>
                </div>
            </div>
            <div className="right">
                {   // 右侧表格搜索框
                    tableSearch &&
                    <div className="condition">
                        <Select style={{ width: '10vw', marginRight: 10 }} placeholder="日程类型">
                            <Option value="1">日程类型1</Option>
                            <Option value="2">日程类型2</Option>
                        </Select>
                        <DatePicker style={{ width: '10vw', marginRight: 10 }}/>
                        <Search placeholder="请输入搜索内容" style={{ width: '10vw', marginRight: 10 }} />
                    </div>
                }
                <Table pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                    defaultCurrent: page,
                    defaultPageSize: size,
                    pageSize:size,
                    current: page,
                    showTotal: (total, range) => `共 ${total} 条数据`,
                    onChange: onPageSizeChange,
                    total: total}} bordered={true} columns={columns} loading={loading} dataSource={tableList}  className="common-table" />
            </div>
            </div>
            {/* <AdvancedSearch drawVisible={this.state.drawVisible} changeVisible={() => {this.setState({drawVisible: false})}}/> */}
            {/* <AddSchedule addModalVisible={this.state.addModalVisible} closeModal={() => {this.setState({addModalVisible: false})}} /> */}
      </div>
    );
})

export default EpsPanel;

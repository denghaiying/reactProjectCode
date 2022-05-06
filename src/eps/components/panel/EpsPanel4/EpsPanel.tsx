/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-restricted-syntax */
import { Input, Table, Tabs, message, Button, Modal, Form, Spin  } from "antd";
import { observer } from "mobx-react";
import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { EpsTableStore } from ".";
import EpsAddButton from "../../buttons/EpsAddButton";
import EpsDeleteButton from "../../buttons/EpsDeleteButton";
import EpsEditButton from "../../buttons/EpsEditButton";
import AdvancedSearch from './advancedSearch'

import './index.less'
import { UnorderedListOutlined, AlertOutlined, CloseCircleFilled } from '@ant-design/icons';
import { EpsTableProps, EpsSource, TableColumn } from "@/eps/commons/declare";
import EpsForm from "@/eps/inner/form/EpsForm";
import EpsFormType from "@/eps/commons/EpsFormType";
import moment from "moment";
import EpsCopyButton from "../../buttons/EpsCopyButton";
import EpsBatchDeleteButton from "../../buttons/EpsBatchDeleteButton";
import { runInAction } from "mobx";


const { Search } = Input;
const { TabPane } = Tabs;
const PerImgWidth = 32;         // 表格按钮列宽

const EpsPanel = observer(forwardRef((props: EpsTableProps, ref) => {

    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    // 左上 tab
    const tabData = props.tabProps?.tabData || []
    const [tabCheckKey, setTabCheckKey] = useState('')

    // 右侧表格搜索框
    const [tableSearch, setTableSearch] = useState(true);
    const [drawVisible, setDrawVisible] =useState(false);
    // 创建右侧表格Store实例
    const [tableStore] = useState<EpsTableStore>(new EpsTableStore(props.tableService))


    const [columns, setColumns] = useState<TableColumn[]>([])
    // 暴露tableStore
    useImperativeHandle(ref, () => ({
      getTableStore: () => tableStore,
      clearTableRowClick: () => {setSelectedRowKeys([]); setCheckedRows([])},
      getCheckedRows: () => checkedRows
    }));

    // 表格相关配置
    const enableEdit = !props.tableProp?.disableEdit;
    const enableDelete = !props.tableProp?.disableDelete;
    const enableAdd = !props.tableProp?.disableAdd;
    const enableCopy = !props.tableProp?.disableCopy;
    // 表格选中行时，设置key值
    const [rowSelection, setRowSelection] = useState(props.tableProp?.rowSelection);
    // 表格选中行时， 设置行属性
    const [checkedRows, setCheckedRows] = useState<any>([]);
    let actionWidth = 0 + (enableEdit ? PerImgWidth : 0) + (enableDelete ? PerImgWidth : 0) + (enableCopy ? PerImgWidth : 0);


    useEffect(() => {
      if(props.setCheckRows){
        props.setCheckRows(checkedRows)
      }
    }, [checkedRows])
     // 详情页Modal控制
     const [viewVisible, setViewVisible] = useState(false)
     const [viewRecord, setViewRecord] = useState({})
     const [form] = Form.useForm()

    // 右侧菜单按钮控制
    const menuProp = props.menuProp || [];

    if(rowSelection) {
      rowSelection['onChange'] =  (value, row ) => {setSelectedRowKeys(value); setCheckedRows(row)}
      rowSelection['selections'] = [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
          ]
      rowSelection['selectedRowKeys'] = selectedRowKeys
    }

    if (menuProp.length > 0){
      // 使用menu，初始化 行选择数据
      if(!rowSelection) {
        setRowSelection({
          selections:[
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
          ],
          type: 'radio',
          onChange: (value, row) => {setSelectedRowKeys(value); setCheckedRows(row)},
          selectedRowKeys: selectedRowKeys
        })
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
      const cta= customTableAction('',{},0, tableStore, checkedRows)
      if(cta.props?.children){
        if (Object.prototype.toString.call(cta.props?.children) === '[object Object]') {
            actionWidth += PerImgWidth
        }
        if(Array.isArray(cta.props?.children)) {
            actionWidth += cta.props?.children.length * PerImgWidth
        }
      }else{
        actionWidth += cta.length * PerImgWidth
      }
    }



    // 获取表格列
    const getTableColumn = (list: Array<EpsSource>) => {
      const columns: Array<any> = [];
      if(!props.tableProp?.disableIndex){
          columns.push({
              title: '序号',
              align: 'center',
              fixed: 'left',
              width: 60,
              render: (_, __, index: number) => index + (tableStore.page-1) * tableStore.size +1,
          })
      }
        if(list){
            for (const item of list.filter(i => !i.tableHidden)) {
               item && columns.push(new TableColumn(item.code, item.title, item.align, item.render, item.width, item.ellipsis, item.fixed));
            }
        }
        if (enableDelete || enableEdit || actionWidth > 0) {
            columns.push({
              title: '操作',
              align: 'center',
              key: 'action',
              // fixed: actionWidth > 0 ? 'right' : false,
              fixed: 'right',
              width: actionWidth === PerImgWidth ? 50: actionWidth ,
              render: (text,record,index) => {
                const rcd  = Object.assign({}, props.initParams || {}, record)
                return (
                <>
                  {customTableAction && customTableAction(text, rcd, index, tableStore, checkedRows)}
                  {enableCopy && <EpsCopyButton  width={props.formWidth} column={props.source} key={`common-copy-${index}`} title={props.title.name} data={rcd} store={tableStore} customForm={customForm}/>}
                  {enableEdit && <EpsEditButton key={props.title.name + '_eps_edit_button_' + index} width={props.formWidth} column={props.source} title={props.title.name} data={rcd} store={tableStore} customForm={customForm}  onClick={props.tableProp?.onEditClick} labelColSpan={props.tableProp?.labelColSpan}/>}
                  {enableDelete && <EpsDeleteButton key={props.title.name + '_eps_delete_button_' + index} data={text} store={tableStore}  deleteMessage={props.tableProp?.deleteMessage} onClick={props.tableProp?.onDeleteClick}/>}
                </>
              )},
            });
          }
        return columns;
    }

    let {tableList, loading, page, size, total, key} = tableStore

    const onPageSizeChange = (page, size) => {
      runInAction(() => {
        page != tableStore.page && (tableStore.page = page);
        size !== tableStore.size && (tableStore.size = size);
      })
    }

    // 左侧树区域展开收缩
    const [showMenus, setShowMenus] = useState(false);
    const [addBtnArr, setAddBtnArr] = useState<Array<any>>([])
    const [editFlag, setEditFlag]= useState(false)

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
   //初始化按钮栏目按钮
    useEffect(() => {
      let newAddArr = [...menuProp]
      setAddBtnArr(newAddArr.filter(item=>item.toolbarShow))
    }, [props.menuProp?.length])

    useEffect(() => {
      tableStore.params = Object.assign({}, props.initParams, tableStore.params)
    }, [props.initParams])

    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      props.initKey && (tableStore.key = props.initKey)
    }, [props.initKey])

    useEffect(() => {
        tableStore.findByKey(tableStore.key, tableStore.page, tableStore.size, tableStore.params);
    }, [key, page, size])

    useEffect(() => {
      props.tabProps?.onTabChange(tabCheckKey);
    }, [tabCheckKey])



    const onTableSearch = (tableSearchValue) => {
      const code = props.tableProp?.searchCode || 'key'
      let params = Object.assign({}, props.initParams || {})
      params[code] = tableSearchValue
      tableStore.findByKey(tableStore.key, 1, tableStore.size, params);
    }

    let _height = window.innerHeight - 314

    useEffect(() => {

      let _flag = props.treeProp?.treeSearch === undefined ? true : props.treeProp?.treeSearch
      if(_flag){
          _height = _height - 20
      }        //左侧树搜索框
      // 是否显示右侧表格查询框
      setTableSearch(props.tableProp?.tableSearch === undefined ? true : props.tableProp?.tableSearch)       //右侧树搜索框
      // 设置表格列
      // setColumns(getTableColumn(props.source));
    }, [])


    useEffect(() => {
      // 设置表格列
      setColumns(getTableColumn(props.source));
    }, [props.source])

    return(
      <div className="eps-table">
        <div className={props.title.name ? "title": ""}>{props.title.name}</div>
          <div className={'content hideExpand'}>
            <div className={showMenus ? 'right show-menus' : 'right'}>
              <div className={"control"} style={{marginLeft: menuProp.length > 0 ? '70px' : 'auto'}}>

              {   // 右侧表格搜索框
                    tableSearch &&  <><Search placeholder="请输入搜索内容" style={{ width: 300, marginRight: 10 }} onSearch={(val) => onTableSearch(val)}/></>
                  }
                  {
                    searchForm && <><Button type="primary" icon={<AlertOutlined />} style={{marginRight: 10, fontSize: 12}} onClick={() => setDrawVisible(true)}>高级搜索</Button></>
                  }
                  {enableAdd && <EpsAddButton width={props.formWidth} column={props.source} title={props.title.name} service={props.tableService} store={tableStore} customForm={customForm}  onClick={props.tableProp?.onAddClick} labelColSpan={props.tableProp?.labelColSpan} disabled={props.addReadonly}></EpsAddButton>}
                  {
                    (checkedRows.length > 0 && props.tableProp?.rowSelection?.type === "checkbox" && props.tableProp?.enableBatchDelete ) && <EpsBatchDeleteButton store={tableStore} data={checkedRows}/>
                  }
                  {
                    // 自定义功能按钮
                    customAction && customAction(tableStore, checkedRows)
                  }
                {
                  menuProp.length > 0 && (<><span className="menu" onClick={() => setShowMenus(true)}><UnorderedListOutlined style={{marginRight: 5, fontSize: 16}}/>菜单</span>

                 <Tabs defaultActiveKey={addBtnArr[0]} size="small" type="card">
                {
                  addBtnArr.map((item, index) => (
                    <TabPane
                      tab={
                        <div onClick={() => item.onClick(selectedRowKeys, tableStore, checkedRows)} className="add-btn">
                          <img src={import('../../../../styles/assets/img/icon_import_multi.png')}/>{item.title}
                          {editFlag ? <CloseCircleFilled className="del-icon" onClick={() => delBtn(item)}/> : ''}
                        </div>
                      }
                      key={index} >
                      {item.title}
                    </TabPane>
                  ))
                }
              </Tabs></>)
              }
              </div>
              {
                ( rowSelection || menuProp.length > 0 ) ?
                <Table columns={columns} dataSource={tableList} bordered scroll={{ x: 'max-content' }} pagination={{
                  showQuickJumper: true,
                  showSizeChanger: true,
                  defaultCurrent: page,
                  defaultPageSize: size,
                  pageSize:size,
                  current: page,
                  showTotal: (total, range) => `共 ${total} 条数据`,
                  onChange: onPageSizeChange,
                  total: total}}
                  loading={loading}
                  className="my-table"
                  expandable={{
                    defaultExpandAllRows: true
                  }}
                  onRow={record => {
                    record = Object.assign({}, props.initParams || {}, record)
                    return {
                      onClick: event => {
                        event.nativeEvent.stopImmediatePropagation();
                        event.stopPropagation();
                        props.tableRowClick && props.tableRowClick(record, tableStore)
                      },  // 点击行
                      onDoubleClick: (event) => {
                        event.nativeEvent.stopImmediatePropagation()
                        event.stopPropagation()
                        // let fData = record;
                        // props.source.forEach(item => {
                        //   if(item.formType === EpsFormType.DatePicker){
                        //     fData[item.code] = moment(fData[item.code])
                        //   }
                        // })
                        // form.setFieldsValue(fData);
                        // setViewVisible(true);
                        // setViewRecord(fData)
                      }// 点击行
                    };
                  }}
                  rowSelection={rowSelection}/>
                  :
                  <Table columns={columns} dataSource={tableList} bordered scroll={{ x: 'max-content' }}
                    //      pagination={{
                    // showQuickJumper: true,
                    // showSizeChanger: true,
                    // defaultCurrent: page,
                    // defaultPageSize: size,
                    // pageSize:size,
                    // current: page,
                    // showTotal: (total, range) => `共 ${total} 条数据`,
                    // onChange: onPageSizeChange,
                    // total: total}}
                    pagination={false}
                    loading={loading}
                    className="my-table"
                    expandable={{
                      defaultExpandAllRows: true
                    }}
                    onRow={record => {
                      record = Object.assign({}, props.initParams || {}, record)
                      return {
                        onClick: event => {
                          event.nativeEvent.stopImmediatePropagation()
                          event.stopPropagation()
                          props.tableRowClick && props.tableRowClick(record)
                        },
                        onDoubleClick: (event) => {
                          event.nativeEvent.stopImmediatePropagation()
                          event.stopPropagation()
                          // let fData = record;
                          // props.source.forEach(item => {
                          //   if(item.formType === EpsFormType.DatePicker){
                          //     fData[item.code] = moment(fData[item.code])
                          //   }
                          // })
                          // form.setFieldsValue(fData);
                          // setViewVisible(true);
                          // setViewRecord(fData)
                        } // 点击行
                      };
                    }}/>
              }
              { menuProp &&
                <div className="menu-collapse" style={{display: showMenus?"block":"none"}}>
                  <div className="group">
                    {
                       menuProp.map((item, index) => (
                        <li className="item" key={index} style={{backgroundColor: item.color}}>
                        <img style={{width: '28px'}}  src={import(`../../../../styles/assets/img/${item.icon}.png`)} onClick={() => item.onClick(selectedRowKeys, tableStore, checkedRows)}/>
                          <span>{item.title}</span>
                          <div className="shadow"></div>
                          {editFlag ? <img src={import('../../../../styles/assets/img/icon_add_border.png')} className="add-icon" onClick={() => clickAdd(item)}/> : ''}
                        </li>
                      ))
                    }
                  </div>
                  <div className="btns">
                  <Button type="primary" onClick={() => setEditFlag(true)}>编 辑</Button>
                    <Button style={{margin: '0 20px'}} onClick={() => setEditFlag(false)}>重 置</Button>
                    <Button onClick={() => {setShowMenus(false), setEditFlag(false)}}>取 消</Button>
                  </div>
                <span className="cover"></span>
              </div>
              }
            </div>
          </div>

      {/* oa详情页面 */}
      {/* <Detail detailVisible={this.state.detailVisible} handleClose={() => {this.setState({detailVisible: false})}}></Detail> */}
      {searchForm && <AdvancedSearch drawVisible={drawVisible} changeVisible={() => setDrawVisible(false)} searchForm={searchForm} tableStore={tableStore} initParams={props.initParams}  onClick={props.tableProp?.onSearchClick}></AdvancedSearch>}
      <Modal
        title={props.title.name}
        centered
        visible={viewVisible}
        onOk={() => {
          setViewVisible(false)
        }}
        onCancel={() => setViewVisible(false)}
        width={props.formWidth || 800}
      >
        <EpsForm modal='view' form={form} source={props.source}  data={viewRecord}  customForm={props.customForm && props.customForm(form, props.store)}></EpsForm>
    </Modal>
    </div>
    );
}))

export default EpsPanel;

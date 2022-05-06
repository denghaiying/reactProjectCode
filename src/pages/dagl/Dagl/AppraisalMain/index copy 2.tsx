import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {EpsDakPanel, EpsMainTableStore} from '@/eps/components/panel/EpsDakPanel';
import EpsFormType from '@/eps/commons/EpsFormType';

import YhService from '@/services/system/yh/YhService';
import DwService from "@/services/system/DwService";

import { Button, Form, Input, message } from 'antd';
import {DatePicker, Select} from "@alifd/next";
import Store from "@/stores/system/YhStore";
import { EpsSource, ITable, ITitle, ITree, MenuData } from '@/eps/commons/declare';
const FormItem = Form.Item;

const tableProp: ITable = {
    tableSearch: true,
    disableAdd: true,
    disableDelete: true,
    rowSelection: {
        type: 'checkbox',
    }
}

const ActionOne = (text, record, index,store) => {
     return (<img src={require('../../../styles/assets/img/icon_import_multi.png')} style={{width: 22, margin: '0 2px'}} onClick={() => message.warning(`该条数据的登录号：${record.bh}`)}/>)
}

const ActionTwo = (text, record, index, store) => {
    return (<img src={require('../../../styles/assets/img/icon_import_multi.png')} style={{width: 22, margin: '0 2px'}} onClick={() => message.warning(`该条数据的用户名称为：${record.yhmc}`)}/>)
}


const customTableAction =(text, record, index, store) => {
    return(
        <>
            {[
                ActionOne(text, record, index,store),
                ActionTwo(text, record, index,store)
            ]}
        </>
    )
}

const tabData = [{tab: '盒号', key: '1'}, {tab: '文件号', key: '2'}]

const onTabChange = key => console.log(key)

const tabProps = {tabData, onTabChange}

// 自定义表单
const customForm = () => {
    return (
        <>
            <Form.Item  required  label="登录号" name='bh'>
                <Input
                    name="bh"
                    placeholder="登录号"
                    style={{width: 380}}
                />
            </Form.Item>
            <Form.Item
                required
                name="yhmc"
                label="用户名"
                >
                <Input placeholder="用户名称" style={{width: 380}}/>
            </Form.Item>
            <Form.Item label="电子邮件" name="mail" >
                <Input placeholder="电子邮件"  style={{width: 380}}/>
            </Form.Item>
            <Form.Item label="QQ号" name="qq">
                <Input  placeholder="QQ号"  style={{width: 380}}/>
            </Form.Item>
            <Form.Item label="手机号码" name="sjh">
                <Input   placeholder="手机号码:"  style={{width: 380}}/>
            </Form.Item>
            <Form.Item label="固定电话" name="dh">
                <Input placeholder="固定电话"  style={{width: 380}}/>
            </Form.Item>
            <Form.Item label="部职别"  name="bzb">
                <Input placeholder="部职别"  style={{width: 380}}/>
            </Form.Item>
            <Form.Item label="停用日期"  name="tyrq">
                <DatePicker placeholder="停用日期"  style={{width: 380}}/>
            </Form.Item>
            <Form.Item label="停用" name="ty">
                <Select style={{width: 380}}>
                    <option value="N">启用</option>
                    <option value="Y">停用</option>
                </Select>
            </Form.Item>
            <Form.Item label='维护人' 
                    name="whr" >
                <Input
                    disabled style={{width: 380}}
                    placeholder=''
                />
            </Form.Item>
            <Form.Item label='维护时间'
                    name="whsj">
                <DatePicker
                    style={{width: 380}}
                    showTime
                    disabled
                />
            </Form.Item>
        </>
    )
}

const treeProp: ITree = {
    treeSearch: true,
    treeCheckAble: false
}



function Dagl(props) {
    
    const ref = useRef();
    // const FChild = forwardRef(EpsPanel);

    // 自定义功能按钮
    const customAction = (store: EpsMainTableStore) => {
        return ([<><Button size="small" onClick={() =>onButtonClick()}>自定义按钮</Button><Button size="small" style={{marginLeft: '10px'}} type="dashed" onClick={() =>onButtonClick()}>自定义按钮</Button></>])
    }

    const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
        // let store = ref.current?.getTableStore()
        // message.info(store.key || '当前未选中左侧树')
        if(typeof props.closeModal === 'function'){
            props.closeModal(false)
        }
    };


    useEffect(() => {

        Store.queryDwTree();
        Store.queryYhLx();
        Store.queryGw();
        Store.queryYhMj();
        Store.queryYhZj();
        Store.queryOrg();
        Store.queryForPage();
    }, []);

    const source:EpsSource[] = [{
        title: '单位',
        code: 'dwmc',
        align: 'center',
        ellipsis: true,         // 字段过长自动东隐藏
        fixed: 'left',
        width: 200,
        formType: EpsFormType.Input
    }, {
        title: '登录号',
        code: 'bh',
        align: 'center',
        width: 120,
        formType: EpsFormType.Input
    }, {
        title: '用户名称',
        align: 'yhmc',
        code: 'yhmc',
        width: 120,
        ellipsis: true,
        formType: EpsFormType.Select,

    }, {
        title: '性别',
        code: 'xb',
        align: 'center',
        width: 60,
        formType: EpsFormType.Input,
        render: (text, record, index) => {
            if(text) {
                return text == '1' ? '男' : '女';
            }else{
                return text = "未知";
            }

        }

    }, {
        title: '任职部门',
        code: 'orgmc',
        align: 'center',
        width: 100,
        formType: EpsFormType.Input
    }, {
        title: "用户类型",
        code: 'lx',
        align: 'center',
        width: 100,
        formType: EpsFormType.Input,
        render: (text, record, index) => {
            let lxlist=Store.lxDataSource;
            let aa = lxlist.filter(item => {
                return item.value === text
            })
            return aa[0]?.label
        },

    }, {
        title: "用户密级",
        code: "yhmj",
        align: 'center',
        width: 100,
        formType: EpsFormType.Input,
        render:(value) =>{
            let lxlist=Store.mjDataSource;
            let mc = lxlist.filter(ite => {

                return ite.value === value
            })
            return mc[0]?.label
        },
    }, {
        title: "岗位",
        code: 'gw',
        align: 'center',
        width: 100,
        formType: EpsFormType.Input,
        render:function(value){
            let lxlist=Store.gwDataSource;
            let mc = lxlist.filter(ite => {

                return ite.value === value
            })
            return (<>{mc[0]?.label}</>)
        },
    }, {
        title: "电子邮件",
        code: 'mail',
        align: 'center',
        formType: EpsFormType.Input,
        
        width: 140,
        /* defaultSortOrder: 'descend',
         sorter: (a, b) => a.bz - b.bz,*/
    }, {
        title: "QQ",
        code: 'qq',
        align: 'center',
        
        width: 100,
        formType: EpsFormType.Input,
        /*  defaultSortOrder: 'descend',
          sorter: (a, b) => a.mc - b.mc,*/
    }, {
            title: "手机号码",
            code: "sjh",
            align: 'center',
            
            width: 100,
            formType: EpsFormType.Input,
            /*defaultSortOrder: 'descend',
            sorter: (a, b) => a.lx - b.lx,*/
    }, {
            title: "固定电话",
            code: 'dh',
            align: 'center',
            
            width: 100,
            formType: EpsFormType.Input,
            /*defaultSortOrder: 'descend',
            sorter: (a, b) => a.url - b.url,*/
    }, {
            title: "部职别",
            code: 'bzb',
            width: 100,
            align: 'center',
            formType: EpsFormType.Input,
            /* defaultSortOrder: 'descend',
             sorter: (a, b) => a.bz - b.bz,*/
    }, {
            title: "启用日期",
            code: 'qyrq',
            align: 'center',
            width: 160,
            formType: EpsFormType.Input,
        //   format:"YYYY-MM-DD"
    }, {
            title: "停用",
            code: "tymc",
            width: 60,
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                return text == 'N' ? '启用' : '停用';
            }
    }, {
            title: "停用日期",
            code: 'tyrq',
            width: 160,
            align: 'center',
            formType: EpsFormType.Input,
            /*defaultSortOrder: 'descend',
            sorter: (a, b) => a.url - b.url,*/
    }, {
            title: "维护人",
            code: 'whr',
            width: 100,
            align: 'center',
            formType: EpsFormType.Input,
            /* defaultSortOrder: 'descend',
             sorter: (a, b) => a.whr - b.whr,*/
    },{
        title: '维护时间',
        code: 'whsj',
        width: 160,
        align: 'center',
        formType: EpsFormType.None
    }]

    const title:ITitle = {
        name: '用户'
    }

    const menuProp: MenuData[] = [
        {
            title: '导入',
            icon: 'file-transfer/icon_edit',
            onClick: (record , store, rows) => console.log('这是导入按钮', record , rows),
            color: '#CCCCFF'
        }, {
            title: '打印',
            icon: 'file-transfer/icon_book',
            onClick: (record , store, rows) => console.log('这是打印按钮', record, rows),
            color: '#FFCCFF'
        }
    ]

    const searchFrom = () => {
        return (
            <>
                <FormItem label="流程标题" className="form-item" name="title"><Input placeholder="请输入流程标题"/></FormItem >
                <Form.Item label="待办状态" className="form-item" name="status">
                  <Select placeholder="请选择待办状态"></Select>
                </Form.Item>
            </>
        )
    }

    return (
        <>
            <EpsDakPanel title={title}                            // 组件标题，必填
                      source={source}                          // 组件元数据，必填
                      treeProp={treeProp}                      // 左侧树 设置属性,可选填
                      treeService={DwService}                  // 左侧树 实现类，必填
                      mainTableProp={tableProp}                    // 右侧表格设置属性，选填
                      mainTableService={YhService}                 // 右侧表格实现类，必填
                      childTableService={YhService}
                      childTableProp={tableProp}
                      ref={ref}                                // 获取组件实例，选填
                      mainMenuProp={menuProp}                      // 右侧菜单 设置属性，选填
                      mainSearchForm={searchFrom}                  // 高级搜索组件，选填
                      mainCustomForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
                    //   customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
                      mainCustomAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
                      >
            </EpsDakPanel>
        </>
    );
}

export default Dagl;

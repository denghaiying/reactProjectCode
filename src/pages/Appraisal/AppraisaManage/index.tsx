import React, {useEffect, useState} from 'react';
import {EpsPanel, EpsTableStore} from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';

import ArchGroupService from '@/services/appriasa/ArchGroupService';
import ArchService from '@/services/appriasa/ArchService';
import {EpsSource, ITable} from '@/eps/components/panel/EpsPanel2/EpsPanel';
import { Button, Form, Input, message } from 'antd';
import DapubStore from '@/stores/dagl/DapubStore';
import {DatePicker, Select} from "@alifd/next";
import Store from "@/stores/system/YhStore";
import YhlxService from './service/dwService'

const tableProp: ITable = {
    tableSearch: false,
}

// 自定义功能按钮
const customAction = (store: EpsTableStore) => {
    return (<Button onClick={() => message.info('这是自定义按钮')}>自定义按钮</Button>)
}

// 自定义表单
const customForm = () => {
    return (
        <>
            <Form.Item label="单位" labelWidth={205}  required name="dwid">
                {/* <Input id="dwmc" name="dwmc" style={{width: 200}} disabled/>*/}
                {/*<Select tagInline   defaultValue={Store.dwid.id}*/}
                {/*        placeholder="单位" hasClear  disabled={Store.dwstatus}*/}
                {/*        dataSource={Store.dwDataSource} style={{width: 200}}/>*/}
            </Form.Item>

            <Form.Item
                required
                label="登录号" name='bh'
            >
                <Input
                    name="bh"
                    placeholder="登录号"
                    style={{width: 200}}
                />
            </Form.Item>
            <Form.Item
                required
                label="用户名"  labelWidth={205}
            >
                <Input name="yhmc" placeholder="用户名称" style={{width: 200}}
                />
            </Form.Item>

            <Form.Item label="电子邮件">
                <Input name="mail"  placeholder="电子邮件" style={{width: 200}}/>
            </Form.Item>
            <Form.Item label="QQ号">
                <Input name="qq"  placeholder="QQ号" style={{width: 200}}/>
            </Form.Item>
            <Form.Item label="手机号码">
                <Input name="sjh"  placeholder="手机号码:" style={{width: 200}}/>
            </Form.Item>
            <Form.Item label="固定电话">
                <Input name="dh"  placeholder="固定电话" style={{width: 200}}/>
            </Form.Item>


            <Form.Item label="部职别"  labelWidth={205}>
                <Input name="bzb"  placeholder="部职别" style={{width: 200}}/>
            </Form.Item>
            <Form.Item label="停用日期"  labelWidth={205}>
                <DatePicker  name="tyrq"
                             placeholder="停用日期" style={{width: 200}}/>
            </Form.Item>
            <Form.Item label="停用"  labelWidth={205}>
                {/*<Switch  name="ty" checkedChildren="停用"  unCheckedChildren="启用" checked={switchState} onChange={onChange}/>*/}

                {/*<Checkbox id="ty" name="ty"  style={{width: 200}} defaultChecked={Store.selectedRow.ty}></Checkbox>*/}

                <Select name="ty" style={{width: 200}} defaultValue="N">
                    <option value="N">启用</option>
                    <option value="Y">停用</option>
                </Select>
            </Form.Item>

            <Form.Item label='维护人' >
                <Input
                    name="whr"
                    disabled style={{width: 200}}
                    placeholder=''
                />
            </Form.Item>
            <Form.Item label='维护时间'>
                <DatePicker
                    name="whsj"
                    style={{width: 200}}
                    showTime
                    disabled
                />
            </Form.Item>
        </>
    )
}





const Kfjd=(props)=> {

   

    useEffect(() => {
        Store.queryDwTree();
     
    //    Store.queryForPage();
    }, []);

    const source:EpsSource[] = [{
        title: '单位',
        code: 'dwmc',
        align: 'center',
        ellipsis: true,         // 字段过长自动东隐藏
        fixed: 'left',
        width: 200,
        formType: EpsFormType.Input
    },{
        title: '登录号',
        code: 'bh',
        align: 'center',
        width: 120,
        formType: EpsFormType.Input
    },{
        title: '用户名称',
        align: 'yhmc',
        code: 'yhmc',
        width: 120,
        ellipsis: true,
        formType: EpsFormType.Select,

    },{
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

    },{
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
            console.log(lxlist, 'gw')
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
    },
        {
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
            width: 120,
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
            width: 140,
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
        width: 120,
        align: 'center',
        formType: EpsFormType.None
    }]

    const title = {
        name: '用户'
    }

    return (
        <div>
            <EpsPanel treeSearch={false}
                      title={title}
                      source={source}
                      treeService={ArchGroupService}
                      tableProp={tableProp}
                      tableService={ArchService}
                      customForm={customForm}>
            </EpsPanel>
        </div>
    );
}

export default Kfjd;

import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { Form, Input, InputNumber, Select } from 'antd';
import dsrwService from '@/services/system/dsrw/DsrwService';
import SysStore from '@/stores/system/SysStore';
const { Option } = Select;
import moment from 'moment';
import HandTask from './handTask';
import OneTask from './oneTask';
import StartTask from './startTask';
import StopTask from './stopTask';

const FormItem = Form.Item;
/**
 * 获取当前用户
 */
const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,

}

// 自定义表单


const customForm = () => {

    return (
        <>
            <Form.Item label="名称:" name="mc"   required rules={[{ required: true, message: '请输入名称' }]}>
                <Input allowClear style={{ width: 300 }} />
            </Form.Item>

            <Form.Item label="类型:" name="lx"   required rules={[{ required: true, message: '请选择类型' }]}>
                <Select style={{ width: 300 }}  placeholder="请选择类型">
                    <Option value="jndi">调用EJB</Option>
                    <Option value="page">页面刷新</Option>
                    <Option value="jar">调用jar包</Option>
                    <Option value="sql">SQL取数</Option>
                    <Option value="msg">消息更新</Option>

                </Select>
            </Form.Item>
            <Form.Item label="连接地址:" name="jndiname" required rules={[{ required: true, message: '请输入连接地址' }]}>
                <Input allowClear style={{ width: 300 }} />
            </Form.Item>
            <Form.Item label="表达式:" name="expr" required rules={[{ required: true, message: '请输入表达式' }]}>
                <Input allowClear style={{ width: 300 }} />
            </Form.Item>
            <Form.Item label="调用方法:" name="dmethod" required rules={[{ required: true, message: '请输入调用方法' }]}>
                <Input allowClear style={{ width: 300 }} />
            </Form.Item>
            <Form.Item label="是否启用:" name="qy" initialValue="N" >
                <Select style={{ width: 300 }} >
                    <Option value="Y">是</Option>
                    <Option value="N">否</Option>
                </Select>
            </Form.Item>
            <Form.Item label="开始时间:" name="begintime" initialValue="0" required rules={[{ required: true, message: '请输入开始时间' }]}>
                <InputNumber min={0} max={23}   style={{ width: 300 }}/>
            </Form.Item>
            <Form.Item label="结束时间:" name="endtime" initialValue="23" required rules={[{ required: true, message: '请输入结束时间' }]}>
            <InputNumber min={0} max={23}   style={{ width: 300 }}/>
            </Form.Item>
            <Form.Item label="维护人:" name="whr" initialValue={yhmc} >
                <Input disabled style={{ width: 300 }} />
            </Form.Item>
            <Form.Item label="维护时间:" name="whsj" initialValue={getDate}>
                <Input disabled style={{ width: 300 }} />
            </Form.Item>
            {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
        </>
    )
}

function dsrw() {
    const [initParams, setInitParams] = useState({})

        // 自定义表格行按钮
        const customTableAction = (text, record, index, store) => {
            return [
                <StartTask record={record} store={store}  key={'startTask' + index} />,
                <StopTask record={record} store={store}  key={'stopTask' + index} />,
                <HandTask record={record} store={store}  key={'handTask' + index} />,
                <OneTask record={record} store={store}  key={'oneTask' + index} />
            ];
        };

    const ref = useRef();
    useEffect(() => {

    }, []);

    const source: EpsSource[] = [
        {
            title: '名称',
            code: 'mc',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '类型',
            code: 'lx',
            align: 'center',
            formType: EpsFormType.Input,
            render: (text) => {
                if (text === 'jndi') { return text = '调用EJB' }
                else if (text === 'page') { return text = '刷新页面' }
                else if (text === 'page') { return text = '刷新页面' }
                else if (text === 'jar') { return text = '调用jar包' }
                else if (text === 'sql') { return text = 'SQL取数' }
                else if (text === 'msg') { return text = '消息更新' }
            }
        },
        {
            title: '连接地址/SQL',
            code: 'jndiname',
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                if (text.length > 60) {
                    return text = text.slice(0, 60) + "...";
                } else {
                    return text = text;
                }
            }
        },

        {
            title: '调用方法/参数',
            code: 'dmethod',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '表达式',
            code: 'expr',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '启用',
            code: 'qy',
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                if (text) {
                    return text === 'Y' ? <font  color="green">是</font> : '否';
                } else {
                    return text = "无";
                }
            }
        },
        {
            title: '系统任务',
            code: 'xtrw',
            align: 'center',
            formType: EpsFormType.Input,
            render: (text, record, index) => {
                if (text) {
                    return text === 'Y' ? <font  color="green">是</font> : '否';
                } else {
                    return text = "无";
                }
            }
        },
        {
            title: '开始时间',
            code: 'begintime',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '结束时间',
            code: 'endtime',
            align: 'center',
            formType: EpsFormType.Input
        },


        {
            title: '维护人',
            code: 'whr',
            align: 'center',
            formType: EpsFormType.Input
        },
        {
            title: '维护时间',
            code: 'whsj',
            align: 'center',
            formType: EpsFormType.Input,
        }
    ]
    const title = {
        name: '定时任务'
    }

    return (
        <EpsPanel
            title={title}                            // 组件标题，必填
            source={source}                          // 组件元数据，必填
            ref={ref}
            tableProp={tableProp}                    // 右侧表格设置属性，选填
            tableService={dsrwService}               // 右侧表格实现类，必填
            formWidth={500}
            initParams={initParams}
            // searchForm={searchFrom}
            customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
            //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
            customTableAction={customTableAction}
       >
        </EpsPanel>
    );
}

export default dsrw;

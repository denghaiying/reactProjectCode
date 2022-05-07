import './index.less';
import { Form, Select, InputNumber, Input, Tabs, Button } from 'antd';
import { Transfer, Switch, Table, Tag } from 'antd';
import React, { useState } from 'react';
import { Radio, Divider } from 'antd';

const columns = [
    {
        title: ' ',
        dataIndex: 'xh',
        align:'center',
    },
    {
        title: '全宗号',
        dataIndex: 'qzh',
        align:'center',
        // render: (text: string) => <a>{text}</a>,
    },
    {
        title: '年度',
        align:'center',
        dataIndex: 'nd',
    },
    {
        title: '保管期限',
        align:'center',
        dataIndex: 'bgqx',
    },
    {
        align:'center',
        title: '机构(问题)',
        dataIndex: 'jgwt',
    },
];

const columnss = [
    {
        title: ' ',
        dataIndex: 'xh',
        align:'center',
    },
    {
        title: '全宗号',
        dataIndex: 'qzh',
        align:'center',
        // render: (text: string) => <a>{text}</a>,
    },
    {
        title: '档号断号',
        dataIndex: 'dhdh',
        align:'center',
    }
    
];


interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}

const data: DataType[] = [
    {
        key: '1',
        xh:'1',
        qzh: '001',
        nd: '2022',
        bgqx: '永久',
        jgwt:'MY',
        dhdh:'321123',
    },
    {
        key: '2',
        xh:'2',
        qzh: '021',
        nd: '2012',
        bgqx: '永久',
        dhdh:'564654',
        jgwt:'MY'
    },{
        key: '3',
        xh:'3',
        dhdh:'7868',
        qzh: '033',
        nd: '2013',
        bgqx: '永久',
        jgwt:'MY'
    },{
        key: '4',
        xh:'4',
        dhdh:'12331',
        qzh: '004',
        nd: '2004',
        bgqx: '永久',
        jgwt:'MY'
    },{
        key: '5',
        xh:'5',
        dhdh:'9080',
        qzh: '055',
        nd: '2025',
        bgqx: '永久',
        jgwt:'MY'
    },
];

// rowSelection object indicates the need for row selection
const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: DataType) => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
    }),
};

const { TabPane } = Tabs;

function callback(key) {
    console.log(key);
}

const App = () => {
function rowSelection(){
    type:'check'
}

    return (
        <>
            <div className='czbox'>
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="查找" key="1">
                        <div className='cztabdyg'>
                            <div>
                                <Button type='primary' style={{marginTop:5}}>点击查询</Button>
                                <div  style={{marginTop:9}} className='xjd'>
                                    <p>字段列表</p>
                                <Table
                                   rowSelection={rowSelection}
                                    columns={columns}
                                    dataSource={data}
                                />
                                </div>
                            </div>
                        </div>

                    </TabPane>
                    <TabPane tab="查找结果" key="2">
                    
                        <div className='cztabdyg'>
                            <div>
                                <div  style={{marginTop:5}} className='xjd'>
                                    <p>断号结果</p>
                                <Table
                                   rowSelection={rowSelection}
                                    columns={columnss}
                                    dataSource={data}
                                />
                                </div>
                            </div>
                        </div>

                    </TabPane>

                </Tabs>
            </div>

        </>
    );
};
export default App;
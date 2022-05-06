import './index.less';
import { Input, Table, Space, Button, Tabs } from 'antd';

const columns = [
    {
        title: '流水号',
        align: 'center',
        dataIndex: 'lsh',
        key: 'lsh',
        render: text => <a>{text}</a>,
    },
    {
        title: '库位码',
        align: 'center',
        dataIndex: 'kwm',
        key: 'kwm',
    },
    {
        title: '盒号',
        dataIndex: 'hh',
        align: 'center',
        key: 'hh',
    },
    {
        title: '份数',
        align: 'center',
        dataIndex: 'fs',
        key: 'fs',
    },
    {
        title: '页数',
        align: 'center',
        dataIndex: 'ys',
        key: 'ys',
    },
    {
        align: 'center',
        title: '宽度',
        dataIndex: 'kd',
        key: 'kd',
    },
    {
        title: '是否上架',
        align: 'center',
        dataIndex: 'sf',
        key: 'sf',
    },
    {
        title: '状态',
        align: 'center',
        dataIndex: 'zt',
        key: 'zt',
    },
    {
        title: '备注',
        dataIndex: 'bz',
        align: 'center',
        key: 'bz',
    },
    {
        title: '维护人',
        dataIndex: 'whr',
        align: 'center',
        key: 'whr',
    },
    {
        title: '维护时间',
        dataIndex: 'whsj',
        key: 'whsj',
        align: 'center',
    },
    {
        title: '操作',
        key: 'action',
        align:'center',
        width: 100,
        render: (text, record) => (
            <Space size="middle">
                <a>编辑</a>
                <a>删除</a>
            </Space>
        ),
    },
];

const columnsa = [
    {
        title: '底片号',
        align: 'center',
        dataIndex: 'dph',
        key: 'dph',
        render: text => <a>{text}</a>,
    },
    {
        title: '密级',
        align: 'center',
        dataIndex: 'mj',
        key: 'mj',
    },
    {
        title: '拍摄时间',
        dataIndex: 'pssj',
        align: 'center',
        key: 'pssj',
    },
    {
        title: '人物',
        align: 'center',
        dataIndex: 'rw',
        key: 'rw',
    },
    {
        title: '摄影者',
        align: 'center',
        dataIndex: 'syz',
        key: 'syz',
    },
    {
        align: 'center',
        title: '照片号',
        dataIndex: 'zph',
        key: 'zph',
    },
    {
        title: '备注',
        align: 'center',
        dataIndex: 'bz',
        key: 'bz',
    },
    {
        title: '拍摄地点',
        align: 'center',
        dataIndex: 'psdd',
        key: 'psdd',
    },
    {
        title: '事由',
        dataIndex: 'sy',
        align: 'center',
        key: 'sy',
    },
    {
        title: '盒号',
        dataIndex: 'hh',
        align: 'center',
        key: 'hh',
    },
    {
        title: '档案馆代码',
        dataIndex: 'dagdm',
        key: 'dagdm',
        align: 'center',
    },
    {
        title: '全宗号',
        dataIndex: 'qzh',
        key: 'qzh',
        align: 'center',
    },
    {
        title: '全宗名称',
        dataIndex: 'qzmc',
        key: 'qzmc',
        align: 'center',
    },
    {
        title: '档号',
        dataIndex: 'dh',
        key: 'dh',
        align: 'center',
    },
    {
        title: '年度',
        dataIndex: 'nd',
        key: 'nd',
        align: 'center',
    },
    {
        title: '年度1',
        dataIndex: 'nd',
        key: 'nd',
        align: 'center',
    },
    {
        title: '年度2',
        dataIndex: 'nd',
        key: 'nd',
        align: 'center',
    },
    {
        title: '年度3',
        dataIndex: 'nd',
        key: 'nd',
        align: 'center',
    },
    {
        title: '年度4',
        dataIndex: 'nd',
        key: 'nd',
        align: 'center',
    },
    {
        title: '年度5',
        dataIndex: 'nd',
        key: 'nd',
        align: 'center',
    },
    {
        title: '操作',
        key: 'action',
        width: 100,
        align:'center',
        render: (text, record) => (
            <Space size="middle">
                <a>编辑</a>
                <a>删除</a>
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        lsh: '0001',
        kwm: '#213',
        hh: '*432',
        fs: '0',
        ys: '0',
        kd: '0',
        sf: '否',
        whr: '超级管理员',
        whsj: '2022-05-05'
    },
    {
        key: '2',
        lsh: '0002',
        kwm: '#543',
        hh: '*111',
        fs: '0',
        ys: '0',
        kd: '0',
        sf: '否',
        whr: '超级管理员',
        whsj: '2022-05-015'
    },
    {
        key: '3',
        lsh: '0003',
        kwm: '#876',
        hh: '*788',
        fs: '12',
        ys: '2310',
        kd: '2000',
        sf: '否',
        whr: '管理员',
        whsj: '2022-01-15'
    },
    {
        key: '4',
        lsh: '0004',
        kwm: '#565',
        hh: '*662',
        fs: '1',
        ys: '2200',
        kd: '1230',
        sf: '否',
        whr: '管理员',
        whsj: '2021-11-05'
    },
    {
        key: '5',
        lsh: '0005',
        kwm: '#213',
        hh: '*432',
        fs: '3',
        ys: '3210',
        kd: '2000',
        sf: '是',
        whr: '管理员',
        whsj: '2022-05-05'
    },
    {
        key: '6',
        lsh: '0006',
        kwm: '#213',
        hh: '*432',
        fs: '0',
        ys: '0',
        kd: '0',
        sf: '否',
        whr: '超级管理员',
        whsj: '2022-05-05'
    },
    {
        key: '7',
        lsh: '0007',
        kwm: '#543',
        hh: '*111',
        fs: '0',
        ys: '0',
        kd: '0',
        sf: '否',
        whr: '超级管理员',
        whsj: '2022-05-015'
    },
    {
        key: '8',
        lsh: '0008',
        kwm: '#543',
        hh: '*111',
        fs: '0',
        ys: '0',
        kd: '0',
        sf: '否',
        whr: '超级管理员',
        whsj: '2022-05-015'
    },


];

const { Search } = Input;

const onSearch = value => console.log(value);


const { TabPane } = Tabs;

function callback(key) {
    console.log(key);
}
const App = () => {
    function rowSelection() {
        type: 'check'
    }
    return (
        <>
            <div className='hglbox'>
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="盒管理" key="1">
                        <div className='tabpbox'>
                            <div className='onebtn'>
                                <Space direction="vertical">
                                    <Search style={{ width: 250, marginTop: -4 }} placeholder="请输入要搜索的内容..." onSearch={onSearch} enterButton />
                                </Space>
                                <Button type='primary' style={{ marginLeft: 8 }}>新增</Button>
                                <Button type='primary' style={{ marginLeft: 5 }}>预览</Button>
                                <Button type='primary' style={{ marginLeft: 5 }}>打印</Button>
                                <Button type='primary' style={{ marginLeft: 5 }}>报表</Button>
                                <Button type='primary' style={{ marginLeft: 5 }}>电子标签获取</Button>
                                <Button type='primary' style={{ marginLeft: 5 }}>电子标签写入</Button>
                                <Button type='primary' style={{ marginLeft: 5 }}>帮助</Button>
                                <Button type='primary' style={{ marginLeft: 5 }}>上架</Button>
                                <Button type='primary' style={{ marginLeft: 5 }}>批量上架</Button>
                                <Button type='primary' style={{ marginLeft: 5 }}>下架</Button>
                                <Button type='primary' style={{ marginLeft: 5 }}>定位</Button>
                                <Button type='primary' style={{ marginLeft: 5 }}>自动盒装</Button>
                                <Button type='primary' style={{ marginLeft: 5 }}>自动上架</Button>
                            </div>


                            <div className='bg'>
                                <Table columns={columns} rowSelection={rowSelection} dataSource={data} />
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="盒内文件" key="2">
                        <div className='erpab'>
                            <div className='twobtn'>
                                <Button type='primary'>调盒</Button>
                                <Button type='primary' style={{ marginLeft: 5 }}>移出盒</Button>
                            </div>
                            <div className='erbg'>
                                <Table rowSelection={rowSelection} columns={columnsa} scroll={{ x: 2000 }} />
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="未装盒文件" key="3">
                        <div className='erpab'>
                            <div className='twobtn'>
                                <Button type='primary'>新增</Button>
                                <Button type='primary' style={{ marginLeft: 5 }}>导入盒</Button>
                            </div>
                            <div className='erbg'>
                                <Table rowSelection={rowSelection} columns={columnsa} scroll={{ x: 2000 }} />
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </>
    );
};
export default App;
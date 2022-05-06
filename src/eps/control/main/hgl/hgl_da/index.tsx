import './index.less';
import { Input, Table, Space, Button, Tabs } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

const columns = [
    {
      title: '序号',
      dataIndex: 'xh',
      align:'center',
    },
    {
      title: '盒号',
      align:'center',
      dataIndex: 'hh',
    },
    {
      title: '份数',
      align:'center',
      dataIndex: 'fs',
    },
    {
        title: '页数',
      align:'center',
      dataIndex: 'ys',
      },
      {
        title: '宽度',
      align:'center',
      dataIndex: 'kd',
      },
      {
        title: '是否上架',
      align:'center',
      dataIndex: 'sf',
      },
      {
        title: '备注',
      align:'center',
      dataIndex: 'bz',
      },
      {
        title: '维护人',
      align:'center',
      dataIndex: 'whr',
      },
      {
        title: '维护时间',
      align:'center',
      dataIndex: 'whsj',
      },
  ];
  
  const data = [];
  for (let i =1; i < 100; i++) {
    data.push({
      key: i,
      xh: `${i}`,
      hh: `2020-000${i}`,
      fs: 12,
      ys:2000,
      sf:'是',
      whr:'管理员',
      whsj:'2020-04-23'
    });
  }

const { Search } = Input;

const suffix = (
    <AudioOutlined
        style={{
            fontSize: 16,
            color: '#1890ff',
        }}
    />
);

const onSearch = value => console.log(value);

const App = () => {
    function rowSelection() {
        type: 'check'
    }
    return (
        <>
            <div className='zhbox'>
                <div className='dbbtn'>
                    <Space direction="vertical" style={{float:'left'}}>
                        <Search
                            placeholder="请输入盒号..."
                            allowClear
                            enterButton="搜索"
                            onSearch={onSearch}
                        />

                    </Space>
                    <div>
                        <Button type='primary' style={{marginLeft:10}}>装盒</Button>
                    </div>
                </div>
                <div className='zhtab'>
                <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 450 }} />
                </div>
            </div>
        </>
    );
};
export default App;
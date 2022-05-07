import './index.less';
import React from 'react';
import { Input, Tabs } from 'antd';
import { Form, Select,InputNumber } from 'antd';
import { Transfer, Switch, Table, Tag } from 'antd';
import difference from 'lodash/difference';

// Customize Table Transfer
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{ pointerEvents: listDisabled ? 'none' : null }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);

const mockTags = ['cat', 'dog', 'bird'];

const mockData = [];
for (let i = 1; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 4 === 0,
    tag: mockTags[i % 3],
  });
}

const originTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

const leftTableColumns = [
  {
    dataIndex: 'title',
    title: 'Name',
    align:'center',
  },
  {
    dataIndex: 'tag',
    align:'center',
    title: 'Tag',
    // render: tag => <Tag>{tag}</Tag>,
  },
  {
    dataIndex: 'description',
    align:'center',
    title: 'Description',
  },
];
const rightTableColumns = [
  {
    dataIndex: 'title',
    align:'center',
    title: 'Name',
  },
  {
    dataIndex: 'description',
    align:'center',
    title: 'Description',
  },
];

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

// 查重结果
const columns = [
    {
      title: '归档分类',
      dataIndex: 'gdfl',
    },
    {
        title: '档号',
        dataIndex: 'dh',
      },
      {
        title: '分类号',
        dataIndex: 'flh',
      },
      {
        title: '批准日期',
        dataIndex: 'pzrq',
      },
      {
        title: '原件持有人',
        dataIndex: 'gdfl',
      },
      {
        title: '年度',
        dataIndex: 'nd',
      },
      {
        title: '件号',
        dataIndex: 'jh',
      },
      {
        title: '文件题名',
        dataIndex: 'gdfl',
      },
      {
        title: '文件编号',
        dataIndex: 'wjbh',
      },
      {
        title: '成文日期',
        dataIndex: 'cwrq',
      },
      {
        title: '页数',
        dataIndex: 'ys',
      },
      {
        title: '责任者',
        dataIndex: 'zrz',
      },
      {
        title: '保管期限',
        dataIndex: 'bgqx',
      },
      {
        title: '机构(问题)',
        dataIndex: 'jgwt',
      },
      {
        title: '密级',
        dataIndex: 'mj',
      },
      {
        title: '归档部门',
        dataIndex: 'gdbm',
      },
      {
        title: '盒号',
        dataIndex: 'hh',
      },
      {
        title: '库位码',
        dataIndex: 'kwm',
      },
      {
        title: '存放位置',
        dataIndex: 'cfwz',
      },
      {
        title: '全宗号',
        dataIndex: 'qzh',
      },
      {
        title: '全宗名称',
        dataIndex: 'qzmc',
      },
      {
        title: '备注',
        dataIndex: 'bz',
      },
    {
        dataIndex: 'cz',
        align:'center',
        title: '操作',
        fixed: 'right',
        render: text  => <a style={{color:'red'}}>删除</a>,
      },
  ];
  
  const data = [];
//   for (let i = 0; i < 8; i++) {
//     data.push({
//       key: i,
//       name: `Edward King ${i}`,
//       age: 32,
//       address: `London, Park Lane no. ${i}`,
//     });
//   }

class App extends React.Component {
    // 查重
    state = {
        targetKeys: originTargetKeys,
        disabled: false,
        showSearch: false,
      };
    
      onChange = nextTargetKeys => {
        this.setState({ targetKeys: nextTargetKeys });
      };

    //   查重结果
    state = {
        selectedRowKeys: [], // Check here to configure the default column
      };
    
      onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      };
    
      
    render() {
        // 查重
        const { targetKeys, disabled, showSearch } = this.state;

        // 查重结果
        const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
        {
          key: 'odd',
          text: 'Select Odd Row',
          onSelect: changableRowKeys => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (index % 2 !== 0) {
                return false;
              }
              return true;
            });
            this.setState({ selectedRowKeys: newSelectedRowKeys });
          },
        },
        {
          key: 'even',
          text: 'Select Even Row',
          onSelect: changableRowKeys => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (index % 2 !== 0) {
                return true;
              }
              return false;
            });
            this.setState({ selectedRowKeys: newSelectedRowKeys });
          },
        },
      ],
    };
    return (
        <>
        <div className='ccbox'>
        <Tabs defaultActiveKey="1" onChange={callback}>
    <TabPane tab="档案查重" key="1">
      <div className='sygtabs'>
      <>
        <TableTransfer
        showSearch
        titles={['未选著录项', '已选著录项']}
          dataSource={mockData}
          targetKeys={targetKeys}
          disabled={disabled}
        //   showSearch={showSearch}
          onChange={this.onChange}
          filterOption={(inputValue, item) =>
            item.title.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
          }
          leftColumns={leftTableColumns}
          rightColumns={rightTableColumns}
        />
        
      </>
      </div>
    </TabPane>
    <TabPane tab="查重结果" key="2">
      <div className='ccdeg'>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{x:2000}} />
      </div>
    </TabPane>
    
  </Tabs>
        </div>
       
        </>
    );
    }
};
export default App;
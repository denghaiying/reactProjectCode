import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { Button } from 'antd';
import { ProFormField } from '@ant-design/pro-form';

type DataSourceType = {
  id: React.Key;
  title?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = new Array(20).fill(1).map((_, index) => {
  return {
    id: (Date.now() + index).toString(),
    title: `活动名称${index}`,
    decs: '这个活动真好玩',
    state: 'open',
    created_at: '2020-05-26T09:42:56Z',
  };
});



const EditTable = observer((props) => {
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
  defaultData.map((item) => item.id),
);
const [dataSource, setDataSource] = useState<DataSourceType[]>(() => defaultData);

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: []) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '活动名称',
    dataIndex: 'title',
    width: '30%',
    formItemProps: {
      rules: [
        {
          required: true,
          whitespace: true,
          message: '此项是必填项',
        },
        {
          message: '必须包含数字',
          pattern: /[0-9]/,
        },
        {
          max: 16,
          whitespace: true,
          message: '最长为 16 位',
        },
        {
          min: 6,
          whitespace: true,
          message: '最小为 6 位',
        },
      ],
    },
  },
  {
    title: '状态',
    key: 'state',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
      },
    },
  },
  {
    title: '描述',
    dataIndex: 'decs',
  },
  {
    title: '操作',
    valueType: 'option',
    width: 250,
    render: () => {
      return null;
    },
  },
];


  useEffect(() => {
  }, [props.jkpzid]);
  return (
    <>
     <EditableProTable<DataSourceType>
        headerTitle="可编辑表格"
        columns={columns}
        rowKey="id"
        value={dataSource}
        onChange={setDataSource}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          record: () => ({
            id: Date.now(),
          }),
        }}
        toolBarRender={() => {
          return [
            <Button
              type="primary"
              key="save"
              onClick={() => {
                // dataSource 就是当前数据，可以调用 api 将其保存
                console.log(dataSource);
              }}
            >
              保存数据
            </Button>,
          ];
        }}
      />
    </>
  );
})

export default EditTable;

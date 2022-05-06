import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { Button } from 'antd';
import { ProFormField } from '@ant-design/pro-form';

type DataSourceType = {
  id: React.Key;
  ms?: string;
  mc?: string;
  lx?: string;
  dakzd?: string;
  zdmc?: string;
  zdmrz?: string;
};


const lxData = [{value: "C", label: "文本型"}, {value: "N", label: "数值型"}, {value: "D", label: "日期型"}, {value: "T", label: "日期时间型"}, {value: "B",label: "大文本型"}];



const EditTable = observer((props) => {
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
  defaultData.map((item) => item.id),
);
const [dataSource, setDataSource] = useState<DataSourceType[]>([]);

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: []) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

const columns1: ProColumns<DataSourceType>[] = [
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

const columns : ProColumns<DataSourceType>[]= [
  {
    title: '接口库字段名称',
    dataIndex: 'ms',
    width: '25%',
  },
  {
    title: '接口库字段名',
    dataIndex: 'mc',
    width: '15%',
  },
  {
    title: '类型',
    dataIndex: 'lx',
    width: '15%',
    render: (text, record, index) => {
      let lxlist=lxData;
      let aa = lxlist.filter(item => {
        return item.value === text
      })
      return aa[0]?.label
    }
  },
  {
    title: '对应档案库字段',
    dataIndex: 'dakzd',
    width: '15%',
    editable: true,
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
    title: '字段名称',
    dataIndex: 'zdmc',
    width: '15%',
    editable: true,
  },
  {
    title: '默认值',
    dataIndex: 'zdmrz',
    width: '15%',
    editable: true,
  }
];

  useEffect(() => {
    setDataSource(props.mblzx);
    console.log(props.mblzx);
  }, []);
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
        editable={{
          type: 'multiple',
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            setDataSource(recordList);
          },
          onChange: setEditableRowKeys,
        }}
      />
    </>
  );
})

export default EditTable;

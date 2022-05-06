import { observer } from 'mobx-react';

import React, { useEffect, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { Button, Form, message, Modal, Popconfirm } from 'antd';

import MlStore from '../store/MlStore';
import ScStore from '../store/ScStore';
import HttpRequest from '@/eps/commons/v2/HttpRequest';

type DataSourceType = {
  id: React.Key;
  mc?: string;
  whr?: string;
  whsj?: string;
  byry?: string;
  nr?: string;
};

const MlModal = observer(() => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        MlStore.setModalVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleOkAndNext = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        MlStore.setModalVisible(false);
        ScStore.setModalVisibleAndId(true, MlStore.id);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    MlStore.setModalVisible(false);
  };

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>(
    'bottom',
  );

  useEffect(() => {
    MlStore.findAll(MlStore.id);
  }, [MlStore.id]);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '目录名称',
      dataIndex: 'mc',
      tooltip: '档案编研目录名称',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 2 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
      width: '45%',
    },
    {
      title: '编研人员',
      dataIndex: 'byry',
      // width: '25%',
    },
    // {
    //   title: '维护时间',
    //   dataIndex: 'whsj',
    //   valueType: 'date',
    // },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        !record.nr && (
          <Popconfirm
            title="是否要删除该条记录？"
            onConfirm={async () => {
              await MlStore.delete(record);
              await MlStore.findAll(MlStore.id);
            }}
          >
            <a key="delete">删除</a>
          </Popconfirm>
        ),
      ],
    },
  ];

  return (
    <>
      <Modal
        title="档案编研-目录设置"
        visible={MlStore.isModalVisible}
        onOk={handleOk}
        width={1000}
        onCancel={handleCancel}
        footer={[
          <Button key="back" type="primary" onClick={handleOk}>
            保存并关闭
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkAndNext}>
            保存并设置素材
          </Button>,
          <Button key="clock" onClick={handleCancel}>
            关闭
          </Button>,
        ]}
      >
        <EditableProTable<DataSourceType>
          rowKey="id"
          // headerTitle="档案编研目录管理"
          maxLength={20}
          recordCreatorProps={
            position !== 'hidden'
              ? {
                  position: position as 'top',
                  record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
                }
              : false
          }
          columns={columns}
          // request={async () => MlStore.data}
          value={MlStore.data?.data || []}
          onChange={setDataSource}
          editable={{
            type: 'multiple',
            editableKeys,
            onSave: async (rowKey, data, row) => {
              data.daby = { id: MlStore.id };
              await new HttpRequest('')
                .post({ url: '/api/dabyml/', data })
                .then(() => {
                  MlStore.findAll(MlStore.id);
                  message.success('目录添加成功');
                });
            },
            onChange: setEditableRowKeys,
          }}
        />
      </Modal>
    </>
  );
});

export default MlModal;

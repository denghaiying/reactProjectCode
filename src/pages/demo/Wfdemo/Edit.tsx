import React from 'react';
import WkdemoStore from '@/stores/demo/WkdemoStore';
import { Modal, Space, Form, Input, Select, Table } from 'antd';

const Edit = () => {
  return (
    <Modal>
      <Form>
        {WkdemoStore.ctrlWfVisile('wkdemoTitle') &&
          <Form.Item name="wkdemoTitle" label="标题">
            <Input
              // 在下面两种情况下可编辑 1.新增状态可编辑 2.在编辑状态下，流程中允许编辑,
              // 对于没有流程的，直接设置disabled={WkdemoStore.opt === 'view'}
              disabled={WkdemoStore.opt !== 'add' && !(WkdemoStore.opt === 'edit' && WkdemoStore.canWfEdit('wkdemoTitle'))}
            />
          </Form.Item>
        }
      </Form>
    </Modal>
  );
}

export default Edit;

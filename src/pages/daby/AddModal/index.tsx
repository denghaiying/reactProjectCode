import { Button, Form, Input, Modal } from 'antd';
import { observer } from 'mobx-react';

import AddStore from '../store/AddStore';
import MlStore from '../store/MlStore';

import MlModal from '../setML/index';
import HomeStore from '../store/HomeStore';

const AddModal = observer(() => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        form.resetFields();
        const id = await AddStore.save(values);
        AddStore.setModalVisible(false);
        HomeStore.findAll();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
        // setVisible(false)
      });
  };

  const handleOkAndNext = () => {
    form
      .validateFields()
      .then(async (values) => {
        form.resetFields();
        await AddStore.save(values);
        await HomeStore.findAll();
        await AddStore.setModalVisible(false);
        await MlStore.setModalVisibleAndId(true, AddStore.id);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    AddStore.setModalVisible(false);
  };

  return (
    <>
      {/* <div>AddModal</div> */}
      <Modal
        title="档案编研-新增"
        visible={AddStore.isModalVisible}
        onOk={handleOk}
        width={800}
        onCancel={handleCancel}
        footer={[
          <Button key="back" type="primary" onClick={handleOk}>
            保存并关闭
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkAndNext}>
            保存并设置目录
          </Button>,
          <Button key="clock" onClick={handleCancel}>
            关闭
          </Button>,
        ]}
      >
        <Form
          form={form}
          // layout="vertical"
          labelCol={{ span: 3 }}
          name="form_in_modal"
          initialValues={{ modifier: 'public' }}
        >
          <Form.Item
            name="mc"
            label="编研名称"
            rules={[{ required: true, message: '请输入档案编研名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="gzyq" label="工作要求">
            <Input />
          </Form.Item>
          <Form.Item name="gzjh" label="工作计划">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <MlModal />
    </>
  );
});

export default AddModal;

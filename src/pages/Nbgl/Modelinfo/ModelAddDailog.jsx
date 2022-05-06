import { observer } from 'mobx-react';
import React from 'react';
import { Form, Input, Select, Modal, message } from 'antd';
import ModelinfoStore from '../../../stores/Ngbl/ModelinfoStore';
import moment from 'moment';
import SysStore from '../../../stores/system/SysStore';

/**
 * 新增模型的弹框
 */
const formItemLayout = {
  labelCol: {
    span: 6,
  },
};

const ModelAddDailog = observer(props => {
  const { modelVisible, setModelvisible, treeForm } = props;

  const [addForm] = Form.useForm();

  // 获取当前用户名称和维护时间
  const whr = SysStore.getCurrentUser().yhmc;
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');

  const onModelOk = () => {
    addForm.validateFields().then((values) => {
      ModelinfoStore.saveModel(values).then((response) => {
        if (response && response.status === 201) {
          // 给产品和模型的select框赋最新的值
          treeForm.setFieldsValue({ "productId": values['productId'] });
          treeForm.setFieldsValue({ "modelinfoName": values['modelinfoName'] });
          // 根据产品id更新模型数据
          ModelinfoStore.findModelinfoData(values['productId']).then(() => {
            // 根据当前的产品id 和模型id更新树形数据
            ModelinfoStore.findModelTreeData({ id: values['id'], productId: values['productId'] });
          });
          message.success("模型数据添加成功!");
          setModelvisible(false);
          addForm.resetFields();
        } else {
          message.error("模型数据添加失败!")
          setModelvisible(false);
        }
      });
    })
      .catch((info) => {
        message.error(`数据添加失败,${info}`)
      })
  }
  return (
    <Modal
      title="模型信息"
      centered
      forceRender={true}          //  强制渲染modal
      visible={modelVisible}
      onOk={() => { onModelOk() }}
      onCancel={() => setModelvisible(false)}
      width={500}
    >
      <Form form={addForm} {...formItemLayout}>
        <Form.Item label="产品名称:" name="productId" rules={[{ required: true, message: '请选择产品' }]}  >
          <Select allowClear style={{ width: 250 }} options={ModelinfoStore.productSelectData} />
        </Form.Item>
        <Form.Item label='模型编号:' name="modelinfoCode" rules={[{ required: true, message: '请输入模型编号' }]}>
          <Input allowClear style={{ width: 250 }} />
        </Form.Item>
        <Form.Item label="模型名称:" name="modelinfoName" rules={[{ required: true, message: '请输入模型名称' }]}>
          <Input allowClear style={{ width: 250 }} />
        </Form.Item>
        <Form.Item label="模型备注:" name="modelinfoRemark" >
          <Input.TextArea allowClear style={{ width: 250 }} />
        </Form.Item>
        <Form.Item label="维护人:" name="whr" >
          <Input allowClear disabled defaultValue={whr} style={{ width: 250 }} />
        </Form.Item>
        <Form.Item label="维护时间:" name="whsj" >
          <Input allowClear defaultValue={whsj} disabled style={{ width: 250 }} />
        </Form.Item>
      </Form>
    </Modal >
  );
});

export default ModelAddDailog;

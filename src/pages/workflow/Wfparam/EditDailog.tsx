/* eslint-disable no-param-reassign */
import React, { useEffect } from 'react';
import { Select, Input, DatePicker, Modal, Form } from 'antd';
import { useIntl } from 'umi';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import CodeEdit from '../../../components/CodeEdit';
import WfparamStore from '../../../stores/workflow/WfparamStore';
import 'codemirror/mode/sql/sql.js';
// require('codemirror/mode/sql/sql');

const formItemLayout = {
  colon: false,
  labelCol: {
    span: 6,
  },
};
const EditDialog = observer(() => {
  const { formatMessage } = useIntl();
  const { Item: FormItem } = Form;
  const [field] = Form.useForm();
  useEffect(() => {
    field.resetFields();
  }, [WfparamStore.editRecord]);

  const savedata = () => {
    field.validateFields().then((values) => {
      const { whsj } = values;
      if (isMoment(whsj)) {
        values.whsj = whsj.format('YYYY-MM-DD HH:mm:ss');
      }
      values.id = WfparamStore.editRecord?.id;
      values.wfvid = WfparamStore.wfsrvid;
      console.log(values);
      WfparamStore.saveData(values);
    });
  };

  const codeOptions = {
    mode: { name: 'sql' },
    lineNumbers: true,
    tabSize: '2',
  };

  return (
    <Modal
      title={`参数配置【${formatMessage({
        id: `e9.btn.${WfparamStore.opt}`,
      })}】`}
      visible={WfparamStore.editVisible}
      centered
      onOk={() => savedata()}
      onCancel={() => WfparamStore.closeEditForm()}
      width={500}
    >
      <Form
        form={field}
        initialValues={WfparamStore.editRecord}
        {...formItemLayout}
      >
        <FormItem
          label={`${formatMessage({ id: 'e9.wflw.wfparam.code' })}：`}
          name="code"
          rules={[{ required: true, message: '编号不允许为空!' }]}
        >
          <Input
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.wflw.wfparam.code' })}
          />
        </FormItem>
        <FormItem
          label={`${formatMessage({ id: 'e9.wflw.wfparam.name' })}：`}
          name="name"
          rules={[{ required: true, message: '名称不允许为空!' }]}
        >
          <Input
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.wflw.wfparam.name' })}
          />
        </FormItem>
        <FormItem
          label={`${formatMessage({ id: 'e9.wflw.wfparam.lx' })}：`}
          name="lx"
        >
          <Select
            placeholder={formatMessage({ id: 'e9.wflw.wfparam.lx' })}
            style={{ width: '100%' }}
            disabled
          >
            <Select.Option value="U">
              {formatMessage({ id: 'e9.wflw.wfparam.typeU' })}
            </Select.Option>
            <Select.Option value="S">
              {formatMessage({ id: 'e9.wflw.wfparam.typeS' })}
            </Select.Option>
          </Select>
        </FormItem>
        <FormItem
          label={`${formatMessage({ id: 'e9.wflw.wfparam.sqltext' })}：`}
          name="sqltext"
          rules={[{ required: true, message: 'SQL不允许为空!' }]}
        >
          <CodeEdit options={codeOptions} />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.pub.whr' })}：`} name="whr">
          <Input
            maxLength={20}
            disabled
            placeholder={formatMessage({ id: 'e9.pub.whr' })}
          />
        </FormItem>
        <FormItem
          label={`${formatMessage({ id: 'e9.pub.whsj' })}：`}
          name="whsj"
        >
          <DatePicker
            showTime
            disabled
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.pub.whsj' })}
          />
        </FormItem>
      </Form>
    </Modal>
  );
});

export default EditDialog;

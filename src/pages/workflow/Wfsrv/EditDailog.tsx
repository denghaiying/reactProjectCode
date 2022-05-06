import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Input, DatePicker, Form, Modal } from 'antd';
import { useIntl } from 'umi';
import { isMoment } from 'moment';
import WfsrvStore from '../../../stores/workflow/WfsrvStore';

const formItemLayout = {
  colon: false,
  labelCol: {
    span: 6
  },
};
const EditDialog = observer(() => {
  const { formatMessage } = useIntl();
  const { Item: FormItem } = Form;
  const [field] = Form.useForm();
  useEffect(() => {
    field.resetFields();
  }, [WfsrvStore.editRecord]);

  const savedata = (() => {
    field
      .validateFields()
      .then(values => {
        const { whsj } = values;
        if (isMoment(whsj)) {
          values.whsj = whsj.format('YYYY-MM-DD HH:mm:ss');
        }
        WfsrvStore.saveData(values);
      });
  });

  return (
    <Modal
      title={`业务配置【${formatMessage({ id: `e9.btn.${WfsrvStore.opt}` })}】`}
      visible={WfsrvStore.editVisible}
      centered
      onOk={() => savedata()}
      onCancel={() => WfsrvStore.closeEditForm()}
      width={500}
    >
      <Form
        form={field}
        initialValues={WfsrvStore.editRecord}
        {...formItemLayout}
      >
        <FormItem label={`${formatMessage({ id: 'e9.wflw.wfsrv.wfvid' })}：`} name="wfvid">
          <Input
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.wflw.wfsrv.wfvid' })}
            disabled
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.wflw.wfsrv.name' })}：`} name="name" rules={[{ required: true, message: '名称不允许为空!' }]}>
          <Input
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.wflw.wfsrv.name' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.wflw.wfsrv.title' })}：`} name="title" rules={[{ required: true, message: '标题不允许为空!' }]}>
          <Input
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.wflw.wfsrv.title' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.wflw.wfsrv.wktable' })}：`} name="wktable" rules={[{ required: true, message: '数据表不允许为空!' }]}>
          <Input
            maxLength={20}
            disabled
            placeholder={formatMessage({ id: 'e9.wflw.wfsrv.wktable' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.wflw.wfsrv.cspz' })}：`} name="cspz">
          <Input.TextArea
            rows={4}
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder={formatMessage({ id: 'e9.wflw.wfsrv.cspz' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.pub.whr' })}：`} name="whr">
          <Input
            maxLength={20}
            disabled
            placeholder={formatMessage({ id: 'e9.pub.whr' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.pub.whsj' })}：`} name="whsj">
          <DatePicker
            showTime
            disabled
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.pub.whsj' })}
          />
        </FormItem>
      </Form >
    </Modal >
  );
});

export default (EditDialog);


import React from 'react';
import { Input, DatePicker, Switch, Select, Message, Form } from '@alifd/next';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import EditForm from '../../../components/EditForm';
import ChanneltypeStore from '../../../stores/selfstreaming/channeltype/Channeltype';
import { useIntl, FormattedMessage } from 'umi';
const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const EditDialog = observer(props => {
  // const { intl: { formatMessage } } = props;
  const { Item: FormItem } = Form;
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  const savedata = ((values, errors) => {
    if (!errors) {
      const { whsj } = values;
      if (isMoment(whsj)) {
        values.whsj = whsj.format('YYYY-MM-DD HH:mm:ss');
      }
      ChanneltypeStore.saveData(values);
    }
  });

  return (
    <EditForm
      title={formatMessage({ id: 'e9.channeltype.channeltype.title' })}
      visible={ChanneltypeStore.editVisible}
      footer={false}
      onClose={() => ChanneltypeStore.closeEditForm()}
      opt={ChanneltypeStore.opt}
      style={{ width: '450px' }}
    >
      <Form size="small" value={ChanneltypeStore.editRecord} onChange={ChanneltypeStore.onRecordChange} {...formItemLayout}>
        <FormItem required label={`${formatMessage({ id: 'e9.channeltype.channeltype.channeltypebh' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="channeltypebh"
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.channeltype.channeltype.channeltypebh' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.channeltype.channeltype.channeltypename' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="channeltypename"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.channeltype.channeltype.channeltypename' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.pub.whsj' })}：`}>
          <DatePicker
            name="whsj"
            style={{ width: '100%' }}
            showTime
            disabled
            placeholder={formatMessage({ id: 'e9.pub.whsj' })}
          />
        </FormItem>
        <FormItem wrapperCol={{ offset: 20 }} style={{ marginTop: 24 }}>
          <Form.Submit validate type="primary" onClick={savedata}>{formatMessage({ id: 'e9.btn.save' })}</Form.Submit>
        </FormItem>
      </Form>
    </EditForm >
  );
});

export default EditDialog;

import React from 'react';
import { Input, DatePicker, Switch, Select, Message, Form } from '@alifd/next';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import EditForm from '../../../components/EditForm';
import ContentStore from '../../../stores/selfstreaming/content/Content';
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
  const { channelData } = ContentStore;
  // const { intl: { formatMessage } } = props;
  const { Item: FormItem } = Form;
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  const savedata = ((values, errors) => {
    if (!errors) {
      const { contentwhsj,contentcreatedate } = values;
      if (isMoment(contentwhsj)) {
        values.contentwhsj = contentwhsj.format('YYYY-MM-DD HH:mm:ss');
      }
      if (isMoment(contentcreatedate)) {
        values.contentcreatedate = contentcreatedate.format('YYYY-MM-DD HH:mm:ss');
      }
      ContentStore.saveData(values);
    }
  });

  return (
    <EditForm
      title={formatMessage({ id: 'e9.content.content.title' })}
      visible={ContentStore.editVisible}
      footer={false}
      onClose={() => ContentStore.closeEditForm()}
      opt={ContentStore.opt}
      style={{ width: '550px' }}
    >
      <Form size="small" value={ContentStore.editRecord} onChange={ContentStore.onRecordChange} {...formItemLayout}>
          <FormItem required label={`${formatMessage({ id: 'e9.content.content.contentbh' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="contentbh"
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.content.content.contentbh' })}
          />
        </FormItem>
          <FormItem required label={`${formatMessage({ id: 'e9.content.content.contenttitle' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input.TextArea
            name="contenttitle"
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.content.content.contenttitle' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.content.content.contentchannelid' })}：`} required requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Select
            name="contentchannelid" dataSource={channelData}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.content.content.contentchannelid' })}
          >
           {ContentStore.channelData.map(item => (
              <Select.Option key={item.channelid} value={item.channelid}>{item.channelname}</Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.content.content.contentcreatedate' })}：`}>
          <DatePicker
            name="contentcreatedate"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.content.content.contentcreatedate' })}
          />
        </FormItem>
        <FormItem  label={`${formatMessage({ id: 'e9.content.content.contentauthor' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="contentauthor"
            maxLength={20}
            disabled
            placeholder={formatMessage({ id: 'e9.content.content.contentauthor' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.pub.whsj' })}：`}>
          <DatePicker
            name="contentwhsj"
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

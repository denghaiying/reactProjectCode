import React from 'react';
import { Input, DatePicker, Switch, Select, Message, Form } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import EditForm from '../../../components/EditForm';
import ChannelStore from '../../../stores/selfstreaming/channel/Channel';
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
  const { typeData, zslxData ,channeData} = ChannelStore;
  // const { intl: { formatMessage } } = props;
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  const { Item: FormItem } = Form;

  const savedata = ((values, errors) => {
    if (!errors) {
      const { channelwhsj } = values;
      if (isMoment(channelwhsj)) {
        values.channelwhsj = channelwhsj.format('YYYY-MM-DD HH:mm:ss');
      }
      ChannelStore.saveData(values);
    }
  });

  return (
    <EditForm
      title={formatMessage({ id: 'e9.channel.channel.title' })}
      visible={ChannelStore.editVisible}
      footer={false}
      onClose={() => ChannelStore.closeEditForm()}
      opt={ChannelStore.opt}
      style={{ width: '450px' }}
    >
      <Form size="small" value={ChannelStore.editRecord} onChange={ChannelStore.onRecordChange} {...formItemLayout}>
        <FormItem  label={`${formatMessage({ id: 'e9.channel.channel.channelfid' })}：`}>
           <Select
            name="channelfid"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.channel.channel.channelfid' })}
          >
            {ChannelStore.channelList.map(item => (
              <Select.Option key={item.channelid} value={item.channelid}>{item.channelname}</Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.channel.channel.channelbh' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="channelbh"
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.channel.channel.channelbh' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.channel.channel.channelname' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="channelname"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.channel.channel.channelname' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.channel.channel.channeltype' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
           <Select
            name="channeltype"  dataSource={typeData}
            style={{ width: '100%' }} 
            placeholder={formatMessage({ id: 'e9.channel.channel.channeltype' })}
          >
             {ChannelStore.typeData.map(item => (
              <Select.Option key={item.channeltypebh} value={item.channeltypebh}>{item.channeltypename}</Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.channel.channel.channelzslx' })}：`}  requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Select
            name="channelzslx" dataSource={zslxData}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.channel.channel.channelzslx' })}
          >
     
          </Select>
        </FormItem>

        <FormItem label={`${formatMessage({ id: 'e9.pub.whsj' })}：`}>
          <DatePicker
            name="channelwhsj"
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

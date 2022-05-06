import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Message, Button, Icon } from '@alifd/next';
import { injectIntl } from 'react-intl';
import EditForm from '../../../components/EditForm';
import OrgStore from '../../../stores/user/OrgStore';

const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const OrgType = {
  A: '单位',
  B: '部门',
};
const EditDialog = observer(props => {
  const { intl: { formatMessage } } = props;
  const { Item: FormItem } = Form;
  const [field, setField] = useState(null);

  const savedata = (() => {
    field.validate((errors, values) => {
      if (!errors) {
        const { orgQyrq, orgTyrq, whsj } = values;

        if (isMoment(orgQyrq)) {
          values.orgQyrq = orgQyrq.format('YYYY-MM-DD');
        }
        if (isMoment(orgTyrq)) {
          values.orgTyrq = orgTyrq.format('YYYY-MM-DD');
        }
        if (isMoment(whsj)) {
          values.whsj = whsj.format('YYYY-MM-DD HH:mm:ss');
        }
        if (values.orgTyrq != null && values.orgTyrq.valueOf() < values.orgQyrq.valueOf()) {
          return Message.warning({ title: formatMessage({ id: 'e9.info.data.warning' }), duration: 1500 });
        }
        OrgStore.setSelectRows([], []);
        OrgStore.saveData(values);
      }
    });
  });

  return (
    <EditForm
      title={formatMessage({ id: 'e9.sys.org.title' })}
      visible={OrgStore.editVisible}
      footer={false}
      onClose={() => OrgStore.closeEditForm()}
      //  onOk={() => savedata}
      // onCancel={() => { () => OrgStore.closeEditForm() }}
      opt={OrgStore.opt}
      style={{ width: '500px' }}
      extra={
        <span>
          <Button.Group style={{ marginLeft: '10px' }} >
            <Button type="primary" onClick={savedata}><Icon className="iconfont iconsave" />{formatMessage({ id: 'e9.btn.save' })}</Button>
          </Button.Group>
        </span >}
    >
      <Form
        value={OrgStore.editRecord}
        onChange={OrgStore.onRecordChange}
        {...formItemLayout}
        saveField={(f) => {
          setField(f);
        }}
      >
        <FormItem required label={`${formatMessage({ id: 'e9.sys.org.orgType' })}：`}>
          <Select
            name="orgType"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.sys.org.orgType' })}
          >
            {Object.entries(OrgType).map(([key, value]) => (<Select.Option value={key}>{value}</Select.Option>))}
          </Select>
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.org.orgCode' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="orgCode"
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.sys.org.orgCode' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.org.orgName' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="orgName"
            maxLength={50}
            placeholder={formatMessage({ id: 'e9.sys.org.orgName' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.org.orgUserid' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`} >
          <Select
            name="userId"
            dataSource={OrgStore.userSelect}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.sys.org.orgUserid' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.sys.org.orgQyrq' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <DatePicker
            name="orgQyrq"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.sys.org.orgQyrq' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.sys.org.orgTyrq' })}：`}>
          <DatePicker
            name="orgTyrq"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.sys.org.orgTyrq' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.pub.whr' })}：`}>
          <Input
            name="whr"
            maxLength={20}
            disabled
            placeholder={formatMessage({ id: 'e9.pub.whr' })}
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
      </Form>
    </EditForm>
  );
});

export default injectIntl(EditDialog);


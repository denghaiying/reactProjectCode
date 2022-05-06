import React, { useState } from 'react';
import { Button, Input, DatePicker, NumberPicker, Switch, Icon, Form } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import EditForm from '../../../components/EditForm';
import SrvStore from '../../../stores/doc/SrvStore';

const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const EditDialog = observer(props => {
  const { intl: { formatMessage } } = props;
  const { Item: FormItem } = Form;
  const [field, setField] = useState(null);

  const savedata = (() => {
    field.validate((errors, values) => {
      if (!errors) {
        const { whsj, userQyrq, userTyrq } = values;

        if (isMoment(whsj)) {
          values.whsj = whsj.format('YYYY-MM-DD HH:mm:ss');
        }
        if (userQyrq && isMoment(userQyrq)) {
          values.userQyrq = userQyrq.format('YYYY-MM-DD');
        }
        if (userTyrq && isMoment(userTyrq)) {
          values.userTyrq = userTyrq.format('YYYY-MM-DD');
        }
        SrvStore.saveData(values);
      }
    });
  });

  return (
    <EditForm
      title={formatMessage({ id: 'e9.doc.srv.title' })}
      visible={SrvStore.editVisible}
      footer={false}
      onClose={() => SrvStore.closeEditForm()}
      opt={SrvStore.opt}
      style={{ width: '500px' }}
      extra={
        <span>
          <Button.Group style={{ marginLeft: '10px' }} >
            <Button type="primary" onClick={savedata}><Icon className="iconfont iconsave" />{formatMessage({ id: 'e9.btn.save' })}</Button>
          </Button.Group>
        </span >}
    >
      <Form
        value={SrvStore.editRecord}
        onChange={SrvStore.onRecordChange}
        {...formItemLayout}
        saveField={(f) => {
          setField(f);
        }}
      >
        <FormItem required label={`${formatMessage({ id: 'e9.doc.srv.srvUrl' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`} >
          <Input
            name="srvUrl"
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.doc.srv.srvUrl' })}
          />
        </FormItem>
        <FormItem required requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`} label={`${formatMessage({ id: 'e9.doc.srv.srvPort' })}：`} >
          <NumberPicker
            name="srvPort"
            placeholder={formatMessage({ id: 'e9.doc.srv.srvPort' })}
            style={{ width: '100%' }}
          />
        </FormItem>
        <FormItem required requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`} label={`${formatMessage({ id: 'e9.doc.srv.srvAkey' })}：`}>
          <Input
            name="akey"
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.doc.srv.srvAkey' })}
          />
        </FormItem>
        <FormItem required requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`} label={`${formatMessage({ id: 'e9.doc.srv.srvSkey' })}：`}>
          <Input.Password
            name="skey"
            maxLength={40}
            placeholder={formatMessage({ id: 'e9.doc.srv.srvSkey' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.doc.srv.srvDisable' })}：`}>
          <Switch
            name="denable"
            size="small"
            style={{ width: '25%' }}
            checked={SrvStore.editRecord.denable}
            checkedChildren={formatMessage({ id: 'e9.pub.enable' })}
            unCheckedChildren={formatMessage({ id: 'e9.pub.enable' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.pub.whr' })}：`}>
          <Input
            name="whr"
            maxLength={20}
            readOnly
            placeholder={formatMessage({ id: 'e9.pub.whr' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.pub.whsj' })}：`}>
          <DatePicker
            name="whsj"
            showTime
            disabled
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.pub.whsj' })}
          />
        </FormItem>
      </Form>
    </EditForm >
  );
});

export default injectIntl(EditDialog);

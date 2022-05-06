import React from 'react';
import {Button, Input, DatePicker, NumberPicker,Radio} from '@alifd/next';
import { injectIntl } from 'react-intl';
import { isMoment } from 'moment';
const { Group: RadioGroup } = Radio;
import { E9FormBinderWrapper, EFormBinder }  from '../../../components/EFormBinder';
import EditForm from '../../../components/EditForm';
import Store from "../../../stores/longpreservation/StoreManagerStore";

const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const EditDialog = props => {
  const store = Stroes.useStore('storeManager_store');
  const { intl: { formatMessage } } = props;

  const form = React.createRef();
  const savedata = () => {
    const { validateFields } = form.current;
    validateFields((errors, values) => {
      if (!errors) {
        const { whsj } = values;

        if (isMoment(whsj)) {
          values.whsj = whsj.format('YYYY-MM-DD HH:mm:ss');
        }

        store.saveData(values);
      }
    });
  };

  return (
    <EditForm
      title={formatMessage({ id: 'e9.longpriservation.storemanager.title' })}
      visible={store.modalVisible}
      footer={<Button type="primary" onClick={savedata}>{formatMessage({ id: 'e9.btn.save' })}</Button>}
      onClose={() => store.closeEditForm()}
      opt={store.opt}
      style={{ width: '450px' }}
    >
      <E9FormBinderWrapper value={store.editRecord} onChange={store.resetEditRecord} formItemLayout={formItemLayout} refForm={form}>
        <EFormBinder name="name" required label={`${formatMessage({ id: 'e9.longpriservation.storemanager.name' })}：`}>
          <Input
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.longpriservation.storemanager.name' })}
          />
        </EFormBinder>
        <EFormBinder name="srv" required label={`${formatMessage({ id: 'e9.longpriservation.storemanager.srv' })}：`}>
          <Input
              name="srv"
              placeholder={formatMessage({
                id: "e9.longpriservation.storemanager.srv"
              })}/>
        </EFormBinder>
        <EFormBinder name="port" required label={`${formatMessage({ id: 'e9.longpriservation.storemanager.port' })}：`}>
          <NumberPicker
              name="port"
              maxLength={100000} style={{ width: "80%" }}
              placeholder={formatMessage({
                id: "e9.longpriservation.storemanager.srv"
              })}/>
        </EFormBinder>
        <EFormBinder name="username" required label={`${formatMessage({ id: 'e9.longpriservation.storemanager.username' })}：`}>
          <Input
              name="username"
              placeholder={formatMessage({
                id: "e9.longpriservation.storemanager.username"
              })}/>
        </EFormBinder>
        <EFormBinder name="psw" required label={`${formatMessage({ id: 'e9.longpriservation.storemanager.psw' })}：`}>
          <Input
              name="psw"
              placeholder={formatMessage({
                id: "e9.longpriservation.storemanager.psw"
              })}/>
        </EFormBinder>

        <EFormBinder name="ty" required label={`${formatMessage({ id: 'e9.longpriservation.storemanager.ty' })}：`}>
          <RadioGroup name="ty" defaultValue="json" >
            <Radio value="Y">是</Radio>
            <Radio value="N">否</Radio>
          </RadioGroup>
        </EFormBinder>
        <EFormBinder name="bz" required label={`${formatMessage({ id: 'e9.longpriservation.storemanager.bz' })}：`}>
          <Input.TextArea  placeholder={formatMessage({
            id: "e9.longpriservation.storemanager.bz"
          })} aria-label="TextArea" />
        </EFormBinder>
        <EFormBinder name="whr" label={`${formatMessage({ id: 'e9.pub.whr' })}：`}>
          <Input
            maxLength={20}
            readOnly
            placeholder={formatMessage({ id: 'e9.pub.whr' })}
          />
        </EFormBinder>
        <EFormBinder name="whsj" label={`${formatMessage({ id: 'e9.pub.whsj' })}：`}>
          <DatePicker
            showTime
            disabled
            placeholder={formatMessage({ id: 'e9.pub.whsj' })}
          />
        </EFormBinder>
      </E9FormBinderWrapper>
    </EditForm >
  );
};

export default injectIntl(EditDialog);

import React from 'react';
import {Button, Input, DatePicker, NumberPicker} from '@alifd/next';
import { injectIntl } from 'react-intl';
import { isMoment } from 'moment';

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
  const store = Stroes.useStore('user_role');
  const { intl: { formatMessage } } = props;

  const form = React.createRef();
  const savedata = () => {
    const { validateFields } = form.current;
    validateFields((errors, values) => {
      if (!errors) {
        const { whsj, roleQyrq, roleTyrq } = values;

        if (isMoment(whsj)) {
          values.whsj = whsj.format('YYYY-MM-DD HH:mm:ss');
        }
        if (roleQyrq && isMoment(roleQyrq)) {
          values.roleQyrq = roleQyrq.format('YYYY-MM-DD');
        }
        if (roleTyrq && isMoment(roleTyrq)) {
          values.userTyrq = roleTyrq.format('YYYY-MM-DD');
        }
        store.saveData(values);
      }
    });
  };

  return (
    <EditForm
      title={formatMessage({ id: 'e9.longpriservation.storeinfo.title' })}
      visible={store.modalVisible}
      footer={<Button type="primary" onClick={savedata}>{formatMessage({ id: 'e9.btn.save' })}</Button>}
      onClose={() => store.closeEditForm()}
      opt={store.opt}
      style={{ width: '450px' }}
    >
      <E9FormBinderWrapper value={store.editRecord} onChange={store.resetEditRecord} formItemLayout={formItemLayout} refForm={form}>
        <EFormBinder name="name" required label={`${formatMessage({ id: 'e9.longpriservation.storeinfo.name' })}：`}>
          <Input
            maxLength={20}
            placeholder={formatMessage({ id: 'e9.longpriservation.storeinfo.name' })}
          />
        </EFormBinder>
        <EFormBinder name="capacity" required label={`${formatMessage({ id: 'e9.longpriservation.storeinfo.capacity' })}：`}>
          <NumberPicker
              name="capacity"
              maxLength={100} style={{ width: "80%" }}
              placeholder={formatMessage({
                id: "e9.longpriservation.storeinfo.capacity"
              })}/>
        </EFormBinder>
        <EFormBinder name="capacityratio" required label={`${formatMessage({ id: 'e9.longpriservation.storeinfo.capacityratio' })}：`}>
          <NumberPicker
              name="capacityratio"
              maxLength={100} style={{ width: "80%" }}
              placeholder={formatMessage({
                id: "e9.longpriservation.storeinfo.capacityratio"
              })}/>
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

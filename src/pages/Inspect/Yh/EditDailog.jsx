import React from 'react';
import { Button, Input, DatePicker, Select, Switch } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import { E9FormBinderWrapper, EFormBinder } from '../../../components/EFormBinder';
import EditForm from '../../../components/EditForm';
import YhStore from '../../../stores/inspect/YhStore';

const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const EditDialog = observer(props => {
  const { intl: { formatMessage } } = props;
  const form = React.createRef();

  /**
   * 编辑框保存
   */
  const savedata = () => {
    const { validateFields } = form.current;
    validateFields((errors, values) => {
      if (!errors) {
        const { yhWhsj, yhQyrq, yhTyrq } = values;
        if (isMoment(yhWhsj)) {
          values.yhWhsj = yhWhsj.format('YYYY-MM-DD HH:mm:ss');
        }
        if (isMoment(yhQyrq)) {
          values.yhQyrq = yhQyrq.format('YYYY-MM-DD HH:mm:ss');
        }
        if (isMoment(yhTyrq)) {
          values.yhTyrq = yhTyrq.format('YYYY-MM-DD HH:mm:ss');
        }
        values.yhTy = values.yhTy ? 'Y' : 'N';
        YhStore.saveData(values);
      }
    });
  };
  const yhztSelect = [
    { label: formatMessage({ id: 'e9.yh.pt' }), value: 'N' },
    { label: formatMessage({ id: 'e9.yh.admin' }), value: 'Y' }];

  return (
    <EditForm
      title={formatMessage({ id: 'e9.yh.title' })}
      visible={YhStore.editVisible}
      footer={YhStore.opt === 'view' ? false : <Button type="primary" onClick={savedata}>{formatMessage({ id: 'e9.btn.save' })}</Button>}
      onClose={() => YhStore.closeEditForm()}
      opt={YhStore.opt}
      style={{ width: '450px' }}
    >
      <E9FormBinderWrapper value={YhStore.editRecord} onChange={YhStore.resetEditRecord} formItemLayout={formItemLayout} refForm={form}>
        <EFormBinder required name="yhYhmc" label={`${formatMessage({ id: 'e9.yh.yhYhmc' })}：`} message={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            disabled={YhStore.dataView}
            maxLength={20}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.yh.yhYhmc' })}
          />
        </EFormBinder>
        <EFormBinder required label={`${formatMessage({ id: 'e9.yh.yhBh' })}：`} name="yhBh" message={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            disabled={YhStore.dataView}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.yh.yhBh' })}
          />
        </EFormBinder>
        <EFormBinder required label={`${formatMessage({ id: 'e9.yh.yhLx' })}：`} name="yhLx" message={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Select
            disabled={YhStore.dataView}
            dataSource={yhztSelect}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.yh.yhLx' })}
          />
        </EFormBinder>
        <EFormBinder required label={`${formatMessage({ id: 'e9.yh.yhSjh' })}：`} name="yhSjh" message={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            disabled={YhStore.dataView}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.yh.yhSjh' })}
          />
        </EFormBinder>
        <EFormBinder required label={`${formatMessage({ id: 'e9.yh.yhMail' })}：`} name="yhMail" message={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            disabled={YhStore.dataView}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.yh.yhMail' })}
          />
        </EFormBinder>
        <EFormBinder required label={`${formatMessage({ id: 'e9.yh.yhTy' })}：`} name="yhTy" message={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Switch
            size="medium"
            checkedChildren={`${formatMessage({ id: 'e9.yh.startUsing' })}`}
            unCheckedChildren={`${formatMessage({ id: 'e9.yh.outOfService' })}`}
            onChange={YhStore.onChangeSwitch}
            disabled={YhStore.dataView}
            style={{ width: '25%' }}
            defaultChecked={YhStore.editRecord.yhTy}
            placeholder={formatMessage({ id: 'e9.yh.yhTy' })}
          />
        </EFormBinder>
        {YhStore.tyType ?
          <EFormBinder required={YhStore.tyType} label={`${formatMessage({ id: 'e9.yh.yhQyrq' })}：`} name="yhQyrq" message={`${formatMessage({ id: 'e9.info.data.require' })}`}>
            <DatePicker
              disabled={YhStore.dataView}
              style={{ width: '100%' }}
              placeholder={formatMessage({ id: 'e9.yh.yhQyrq' })}
            />
          </EFormBinder>
          :
          <EFormBinder required={!YhStore.tyType} label={`${formatMessage({ id: 'e9.yh.yhTyrq' })}：`} name="yhTyrq" message={`${formatMessage({ id: 'e9.info.data.require' })}`}>
            <DatePicker
              disabled={YhStore.dataView}
              style={{ width: '100%' }}
              placeholder={formatMessage({ id: 'e9.yh.yhTyrq' })}
            />
          </EFormBinder>}
        <EFormBinder required label={`${formatMessage({ id: 'e9.yh.yhBz' })}：`} name="yhBz" message={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            disabled={YhStore.dataView}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.yh.yhBz' })}
          />
        </EFormBinder>
        <EFormBinder label={`${formatMessage({ id: 'e9.yh.whrid' })}：`} name="yhWhrid" message={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            disabled
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.yh.whrid' })}
          />
        </EFormBinder>
        <EFormBinder name="yhWhr" label={`${formatMessage({ id: 'e9.pub.whr' })}：`}>
          <Input
            maxLength={20}
            style={{ width: '100%' }}
            disabled
            placeholder={formatMessage({ id: 'e9.pub.whr' })}
          />
        </EFormBinder>
        <EFormBinder name="yhWhsj" label={`${formatMessage({ id: 'e9.pub.whsj' })}：`}>
          <DatePicker
            showTime
            disabled
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.pub.whsj' })}
          />
        </EFormBinder>
      </E9FormBinderWrapper>
    </EditForm >
  );
});

export default injectIntl(EditDialog);

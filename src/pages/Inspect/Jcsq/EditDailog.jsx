import React from 'react';
import { Button, Input, DatePicker, Select, Grid } from '@alifd/next';
import { injectIntl } from 'react-intl';
import moment, { isMoment } from 'moment';
import { observer } from 'mobx-react';
import JcsqStore from '../../../stores/inspect/JcsqStore';
import { E9FormBinderWrapper, EFormBinder } from '../../../components/EFormBinder';
import EditForm from '../../../components/EditForm';


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
  const { opt } = JcsqStore;
  const form = React.createRef();
  /**
   * 编辑框保存
   */
  const savedata = () => {
    const { validateFields } = form.current;
    validateFields((errors, values) => {
      if (!errors) {
        const { jcsqWhsj, jcsqSqrq } = values;
        if (isMoment(jcsqWhsj)) {
          values.jcsqWhsj = jcsqWhsj.format('YYYY-MM-DD HH:mm:ss');
        }
        if (isMoment(jcsqWhsj)) {
          values.jcsqSqrq = jcsqSqrq.format('YYYY-MM-DD');
        }
        JcsqStore.saveData(values);
      }
    });
  };
  const disabledDate = ((date) => {
    return date.valueOf() >= moment().valueOf();
  });
  const onchange = ((value) => {
    JcsqStore.changeRange(value);
  });

  return (
    <EditForm
      title={formatMessage({ id: 'Jcsq.title' })}
      visible={JcsqStore.editVisible}
      footer={opt !== 'view' ? <Button type="primary" onClick={savedata}>{formatMessage({ id: 'e9.btn.save' })}</Button> : false}
      onClose={() => JcsqStore.closeEditForm()}
      opt={JcsqStore.opt}
      shouldUpdatePositionf
      style={{ width: '450px' }}
    >
      <E9FormBinderWrapper formItemLayout={formItemLayout} value={JcsqStore.editRecord} refForm={form} bodyStyle={{ width: '80%' }}>
        <EFormBinder required label={`${formatMessage({ id: 'Jcsq.jcsqSqdw' })}：`} message={`${formatMessage({ id: 'e9.info.data.require' })}`} name="jcsqSqdw">
          <Input
            disabled={opt === 'view'}
            maxLength={20}
            style={{ width: '110%' }}
            placeholder={formatMessage({ id: 'Jcsq.jcsqSqdw' })}
          />
        </EFormBinder>
        <EFormBinder required label={`${formatMessage({ id: 'Jcsq.jcsqJcfw' })}：`} message={`${formatMessage({ id: 'e9.info.data.require' })}`} name="jcsqJcfw">
          <Select
            disabled={opt === 'view'}
            style={{ width: '110%' }}
            placeholder={formatMessage({ id: 'Jcsq.jcsqJcfw' })}
            onChange={onchange}
          >
            <Select.Option value="A">{formatMessage({ id: 'Jcsq.clausesAndSubclauses' })}</Select.Option>
            <Select.Option value="B">{formatMessage({ id: 'Jcsq.value' })}</Select.Option>
            <Select.Option value="C">{formatMessage({ id: 'Jcsq.text' })}</Select.Option>
          </Select>
        </EFormBinder>
        <EFormBinder required name="jcsqSqrq" message={`${formatMessage({ id: 'e9.info.data.require' })}`} label={`${formatMessage({ id: 'Jcsq.jcsqSqrq' })}：`}>
          <DatePicker
            disabled={opt === 'view'}
            disabledDate={disabledDate}
            placeholder={formatMessage({ id: 'Jcsq.jcsqSqrq' })}
            style={{ width: '110%' }}
          />
        </EFormBinder>
        <EFormBinder required label={`${formatMessage({ id: 'Jcsq.jcsqSqsm' })}：`} message={`${formatMessage({ id: 'e9.info.data.require' })}`} name="jcsqSqsm">
          <Input
            disabled={opt === 'view'}
            style={{ width: '110%' }}
            maxLength={50}
            placeholder={formatMessage({ id: 'Jcsq.jcsqSqsm' })}
          />
        </EFormBinder>
        {
          JcsqStore.range === 'A' ? (
            <EFormBinder required label={`${formatMessage({ id: 'Jcsq.jcsqPpgz' })}：`} message={`${formatMessage({ id: 'e9.info.data.require' })}`} name="jcsqPpgz">
              <Select
                dataSource={JcsqStore.exprData}
                disabled={opt === 'view'}
                style={{ width: '110%' }}
                placeholder={formatMessage({ id: 'Jcsq.jcsqPpgz' })}
              />
            </EFormBinder>
          ) : <div />
        }
        {
          (JcsqStore.range === 'A' || JcsqStore.range === 'C') ? (
            <EFormBinder required label={`${formatMessage({ id: 'Jcsq.jcsqYwdir' })}：`} message={`${formatMessage({ id: 'e9.info.data.require' })}`} name="jcsqYwdir">
              <Input
                disabled={opt === 'view'}
                style={{ width: '110%' }}
                placeholder={formatMessage({ id: 'Jcsq.jcsqYwdir' })}
              />
            </EFormBinder>
          ) : <div />
        }
        <EFormBinder name="jcsqWhr" label={`${formatMessage({ id: 'e9.pub.whr' })}：`}>
          <Input
            maxLength={20}
            style={{ width: '110%' }}
            disabled
            placeholder={formatMessage({ id: 'e9.pub.whr' })}
          />
        </EFormBinder>
        <EFormBinder required name="jcsqWhsj" message={`${formatMessage({ id: 'e9.info.data.require' })}`} label={`${formatMessage({ id: 'e9.pub.whsj' })}：`}>
          <DatePicker
            showTime
            disabled
            style={{ width: '110%' }}
            placeholder={formatMessage({ id: 'e9.pub.whsj' })}
          />
        </EFormBinder>
      </E9FormBinderWrapper>
    </EditForm >
  );
});

export default injectIntl(EditDialog);

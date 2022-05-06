import React from 'react';
import { Button, Input } from '@alifd/next';
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

const EditPassword = observer(props => {
  const { intl: { formatMessage } } = props;
  const form = React.createRef();

  /**
   * 编辑框保存
   */
  const savedataMm = () => {
    const { validateFields } = form.current;
    validateFields((errors, values) => {
      if (!errors) {
        const { yhWhsj } = values;
        if (isMoment(yhWhsj)) {
          values.yhWhsj = yhWhsj.format('YYYY-MM-DD HH:mm:ss');
        }
        YhStore.saveDataMm(values);
      }
    });
  };

  return (
    <EditForm
      title={formatMessage({ id: 'e9.yh.title' })}
      visible={YhStore.editVisibleMm}
      footer={<Button type="primary" onClick={savedataMm}>{formatMessage({ id: 'e9.btn.save' })}</Button>}
      onClose={() => YhStore.closeEditFormMm()}
      opt={YhStore.opt}
      style={{ width: '450px' }}
    >
      <E9FormBinderWrapper value={YhStore.editRecord} onChange={YhStore.resetEditRecord} formItemLayout={formItemLayout} refForm={form}>
        <EFormBinder required name="yhYhmc" label={`${formatMessage({ id: 'e9.yh.yhYhmc' })}：`} message={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            disabled
            maxLength={20}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.yh.yhYhmc' })}
          />
        </EFormBinder>
        <EFormBinder required label={`${formatMessage({ id: 'e9.yh.yhMm' })}：`} name="yhMm" message={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.yh.yhMm' })}
          // onChange={ e => this.setState({ password: e.target.value})}
          />
        </EFormBinder>
      </E9FormBinderWrapper>
    </EditForm >
  );
});

export default injectIntl(EditPassword);

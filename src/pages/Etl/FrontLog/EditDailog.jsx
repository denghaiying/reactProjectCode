import React from 'react';
import { Button, Input, DatePicker, NumberPicker, Select } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';

import { E9FormBinderWrapper, EFormBinder } from '../../../components/EFormBinder';
import EditForm from '../../../components/EditForm';
import FrontIntStore from '../../../stores/etl/FrontIntStore';

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
  const savedata = () => {
    const { validateFields } = form.current;
    validateFields((errors, values) => {
      if (!errors) {
        const { whsj } = values;

        if (isMoment(whsj)) {
          values.whsj = whsj.format('YYYY-MM-DD HH:mm:ss');
        }
     
        FrontIntStore.saveData(values);
      }
    });
  };

  return (
    <EditForm
      title={formatMessage({ id: 'e9.etl.frontinf.title' })}
      visible={FrontIntStore.editVisible}
      footer={<Button type="primary" onClick={savedata}>{formatMessage({ id: 'e9.btn.save' })}</Button>}
      onClose={() => FrontIntStore.closeEditForm()}
      opt={FrontIntStore.opt}
      style={{ width: '450px' }}
    >
{/*      'e9.etl.frontinf.id': '编号',
  'e9.etl.frontinf.title': '前置接口',
  'e9.etl.frontinf.tb': '表名',
  'e9.etl.frontinf.search': '查询字段',
  'e9.etl.frontinf.page': '页数',
  'e9.etl.frontinf.size': '每页大小',
  'e9.etl.frontinf.sqlwhere': '条件字段',
  'e9.etl.frontinf.sqlorder': '排序字段' */}
      <E9FormBinderWrapper value={FrontIntStore.editRecord} onChange={FrontIntStore.resetEditRecord} formItemLayout={formItemLayout} refForm={form}>
       
        <EFormBinder required label={`${formatMessage({ id: 'e9.etl.frontinf.tb' })}：`} name="tb">
          <Input size="small"
            maxLength={50} 
            placeholder={formatMessage({ id: 'e9.etl.frontinf.tb' })}
          />
        </EFormBinder>
        
        <EFormBinder required label={`${formatMessage({ id: 'e9.etl.frontinf.field' })}：`} name="field">
          <Input size="small"
            maxLength={50} 
            placeholder={formatMessage({ id: 'e9.etl.frontinf.field' })}
          />
        </EFormBinder>
        <EFormBinder  label={`${formatMessage({ id: 'e9.etl.frontinf.search' })}：`} name="search">
          <Input size="small"
            maxLength={50} 
            placeholder={formatMessage({ id: 'e9.etl.frontinf.search' })}
          />
        </EFormBinder>
        <EFormBinder  label={`${formatMessage({ id: 'e9.etl.frontinf.page' })}：`} name="page">
          <NumberPicker type="inline" size="small"
            maxLength={50} 
           
          />
        </EFormBinder>
        <EFormBinder  label={`${formatMessage({ id: 'e9.etl.frontinf.size' })}：`} name="size">
          <NumberPicker type="inline" size="small"
            maxLength={50} 
           
          />
        </EFormBinder>
        <EFormBinder  label={`${formatMessage({ id: 'e9.etl.frontinf.sqlwhere' })}：`} name="sqlwhere">
          <Input size="small"
            maxLength={50} 
            placeholder={formatMessage({ id: 'e9.etl.frontinf.sqlwhere' })}
          />
        </EFormBinder>
        <EFormBinder  label={`${formatMessage({ id: 'e9.etl.frontinf.sqlorder' })}：`} name="sqlorder">
          <Input size="small"
            maxLength={50} 
            placeholder={formatMessage({ id: 'e9.etl.frontinf.sqlorder' })}
          />
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
          size="small"
            showTime
            disabled
            placeholder={formatMessage({ id: 'e9.pub.whsj' })}
          />
        </EFormBinder>
      </E9FormBinderWrapper>
    </EditForm >
  );
});

export default injectIntl(EditDialog);

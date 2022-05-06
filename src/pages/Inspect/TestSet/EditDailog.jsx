import React, { useState } from 'react';
import { Button, Input, DatePicker, Select, Form } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { isMoment } from 'moment';
import { observer } from 'mobx-react';
import EditForm from '../../../components/EditForm';
import TestSetStore from '../../../stores/inspect/TestSetStore';

const formItemLayout = {
  labelCol: {
    fixedSpan: 5,
  },
  wrapperCol: {
    span: 17,
  },
};
/**
 * 检测设置编辑页
 */
const EditDialog = observer(props => {
  const { intl: { formatMessage } } = props;
  const FormItem = Form.Item;
  const [field, setField] = useState(null);

  /**
   * 编辑框保存
   */
  const savedata = () => {
    field.validate((errors, values) => {
      if (!errors) {
        const { iptcfgWhsj } = values;
        if (isMoment(iptcfgWhsj)) {
          values.iptcfgWhsj = iptcfgWhsj.format('YYYY-MM-DD HH:mm:ss');
        }
        TestSetStore.saveData(values);
      }
    });
  };
  const iptcfgTypeSelect = [
    { label: formatMessage({ id: 'e9.testset.itemDescription' }), value: '101' },
    { label: formatMessage({ id: 'e9.testset.theOriginalType' }), value: '201' },
    { label: formatMessage({ id: 'e9.testset.originalDPI' }), value: '202' },
    { label: formatMessage({ id: 'e9.testset.theOriginalContent' }), value: '203' },
    { label: formatMessage({ id: 'e9.testset.originalEXIF' }), value: '204' },
    { label: formatMessage({ id: 'e9.testset.theOriginalNumber' }), value: '205' },
    { label: formatMessage({ id: 'e9.testset.tmywpp' }), value: '301' },
    { label: formatMessage({ id: 'e9.testset.ywtmpp' }), value: '302' },
    { label: formatMessage({ id: 'e9.testset.tmywnrpp' }), value: '303' },
    { label: formatMessage({ id: 'e9.testset.tmywslpp' }), value: '304' },
  ];

  return (
    <EditForm
      title={formatMessage({ id: 'e9.testset.title' })}
      visible={TestSetStore.editVisible}
      footer={false}
      onClose={() => TestSetStore.closeEditForm()}
      opt={TestSetStore.opt}
      style={{ width: '500px' }}
      extra={
        TestSetStore.opt === 'view' ? false :
          <Button.Group style={{ marginLeft: '10px' }} >
            <Button type="primary" onClick={savedata}>{formatMessage({ id: 'e9.btn.save' })}</Button>
          </Button.Group>
      }
    >
      <Form value={TestSetStore.editRecord} onChange={TestSetStore.resetEditRecord} saveField={(f) => { setField(f); }}  {...formItemLayout}>
        <FormItem required label={`${formatMessage({ id: 'e9.testset.iptcfgType' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Select
            name="iptcfgType"
            dataSource={iptcfgTypeSelect}
            disabled={TestSetStore.dataView}
            maxLength={20}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.testset.iptcfgType' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.testset.iptcfgCode' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="iptcfgCode"
            disabled={TestSetStore.dataView}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.testset.iptcfgCode' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.testset.iptcfgName' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="iptcfgName"
            disabled={TestSetStore.dataView}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.testset.iptcfgName' })}
          />
        </FormItem>
        <FormItem required label={`${formatMessage({ id: 'e9.testset.iptcfgExpr' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input.TextArea
            name="iptcfgExpr"
            disabled={TestSetStore.dataView}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.testset.iptcfgExpr' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.pub.whr' })}：`}>
          <Input
            name="iptcfgWhr"
            maxLength={20}
            style={{ width: '100%' }}
            disabled
            placeholder={formatMessage({ id: 'e9.pub.whr' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.pub.whsj' })}：`}>
          <DatePicker
            name="iptcfgWhsj"
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

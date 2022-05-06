import React, { useState } from 'react';
import { Button, Input, Form } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import EditForm from '../../../components/EditForm';
import WordsStore from '../../../stores/inspect/WordsStore';

const formItemLayout = {
  labelCol: {
    fixedSpan: 5,
  },
  wrapperCol: {
    span: 17,
  },
};

const AddDialog = observer(props => {
  const { intl: { formatMessage } } = props;
  const FormItem = Form.Item;
  const [field, setField] = useState(null);

  /**
   * 编辑框保存
   */
  const savedata = () => {
    field.validate((errors, values) => {
      if (!errors) {
        WordsStore.saveData(values);
      }
      WordsStore.closeEditForms();
    });
  };

  return (
    <EditForm
      title={formatMessage({ id: 'e9.inspect.words.title' })}
      visible={WordsStore.editVisibles}
      footer={false}
      onClose={() => WordsStore.closeEditForms()}
      opt={WordsStore.opt}
      style={{ width: '500px' }}
      extra={
        <Button.Group style={{ marginLeft: '10px' }} >
          <Button type="primary" onClick={savedata}>{formatMessage({ id: 'e9.btn.save' })}</Button>
        </Button.Group>
      }
    >
      <Form value={WordsStore.editRecords} onChange={WordsStore.resetEditRecord} saveField={(f) => { setField(f); }}  {...formItemLayout}>
        <FormItem required label={`${formatMessage({ id: 'e9.inspect.words.wordname' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="wordName"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.inspect.words.wordname' })}
          />
        </FormItem>
      </Form>
    </EditForm >
  );
});

export default injectIntl(AddDialog);

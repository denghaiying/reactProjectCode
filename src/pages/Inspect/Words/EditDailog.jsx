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
        WordsStore.saveData(values);
      }
    });
  };

  return (
    <EditForm
      title={formatMessage({ id: 'e9.inspect.words.title' })}
      visible={WordsStore.editVisible}
      footer={false}
      onClose={() => WordsStore.closeEditForm()}
      opt={WordsStore.opt}
      style={{ width: '500px' }}
      extra={
        <Button.Group style={{ marginLeft: '10px' }} >
          <Button type="primary" onClick={savedata}>{formatMessage({ id: 'e9.btn.save' })}</Button>
        </Button.Group>
      }
    >
      <Form value={WordsStore.editRecord} onChange={WordsStore.resetEditRecord} saveField={(f) => { setField(f); }}  {...formItemLayout}>
        <FormItem label={`${formatMessage({ id: 'e9.inspect.words.wordname' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="wordName1"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.inspect.words.wordname' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.inspect.words.wordname' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="wordName2"
            disabled={WordsStore.disabled2}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.inspect.words.wordname' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.inspect.words.wordname' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="wordName3"
            disabled={WordsStore.disabled3}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.inspect.words.wordname' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.inspect.words.wordname' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="wordName4"
            disabled={WordsStore.disabled4}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.inspect.words.wordname' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.inspect.words.wordname' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="wordName5"
            disabled={WordsStore.disabled5}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.inspect.words.wordname' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.inspect.words.wordname' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="wordName6"
            disabled={WordsStore.disabled6}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.inspect.words.wordname' })}
          />
        </FormItem>
        <FormItem label={`${formatMessage({ id: 'e9.inspect.words.wordname' })}：`} requiredMessage={`${formatMessage({ id: 'e9.info.data.require' })}`}>
          <Input
            name="wordName7"
            disabled={WordsStore.disabled7}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'e9.inspect.words.wordname' })}
          />
        </FormItem>
      </Form>
    </EditForm >
  );
});

export default injectIntl(EditDialog);

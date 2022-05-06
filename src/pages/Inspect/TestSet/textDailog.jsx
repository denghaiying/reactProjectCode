import React, { useState } from 'react';
import { Upload, Form, Button } from '@alifd/next';
import { injectIntl } from 'react-intl';
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

const AddDialog = observer(props => {
  const { intl: { formatMessage } } = props;
  const [field, setField] = useState(null);
  /**
   * 编辑框保存
   */
  const savedata = () => {
    field.validate((errors, values) => {
      // if (!errors) {
      //   WordsStore.saveData(values);
      // }
      // WordsStore.closeEditForms();
    });
  };


  return (
    <EditForm
      title={formatMessage({ id: 'e9.inspect.words.title' })}
      visible={TestSetStore.text}
      footer={false}
      onClose={() => TestSetStore.closetext()}
      style={{ width: '500px', height: 500 }}
      extra={
        <Button.Group style={{ marginLeft: '10px' }} >
          <Button type="primary" onClick={savedata}>{formatMessage({ id: 'e9.btn.save' })}</Button>
        </Button.Group>
      }
    >
      <Form style={{ height: 500 }} value={TestSetStore.textwords} onChange={TestSetStore.resetEditRecord} saveField={(f) => { setField(f); }}  {...formItemLayout}>
        <Upload
          request={TestSetStore.customRequest}
          multiple
          listType="text">
          <Button type="primary" style={{ margin: '0 0 10px' }}>Upload File</Button>
        </Upload>
      </Form>
    </EditForm >
  );
});

export default injectIntl(AddDialog);

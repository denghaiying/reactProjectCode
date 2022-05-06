import React from 'react'
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'

import ContentStore from '../../../stores/selfstreaming/content/Content';
import { Button, Transfer, Dialog, Form} from '@alifd/next';
import { observer } from 'mobx-react';
import { useIntl, FormattedMessage } from 'umi';

const DocDailog = observer(props => {
//  const { intl: { formatMessage } } = props;
 const { Item: FormItem } = Form;
 var editorState =  BraftEditor.createEditorState(ContentStore.docRecord.contentcontentDesc);
 var htmlString="";
 const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  const updatecontentDesc = ((values, errors) => {
    if (!errors) {
      values.contentcontentDesc=htmlString;
      ContentStore.updatecontentDesc(values);
    }
  });
   const handleEditorChange =((editorState)=> {
        htmlString = editorState.toHTML();
  });
  const extendControls = [
      {
        key: 'clear-editor',
        type: 'button',
        text: '清空编辑器',
      }, {
        key: 'insert-text',
        type: 'button',
        text: '插入自定义文本',
      }
    ]

  return (
    <Dialog
      title={formatMessage({ id: 'e9.content.content.contentDesc' })}
      visible={ContentStore.docModalVisible}
      onClose={() => ContentStore.closeDocDailog(false)}
      onCancel={() => ContentStore.closeDocDailog(false)}
      footer={false}
    >
    <Form size="small" value={ContentStore.docRecord}>
      <BraftEditor 
       value={editorState}
       onChange={handleEditorChange}
       //extendControls={extendControls}
      />
      <FormItem wrapperCol={{ offset: 20 }} style={{ marginTop: 24 }}>
        <Form.Submit validate type="primary" onClick={updatecontentDesc}>{formatMessage({ id: 'e9.btn.save' })}</Form.Submit>
      </FormItem>
   </Form>
    </Dialog >
    );

});


export default DocDailog;
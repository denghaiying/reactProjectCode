import {Button, message, Modal, Tooltip} from 'antd';
import React, {useState} from 'react';
import {ExclamationCircleOutlined, FileWordOutlined, UnlockOutlined} from '@ant-design/icons';
import YhStore from "@/stores/system/YhStore";
import {EpsTableStore} from "@/eps/components/panel/EpsPanel";
import {useLocalObservable} from "mobx-react";
import {action} from "mobx";
import SysStore from "@/stores/system/SysStore";
import fetch from "@/utils/fetch";
import HttpRequest from "@/eps/commons/v2/HttpRequest";
import ContentStore from "@/stores/selfstreaming/content/Content";
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import {Dialog, Form} from "@alifd/next";
import { EpsSource } from '@/eps/components/panel/EpsPanel/EpsPanel';


const FormItem = Form.Item;


function Doc(props) {
  const { text, record, index, store: EpsTableStore } = props;
//function Doc(text, record, index, store: EpsTableStore)  {
 // console.log("sdfdsfsd***",text, record, index, store);

  const [toolsDisabled, setToolsDisabled] = useState(false);

  var editorState =  BraftEditor.createEditorState(record.contentcontentDesc);
  var htmlString="";

  const updatecontentDesc = async (values, errors) => {
    if (!errors) {
      const records=record;
      records.contentcontentDesc=htmlString;
    //  ContentStore.updatecontentDesc(values);

      let response;
      response = await fetch .put(`/api/streamingapi/content/updatecontentDesc`, records);
      if (response && response.status === 201) {
        setToolsDisabled(false);
        props.store.findByKey(props.store.key, 1, props.store.size, props.store.params);
      }


    }
  };

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
    <>
    <Tooltip title="文档">
      <Button size="small"  style={{fontSize: '12px'}} type={'primary'} shape="circle" icon={<FileWordOutlined />} onClick={() =>setToolsDisabled(true)}/>
    </Tooltip>

    <Modal
      title="文档"
      centered
      visible={toolsDisabled}
      footer={null}
      width={1250}
      style={{ maxHeight: '500px', height: '500px' }}
      onCancel={() => setToolsDisabled(false)}
    >
    <Form size="small" value={ContentStore.docRecord}>
      <BraftEditor
        value={editorState}
        onChange={handleEditorChange}
        //extendControls={extendControls}
      />
      <FormItem wrapperCol={{ offset: 20 }} style={{ marginTop: 24 }}>
        <Form.Submit validate type="primary" onClick={updatecontentDesc}>保存</Form.Submit>
      </FormItem>
    </Form>
  </Modal >
      </>
  );
}

export default Doc;

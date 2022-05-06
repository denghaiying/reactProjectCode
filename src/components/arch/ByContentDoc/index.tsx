import React, { useRef, useState } from 'react';
import { Button, message, Space, Tooltip } from 'antd';
import { useEffect } from 'react';
import { SaveOutlined, SelectOutlined, FileWordOutlined } from "@ant-design/icons";
import fetch from "@/utils/fetch";
import SysStore from "@/stores/system/SysStore";
import { observer, useLocalObservable } from "mobx-react";
import BraftEditor from 'braft-editor';
import { exportWord } from 'mhtml-to-word';
import 'braft-editor/dist/index.css'


const ByContentDoc = observer((props) => {

  const { umid = "DAK00105", umname = "文档" } = props;

  const ref = useRef();

  const [editorState, setEditorState] = useState(BraftEditor.createEditorState('<p></p>'));

  // 本地store
  const ByContentStore = useLocalObservable(() => (
    {
      content: "",

      async query() {
        const res = await fetch.post("/api/eps/control/main/bywd/querybywdFjdoc", this.params,
          {
            params: {
              dakid: props.params.dakid,
              tmid: props.store.ids.toString(),
              whrid: SysStore.getCurrentUser().id,
              whr: SysStore.getCurrentUser().yhmc,
              ...this.params,
            }
          });
        if (res && res.status === 200) {
          this.content = res.data;
          setEditorState(BraftEditor.createEditorState(this.content));
        } else {
          return;
        }
      },

      async findESYwByfiledNameAndKeyWord() {
        const res = await fetch.post("/api/eps/control/main/elas/findEsYwByfiledName", this.params,
          {
            params: {
              //keyword: "0.8523546249528462",
              keyword: props.store.ids.toString(),
              ...this.params,
            }
          });
        if (res && res.status === 200) {
          var sjData = "";
          if (res.data.data && res.data.data.length > 0) {
            for (var i = 0; i < res.data.data.length; i++) {
              sjData += "<p>" + res.data.data[i].tm + "<\/p>" + "<p>" + res.data.data[i].text + "<\/p>";
            }
            debugger;
            this.content = sjData;
            console.log('this.content', this.content)
            setEditorState(BraftEditor.createEditorState(this.content));
          } else {
            message.error(res.data.msg);
            return;
          }



        }
      },
      async contentSave(contentStr) {

        const url = "/api/eps/control/main/bywd/add";
        //大数据提交时使用formData方式提交
        const formData = new FormData();
        formData.append('dakid', props.params.dakid),
          formData.append('tmid', props.store.ids.toString());
        formData.append('whrid', SysStore.getCurrentUser().id);
        formData.append('whr', SysStore.getCurrentUser().yhmc);
        formData.append('fjdoc', contentStr);

        const response = await fetch.post(url, formData, { headers: { 'Content-type': 'application/x-www-form-urlencoded', dataType: "json", } });

        // const response = await fetch.post(url, this.params,
        //   {
        //     params: {
        //       dakid: props.params.dakid,
        //       tmid: props.store.ids.toString(),
        //       whrid: SysStore.getCurrentUser().id,
        //       whr: SysStore.getCurrentUser().yhmc,
        //       fjdoc: contentStr,
        //       ...this.params,
        //     }
        //   });

        if (response && response.status === 200) {
          if (response.data.success) {
            message.success(`添加内容成功!`)
          } else {
            message.error("添加内容失败!", response.data.messag);
          }
        }
      },

    }
  ));


  useEffect(() => {
    ByContentStore.query();
  }, []);

  const getData = () => {
    const uo = ByContentStore.content;
    setEditorState(uo);
  }

  // 编辑内容触发
  const handleChange = (editorState) => {
    setEditorState(editorState)
  }

  // 获取 编辑器内容
  const gettEditorCon = async () => {
    const content = editorState.toHTML();
    if (content !== "<p></p>") {
      console.log('content', content);
      ByContentStore.contentSave(content);
    } else {
      message.error("添加内容为空，不能保存!");
      return;
    }
  }


  //另存为word
  const saveAsWord = async () => {
    exportWord({ mhtml: editorState.toHTML(), data: { title: "编研文档" }, filename: "编研文档" })
  }

  const getEsYw = async () => {
    ByContentStore.findESYwByfiledNameAndKeyWord();
  }

  return (
    <>
      <Space>
        <Tooltip title="保存">
          <Button className="btns" onClick={gettEditorCon} style={{ fontSize: '12px' }} icon={<SaveOutlined />}></Button>
        </Tooltip>
        <Tooltip title="另存为Word">
          <Button className="btns" onClick={saveAsWord} style={{ fontSize: '12px' }} icon={<FileWordOutlined />}></Button>
        </Tooltip>
        <Button className="btns" onClick={getEsYw} style={{ fontSize: '12px' }} icon={<SelectOutlined />}>获取附件内容</Button>
      </Space>
      <div style={{ height: '100%', overflowX: 'auto', overflowY: 'auto' }}>
        <div className={props.umname ? "title" : ""}>{props.umname}</div>
        <BraftEditor
          contentStyle={{ height: 500 }}
          value={editorState}
          onSave={gettEditorCon}
          onChange={handleChange} />

      </div>
    </>
  );
})

export default ByContentDoc;

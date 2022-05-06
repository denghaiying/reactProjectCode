import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';


const CodeEdit = (props) => {
  const { onChange, ...others } = props;
  const doChange = (editor, data, value) => {
    onChange(value);
  };
  return (<CodeMirror
    onChange={() => {
    }}
    onBeforeChange={doChange}
    {...others}
  />);
};

export default CodeEdit;

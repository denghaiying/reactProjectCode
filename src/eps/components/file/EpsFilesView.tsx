import EpsFormType from '@/eps/commons/EpsFormType';
import { Modal, Badge } from 'antd';
import React, { useEffect, useState } from 'react';
import { PaperClipOutlined } from '@ant-design/icons';
import util from '@/utils/util';
export interface IProps {
  title?: string;
  btnName: string; //按钮名称不传则默认回形针图标
  fjs: number;
  grpid: string;
  bmc: string;
  tmid: string;
  dakid: string;
  tmzt?: number;
  printfile?: number;
  downfile?: number;
}

function EpsFilesView(props: IProps) {
  const [visible, setVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [iFrameHeight, setIFrameHeight] = useState(700);
  const showModal = () => {
    if (!props.grpid) {
      return;
    }
    setVisible(true);
    viewFiles();
  };

  const viewFiles = () => {
    debugger;
    const bmc = props.bmc;
    const fjparams = {
      dakid: props.dakid,
      doctbl: `${bmc}_fj`,
      downfile: props.downfile || 0,
      bmc,
      fjck: true,
      fjdown: true,
      fjsctrue: false,
      fjupd: false,
      grpid: props.grpid,
      grptbl: `${bmc}_FJFZ`,
      id: props.tmid,
      printfile: props.printfile || 0,
      psql: '$S$KCgxPTEpKQ==',
      tmzt: props.tmzt || 4,
      wrkTbl: bmc,
    };
    util.setSStorage('fjparams', fjparams);
    setFileUrl(`/api/eps/wdgl/attachdoc/viewFiles?grpid=${props.grpid}`);
  };

  return (
    <div key={`fileViewDiv_${props.tmid}`}>
      <a
        key={`fileView_${props.tmid}`}
        style={{ width: 22, margin: '0 2px' }}
        onClick={showModal}
      >
        <Badge size="small" count={props.fjs ? props.fjs : 0}>
          {props.btnName ? (
            <span style={{ fontSize: '12px', color: '#0070cc' }}>
              {props.btnName}
            </span>
          ) : (
            <PaperClipOutlined style={{ color: '#55acee' }} />
          )}
        </Badge>
      </a>
      <Modal
        key={`fileViewModal_${props.tmid}`}
        title="查看附件"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={'70%'}
        style={{ height: iFrameHeight }}
      >
        <div style={{ height: iFrameHeight }}>
          <iframe
            style={{ width: '100%', height: 700, overflow: 'visible' }}
            //  onLoad={() => {
            //      const obj = ReactDOM.findDOMNode(this);
            //      setIFrameHeight(obj.contentWindow.document.body.scrollHeight);
            //  }}

            src={fileUrl}
            width="100%"
            height={iFrameHeight}
            scrolling="no"
            frameBorder="0"
          />
        </div>
      </Modal>
    </div>
  );
}

export default EpsFilesView;

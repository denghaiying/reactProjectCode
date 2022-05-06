import { Button, Modal } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Wps } from './wps-ext.js';

const WPSOffice = observer((props) => {
  useEffect(() => {
    WPSInit();
  }, []);

  const onEmbedMouseLeave = (e) => {
    console.log('onEmbedMouseLeave');
  };

  const WPSInit = () => {
    const wps1 = Wps.createNew(document.querySelector('#wps'));

    window.wpsExt = wps1;

    const embedDom = document.getElementById('embedID');
    const __f = () => {
      try {
        wps1.apis.newDoc();
      } catch (e) {
        setTimeout(__f, 500);
      }
    };

    setTimeout(__f, 500);
  };

  const onOpenClick = () => {
    wpsExt.apis.openLocalDoc();
  };

  const onSaveClick = () => {
    wpsExt.apis.saveToLocal();
    //wpsExt.apis.saveToRemote({url: `http://${location.hostname}:${location.port}/api/`});
  };

  return (
    <div
      id="wps"
      style={{
        width: '100%',
        height: 'calc(90vh - 30px)',
        paddingRight: 2,
        paddingTop: 4,
        backgroundColor: 'blue',
      }}
    />
    // <div
    //   style={{
    //     width: '100%',
    //     height: '90vh',
    //     backgroundColor: 'white',
    //   }}
    // >
    //   <div style={{ width: '100%', height: '30px' }}>
    //     <Button.Group>
    //       <Button type="primary" onClick={onOpenClick}>
    //         打开文件
    //       </Button>
    //       <Button type="primary" onClick={onSaveClick}>
    //         保存文件
    //       </Button>
    //     </Button.Group>
    //   </div>
    //   <div id="wpsContainer" style={{height: '100%',position: 'relative',zIndex: 1}}>
    //     <div
    //       id="wps"
    //       style={{
    //         width: '100%',
    //         height: 'calc(90vh - 30px)',
    //         paddingRight: 2,
    //         paddingTop: 4,
    //       }}
    //     ></div>
    //   </div>
    // </div>
  );
});
export default WPSOffice;

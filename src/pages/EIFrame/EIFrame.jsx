/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { injectIntl } from 'react-intl';
import { findDOMNode } from 'react-dom';
import { runFunc } from '@/utils/common';
import loadable from '@loadable/component';


const EIFrame = props => {
  const { intl: { formatMessage }, match: { params: { umid, href } } } = props;

  const ref = useRef(null);
  const divRef = useRef(null);
  const [comp, setComp] = useState(null);
  useEffect(() => {
    const iframe = findDOMNode(ref.current);
    if (iframe) {
      const content = iframe.contentWindow;
      if (window["topMiniuiFrame" + umid]) {
        window["topMiniuiFrame" + umid]=content;
      } else {
        window["topMiniuiFrame"] = content;
      }
      window.runRFunc = (umid, params) => runFunc({ umid, params });
      window.openDialog = (dialogurl, params, callback, visible) => openDialog(dialogurl, params, callback, visible);
    }
  }, []);

  const openDialog = (dialogurl, params, callback, visible) => {
    const Comp = loadable((props) => import(`../${dialogurl}`));
    const Clone = React.cloneElement(Comp, {
      onClose: () => {
        ReactDOM.unmountComponentAtNode(findDOMNode(divRef.current));
        setComp(null);
      }
    });
    setComp(<Comp visible={visible} params={params} callback={callback} />);
  };

  if (href) {
    return (
      <div>
        <iframe ref={ref} style={{ width: '100%', height: "calc(100vh - 55px)", overflow: 'visible' }} src={href} scrolling="no"
          frameBorder="0" />
      </div>
    );
  } else {
    return (
      <div>
        <iframe key={umid} ref={ref} style={{ width: '100%', height: "calc(100vh - 55px)", overflow: 'visible' }} src={decodeURIComponent(`/api/eps/control/main/iframePage?rungn=${umid}`)} scrolling="no"
          frameBorder="0" />
        <div ref={divRef}>
          {comp}
        </div>
      </div>
    );
  }
};


export default injectIntl(EIFrame);

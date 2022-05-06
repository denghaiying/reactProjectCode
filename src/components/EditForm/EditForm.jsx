import React, { useRef } from 'react';
import { Affix, Dialog } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { useIntl, FormattedMessage } from 'umi';
const EditForm = props => {
  const { title, children, opt, extra, ...oprops } = props;
  const ref = useRef(null);
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  // const getParentDom = () => {
  //   // eslint-disable-next-line react/no-find-dom-node
  //   const dom = findDOMNode(ref.current);
  //   if (dom != null) {
  //     return dom.parentNode;
  //   }
  // };

  return (
    <div ref={ref}>
      <Dialog
      hasMask={true}
        // style={{ height: 'calc(100vh - 40px)', top: '40px' }}
        {...oprops}
        title={
          // <Affix useAbsolute>
          <div style={{ ...styles.context }}>
            {/* <Col span="10" > */}
            <span style={{ ...styles.subTitle }}> {`${title}【${formatMessage({ id: `e9.btn.${opt}` })}】`}</span>
            {/* </Col> */}
            <div span="13" style={{ ...styles.extra }}>
              {extra}
            </div>
          </div>
          // </Affix>
        }
        isFullScreen
      // container={() => getParentDom()}
      >
        {props.children}
      </Dialog>
    </div>);
};


const styles = {
  context: {
    borderBottom: '1px solid #f0f0f0',
    margin: '0',
    //  padding: '15px 0',
    lineHeight: '50px',
    height: '50px',
    fonSize: '12px',
    color: '#84848',
    // color: 'rgba(0, 0, 0, 0.85)',
    fontWeight: '400',
  },
  title: {
    lineHeight: '50px',
    display: 'inline-block',
    paddingLeft: '14px',
    verticalAlign: 'middle',
  },
  subTitle: {
    lineHeight: '50px',
    display: 'inline-block',
    paddingLeft: '14px',
    verticalAlign: 'middle',
    fontSize: '18px',
    //  float: 'right',
  },
  extra: {
    display: 'inline-block',
    paddingRight: '24px',
    textAlign: 'right',
    verticalAlign: 'middle',
    float: 'right',
  },
  menu: {
    display: 'inline-block',
    paddingRight: '14px',
    textAlign: 'right',
    verticalAlign: 'middle',
  },
};

export default EditForm;

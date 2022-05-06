/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';

const UrlFrame = props => {
  const { intl: { formatMessage }, computedMatch: { params: { url } } } = props;

  useEffect(() => {

  }, []);

  return (
    <div className="ice-design-layout-dark ice-design-layout ice-design-fluid-layout">
      <iframe src={decodeURIComponent(url)} scrolling="no" />
    </div>
  );
};


export default injectIntl(UrlFrame);

import React from 'react';
import { observer } from 'mobx-react';
import { injectIntl } from 'react-intl';

const Index = observer(props => {
  const { intl: { formatMessage } } = props;

  return (
    <div className="workpage">
      {/*  */}
    </div>
  );
});

export default injectIntl((Index));

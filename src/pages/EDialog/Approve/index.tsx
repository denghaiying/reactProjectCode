import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import util from '../../../utils/util';
import EpsComponentLoader from '@/components/loader';
const Edialog = observer((props) => {
  const divRef = useRef(null);
  const params = util.getLStorage('rparams');
  debugger;
  useEffect(() => {
    window.openDialog = (dialogurl, params, callback, visible) =>
      openDialog(dialogurl, (params = {}), callback, visible);
  }, []);

  const closeModal = () => {
    // alert(1);
  };

  return (
    <div ref={divRef}>
      <EpsComponentLoader
        closeModal={closeModal}
        params={params.data}
        extendParams={params.data}
        url={params.url}
      />
    </div>
  );
});

export default Edialog;

import { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { runInAction } from 'mobx';
import DarckdjModule from '@/eps/business/Approve/DarckdjModule';
import { useIntl } from 'umi';

const Darckdj = observer((props) => {
  // eslint-disable-next-line prefer-destructuring
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const location: locationType = props.location;
  const archParams: ArchParams = location.query;
  // 是否案卷
  const isRecords = archParams.lx != '01' && archParams.lx != '0201';

  // tmzt
  const tmzt = 3;
  // 鉴定编号
  const jdlx = 'JYD';
  // 流程编号
  const wfCode = 'JYD';
  //umid
  const umid = 'DALY054';
  //umid
  const jdurl = 'jydcx';

  // 主表columns

  const store = useLocalStore(() => ({
    params: archParams,

    async init() { },
    tableRowClick(record) {
      console.log('record', record);
      runInAction(() => { });
    },
  }));

  useEffect(() => {
    //   }
  }, []);

  return (
    <DarckdjModule
      tmzt={tmzt}
      jdlx={jdlx}
      wfCode={wfCode}
      umid={umid}
      spurl={jdurl}
      {...props}
    />
  );
});

export default Darckdj;

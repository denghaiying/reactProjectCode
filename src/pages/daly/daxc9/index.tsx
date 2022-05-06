import { useEffect } from 'react';
import TableService from './TableService';
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import { observer, useLocalStore } from 'mobx-react';
import { runInAction } from 'mobx';
import Daxc9Module from '@/eps/business/Approve/Daxc9Module';
import { useIntl } from 'umi';
import WfdefStore from '@/stores/workflow/WfdefStore';

const newDaxc9 = observer((props) => {
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
  const jdlx = 'DAXC_NEW';
  // 流程编号
  const wfCode = 'DAXC_NEW';
  //umid
  const umid = 'DALY051';
  //umid
  const jdurl = 'daxc9';

  // 主表columns

  const store = useLocalStore(() => ({
    params: archParams,

    async init() {},
    tableRowClick(record) {
      runInAction(() => {});
    },
  }));

  useEffect(() => {
    //   }
  }, []);

  return (
    <Daxc9Module
      tmzt={tmzt}
      jdlx={jdlx}
      wfCode={wfCode}
      umid={umid}
      spurl={jdurl}
      {...props}
    />
  );
});

export default newDaxc9;

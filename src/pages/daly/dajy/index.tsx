import { useEffect } from 'react';
import TableService from './TableService';
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import { observer, useLocalStore } from 'mobx-react';
import { runInAction } from 'mobx';
import ArchModule from '@/eps/business/Approve/archModule';
import NewArchModule from '@/eps/business/Approve/NewArchModule';
import { useIntl } from 'umi';
import WfdefStore from '@/stores/workflow/WfdefStore';

const newDajy = observer((props) => {
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
  const umid = 'DALY050';
  //umid
  const jdurl = 'jydcx';

  // 主表columns

  const store = useLocalStore(() => ({
    params: archParams,

    async init() {},
    tableRowClick(record) {
      console.log('record', record);
      runInAction(() => {});
    },
  }));

  useEffect(() => {
    //   }
  }, []);

  return (
    <ArchModule
      tmzt={tmzt}
      jdlx={jdlx}
      wfCode={wfCode}
      umid={umid}
      spurl={jdurl}
      {...props}
    />
  );
});

export default newDajy;

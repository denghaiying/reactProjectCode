import { useEffect } from 'react';
import TableService from './TableService';
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import { observer, useLocalStore } from 'mobx-react';
import { runInAction } from 'mobx';
import Approve from '@/eps/business/Approve';
import { useIntl } from 'umi';
import WfdefStore from '@/stores/workflow/WfdefStore';

const Kfjd = observer((props) => {
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
  const jdlx = 'dagd';
  // 流程编号
  const wfcode = 'dagl_dagd';

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

  return <Approve tmzt={tmzt} spurl={jdlx} wfCode={wfcode} {...props} />;
});

export default Kfjd;

import React, {useEffect} from 'react';
import {Tab} from '@alifd/next';
import {injectIntl} from 'react-intl';
import EepInfo from './AsipPackage';
import EepStructTree from './EepStructTree';
import EepData from './EepData';
import EepDataJn from './EepDataJn';
import EepFile from './EepFile';
import EepFileJn from './EepFileJn';
import EepMeta from './EepMeta';
import EepMetaJn from './EepMetaJn';

import EepInfoStore from "../../../stores/longpreservation/EepInfoStore";
import EepDataStore from "../../../stores/longpreservation/EepDataStore";
import EepDataJnStore from "../../../stores/longpreservation/EepDataJnStore";
import { observer } from 'mobx-react';

const Eepinfo = observer(props => {
  const { selectRowRecords = [] } = EepInfoStore;
  const  selectEepDataRowRecords=[]  = EepDataStore.selectRowRecords;
  const  selectEepDataJnRowRecords=[]  = EepDataJnStore.selectRowRecords;
  const {
    // eslint-disable-next-line no-unused-vars
    intl: { formatMessage },
  } = props;
  const fileTabShow=selectEepDataRowRecords.length == 1 && selectRowRecords.length == 1;
  const fileJnTabShow=selectEepDataJnRowRecords.length == 1 && selectRowRecords.length == 1;
  return (
    <div className="workpage">
      
        <Tab>
          <Tab.Item   title={formatMessage({ id: 'e9.longpreservation.eepinfo.name' })} key="1">
            <EepInfo/>
          </Tab.Item>
          <Tab.Item key={'package'+selectRowRecords[0]} disabled={selectRowRecords.length !== 1}  title={formatMessage({ id: 'e9.longpreservation.eepinfo.package' })} >
              <EepStructTree/>
          </Tab.Item>
          <Tab.Item key={'metadata'+selectRowRecords[0]} disabled={selectRowRecords.length !== 1} title={formatMessage({ id: 'e9.longpreservation.eepinfo.metadata' })}>
            <EepMeta/>
          </Tab.Item>
           <Tab.Item key={'metadataJn'+selectRowRecords[0]} disabled={selectRowRecords.length !== 1} title={formatMessage({ id: 'e9.longpreservation.eepinfo.metadataJn' })}>
            <EepMetaJn/>
          </Tab.Item>
          <Tab.Item key={'archiveinfo'+selectRowRecords[0]} disabled={selectRowRecords.length !== 1} title={formatMessage({ id: 'e9.longpreservation.eepinfo.archiveinfo' })} >
           <EepData/>
          </Tab.Item>
           <Tab.Item key={'archiveinfoJn'+selectRowRecords[0]} disabled={selectRowRecords.length !== 1} title={formatMessage({ id: 'e9.longpreservation.eepinfo.archiveinfoJn' })} >
           <EepDataJn/>
          </Tab.Item>
          <Tab.Item key={'fileinfo'+selectEepDataRowRecords[0]} disabled={!fileTabShow} title={formatMessage({ id: 'e9.longpreservation.eepinfo.fileinfo' })}>
            <EepFile/>
          </Tab.Item>
          <Tab.Item key={'fileinfoJn'+selectEepDataJnRowRecords[0]} disabled={!fileJnTabShow} title={formatMessage({ id: 'e9.longpreservation.eepinfo.fileinfoJn' })}>
            <EepFileJn/>
          </Tab.Item>
        </Tab>

      </div>
  );
});

export default injectIntl(Eepinfo);

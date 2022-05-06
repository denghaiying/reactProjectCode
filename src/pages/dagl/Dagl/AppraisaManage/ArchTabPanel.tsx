import { useEffect } from 'react';
import TableService from './TableService';
import { observer, useLocalStore } from 'mobx-react';
import { runInAction } from 'mobx';
import ArchPanel from './ArchPanel';
// import EpsModalButton from "@/eps/components/buttons/EpsModalButton";
import { message } from 'antd';

import './ArchTabPanel.less';
import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { Tabs } from 'antd';
import QueryString from 'qs';
const demo = observer((props) => {
  // eslint-disable-next-line prefer-destructuring

  const location: locationType = props.location;
  const archParams: ArchParams = location ? location.query : props.params;

  // 是否案卷
  const isRecords =
    archParams.lx != '01' &&
    archParams.lx != '0201' &&
    archParams.lx != '0301' &&
    archParams.lx != '040101' &&
    archParams.lx != '04';
  // 是否工程案卷
  const isProject = archParams.lx == '04';

  const store = useLocalStore(() => ({
    childUrl: '',
    activeKey: '1',
    ajmc: '工程案卷',
    openProjectArch(params) {
      console.log(params);

      runInAction(() => {
        this.childUrl = `params.path?${QueryString.stringify(params)}`;
        this.activeKey = '2';
      });
    },
    onChangeTab(activeKey: string) {
      if (!this.childUrl) {
        return;
      }
      runInAction(() => {
        //   this.childUrl = `params.path?${QueryString.stringify(params)}`;

        this.activeKey = activeKey;
      });
    },
  }));

  useEffect(() => {
    // if (archParams.dakid) {
    // store.initKtable();
    //   }
  }, []);

  return !isProject ? (
    <ArchPanel {...props} />
  ) : (
    <div className="card-container">
      <Tabs activeKey={store.activeKey} onChange={store.onChangeTab}>
        <TabPane tab="工程列表" key="1">
          <ArchPanel
            callback={props.callback}
            key="arch_project"
            openProjectArch={store.openProjectArch}
            {...props}
          />
        </TabPane>
        <TabPane tab={store.ajmc} key="2">
          <iframe
            id={`gc_iframe`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            src={store.childUrl}
          ></iframe>
        </TabPane>
        {/* <TabPane tab="盒列表" key="3">
              Content of Tab 3
            </TabPane> */}
      </Tabs>
    </div>
  );
});

export default demo;


import { useEffect, useRef, useState } from 'react';
import { Space, Form, Input, Select, Table } from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import WfdefStore from '@/stores/workflow/WfdefStore';
import { WflwButtons } from '@/components/Wflw';
import WkdemoStore from '@/stores/demo/WkdemoStore';

/**
 * 内部管理---功能维护
 */

const Wfdemo = observer((props) => {
  const wfvid = "demo_wkdemo";
  useEffect(() => {
    WfdefStore.getPorcs(wfvid);
  }, []);

  // 流程开始前,可以做一些判断，如果返回true，则继续流程操作，如果返回false，则中断操作
  // 在点按钮后触发
  const onBeforeWfAction = async (action) => {
    return true;
  };

  // 点了流程弹出框上的确认后，流程处理完触发
  const onAfterWfAction = (data) => {
    //data 中包含流程的一些信息，比如action 流程意见等等
    // 一般情况下，这里面不允许做业务操作，只用来刷新页面，比如重新刷新Table数据，保证数据显示正确

  };
  const getWfid = () => {
    if (WkdemoStore.selectRowRecords && WkdemoStore.selectRowRecords.length > 0) {
      return WkdemoStore.selectRowRecords[0].wfid;
    }
    return '';
  };

  const getWfinst = () => {
    if (WkdemoStore.selectRowRecords && WkdemoStore.selectRowRecords.length > 0) {
      return WkdemoStore.selectRowRecords[0].wfinst;
    }
    return '';
  };

  return <>
    <Space wrap>
      <WflwButtons
        showmode="tile" // 平铺展示
        style={{ marginLeft: '10px' }}
        offset={[18, 0]}
        type={['submit', 'return', 'reject', 'logview']}
        wfid={getWfid()}
        wfinst={getWfinst()}
        onBeforeAction={onBeforeWfAction}
        onAfterAction={onAfterWfAction}
      />
      <WflwButtons
        showmode="dropdown" //下拉展示
        style={{ marginLeft: '10px' }}
        offset={[18, 0]}
        type={['submit', 'return', 'retract', 'transmit', 'reject', 'logview']}
        wfid={getWfid()}
        wfinst={getWfinst()}
        onBeforeAction={onBeforeWfAction}
        onAfterAction={onAfterWfAction}
      />
    </Space>
    <Table
    >
      <Table.Column
        title="流程状态"
        dataIndex="wpid"
        render={
          (value: any, record: any) => {
            if (value === 'ZZZY') {
              return '否决';
            }
            const list = WfdefStore.proclist[record.wfid];

            if (list) {
              for (let i = 0; i <= list.length - 1; i++) {
                if (list[i].wpid == value) {
                  return list[i].name;
                }
              }
            }
            // return value;
          }
        } />
      <Table.Column title="标题" dataIndex="wkdemoTitle" />
      <Table.Column title="状态" dataIndex="wkdemoState" />
      <Table.Column title="已处理人" dataIndex="wfhandler" />
      <Table.Column title="待处理人" dataIndex="wfawaiter" />
    </Table>
  </>
});

export default Wfdemo;

import React, { useEffect, useState } from 'react';

import { Timeline, Empty } from 'antd';
import timeService from './timelineService';
import { observer } from 'mobx-react';

const ApplyTimeLine = observer((props) => {
  const { kfjdmxid } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    if (props.logVisible) {
      setData([]);
      timeService.findAll({ kfjdmxid }).then((res) => {
        setData(res);
      });
    }
  }, [props.logVisible]);
  const getTimeLinePanel = () => {
    if (!data || data.length == 0) {
      return <Empty />;
    }
    return (
      <Timeline mode={'left'}>
        {data.map((item) => {
          return (
            <Timeline.Item label={`${item.sprq}`}>
              <p> 审批人：{item.spr}</p>
              <p>
                {' '}
                审批结果：
                {item.spzt == 'Y'
                  ? props?.approveMark?.agree || '通过'
                  : props?.approveMark?.disAgree || '不通过'}
              </p>
              <p> 审批标识：{item.applylevel}</p>
              <p> 审批意见：{item.remark}</p>
            </Timeline.Item>
          );
        })}
      </Timeline>
    );
  };
  return getTimeLinePanel();
});

export default ApplyTimeLine;

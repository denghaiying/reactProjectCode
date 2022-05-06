import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Modal, Timeline } from 'antd';
import PropTypes from 'prop-types';
import fetch from '@/utils/fetch';

const OptLog = observer((props: any) => {
  const { ywid, visible, onVisibleChange } = props;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (visible) {
      const params = new URLSearchParams();
      params.append("ywid", ywid);
      fetch.post("/eps/control/main/dagllog/queryForList", params,
        { headers: { "Content-type": "application/x-www-form-urlencoded" } }).then((response) => {
          if (response && response.status === 200) {
            setItems(response.data);
          }
        })
    }
  }, [visible]);
  return (
    <Modal
      title="操作日志"
      visible={visible}
      footer={null}
      onCancel={() => onVisibleChange(false)}
      width={1280}
      bodyStyle={{ height: 550, overflowY: "auto" }}
    >
      <Timeline>
        {items.map((o: any) => <Timeline.Item key={o.id}>日志时间：{o.rq} 日志人员：{o.yhmc || ''} 日志操作：{o.op}</Timeline.Item>)}
      </Timeline>
    </Modal>
  );
});

OptLog.prototype = {
  omid: PropTypes.string.isRequired,
  ywid: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
};

OptLog.defaultProps = {
  visible: false,
}

export default OptLog;

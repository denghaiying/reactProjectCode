import React, { useEffect, useState } from 'react';
import { Tooltip, Modal, Table, Button, message } from 'antd';

import './index.less';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import { AuditOutlined, CopyOutlined } from '@ant-design/icons';

import YhStore from '@/stores/system/YhStore';
import fetch from '@/utils/fetch';

function RoleYh(props) {
  const { text, record, index, store: EpsTableStore } = props;
  const [visible, setVisible] = useState(false);

  const [data, setData] = useState([]);

  debugger;
  useEffect(() => {
    //  YhStore.queryRole(record);

    YhStore.setRoleColumns([
      {
        title: '全宗号',
        dataIndex: 'dwqzh',
        width: 150,
        align: 'center',
        lock: true,
      },
      {
        title: '所属单位',
        dataIndex: 'dwid',
        align: 'center',
        width: 300,
      },
      {
        title: '角色编号',
        dataIndex: 'rolecode',
        align: 'center',
        width: 100,
      },
      {
        title: '角色名称',
        dataIndex: 'rolename',
        align: 'center',
        width: 250,
      },
    ]);
  }, []);

  //   useEffect(() => {
  //     YhStore.queryRole(record);
  // }, [record]);

  const Show = async () => {
    if (record && record.id) {
      const url =
        '/api/eps/control/main/yhrole/queryForListByByYhId?yhid=' + record.id;
      const res = await fetch.post(url);
      debugger;
      if (res && res.status === 200) {
        //   this.roleDataSource = res.data;
        setData(res.data);
      } else {
        return;
      }
    }

    //
    // const uo = YhStore.roleDataSource;
    // if (uo == []) {
    //   YhStore.queryRole(record);
    //   setData(YhStore.roleDataSource);
    // } else {
    //  setData(uo);
    // }

    setVisible(true);
  };

  // useEffect(() => {
  //   YhStore.queryRole(record);
  //   Show();
  // }, [record]);

  return (
    <>
      <Tooltip title="角色查看">
        <Button
          size="small"
          style={{ fontSize: '12px' }}
          type="primary"
          shape="circle"
          icon={<AuditOutlined />}
          onClick={Show}
        />
      </Tooltip>
      <Modal
        title="角色查看"
        centered
        visible={visible}
        footer={null}
        width={1000}
        onCancel={() => setVisible(false)}
      >
        <Table
          columns={YhStore.roleColumns}
          dataSource={data}
          pagination={false}
        />
      </Modal>
    </>
  );
}

export default RoleYh;

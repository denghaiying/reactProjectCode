import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Modal, Table } from 'antd';
import SvgIcon from '@/components/SvgIcon';
import LydjStore from '@/stores/dadt/LydjStore';
import FileView from './fileView';

const LymxData = observer((props: any) => {


  return (
    <>
      <Modal
        title="利用明细数据"
        visible={LydjStore.lymxShow}
        footer={null}
        width={1280}
        bodyStyle={{ height: "calc(100vh - 200px) " }}
        onCancel={() => { LydjStore.showLymxModal(false); }}
      >
        <Table
          tableLayout="fixed"
          isZebra={true}
          bordered={true}
          size='small'
          dataSource={LydjStore.lymxData && LydjStore.lymxData.results || []}
          fixedHeader
          loading={LydjStore.lymxLoading}
          pagination={false}
        // scroll={{ y: "calc(100vh - 259px)" }}
        >
          <Table.Column
            title="序号"
            width="80px"
            render={(_v, _, index) => index + 1}
          />
          <Table.Column
            title="操作"
            width="100px"
            render={(_, record: any) => (record.fjs && record.fjs > 0 && (
              <a
                href="javascript:void(0)"
                style={{ marginLeft: 10 }}
                onClick={() => {
                  LydjStore.showFiles('L', { ...record });
                }}
              >
                <SvgIcon type="iconfujian" />
                <span>{record.fjs || ''}</span>
              </a>
            ) || '')}
          />
          <Table.Column
            title="年度"
            dataIndex="nd"
            width="150px"
          />
          <Table.Column
            title="题名"
            dataIndex="tm"
            width="200px"
            ellipsis
          />
          <Table.Column
            title="档号"
            dataIndex="dh"
            ellipsis
          />

        </Table>
      </Modal>
      <FileView />
    </>
  );
});




export default LymxData;

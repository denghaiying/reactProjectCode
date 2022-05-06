import React from 'react';
import { Button, Table } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import JcsqStore from '../../../stores/inspect/JcsqStore';
import EditForm from '../../../components/EditForm';

const YuanWen = observer(props => {
  const { intl: { formatMessage } } = props;
  const { yuanwenData, opt } = JcsqStore;
  const columns = [
    {
      title: formatMessage({ id: 'Jcsq.cfgcode' }),
      dataIndex: 'iptcfgCode',
      width: 100,
    },
    {
      title: formatMessage({ id: 'Jcsq.cfgname' }),
      dataIndex: 'iptcfgName',
      width: 200,
    },
    {
      title: formatMessage({ id: 'Jcsq.jcsqmxExpr' }),
      dataIndex: 'iptcfgExpr',
      width: 200,
    },
  ];
  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    JcsqStore.setSelectRows(selectedRowKeys, records);
  };
  /**
   * 保存原文设置
   * @type {saveData}
   */
  const saveData = (() => {
    JcsqStore.saveYuanwen();
  });

  return (
    <EditForm
      title={formatMessage({ id: 'Jcsq.importYunWen' })}
      visible={JcsqStore.yuanwenVisible}
      opt={opt}
      footer={<Button onClick={saveData} type="primary">{formatMessage({ id: 'e9.btn.save' })}</Button>}
      onClose={() => JcsqStore.closeYForm()}
      style={{ width: '45%' }}
    >
      <Table maxBodyHeight={400}
        fixedHeader
        primaryKey="iptcfgId"
        dataSource={yuanwenData}
        rowSelection={{ onChange: onTableRowChange }}
      >
        {columns.map(col =>
          <Table.Column align="center" key={col.dataIndex} {...col} />
        )}
      </Table>
    </EditForm>
  );
});
export default injectIntl(YuanWen);

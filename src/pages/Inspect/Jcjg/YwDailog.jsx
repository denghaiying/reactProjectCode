import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Table } from '@alifd/next';
import { injectIntl } from 'react-intl';

import EditForm from '../../../components/EditForm';
import JcjgStore from '../../../stores/inspect/JcjgStore';

const TmDialog = observer(props => {
  const { intl: { formatMessage } } = props;
  const { loading, jcjgErrData } = JcjgStore;

  const columns = [{
    title: formatMessage({ id: 'e9.inspect.jcjg.type' }),
    dataIndex: 'filetype',
    width: 100,
    lock: true,
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.filename' }),
    dataIndex: 'filename',
    width: 150,
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.md5' }),
    dataIndex: 'md5',
    width: 300,
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.resolution' }),
    dataIndex: 'resolution',
    width: 200,
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.filepath' }),
    dataIndex: 'filepath',
    width: 200,
  }, {
    title: formatMessage({ id: 'e9.inspect.jcjg.size' }),
    dataIndex: 'size',
    width: 200,
  },
  {
    title: formatMessage({ id: 'e9.inspect.jcjg.context' }),
    dataIndex: 'context',
    width: 200,
  }];

  useEffect(() => {
    JcjgStore.setColumns(columns);
  }, []);

  return (
    <div>
      <EditForm
        title={formatMessage({ id: 'e9.inspect.jcjg.title2' })}
        visible={JcjgStore.dialogErrFileVisible}
        footer={false}
        onClose={() => JcjgStore.closeEditFormss()}
        opt={JcjgStore.opt}
        shouldUpdatePosition={JcjgStore.updatePosition}
        closeable
      >
        <Table
          dataSource={jcjgErrData}
          fixedHeader
          maxBodyHeight={500}
          loading={loading}
        >
          {columns.map(col =>
            <Table.Column align="left" alignHeader="center" key={col.dataIndex} {...col} />
          )}
        </Table>
      </EditForm >
    </div>

  );
});

export default injectIntl(TmDialog);

import { observer } from 'mobx-react';
import React from 'react';
import { Table } from '@alifd/next';
import { injectIntl } from 'react-intl';
import EditForm from '../../../components/EditForm';
import JcjgStore from '../../../stores/inspect/JcjgStore';

const TmDialog = observer(props => {
  const { intl: { formatMessage } } = props;
  const { loading, jcjgErrData, zlxlist } = JcjgStore;

  return (
    <div>
      <EditForm
        title={formatMessage({ id: 'e9.inspect.jcjg.title1' })}
        visible={JcjgStore.dialogErrDataVisible}
        footer={false}
        onClose={() => JcjgStore.closeEditForms()}
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
          {zlxlist.map(col =>
            <Table.Column alignHeader="center" align="left" key={col.dataIndex} {...col} />
          )}
        </Table>
      </EditForm >
    </div>

  );
});

export default injectIntl(TmDialog);

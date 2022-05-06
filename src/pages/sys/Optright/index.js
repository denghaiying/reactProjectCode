import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Table, Button, Icon, Select, Checkbox, Field } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import ContainerTitle from '../../../components/ContainerTitle';
import SysStore from '../../../stores/system/SysStore';
import RoleStore from '../../../stores/user/RoleStore';
import OptrightStore from '../../../stores/user/OptrightStore';


const Optright = observer(props => {
  const { intl: { formatMessage } } = props;
  const { data, columns, loading, dataChanged } = OptrightStore;
  const field = Field.useField({
    values: OptrightStore.params,
    onChange: (name, value) => {
      if (name === 'roleid') {
        const v = value;
        if (v) {
          let r = {};
          RoleStore.list.some(it => {
            if (it.id === v) {
              r = it;
              return true;
            }
            return false;
          });
          OptrightStore.setRolesys(r.sysId);
          field.setValue('sysid', r.sysId);
        } else {
          OptrightStore.setRolesys('');
          field.setValue('sysid', '');
        }
      }
      const values = field.getValues();
      OptrightStore.setParams(values, true);
      if (values.roleid && values.sysid) {
        OptrightStore.queryData(values);
      }
    },
  });
  const umid = 'usermrg004';

  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    OptrightStore.setColumns([{
      //   title: formatMessage({ id: 'e9.sys.optright.sysName' }),
      //   dataIndex: 'sysName',
      //   width: 200,
      // }, {
      title: formatMessage({ id: 'e9.sys.optright.moduleName' }),
      dataIndex: 'moduleName',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.sys.optright.funcName' }),
      dataIndex: 'funcName',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.sys.optright.OptName' }),
      dataIndex: 'optName',
    }]);
    SysStore.queryNorlmalList();
    RoleStore.queryList();
  }, []);

  // end ********************

  // begin *************以下是自定义函数区域

  const renderCell = (dataindex, value, index, record) => {
    if (dataindex === 'funcName') {
      if (record.type === 2) {
        return <Checkbox key={`chk-${record.id}`} defaultChecked={record.hasRight} onChange={(checked) => OptrightStore.checkValue(record.sysId, record.moduleId, record.funcId, null, checked)}>{value}</Checkbox>;
      } else if (record.type === 1) {
        return <Checkbox key={`chk-${record.id}`} defaultChecked={record.hasRight} onChange={(checked) => OptrightStore.checkValue(record.sysId, record.moduleId, null, null, checked)} >{formatMessage({ id: 'e9.sys.optright.All' })}</Checkbox>;
      } else if (record.type === 0) {
        return <Checkbox key={`chk-${record.id}`} defaultChecked={record.hasRight} onChange={(checked) => OptrightStore.checkValue(record.sysId, null, null, null, checked)} >{formatMessage({ id: 'e9.sys.optright.All' })}</Checkbox>;
      }
    } else if (dataindex === 'optName') {
      if (record.type === 2) {
        return <div>{record.opts.map(item => <Checkbox style={{ marginLeft: '5px' }} key={`chk-${item.id}`} defaultChecked={item.hasRight} onChange={(checked) => OptrightStore.checkValue(record.sysId, item.moduleId, item.funcId, item.optId, checked)}>{item.optName}</Checkbox>)}</div>;
      }
      return value;
    }
    return value;
  };


  // end **************


  return (
    <div className="workpage">
      <ContainerTitle
        title={formatMessage({ id: 'e9.sys.optright.title' })}
        mainroute="/sysuser"
        umid="usermrg004"
        extra={
          <span>
            {/* <Button.Group>
              {OptrightStore.hasRight(umid, 'a202') && <Button type="primary" ><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" /></Button>}
              {OptrightStore.hasRight(umid, 'a201') && <Button type="primary" ><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" /></Button>}
            </Button.Group> */}
            <Button style={{ marginLeft: '10px' }}
              type="primary"
              disabled={!dataChanged}
              onClick={() => OptrightStore.save()}
            >
              <Icon className="iconfont iconsave" />
              <FormattedMessage id="e9.btn.save" />
            </Button>
          </span>}
      />
      <div className="workcontain">
        <div className="right rightmax">
          <div className="toolbar">
            <Select
              {...field.init('roleid', {})}
              placeholder={formatMessage({ id: 'e9.sys.optright.con.roleid' })}
              style={{ width: '200px' }}
            >
              {RoleStore.list.map(item => <Select.Option value={item.id} key={item.id} >{item.roleName}</Select.Option>)}
            </Select>
            <Select
              {...field.init('sysid', {})}
              placeholder={formatMessage({ id: 'e9.sys.optright.con.sysid' })}
              style={{ marginLeft: '20px', width: '200px' }}
            >
              {SysStore.normallist.filter(item => !OptrightStore.rolesys || item.id === OptrightStore.rolesys).map(item => <Select.Option value={item.id} key={item.id}>{item.systemName}</Select.Option>)}
            </Select>
          </div>
          <div className="workspace">
            <Table
              dataSource={data}
              tableLayout="fixed"
              // $work-context-heigth-41px, 41px为表头高度
              maxBodyHeight="calc(100vh - 229px)"
              fixedHeader
              loading={loading}
              isTree
            >
              {columns.map(col =>
                <Table.Column alignHeader="center" key={col.dataIndex} {...col} cell={(value, index, record) => renderCell(col.dataIndex, value, index, record)} />
              )}
              {/* <Table.Column cell={renderTableCell} width="100px" lock="right" /> */}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
});


export default injectIntl(Optright);

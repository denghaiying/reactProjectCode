import React, { useEffect } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react';
import moment from 'moment';
import { Button, Table, Input, Icon, Pagination, Message, Field } from '@alifd/next';
import JcsqStore from '../../../stores/inspect/JcsqStore';
import LoginStore from '../../../stores/system/LoginStore';
import E9Config from '../../../utils/e9config';
import EditDailog from './EditDailog';

import ContainerTitle from '../../../components/ContainerTitle';
import ImportSetting from './ImportSetting';

const Jcsq = observer((props) => {
  const { intl: { formatMessage } } = props;
  const { data, loading, pageno, pagesize, selectRowRecords, selectRowKeys } = JcsqStore;
  const { userinfo } = LoginStore;
  const field = Field.useField();
  const form = React.createRef();
  // 定义表格表头参数
  const column = [
    {
      title: formatMessage({ id: 'Jcsq.jcsqSqdw' }),
      dataIndex: 'jcsqSqdw',
      width: 200,
      lock: true,
    },
    {
      title: formatMessage({ id: 'Jcsq.jcsqSqrq' }),
      dataIndex: 'jcsqSqrq',
      width: 200,
    },
    {
      title: formatMessage({ id: 'Jcsq.jcsqJcfw' }),
      dataIndex: 'jcsqJcfw',
      width: 200,
      cell: (value) => {
        switch (value) {
          case 'A':
            return <span>{formatMessage({ id: 'Jcsq.clausesAndSubclauses' })}</span>;
          case 'B':
            return <span>{formatMessage({ id: 'Jcsq.value' })}</span>;
          case 'C':
            return <span>{formatMessage({ id: 'Jcsq.text' })}</span>;
          default:
            return null;
        }
      },
    },
    {
      title: formatMessage({ id: 'Jcsq.jcsqSqsm' }),
      dataIndex: 'jcsqSqsm',
      width: 200,
    },
    {
      title: formatMessage({ id: 'Jcsq.jcsqPpgz' }),
      dataIndex: 'jcsqPpgz',
      width: 200,
    },
    {
      title: formatMessage({ id: 'Jcsq.jcsqTms' }),
      dataIndex: 'jcsqTms',
      width: 100,
    },
    {
      title: formatMessage({ id: 'Jcsq.jcsqYws' }),
      dataIndex: 'jcsqYws',
      width: 100,
    },
    {
      title: formatMessage({ id: 'Jcsq.jcsqYwdir' }),
      dataIndex: 'jcsqYwdir',
      width: 300,
    },
    {
      title: formatMessage({ id: 'e9.pub.whr' }),
      dataIndex: 'jcsqWhr',
      width: 150,
    },
    {
      title: formatMessage({ id: 'e9.pub.whsj' }),
      dataIndex: 'jcsqWhsj',
      width: 200,
      cell: (value) => {
        return (
          <span>{value != null ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
        );
      },
    },
  ];
  /**
   * 页面初始化方法
   */
  useEffect(() => {
    JcsqStore.setParams({ zts: ['I'] });
    JcsqStore.queryExpr();
  }, []);

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = (() => {
    field.validate((errors, values) => {
      if (!errors) {
        values.zts = ['I'];
        JcsqStore.setParams(values);
      }
    });
  });

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    JcsqStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    JcsqStore.setPageSize(pageSize);
  });

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    JcsqStore.setSelectRows(selectedRowKeys, records);
  };
  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    JcsqStore.renderRange({ jcsqJcfw: '' });
    const json = { jcsqWhrid: userinfo.yhId, jcsqWhr: userinfo.yhYhmc, jcsqWhsj: moment(), jcsqSqrq: moment() };
    JcsqStore.showEditForm('add', json);
  });
  /**
   * 审核通过
   * @type {onCheckAction}
   */
  const onCheckAction = (() => {
    if (selectRowRecords.length === 1) {
      JcsqStore.audit().then(() => {
        if (JcsqStore.auditState) {
          Message.success('审核成功！进入自动检测，需要查看检测结果请打开检测结果功能进行查看');
        } else {
          Message.error('审核通过失败');
        }
      });
    } else {
      Message.warning('请选择一条数据');
    }
  });


  // end ********************

  // begin *************以下是自定义函数区域
  /**
   * 浏览详情
   * @param record
   */
  const onViewAction = (record) => {
    JcsqStore.renderRange(record);
    JcsqStore.showEditForm('view', record);
  };

  // end ********************

  // begin *************以下是自定义函数区域
  /**
   * 删除操作
   * @param {* string} id
   */
  const deleteData = (id) => {
    JcsqStore.delete(id);
  };
  /**
   * 响应删除事件
   * @param {*} id
   */
  const onDeleteAction = (id) => {
    deleteData(id);
  };

  /**
   *  修改记录
   * @param {* User} record
   */
  const edit = ((record) => {
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });
    json.id = record.jcsqId;
    json.jcsqWhrid = userinfo.yhId;
    json.jcsqWhr = userinfo.yhYhmc;
    json.jcsqWhsj = moment();
    JcsqStore.showEditForm('edit', json);
  });

  /**
   * 导入检测设置
   * @type {onImportAction}
   */
  const onImportAction = (record) => {
    JcsqStore.setStep(1);
    JcsqStore.openImportSetting(record).then(() => {
      JcsqStore.queryDetail();
    });
  };

  /**
   * 响应编辑事件
   * @param {*} record
   */
  const onEditAction = (record) => {
    JcsqStore.renderRange(record);
    edit(record);
  };

  /**
   * 最后一列操作列绘制修改 删除 详情按钮
   * @param {*} value
   * @param {*} index
   * @param {*} record
   */
  const renderTableCell = (value, index, record) => {
    return (
      <div>
        <a href="javascript:void(0)" onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>
        <a href="javascript:void(0)" style={{ marginLeft: 5 }} onClick={() => onDeleteAction(record.jcsqId)}><FormattedMessage id="e9.btn.delete" /></a>
        <a href="javascript:void(0)" style={{ marginLeft: 5 }} onClick={() => onViewAction(record)}><FormattedMessage id="e9.btn.view" /></a>
        <a href="javascript:void(0)" style={{ marginLeft: 5 }} onClick={() => onImportAction(record)}><FormattedMessage id="Jcsq.importSetting" /></a>
      </div>
    );
  };

  // end **************
  return (
    <div className="workpage">
      <ContainerTitle
        title={formatMessage({ id: 'Jcsq.title' })}
        extra={
          <span>
            <Button.Group style={{ marginLeft: '10px' }} >
              <Button type="primary" onClick={onAddAction}><Icon type="add" /><FormattedMessage id="e9.btn.add" /></Button>
              <Button type="primary" onClick={onCheckAction}><Icon type="success" /><FormattedMessage id="e9.btn.check" /></Button>
            </Button.Group>
          </span>}
      />
      <div className="workcontain">
        <div className="right rightmax">
          <div className="toolbar">
            <Input
              {...field.init('sqdw', {})}
              maxLength={50}
              style={{ width: 200 }}
              placeholder={formatMessage({ id: 'Jcsq.jcsqSqdw' })}
              value={field.getValue('sqdw')}
              onChange={sqdw => field.setValue('sqdw', sqdw)}
              hasClear
              innerAfter={<Icon type="search" size="xs" onClick={doSearchAction} style={{ margin: 4 }} />}
            />
          </div>
          <div className="workspace">
            <Table
              maxBodyHeight="calc(100vh - 259px)"
              fixedHeader
              primaryKey="jcsqId"
              dataSource={data.list}
              loading={loading}
              rowSelection={{ onChange: onTableRowChange, selectedRowKeys: selectRowKeys }}
            >
              {column.map(col =>
                <Table.Column alignHeader="center" align="left" key={col.dataIndex} {...col} />
              )}
              <Table.Column cell={renderTableCell} align="left" width="250px" lock="right" />
            </Table>
            <Pagination
              className="footer"
              size={E9Config.Pagination.size}
              current={pageno}
              pageSize={pagesize}
              total={data.total}
              onChange={onPaginationChange}
              shape={E9Config.Pagination.shape}
              pageSizeSelector={E9Config.Pagination.pageSizeSelector}
              pageSizePosition={E9Config.Pagination.pageSizePosition}
              onPageSizeChange={onPageSizeChange}
              popupProps={E9Config.Pagination.popupProps}
              totalRender={total => <span className="pagination-total"> {`${formatMessage({ id: 'e9.pub.total' })}：${total}`}</span>}
            />
          </div>
        </div>
        <EditDailog />
        <ImportSetting />
      </div>
    </div>
  );
});

export default injectIntl(Jcsq);

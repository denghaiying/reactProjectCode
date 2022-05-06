import React, { useEffect } from 'react';
import { Table, Icon, Pagination, Button, Input } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import IceContainer from '@icedesign/container';
import moment from 'moment';
import { observer } from 'mobx-react';
import { E9FormBinderWrapper, EFormBinder } from '../../../components/EFormBinder';
import ContainerTitle from '../../../components/ContainerTitle';
import SearchPanel from '../../../components/SearchPanel';
import EditDailog from './EditDailog';
import EditPassword from './EditPassword';
import LoginStore from '../../../stores/system/LoginStore';
import YhStore from '../../../stores/inspect/YhStore';

const Yh = observer(props => {
  const { intl: { formatMessage } } = props;
  const { userinfo } = LoginStore;
  const { data, columns, loading, pageno, pagesize } = YhStore;
  // 定义表格表头参数
  const columnssource = [
    {
      title: formatMessage({ id: 'e9.yh.yhBh' }),
      dataIndex: 'yhBh',
      width: 200,
    },
    {
      title: formatMessage({ id: 'e9.yh.yhYhmc' }),
      dataIndex: 'yhYhmc',
      width: 200,
    },
    {
      title: formatMessage({ id: 'e9.yh.yhLx' }),
      dataIndex: 'yhLx',
      width: 200,
      cell: (value) => {
        if (value === 'Y') {
          return '管理员';
        } else if (value === 'N') {
          return '普通用户';
        }
      },
    },
    {
      title: formatMessage({ id: 'e9.yh.yhSjh' }),
      dataIndex: 'yhSjh',
      width: 200,
    },
    {
      title: formatMessage({ id: 'e9.yh.yhMail' }),
      dataIndex: 'yhMail',
      width: 200,
    },
    {
      title: formatMessage({ id: 'e9.yh.yhQyrq' }),
      dataIndex: 'yhQyrq',
      width: 200,
      cell: (value) => {
        return (
          <span>{value != null ? moment(value).format('YYYY-MM-DD') : ''}</span>
        );
      },
    },
    {
      title: formatMessage({ id: 'e9.yh.yhTy' }),
      dataIndex: 'yhTy',
      width: 200,
      cell: (value) => {
        if (value === 'Y') {
          return '启用';
        } else if (value === 'N') {
          return '停用';
        }
      },
    },
    {
      title: formatMessage({ id: 'e9.yh.yhTyrq' }),
      dataIndex: 'yhTyrq',
      width: 200,
      cell: (value) => {
        return (
          <span>{value != null ? moment(value).format('YYYY-MM-DD') : ''}</span>
        );
      },
    },
    {
      title: formatMessage({ id: 'e9.yh.yhBz' }),
      dataIndex: 'yhBz',
      width: 200,
    },
    {
      title: formatMessage({ id: 'e9.yh.whrid' }),
      dataIndex: 'yhWhrid',
      width: 200,
    },
    {
      title: formatMessage({ id: 'e9.pub.whr' }),
      dataIndex: 'yhWhr',
      width: 200,
    },
    {
      title: formatMessage({ id: 'e9.pub.whsj' }),
      dataIndex: 'yhWhsj',
      width: 200,
      cell: (value) => {
        return (
          <span>{value != null ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
        );
      },
    },
  ];


  const form = React.createRef();
  // 页面初始化
  useEffect(() => {
    YhStore.setParams({});
    YhStore.setColumns(columnssource);
  }, []);

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = (() => {
    const { validateFields } = form.current;
    validateFields((errors, values) => {
      if (!errors) {
        YhStore.setParams(values);
      }
    });
  });

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    YhStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    YhStore.setPageSize(pageSize);
  });

  /**
   * 最后一列操作列绘制修改 删除按钮
   * @param {*} value
   * @param {*} index
   * @param {*} record
   */
  const renderTableCell = (value, index, record) => {
    return (
      <div>
        <a href="javascript:;" onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>
        <a href="javascript:;" onClick={() => onDeleteAction(record.yhId)} style={{ marginLeft: '5px' }}><FormattedMessage id="e9.btn.delete" /></a>
        <a href="javascript:;" onClick={() => ondDetailAction(record)} style={{ marginLeft: '5px' }}><FormattedMessage id="e9.btn.view" /></a>
        <a href="javascript:;" onClick={() => onEditPassword(record)} style={{ marginLeft: '5px' }}><FormattedMessage id="e9.yh.password" /></a>
      </div>
    );
  };


  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    YhStore.dataView = false;
    const user = userinfo;
    const json = { yhQyrq: moment(), yhTyrq: moment(), yhWhrid: user.yhId, yhWhr: user.yhYhmc, yhWhsj: moment(), yhTy: false };
    YhStore.showEditForm('add', json);
  });


  /**
   * 响应删除事件
   * @param {*} id
   */
  const onDeleteAction = (yhId) => {
    deleteData(yhId);
  };

  /**
   * 响应编辑事件
   * @param {*} record
   */
  const onEditAction = (record) => {
    edit(record);
  };
  /**
   * 响应修改密码
   * @param {*} record
   */
  const onEditPassword = (record) => {
    editMm(record);
  };
  /**
  * 响应查看详情事件
  * @param {*} record
  */
  const ondDetailAction = (record) => {
    view(record);
  };
  // end ********************

  // begin *************以下是自定义函数区域
  /**
   * 删除操作
   * @param {* string} id
   */
  const deleteData = (id) => {
    YhStore.delete(id);
  };

  /**
   *  修改记录
   * @param {* User} record
   */
  const edit = ((record) => {
    YhStore.dataView = false;
    const json = {};
    const user = userinfo;
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        if (key === 'yhTy') {
          value = value === 'Y' ? true : false;
          YhStore.tyType = value;
        }
        json[key] = value;
      }
    });
    json.yhWhrid = user.yhId;
    json.yhWhr = user.yhYhmc;
    json.yhWhsj = moment();
    YhStore.showEditForm('edit', json);
  });

  /**
   *  浏览记录
   * @param {* User} record
   */
  const view = ((record) => {
    YhStore.dataView = true;
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });
    YhStore.showEditForm('view', json);
  });
  /**
   * 修改密码
   * @param {*} record
   */
  const editMm = ((record) => {
    const json = {};
    const user = userinfo;
    const { entries } = Object;
    YhStore.editVisibleMm = true;
    entries(record).forEach(([key, value]) => {
      if (value) {
        if (key !== 'yhMm') {
          json[key] = value;
        }
      }
    });
    json.yhWhrid = user.yhId;
    json.yhWhr = user.yhYhmc;
    json.yhWhsj = moment();
    YhStore.showEditFormMm('editMm', json);
  });

  const rowSelection = (() => {

  });
  // end **************
  return (
    <IceContainer style={{ padding: '0', height: '100%', width: '100%', marginBottom: '0' }}>
      <ContainerTitle
        title={formatMessage({ id: 'e9.yh.title' })}
      />
      <div style={{ padding: '20px' }}>
        <SearchPanel>
          <E9FormBinderWrapper inline labelAlign="left" labelTextAlign="right" refForm={form} >
            <EFormBinder name="yhYhmc" label={`${formatMessage({ id: 'e9.yh.yhYhmc' })}：`}>
              <Input style={{ width: 150 }} hasClear />
            </EFormBinder>
            <Button type="primary" onClick={doSearchAction}><Icon type="search" /><FormattedMessage id="e9.btn.search" /></Button>
          </E9FormBinderWrapper>
        </SearchPanel>
        <div style={{ marginBottom: '10px' }}>
          <Button.Group size="small" style={{ marginLeft: '10px' }} >
            <Button type="secondary" onClick={onAddAction}><Icon type="add" /><FormattedMessage id="e9.btn.add" /></Button>
          </Button.Group>
        </div>
        <Table
          maxBodyHeight={400}
          fixedHeader
          dataSource={data.list}
          rowSelection={rowSelection}
          loading={loading}
          primaryKey="yhId"
        >
          {columns.map(col =>
            <Table.Column alignHeader="center" align="left" key={col.dataIndex} {...col} title={formatMessage({ id: `${col.title}` })} />
          )}
          <Table.Column cell={renderTableCell} alignHeader="center" width="190px" lock="right" />
        </Table>
        <Pagination
          current={pageno}
          pageSize={pagesize}
          total={data.total}
          onChange={onPaginationChange}
          style={{ marginTop: '10px' }}
          shape="arrow-prev-only"
          pageSizeSelector="dropdown"
          pageSizePosition="end"
          onPageSizeChange={onPageSizeChange}
        />
      </div>
      <EditDailog />
      <EditPassword />
    </IceContainer >
  );
});

export default injectIntl(Yh);

import React, { useEffect } from 'react';
import { Table, Input, Icon, Pagination, Button, Form, Select, Field } from '@alifd/next';

import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import ContainerTitle from '../../../components/ContainerTitle';
import SearchPanel from '../../../components/SearchPanel';
import EditDailog from './EditDailog';
import DocDailog from './DocDailog';
import FjDailog from './FjDailog';
import ContentStore from '../../../stores/selfstreaming/content/Content';
import E9Config from '../../../utils/e9config';
import LoginStore from '../../../stores/system/LoginStore';
import { useIntl, FormattedMessage } from 'umi';
import SysStore from '@/stores/system/SysStore';


const Content = observer(props => {
  // const { intl: { formatMessage } } = props;
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  const { data, columns, loading, pageno, pagesize,channelData} = ContentStore;
   const field = Field.useField({
    values: ContentStore.params,
    onChange: (name, value) => {
      if (name === 'contentchannelid') {
        const v = value;
        if (v) {
          let r = {};
          ContentStore.channelData.some(it => {
            if (it.value === v) {
              r = it;
              return true;
            }
            return false;
          });
          field.setValue('contentchannelid', r.value);
        } else {
          field.setValue('contentchannelid', '');
        }
      }
      const values = field.getValues();
      ContentStore.setParams(values, true);
      ContentStore.queryData(values);
    },
  });

  useEffect(() => {
    ContentStore.findchannelAll().then(() => { ContentStore.queryData(); });
  }, []);

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = ((values, errors) => {
    if (!errors) {
      ContentStore.setParams(values);
    }
  });


  /**
   * 点击文档按钮事件响应
   */
  const onSetDocAction = () => {
    if (!ContentStore.selectRowRecords || ContentStore.selectRowRecords.length < 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectNone' }) });
      return;
    }
    if (ContentStore.selectRowRecords.length > 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectOneOnly' }) });
      return;
    }
    
    ContentStore.showDocDailog(true,ContentStore.selectRowRecords);
  };

    /**
   * 点击文档按钮事件响应
   */
  const onSetFbAction = () => {
    if (!ContentStore.selectRowRecords || ContentStore.selectRowRecords.length < 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectNone' }) });
      return;
    }
    if (ContentStore.selectRowRecords.length > 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectOneOnly' }) });
      return;
    }
    ContentStore.updatecontentfb(ContentStore.selectRowRecords);
  };

    /**
   * 点击文档按钮事件响应
   */
  const onSetFjAction = () => {
    if (!ContentStore.selectRowRecords || ContentStore.selectRowRecords.length < 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectNone' }) });
      return;
    }
    if (ContentStore.selectRowRecords.length > 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectOneOnly' }) });
      return;
    }
    ContentStore.showFjDailog(true,ContentStore.selectRowRecords);
  };

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    ContentStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    ContentStore.setPageSize(pageSize);
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
        <a href="javascript:;" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.id)}><FormattedMessage id="e9.btn.delete" /></a>
      </div>);
  };

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    ContentStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    const json = {  contentwhsj: moment(),contentauthor: SysStore.getCurrentUser().yhmc};
    ContentStore.showEditForm('add', json);
  });



  /**
   * 响应删除事件
   * @param {*} id
   */
  const onDeleteAction = (id) => {
    deleteData(id);
  };

  /**
   * 响应编辑事件
   * @param {*} record
   */
  const onEditAction = (record) => {
    edit(record);
  };

  // end ********************

  // begin *************以下是自定义函数区域
  /**
   * 删除操作
   * @param {* string} id
   */
  const deleteData = (id) => {
    ContentStore.delete(id);
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
    json.contentwhsj = moment();
    ContentStore.showEditForm('edit', json);
  });

  // end **************
  return (
      <div className="workpage">
         <ContainerTitle
        title={formatMessage({ id: 'e9.content.content.title'})}
        mainroute="/"
        umid=""
        extra={
          <span>
            <Button.Group>
              <Button type="primary" ><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" /></Button>
              <Button type="primary" ><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" /></Button>
            </Button.Group>
            <Button.Group style={{ marginLeft: '10px' }} >
              <Button type="primary" onClick={onAddAction}><Icon type="add" /><FormattedMessage id="e9.btn.add" /></Button>
            </Button.Group>
            <Button.Group  style={{ marginLeft: '10px' }}>
            <Button type="secondary" onClick={onSetDocAction}><Icon className="iconfont iconuser_role" /><FormattedMessage id="e9.content.content.contentDesc" /></Button>
          </Button.Group>
             <Button.Group style={{ marginLeft: '10px' }}>
            <Button type="secondary" onClick={onSetFbAction}><Icon className="iconfont iconuser_role" /><FormattedMessage id="e9.content.content.contentfb" /></Button>
          </Button.Group>
             <Button.Group style={{ marginLeft: '10px' }}>
            <Button type="secondary" onClick={onSetFjAction}><Icon className="iconfont iconuser_role" /><FormattedMessage id="e9.content.content.contentfj" /></Button>
          </Button.Group>
         
          </span>
        }
      />

       <div className="workcontain">
     <div className="right rightmax">
          <div className="toolbar">
              <Input
              {...field.init('contenttitle', {})}
              maxLength={50}
              style={{ width: 170 }}
              placeholder={formatMessage({ id: 'e9.content.content.contenttitle' })}
              hasClear
              value={field.getValue('contenttitle')}
              onChange={contenttitle => field.setValue('contenttitle', contenttitle)}
              innerAfter={<Icon type="search" size="xs" onClick={doSearchAction} style={{ margin: 4 }} />}
            />
            <Select 
              {...field.init('contentchannelid', {})} hasClear
              placeholder={formatMessage({ id: 'e9.content.content.contentchannelid' })}
              style={{ width: '200px' }} dataSource={channelData}
            >
            </Select>
          </div>
      <div className="workspace">
        <Table
          maxBodyHeight={400}
          dataSource={data.list}
          fixedHeader
          loading={loading}
          rowSelection={{ onChange: onTableRowChange }}
        >
            {columns.map(col =>
                  <Table.Column alignHeader="center" key={col.dataIndex} {...col} title={formatMessage({ id: `${col.title}` })} />
              )}
          <Table.Column cell={renderTableCell} width="100px" lock="right" />
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
      </div>
      <EditDailog />
      <DocDailog />
      <FjDailog />
     </div>
  );
});

export default Content;

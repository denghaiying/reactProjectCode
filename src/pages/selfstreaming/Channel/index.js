import React, { useEffect } from 'react';
import { Table, Input, Icon, Pagination, Button, Switch, Form, Field } from '@alifd/next';
import moment from 'moment';
import { observer } from 'mobx-react';
import ContainerTitle from '../../../components/ContainerTitle';
import EditDailog from './EditDailog';
import ChannelStore from '../../../stores/selfstreaming/channel/Channel';
import E9Config from '../../../utils/e9config';
import loginStore from '../../../stores/system/LoginStore';
import { useIntl, FormattedMessage } from 'umi';
import SysStore from '@/stores/system/SysStore';


const Channel = observer(props => {
  // const { intl: { formatMessage } } = props;
  
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;

  const { data, colums, loading, pageno, pagesize } = ChannelStore;
  const { Item: FormItem } = Form;
  const field = Field.useField();

  useEffect(() => {
    ChannelStore.findchanneltypeAll();
    ChannelStore.findchannelAll().then(() => { ChannelStore.queryData(); });
  }, []);


  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = ((values, errors) => {
    if (!errors) {
      ChannelStore.setParams(values);
    }
  });

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    ChannelStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    ChannelStore.setPageSize(pageSize);
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
        <a href="javascript:;" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.channelid)}><FormattedMessage id="e9.btn.delete" /></a>
      </div>);
  };

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    ChannelStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    const json = {  channelwhsj: moment(),channelwhr:SysStore.getCurrentUser().yhmc,channelwhrid:SysStore.getCurrentUser().id};
    ChannelStore.showEditForm('add', json);
    ChannelStore.findchannelAll();
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
     ChannelStore.findchannelAll();
     record.channelwhr=SysStore.getCurrentUser().yhmc;
     record.channelwhrid=SysStore.getCurrentUser().id;
    edit(record);
  };

  // end ********************

  // begin *************以下是自定义函数区域
  /**
   * 删除操作
   * @param {* string} id
   */
  const deleteData = (id) => {
    ChannelStore.delete(id);
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
    if (record.channelmobile === 'Y') {
      json.channelmobile = true;
    }else{
       json.channelmobile = false;
    }
    
     if (record.channelsfdhl === 'Y') {
      json.channelsfdhl = true;
    }else{
      json.channelsfdhl = false;
    }
    json.channelwhsj = moment();
    ChannelStore.showEditForm('edit', json);
  });

  // end **************
  return (
     <div className="workpage">
         <ContainerTitle
        title={formatMessage({ id: 'e9.channel.channel.title' })}
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
         
          </span>
        }
      />

  
   <div className="workcontain">
        {/* 如果需要左边区域，则把这段放开，并去除下面div的样式的rightmax部分，仅保留right
        <div className="left">左边区域按实际布局</div> */}
        <div className="right rightmax">
          <div className="toolbar">
              <Input
              {...field.init('channelname', {})}
              maxLength={50}
              style={{ width: 170 }}
              placeholder={formatMessage({ id: 'e9.channel.channel.channelname' })}
              hasClear
              value={field.getValue('channelname')}
              onChange={channelname => field.setValue('channelname', channelname)}
              innerAfter={<Icon type="search" size="xs" onClick={doSearchAction} style={{ margin: 4 }} />}
            />
          </div>
      <div className="workspace">
        <Table
          maxBodyHeight={400}
          dataSource={data.list}
          fixedHeader
          loading={loading}
          rowSelection={{ onChange: onTableRowChange }}
        >
            {colums.map(col =>
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
     </div>
  );
});

export default Channel;

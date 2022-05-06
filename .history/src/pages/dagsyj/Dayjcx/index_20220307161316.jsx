import React, { useEffect, useState } from 'react';
import { Table, NumberPicker, Tab, Pagination, Checkbox, Button, Field, Select, Icon, Input } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import OptrightStore from '@/stores/user/OptrightStore';
import SvgIcon from '@/components/SvgIcon';
import DayjcxStore from '../../../stores/dagsyj/DayjcxStore';
import E9Config from '../../../utils/e9config';
import EmptyData from '@/components/EmptyData';
import SysStore from "@/stores/system/SysStore";
import { useIntl, FormattedMessage } from 'umi';

/**
 * @Author: Mr.Wang
 * @Date: 2021/06/02 13:45
 * @Version: 9.0
 * @Content:
 *    2021/06/02 王晨阳
 *      新增代码
 */
const Dayjcx = observer(props => {
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  const { data, columns, loading, pageno, pagesize, defaultData } = DayjcxStore;
  const field = Field.useField();
  const umid = 'DAGSYJ0006';
  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    const curdate = moment();
    // field.setValues({ year: Number.parseInt(curdate.format("YYYY")), month: Number.parseInt(curdate.format("M")), sw: "W" });
    DayjcxStore.setColumns([{
      title: formatMessage({ id: 'e9.dagsyj.dayjcx.yjzt' }),
      dataIndex: 'yjzt',
      width: 100,
      cell: (value) => {
        if (value === 'I') {
          return formatMessage({ id: 'e9.dagsyj.dayjcx.select.yjztI' });
        } else if (value === 'C') {
          return formatMessage({ id: 'e9.dagsyj.dayjcx.select.yjztC' });
        } else if (value === 'E') {
          return formatMessage({ id: 'e9.dagsyj.dayjcx.select.yjztE' });
        }
      },
    }, {
      title: formatMessage({ id: 'e9.dagsyj.dayjcx.sqrbh' }),
      dataIndex: 'sqrbh',
      width: 100,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.dayjcx.sqr' }),
      dataIndex: 'sqr',
      width: 100,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.dayjcx.sqbmid' }),
      dataIndex: 'sqbmname',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.dayjcx.sqrdh' }),
      dataIndex: 'sqrdh',
      width: 150,

    }, {
      title: formatMessage({ id: 'e9.dagsyj.dayjcx.sqrqq' }),
      dataIndex: 'sqrqq',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.dayjcx.scdw' }),
      dataIndex: 'scdwname',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.dayjcx.gcdw' }),
      dataIndex: 'gcdwname',
      width: 150,

    }, {
      title: formatMessage({ id: 'e9.dagsyj.dayjcx.ndb' }),
      dataIndex: 'ndb',
      width: 100,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.dayjcx.nde' }),
      dataIndex: 'nde',
      width: 100,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.dayjcx.scdakid' }),
      dataIndex: 'scdakname',
      width: 150,

    }, {
      title: formatMessage({ id: 'e9.dagsyj.dayjcx.gcdakid' }),
      dataIndex: 'gcdakname',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.dayjcx.yjtmsl' }),
      dataIndex: 'yjtmsl',
      width: 120,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.dayjcx.yjywsl' }),
      dataIndex: 'yjywsl',
      width: 120,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.dayjcx.msg' }),
      dataIndex: 'msg',
      width: 200,
    }]);
    DayjcxStore.findDw().then(() => {
      DayjcxStore.findDak().then(() => {
        DayjcxStore.findBm().then(() => {
          doSearchAction();
        })
      })
    })
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
        DayjcxStore.setParams(values);
      }
    });
  });
/**
     * 下载EEP包按钮点击事件
     */
 const doDownloadAction = (() => {
   debugger
  DayjcxStore.downloadEEP()
});
  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    DayjcxStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    DayjcxStore.setPageSize(pageSize);
  });
  /**
   * 最后一列操作列绘制修改 删除按钮
   * @param {*} value
   * @param {*} index
   * @param {*} record
   */
  // const renderTableCell = (value, index, record) => {
  //   return (
  //     <div>
  //       {OptrightStore.hasRight(umid, 'SYS102') && <a href="javascript:void(0)" onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>}
  //       {OptrightStore.hasRight(umid, 'SYS103') && <a href="javascript:void(0)" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.id)}><FormattedMessage id="e9.btn.delete" /></a>}
  //     </div>);
  // };

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    DayjcxStore.setSelectRows(selectedRowKeys, records);
  };

  return (
    <div className="file-transfer">
      <div className="file-content">
        <div className="top">
          <div className="condition">
            <div className="right">
              {/* <Select
                {...field.init('nd', {})}
                style={{ marginRight: 10 }}
                // hasClear
                value={field.getValue('nd')}
                onChange={nd => { field.setValue('nd', sw) }}
              >
                <Select.Option value="W">待我处理</Select.Option>
                <Select.Option value="H">我已处理</Select.Option>
              </Select> */}
              <span>{formatMessage({ id: 'e9.dagsyj.dayjcx.nd' })}： </span>
              <Input
                {...field.init('nd', {})}
                name="nd"
                maxLength={50}
                style={{ width: 150 }}
                hasClear
                value={field.getValue('nd')}
                onChange={nd => {
                  field.setValue('nd', nd);
                }}
                placeholder={formatMessage({ id: 'e9.dagsyj.dayjcx.select.nd' })}
              />
              <span style={{ paddingLeft: 10 }}>{formatMessage({ id: 'e9.dagsyj.dayjcx.scdw' })}： </span>
              <Select
                {...field.init('scdw', { initValue: defaultData.id, autoUnmount: false })}
                name="scdw"
                style={{ width: 250 }}
                dataSource={DayjcxStore.dwdata}
                onChange={scdw => { field.setValue('scdw', scdw) }}
                hasClear
                placeholder={formatMessage({ id: 'e9.dagsyj.dayjcx.select.scdw' })}
              />
              <span style={{ paddingLeft: 10 }}>{formatMessage({ id: 'e9.dagsyj.dayjcx.gcdw' })}： </span>
              <Select
                {...field.init('gcdw', { initValue: defaultData.id, autoUnmount: false })}
                name="gcdw"
                style={{ width: 250 }}
                dataSource={DayjcxStore.dwdata}
                onChange={gcdw => { field.setValue('gcdw', gcdw) }}
                hasClear
                placeholder={formatMessage({ id: 'e9.dagsyj.dayjcx.select.gcdw' })}
              />
              <span style={{ paddingLeft: 10 }}>{formatMessage({ id: 'e9.dagsyj.dayjcx.yjzt' })}： </span>
              <Select
                {...field.init('yjzt', {})}
                style={{ width: 200 }}
                hasClear
                value={field.getValue('yjzt')}
                onChange={yjzt => { field.setValue('yjzt', yjzt) }}
                placeholder={formatMessage({ id: 'e9.dagsyj.dayjcx.select.yjzt' })}
              >
                <Select.Option value="I">{formatMessage({ id: 'e9.dagsyj.dayjcx.select.yjztI' })}</Select.Option>
                <Select.Option value="C">{formatMessage({ id: 'e9.dagsyj.dayjcx.select.yjztC' })}</Select.Option>
                <Select.Option value="E">{formatMessage({ id: 'e9.dagsyj.dayjcx.select.yjztE' })}</Select.Option>
              </Select>
              <Button type="primary" style={{ paddingLeft: 10 }} onClick={doSearchAction} ><Icon type="search" />查询</Button>
              {/* <Button type="primary" style={{ paddingLeft: 10 }} onClick={doDownloadAction} ><Icon type="download" />下载EEP</Button> */}
            </div>
          </div>
          <Table
            maxBodyHeight="calc(100vh - 259px)"
            dataSource={data.results}
            fixedHeader
            loading={loading}
            rowSelection={{ onChange: onTableRowChange, selectedRowKeys: DayjcxStore.selectRowKeys, mode: "single" }}
            emptyContent={<EmptyData />}
            onRowClick={record => {
              DayjcxStore.setSelectRows([record.id], [record]);
              // onChangeRow(record);
            }}
          >

            {columns.map(col =>
              <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
            )}
            {/* <Table.Column cell={renderTableCell} width="100px" lock="right" /> */}
          </Table>
          <Pagination
            //   className="footer"
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
    </div >
  );
});

export default Dayjcx;

import React, { useEffect, useState } from 'react';
import {
  Table,
  NumberPicker,
  Pagination,
  Button,
  Field,
  Select,
  Icon,
  Input,
  DatePicker2,
  DatePicker,
} from '@alifd/next';

import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import OptrightStore from '@/stores/user/OptrightStore';
import EmptyData from '@/components/EmptyData';
import LoginStore from '../../../stores/system/LoginStore';
import ZxjstjStore from '../../../stores/datj/ZxjstjStore';
import './index.less';
import { useIntl, FormattedMessage } from 'umi';
import ExportJsonExcel from 'js-export-excel';

/**
 * @Author: Mr.Wang
 * @Date: 2021/06/29 13:45
 * @Version: 9.0
 * @Content:
 *    2021/06/29 王晨阳
 *      新增代码
 */
const Zxjstj = observer((props) => {
  //  const { intl: { formatMessage } } = props;
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const { data, columns, loading, pageno, pagesize, defaultData } = ZxjstjStore;
  const { userinfo } = LoginStore;
  const field = Field.useField();
  const umid = 'DATJ041';
  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    const curdate = moment();
    // field.setValues({ year: Number.parseInt(curdate.format("YYYY")), month: Number.parseInt(curdate.format("M")), sw: "W" });
    ZxjstjStore.setColumns([
      {
        title: '全宗名称',
        dataIndex: 'qzname',
        width: 100,
      },
      {
        title: '移交年度',
        dataIndex: 'nd',
        width: 150,
      },
      {
        title: '档案类别',
        dataIndex: 'dalbmc',
        width: 150,
      },
      {
        title: '条目数量',
        dataIndex: 'tmsl',
        width: 150,
      },
      {
        title: '原文数量',
        dataIndex: 'ywsl',
        width: 150,
      },
      {
        title: '原文大小(M)',
        dataIndex: 'ywdx',
        width: 150,
      },
    ]);
    ZxjstjStore.findDw().then(() => {
      ZxjstjStore.findDak().then(() => {
        doSearchAction();
      });
    });
  }, []);

  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = () => {
    field.validate((errors, values) => {
      if (!errors) {
        if (values.time === undefined) {
          delete values.time;
        }
        if (values.qzmc === undefined) {
          delete values.qzmc;
        }
        if (values.time !== undefined && values.time.length > 0) {
          if (values.time[0] != null && values.time[1] != null) {
            values.startTime = values.time[0].format('YYYY-MM-DD');
            values.endTime = values.time[1].add(1, 'days').format('YYYY-MM-DD');
          }
        }
        ZxjstjStore.findZxjstj(values);
      }
    });
  };
  const downloadExcel = () => {
    ZxjstjStore.downloadExcel(ZxjstjStore.data);
  };
  return (
    <div className="hall-regist">
      <div className="control">
        <span className="label">全宗名称： </span>
        <Select
          className="select"
          {...field.init('qzmc', { autoUnmount: false })}
          name="qzmc"
          dataSource={ZxjstjStore.dwdata}
          onChange={(qzmc) => {
            field.setValue('qzmc', qzmc);
          }}
          hasClear
          placeholder="请选择全宗名称"
        />
        <span className="label">移交日期： </span>
        {/* <RangePicker onChange={onChangeRangePicker} /> */}
        <DatePicker.RangePicker
          name="time"
          {...field.init('time', { autoUnmount: false })}
          style={{ width: 260, lineHeight: 0 }}
          placeholder="请选择日期"
          hasClear
          onChange={(time) => {
            field.setValue('time', time);
          }}
          style={{ width: '300px' }}
          format="YYYY-MM-DD"
        />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button
          type="primary"
          style={{ paddingLeft: 10 }}
          onClick={doSearchAction}
        >
          <Icon type="search" />
          查询
        </Button>
      </div>
      <div className="main-content">
        <div className="btns-control">
          <Button type="primary" onClick={downloadExcel}>
            {' '}
            <Icon type="download" />
            导出EXCEL
          </Button>
        </div>
        <div className="table-container">
          <Table
            maxBodyHeight="calc(100vh - 259px)"
            dataSource={data}
            fixedHeader
            hasBorder
            isZebra
            loading={loading}
            // rowSelection={{ onChange: onTableRowChange, selectedRowKeys: ZxjstjStore.selectRowKeys, mode: "single" }}
            emptyContent={<EmptyData />}
            // onRowClick={record => {
            //   ZxjstjStore.setSelectRows([record.id], [record]);
            //   // onChangeRow(record);
            // }}
            // className="common-table"
          >
            {columns.map((col) => (
              <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
});

export default Zxjstj;

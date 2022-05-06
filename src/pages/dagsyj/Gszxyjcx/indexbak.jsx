import React, { useEffect, useState } from 'react';
import { Table, NumberPicker, Pagination, Button, Field, Select, Icon, Input, DatePicker, Loading } from '@alifd/next';
import { injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import OptrightStore from '@/stores/user/OptrightStore';
import SvgIcon from '@/components/SvgIcon';
import EmptyData from '@/components/EmptyData';
import GszxyjcxStore from '../../../stores/dagsyj/GszxyjcxStore';
import E9Config from '../../../utils/e9config';
import './index.less'

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
const Gszxyjcx = observer(props => {
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  const { data, columns, loading, pageno, pagesize, defaultDat, downloadLoading } = GszxyjcxStore;

  const field = Field.useField();
  const umid = 'DAGSYJ0006';
  // const datasource = []
  // for (let i = 0; i < 12; i++) {
  //   datasource.push({ num: '210000163', jy_person: '李玉春', type: '身份证', type_num: '320124197208152226', addr: '南京市溧水区晶振桥枝山村', goal: '婚姻登记', method: '到馆', fy_count: 0, fp_count: 0 })
  // }
  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    SysStore.findXTname();
    const curdate = moment();
    // field.setValues({ year: Number.parseInt(curdate.format("YYYY")), month: Number.parseInt(curdate.format("M")), sw: "W" });
    GszxyjcxStore.setColumns([{
      // title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.yjzt' }),
      // dataIndex: 'yjzt',
      // width: 100,
      // lock: 'left'
      // }, {
      //   title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.sqrbh' }),
      //   dataIndex: 'sqrbh',
      //   width: 150,
      // }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.sqrmc' }),
      dataIndex: 'sqrmc',
      width: 100,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.dwname' }),
      dataIndex: 'dwname',
      width: 150,
      // }, {
      //   title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.qzh' }),
      //   dataIndex: 'qzh',
      //   width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.sqsj' }),
      dataIndex: 'sqsj',
      width: 150,
      // }, {
      //   title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.gqzh' }),
      //   dataIndex: 'gqzh',
      //   width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.gmcname' }),
      dataIndex: 'gmcname',
      width: 150,

    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.ywsl' }),
      dataIndex: 'ywsl',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.ywsize' }),
      dataIndex: 'ywsize',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.aqx' }),
      dataIndex: 'aqx',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.kyx' }),
      dataIndex: 'kyx',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.zsx' }),
      dataIndex: 'zsx',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.mljc' }),
      dataIndex: 'mljc',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.qwsjjc' }),
      dataIndex: 'qwsjjc',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.qtjc' }),
      dataIndex: 'qtjc',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.yjsm' }),
      dataIndex: 'yjsm',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.bhsm' }),
      dataIndex: 'bhsm',
      width: 200,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.dakmc' }),
      dataIndex: 'dakmc',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.ndb' }),
      dataIndex: 'ndb',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.nde' }),
      dataIndex: 'nde',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.bgqx' }),
      dataIndex: 'bgqx',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.gdakmc' }),
      dataIndex: 'gdakmc',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.qsbh' }),
      dataIndex: 'qsbh',
      width: 150,

    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.lx' }),
      dataIndex: 'lx',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.dagsyj.gszxyjcx.wgjc' }),
      dataIndex: 'wgjc',
      width: 150,
    }]);
    GszxyjcxStore.findDw().then(() => {
      GszxyjcxStore.findDak().then(() => {
        doSearchAction();
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
        if (values.dw === undefined) {
          delete values.dw ;
        }
        if (values.gmc === undefined) {
          delete values.gmc ;
        }
        GszxyjcxStore.setParams(values);
      }
    });
  });
  /**
       * 下载EEP包按钮点击事件
       */
  const doDownloadAction = ((record) => {

    const params = {
      dakid: record.dakid,
      // tmid: "DAIM202004031357510010",
      sqdwmc: record.dwname,
      id: record.id,
      xtname: SysStore.xtname,
    };
    GszxyjcxStore.downloadEEP(params)
  });
  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    GszxyjcxStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    GszxyjcxStore.setPageSize(pageSize);
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
        <a href="javascript:void(0)" onClick={() => doDownloadAction(record)}>下载EEP</a>
      </div>);
  };

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    GszxyjcxStore.setSelectRows(selectedRowKeys, records);
  };
  const CustomLoading = (props) => {

    return <Loading tip="下载中..." {...props} />;
  }

  return (
    <div className="hall-regist">
      <div className="control">
        {/* <span className="label">{formatMessage({ id: 'e9.dagsyj.gszxyjcx.nd' })}： </span>
        <Input
          className="input"
          {...field.init('nd', {})}
          name="nd"
          maxLength={50}
          hasClear
          value={field.getValue('nd')}
          onChange={nd => {
            field.setValue('nd', nd);
          }}
          placeholder={formatMessage({ id: 'e9.dagsyj.gszxyjcx.select.nd' })}
        /> */}
        <span className="label">{formatMessage({ id: 'e9.dagsyj.gszxyjcx.dwname' })}： </span>
        <Select
          className="select"
          {...field.init('dw', { autoUnmount: false })}
          name="dw"
          size="medium"
          dataSource={GszxyjcxStore.dwdata}
          onChange={dw => { field.setValue('dw', dw) }}
          hasClear
          placeholder={formatMessage({ id: 'e9.dagsyj.gszxyjcx.select.dw' })}
        />
        <span className="label">{formatMessage({ id: 'e9.dagsyj.gszxyjcx.gmcname' })}： </span>
        <Select
          className="select"
          {...field.init('gmc', { autoUnmount: false })}
          name="gmc"
          dataSource={GszxyjcxStore.dwdata}
          onChange={gmc => { field.setValue('gmc', gmc) }}
          hasClear
          placeholder={formatMessage({ id: 'e9.dagsyj.gszxyjcx.select.gmc' })}
        />
        <Button type="primary" style={{ paddingLeft: 10 }} onClick={doSearchAction} ><Icon type="search" />查询</Button>
      </div>
      <div className="main-content">
        {/* <div className="btns-control">
          <Button type="primary" style={{ paddingLeft: 10 }} onClick={doDownloadAction} ><Icon type="download" />下载EEP</Button>
        </div> */}
        <div className="table-container">
          {/* <Loading tip="下载中..." visible={downloadLoading}> */}
          <Table
            maxBodyHeight="calc(100vh - 259px)"
            dataSource={data.results}
            fixedHeader
            hasBorder
            isZebra
            loading={downloadLoading}
            loadingComponent={CustomLoading}
            rowSelection={{ onChange: onTableRowChange, selectedRowKeys: GszxyjcxStore.selectRowKeys, mode: "single" }}
            emptyContent={<EmptyData />}
            onRowClick={record => {
              GszxyjcxStore.setSelectRows([record.id], [record]);
              // onChangeRow(record);
            }}
          // className="common-table"
          >
            {columns.map(col =>
              <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
            )}
            <Table.Column cell={renderTableCell} width="100px" lock="right" />
          </Table>
          {/* </Loading> */}
          <Pagination
            className="paginate"
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
  );
});

export default Gszxyjcxbak;

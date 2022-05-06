import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { FormattedMessage, useIntl } from 'umi';
import {
  Input,
  DatePicker,
  Button as IceButton,
  Table,
  Pagination,
  Icon,
  Field,
  Dialog,
  Upload,
  Notification,
} from '@alifd/next';
import OptrightStore from '@/stores/user/OptrightStore';
import { EditOutlined, DeleteOutlined, EyeOutlined, ProfileOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Checkbox, Tooltip } from 'antd';
import EmptyData from '@/components/EmptyData';
import LydjStore from '@/stores/dadt/LydjStore';
import E9Config from '@/utils/e9config';
import SysStore from '@/stores/system/SysStore';
import moment, { isMoment } from 'moment';
import LydjEdit from './edit';
import Optlog from './Optlog';
import LymxData from './LymxData';

import './index.less';

const Lydj = observer(() => {
  const { RangePicker } = DatePicker;
  const umid = 'DADT0002';
  const { formatMessage } = useIntl();
  const { data, columns, loading, pageno, pagesize } = LydjStore;
  const [maxBodyHeight, setMaxBodyHeight] = useState('500px');
  const [logvisible, setLogVisible] = useState(false);
  const [curRecordId, setCurRecordId] = useState("");
  const userinfo = SysStore.getCurrentUser();
  const field = Field.useField();
  const ref = useRef(ref);
  const getSjzdItem = (sjzd, value, vcol = 'id') => {
    const vs = LydjStore.sjzdData[sjzd] || [];
    for (let i = 0; i < vs.length; i++) {
      const v = vs[i];
      if (v[vcol] === value) {
        return v.mc;
      }
    }
    return '';
  };
  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    LydjStore.getSjzdData('证件名称');
    LydjStore.setColumns([
      {
        title: '登记号',
        dataIndex: 'lsh',
        width: 100,
      },
      {
        title: '查档人',
        dataIndex: 'cyrxm',
        width: 80,
      },
      {
        title: '证件',
        dataIndex: 'zjmc',
        width: 80,
        cell: (v) => getSjzdItem('证件名称', v, 'bh'),
      },
      {
        title: '证件号',
        dataIndex: 'zjhm',
        width: 200,
      },
      {
        title: '性质',
        dataIndex: 'jyrxz',
        width: 80,
        cell: (v) => (v === 'A' && '个人') || '单位',
      },
      {
        title: '家庭住址',
        dataIndex: 'jtzz',
        width: 300,
      },
      {
        title: '联系电话',
        dataIndex: 'lxdh',
        width: 120,
      },
      {
        title: '单位',
        dataIndex: 'dw',
        width: 150,
      },
      {
        title: '备注',
        dataIndex: 'bz',
        width: 200,
      },
      {
        title: '利用目的',
        dataIndex: 'lymd',
        width: 100,
      },
      {
        title: '利用方式',
        dataIndex: 'lyfs',
        width: 100,
      },
      {
        title: '利用效果',
        dataIndex: 'lyxg',
        width: 100,
      },
      {
        title: '打印页数',
        dataIndex: 'fyys',
        width: 100,
      },
      {
        title: '翻拍页数',
        dataIndex: 'fbys',
        width: 100,
      },
      {
        title: '下载文件数',
        dataIndex: 'xzwjs',
        width: 100,
      },
      {
        title: '复印页数',
        dataIndex: 'kpzs',
        width: 100,
      },
      {
        title: '调资料册数',
        dataIndex: 'dzlcs',
        width: 100,
      },
      {
        title: '出具证明数',
        dataIndex: 'cjzms',
        width: 100,
      },
      {
        title: '登记人',
        dataIndex: 'djr',
        width: 100,
      },

      {
        title: '登记日期',
        dataIndex: 'djrq',
        width: 120,
        cell: (v) => moment(v, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      },
      {
        title: '维护时间',
        dataIndex: 'whsj',
        width: 150,
      },
    ]);
    doSearchAction();
    LydjStore.editVisible = false;
  }, []);

  useEffect(() => {
    if (ref && ref.current && ref.current.clientHeight) {
      setMaxBodyHeight(`${ref.current.clientHeight - 40}px`);
    }
  }, [ref && ref.current && ref.current.clientHeight]);
  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = (current) => {
    LydjStore.setPageNo(current);
  };

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = (pageSize) => {
    LydjStore.setPageSize(pageSize);
  };

  const onTableRowChange = (selectedRowKeys, records) => {
    LydjStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   *
   * @param {*} value
   * @param {*} index
   * @param {*} record
   * @returns
   */
  const renderTableCell = (value, index, record) => {
    // console.log('record,record',record)
    // console.log('recordstatus,recordstatus',record.status)
    // console.log('OptrightStore.hasRight(umid)',OptrightStore.hasRight(umid, 'SYS102'))
    record.yysj = record.yysj ? moment(record.yysj) : undefined;
    return (
      <div>
        <Tooltip title="浏览">
          <Button
            size="small"
            style={{
              fontSize: '12px',
              color: '#08c',
              width: 20,
              height: 20,
              maxWidth: 20,
              minWidth: 20,
            }}
            shape="circle"
            icon={<EyeOutlined style={{ fontSize: '12px' }} />}
            onClick={() => LydjStore.showEditForm('view', record)}
          />
        </Tooltip>
        {/* 这里调整完毕后去除第一个非(!)号判断 */}
        {OptrightStore.hasRight(umid, 'SYS102') && record.status !== 'C' && (
          <Tooltip title="修改">
            <Button
              size="small"
              style={{
                fontSize: '12px',
                color: '#08c',
                width: 20,
                height: 20,
                maxWidth: 20,
                minWidth: 20,
              }}
              shape="circle"
              icon={<EditOutlined style={{ fontSize: '12px' }} />}
              onClick={() => onEditAction(record)}
            />
          </Tooltip>
        )}
        {OptrightStore.hasRight(umid, 'SYS103') && record.status !== 'C' && (
          <Tooltip title="删除">
            <Button
              size="small"
              danger={true}
              style={{
                fontSize: '12px',
                width: 20,
                height: 20,
                maxWidth: 20,
                minWidth: 20,
              }}
              type={'primary'}
              shape="circle"
              icon={<DeleteOutlined style={{ fontSize: '12px' }} />}
              onClick={() => onDeleteAction(record)}
            />
          </Tooltip>
        )}
        <Tooltip title="查看利用明细">
          <Button
            size="small"
            style={{
              fontSize: '12px',
              color: '#08c',
              width: 20,
              height: 20,
              maxWidth: 20,
              minWidth: 20,
            }}
            shape="circle"
            icon={<FileTextOutlined style={{ fontSize: '12px' }} />}
            onClick={() => showLymxData(record)}
          />
        </Tooltip>
        <Tooltip title="查看操作日志">
          <Button
            size="small"
            style={{
              fontSize: '12px',
              width: 20,
              color: '#08c',
              height: 20,
              maxWidth: 20,
              minWidth: 20,
            }}
            shape="circle"
            icon={<ProfileOutlined style={{ fontSize: '12px' }} />}
            onClick={() => onLogview(record)}
          />
        </Tooltip>
      </div>
    );
  };

  const onDeleteAction = (rec) => {
    Dialog.confirm({
      title: '提醒',
      content: '确定删除选中记录?',
      onOk: () => {
        LydjStore.delete(rec);
      },
    });
  };

  const onLogview = (rec) => {
    setCurRecordId(rec.id);
    setLogVisible(true);
  };

  const showLymxData = (rec) => {
    LydjStore.showLymxModal(true, rec);
  };

  const doSearchAction = () => {
    field.validate((errors, values) => {
      if (!errors) {
        const { cx_kssqrq, cx_jssqrq, ...params } = values;
        if (cx_kssqrq && isMoment(cx_kssqrq)) {
          params.cx_kssqrq = cx_kssqrq.format('YYYY-MM-DD');
        }
        if (cx_jssqrq && isMoment(cx_jssqrq)) {
          params.cx_jssqrq = cx_jssqrq.format('YYYY-MM-DD');
        }
        LydjStore.setParams(params);
      }
    });
  };

  const onAddAction = () => {
    const json = {
      whrid: userinfo.id,
      whr: userinfo.yhmc,
      whsj: moment().format('YYYY-MM-DD HH:mm:ss'),
      jyrxz: 'A',
      bmwd: SysStore.getCurrentCmp().mc || '',
      lyfs: LydjStore.getSjzdValue('利用方式', '到馆', 'bh'),
      zjmc: LydjStore.getSjzdValue('证件名称', '身份证', 'bh'),
    };
    LydjStore.showEditForm('add', json);
  };

  const onEditAction = (record) => {
    const json = {
      ...record,
      whrid: userinfo.id,
      whr: userinfo.yhmc,
      whsj: moment().format('YYYY-MM-DD HH:mm:ss'),

    };
    console.log("json", json);
    LydjStore.showEditForm('edit', json);
  };

  const customRequest = (option) => {
    LydjStore.uploadSQZip(option.file);
    return { abort() { } };
  };

  const doDownloadResult = () => {
    if (LydjStore.selectRowRecords && LydjStore.selectRowRecords.length != 1) {
      Notification.open({ title: '请选择一条记录', type: 'warning' });
      return;
    }
    LydjStore.downloadResultZip(LydjStore.selectRowRecords[0].id);
  };

  const getTableHeight = () => {
    return `${ref.current.clientHeight - 100}px`;
  };

  /**
   * 重设列宽度
   * @param {*} dataIndex
   * @param {*} value
   */
  const onResizeChange = (dataIndex, value) => {
    const fields = [];
    columns.forEach((f) => {
      if (f.dataIndex === dataIndex) {
        f.width = f.width + value;
      }
      fields.push(f);
    });
    LydjStore.setColumns(fields);
  };

  return !LydjStore.editVisible ? (
    <div className="hall-regist">
      <div className="control">
        <span className="label">查档人姓名</span>
        <Input
          placeholder="输入查档人姓名"
          className="my-input"
          value={field.getValue('text_dalydj_cyrxm')}
          onChange={(v) => {
            field.setValue('text_dalydj_cyrxm', v);
          }}
        />
        <span className="label">证件号码</span>
        <Input
          placeholder="输入查档人证件号码"
          className="my-input"
          value={field.getValue('cx_zjhm')}
          onChange={(v) => {
            field.setValue('cx_zjhm', v);
          }}
        />
        <span className="label">登记日期</span>
        <RangePicker
          size="small"
          onChange={(val) => {
            field.setValues({ cx_kssqrq: val[0], cx_jssqrq: val[1] });
          }}
          value={[field.getValue('cx_kssqrq'), field.getValue('cx_jssqrq')]}
        />
        <span className="label" />
        <Tooltip title="勾选仅显示未结束的登记单">
          <Checkbox
            checked={field.getValue("noend")}
            onChange={(e) => { field.setValues({ noend: e.target.checked }); doSearchAction(); }}
          />
          <span className="label">仅显示未结束</span>
        </Tooltip>
        <span className="label" />
        <Tooltip title="仅显示本人登记单">
          <Checkbox
            checked={field.getValue("isdjr")}
            onChange={(e) => { field.setValues({ isdjr: e.target.checked }); doSearchAction(); }}
          />
          <span className="label">仅显示本人登记</span>
        </Tooltip>
        <IceButton
          type="primary"
          size="medium"
          style={{ marginLeft: 10, height: 32 }}
          onClick={doSearchAction}
        >
          <Icon type="search" />
          搜索
        </IceButton>
      </div>
      <div className="main-content">
        <div className="btns-control">
          {/* {OptrightStore.hasRight(umid, 'SYS101') && (
            <IceButton
              style={{ marginLeft: 10 }}
              type="primary"
              onClick={() => {
                onAddAction();
              }}
            >
              <Icon type="add" />
              新增
            </IceButton>
          )} */}
          {/* {OptrightStore.hasRight(umid, 'DALY101') && (
            <Upload
              accept=".zip"
              request={customRequest}
              onChange={() => { }}
              style={{ marginLeft: 10 }}
            >
              <IceButton type="secondary">
                <Icon type="upload" />
                上传申请包
              </IceButton>
            </Upload>
          )} */}
          {OptrightStore.hasRight(umid, 'DALY102') && (
            <IceButton
              type="secondary"
              style={{ marginLeft: 10 }}
              onClick={() => {
                doDownloadResult();
              }}
            >
              <Icon type="download" />
              下载结果包
            </IceButton>
          )}
        </div>
        <div className="common-table" ref={ref}>
          <Table.StickyLock
            fixedHeader
            bordered="true"
            dataSource={data.results}
            isZebra={true}
            emptyContent={<EmptyData />}
            maxBodyHeight={maxBodyHeight}
            rowSelection={{
              onChange: onTableRowChange,
              selectedRowKeys: LydjStore.selectRowKeys,
              mode: 'single',
            }}
            loading={LydjStore.loading}
            onResizeChange={onResizeChange}
          >
            <Table.Column
              title="操作"
              cell={renderTableCell}
              alignHeader="center"
              align="left"
              width="135px"
            />
            {columns.map((col) => (
              <Table.Column
                resizable
                alignHeader="center"
                key={col.dataIndex}
                {...col}
              />
            ))}
          </Table.StickyLock>
        </div>
        <Pagination
          className="paginate"
          size={E9Config.Pagination.size}
          current={pageno}
          pageSize={pagesize}
          total={data.total || 0}
          onChange={onPaginationChange}
          shape={E9Config.Pagination.shape}
          pageSizeSelector={E9Config.Pagination.pageSizeSelector}
          pageSizePosition={E9Config.Pagination.pageSizePosition}
          onPageSizeChange={onPageSizeChange}
          popupProps={E9Config.Pagination.popupProps}
          totalRender={(total) => (
            <span className="pagination-total">
              {' '}
              {`${formatMessage({ id: 'e9.pub.total' })}：${total}`}
            </span>
          )}
        />
      </div>
      <Optlog omid={umid} ywid={curRecordId} visible={logvisible} onVisibleChange={(vis) => setLogVisible(vis)} />
      <LymxData />
    </div>
  ) : (
    <LydjEdit />
  );
});

export default Lydj;

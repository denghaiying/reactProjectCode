import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Input, Table, Button, Tooltip, Modal, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  FileAddOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useIntl, history } from 'umi';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import SysStore from '../../../stores/system/SysStore';
import IpapplyStore from '../../../stores/des/IpapplyStore';
import '@/eps/components/panel/EpsPanel3/index.less';
import Edit from './Edit';

const { confirm } = Modal;
const Ipapply = observer(() => {
  const { formatMessage } = useIntl();
  const { data, columns, loading, pageno, pagesize } = IpapplyStore;
  const userinfo = SysStore.getCurrentUser();
  const umid = 'DES002';
  useEffect(() => {
    IpapplyStore.queryExprData();
    // LoginStore.checktoken();
    OptrightStore.getFuncRight(umid);
    IpapplyStore.setColumns([
      {
        title: '申请单位',
        dataIndex: 'sqdw',
        width: 220,
        fixed: 'left',
      },
      {
        title: '申请人',
        dataIndex: 'sqr',
        width: 220,
      },
      {
        title: '申请日期',
        dataIndex: 'sqrq',
        width: 200,
      },
      {
        title: '检测单位',
        dataIndex: 'jcdw',
        width: 200,
      },
      {
        title: '检测人',
        dataIndex: 'jcr',
        width: 200,
      },
      {
        title: '检测日期',
        dataIndex: 'jcrq',
        width: 200,
      },
      {
        title: '检测范围',
        dataIndex: 'jcfw',
        width: 200,
        render: (value) =>
          (value === 'A' && '条目和原文') ||
          (value === 'B' && '仅条目') ||
          (value === 'C' && '仅原文') ||
          value ||
          '',
      },
      {
        title: '申请说明',
        dataIndex: 'sqsm',
        width: 200,
        // }, {
        //   title: 'e9.wflw.wfsrv.cspz',
        //   dataIndex: 'cspz',
        //   width: 200,
      },
      {
        title: '匹配规则',
        dataIndex: 'ppgz',
        width: 200,
      },
      {
        title: '文件数',
        dataIndex: 'yws',
        width: 200,
      },
      {
        title: '条目数',
        dataIndex: 'tms',
        width: 200,
      },
      {
        title: '原文目录',
        dataIndex: 'ywdir',
        width: 200,
      },
      {
        title: '维护人',
        dataIndex: 'whr',
        width: 200,
      },
      {
        title: '维护时间',
        dataIndex: 'whsj',
        width: 200,
      },
    ]);

    IpapplyStore.queryForPage();
  }, []);

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = (value: string) => {
    IpapplyStore.setParams({ sqdw: value });
  };

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */

  const onPageSizeChange = (page, size) => {
    IpapplyStore.setPageSizeAndNo(page, size);
  };
  /**
   * 最后一列操作列绘制修改 删除按钮
   * @param {*} value
   * @param {*} index
   * @param {*} record
   */
  const renderTableCell = (text, record) => {
    return (
      <>
        {/* {OptrightStore.hasRight(umid, 'SYS102') && */}
        <Tooltip title="修改">
          <Button
            size="small"
            style={{ fontSize: '12px', color: '#08c' }}
            shape="circle"
            onClick={() => onEditAction(record)}
            icon={<EditOutlined />}
          />
        </Tooltip>
        {/* } */}
        {/* {OptrightStore.hasRight(umid, 'SYS103') && */}
        <Tooltip title="删除">
          <Button
            size="small"
            danger={true}
            style={{ fontSize: '12px' }}
            type={'primary'}
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => onDeleteAction(record)}
          />
        </Tooltip>
        {/* } */}
      </>
    );
  };

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    IpapplyStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 响应编辑事件
   * @param {*} record
   */
  const onEditAction = (record) => {
    if("W"==record.spzt){
      message.error("该申请正在检测中不可以编辑")
    }else{
      edit(record);
    }
    
  };

  const onDeleteAction = (record) => {
    if("W"==record.spzt){
      message.error("该申请正在检测中不可以删除")
    }else{    
    confirm({
      title: '确定要删除该条数据么?',
      icon: <ExclamationCircleOutlined />,
      content: '数据删除后将无法恢复，请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => deleteData(record.id),
    });
  }
  };

  const onAddAction = () => {
    add();
  };

  // end ********************

  // begin *************以下是自定义函数区域

  const edit = (record) => {
    IpapplyStore.id = record.id;
    IpapplyStore.sqdw = record.sqdw;
    IpapplyStore.sqsm = record.sqsm;
    IpapplyStore.ywdir = record.ywdir;
    IpapplyStore.sqrq = record.sqrq;
    IpapplyStore.jcfw = record.jcfw;
    // IpapplyStore.type = record.jcfw;
    IpapplyStore.sqr = record.sqr;
    IpapplyStore.jcdw = record.jcdw;
    IpapplyStore.jcr = record.jcr;
    IpapplyStore.jcrq = record.jcrq;
    IpapplyStore.sjly = record.sjly;
    IpapplyStore.tmzt = record.tmzt && record.tmzt.split(',');
    IpapplyStore.ljjc = record.ljjc === 'Y';
    IpapplyStore.dakid = record.dakid;
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });
    json.whrid = userinfo.id;
    json.whr = userinfo.yhmc;
    json.whsj = moment().format('YYYY-MM-DD HH:mm:ss');
    IpapplyStore.showEditForm('edit', json);

    // if (record.jcsqJcfw === 'C') {
    //   IpapplyStore.setStep(2);
    // } else {
    //   IpapplyStore.setStep(1);
    // }
    IpapplyStore.openImportSetting(record);
    IpapplyStore.dakid = record.dakid;
    IpapplyStore.importVisible = true;
  };

  const add = () => {
    const json = {};
    json['id'] = `JCSQ${moment().format('YYYYMMDDHHmmssSSS')}`;
    json['spzt'] = 'C';
    json['progressbar'] = 0;
    json['whrid'] = userinfo.id;
    json['whr'] = userinfo.yhmc;
    json['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    IpapplyStore.showEditForm('add', json);
    IpapplyStore.sqrq = moment().format('YYYY-MM-DD');
    IpapplyStore.jcrq = moment().format('YYYY-MM-DD');
    IpapplyStore.jcfw = 'A';
    IpapplyStore.sqr = '';
    IpapplyStore.jcdw = '';
    IpapplyStore.jcr = '';
    IpapplyStore.sqdw = '';
    IpapplyStore.sqsm = '';
    IpapplyStore.ywdir = '';
    IpapplyStore.sjly = 'w';
    IpapplyStore.dakid = '';
    IpapplyStore.tmzt = undefined;
    IpapplyStore.ljjc = false;
    IpapplyStore.editVisible = true;
  };

  const deleteData = (recid) => {
    IpapplyStore.delete(recid).then(() => {
      IpapplyStore.queryForPage();
    });
  };
  // end **************

  return (
    (!IpapplyStore.editVisible && (
      <div className="eps-table">
        <div className={'content hideExpand'}>
          <div className={'right'}>
            <div className={'control'} style={{ marginLeft: 'auto' }}>
              <Input.Search
                placeholder="请输入搜索的申请单位"
                style={{ width: 300, marginRight: 10 }}
                onSearch={(val: string) => doSearchAction(val)}
              />
              <Button
                type="primary"
                style={{ marginLeft: 20 }}
                onClick={() => {
                  onAddAction();
                }}
              >
                <FileAddOutlined />
                新建
              </Button>
            </div>
            <Table
              bordered
              scroll={{ x: 'max-content', y: 'calc(100% - 40px)' }}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                defaultCurrent: pageno,
                defaultPageSize: pagesize,
                pageSize: pagesize,
                current: pageno,
                showTotal: (total, range) => `共 ${total} 条数据`,
                onChange: onPageSizeChange,
                total: data.total || 0,
              }}
              dataSource={data.list}
              className="my-table"
              loading={loading}
              rowKey="id"
              rowSelection={{ onChange: onTableRowChange, type: 'radio' }}
            >
              {columns.map((col) => (
                <Table.Column key={col.dataIndex} {...col} title={col.title} />
              ))}
              <Table.Column
                title="操作"
                render={renderTableCell}
                width="100px"
                fixed="right"
              />
            </Table>
          </div>
        </div>
      </div>
    ))||(IpapplyStore.editVisible&&<Edit />)
  );
});

export default Ipapply;

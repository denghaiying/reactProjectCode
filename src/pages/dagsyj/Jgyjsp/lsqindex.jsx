import React, { useEffect, useState } from 'react';
import { Table, NumberPicker,Upload, Tab, Pagination, Checkbox, Button, Field, Select, Icon, DatePicker } from '@alifd/next';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import OptrightStore from '@/stores/user/OptrightStore';
import SvgIcon from '@/components/SvgIcon';
import YjspStore from '../../../stores/dagsyj/YjspStore';
import E9Config from '../../../utils/e9config';
import EditDailog from './EditDailog';
import { WflwButtons } from '../../../components/Wflw';
import YjspmxStore from '../../../stores/dagsyj/YjspmxStore';
import DapubStore from '../../../stores/dagl/DapubStore';
import WfdefStore from '../../../stores/workflow/WfdefStore';
import EmptyData from '@/components/EmptyData';
import FileList from '../../dagl/FileList';
import Datable from '../../dagl/datable';

import SysStore from "@/stores/system/SysStore";
import { useIntl, FormattedMessage } from 'umi';

const Yjsp = observer(props => {
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  const {  match: { params: { wfinst } } } = props;
  const { data, columns, loading, pageno, pagesize } = YjspStore;
  const [tabkey, setTabkey] = useState("1");
  const field = Field.useField();
  const umid = 'DAGSYJ007';
  useEffect(() => {
    WfdefStore.getPorcs("jgyjsp");
    YjspStore.getProcOpts("jgyjsp");
    OptrightStore.getFuncRight(umid);
    field.setValues({
      dateb: moment().startOf('month'),
      datee: moment().endOf('month'),
      sw: "W"
    });
    YjspStore.setColumns([{
      title: "状态",
      dataIndex: 'wpid',
      width: 100,
      cell: (value) => {
        if (value === "ZZZY") {
          return '否决';
        }
        const list = WfdefStore.proclist["jgyjsp"];

        if (list) {
          for (let i = 0; i <= list.length - 1; i++) {
            if (list[i].wpid == value) {
              return list[i].name;
            }
          }
        }
        // return value;
      }
    },
      {
      title: "申请人",
      dataIndex: 'sqrmc',
      width: 100,
    }, {
      title: "申请人电话",
      dataIndex: 'dh',
      width: 250,
    }, {
      title: "申请时间",
      dataIndex: 'sqsj',
      width: 100,
    }, {
      title: "开始年度",
      dataIndex: 'ndb',
      width: 100,
    }, {
      title: "结束年度",
      dataIndex: 'nde',
      width: 180,

    },{
      title: formatMessage({ id: 'e9.wflw.pub.wfawaiter' }),
      dataIndex: 'wfawaiter',
      width: 250,
    }, {
      title: formatMessage({ id: 'e9.wflw.pub.wfahandler' }),
      dataIndex: 'wfhandler',
      width: 200,
    }]);
    doSearchAction();
  }, []);

  useEffect(() => {

    if (wfinst) {
      YjspStore.setKeyByWfinst(wfinst).then(o => {
        if (o) {
          field.setValues({
            dateb: o,
            datee: o,
            sw: "W"
          });
          onChangeRow(YjspStore.selectRowRecords && YjspStore.selectRowRecords[0]);

        }
      });
    }
  }, [wfinst]);

  // begin ******************** 以下是事件响应
  /**
     * 查询条件按钮点击事件
     * @param {*} values
     * @param {*} errors
     */
  const doSearchAction = (() => {
    field.validate((errors, values) => {
      if (!errors) {
        const { dateb, datee, ...params } = values;
        if (dateb) {
          params.dateb = dateb.format('YYYY-MM-DD');
        }
        if (datee) {
          params.datee = datee.format('YYYY-MM-DD');
        }
        YjspStore.setParams(params);
      }
    });
  });

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    YjspStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    YjspStore.setPageSize(pageSize);
  });

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onDetailPaginationChange = ((current) => {
    YjspmxStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onDetailPageSizeChange = ((pageSize) => {
    YjspmxStore.setPageSize(pageSize);
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
        <a href="javascript:void(0)" onClick={() => YjspStore.showEditForm('view', record)}> <FormattedMessage id="e9.btn.view" /></a>
        <a href="javascript:void(0)" style={{ marginLeft: '5px' }} onClick={() => onReportPrintAction(record.id)}><FormattedMessage id="e9.btn.print" /></a>
        { OptrightStore.hasRight(umid, 'SYS102') && <a href="javascript:void(0)" style={{ marginLeft: '5px' }} onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>}
        { OptrightStore.hasRight(umid, 'SYS103') && YjspStore.canWfDelete(record) && <a href="javascript:void(0)" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.id)}><FormattedMessage id="e9.btn.delete" /></a>}

      </div >);
  };

  const renderDetailTableCell = (value, index, record) => {
    return (
      <div>
        {/* {OptrightStore.hasRight(umid, 'SYS102') && <a href="javascript:void(0)" onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>}
        {OptrightStore.hasRight(umid, 'SYS103') && <a href="javascript:void(0)" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.id)}><FormattedMessage id="e9.btn.delete" /></a>} */}
      </div>);
  };

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    YjspStore.setSelectRows(selectedRowKeys, records);
    records && records.length > 0 && onChangeRow(records[0]);
  };

  const onDetailTableRowChange = (selectedRowKeys, records) => {
    YjspmxStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    const json = { date: moment(), year: moment().format("YYYY"), month: moment().format("MM") };
    YjspStore.showEditForm('add', json);
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

  /**
   * 响应报表打印事件
   * @param {*} record
   */
  const onReportPrintAction = (id) => {
  //  YjspStore.reportPrint(id);
    reportPrint(id);
  };

  // end ********************

  // begin *************以下是自定义函数区域
  /**
   *  修改记录
   * @param {* User} record
   */
  const reportPrint = ((id) => {

    YjspStore.reportPrint(id);

  });

  /**
   * 删除操作
   * @param {* string} id
   */
  const deleteData = (id) => {
    YjspStore.delete(id);
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
    if (record.userEnable === 0) {
      json.userEnable = 0;
    }
    if (record.userQyrq === null) {
      json.userQyrq = null;
    }
    if (record.userTyrq === null) {
      json.userTyrq = null;
    }

    json.whrid = SysStore.getCurrentUser().id;
    json.whr = SysStore.getCurrentUser().yhmc;
    json.whsj = moment();
    YjspStore.showEditForm('edit', json);
  });

  const onBeforeWfAction = async (action) => {
    if (!YjspStore.selectRowRecords || YjspStore.selectRowRecords.length !== 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectOneOnly' }) });
      return false;
    }
    return true;
  };

  const onAfterWfAction = (data) => {
    YjspStore.queryForPage();
  };

  const getWfid = () => {
    if (YjspStore.selectRowRecords && YjspStore.selectRowRecords.length > 0) {
      return YjspStore.selectRowRecords[0].wfid;
    }
    return '';
  };

  const getWfinst = () => {
    if (YjspStore.selectRowRecords && YjspStore.selectRowRecords.length > 0) { return YjspStore.selectRowRecords[0].wfinst; }
    return '';
  };

  const onChangeRow = (record) => {

    DapubStore.getDaklist(record.dakid, "3");
    setTabkey("1");
    YjspmxStore.setMxparams({ id: record.id, dakid: record.dakid});
  };

  const onTabChange = (key) => {
    if (key == "2") {
      const rs = YjspmxStore.selectRowKeys;
      if (!rs || rs.length <= 0) {
        IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectOneOnly' }) });
        return;
      }
      openDak();
    }
    setTabkey(key);
  };

  const openDak = () => {
    DapubStore.getDDaklist(YjspmxStore.params.dakid);

  };

  function beforeUpload(info) {
    console.log('beforeUpload callback : ', info);
  }

  function onChange(info) {
    console.log('onChange callback : ', info);
  }

  // end **************

  return (
    <div className="file-transfer">
      <div className="file-content">
        <div className="top">
          <div className="condition">
            <div className="right" style={{ paddingLeft: 150 }}>
              <Select
                {...field.init('sw', {})}
                style={{ marginRight: 10 }}
                // hasClear
                value={field.getValue('sw')}
                onChange={sw => { field.setValue('sw', sw) }}
              // addonAfter={<Button><FormattedMessage id="e9.btn.advsearch" /></Button>}
              >
                {/* <Select.Option value="A">全部</Select.Option> */}
                <Select.Option value="W">待我处理</Select.Option>
                <Select.Option value="H">我已处理</Select.Option>
              </Select>
              <DatePicker.RangePicker size="medium" style={{ width: 240, marginRight: 10 }}
                onChange={val => {
                  field.setValues({ dateb: val[0], datee: val[1] });
                }} value={[field.getValue('dateb'), field.getValue('datee')]} />
              <Button type="primary" onClick={doSearchAction} ><Icon type="search" />查询</Button>
              <WflwButtons
                style={{ marginLeft: '20px' }}
                offset={[18, 0]}
                type={['submit', 'return', 'reject', 'logview']}
                wfid={getWfid()}
                wfinst={getWfinst()}
                onBeforeAction={onBeforeWfAction}
                onAfterAction={onAfterWfAction}
              />

            </div>
          </div>
          <Table
            // tableLayout="fixed"
            // $work-context-heigth-41px, 41px为表头高度
            maxBodyHeight="200px"
            // className="common-table"
            dataSource={data.results}
            fixedHeader
            loading={loading}
            rowSelection={{ onChange: onTableRowChange, selectedRowKeys: YjspStore.selectRowKeys, mode: "single" }}
            emptyContent={<EmptyData />}
            onRowClick={record => {
              YjspStore.setSelectRows([record.id], [record]);
              onChangeRow(record);
            }}
          >

            {columns.map(col =>
              <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
            )}

          </Table>
          <Pagination
            //   className="footer"
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
        <div className="bottom">
          <div className="condition">
            <Tab activeKey={tabkey} onChange={(key) => onTabChange(key)}>
              <Tab.Item title="明细数据" key="1">
              </Tab.Item>
              {YjspStore.selectRowRecords && YjspStore.selectRowRecords.length
                && DapubStore.ktables[YjspStore.selectRowRecords[0].dakid]
                && ["02", "03", "0401"].includes(DapubStore.ktables[YjspStore.selectRowRecords[0].dakid].daklx)
                && <Tab.Item title="卷内" key="2"></Tab.Item>}
            </Tab>
            <div className="right">
              {/* <ListDialog></ListDialog>
              <Button type="primary" style={{margin: '0px 15px'}}>
                <img className="pre_icon" src={require('../../assets/img/file-transfer/icon_save.png')} style={{width: 22}} alt=""/>保存
              </Button>
              <Button type="primary">
                <img className="pre_icon" src={require('../../assets/img/file-transfer/icon_accessory2.png')} style={{width: 22}} alt=""/>附件
              </Button> */}
            </div>
          </div>
          {tabkey == "1" &&
            <div>
              <Table
                // tableLayout="fixed"
                // $work-context-heigth-41px, 41px为表头高度
                maxBodyHeight="calc(100vh - 395px)"
                dataSource={YjspmxStore.data.results}
                fixedHeader
                loading={loading}
                emptyContent={<EmptyData />}
                rowSelection={{ onChange: onDetailTableRowChange, selectedRowKeys: YjspmxStore.selectRowKeys, mode: "single" }}
                rowProps={(record) => {
                  return {
                    onDoubleClick: () => {
                      if (YjspStore.selectRowRecords && YjspStore.selectRowRecords.length
                        && DapubStore.ktables[YjspStore.selectRowRecords[0].dakid]
                        && ["02", "03", "0401"].includes(DapubStore.ktables[YjspStore.selectRowRecords[0].dakid].daklx)) {
                        setTabkey("2");
                        YjspmxStore.setSelectRows([record.id], [record]);
                        openDak();
                      }
                    },
                  };
                }}
              >
                <Table.Column
                  title="操作"
                  alignHeader="center"
                  lock="left"
                  width="80px"

                  cell={
                    (value, index, record) =>
                      <span onClick={() => {
                        if (record.fjs && record.fjs > 0) {
                          YjspStore.showFile(true, { doctbl: `${YjspmxStore.params.bmc}_FJ`, grptbl: `${YjspmxStore.params.bmc}_FJFZ`, grpid: record.filegrpid, daktmid: record.id });
                        }
                      }}>
                        <SvgIcon type="iconfujian" /><span>{record.fjs || ''}</span>
                      </span>
                  }
                />
                {YjspStore.selectRowRecords && YjspStore.selectRowRecords.length && DapubStore.columns[`${YjspStore.selectRowRecords[0].dakid}-3`] &&
                  DapubStore.columns[`${YjspStore.selectRowRecords[0].dakid}-3`].filter(col => !["yjspzt", "yjspyy", "gdspzt", "gdspyy", "canedit"].includes(col.dataIndex)).map(col =>
                    <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
                  )}
                {/* <Table.Column cell={renderDetailTableCell} width="100px" lock="right" /> */}
              </Table>
              <Pagination
                //   className="footer"
                size={E9Config.Pagination.size}
                current={YjspmxStore.pageno}
                pageSize={YjspmxStore.pagesize}
                total={YjspmxStore.data.total}
                onChange={onDetailPaginationChange}
                shape={E9Config.Pagination.shape}
                pageSizeSelector={E9Config.Pagination.pageSizeSelector}
                pageSizePosition={E9Config.Pagination.pageSizePosition}
                onPageSizeChange={onDetailPageSizeChange}
                popupProps={E9Config.Pagination.popupProps}
                totalRender={total => <span className="pagination-total"> {`${formatMessage({ id: 'e9.pub.total' })}：${total}`}</span>}
              /></div>}

        </div>
      </div>
      <EditDailog />

      <FileList visible={YjspStore.fileshow} callback={(visible, params) => { YjspStore.showFile(visible) }} params={YjspStore.fileparams} />
    </div >
  );
});

export default Yjsp;

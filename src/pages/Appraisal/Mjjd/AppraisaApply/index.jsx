import React, { useEffect, useState } from 'react';
import { Table, NumberPicker, Tab, Pagination, Checkbox, Button, Field, Select, Icon, DatePicker } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment, { isMoment } from 'moment';
import { observer } from 'mobx-react';
import OptrightStore from '@/stores/user/OptrightStore';
import SvgIcon from '@/components/SvgIcon';
import LoginStore from '@/stores/system/LoginStore';

import E9Config from '@/utils/e9config';
import EditDailog from './EditDailog';
import { WflwButtons } from '@/components/Wflw';
import DajdStore from '@/stores/appraisa/MjjdStore';
import DajdmxStore from '@/stores/appraisa/MjjdmxStore';
import DapubStore from '@/stores/dagl/DapubStore';
import WfdefStore from '@/stores/workflow/WfdefStore';
import EmptyData from '@/components/EmptyData';
import FileList from '../../../dagl/FileList';
import Datable from '../../datable';

/**
 * @Author: Mr.Wang
 * @Date: 2019/9/16 15:45
 * @Version: 9.0
 * @Content:
 *    2019/12/10 王祥
 *    修改：
 *      1.状态组件由IceStore改成mobx
 *    2019/9/16 王祥
 *      新增代码
 */
const Kfjd = observer(props => {
  const { intl: { formatMessage } } = props;
  const { data, columns, loading, pageno, pagesize } = DajdStore;
  const { userinfo } = LoginStore;
  const [tabkey, setTabkey] = useState("1");
  const field = Field.useField();
  const umid = 'DAGL023';
  useEffect(() => {
    WfdefStore.getPorcs("kfjd");
    DajdStore.getProcOpts("kfjd");
    OptrightStore.getFuncRight(umid);
    field.setValues({
      dateb: moment().startOf('month'),
      datee: moment().endOf('month'),
      sw: "W"
    });
    DajdStore.setColumns([{
      //   title: formatMessage({ id: 'e9.dagl.yjsp.zt' }),
      //   dataIndex: 'zt',
      //   width: 100,
      //   cell: (value) => {
      //     switch (value) {
      //       case "I":
      //         return "申请";
      //       case "P":
      //         return "审批中";
      //       case "C":
      //         return "审批完成";
      //     }
      //   }
      // }, {
      title: formatMessage({ id: 'e9.dagl.yjsp.zt' }),
      dataIndex: 'wpid',
      width: 100,
      cell: (value) => {
        if (value === "ZZZY") {
          return '否决';
        }
        const list = WfdefStore.proclist["kfjd"];

        if (list) {
          for (let i = 0; i <= list.length - 1; i++) {
            if (list[i].wpid == value) {
              return list[i].name;
            }
          }
        }
        // return value;
      }
    }, {
      title: formatMessage({ id: 'e9.dagl.yjsp.dakmc' }),
      dataIndex: 'dakmc',
      width: 100,
    }, {
      title: formatMessage({ id: 'e9.dagl.yjsp.yjtitle' }),
      dataIndex: 'title',
      width: 250,
    },{
      title: formatMessage({ id: 'e9.dagl.yjsp.date' }),
      dataIndex: 'date',
      width: 180,

    }, {
      title: "提交人",
      dataIndex: 'tjr',
      width: 200,
    },{
      title: formatMessage({ id: 'e9.dagl.yjsp.remark' }),
      dataIndex: 'remark',
      width: 200,

    }, {
      title: formatMessage({ id: 'e9.wflw.pub.wfawaiter' }),
      dataIndex: 'wfawaiter',
      width: 250,
    }, {
      title: formatMessage({ id: 'e9.wflw.pub.wfahandler' }),
      dataIndex: 'wfahandler',
      width: 200,
    }]);
    doSearchAction();
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
        const { dateb, datee, ...params } = values;
        if (dateb && isMoment(dateb)) {
          params.dateb = dateb.format('YYYY-MM-DD');
        }
        if (datee && isMoment(datee)) {
          params.datee = datee.format('YYYY-MM-DD');
        }
        DajdStore.setParams(params);
      }
    });
  });

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    DajdStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    DajdStore.setPageSize(pageSize);
  });

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onDetailPaginationChange = ((current) => {
    DajdmxStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onDetailPageSizeChange = ((pageSize) => {
    DajdmxStore.setPageSize(pageSize);
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
        <a href="javascript:void(0)" onClick={() => DajdStore.showEditForm('view', record)}> <FormattedMessage id="e9.btn.view" /></a>
        { OptrightStore.hasRight(umid, 'SYS102') && <a href="javascript:void(0)" style={{ marginLeft: '5px' }} onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>}
        { OptrightStore.hasRight(umid, 'SYS103') && DajdStore.canWfDelete(record) && <a href="javascript:void(0)" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.id)}><FormattedMessage id="e9.btn.delete" /></a>}
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
    DajdStore.setSelectRows(selectedRowKeys, records);
    records && records.length > 0 && onChangeRow(records[0]);
  };

  const onDetailTableRowChange = (selectedRowKeys, records) => {
    DajdmxStore.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    const json = { date: moment(), year: moment().format("YYYY"), month: moment().format("MM") };
    DajdStore.showEditForm('add', json);
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
    DajdStore.delete(id);
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

    json.whrid = userinfo.id;
    json.whr = userinfo.userName;
    json.whsj = moment();
    DajdStore.showEditForm('edit', json);
  });

  const onBeforeWfAction = async (action) => {
    if (!DajdStore.selectRowRecords || DajdStore.selectRowRecords.length !== 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectOneOnly' }) });
      return false;
    }
    return true;
  };

  const onAfterWfAction = (data) => {
    DajdStore.queryForPage();
  };

  const getWfid = () => {
    if (DajdStore.selectRowRecords && DajdStore.selectRowRecords.length > 0) {
      return DajdStore.selectRowRecords[0].wfid;
    }
    return '';
  };

  const getWfinst = () => {
    if (DajdStore.selectRowRecords && DajdStore.selectRowRecords.length > 0) { return DajdStore.selectRowRecords[0].wfinst; }
    return '';
  };

  const onChangeRow = (record) => {
    DapubStore.getDaklist(record.dakid, "1");
    setTabkey("1");
    DajdmxStore.setParams({ fid: record.id, dakid: record.dakid, mbid: record.mbid, bmc: record.datbl });
  };

  const onTabChange = (key) => {
    if (key == "2") {
      const rs = DajdmxStore.selectRowKeys;
      if (!rs || rs.length <= 0) {
        IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectOneOnly' }) });
        return;
      }
      openDak();
    }
    setTabkey(key);
  };

  const openDak = () => {
    DapubStore.getDDaklist(DajdmxStore.params.dakid);

  };

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
                type={['submit', 'return', 'reject']}
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
            rowSelection={{ onChange: onTableRowChange, selectedRowKeys: DajdStore.selectRowKeys, mode: "single" }}
            emptyContent={<EmptyData />}
            onRowClick={record => {
              DajdStore.setSelectRows([record.id], [record]);
              onChangeRow(record);
            }}
          >

            {columns.map(col =>
              <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
            )}
            <Table.Column cell={renderTableCell} width="120px" lock="right" />
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
        <div className="bottom">
          <div className="condition">
            <Tab activeKey={tabkey} onChange={(key) => onTabChange(key)}>
              <Tab.Item title="明细数据" key="1">
              </Tab.Item>
              {DajdStore.selectRowRecords && DajdStore.selectRowRecords.length
                && DapubStore.ktables[DajdStore.selectRowRecords[0].dakid]
                && ["02", "03", "0401"].includes(DapubStore.ktables[DajdStore.selectRowRecords[0].dakid].daklx)
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
                dataSource={DajdmxStore.data.results}
                fixedHeader
                loading={loading}
                emptyContent={<EmptyData />}
                rowSelection={{ onChange: onDetailTableRowChange, selectedRowKeys: DajdmxStore.selectRowKeys, mode: "single" }}
                rowProps={(record) => {
                  return {
                    onDoubleClick: () => {
                      if (DajdStore.selectRowRecords && DajdStore.selectRowRecords.length
                        && DapubStore.ktables[DajdStore.selectRowRecords[0].dakid]
                        && ["02", "03", "0401"].includes(DapubStore.ktables[DajdStore.selectRowRecords[0].dakid].daklx)) {
                        setTabkey("2");
                        DajdmxStore.setSelectRows([record.id], [record]);
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
                          DajdStore.showFile(true, { doctbl: `${DajdmxStore.params.bmc}_FJ`, grptbl: `${DajdmxStore.params.bmc}_FJFZ`, grpid: record.filegrpid, daktmid: record.id });
                        }
                      }}>
                        <SvgIcon type="iconfujian" /><span>{record.fjs || ''}</span>
                      </span>
                  }
                />
                <Table.Column
                  dataIndex="spjg"
                  alignHeader="center"
                  title="鉴定审批"
                  width="100px"
                  lock="left"
                  cell={
                    (value, index, record) => <span> <Checkbox size="small" checked={record.spjg == "Y"} onChange={checked => {
                      const { ...cur } = record;
                      cur["spjg"] = checked ? "Y" : "N";
                      DajdmxStore.reSetData(cur);
                    }} />同意</span>
                  }
                />

                <Table.Column dataIndex="remark" alignHeader="center" title="说明" width="200px" />
                {DajdStore.selectRowRecords && DajdStore.selectRowRecords.length && DapubStore.columns[`${DajdStore.selectRowRecords[0].dakid}-1`] &&
                  DapubStore.columns[`${DajdStore.selectRowRecords[0].dakid}-1`].filter(col => !["yjspzt", "yjspyy", "gdspzt", "gdspyy", "canedit"].includes(col.dataIndex)).map(col =>
                    <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
                  )}
                {/* <Table.Column cell={renderDetailTableCell} width="100px" lock="right" /> */}
              </Table>
              <Pagination
                //   className="footer"
                size={E9Config.Pagination.size}
                current={DajdmxStore.pageno}
                pageSize={DajdmxStore.pagesize}
                total={DajdmxStore.data.total}
                onChange={onDetailPaginationChange}
                shape={E9Config.Pagination.shape}
                pageSizeSelector={E9Config.Pagination.pageSizeSelector}
                pageSizePosition={E9Config.Pagination.pageSizePosition}
                onPageSizeChange={onDetailPageSizeChange}
                popupProps={E9Config.Pagination.popupProps}
                totalRender={total => <span className="pagination-total"> {`${formatMessage({ id: 'e9.pub.total' })}：${total}`}</span>}
              /></div>}
          {tabkey == "2" &&
            <Datable
              params={{ dakid: DapubStore.childlist[DajdmxStore.params.dakid], tmzt: "1" }}
              fileCol
              queryparams={{ fid: DajdmxStore.selectRowRecords && DajdmxStore.selectRowRecords[0].daid || '' }}
            />}
        </div>
      </div>
      <EditDailog />
      <FileList visible={DajdStore.fileshow} callback={(visible, params) => { DajdStore.showFile(visible) }} params={DajdStore.fileparams} />
    </div >
  );
});

export default injectIntl(Kfjd);

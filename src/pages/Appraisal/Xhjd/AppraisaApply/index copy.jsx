import React, { useEffect, useState } from 'react';
import { Table, NumberPicker, Tab, Pagination, Checkbox, Button, Field, Select, Icon, DatePicker } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment, { isMoment } from 'moment';
import { observer } from 'mobx-react';
import OptrightStore from '@/stores/user/OptrightStore';
import SvgIcon from '@/components/SvgIcon';
import LoginStore from '@/stores/system/LoginStore';
import { notification, Modal, Badge, Drawer, Space, Form, Input, Radio, Tag } from "antd";
import E9Config from '@/utils/e9config';
import EditDailog from './EditDailog';
import { WflwButtons } from '@/components/Wflw';
import KfjdStore from '@/stores/appraisa/AppraisaApplyStore';
import KfjdmxStore from '@/stores/appraisa/AppraisaApplyDetailStore';
import DapubStore from '@/stores/dagl/DapubStore';
import WfdefStore from '@/stores/workflow/WfdefStore';
import EmptyData from '@/components/EmptyData';
import FileList from '../../../dagl/FileList';
import Datable from '../../datable';
import AppraisaApplyStore from '@/stores/appraisa/AppraisaApplyStore';
import AppraisaApplyDetailStore from '@/stores/appraisa/AppraisaApplyDetailStore';
import ApplyTimeline from "./ApplyTimeline.tsx"
import ApplyEditButton from "./ApplyEditButton";
import ApplyEditModal from "./ApplyEditModal";
import EpsModal from "./EpsModal.tsx"
import SysStore from '@/stores/system/SysStore';
import ApplyStore from './ApplyStore';
const { TextArea } = Input;
import EpsFilesView from "@/eps/components/file/EpsFilesView"
import applyService from "./ApplyService";
const applyStore = new ApplyStore(applyService);

const YjspStore = new AppraisaApplyStore('/api/eps/control/main/xhjdsp', true, true);
const YjspmxStore = new AppraisaApplyDetailStore('/api/eps/control/main/xhjdsp', true, true);

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
const Kfjdsp = observer(props => {
  const { intl: { formatMessage }, match: { params: { wfinst } } } = props;

  const { data, columns, loading, pageno, pagesize } = YjspStore;
  const { userinfo } = LoginStore;
  const [tabkey, setTabkey] = useState("1");
  const field = Field.useField()
  const [logVisible, setLogVisible] = useState(false);
  const [spModal, setSpModal] = useState(false);
  const [tmmx, setTmmx] = useState("");
  const [modalData, setModalData] = useState({});
  const [spkj, setSpkj] = useState(false);
  const umid = 'DAJD023';
  const jdlx='xhjd';

  const spColumns = [];
  //审批form
  const customForm = () => {
    return (
      <>

        <Form.Item label='鉴定人'
          name="spr" >
          <Input
            disabled style={{ width: 380 }}
            value={"aaa"}
            placeholder=''
          />
        </Form.Item>
        <Form.Item label='鉴定时间'
          name="sprq">
          <DatePicker
            style={{ width: 380 }}
            showTime
          />
        </Form.Item>

        <Form.Item label="是否销毁" name="spzt">
          <Radio.Group defaultValue="a" buttonStyle="solid">
            <Radio.Button value="Y">销毁</Radio.Button>
            <Radio.Button value="N">不销毁</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label='意见'
          name="remark">
          <TextArea rows={2} />
        </Form.Item>
      </>
    )
  }

  const mulitApply = () => {
    const records = YjspmxStore.selectRowRecords;
    if (!records) {
      IceNotification.info("警告", "请选择数据");
      return;
    }
    const ids = YjspmxStore.selectRowKeys.join(",");
    const daids = YjspmxStore.selectRowRecords.map(o => {
      return o.daid;
    }).join(",")
    applyStore.setVisible(true);
    setModalData({
      spr: SysStore.getCurrentUser().yhmc,
      sprid: SysStore.getCurrentUser().id,
      sprq: moment(),
      zt: YjspStore.selectRowRecords && YjspStore.selectRowRecords[0].zt,
      daid: daids,
      jdlx,
      kfjdmxid: ids,
      wpid: YjspStore.selectRowRecords && YjspStore.selectRowRecords[0].wpid
    });
  }



  useEffect(() => {
    WfdefStore.getPorcs("xhjd");
    YjspStore.getProcOpts("xhjd");
    OptrightStore.getFuncRight(umid);
    field.setValues({
      dateb: moment().startOf('month'),
      datee: moment().endOf('month'),
      sw: "W"
    });
    YjspStore.setColumns([{
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
        const list = WfdefStore.proclist["xhjd"];

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
      title: "申请单号",
      dataIndex: 'bh',
      width: 120,
    }, {
      title: "标题",
      dataIndex: 'title',
      width: 280,

    }, {
      title: "申请人",
      dataIndex: 'tjr',
      width: 100,
    }, {
      title: "申请日期",
      dataIndex: 'date',
      width: 150,
    }, {
      title: formatMessage({ id: 'e9.wflw.pub.wfawaiter' }),
      dataIndex: 'wfawaiter',
      width: 100,
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
        if (dateb && isMoment(dateb)) {
          params.dateb = dateb.format('YYYY-MM-DD');
        }
        if (datee && isMoment(datee)) {
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
  const onClose = () => {
    setLogVisible(false);
  };


  const viewLog = (value, index, record) => {

    setTmmx('');
    setTmmx(record.id)
    setLogVisible(true);
  }

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

  const spset = () => {
    const sp = YjspStore.ctrlWfVisile("P", YjspStore.selectRowRecords && YjspStore.selectRowRecords[0]);
    setSpkj(sp)
  }
  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    YjspStore.setSelectRows(selectedRowKeys, records);
    spset();
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

  // end ********************

  // begin *************以下是自定义函数区域
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

    json.whrid = userinfo.id;
    json.whr = userinfo.userName;
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
    YjspStore.setSelectRows([], [])
    YjspmxStore.setParams({});
    YjspmxStore.clearData()

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
    DapubStore.getDaklist(record.dakid, "1");
    setTabkey("1");
    spset();
    YjspmxStore.setParams({ fid: record.id, dakid: record.dakid, mbid: record.mbid, bmc: record.datbl });
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
  /**
   * 批量审批
   */
  const batchApply = () => {

  }

  const openDak = () => {
    DapubStore.getDDaklist(YjspmxStore.params.dakid,);

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
            {/* <Table.Column cell={renderTableCell} width="120px" lock="right" /> */}
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
            <Tab activeKey={tabkey} onChange={(key) => onTabChange(key)}
              extra={spkj && <Button type="primary" onClick={mulitApply}>批量审批</Button>}
            >
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
                rowSelection={{ onChange: onDetailTableRowChange, selectedRowKeys: YjspmxStore.selectRowKeys }}
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
                {<Table.Column
                  title="操作"
                  alignHeader="center"
                  lock="left"
                  width={spkj ? "130px" : "80px"}
                  cell={
                    (value, index, record) =>
                      <Space size={5}>

                        {spkj && <ApplyEditButton column={spColumns} title={"审批"}
                          data={{
                            spr: SysStore.getCurrentUser().yhmc,
                            sprid: SysStore.getCurrentUser().id,
                            sprq: moment(),
                            jdlx,
                            daid: record.daid,
                            zt: YjspStore.selectRowRecords && YjspStore.selectRowRecords[0] && YjspStore.selectRowRecords[0].zt,
                            kfjdmxid: record.id,
                            wpid: YjspStore.selectRowRecords && YjspStore.selectRowRecords[0] && YjspStore.selectRowRecords[0].wpid
                          }}
                          store={YjspmxStore} customForm={customForm} />
                        }
                        {spkj && <a onClick={() => {viewLog(value, index, record);}} size="small">日志</a>}


                        <EpsFilesView
                          fjs={record.fjs}
                          bmc={YjspStore.selectRowRecords && YjspStore.selectRowRecords[0] && YjspStore.selectRowRecords[0].datbl}
                          tmid={record.daid}
                          dakid={YjspStore.selectRowRecords && YjspStore.selectRowRecords[0] && YjspStore.selectRowRecords[0].dakid}
                          grpid={record.filegrpid}
                          btnName={"附件"}
                        />
                        {/* <Badge size="small"  count={record.fjs ? record.fjs : 0}  onClick={() => {
                          if (record.fjs && record.fjs > 0) {
                            showFiles(true, { doctbl: `${YjspmxStore.params.bmc}_FJ`, grptbl: `${YjspmxStore.params.bmc}_FJFZ`, grpid: record.filegrpid, daktmid: record.id });
                          }
                        }}>

                        <a style={{fontSize:"12px"}}>附件</a>
                        </Badge> */}
                      </Space>
                  }
                />}
                {spkj && <Table.Column
                  dataIndex="jdyj"
                  alignHeader="center"
                  title="鉴定意见"
                  width="150px"
                  lock="left"
                  cell={
                    (value, index, record) => <Space size={8}>
                      <span>销毁<span style={{ color: "#f50" }}>({record.kfs})</span></span>
                      <span>不销毁<span style={{ color: "#2db7f5" }}>({record.bkfs})</span></span>
                    </Space>
                    // ="#f50">销毁{record.kfs}</Tag>
                    // <Tag color="#2db7f5
                  }
                />}
                <Table.Column
                  dataIndex="spjg"
                  alignHeader="center"
                  title="审批结果"
                  width="100px"
                  cell={
                    (value, index, record) => <span>{record.spjg == 'Y' ? "销毁" :record.spjg == 'N'?'不销毁':'' }</span>
                  }
                />

                {/* <Table.Column dataIndex="remark" alignHeader="center" title="移交g说明" width="200px" /> */}
                {YjspStore.selectRowRecords && YjspStore.selectRowRecords.length && DapubStore.columns[`${YjspStore.selectRowRecords[0].dakid}-1`] &&
                  DapubStore.columns[`${YjspStore.selectRowRecords[0].dakid}-1`].filter(col => !["yjspzt", "yjspyy", "gdspzt", "gdspyy", "canedit"].includes(col.dataIndex)).map(col =>
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
          {tabkey == "2" &&
            <Datable
              params={{ dakid: DapubStore.childlist[YjspmxStore.params.dakid], tmzt: "3" }}
              fileCol
              queryparams={{ fid: YjspmxStore.selectRowRecords && YjspmxStore.selectRowRecords[0].daid || '' }}
            />}
        </div>
      </div>
      <EditDailog />
      <Drawer
        title="审批意见"
        placement="right"
        width="500px"
        closable={false}
        onClose={onClose}
        visible={logVisible}
      >
        <ApplyTimeline kfjdmxid={tmmx} />
      </Drawer>
      <ApplyEditModal column={spColumns} title={"审批"}
        data={modalData}
        store={YjspmxStore} applyStore={applyStore} applyService={applyService} customForm={customForm} />

      <FileList visible={YjspStore.fileshow} callback={(visible, params) => { YjspStore.showFile(visible) }} params={YjspStore.fileparams} />
    </div >
  );
});

export default injectIntl(Kfjdsp);

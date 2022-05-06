import React, { useEffect, useState, useRef } from 'react';
import { observer, useLocalObservable, useObserver } from 'mobx-react';
import EpsRecordPanel from '@/eps/components/panel/EpsRecordPanel';
import { EpsSource, ITitle } from '@/eps/commons/declare';
import ApplyService from './ApplyService';
import { Select, DatePicker, Space, Button, notification, Form, Input, Radio, Tooltip, Tabs } from 'antd';
import ApplyStore from "./ApplyStore";
import { WflwButtons } from "@/components/Wflw";
const { RangePicker } = DatePicker;
import DapubStore from "./DapubStore";
import applyDetailStore from "./ApplyDetailStore";
import EmptyData from '@/components/EmptyData';
import "./index.less";
import '@alifd/next/index.css';
import WfdefStore from "@/stores/workflow/WfdefStore";
import Print from "@/pages/dagl/Yjsp/Print";
import UploadReport from "@/pages/dagl/Yjsp/UploadReport";
import EpsFilesView from "@/eps/components/file/EpsFilesView"
import {
  Pagination,
  Checkbox
} from "@alifd/next";
import Datable from "../../datable";
import E9Config from '@/utils/e9config';
import moment, { isMoment } from 'moment';
import OptrightStore from "@/stores/user/OptrightStore";
import { EditOutlined } from "@ant-design/icons";
import EpsDeleteButton from "@/eps/components/buttons/EpsDeleteButton";
import SysStore from '@/stores/system/SysStore';
import EditDailog from "./EditDailog";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import ApplyDetail from './ApplyDetail';
import ApplyEditButton from "./ApplyEditButton";
import { EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import ArchDetail from './ArchDetail';

const { TabPane } = Tabs;


const title: ITitle = {
  name: '审批'
}



interface DataType {
  autosubmit: boolean;
  bmid: string;
  dakid: string;
  dakmc: string;
  datbl: string;
  date: string;
  dwid: string;
  edittype: number;
  fjs: number;
  id: string;
  mbid: string;
  month: number;
  title: string;
  wfawaiter: string;
  wfhandler: string;
  wfid: string;
  wfinst: string;
  whsj: string;
  wpid: string;
  year: number
  yjr: string;
  yjrid: string;
  zt: string;
}
const userinfo = SysStore.getCurrentUser();
const tmzt="3";
const ApplyCmp = observer((props) => {
  const [detailTableStore,setDetailTableStore] = useState<EpsTableStore>(new EpsTableStore(props.tableService))
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const {

    match: {
      params: { wfinst },
    },
  } = props;
  const [tabkey, setTabkey] = useState("1");


  const { data, columns, loading, pageno, pagesize } = ApplyStore;

  const [logVisible, setLogVisible] = useState(false);
  const [spModal, setSpModal] = useState(false);
  const [tmmx, setTmmx] = useState("");
  const [modalData, setModalData] = useState({});
  const [spkj, setSpkj] = useState(false);
  const umid = 'DAJD023';
  const jdlx = 'kfjd';

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   */
  const doSearchAction = (formData, tableStore) => {
    const { datebe, sw = "W" } = formData;
    const dateb = datebe && datebe[0];
    const datee = datebe && datebe[1];
    const params = { sw };
    if (dateb && isMoment(dateb)) {
      params.dateb = dateb.format("YYYY-MM-DD");
    }
    if (datee && isMoment(datee)) {
      params.datee = datee.format("YYYY-MM-DD");
    }
    ApplyStore.setParams(params, true);
    tableStore.findByKey(tableStore.key, 1, tableStore.size, params)
  };
  const ref = useRef();

  useEffect(() => { spset() }, [])

  const spset = () => {
    const sp = ApplyStore.ctrlWfVisile("P", ApplyStore.selectRowRecords && ApplyStore.selectRowRecords[0]);
    setSpkj(sp)
  }


  const onChangeRow = (value, tableStore, records) => {

    const record = records[0];
    if (records && records.length > 0) {
      ApplyStore.setSelectRows(records.map(item => item.id), records)
      DapubStore.getDaklist(records[0].dakid, tmzt);
     
    
      setTabkey("1");
      ApplyStore.setDetailParams(
        {
          fid: record.id,
          dakid: record.dakid,
          mbid: record.mbid,
          bmc: record.datbl,
        }
      )
    }
  };

  useEffect(() => {
    WfdefStore.getPorcs("dagl_yjsp");
    ApplyStore.getProcOpts("dagl_yjsp");
    OptrightStore.getFuncRight(umid);
    // field.setValues({
    //   dateb: moment().startOf("month"),
    //   datee: moment().endOf("month"),
    //   sw: "W",
    // });
    ApplyStore.setColumns([
      {
        title: formatMessage({ id: "e9.dagl.yjsp.zt" }),
        code: "wpid",
        width: 100,
        render: (value, record, index) => {
          if (value === "ZZZY") {
            return "否决";
          }
          const list = WfdefStore.proclist["dagl_yjsp"];

          if (list) {
            for (let i = 0; i <= list.length - 1; i++) {
              if (list[i].wpid == value) {
                return list[i].name;
              }
            }
          }
          return value;
        },
      },
      {
        title: formatMessage({ id: "e9.dagl.yjsp.dakmc" }),
        code: "dakmc",
        width: 100,
      },
      {
        title: formatMessage({ id: "e9.dagl.yjsp.yjtitle" }),
        code: "title",
        width: 250,
      },
      {
        title: formatMessage({ id: "e9.dagl.yjsp.year" }),
        code: "year",
        width: 100,
      },
      {
        title: formatMessage({ id: "e9.dagl.yjsp.month" }),
        code: "month",
        width: 100,
      },
      {
        title: formatMessage({ id: "e9.dagl.yjsp.date" }),
        code: "date",
        width: 180,
      },
      {
        title: formatMessage({ id: "e9.dagl.yjsp.yjr" }),
        code: "yjr",
        width: 200,
      },
      {
        title: formatMessage({ id: "e9.dagl.yjsp.jsr" }),
        code: "jsr",
        width: 200,
      },
      {
        title: formatMessage({ id: "e9.dagl.yjsp.remark" }),
        code: "remark",
        width: 200,
      },
      {
        title: formatMessage({ id: "e9.wflw.pub.wfawaiter" }),
        code: "wfawaiter",
        width: 250,
      },
      {
        title: formatMessage({ id: "e9.wflw.pub.wfahandler" }),
        code: "wfahandler",
        width: 200,
      },
    ]);

  }, []);






  //<workdlofbegin
  const onBeforeWfAction = async (action) => {
    if (
      !ApplyStore.selectRowRecords || ApplyStore.selectRowRecords.length !== 1
    ) {

      notification.open({
        message: "提示",
        description: "请选择一条数据",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
      return false;
    }
    return true;
  };

  const onAfterWfAction = (data) => {
    //ApplyStore.queryForPage();
    const store = ref.current?.getTableStore();
    doSearchAction({}, store);
  };

  const getWfid = () => {
    if (ApplyStore.selectRowRecords && ApplyStore.selectRowRecords.length > 0) {
      return ApplyStore.selectRowRecords[0].wfid;
    }
    return "";
  };

  const getWfinst = () => {
    if (ApplyStore.selectRowRecords && ApplyStore.selectRowRecords.length > 0) {
      return ApplyStore.selectRowRecords[0].wfinst;
    }
    return "";
  };
  //>workflow end


  //<print begin
  function openUpload() {
    ApplyStore.uploadVisible = true;
  }

  function openPrint() {
    ApplyStore.printVisible = true;
  }

  /**
  * 分页器，切换页数
  * @param {*} current
  */
  const onDetailPaginationChange = ((current) => {
    applyDetailStore.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onDetailPageSizeChange = ((pageSize) => {
    applyDetailStore.setPageSize(pageSize);
  });
  const onClose = () => {
    setLogVisible(false);
  };


  const viewLog = (value, index, record) => {

    setTmmx('');
    setTmmx(record.id)
    setLogVisible(true);
  }

  //>print end



  //<e9 begin
  const openDak = () => {
    DapubStore.getDDaklist(ApplyStore.detailParams.dakid);

  };
  const onDetailTableRowChange = (selectedRowKeys, records) => {
    applyDetailStore.setSelectRows(selectedRowKeys, records);
  };
  //>e9 end

  /**
* Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
* @param {*} selectedRowKeys
* @param {*} records
*/
  const onTableRowChange = (records) => {
    //  ApplyStore.setSelectRows(selectedRowKeys, records);
    //  records && records.length > 0 && onChangeRow(records);
  };



  const handleChange = () => {

  }

  /**
   * 删除 组件
   * @param record
   * @param store
   * @returns
   */
  const deleteTableAction = (record, store) => {
    return (
      <EpsDeleteButton data={record} store={store} key={"common-delete" + record.id} />
    );
  }


  /**
   *  修改记录
   * @param {* User} record
   */
  const edit = (record, store) => {

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
    json.whr = userinfo.yhmc;
    json.whsj = moment();
    ApplyStore.showEditForm("edit", json, store);
  }
  /**
  * 编辑组件
  * @param record
  * @param store
  * @returns
  */
  const editTableAction = (record, store) => {
    return (
      <Tooltip title="修改" >
        <Button size="small" style={{ fontSize: '12px', color: '#08c' }} shape="circle" icon={<EditOutlined />} onClick={() => edit(record, store)} />
      </Tooltip>
    );
  }



  const [uploadVisible, setUploadVisible] = useState(false);
  const [form] = Form.useForm();
  // 自定义功能按钮
  const customAction = (store, rows) => {
    return ([<>

      <Form
        onFinish={(formData) => doSearchAction(formData, store)}
        layout={"inline"}
        form={form}
        initialValues={{
          // datebe: [moment().startOf("month"), moment().endOf("month")],
          sw: "W",
        }}
      >

        <Form.Item name="sw">
          <Select style={{ width: 120 }} >
            <Select.Option value="W">待我处理</Select.Option>
            <Select.Option value="H">我已处理</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="datebe">
          <RangePicker />
        </Form.Item>
        <Form.Item >
          <Button type="primary" htmlType={"submit"}>查询</Button>
        </Form.Item>
      </Form>



      {spkj && <UploadReport />}
      <WflwButtons
        style={{ marginLeft: "10px" }}
        offset={[18, 0]}
        type={["submit", "return", "reject", "logview"]}
        wfid={getWfid()}
        wfinst={getWfinst()}
        onBeforeAction={onBeforeWfAction}
        onAfterAction={onAfterWfAction}
      />

    </>])
  }


  const doEditOk = () => {
    const store = ref.current?.getTableStore();
    doSearchAction({}, store);
  }
  /**
  * 响应删除事件
  * @param {*} id
  */
  const onDeleteAction = (id) => {

  };

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (<>
      {[
        ApplyStore.canWfDelete(record) &&
        deleteTableAction(record, store),
        ApplyStore.canWfEdit(record) &&
        editTableAction(record, store),
        Print(text, record, index, store),
      ]}
    </>);
  }



  const tableProp = {
    disableAdd: true, tableSearch: false,
    disableEdit: true,
    disableDelete: true,
    rowSelection: {
      type: 'radio',
    }
  }

  const onTabChange = (key) => {

    if (key == "2") {
      const rs = detailTableStore.selectedRowKeys;
      if (!rs || rs.length <= 0) {
        // IceNotification.info({
        //   message: formatMessage({ id: "e9.info.info" }),
        //   description: formatMessage({ id: "e9.info.selectOneOnly" }),
        // });
       
        notification.open({
          message: "提示",
          description: formatMessage({ id: "e9.info.selectOneOnly" }),
          onClick: () => {
            console.log("Notification Clicked!");
          },
        });
        return;
      }

      ApplyStore.setDetailSelectRowKeys(detailTableStore.selectedRowKeys,detailTableStore.checkedRows)
     // openDak();
    }
    setTabkey(key);
  };
  debugger
  const bottomAction = (store, rows) => {
    return (useObserver(() => (
      <div className="detail-container">
        <Tabs type="line" style={{ height: '100%' }}
          hideAdd
          activeKey={tabkey}
          // onEdit={onEdit}
          onChange={(key) => onTabChange(key)}
        >
          
            <TabPane key={1} tab={"条目明细"} style={{ height: '100%' }} closable={false} >

              <ApplyDetail setTableStore={(value) => {setDetailTableStore(value)}} columns={DapubStore.mainColumns} fid={ApplyStore.fid} detailParams={ApplyStore.detailParams} jdlx={"jdlx"} />

            </TabPane>
          {ApplyStore.selectRowRecords && ApplyStore.selectRowRecords.length
            && DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid]
            && ["02", "03", "0401"].includes(DapubStore.ktables[ApplyStore.selectRowRecords[0].dakid].daklx)
            &&
            <TabPane key={2} tab={"卷内"} style={{ height: '100%' }} closable={false} >

            <ArchDetail 
              archParams={{ fid: ApplyStore.detailParams.dakid, tmzt }}
              fileCol
              recordId={ ApplyStore?.detailSelectRows[0]?.daid }
            jdlx={"jdlx"} />
            </TabPane>
          }
        </Tabs>
      </div>))
    )
  }

  return (
    <>
      <EpsRecordPanel
        customAction={customAction}
        customTableAction={customTableAction}
        tableProp={tableProp}
        //tableRowClick={onChangeRow}
        title={title}
        source={ApplyStore.columns}
        tableService={ApplyService}
        ref={ref}
        bottomAction={bottomAction}
        onTabChange={onChangeRow}
      />
      <EditDailog doEditOk={doEditOk} />
    </>
  );
})

export default ApplyCmp;

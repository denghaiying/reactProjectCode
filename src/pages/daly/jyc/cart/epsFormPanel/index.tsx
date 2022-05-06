import { observer } from "mobx-react";
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Table, Button, Form, Row, Col,  message, Modal } from "antd";
import './index.less';
import {SearchOutlined, DeleteOutlined, ExclamationCircleOutlined, SyncOutlined} from '@ant-design/icons';

import {EpsProps, EpsSource, TableColumn} from "@/eps/commons/declare";


import EpsTableStore from "@/pages/daly/jyc/cart/epsFormPanel/EpsTableStore";
import CartService from "@/pages/daly/jyc/cart/CartService";
import Cart from "@/pages/daly/jyc/cart/indexold1";

const formItemLayout = {
  colon: false,
  labelCol: {
    span: 8
  },
};

const { confirm } = Modal;
const EpsFormPanel = observer(forwardRef((props: EpsProps, ref) => {


  // 搜索表单
  const searchForm = props.searchForm;
  const [form] = Form.useForm();
  const data = {};
  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(props.tableService))
  const [columns, setColumns] = useState<TableColumn[]>([])

  // 表格选中行时，设置key值
  const [rowSelection, setRowSelection] = useState(props.tableProp?.rowSelection);

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  // 表格选中行时， 设置行属性
  const [checkedRows, setCheckedRows] = useState<any>([]);
  //  表格选中行时，记录当前行数据
  const [selectedRowData, setSelectedRowData] = useState({});
  let { tableList, loading, page, size, total } = tableStore;

  const onPageSizeChange = (page, size) => {
    page != tableStore.page && (tableStore.page = page);
    size !== tableStore.size && (tableStore.size = size);
  }

  // 暴露tableStore
  useImperativeHandle(ref, () => ({
    getTableStore: () => tableStore
  }));

  // 自定义功能按钮
  const customAction = props.customAction || undefined;
  // 自定义表单，用于替换默认
  size !== tableStore.size && (tableStore.size = size);
  const customForm = props.customForm || undefined;

  // 表格按钮相关配置,控制按钮是否可可点击

  const [disableDelete, setDisabledelete] = useState(false);

  // 主表单
  const [formBd] = Form.useForm();
  // 明细表数据
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  type DataSourceType = {
    id: React.Key;
    title?: string;
    decs?: string;
    state?: string;
    created_at?: string;
    update_at?: string;
    children?: DataSourceType[];
  };

  useEffect(() => {
    // 获取主表的表格列
    setColumns(getTableColumn(props.source));

  }, [props.source, props.detailSource]);
  useEffect(() => {
    tableStore.findByKey(tableStore.key, 1, tableStore.size, tableStore.params);
  }, [tableStore.key])

  useEffect(() => {
    console.log(props.initParams)
  }, [])

  // 获取搜索框
     const makeForm = (searchForm) => {
    if (searchForm) {
      const { props: { children } } = searchForm();
      if (children) {
        if (Object.prototype.toString.call(children) === '[object Object]') {
          return (
            <><div className="row">{children}</div></>
          )
        }
        if (Array.isArray(children)) {
          if (children && children.length > 0) {
            return children.map((item, index) => {
              return (
      //          <Col span={6} key={index}>
                  {item}
       //         </Col>
              )
            })
          } else {
            return (<></>)
          }
        }
      }
    }
  }

  function isXz(zd, key) {
    const zdKey = zd.split(",");
    for (let i = 0; i < zdKey.length; i++) {
      if (zdKey[i] === key) {
        return true;
      }
    }
    return false;
  }


  // 搜索事件
  const handleSearch = () => {
    form.validateFields().then(data => {
      console.log('formdata',data);
      const url = "/eps/control/main/daly/apply";
      const ck=data.ck;
      let ckys="";
      let ckcq="";
      let cksy="";
      let dyys="";
      let dycq="";
      let dysy="";
      let xzys="";
      let xzcq="";
      let xzsy="";


      if (isXz(ck, "ck_ys")) {
        ckys = "Y"
      }
      if (isXz(ck, "ck_cq")) {
        ckcq = "Y"
      }
      if (isXz(ck, "ck_sy")) {
        cksy = "Y"
      }
      var dy = data.dy;
      if (isXz(dy, "dy_ys")) {
        dyys = "Y"
      }
      if (isXz(dy, "dy_cq")) {
        dycq = "Y"
      }
      if (isXz(dy, "dy_sy")) {
        dysy = "Y"
      }
      var xz = data.xz;
      if (isXz(xz, "xz_ys")) {
        xzys = "Y"
      }
      if (isXz(xz, "xz_cq")) {
        xzcq = "Y"
      }
      if (isXz(xz, "xz_sy")) {
        xzsy = "Y"
      }

      // var isJyts = getDefaultv("DALYF003");  //借阅单中借阅天数限制  Y:是;N:否
      // var jytsData = getDefaultv("DALYF002"); //协查单或借阅单的借阅天数，默认值为1
      // var dzseleed=0;
      // var newdata=[];
      // if(data.length>0){
      //   for (var i = 0; i < data.length; i++) {
      //     var sjdata = data[i];
      //     if(sjdata.dzjy=="N" &&sjdata.stjy=="N"){
      //       dzseleed=1;
      //     }else{
      //       newdata.push(sjdata);
      //     }
      //   }
      // }
      // if(newdata.length>0){
      //   for (var i = 0; i < newdata.length; i++) {
      //     var stsl = newdata[i];
      //     if(sjdata.stjy=="Y"){
      //       if(stsl.stfs==0){
      //         Eps.showTip(stsl.tm+"实体份数为0,不能借阅", "error");
      //         return ;
      //       }
      //     }
      //     if(sjdata.dzjy=="Y"){
      //       if(stsl.fjs<1){
      //         Eps.showTip(stsl.tm+"附件数为0,不能借阅", "error");
      //         return ;
      //       }
      //     }
      //   }
      //
      // }
      // var jycList = mini.JSON.encode(deleteNode(newdata));
      //
      // if (jytsData && isJyts != "N" && (bdInfo.jyts > jytsData || bdInfo.jyts < 2)) {
      //   Eps.showTip("借阅天数只能在【2】-【" + jytsData + "】天", "error");
      //   return;
      // } else {
      //   $.ajax({
      //     url: url,
      //     type: 'post',
      //     dataType: "json",
      //     contentType: "application/x-www-form-urlencoded",
      //     cache: false,
      //     data: {
      //       jyc: jycList,
      //       yhid: Eps.top().getUserId(),
      //       yhbh: Eps.top().getUserInfo().bh,
      //       dwid: Eps.top().getUserDwid(),
      //       bmid: Eps.top().getDeptId(),
      //       sqr: bdInfo.sqr,
      //       jyts: bdInfo.jyts,
      //       dw: bdInfo.dw,
      //       email: bdInfo.yx,
      //       sj: bdInfo.sj,
      //       dh: bdInfo.dh,
      //       gw: gw,
      //       bm: bdInfo.bm,
      //       bz: bdInfo.jysm,
      //       yhlx: bdInfo.yhlx,
      //       lymd: bdInfo.lymd,
      //       ck: ckys == null ? "N" : ckys,
      //       ckcq: ckcq == null ? "N" : ckcq,
      //       cksy: cksy == null ? "N" : cksy,
      //       dy: dyys == null ? "N" : dyys,
      //       dycq: dycq == null ? "N" : dycq,
      //       dysy: dysy == null ? "N" : dysy,
      //       xz: xzys == null ? "N" : xzys,
      //       xzcq: xzcq == null ? "N" : xzcq,
      //       sywz: bdInfo.sywz,
      //       xzsy: xzsy == null ? "N" : xzsy,
      //       sqrq: mini.formatDate(bdInfo.sqrq, "yyyy-MM-dd HH:mm:ss"),
      //       printnum: bdInfo.printnum,
      //       opennum: bdInfo.opennum,
      //       dowlnnum: bdInfo.dowlnnum,
      //       dxtx: bdInfo.dxtx == "Y" ? "短信提醒" : "",
      //       txtxt: bdInfo.txtxt == "Y" ? "腾讯通提醒" : "",
      //       showxxfs: showxxfs,
      //       grpid: filegrpid,
      //       fjs: fjs
      //     },
      //     success: function (result) {
      //       if (result.success) {
      //         if (result.results.length <= 0) {
      //           Eps.showTip("借阅申请提交成功！");
      //           Eps.top().mainRefreshJycSL()
      //           closeWindow();
      //         } else {
      //           var message = "";
      //           //拼接message
      //           $.each(result.results, function (index, resultKey) {
      //             message += ((resultKey.message != undefined && resultKey) ? resultKey.message : resultKey) + "<br/>";
      //           });
      //
      //           Eps.showTip(message, "error");
      //         }
      //       } else {
      //         Eps.showTip(result.message, "error");
      //       }
      //     }
      //   });


    })
      .catch(info => {
        message.error('提交失败,' + info)
      }).finally(() => {
    })
  }

  // 获取主表格列
  const getTableColumn = (list: Array<EpsSource>) => {
    const columns: Array<any> = [{
      title: '序号',
      align: 'center',
      fixed: 'left',
      width: 60,
      render: (_, __, index: number) => index + (tableStore.page - 1) * tableStore.size + 1,
    }];
    if (list) {
      for (let item of list) {
        item && columns.push(new TableColumn(item.code, item.title, item.align, item.render, item.width, item.ellipsis, item.fixed));
      }
    }
    return columns;
  }

  //table表格的onChange事件
  const onTableRowChange = (selectedRowKeys, records) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRowData(records[0]);
    //根据主表id查询明细表数据
    // if (records.length > 0) {
    //   detailStore.findByKey(detailStore.detailKey, 1, detailStore.detailSize, { "id": records[0].id });
    // }
  };

  const searchTm = () => {
    tableStore.findByKey();
  };


  const openFJ = () => {

    // if (!filegrpid || !$.trim(filegrpid)) {
    //   var s = Eps.asyncAjax("/eps/wdgl/attachdoc/getGuid", {}, true);
    //   filegrpid = s.message;
    // }
    //
    // mini.open({
    //   title: "附件",
    //   //url: "src/uploadwindow.html",
    //   url: "/eps/control/main/6/scripts/thirdparty/uploadwindow/uploadwindow.html",
    //   width: "70%", height: "70%",
    //   allowResize: false,
    //   onload: function () {
    //     var idvs = {id: filegrpid};
    //     var iframe = this.getIFrameEl();
    //     var data = {
    //       docTbl: "ATTACHDOC",
    //       docGrpTbl: "DOCGROUP",
    //       grpid: filegrpid,
    //       idvs: mini.JSON.encode(idvs),
    //       wrkTbl: "JYD",
    //       lx: null,
    //       atdw: "DEFAULT",
    //       tybz: "N",
    //       whr: Eps.top().getUserName(),
    //       whsj: whsj,
    //       fjsctrue: fjsctrue
    //     };  //模拟传递上传参数
    //     iframe.contentWindow.SetData(data);
    //   },
    //   ondestroy: function (action) {
    //
    //     //  if (action == "ok") {
    //     var iframe = this.getIFrameEl();
    //
    //     var data = iframe.contentWindow.GetData();
    //     data = mini.clone(data);
    //
    //     $("#fjnum").text(data.fjs);
    //     fjs = data.fjs;
    //
    //     // Eps.showTip("已完成上传数据：\n");
    //     // }
    //   }
    // })
  };

  return (
    <div style={{ height: '100%' }}>
      { // 搜索框
        searchForm
        &&
        <Row>
          <Col span={20}>
            <div className="search">
              <Form name="searchForm" form={form} {...formItemLayout} initialValues={props.initParams}>
                <Row>
                  <Col >
                    <div className="btns"> <Button type="primary" style={{ fontSize: '12px' }} onClick={handleSearch} icon={<SearchOutlined />}>提交</Button>
                    &nbsp;&nbsp;&nbsp;
                      <Button type="primary" style={{ fontSize: '12px' }} onClick={searchTm} icon={<SyncOutlined />}>刷新明细</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="primary" style={{ fontSize: '12px' }} onClick={openFJ} icon={<SyncOutlined />}>附件&nbsp;0</Button></div>
                  </Col>
                </Row>
                <Row className="form-row">
                  {makeForm(searchForm)}
                </Row>
              </Form>
            </div>
          </Col>

        </Row>
      }

      <div>

              {/*列表页的Table表格*/}
                <Table columns={columns} dataSource={tableList} bordered className="group-table"
                       pagination={{
                         showQuickJumper: true,
                         showSizeChanger: true,
                         defaultCurrent: page,
                         defaultPageSize: size,
                         pageSize: size,
                         current: page,
                         showTotal: (total, range) => `共 ${total}  条数据`,
                         onChange: onPageSizeChange,
                         total: total
                       }}
                       loading={loading}
                       expandable={{
                         expandIconColumnIndex: 1,
                         defaultExpandAllRows: true,
                       }}
                       rowSelection={{ onChange: onTableRowChange, selectedRowKeys: selectedRowKeys, type: 'checkbox' }}
                />



      </div>
    </div >
  );
}));

export default EpsFormPanel;

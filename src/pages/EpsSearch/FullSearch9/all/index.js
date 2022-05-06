import React, { useEffect, useState } from 'react';
import './index.less'
import { Input, message, Modal, Table, Button, Pagination, DatePicker, Space } from 'antd';
import Store from "../../../../stores/EpsSearch/EpsSearchStore";
import ParamsManageStore from "../../../../stores/system/ParamsManageStore";
import { observer } from 'mobx-react';
import { configure } from 'mobx';
import { useIntl, FormattedMessage } from 'umi';
import NewDajyStore from '@/stores/daly/NewDajyStore';
const { RangePicker } = DatePicker;

const all = observer(props => {

  const ywClick = (tmid, dakid, fileid, filename, adwid, wjlx, bmc, sylx) => {

    Store.openywClick(tmid, dakid, fileid, filename, adwid, wjlx, bmc, sylx);
  };




  const columns = [
    // {
    //   title: "流程状态",
    //   dataIndex: "lczt",
    //   key: "lczt",
    //   width: 30,
    //   lock: true,
    //   align: 'center',
    //   render: (text) => {
    //     if (text) {
    //         return text
    //     } else {
    //         return text = "编制";
    //     }
    // }

    // },
    {
      title: '序号',
      dataIndex: '',
      textWrap: 'word-break',
      ellipsis: true,
      align: 'center',
      width: 30,
      render: (_, __, index) => index + (Store.page_No - 1) * Store.page_Size + 1,
    },
    // {
    //   title: '流程状态',
    //   code: 'lczt',
    //   align: 'center',
    //   ellipsis: true,         // 字段过长自动东隐藏
    //   fixed: 'left',
    //   width: 60,
    //   render: (text) => {
    //     if (text) {
    //       return text === null ? '编制' : '否';
    //     } else {
    //       return text = "编制";
    //     }
    //   }
    // },
    {
      title: "申请人",
      dataIndex: "wfawaiter",
      key: "wfawaiter",
      width: 60,
      align: 'center',
    },

    {
      title: "申请单位",
      dataIndex: 'dwmc',
      key: 'dwmc',
      width: 100,
      ellipsis: true,
      align: 'center',
    },
    {
      title: "申请部门",
      dataIndex: 'bm',
      key: 'bm',
      width: 100,
      ellipsis: true,
      align: 'center',
    },

    {
      title: "所属全宗",
      dataIndex: 'ssjzmc',
      key: 'ssjzmc',
      width: 100,
      ellipsis: true,
      align: 'center',
    },
    // {
    //   title: "手机",
    //   dataIndex: 'sj',
    //   key: 'sj',
    //   width: 30,
    //   align: 'center',
    // },
    // {
    //   title: "邮箱",
    //   dataIndex: 'yx',
    //   key: 'yx',
    //   width: 30,
    //   align: 'center',
    // },
    {
      title: "协查内容",
      dataIndex: 'lymd',
      key: 'lymd',
      width: 100,
      align: 'center',
      render: (text) => {
        if (text) {
          for (var i = 0; i < NewDajyStore.lymdDataSelect.length; i++) {
            if (text === NewDajyStore.lymdDataSelect[i].bh) {
              text = NewDajyStore.lymdDataSelect[i].label
            }
          }
          return text;
        }
      }
    },
    {
      title: "简要说明",
      dataIndex: 'bz',
      ellipsis: true,
      key: 'bz',
      width: 120,
      align: 'center',
    },

    {
      title: "借阅天数",
      dataIndex: 'jyts',
      key: 'jyts',
      width: 60,
      align: 'center',
    },
    {
      title: "申请时间",
      dataIndex: 'sqrq',
      key: 'srq',
      width: 100,
      align: 'center',
    },
    {
      title: "查看",
      dataIndex: 'ck',
      key: 'ck',
      width: 30,
      align: 'center',
      render: (text) => {
        if (text) {
          return text === 'Y' ? '是' : '否';
        } else {
          return text = "无";
        }
      }
    },
    {
      title: "打印",
      dataIndex: 'dy',
      key: 'dy',
      width: 30,
      align: 'center',
      render: (text) => {
        if (text) {
          return text === 'Y' ? '是' : '否';
        } else {
          return text = "无";
        }
      }
    },
    {
      title: "下载",
      dataIndex: 'xz',
      key: 'xz',
      width: 30,
      align: 'center',
      render: (text) => {
        if (text) {
          return text === 'Y' ? '是' : '否';
        } else {
          return text = "无";
        }
      }
    }

  ]



  const findByWjlx = (value) => {
    if (value === 'docx') {
      return (<img src={require('../assets/img/icon_bianyan.png')} className="pdf_icon" alt="" />)
    }
    if (value === 'doc') {
      return (<img src={require('../assets/img/icon_bianyan.png')} className="pdf_icon" alt="" />)
    }
    if (value === 'xls') {
      return (<img src={require('../assets/img/icon_yingyong.png')} className="pdf_icon" alt="" />)
    }
    if (value === 'xlsx') {
      return (<img src={require('../assets/img/icon_yingyong.png')} className="pdf_icon" alt="" />)
    }
    if (value === 'pdf') {
      return (<img src={require('../assets/img/icon_pdf.png')} className="pdf_icon" alt="" />)
    }
    if (value === 'txt') {
      return (<img src={require('../assets/img/icon_rili.png')} className="pdf_icon" alt="" />)
    }
    if (value === 'JPG') {
      return (<img src={require('../assets/img/icon_todo2.png')} className="pdf_icon" alt="" />)
    }
    if (value === 'png') {
      return (<img src={require('../assets/img/icon_tool.png')} className="pdf_icon" alt="" />)
    }

  }
  //判断协查单状态后是否显示
  const findByJycStatus = (value) => {

    if (ParamsManageStore.jycStatus && ParamsManageStore.jycStatus.message == "Y") {
      return (
        <>
          <span className="icon-part" onClick={() => Store.addBorrow(value.attr_tmid, value.attr_dakid, value.id)}><span className="iconfont icon-cart"></span>加入借阅车</span>
        </>
      )
    }
  }
  //判断利用大厅状态后是否显示
  const findByLydtStatus = (value) => {
    console.log('ParamsManageStore.lydtStatus.message', ParamsManageStore.lydtStatus.message)
    if (ParamsManageStore.lydtStatus && ParamsManageStore.lydtStatus.message == "Y") {
      return (
        <>
          <span className="icon-part" onClick={() => Store.addLobby(value.attr_tmid, value.attr_dakid)}><span className="iconfont icon-book"></span>加入查档登记</span>
        </>
      )
    }
  }


  //判断协查单状态后是否显示
  const findByXcdStatus = (value) => {

    console.log('ParamsManageStore.xcdStatus.message', ParamsManageStore.xcdStatus.message)
    if (ParamsManageStore.xcdStatus && ParamsManageStore.xcdStatus.message == "Y") {
      return (
        <>
          <span className="icon-part" onClick={() => showModal(value.attr_tmid, value.attr_dakid, value.attr_bmc)}><span className="iconfont icon-book"></span>加入协查单</span>
        </>
      )
    }
  }
  const findBySylx = (param, data) => {
    if (param === 'all') {
      return (
        data && data.data && data.data.map && data.data.map(item => (
          <li className="item" key={item.source.id}>
            <p className="title">
              {
                item.source.attr_sylx === 'tm' ? <span className="label">条目</span> : <span className="label">文件</span>
              }
              <span className="title" >
                <div dangerouslySetInnerHTML={{ __html: item.source.attr_wjtm }} />
              </span>
            </p>
            <p className="article">
              <div dangerouslySetInnerHTML={{ __html: item.source.attr_glzdz }} />
            </p>

            {
              item.source.attr_sylx === 'yw' ?
                <div className="file-place">
                  {findByWjlx(item.source.attr_wjlx)}
                  <div className="pdf_right">
                    <span onClick={() => ywClick(item.source.attr_tmid, item.source.attr_dakid, item.source.attr_fileid, item.source.attr_wjtm, item.source.attr_dwid, item.source.attr_wjlx, item.source.attr_bmc, item.source.attr_sylx)}>
                      <p className="title-a"><div dangerouslySetInnerHTML={{ __html: item.source.attr_wjbt }} /></p>
                    </span>
                    <p className="summary"><div dangerouslySetInnerHTML={{ __html: item.source.text }} /></p>
                  </div>
                </div> : ''
            }



            <div className="bottom">
              <div className="left">
                单位：<span className="value">{item.source.attr_dwmc}</span>
                档案库：<span className="value" dangerouslySetInnerHTML={{ __html: item.source.attr_dakmc }} />
                档案库类型：<span className="value" dangerouslySetInnerHTML={{ __html: item.source.attr_mblbmc }} />
                年度：<span className="value" dangerouslySetInnerHTML={{ __html: item.source.nd }} />
                文件类型:<span className="value">{item.source.attr_wjlx}</span>
              </div>

              <div className="bottom-right">
                {/* <span className="icon-part"><span className="iconfont icon-eye"></span>详情</span> */}
                {/* <span className="icon-part"><span className="iconfont icon-star" ></span>收藏</span> */}

                {findByJycStatus(item.source)}
                {findByLydtStatus(item.source)}
                {findByXcdStatus(item.source)}
                {/*
              <span className="icon-part" onClick={() => Store.addBorrow(item.source.attr_tmid, item.source.attr_dakid, item.source.id)}><span className="iconfont icon-cart"></span>加入借阅车</span>
              <span className="icon-part" onClick={() => Store.addLobby(item.source.attr_tmid, item.source.attr_dakid, item.source.id, item.source.attr_bmc)}><span className="iconfont icon-book"></span>加入查档登记</span> */}
              </div>
            </div>
          </li>
        ))
      )
    }

    if (param === 'catalog') {
      return (
        data && data.data && data.data.map && data.data.map(item => (
          <li className="item" key={item.source.id}>
            <p className="title">
              {
                param === 'file' ? <span className="label">文件</span> : <span className="label">条目</span>
              }
              <span>
                <div dangerouslySetInnerHTML={{ __html: item.source.attr_wjtm }} />
              </span>
            </p>
            <p className="article">
              <div dangerouslySetInnerHTML={{ __html: item.source.attr_glzdz }} />
            </p>
            <div className="bottom">
              <div className="left">
                单位：<span className="value">{item.source.attr_dwmc}</span>
                {/* 档案库：<span className="value" dangerouslySetInnerHTML={{ __html: item.source.attr_dakmc }} /> */}
                档案库类型：<span className="value" dangerouslySetInnerHTML={{ __html: item.source.attr_mblbmc }} />
                年度：<span className="value" dangerouslySetInnerHTML={{ __html: item.source.nd }} />
              </div>
              <div className="bottom-right">

                {/* <span className="icon-part"><span className="iconfont icon-star" ></span>收藏</span> */}

                {findByJycStatus(item.source)}
                {findByLydtStatus(item.source)}
                {findByXcdStatus(item.source)}

                {/* <span className="icon-part"><span className="iconfont icon-cart"></span>加入借阅车</span>
              <span className="icon-part"><span className="iconfont icon-book"></span>加入查档登记</span> */}

              </div>
            </div>
          </li>
        ))
      )


    }
    if (param === 'file') {
      return (
        data && data.data && data.data.map && data.data.map(item => (
          <li className="item" key={item.source.id}>
            <p className="title">
              {
                item.source.attr_sylx === 'tm' ? <span className="label">条目</span> : <span className="label">文件</span>
              }
              <span className="title" >
                <div dangerouslySetInnerHTML={{ __html: item.source.attr_wjtm }} />
              </span>
            </p>
            <p className="article">
              <div dangerouslySetInnerHTML={{ __html: item.source.attr_glzdz }} />
            </p>

            <div className="file-place">
              {/**此处为文件图片显示 */}
              {findByWjlx(item.source.attr_wjlx)}
              <div className="pdf_right">
                <span onClick={() => ywClick(item.source.attr_tmid, item.source.attr_dakid, item.source.attr_fileid, item.source.wjbt_nored, item.source.attr_dwid, item.source.attr_wjlx, item.source.attr_bmc, item.source.attr_sylx)}>
                  <p className="title-a"><div dangerouslySetInnerHTML={{ __html: item.source.attr_wjbt }} /></p>
                </span>
                <p className="summary"><div dangerouslySetInnerHTML={{ __html: item.source.text }} /></p>
              </div>
            </div>

            <div className="bottom">
              <div className="left">
                单位：<span className="value">{item.source.attr_dwmc}</span>
                档案库：<span className="value" dangerouslySetInnerHTML={{ __html: item.source.attr_dakmc }} />
                档案库类型：<span className="value" dangerouslySetInnerHTML={{ __html: item.source.attr_mblbmc }} />
                年度：<span className="value" dangerouslySetInnerHTML={{ __html: item.source.nd }} />
                文件类型:<span className="value">{item.source.attr_wjlx}</span>
              </div>

              <div className="bottom-right">
                {/* <span className="icon-part"><span className="iconfont icon-eye"></span>详情</span> */}
                {/* <span className="icon-part"><span className="iconfont icon-star"></span>收藏</span> */}



                {findByJycStatus(item.source)}
                {findByLydtStatus(item.source)}
                {findByXcdStatus(item.source)}
                {/* <span className="icon-part" onClick={() => Store.addBorrow(item.source.attr_tmid, item.source.attr_dakid, item.source.id)}><span className="iconfont icon-cart"></span>加入借阅车</span>
              <span className="icon-part" onClick={() => Store.addLobby(item.source.attr_tmid, item.source.attr_dakid, item.source.id, item.source.attr_bmc)}><span className="iconfont icon-book"></span>加入利用大厅</span> */}


              </div>
            </div>
          </li>
        ))
      )
    }
  }




  // const { intl: { formatMessage } } = props;




  const [add_visible, setIsModalVisible] = useState(false)
  const showModal = (tmid, dakid, bmc) => {

    Store.add_tmid = tmid;
    Store.kdakid = dakid;
    Store.add_bmc = bmc;
    Store.add_xcdid = '';
    Store.getXcdPageList();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const setAddVisible = () => {
    setIsModalVisible(false);
  };

  const submitAddXcd = () => {
    debugger;

    if (!Store.add_xcdid) {
      message.error('请至少选择一行数据!');
    } else {
      Store.addXcd();
      setIsModalVisible(false);
    }
  }

  const handleRq = (val) => {
    if (val && val[0]) {
      Store.startRq = val[0].format('YYYY-MM-DD')
    } else {
      Store.startRq = ""
    }
    if (val && val[1]) {
      Store.endRq = val[1].format('YYYY-MM-DD')
    } else {
      Store.endRq = ""
    }
  }
  const handleSqr = (val) => {
    Store.setSqr = val.target.value;
  }

  const OnSearch = () => {
    Store.getXcdPageList();
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      Store.add_xcdid = selectedRowKeys[0];
      console.log(Store.add_xcdid);
      selectedRowKeys = '';

      Store.queryKTable(Store.kdakid);
    },
  };


  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const { type, items, data, fileItems, queryForPage, pageno, pagesize, quePage } = Store;

  useEffect(() => {
    //初始化查询利用大厅状态
    ParamsManageStore.queryLydtByCode();
    //初始化查询借阅车状态
    ParamsManageStore.queryJycByCode();
    //初始化查询协查单状态
    ParamsManageStore.queryXcdByCode();
    NewDajyStore.querySjzdByLymd();

  }, []);
  return (
    <div className="all-tab">
      {
        findBySylx(type, data)
      }
      {/* //协查单申请表 */}
      <Modal title={<span className="m-title">协查单申请表</span>}
        visible={add_visible}
        onOk={() => submitAddXcd()}
        onCancel={() => setAddVisible(false)}
        style={{ top: 50 }}
        width='1400px'
        destroyOnClose={true}
        okText='加入'
      >

        <div >
          <Space direction="vertical" size={12}>
            <RangePicker onChange={(val) => handleRq(val)} />
          </Space>
          &nbsp; &nbsp;
          <Input style={{ width: 180 }} allowClear name="wfawaiter" onChange={handleSqr} placeholder="请输入申请人"
          //onChange={getDwbh}
          ></Input>
          &nbsp; &nbsp; &nbsp; &nbsp;
          {/* <Input style={{ width: 180 }} allowClear name="cx_sj" placeholder="请输入手机号"
          //onChange={getDwmc}
          ></Input>
          &nbsp; &nbsp;
          <Input style={{ width: 180 }} allowClear name="cx_mail" placeholder="请输入邮箱"
          //onChange={getDwmc}
          ></Input>
          &nbsp; &nbsp; &nbsp; &nbsp; */}
          <Button type="primary"
            onClick={() => OnSearch()}
          >查询</Button>
        </div>


        <div style={{ marginLeft: 8 }}>
          <Table
            // className="ant-table"
            rowSelection={{ type: 'radio', ...rowSelection, }}
            columns={columns}
            dataSource={Store.XcdPageList}
            bordered
            size="middle"
            scroll={{ x: 1150, y: 400 }}
            style={{ marginTop: "30px" }}
            pagination={{
              defaultCurrent: 1,
              defaultPageSize: 50,
              showTotal: () => `共${Store.XcdTotal}条`,
              pageSize: Store.page_Size,
              current: Store.page_No,
              total: Store.XcdTotal,
              onChange: (current, pageSize = 50) => {
                Store.page_No = current;
                Store.page_Size = pageSize;
                Store.getXcdPageList();
              }
            }}
          />
        </div>
      </Modal>

      <Pagination className="paginate"
        showQuickJumper
        total={data.total}
        current={Store.pageno}
        pageSize={Store.pagesize}
        onChange={Store.onPageChange} />
    </div>
  )

});





export default all;

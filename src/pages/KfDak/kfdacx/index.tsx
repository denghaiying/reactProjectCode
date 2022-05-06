import React, { useEffect } from 'react';
import './index.less'
import { Select, Field, TreeSelect, Icon, Button, Input, Dialog, Notification, Form, DatePicker } from '@alifd/next';
const { RangePicker } = DatePicker;

import { observer } from 'mobx-react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import { injectIntl } from "react-intl";
import Store from "../../../stores/kfDak/KfDakStore";
import EpsFilesView from "@/eps/components/file/EpsFilesView"
import { RegisterCommand } from 'gg-editor';
import LoginStore from '@/stores/system/LoginStore';
import { login } from '@/services/BaseService/api';

const FormItem = Form.Item;

const openSearch = observer(props => {
  const { intl: { formatMessage } } = props;
  const { data,loading } = Store;
  const field = Field.useField();

  const openNotification = (a, type) => { Notification.open({ title: a, type, }); };
  /**
   * 初始化页面数据
   */
  useEffect(() => {
    //初始化页面数据
    LoginStore.login("gly","888")
    Store.queryForPage();
  }, []);


  const columns = [
    // {
    //   title: '序号',
    //   dataIndex: '',
    //   textWrap: 'word-break',
    //   width: 50,
    //   //下列语法需要文件名后缀为.tsx才可以执行
    //   render: (_, __, index: number) => index + (Store.page_no - 1) * Store.page_size + 1,
    // },

    {
      title: '档号',
      dataIndex: 'kfDak_dh',
      textWrap: 'word-break',
     // align: 'center',
      width: 100,

    }, {
      title: '题名',
      dataIndex: 'kfDak_tm',
      textWrap: 'word-break',
      //align: 'center',
      width: 200,
    },
    {
      title: '全宗名称',
      dataIndex: 'kfDak_qzmc',
      textWrap: 'word-break',
      //align: 'center',
      width: 100,
    },
    {
      title: '保管期限',
      dataIndex: 'kfDak_bgqx',
      textWrap: 'word-break',
      //align: 'center',
      width: 80,
    }, {
      title: '发文日期',
      dataIndex: 'kfDak_fwrq',
      textWrap: 'word-break',
      //align: 'center',
      width: 80,
      //render: text => <a>{text}</a>,
      render: text => text,
    },{
      title: '附件',
      dataIndex: 'fj',
      textWrap: 'word-break',
      //align: 'center',
      width: 80,
      //render: text => <a>{text}</a>,
      render: (text,record) => {
        return  <EpsFilesView 
                  fjs={record.fjsl}  
                  bmc={record.bmc}
                  tmid={record.tmid}
                  dakid={record.dakid}
                  grpid={record.grpid}
                  btnName={"附件"}
      />
      }
    }
    
  ];



  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    Store.setPage_No(current);

  });


  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    Store.setPage_Size(pageSize);
  });

  const onDateOK = (val) => {
    Store.StartTime = val[0].format('YYYY-MM-DD')
    Store.EndTime = val[1].format('YYYY-MM-DD')

  }
  const onDateChange = (val) => {
    if (val[0]) {
      Store.StartTime = val[0].format('YYYY-MM-DD')
    } else {
      Store.StartTime = ""
    }

    if (val[1]) {
      Store.EndTime = val[1].format('YYYY-MM-DD')
    } else {
      Store.EndTime = ""
    }
  }


  const getTm = (val) => {
    Store.tm = val;
  }

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = ((values) => {
    // 
    // console.log(values);
    // console.log(values.size);
    //   if(values.<=0){
    //     this.openNotification('请至少输入一种查询条件', 'error');
    //   }


    Store.queryForPage();
  });


  // 表格分页属性
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: () => `共${Store.total}条`,
    defaultPageSize: 100,
    defaultCurrent: 1,
    pageSize: Store.page_size,
    current: Store.page_no,
    total: Store.total,
    onChange: onPaginationChange,
    onShowSizeChange: (current, pageSize) => onPageSizeChange(pageSize, current),


  };

  return (
    <div className="my-schedule">
      <div className="banner">
        <div className="center">
          <span className="banner-title"><img alt="" /><span>开放档案查询</span></span>
        </div>

      </div>
      <div className="container">

        <div className="right">
          <div className="condition">
            <Form inline style={{ marginTop: "15px" }}>
              <FormItem>
                <Input hasClear name="tm" style={{ width: 450 }} size="small" placeholder="题名" onChange={getTm} />
              </FormItem>
              <FormItem>
                <Input hasClear name="qzmc" style={{ width: 450 }} size="small" placeholder="全宗名称" onChange={getTm} />
              </FormItem>
              <FormItem>
                <Form.Submit type="primary" size="small" onClick={doSearchAction}>查询</Form.Submit>
              </FormItem>
            </Form>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={paginationProps}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
});
export default injectIntl(openSearch);
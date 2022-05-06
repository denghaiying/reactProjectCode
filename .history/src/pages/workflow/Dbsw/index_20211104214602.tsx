import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';

import YhService from '@/services/system/yh/YhService';

import { Col, Form, Input, Row, DatePicker, Select, TreeSelect, Radio, Button, Tooltip } from 'antd';
import { EpsSource, ITable, ITitle, ITree, MenuData } from '@/eps/commons/declare';
import { observer, useLocalObservable } from 'mobx-react';
import { history } from 'umi';
import YhStore from "@/stores/system/YhStore";


import DwTableLayout from '@/eps/business/DwTableLayout';
import fetch from "../../../utils/fetch";
import EpsReportButton from '@/eps/components/buttons/EpsReportButton';
import SysStore from '@/stores/system/SysStore';
import WfdefTreeService from "@/pages/workflow/Dbsw/WfdefTreeService";
import DbswService from "@/pages/workflow/Dbsw/DbswService";
import moment from "moment";
import HandleSW from "@/pages/workflow/Dbsw/HandleSW";
import { WalletOutlined } from '@ant-design/icons';
const FormItem = Form.Item;
const { Search } = Input;


const tableProp: ITable = {
  tableSearch: false,
  disableAdd: true,
  disableEdit: true,
  disableDelete: true,
  disableCopy: true,
  // rowSelection: {
  //   type: 'radio',
  // }
}


const treeProp: ITree = {
  treeSearch: true,
  treeCheckAble: false
}



const Dbsw = observer((props) => {
  const { record = {} } = props;

  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const [umid, setUmid] = useState('');

  const [searchCondition, setSearchCondition] = useState('');
  const [radioValue, setRadioValue] = useState('1');

  const ref = useRef();

  const [tableStore, setTableStore] = useState<EpsTableStore>(new EpsTableStore(DbswService));

  const dbswStore = useLocalObservable(() => ({
    params: {},
    dbswTotal: 0,
    returnTotal: 0,
    AllTotal: 0,
    value: '1',
    search: "",

    async queryDbswCount(treeid) {

      const response = await fetch.post(`/eps/workflow/dbsw/queryForCount`,
        this.params,
        {
          params: {
            sqr: "",
            sqbm: "",
            wfid: treeid,
            value: 1,
            search: searchCondition,
            ...this.params,
          },
        },
      );
      if (response.status === 200) {
        this.dbswTotal = response.data;
      }
    },

    async queryReturnCount(treeid) {

      const response = await fetch.post(`/eps/workflow/dbsw/queryForCount`,
        this.params,
        {
          params: {
            sqr: "",
            sqbm: "",
            wfid: treeid,
            value: 2,
            search: searchCondition,
            ...this.params,
          },
        },
      );
      if (response.status === 200) {
        this.returnTotal = response.data;
      }
    },

    async queryAllCount(treeid) {

      const response = await fetch.post(`/eps/workflow/dbsw/queryForCount`,
        this.params,
        {
          params: {
            sqr: "",
            sqbm: "",
            wfid: treeid,
            search: searchCondition,
            ...this.params,
          },
        },
      );
      if (response.status === 200) {
        this.AllTotal = response.data;
      }
    },



  }));


  useEffect(() => {
    //  dbswStore.queryDbswCount();
    setUmid('WORKFLOW0002')
    setTableStore(ref.current?.getTableStore())
  }, []);



  useEffect(() => {
    dbswStore.queryDbswCount(tableStore?.key);
    dbswStore.queryAllCount(tableStore?.key);
    dbswStore.queryReturnCount(tableStore?.key);
  }, [tableStore?.key])



  const source: EpsSource[] = [
    // {
    //       title: '处理任务',
    //       code: 'opticon',
    //       align: 'center',
    //       ellipsis: true,         // 字段过长自动东隐藏
    //       fixed: 'left',
    //       width: 150,
    //       formType: EpsFormType.Input
    //   },
    {
      title: '流程名称',
      code: 'wfname',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input
    }, {
      title: '流程状态',
      align: 'center',
      code: 'wpname',
      width: 120,
      formType: EpsFormType.Input,

    }, {
      title: '标题',
      code: 'title',
      align: 'center',
      width: 200,
      ellipsis: true,
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (record.state === "2") {
          return "[撤回]" + text;
        } else if (record.state === "3") {
          return "[驳回]" + text;
        } else {
          return text;
        }

      },

    }, {
      title: '计划开始时间',
      code: 'pbegin',
      align: 'center',
      width: 150,
      formType: EpsFormType.DatePicker
    }, {
      title: "计划结束时间",
      code: 'pend',
      align: 'center',
      width: 150,
      formType: EpsFormType.DatePicker,


    }, {
      title: "待处理人",
      code: "awaiter",
      align: 'center',
      width: 150,
      formType: EpsFormType.Input
    }]

  const title: ITitle = {
    name: '待办事务'
  }


  const handleSw = (text, record, index, store) => {
    history.push({ pathname: `/${record.mkurl}/${record.gnurl}`, query: { umname: record.wfname, wfinst:record.wfinst } });
  }

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {

    return (
      [
        <Tooltip title="处理任务">
          <Button size="small" style={{ fontSize: '12px' }} type={'primary'} shape="circle" icon={<WalletOutlined />} onClick={() => handleSw(text, record, index, store)} />
        </Tooltip>
      ]
    );
  }




  const onSearchChange = (val) => {
    setSearchCondition(val.target.value);
  };

  // const span = 24;
  const _width = 240

  // 自定义查询按钮
  const customAction = (store: EpsTableStore) => {
    return ([
      <>


        <div>
          <Row gutter={20}>
            <Col span={12}>
              <Radio.Group
                defaultValue={radioValue}
              >
                <Radio.Button value="0" onClick={() => { setRadioValue("0"); store.findByKey(store.key, 1, store.size, { value: 0 }) }}>全部({dbswStore.AllTotal})</Radio.Button>
                <Radio.Button value="1" onClick={() => { setRadioValue("1"); store.findByKey(store.key, 1, store.size, { value: 1 }) }}>待处理({dbswStore.dbswTotal})</Radio.Button>
                <Radio.Button value="2" onClick={() => { setRadioValue("2"); store.findByKey(store.key, 1, store.size, { value: 2 }) }}>被退回({dbswStore.returnTotal})</Radio.Button>
              </Radio.Group>
            </Col>
            <Col span={12} >
              {/* <Input

                    allowClear
                    name="search"
                    placeholder="请输入搜索条件"
                    onChange={onSearchChange}
                  ></Input>
                  </Col>
                <Col span={3}>
                  <Button type="primary" onClick={()=>{store.findByKey(store.key, 1, store.size, {value:radioValue,search:searchCondition})}}>
                    查询
                  </Button> */}
              <Search name="search" placeholder="请输入搜索内容"
                style={{ width: 300, marginRight: 10 }}
                onSearch={(val) => { store.findByKey(store.key, 1, store.size, { value: radioValue, search: val }) }} />

            </Col>
          </Row>
        </div>
      </>
    ])
  }


  return (
    <>

      <EpsPanel title={title}                            // 组件标题，必填
        source={source}                          // 组件元数据，必填
        treeProp={treeProp}                      // 左侧树 设置属性,可选填
        treeService={WfdefTreeService}                  // 左侧树 实现类，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={DbswService}                 // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        tableRowClick={(record) => console.log('abcef', record)}
        //      searchForm={searchFrom}
        //     customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </EpsPanel>
    </>
  );
})

export default Dbsw;

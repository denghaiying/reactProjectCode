import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Modal,
  message,
  Row,
  Col,
} from 'antd';
import StlqService from '@/services/daly/stlq/StlqService';
import SysStore from '@/stores/system/SysStore';
import NewDajyStore from '@/stores/daly/NewDajyStore';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
/**
 * 获取当前用户
 */
const yhid = SysStore.getCurrentUser().id;
const gnid = 'DALY017';

/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  tableSearch: false,
  disableCopy: true,
  disableAdd: true,
  disableEdit: true,
  disableDelete: true,
  rowSelection: { type: 'checkbox' },
};

// 自定义编辑表单

const customForm = () => {
  return (
    <>
      {/* <Form.Item label="近义词:" name="jyc" required rules={[{ required: true, message: '请输入近义词' }, { max: 10, message: '编号长度不能大于10个字符', }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="关键词:" name="gjc" required rules={[{ required: true, message: '请输入关键词' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj" initialValue={getDate}>
        <Input disabled style={{ width: 300 }} />
      </Form.Item> */}
    </>
  );
};

function stlq() {
  const [initParams, setInitParams] = useState({
    lx: 0,
    yhid: yhid,
    gnid: gnid,
  });
  const [examine_visible, setExamineVisible] = useState(false);

  const ref = useRef();
  useEffect(() => {
    NewDajyStore.queryStckZt();
    OptrightStore.getFuncRight('DALY057');
  }, []);

  const source: EpsSource[] = [
    {
      title: '所属档案库',
      code: 'dakmc',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '类型',
      code: 'gjc',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
      render: () => {
        return NewDajyStore.selectcklx === '0' ? '待出库' : '待领取';
      },
    },
    {
      title: '借阅单号',
      code: 'jydid',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '申请人',
      code: 'yhmc',
      align: 'center',
      width: 80,
      formType: EpsFormType.Input,
    },
    {
      title: '申请时间',
      code: 'sqrq',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '出库时间',
      code: 'whsj',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '题名',
      code: 'tm',
      align: 'center',
      width: 120,
      formType: EpsFormType.Input,
    },
    {
      title: '详细信息',
      code: 'tmxxxx',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input,
    },
    {
      title: '手机号',
      code: 'sj',
      align: 'center',
      width: 80,
      formType: EpsFormType.Input,
    },
    // {
    //   title: '单位编号',
    //   code: 'whsj',
    //   align: 'center',
    //   width: 80,
    //   formType: EpsFormType.Input
    // },

    {
      title: '单位名称',
      code: 'dwmc',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '部门',
      code: 'bm',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '利用目的',
      code: 'lymd',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '借阅说明',
      code: 'bz',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '领取说明',
      code: 'whsj',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '借阅类型',
      code: 'jylx',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
      render: (text) => {
        if (text === 1) {
          return (text = '电子借阅');
        } else {
          return (text = '实体借阅');
        }
      },
    },
    {
      title: '全宗号',
      code: 'qzh',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '全宗名称',
      code: 'qzmc',
      align: 'center',
      width: 120,
      formType: EpsFormType.Input,
    },
    {
      title: '档号',
      code: 'whsj',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '密级',
      code: 'mj',
      align: 'center',
      width: 60,
      formType: EpsFormType.Input,
    },
    {
      title: '保管期限',
      code: 'bgqx',
      align: 'center',
      width: 70,
      formType: EpsFormType.Input,
    },
    {
      title: '归档部门',
      code: 'whsj',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '条形码',
      code: 'whsj',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
  ];
  const title = {
    name: '实体出库',
  };

  const searchFrom = () => {
    return (
      <>
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <FormItem style={{ width: 400 }} label="借阅单号:" name="cx_jydh">
              <Input placeholder="请输入借阅单号" allowClear />
            </FormItem>
          </Col>
          <Col className="gutter-row" span={6}>
            <FormItem style={{ width: 400 }} label="申请人:" name="cx_jyr">
              <Input placeholder="请输入申请人" allowClear />
            </FormItem>
          </Col>
          <Col className="gutter-row" span={6}>
            <FormItem style={{ width: 400 }} label="手机号:" name="cx_sj">
              <Input placeholder="请输入手机" allowClear />
            </FormItem>
          </Col>
          <Col className="gutter-row" span={6}>
            <FormItem style={{ width: 400 }} label="日期:" name="datebe">
              <RangePicker />
            </FormItem>
          </Col>
          <Col className="gutter-row" span={6}>
            <FormItem style={{ width: 400 }} label="档号:" name="cx_dh">
              <Input placeholder="请输入档号" allowClear />
            </FormItem>
          </Col>
          <Col className="gutter-row" span={6}>
            <FormItem style={{ width: 400 }} label="密级:" name="cx_mj">
              <Input placeholder="请输入密级" allowClear />
            </FormItem>
          </Col>
          <Col className="gutter-row" span={6}>
            <FormItem style={{ width: 400 }} label="保管期限:" name="cx_bgqx">
              <Input placeholder="请输入保管期限" allowClear />
            </FormItem>
          </Col>
          <Col className="gutter-row" span={6}>
            <FormItem style={{ width: 400 }} label="题名:" name="cx_tm">
              <Input placeholder="请输入题名" allowClear />
            </FormItem>
          </Col>
        </Row>
      </>
    );
  };
  /**
   * 查询
   * @param {*} current
   */
  const OnSearch = (values: any, store: EpsTableStore) => {
    NewDajyStore.selectcklx = values.lx;
    store && store.findByKey(store.key, 1, store.size, values);
  };

  const check_onPut_Lq = async (values, store) => {
    if (values.length >= 1) {
      setExamineVisible(true);
      console.log('values', values);
    } else {
      message.error('请至少选择一行数据!');
    }
  };

  const check_onPut_TmLq = async (values, store) => {
    if (values.length >= 1) {
      //setExamineVisible(true);
      console.log('values', values);
    } else {
      message.error('请至少选择一行数据!');
    }
  };

  const check_onPut_DzBqTmLq = async (values, store) => {
    if (values.length >= 1) {
      //setExamineVisible(true);
      console.log('values', values);
    } else {
      message.error('请至少选择一行数据!');
    }
  };

  const check_onPut_DzBqHzLq = async (values, store) => {
    if (values.length >= 1) {
      //setExamineVisible(true);
      console.log('values', values);
    } else {
      message.error('请至少选择一行数据!');
    }
  };

  const getLqsm = (val) => {
    NewDajyStore.lqsm = val.target.value;
  };
  /**
   * 提交多选
   */
  const onPut_Examine = async (store, ids) => {
    if (ids.length >= 1) {
      NewDajyStore.stlqghspzt = '1';
      NewDajyStore.stlqghop = '实体出库';
      NewDajyStore.stlqghdazt = '出库待领取';
      for (var i = 0; i < ids.length; i++) {
        await NewDajyStore.updateStck(ids[i]);
        setExamineVisible(false);
        await store.findByKey(store.key, 1, store.size, store.params);
      }
    }
    //调用审核方法
    // const response = await RunningLogStore.checkLog();
    // if (response.status = 200) {
    //     message.success('操作成功');
    //     setExamineVisible(false)
    //     await store.findByKey(store.key, 1, store.size, store.params);
    // } else {
    //     message.error('操作失败');
    //     setExamineVisible(false)
    //     await store.findByKey(store.key, 1, store.size, store.params);
    // }
  };

  // 自定义查询按钮
  const customAction = (store: EpsTableStore, ids: any[]) => {
    return [
      <>
        <Form
          layout="inline"
          style={{ width: '100vw' }}
          onFinish={(value) => OnSearch(value, store)}
          initialValues={{ lx: '0', yhid: yhid, gnid: gnid }}
        >
          <Form.Item label="" className="form-item" name="lx">
            <Select
              placeholder="类型"
              style={{ width: 180 }}
              className="ant-select"
              options={NewDajyStore.stcklx}
            />
          </Form.Item>

          <Form.Item label="" className="form-item" name="name">
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item label="" className="form-item" name="yhid">
            <input type="hidden"></input>
          </Form.Item>
          <Form.Item label="" className="form-item" name="gnid">
            <input type="hidden"></input>
          </Form.Item>
        </Form>
        &nbsp;&nbsp;
        {OptrightStore.hasRight('DALY057', 'SYS101')&&
        <Button
          className="form-item"
          type="primary"
          disabled={NewDajyStore.selectcklx === '0' ? false : true}
          onClick={() => check_onPut_Lq(ids, store)}
        >
          出库
        </Button>}
        {/* <Button className="form-item" type="primary" onClick={() => check_onPut_TmLq(ids, store)}>
          条码领取
        </Button>
        <Button className="form-item" type="primary" onClick={() => check_onPut_DzBqTmLq(ids, store)}>
          电子标签条目领取
        </Button>
        <Button className="form-item" type="primary" onClick={() => check_onPut_DzBqHzLq(ids, store)}>
          电子标签盒子领取
        </Button> */}
        <Modal
          title={<span className="m-title">请输出库说明:</span>}
          visible={examine_visible}
          onOk={() => {
            onPut_Examine(store, ids), ref.current?.clearTableRowClick();
          }}
          onCancel={() => setExamineVisible(false)}
        >
          <Form className="schedule-form" name="shForm">
            <FormItem label="说明:" name="note">
              <Input.TextArea
                name="note"
                onChange={(val) => getLqsm(val)}
                style={{ width: '500px' }}
                rows={4}
              />
            </FormItem>
          </Form>
        </Modal>
      </>,
    ];
  };
  return (
    <EpsPanel
      title={title} // 组件标题，必填
      source={source} // 组件元数据，必填
      ref={ref}
      tableProp={tableProp} // 右侧表格设置属性，选填
      tableService={StlqService} // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      //tableRowClick={(record) => console.log('abcef', record)}
      searchForm={searchFrom}
      customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      customAction={customAction} // 自定义全局按钮（如新增、导入、全局打印等），选填
    ></EpsPanel>
  );
}

export default stlq;

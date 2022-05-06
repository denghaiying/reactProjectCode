import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { Form, Input, Button, Modal, notification, message } from 'antd';
import EsFieldConfService from '@/services/base/esFieldConf/EsFieldConfService';
import SysStore from '@/stores/system/SysStore';
import { NodeCollapseOutlined, FrownOutlined, SmileOutlined, InteractionOutlined, ProfileOutlined, UserOutlined } from "@ant-design/icons";
import moment from 'moment';
import { await } from '@umijs/deps/compiled/signale';
const FormItem = Form.Item;
/**
 * 获取当前用户
 */
const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  tableSearch: false,
  disableCopy: true,
}

// 自定义表单


const customForm = () => {

  return (
    <>

      <Form.Item label="编号:" name="esCode" required rules={[{ required: true, message: '请输入编号' }, { max: 10, message: '编号长度不能大于10个字符', }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="名称:" name="esName" required rules={[{ required: true, message: '请输入名称' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="类型:" name="esType" initialValue="String" required rules={[{ required: true, message: '请输入类型' }]}>
        <Input allowClear style={{ width: 300 }} disabled />
      </Form.Item>
      <Form.Item label="系统字段:" name="esSource" required rules={[{ required: true, message: '请输入系统字段' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>

      <Form.Item label="维护人:" name="whr" >
        <Input disabled defaultValue={yhmc} style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj" >
        <Input disabled defaultValue={getDate} style={{ width: 300 }} />
      </Form.Item>
      {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
    </>
  )
}

function esFieldConf() {
  const [initParams, setInitParams] = useState({})
  const [isModalVisible, setIsModalVisible] = useState(false);

  const ref = useRef();
  useEffect(() => {

  }, []);

  const source: EpsSource[] = [
    {
      title: '编号',
      code: 'esCode',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '名称',
      code: 'esName',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '类型',
      code: 'esType',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '系统字段',
      code: 'esSource',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
    }
  ]
  const title = {
    name: '全文检索字段配置'
  }

  const searchFrom = () => {
    return (
      <>
        <FormItem label="编号" className="form-item" name="esCode"><Input placeholder="请输入编号" /></FormItem >
        <FormItem label="名称" className="form-item" name="esName"><Input placeholder="请输入名称" /></FormItem >
        <FormItem label="系统字段" className="form-item" name="esSource"><Input placeholder="请输入系统字段" /></FormItem >
      </>
    )
  }


  /**
    * 查询
    * @param {*} current
    */
  const OnSearch = (values: any, store: EpsTableStore) => {
    store && store.findByKey(store.key, 1, store.size, values);
  };



  const showModal = () => {
    setIsModalVisible(true);
  };



  const handleOk = async () => {
    if (pwd && pwd === "khzb") {
      message.success("请耐心等待,正在重新创建索引...")
      const res = await EsFieldConfService.restoreIndex();
      debugger
      var val = res.msg;

      notification.open({
        message: '通知',
        description: val,
        duration: 30,
        icon: <SmileOutlined style={{ color: 'green' }} />,
      });


    } else {
      notification.open({
        message: '通知',
        description: "密码错误,请重试!",
        duration: 20,
        icon: <FrownOutlined style={{ color: 'red' }} />,
      });
    }
    setIsModalVisible(false);
  };
  var pwd = "";
  const handleInput = (val) => {
    pwd = val.target.value;
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const search_all = async () => {
    var res = EsFieldConfService.searchAll();
    console.log("全部结果为", res)
    message.success(res);
  };
  const search_qwjs_index = async () => {
    var res = EsFieldConfService.searchQwjs_index();
    message.success(res);
    console.log("qwjs_index结果为", res)
  };

  // 自定义查询按钮
  const customAction = (store: EpsTableStore) => {
    return ([
      <>

          <Button type="primary" onClick={() => search_all()} icon={<ProfileOutlined />} >查看所有索引</Button>
          <Button type="primary" onClick={() => search_qwjs_index()} icon={<NodeCollapseOutlined />} >根据索引查询</Button>
          <Button type="primary" onClick={() => showModal()} icon={<InteractionOutlined />} danger>重新创建索引</Button>


        <Modal title="重要说明:"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}>
          <p>该功能将会删除ES数据库并重新建立新索引,如果继续请输入执行密码:</p>
          <Input placeholder="请输入执行密码" allowClear prefix={<UserOutlined />} onChange={(val) => handleInput(val)} />
        </Modal>

      </>
    ])
  }



  return (
    <EpsPanel
      title={title}                            // 组件标题，必填
      source={source}                          // 组件元数据，必填
      //treeService={DwService}                  // 左侧树 实现类，必填
      ref={ref}
      tableProp={tableProp}                    // 右侧表格设置属性，选填
      tableService={EsFieldConfService}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      tableRowClick={(record) => console.log('abcef', record)}
      searchForm={searchFrom}
      customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>
  );
}

export default esFieldConf;

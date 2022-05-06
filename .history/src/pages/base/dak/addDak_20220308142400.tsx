import React, { useEffect, useState } from 'react';
import {
  Input,
  message,
  Form,
  Tooltip,
  Modal,
  Button,
  Select,
  Switch,
  Col,
  Row,
} from 'antd';
import SysStore from '../../../stores/system/SysStore';
import { PlusCircleTwoTone } from '@ant-design/icons';
import { observer, useLocalObservable } from 'mobx-react';

import fetch from '../../../utils/fetch';
import moment from 'moment';
import DakService from '@/services/base/dak/DakService';

const addDak = observer((props) => {
  const FormItem = Form.Item;
  const [form] = Form.useForm();

  /**
   * 下拉框选择
   */
  const Option = Select.Option;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  /**
   * childStore
   */
  const dakStore = useLocalObservable(() => ({
    allMbData: [],
    allDzwjJkData:[],
    async queryMbList() {
      const response = await fetch.get(`/api/eps/control/main/mb/queryForPage`);
      if (response.status === 200) {
        if (response.data.length > 0) {
          for (var i = 0; i < response.data.length; i++) {
            let newKey = {};
            newKey = response.data[i];
            newKey.key = newKey.id;
            newKey.value = newKey.id;
            newKey.title = newKey.lable;
            this.allMbData.push(newKey);
          }
        }
        return;
      }
    },
    async queryMbDwList() {
      const response = await fetch.get(
        `/api/eps/control/main/mb/queryForPage?dwid=${props.record.dw}`,
      );
      if (response.status === 200) {
        if (response.data.length > 0) {
          for (var i = 0; i < response.data.length; i++) {
            let newKey = {};
            newKey = response.data[i];
            newKey.key = newKey.id;
            newKey.value = newKey.id;
            newKey.title = newKey.lable;
            this.allMbData.push(newKey);
          }
        }
        return;
      }
    },
    async queryDzwjJkList() {
      const response = await fetch.post(`/api/eps9/tyjk/jkpz/findForKey`,{qyusing:'Y',type:2});
      if (response.status === 200) {
          if (response.data.length > 0) {
              let  SxData = response.data.map(o => ({ 'id': o.id, 'label':o.bh+"|"+o.name, 'value': o.id }));
              this.allDzwjJkData=SxData;
          }
          return;
      }
  },
  }));

  const [add_visible, setAddVisible] = useState(false);
  //点击后弹出页面
  const click = () => {
    //显示弹框页面
    setAddVisible(true);
  };
  //初始化加载数据
  useEffect(() => {
    form.resetFields();
    dakStore.queryMbList();
    dakStore.queryMbDwList();
    dakStore.queryDzwjJkList();
  }, []);

  const addFunction = async (values) => {
    DakService.addDak(values).then((res) => {
      message.success('档案库添加成功');
      props.store.findByKey(
        props.store.key,
        1,
        props.store.size,
        props.store.params,
      );
      setAddVisible(false);
    });
  };

  const mbConfig = {
    rules: [{ required: true, message: '请选择模版' }],
  };
  const span = 12;

  return (
    <>
      <Tooltip title="新建档案库">
        <Button
          size="small"
          style={{ fontSize: '12px' }}
          type="primary"
          shape="circle"
          icon={<PlusCircleTwoTone />}
          onClick={() => click()}
        />
      </Tooltip>
      <Modal
        title={<span className="m-title">新建档案库</span>}
        visible={add_visible}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              values['dw'] = props.record.dw;
              values['whrid'] = SysStore.getCurrentUser().id;
              values['fid'] = props.record.id; //传递父ID
              addFunction(values);
            })
            .catch((info) => {});
        }}
        onCancel={() => setAddVisible(false)}
        width="1000px"
        style={{ height: 60 }}
      >
        <Form
          labelCol={{ span: 8 }}
          form={form}
          className="schedule-form"
          name="shForm"
          initialValues={{}}
        >
          <Row gutter={20}>
            <Col span={span}>
              <FormItem label="模板:" name="mbid" required {...mbConfig}>
                <Select
                  style={{ width: 250 }}
                  placeholder="请选择模板"
                  options={dakStore.allMbData}
                />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="名称:"
                name="mc"
                required
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input style={{ width: '250px' }} />
              </FormItem>
            </Col>

            <Col span={span}>
              <FormItem
                label="编码:"
                name="bh"
                required
                rules={[{ required: true, message: '请输入编码' }]}
              >
                <Input style={{ width: '250px' }} />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem label="序号:" name="xh">
                <Input style={{ width: '250px' }} disabled />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem label="物理表:" name="wlb">
                <Input style={{ width: '250px' }} disabled />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem label="条目数:" name="tms" initialValue={'50'}>
                <Input style={{ width: '250px' }} />
              </FormItem>
            </Col>

            <Col span={span}>
              <FormItem
                label="维护人:"
                name="whr"
                initialValue={SysStore.getCurrentUser().yhmc}
              >
                <Input disabled style={{ width: '250px' }} />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem label="维护时间:" name="whsj" initialValue={getDate}>
                <Input disabled style={{ width: '250px' }} />
              </FormItem>
            </Col>
            <Col span={span}>
                  <FormItem label="接口配置:" name="dzwjjkid">
                            <Select
                                    style={{ width: 250 }}
                                    placeholder="请选择接口"
                                    options={dakStore.allDzwjJkData}

                                />
                    </FormItem>
              </Col>
            <Col span={span}>
              <FormItem label="启用全文检索:" name="qwjs" initialValue={true}>
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  defaultChecked
                />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="新增时生成档号:"
                name="instdh"
                initialValue={false}
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="归入整编启用流程:"
                name="sjlc"
                initialValue={false}
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="档案归档启用流程:"
                name="gdlc"
                initialValue={false}
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem label="文件转换启用:" name="wjzh" initialValue={false}>
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem label="四性检测启用:" name="sxjc" initialValue={false}>
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem label="收集首页显示:" name="syxs" initialValue={false}>
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="整理首页显示:"
                name="zlsyxs"
                initialValue={false}
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="管理首页显示:"
                name="glsyxs"
                initialValue={false}
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem label="启用长期保存:" name="cqbc" initialValue={false}>
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="收集催收提醒:"
                name="sjcstx"
                initialValue={false}
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
});

export default addDak;

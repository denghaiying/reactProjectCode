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
import { ToolTwoTone } from '@ant-design/icons';
import { observer, useLocalObservable } from 'mobx-react';

import fetch from '../../../utils/fetch';
import moment from 'moment';
import DakService from '@/services/base/dak/DakService';

const updateDak = observer((props) => {
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
  const [DakData, setDakData] = useState<Array<{}>>([]);
  /**
   * childStore
   */
  const dakStore = useLocalObservable(() => ({
    DakData: '',
    allMbData: [],
    allDzwjJkData: [],
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

    async queryMbID() {
      const response = await fetch.get(
        `/api/eps/control/main/dak/queryForId?id=${props.record.id}`,
      );
      if (response.status === 200) {
        if (response && response.data) {
          setDakData(response.data);

          this.DakData = response.data;
          console.log('DakData++++1', this.DakData);
        }
        return;
      }
    },
    async queryDzwjJkList() {
      const response = await fetch.post(`/api/eps/lg/zjkjkpz/findForKey`, {
        qyusing: 'Y',
      });
      if (response.status === 200) {
        if (response.data.length > 0) {
          let SxData = response.data.map((o) => ({
            id: o.id,
            label: o.bh + '|' + o.name,
            value: o.id,
          }));
          this.allDzwjJkData = SxData;
        }
        return;
      }
    },
  }));
  const [add_visible, setAddVisible] = useState(false);
  //点击后弹出页面
  const click = () => {
    form.resetFields();
    dakStore.queryMbID();
    dakStore.queryMbList();
    dakStore.queryMbDwList();
    dakStore.queryDzwjJkList();
    //显示弹框页面
    setAddVisible(true);
  };
  //初始化加载数据
  useEffect(() => {
    form.resetFields();
    dakStore.queryMbID();
    dakStore.queryMbList();
    dakStore.queryMbDwList();
    dakStore.queryDzwjJkList();
  }, []);

  const updateFunction = async (values) => {
    debugger;
    await DakService.updateDak(values).then((res) => {
      if (res.success) {
        message.success('档案库修改成功');
        dakStore.queryMbID();
        setAddVisible(false);
      } else {
        message.error(res.message);
      }
    });
  };

  const mbConfig = {
    rules: [{ required: true, message: '请选择模版' }],
  };
  const span = 12;

  return (
    <>
      <Tooltip title="修改档案库">
        <Button
          size="small"
          style={{ fontSize: '12px' }}
          type="primary"
          shape="circle"
          icon={<ToolTwoTone />}
          onClick={() => click()}
        />
      </Tooltip>
      <Modal
        title={<span className="m-title">修改档案库</span>}
        visible={add_visible}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              values['id'] = props.record.id;
              values['dw'] = props.record.dw;
              values['whrid'] = SysStore.getCurrentUser().id;
              //values['fid'] = props.record.id;//传递父ID
              updateFunction(values);
            })
            .catch((info) => {
              message.success('档案库修改失败', info);
            });
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
        >
          <Row gutter={20}>
            <Col span={span}>
              <FormItem
                label="模板:"
                name="mbid"
                required
                {...mbConfig}
                initialValue={dakStore.DakData.mbid}
              >
                <Select
                  style={{ width: 250 }}
                  options={dakStore.allMbData}
                  disabled
                />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="名称:"
                name="mc"
                required
                rules={[{ required: true, message: '请输入名称' }]}
                initialValue={dakStore.DakData.mc}
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
                initialValue={dakStore.DakData.bh}
              >
                <Input style={{ width: '250px' }} />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="序号:"
                name="xh"
                initialValue={dakStore.DakData.xh}
              >
                <Input style={{ width: '250px' }} disabled />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="物理表:"
                name="mbc"
                initialValue={dakStore.DakData.mbc}
              >
                <Input style={{ width: '250px' }} disabled />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="条目数:"
                name="tms"
                initialValue={dakStore.DakData.tms}
              >
                <Input style={{ width: '250px' }} />
              </FormItem>
            </Col>

            <Col span={span}>
              <FormItem
                label="维护人:"
                name="whr"
                initialValue={dakStore.DakData.whr}
              >
                <Input disabled style={{ width: '250px' }} />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="维护时间:"
                name="whsj"
                initialValue={dakStore.DakData.whsj}
              >
                <Input disabled style={{ width: '250px' }} />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="接口配置:"
                name="dzwjjkid"
                initialValue={dakStore.DakData.dzwjjkid}
              >
                <Select
                  style={{ width: 250 }}
                  placeholder="请选择接口"
                  options={dakStore.allDzwjJkData}
                />
              </FormItem>
            </Col>
            <Col span={span}></Col>
            <Col span={span}>
              <FormItem
                label="启用全文检索:"
                name="qwjs"
                initialValue={dakStore.DakData.qwjs === 'Y'}
              >
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  // checked={DakData.qwjs === 'Y'}
                  defaultChecked={dakStore.DakData.qwjs === 'Y'}
                />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="新增时生成档号:"
                name="instdh"
                initialValue={dakStore.DakData.instdh === 'Y'}
              >
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  //checked={DakData.instdh === 'Y'}
                  defaultChecked={dakStore.DakData.instdh === 'Y'}
                />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="归入整编启用流程:"
                name="sjlc"
                initialValue={dakStore.DakData.sjlc === 'Y'}
              >
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  //checked={DakData.sjlc === 'Y'}
                  defaultChecked={dakStore.DakData.sjlc === 'Y'}
                />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="档案归档启用流程:"
                name="gdlc"
                initialValue={dakStore.DakData.gdlc === 'Y'}
              >
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  // checked={DakData.gdlc === 'Y'}
                  defaultChecked={dakStore.DakData.gdlc === 'Y'}
                />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="文件转换启用:"
                name="wjzh"
                initialValue={dakStore.DakData.wjzh === 'Y'}
              >
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  // checked={DakData.wjzh === 'Y'}
                  defaultChecked={dakStore.DakData.wjzh === 'Y'}
                />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="四性检测启用:"
                name="sxjc"
                initialValue={dakStore.DakData.sxjc === 'Y'}
              >
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  //checked={DakData.sxjc === 'Y'}
                  defaultChecked={dakStore.DakData.sxjc === 'Y'}
                />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="收集首页显示:"
                name="syxs"
                initialValue={dakStore.DakData.syxs === 'Y'}
              >
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  //checked={DakData.syxs === 'Y'}
                  defaultChecked={dakStore.DakData.syxs === 'Y'}
                />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="整理首页显示:"
                name="zlsyxs"
                initialValue={dakStore.DakData.zlsyxs === 'Y'}
              >
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  //checked={DakData.zlsyxs === 'Y'}
                  defaultChecked={dakStore.DakData.zlsyxs === 'Y'}
                />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="管理首页显示:"
                name="glsyxs"
                initialValue={dakStore.DakData.glsyxs === 'Y'}
              >
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  //checked={DakData.glsyxs === 'Y'}
                  defaultChecked={dakStore.DakData.glsyxs === 'Y'}
                />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="启用长期保存:"
                name="cqbc"
                initialValue={dakStore.DakData.cqbc === 'Y'}
              >
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  //checked={DakData.cqbc === 'Y'}
                  defaultChecked={dakStore.DakData.cqbc === 'Y'}
                />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="启用催收与统计:"
                name="sjcstx"
                initialValue={dakStore.DakData.sjcstx === 'Y'}
              >
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  defaultChecked={dakStore.DakData.sjcstx === 'Y'}
                  //checked={DakData.sjcstx === 'Y'}
                />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="长期保存中间库留痕:"
                name="cqbclh"
                initialValue={dakStore.DakData.cqbclh === 'Y'}
              >
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  defaultChecked={dakStore.DakData.cqbclh === 'Y'}
                />
              </FormItem>
            </Col>
            <Col span={span}>
              <FormItem
                label="资料库:"
                name="zlk"
                initialValue={dakStore.DakData.zlk === 'Y'}
              >
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  defaultChecked={dakStore.DakData.zlk === 'Y'}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
});

export default updateDak;

import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { useEffect, useRef, useState } from 'react';
import { Form, Input, Select, Card, Row, Col, Checkbox } from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import WldwService from './WldwService';
import moment from 'moment';
import SysStore from '../../../stores/system/SysStore';
import fetch from '../../../utils/fetch';
import e from 'express';

/**
 * 内部管理---往来单位维护页面
 */

const Wldw = observer((props) => {
  const ref = useRef();
  useEffect(() => {}, []);
  // 获取当前用户id,当前用户名称和维护时间
  const whr = SysStore.getCurrentUser().yhmc;
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');

  const WldwStore = useLocalObservable(() => ({
    //表单往来单位编号验证
    codeData: [],
    //表单往来单位名称验证
    nameData: [],
    dwflData: [
      { value: 'wldwkh', label: '客户' },
      { value: 'wldwgys', label: '供应商' },
    ],
  }));
  //按钮和查询框区域(新增、编辑、删除按钮默认可使用)
  const tableProp: ITable = {
    searchCode: 'wldwname',
    disableCopy: true,
    onAddClick: (form) => {
      WldwStore.codeData = [];
      WldwStore.nameData = [];
    },
    onEditClick: (form, record) => {
      WldwStore.codeData = record.wldwcode;
      WldwStore.nameData = record.wldwname;
    },
  };

  //高级搜索框
  const searchFrom = () => {
    return (
      <>
        <Form.Item label="单位名称" className="form-item" name="wldwname">
          <Input placeholder="请输入单位名称" />
        </Form.Item>
        <Form.Item label="单位分类" className="form-item" name="dwfl">
          <Select placeholder="请选择单位分类" options={WldwStore.dwflData} />
          {/* <Select.Option value="wldwkh">客户</Select.Option>
            <Select.Option value="wldwgys">供应商</Select.Option>
          </Select> */}
        </Form.Item>
      </>
    );
  };
  //表单名称
  const title: ITitle = {
    name: '往来单位维护',
  };

  //定义table表格字段
  const source: EpsSource[] = [
    {
      title: '单位编码',
      code: 'wldwcode',
      align: 'center',
      formType: EpsFormType.Input,
      width: 160,
    },
    {
      title: '单位名称',
      code: 'wldwname',
      align: 'center',
      formType: EpsFormType.Input,
      width: 300,
    },
    {
      title: '单位简称',
      code: 'wldwsname',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '法人代表',
      code: 'wldwfrdb',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '办公地址',
      code: 'wldwbgdz',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '客户',
      code: 'wldwkh',
      align: 'center',
      formType: EpsFormType.Checkbox,
      width: 80,
      render: (text, record, index) => {
        return <Checkbox checked={text} />;
      },
    },
    {
      title: '供应商',
      code: 'wldwgys',
      align: 'center',
      formType: EpsFormType.Checkbox,
      width: 80,
      render: (text, record, index) => {
        return <Checkbox checked={text} />;
      },
    },
    {
      title: '联系人',
      code: 'wldwlxr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '联系方式',
      code: 'wldwphone',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
    {
      title: '税号',
      code: 'wldwsh',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
    {
      title: '地址',
      code: 'wldwdz',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '电话',
      code: 'wldwtel',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
    {
      title: '开户行',
      code: 'wldwbak',
      align: 'center',
      formType: EpsFormType.Input,
      width: 140,
    },
    {
      title: '银行账号',
      code: 'wldwaccount',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '停用',
      code: 'wldwsfty',
      align: 'center',
      formType: EpsFormType.Checkbox,
      width: 80,
      render: (text, record, index) => {
        return <Checkbox checked={text} />;
      },
    },
    {
      title: '停用时间',
      code: 'wldwtyrq',
      align: 'center',
      formType: EpsFormType.Input,
      width: 160,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      width: 160,
    },
  ];
  // 自定义弹框表单
  const customForm = (text) => {
    //点击取消，清空onSftyChange赋的值
    const tyrqValue = text.getFieldValue('wldwsfty');
    if (tyrqValue === false) {
      text.setFieldsValue({ wldwtyrq: null });
    }

    //停用时间判断
    const onSftyChange = (value) => {
      if (value.target.checked === true) {
        text.setFieldsValue({ wldwsfty: true });
        text.setFieldsValue({
          wldwtyrq: moment().format('YYYY-MM-DD HH:mm:ss'),
        });
      } else {
        text.setFieldsValue({ wldwsfty: false });
        text.setFieldsValue({ wldwtyrq: null });
      }
    };

    //单位名称带出单位简称数据
    const inputOnchange = () => {
      const wldwnameValue = text.getFieldValue('wldwname');
      text.setFieldsValue({ wldwsname: wldwnameValue });
    };
    return (
      <>
        <Card title="单位信息" style={{ marginTop: '-36px' }}>
          <Row>
            <Col span={8}>
              <Form.Item
                label="单位编码:"
                name="wldwcode"
                validateFirst
                rules={[
                  { required: true, message: '请输入单位编码' },
                  { max: 20, message: '编码长度不能大于20个字符' },
                  {
                    async validator(_, value) {
                      if (WldwStore.codeData === value) {
                        return Promise.resolve();
                      }
                      const param = {
                        params: { wldwcode: value, source: 'add' },
                      };
                      await fetch
                        .get('/api/eps/nbgl/wldw/list/', { params: param })
                        .then((res) => {
                          if (res.data.length === 0) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject(
                              new Error('此单位编号已存在，请重新输入!'),
                            );
                          }
                        });
                    },
                  },
                ]}
              >
                <Input allowClear style={{ width: 250 }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="单位名称:"
                name="wldwname"
                validateFirst
                rules={[
                  { required: true, message: '请输入单位名称' },
                  {
                    async validator(_, value) {
                      if (WldwStore.nameData === value) {
                        return Promise.resolve();
                      }
                      const param = {
                        params: { wldwname: value, source: 'add' },
                      };
                      await fetch
                        .get('/api/eps/nbgl/wldw/list/', { params: param })
                        .then((res) => {
                          if (res.data.length === 0) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject(
                              new Error('此单位名称已存在，请重新输入!'),
                            );
                          }
                        });
                    },
                  },
                ]}
              >
                <Input
                  allowClear
                  style={{ width: 250 }}
                  onChange={inputOnchange}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="单位简称:"
                name="wldwsname"
                required
                rules={[{ required: true, message: '请输入单位简称' }]}
              >
                <Input allowClear style={{ width: 250 }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label="法人代表:" name="wldwfrdb">
                <Input allowClear style={{ width: 250 }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="客户:"
                name="wldwkh"
                valuePropName="checked"
                dependencies={['wldwgys']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      debugger;
                      if (
                        (value !== undefined ||
                          getFieldValue('wldwgys') !== undefined) &&
                        (value == true || getFieldValue('wldwgys') == true)
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject('请至少选择一个单位分类');
                    },
                  }),
                ]}
              >
                <Checkbox />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="供应商:"
                name="wldwgys"
                valuePropName="checked"
                dependencies={['wldwkh']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (
                        (getFieldValue('wldwkh') !== undefined ||
                          value !== undefined) &&
                        (value == true || getFieldValue('wldwkh') == true)
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject('请至少选择一个单位分类');
                    },
                  }),
                ]}
              >
                <Checkbox />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label="办公地址:" name="wldwbgdz">
                <Input allowClear style={{ width: 250 }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="联系人:" name="wldwlxr">
                <Input allowClear style={{ width: 250 }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="联系方式:"
                name="wldwphone"
                rules={[
                  {
                    pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                    message: '请输入正确的手机号',
                  },
                ]}
              >
                <Input allowClear style={{ width: 250 }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label="维护人:" name="whr">
                <Input
                  allowClear
                  disabled
                  defaultValue={whr}
                  style={{ width: 250 }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="维护时间:" name="whsj">
                <Input
                  allowClear
                  defaultValue={whsj}
                  disabled
                  style={{ width: 250 }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="开票信息">
          <Row>
            <Col span={8}>
              <Form.Item label="税号:" name="wldwsh">
                <Input allowClear style={{ width: 250 }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="地址:" name="wldwdz">
                <Input allowClear style={{ width: 250 }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="电话:" name="wldwstel">
                <Input allowClear style={{ width: 250 }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label="开户行:" name="wldwbak">
                <Input allowClear style={{ width: 250 }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="银行账号:" name="wldwaccount">
                <Input allowClear style={{ width: 250 }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="停用:" name="wldwsfty" valuePropName="checked">
                <Checkbox onChange={onSftyChange} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label="停用时间:" name="wldwtyrq">
                <Input allowClear style={{ width: 250 }} disabled />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </>
    );
  };

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={WldwService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        formWidth={1200} //弹框表单宽度
        searchForm={searchFrom} //高级搜索查询框
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      ></EpsPanel>
    </>
  );
});

export default Wldw;

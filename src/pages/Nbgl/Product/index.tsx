import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { useEffect, useRef, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import ProductService from './ProductService';
import SysStore from '../../../stores/system/SysStore';
import moment from 'moment';
import fetch from '../../../utils/fetch';
/**
 * 内部管理---产品维护
 */

const Product = observer((props) => {
  const ref = useRef();

  // 获取当前用户名称和维护时间
  const whr = SysStore.getCurrentUser().yhmc;
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');
  // 产品维护的本地store
  const ProductStore = useLocalObservable(() => ({
    //表单产品编号验证
    codeData: [],
    //表单产品名称验证
    nameData: [],

    //负责人数据源
    yhData: [],
    yhSelectData: [],
    yhDataSource: [],
    productFzr: '',

    //查询用户数据
    async findYhData(params) {
      const response = await fetch.get(
        '/api/eps/control/main/yh/queryForList',
        { params },
      );
      if (response.status === 200) {
        if (response.data.length > 1) {
          //查询全部用户数据
          this.yhData = response.data;
          this.yhSelectData = response.data.map((item) => ({
            value: item.id,
            label: item.yhmc,
          }));
        }

        //根据用户id查询用户数据
        if (params.hasOwnProperty('id')) {
          this.productFzr = response.data[0].yhmc;
        }
      }
    },
  }));
  useEffect(() => {
    ProductStore.findYhData({});
  }, []);

  //按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    searchCode: 'productName',
    disableCopy: true,
    onEditClick: (form, record) => {
      ProductStore.codeData = record.productCode;
      ProductStore.nameData = record.productName;
    },
    onAddClick: (form) => {
      ProductStore.codeData = [];
      ProductStore.nameData = [];
    },
  };

  //表单名称
  const title: ITitle = {
    name: '产品维护',
  };

  //定义table表格字段
  const source: EpsSource[] = [
    {
      title: '产品编号',
      code: 'productCode',
      align: 'center',
      formType: EpsFormType.Input,
      width: 160,
    },
    {
      title: '产品名称',
      code: 'productName',
      align: 'center',
      formType: EpsFormType.Input,
      width: 300,
    },
    {
      title: '负责人',
      code: 'productFzr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '产品说明',
      code: 'productRemark',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
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
  const customForm = (text, form) => {
    const onYhChange = (value, record) => {
      //根据用户id查询用户数据
      ProductStore.findYhData({ id: value }).then(() => {
        text.setFieldsValue({ productFzr: ProductStore.productFzr });
      });
    };
    return (
      <>
        <Form.Item
          label="产品编号:"
          name="productCode"
          validateFirst
          rules={[
            { required: true, message: '请输入产品编号' },
            { max: 20, message: '编号长度不能大于20个字符' },
            {
              async validator(_, value) {
                if (ProductStore.codeData === value) {
                  return Promise.resolve();
                }
                const param = { params: { productCode: value } };
                await fetch
                  .get('/api/eps/nbgl/product/list/', { params: param })
                  .then((res) => {
                    if (res.data.length === 0) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error('此产品编号已存在，请重新输入!'),
                      );
                    }
                  });
              },
            },
          ]}
        >
          <Input allowClear style={{ width: 250 }} />
        </Form.Item>
        <Form.Item
          label="产品名称:"
          name="productName"
          validateFirst
          rules={[
            { required: true, message: '请输入产品名称' },
            {
              async validator(_, value) {
                if (ProductStore.nameData === value) {
                  return Promise.resolve();
                }
                const param = { params: { productName: value, source: 'add' } };
                await fetch
                  .get('/api/eps/nbgl/product/list/', { params: param })
                  .then((res) => {
                    if (res.data.length === 0) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error('此产品名称已存在，请重新输入!'),
                      );
                    }
                  });
              },
            },
          ]}
        >
          <Input allowClear style={{ width: 250 }} />
        </Form.Item>
        <Form.Item
          label="负责人:"
          name="productFzrid"
          rules={[{ required: true, message: '请选择负责人' }]}
        >
          <Select
            allowClear
            style={{ width: 250 }}
            options={ProductStore.yhSelectData}
            onChange={onYhChange}
            showSearch
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
          />
        </Form.Item>
        <Form.Item label="产品说明:" name="productRemark">
          <Input.TextArea allowClear style={{ width: 250 }} />
        </Form.Item>
        <Form.Item label="维护人:" name="whr">
          <Input
            allowClear
            disabled
            defaultValue={whr}
            style={{ width: 250 }}
          />
        </Form.Item>
        <Form.Item label="维护时间:" name="whsj">
          <Input
            allowClear
            defaultValue={whsj}
            disabled
            style={{ width: 250 }}
          />
        </Form.Item>
        <Form.Item label="负责人名称:" name="productFzr" hidden>
          <Input allowClear style={{ width: 250 }} />
        </Form.Item>
      </>
    );
  };
  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={ProductService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        formWidth={500}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      ></EpsPanel>
    </>
  );
});

export default Product;

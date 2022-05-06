import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { useEffect, useRef, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import ModuleService from './ModuleService';
import SysStore from '../../../stores/system/SysStore';
import moment from 'moment';
import fetch from '../../../utils/fetch';
/**
 * 内部管理---模块维护
 */

const Module = observer((props) => {
  const ref = useRef();

  // 获取当前用户名称和维护时间
  const whr = SysStore.getCurrentUser().yhmc;
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');
  const [formDisabled, setDisabled] = useState(false);
  // 模块维护的本地store
  const ModuleStore = useLocalObservable(() => ({
    //表单模块编号验证
    codeData: [],
    //表单模块名称验证
    nameData: [],
    //负责人数据源
    yhData: [],
    yhSelectData: [],
    yhDataSource: [],
    moduleFzr: '',
    //产品数据源
    productSelectData: [],
    productData: [],
    //查询用户数据
    async findYhData(params) {
      const response = await fetch.get(
        '/api/eps/control/main/yh/queryForList',
        { params },
      );
      if (response.status === 200) {
        if (response.data.length > 0) {
          //查询全部用户数据
          this.yhData = response.data;
          this.yhSelectData = response.data.map((item) => ({
            value: item.id,
            label: item.yhmc,
          }));
        }

        //根据用户id查询用户数据
        if (params.hasOwnProperty('id')) {
          this.moduleFzr = response.data[0].yhmc;
        }
      }
    },
    //查询产品数据
    async findProductData() {
      const response = await fetch.get('/api/eps/nbgl/product/list/');
      if (response.status === 200) {
        if (response.data.length > 0) {
          //查询全部用户数据
          this.productData = response.data;
          this.productSelectData = response.data.map((item) => ({
            value: item.id,
            label: item.productName,
          }));
        }
      }
    },
  }));
  useEffect(() => {
    ModuleStore.findYhData({});
    ModuleStore.findProductData();
  }, []);

  //按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    defaultSize: 100,
    searchCode: 'moduleName',
    disableCopy: true,
    onEditClick: (form, record) => {
      setDisabled(true);
      ModuleStore.codeData = record.moduleCode;
      ModuleStore.nameData = record.moduleName;
    },
    onAddClick: (form) => {
      setDisabled(false);
      ModuleStore.codeData = [];
      ModuleStore.nameData = [];
    },
  };

  //表单名称
  const title: ITitle = {
    name: '模块维护',
  };

  //高级搜索框
  const searchFrom = () => {
    return (
      <>
        <Form.Item label="产品名称" className="form-item" name="productId">
          <Select
            placeholder="请选择产品"
            options={ModuleStore.productSelectData}
          />
        </Form.Item>
        <Form.Item label="模块编号" className="form-item" name="moduleCode">
          <Input placeholder="请输入模块编号" />
        </Form.Item>
        <Form.Item label="模块名称" className="form-item" name="moduleName">
          <Input placeholder="请输入模块名称" />
        </Form.Item>
      </>
    );
  };

  //定义table表格字段
  const source: EpsSource[] = [
    {
      title: '产品名称',
      code: 'productId',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
      render: (text, record, index) => {
        const result = ModuleStore.productData?.filter(
          (item) => item.id === text,
        );
        return result[0] ? result[0].productName : '';
      },
    },
    {
      title: '模块编号',
      code: 'moduleCode',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '模块名称',
      code: 'moduleName',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '模块类型',
      code: 'moduleType',
      align: 'center',
      formType: EpsFormType.Select,
      width: 100,
      render: (text, record, index) => {
        if (text === 'V') {
          return '虚模块';
        } else if (text === 'A') {
          return '平台模块';
        } else if (text === 'B') {
          return '普通模块';
        }
      },
    },
    {
      title: '负责人',
      code: 'moduleFzr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '模块说明',
      code: 'moduleRemark',
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
    let productId = '';
    productId = text.getFieldValue('productId');
    const onProductChange = (value, record) => {
      productId = value;
    };
    const onYhChange = (value, record) => {
      //根据用户id查询用户数据
      ModuleStore.findYhData({ id: value }).then(() => {
        text.setFieldsValue({ moduleFzr: ModuleStore.moduleFzr });
      });
    };

    return (
      <>
        <Form.Item
          label="产品名称:"
          name="productId"
          rules={[{ required: true, message: '请选择产品' }]}
        >
          <Select
            allowClear
            style={{ width: 250 }}
            options={ModuleStore.productSelectData}
            disabled={formDisabled}
            onChange={onProductChange}
          />
        </Form.Item>
        <Form.Item
          label="模块编号:"
          name="moduleCode"
          validateFirst
          rules={[
            { required: true, message: '请输入模块编号' },
            { max: 10, message: '编号长度不能大于10个字符' },
            {
              async validator(_, value) {
                if (ModuleStore.codeData === value) {
                  return Promise.resolve();
                }
                const param = {
                  params: {
                    moduleCode: value,
                    source: 'add',
                    productId: productId,
                  },
                };
                await fetch
                  .get('/api/eps/nbgl/module/list/', { params: param })
                  .then((res) => {
                    if (res.data.length === 0) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error('同一产品下模块编号已存在，请重新输入!'),
                      );
                    }
                  });
              },
            },
          ]}
        >
          <Input
            allowClear
            style={{ width: 250, textTransform: 'uppercase' }}
          />
        </Form.Item>
        <Form.Item
          label="模块名称:"
          name="moduleName"
          validateFirst
          rules={[
            { required: true, message: '请输入模块名称' },
            {
              async validator(_, value) {
                if (ModuleStore.nameData === value) {
                  return Promise.resolve();
                }
                const param = {
                  params: {
                    moduleName: value,
                    source: 'add',
                    productId: productId,
                  },
                };
                await fetch
                  .get('/api/eps/nbgl/module/list/', { params: param })
                  .then((res) => {
                    if (res.data.length === 0) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error('同一产品下模块名称已存在，请重新输入!'),
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
          label="模块类型:"
          name="moduleType"
          rules={[{ required: true, message: '请选择模块类型' }]}
        >
          <Select style={{ width: 250 }} allowClear>
            <Select.Option value="V">虚模块</Select.Option>
            <Select.Option value="A">平台模块</Select.Option>
            <Select.Option value="B">普通模块</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="负责人:" name="moduleFzrid">
          <Select
            allowClear
            style={{ width: 250 }}
            options={ModuleStore.yhSelectData}
            onChange={onYhChange}
            showSearch
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
          />
        </Form.Item>
        <Form.Item label="模块说明:" name="moduleRemark">
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
        <Form.Item label="负责人名称:" name="moduleFzr" hidden>
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
        tableService={ModuleService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        formWidth={500}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        searchForm={searchFrom} // 高级搜索
      ></EpsPanel>
    </>
  );
});

export default Module;

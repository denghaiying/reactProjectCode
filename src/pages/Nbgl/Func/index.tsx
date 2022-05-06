import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { useEffect, useRef, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import FuncService from './FuncService';
import SysStore from '../../../stores/system/SysStore';
import moment from 'moment';
import fetch from '../../../utils/fetch';
import { set } from 'mobx';
/**
 * 内部管理---功能维护
 */

const Func = observer((props) => {
  const ref = useRef();
  const [formDisabled, setDisabled] = useState(false);
  const [searchForm, setSearchForm] = useState();
  // 获取当前用户名称和维护时间
  const whr = SysStore.getCurrentUser().yhmc;
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');
  // 功能维护的本地store
  const FuncStore = useLocalObservable(() => ({
    //表单功能编号验证
    codeData: [],
    //表单功能名称验证
    nameData: [],
    //负责人数据源
    yhData: [],
    yhSelectData: [],
    yhDataSource: [],
    funcFzr: '',
    //产品数据源
    productSelectData: [],
    productData: [],
    //模块数据源
    moduleSelectData: [],
    moduleData: [],

    //产品id
    productId: [],
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
          this.funcFzr = response.data[0].yhmc;
        }
      }
    },
    //查询产品数据
    async findProductData() {
      const response = await fetch.get('/api/eps/nbgl/product/list/');
      if (response.status === 200) {
        if (response.data.length > 0) {
          this.productData = response.data;
          this.productSelectData = response.data.map((item) => ({
            value: item.id,
            label: item.productName,
          }));
        }
      }
    },
    //查询模块数据
    async findModuleData(value) {
      const param = { params: { productId: value } };
      const response = await fetch.get('/api/eps/nbgl/module/list/', {
        params: param,
      });
      if (response.status === 200) {
        if (value === null) {
          if (response.data.length > 0) {
            this.moduleData = response.data;
          }
        }
        if (param.params.hasOwnProperty('productId')) {
          this.moduleSelectData = response.data.map((item) => ({
            value: item.id,
            label: item.moduleName,
          }));
        }
      }
    },
  }));

  const [moduleSelectData, setModuleSelectData] = useState([]);
  useEffect(() => {
    FuncStore.findYhData({});
    FuncStore.findProductData();
    FuncStore.findModuleData(null);
  }, []);

  //按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    searchCode: 'funcName',
    disableCopy: true,
    onEditClick: (form, record) => {
      setDisabled(true);
      FuncStore.findModuleData(record.productId);
      FuncStore.codeData = record.funcCode;
      FuncStore.nameData = record.funcName;
      FuncStore.productId = record.productId;
    },
    onAddClick: (form) => {
      setDisabled(false);
      FuncStore.codeData = [];
      FuncStore.nameData = [];
    },
    // 高级搜索点击
    onSearchClick: (form, store) => {
      setSearchForm(form);
    },
  };

  //表单名称
  const title: ITitle = {
    name: '功能维护',
  };

  //高级搜索框
  const searchFrom = () => {
    return (
      <>
        <Form.Item label="产品名称" className="form-item" name="productId">
          <Select
            placeholder="请选择产品"
            options={FuncStore.productSelectData}
            showSearch
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            onChange={onProductChangeSearch}
          />
        </Form.Item>
        <Form.Item label="模块名称" className="form-item" name="moduleId">
          <Select
            placeholder="请选择模块"
            showSearch
            options={FuncStore.moduleSelectData}
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
          />
          {/* {moduleSelectData.map((item) => (
              <option value={item.value}>{item.label}</option>
            ))} */}
        </Form.Item>
        <Form.Item label="功能号" className="form-item" name="funcCode">
          <Input placeholder="请输入功能号" />
        </Form.Item>
        <Form.Item label="功能名称" className="form-item" name="funcName">
          <Input placeholder="请输入功能名称" />
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
        const result = FuncStore.productData?.filter(
          (item) => item.id === text,
        );
        return result[0] ? result[0].productName : '';
      },
    },
    {
      title: '模块名称',
      code: 'moduleId',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
      render: (text, record, index) => {
        const result = FuncStore.moduleData?.filter((item) => item.id === text);
        return result[0] ? result[0].moduleName : '';
      },
    },
    {
      title: '功能编号',
      code: 'funcCode',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '功能名称',
      code: 'funcName',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '功能类型',
      code: 'funcType',
      align: 'center',
      formType: EpsFormType.Select,
      width: 100,
      render: (text, record, index) => {
        if (text === 'F') {
          return '普通功能';
        } else if (text === 'W') {
          return '流程';
        } else if (text === 'V') {
          return '虚功能';
        }
      },
    },
    {
      title: '负责人',
      code: 'funcFzr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '功能说明',
      code: 'funcRemark',
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
  //切换产品时，过滤模块数据
  const onProductChangeSearch = async (value, record) => {
    FuncStore.findModuleData(value).then(() => {
      setModuleSelectData(FuncStore.moduleSelectData);
      FuncStore.moduleSelectData.length > 0 &&
        searchForm.setFieldsValue({
          moduleId: FuncStore.moduleSelectData[0].value,
        });
    });
  };

  // 自定义弹框表单
  const customForm = (text, form) => {
    let moduleId = '';
    moduleId = text.getFieldValue('moduleId');

    const onModuleChange = (value, record) => {
      moduleId = value;
    };

    const onYhChange = (value, record) => {
      text.setFieldsValue({ funcFzr: record.label, funcFzrid: value });
    };
    //切换产品时，过滤模块数据
    const onProductChange = (value, record) => {
      FuncStore.productId = value;
      FuncStore.findModuleData(value).then(() => {
        setModuleSelectData(FuncStore.moduleSelectData);
        FuncStore.moduleSelectData.length > 0 &&
          text?.setFieldsValue({
            moduleId: FuncStore.moduleSelectData[0].value,
          });
      });
    };
    return (
      <>
        <Form.Item
          label="产品名称:"
          name="productId"
          rules={[{ required: true, message: '请选择产品' }]}
          dependencies={['funcCode']}
        >
          <Select
            allowClear
            style={{ width: 250 }}
            options={FuncStore.productSelectData}
            showSearch
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            onChange={onProductChange}
            disabled={formDisabled}
          />
        </Form.Item>
        <Form.Item
          label="模块名称:"
          name="moduleId"
          rules={[{ required: true, message: '请选择模块' }]}
        >
          <Select
            allowClear
            style={{ width: 250 }}
            disabled={formDisabled}
            onChange={onModuleChange}
            showSearch
            options={FuncStore.moduleSelectData}
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
          />
        </Form.Item>
        <Form.Item
          label="功能编号:"
          name="funcCode"
          validateFirst
          dependencies={['productId']}
          rules={[
            { required: true, message: '请输入功能编号' },
            { max: 20, message: '编号长度不能大于20个字符' },
            {
              async validator(_, value) {
                if (FuncStore.codeData === value) {
                  return Promise.resolve();
                }
                const param = {
                  params: {
                    funcCode: value,
                    source: 'add',
                    productId: FuncStore.productId,
                  },
                };
                await fetch
                  .get('/api/eps/nbgl/func/list/', { params: param })
                  .then((res) => {
                    if (res.data.length === 0) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error('同一产品下功能编号已存在，请重新输入!'),
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
          label="功能名称:"
          name="funcName"
          validateFirst
          rules={[
            { required: true, message: '请输入功能名称' },
            {
              async validator(_, value) {
                if (FuncStore.nameData === value) {
                  return Promise.resolve();
                }
                const param = {
                  params: {
                    funcName: value,
                    source: 'add',
                    moduleId: moduleId,
                  },
                };
                await fetch
                  .get('/api/eps/nbgl/func/list/', { params: param })
                  .then((res) => {
                    if (res.data.length === 0) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error('同一模块下功能名称已存在，请重新输入!'),
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
          label="功能类型:"
          name="funcType"
          rules={[{ required: true, message: '请选择功能类型' }]}
        >
          <Select style={{ width: 250 }} allowClear>
            <Select.Option value="F">普通功能</Select.Option>
            <Select.Option value="W">流程</Select.Option>
            <Select.Option value="V">虚功能</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="负责人:" name="funcFzrid">
          <Select
            allowClear
            style={{ width: 250 }}
            options={FuncStore.yhSelectData}
            showSearch
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            onChange={onYhChange}
          />
        </Form.Item>
        <Form.Item label="功能说明:" name="funcRemark">
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
        <Form.Item label="负责人名称:" name="funcFzr" hidden>
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
        tableService={FuncService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        formWidth={500}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        searchForm={searchFrom} // 高级搜索
      ></EpsPanel>
    </>
  );
});

export default Func;

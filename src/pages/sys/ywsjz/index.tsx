import React, { useEffect } from 'react';
import DwTableLayout from '@/eps/business/DwTableLayout';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import RoleService from '@/services/system/YwsjzService';
import { Form, Input, Select, TreeSelect } from 'antd';
import RoleStore from '../../../stores/system/YwsjzStore';
import SearchStore from '../../../stores/datj/SearchStore';
const Option = Select.Option;
const FormItem = Form.Item;
import { observer, useLocalObservable } from 'mobx-react';
import copyRole from './copyRole';
import RoleUser from './roleUser';
import DwStore from '@/stores/system/DwStore';
import SysStore from '../../../stores/system/SysStore';
import fetch from '../../../utils/fetch';

const Role = observer((props) => {
  const childStore = useLocalObservable(() => ({
    //获取当前默认用户的角色
    roleCode: SysStore.getCurrentUser().golbalrole,
    dwTreeData: [],
    dwTotal: 0,
    async queryTreeDwList() {
      if (!this.dwTreeData || this.dwTreeData.length === 0) {
        if (this.roleCode === 'SYSROLE01' || this.roleCode === 'SYSROLE02') {
          const response = await fetch.get(
            `/api/eps/control/main/dw/queryForList_e9_superUser`,
          );
          if (response.status === 200) {
            //runInAction(() => {
            var sjData = [];
            if (response.data.length > 0) {
              for (var i = 0; i < response.data.length; i++) {
                let newKey = {};
                newKey = response.data[i];
                newKey.key = newKey.id;
                newKey.title = newKey.mc;
                sjData.push(newKey);
              }
              this.dwTreeData = sjData;
              this.dwTotal = sjData.length;
            }
            return;
            // });
          }
        } else {
          const response = await fetch.get(
            `/api/eps/control/main/dw/queryForListByYhid_ReactTree`,
          );
          if (response.status === 200) {
            //runInAction(() => {
            var sjData = [];
            if (response.data.length > 0) {
              for (var i = 0; i < response.data.length; i++) {
                let newKey = {};
                newKey = response.data[i];
                newKey.key = newKey.id;
                newKey.title = newKey.mc;
                sjData.push(newKey);
              }
              this.dwTreeData = sjData;
              this.dwTotal = sjData.length;
            }
            return;
            //});
          }
        }
      }
    },
  }));

  const tableProp: ITable = {
    searchCode: 'name',
    tableSearch: false,
    disableCopy: true,
    onAddClick: async (form) => await childStore.queryTreeDwList(),
    onEditClick: async (form) => await childStore.queryTreeDwList(),
    //onSearchClick:(form)=>RoleStore.queryTreeDwList(),
  };
  useEffect(() => {
    console.log('初始化++++');
    DwStore.queryForList();
  }, []);

  // 自定义表格行按钮
  const customTableAction = (text, record, index, store) => {
    return <>{[copyRole(text, record, index, store)]}</>;
  };

  const handleChange = (value) => {
    RoleStore.dw_id = value;
    SearchStore.dwChange(value);
  };

  // 自定义表单

  const customForm = () => {
    //自定义表单校验
    const dwConfig = {
      rules: [{ required: true, message: '请选择角色单位!' }],
    };

    const lxConfig = {
      rules: [{ required: true, message: '请选择!' }],
    };
    return (
      <>
        <Form.Item label="单位:" name="dwid" required {...dwConfig}>
          <TreeSelect
            style={{ width: 322 }}
            treeData={childStore.dwTreeData}
            placeholder="请选择单位"
            treeDefaultExpandAll
            allowClear
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          label="编号:"
          name="code"
          required
          rules={[{ required: true, message: '请输入编号' }]}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          label="名称:"
          name="name"
          required
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item label="是否停用:" name="tybz" initialValue="N">
          <Select style={{ width: 180, height: 30 }} id="tybz">
            <Option value="N">否</Option>
            <Option value="Y">是</Option>
          </Select>
        </Form.Item>

        <Form.Item label="维护人:" name="whr">
          <Input disabled defaultValue={RoleStore.yhmc} />
        </Form.Item>

        <Form.Item label="维护时间:" name="whsj">
          <Input defaultValue={RoleStore.getDate} disabled />
        </Form.Item>

        <Form.Item name="whrid">
          <Input defaultValue={RoleStore.yhid} hidden />
        </Form.Item>
      </>
    );
  };

  const source: EpsSource[] = [
    {
      title: '编号',
      code: 'code',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '单位',
      align: 'center',
      code: 'dwid',
      formType: EpsFormType.Select,
      render: (text) => {
        for (var i = 0; i < DwStore.dwList.length; i++) {
          var dw = DwStore.dwList[i];
          if (dw.id === text) {
            return dw.mc;
          }
        }
      },
    },
    {
      title: '停用',
      align: 'center',
      code: 'tybz',
      width: 80,
      formType: EpsFormType.Select,
      render: (text, record, index) => {
        return record.tybz == 'N' ? '否' : '是';
      },
    },
    {
      title: '停用日期',
      code: 'tyrq',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
    },
  ];

  const title = {
    name: '角色管理',
  };

  const searchFrom = () => {
    return (
      <>
        <FormItem label="角色编号" className="form-item" name="code">
          <Input placeholder="请输入编号" />
        </FormItem>
        <FormItem label="角色名称" className="form-item" name="name">
          <Input placeholder="请输入名称" />
        </FormItem>
      </>
    );
  };

  return (
    <>
      <DwTableLayout
        title={title} // 组件标题，必填
        // ref={ref}
        source={source} // 组件元数据，必填
        //   treeService={DwService}                  // 左侧树 实现类，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={RoleService} // 右侧表格实现类，必填
        formWidth={500}
        searchForm={searchFrom}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}
      ></DwTableLayout>
    </>
  );
});

export default Role;

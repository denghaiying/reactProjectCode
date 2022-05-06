import React, { useEffect, useState } from 'react';
import { runInAction } from 'mobx';
import {
  Input,
  message,
  Tooltip,
  Modal,
  Table,
  Button,
  Radio,
  TreeSelect,
  Switch,
} from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import OrgStore from '../../../stores/system/OrgStore';
import YhStore from '../../../stores/system/YhStore';
import SysStore from '../../../stores/system/SysStore';
import { EyeTwoTone } from '@ant-design/icons';
import { observer, useLocalObservable } from 'mobx-react';
import 'antd/dist/antd.css';
// import './index.less';
// import './add.less';
import './table.less';
import fetch from '../../../utils/fetch';
const { loading } = YhStore;
import update from 'immutability-helper';
const roleUser = observer((props) => {
  const { record = {} } = props;

  /**
   * childStore
   */
  const childStore = useLocalObservable(() => ({
    params: {},
    yhByRoleDataSource: [],
    yhByRoleDataTotal: 0,
    page_No: 1,
    page_Size: 50,
    role_Ids: [],
    value: '1',
    //全部
    syry: 'N',
    //已配置
    yfp: 'Y',
    //默认当前用户所在单位
    dw_id: SysStore.getCurrentCmp().id,
    //获取当前默认用户的角色
    roleCode: SysStore.getCurrentUser().golbalrole,
    //部门ID
    bm_id: '',
    //用户编码
    yh_code: '',
    //用户名称
    yh_name: '',
    setValue(value) {
      childStore.value = value;
    },
    async queryYhByRole() {
      if (this.yfp != 'null') {
        const response = await fetch.post(
          `/api/eps/control/main/yhrole/queryByRole`,
          childStore.params,
          {
            params: {
              page: childStore.page_No - 1,
              pageSize: childStore.page_Size,
              pageIndex: childStore.page_No - 1,
              limit: childStore.page_Size,
              roleid: childStore.role_Ids,
              dwid: childStore.dw_id,
              syry: 'N',
              yfp: childStore.yfp,
              bmid: childStore.bm_id,
              yhcode: childStore.yh_code,
              yhname: childStore.yh_name,
              ...childStore.params,
            },
          },
        );
        if (response && response.status === 200) {
          this.yhByRoleDataTotal = response.data.total;
          this.yhByRoleDataSource =
            response.data.results &&
            response.data.results.map((item) => {
              item.id = item.roleid + item.yhcode;
              // item.key = item.id;
              item.key = item.yhid;
              item.dwmc = this.dw_name;
              return item;
            });
          return;
        }
      } else {
        const response = await fetch.post(
          `/api/eps/control/main/yhrole/queryByRole`,
          childStore.params,
          {
            params: {
              page: childStore.page_No - 1,
              pageSize: childStore.page_Size,
              pageIndex: childStore.page_No - 1,
              limit: childStore.page_Size,
              roleid: childStore.role_Ids,
              dwid: childStore.dw_id,
              syry: 'N',
              bmid: childStore.bm_id,
              yhcode: childStore.yh_code,
              yhname: childStore.yh_name,
              ...childStore.params,
            },
          },
        );

        if (response && response.status === 200) {
          this.yhByRoleDataTotal = response.data.total;
          this.yhByRoleDataSource =
            response.data.results &&
            response.data.results.map((item) => {
              item.id = item.roleid + item.yhcode;
              // item.key = item.id;
              item.key = item.yhid;
              item.dwmc = this.dw_name;
              return item;
            });
          return;
        }
      }
    },
    orgData: [],
    org_page_No: 1,
    org_page_Size: 1,
    org_dw_id: SysStore.getCurrentCmp().id,
    async queryDwOrgTree() {
      const response = await fetch.get(
        `/api/eps/control/main/org/queryDwOrgTreeAntD?dwid=${this.org_dw_id}&pageIndex=${this.org_page_No}&pageSize=${this.org_page_Size}`,
      );
      if (response.status === 200) {
        //   runInAction(() => {
        this.orgData = response.data;
        console.log('部门在这里');
        return;
        //  });
      }
    },
    //单位名称
    dw_name: '',
    async queryForDwId(dwid) {
      const response = await fetch.get(
        `/api/eps/control/main/dw/queryForDwId?id=${dwid}`,
      );
      if (response.status === 200) {
        this.dw_name = response.data.mc;
        return;
      }
    },

    dwTreeData: [],
    async queryTreeDwList() {
      if (!this.dwTreeData || this.dwTreeData.length === 0) {
        if (this.roleCode === 'SYSROLE01' || this.roleCode === 'SYSROLE02') {
          const response = await fetch.get(
            `/api/eps/control/main/dw/queryForList_e9_superUser`,
          );
          if (response.status === 200) {
            runInAction(() => {
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
              }
              return;
            });
          }
        } else {
          const response = await fetch.get(
            `/api/eps/control/main/dw/queryForListByYhid_ReactTree`,
          );
          if (response.status === 200) {
            runInAction(() => {
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
              }
              return;
            });
          }
        }
      }
    },
  }));

  var role_id = record.id;
  /**
   * 状态单选按钮
   */
  const handleSizeChange = (val) => {
    childStore.role_Ids = record.id;

    if (val.target.value === '0') {
      childStore.syry = 'N';
      childStore.yfp = 'null';
      childStore.setValue(val.target.value);
      //每次查询初始化页数为 1
      childStore.page_No = 1;
      childStore.queryYhByRole();
    }
    if (val.target.value === '1') {
      childStore.yfp = 'Y';
      childStore.setValue(val.target.value);
      //每次查询初始化页数为 1
      childStore.page_No = 1;
      childStore.queryYhByRole();
    }
    if (val.target.value === '2') {
      childStore.yfp = 'N';
      childStore.setValue(val.target.value);
      //每次查询初始化页数为 1
      childStore.page_No = 1;
      childStore.queryYhByRole();
    }
  };
  const [add_visible, setAddVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectedRows, setCheckedRows] = useState<any>([]);
  //点击后初始化用户角色页面
  const click = () => {
    childStore.queryForDwId(props.record.dwid);
    childStore.role_Ids = record.id;
    OrgStore.queryDwOrgTree();
    childStore.queryYhByRole();
    childStore.queryTreeDwList();
    setAddVisible(true);
  };

  const onPut_Add = async (val, record1, index) => {
    const response = await fetch.post(
      `/api/eps/control/main/yhrole/saveYhRoleReact?yhid=${
        record1.yhid
      }&roleid=${role_id}&syhrole=${val ? 'Y' : 'N'}`,
    );
    if (response.data) {
      message.success('操作成功');
      childStore.yhByRoleDataSource = update(childStore.yhByRoleDataSource, {
        [index]: { syhrole: { $set: [val ? 'Y' : 'N'] } },
      });
    } else {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: '',
      textWrap: 'word-break',
      ellipsis: true,
      align: 'center',
      width: 30,
      render: (_, __, index: number) =>
        index + (childStore.page_No - 1) * childStore.page_Size + 1,
    },
    {
      title: '编码',
      dataIndex: 'yhcode',
      textWrap: 'word-break',
      ellipsis: true,
      align: 'center',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'yhname',
      textWrap: 'word-break',
      ellipsis: true,
      align: 'center',
      width: 80,
    },
    {
      title: '单位',
      dataIndex: 'dwmc',
      textWrap: 'word-break',
      ellipsis: true,
      align: 'center',
      width: 300,
    },
    {
      title: '是否配置',
      dataIndex: 'syhrole',
      textWrap: 'word-break',
      ellipsis: true,
      align: 'center',
      width: 70,
      render: (text) => {
        if (text === 'Y') {
          return (text = '是');
        } else {
          return (text = '否');
        }
      },
    },
    {
      title: '用户角色',
      dataIndex: 'syhrole',
      align: 'center',
      width: 70,

      render: (text, record, index) => {
        // setSwitchValue();
        // const [switchValue, setSwitchValue] = useState(text === 'Y');
        // useEffect(() => {
        //   setSwitchValue(text === 'Y');
        // }, [text]);

        /**
         * 单条启用角色用户
         */

        return (
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            size="small"
            onChange={(val) => onPut_Add(val, record, index)}
            //   onClick={(val) => setSwitchValue(val)}
            checked={text == 'Y'}
            defaultChecked={text == 'Y'}
          />
        );
      },
    },
  ];
  /**
   * 获取treeSelect值
   */
  const [treeValue, setTreeValue] = useState();

  const treeOnChange = (value) => {
    childStore.bm_id = value;
    setTreeValue(value);
  };

  const handleDwChange = (value) => {
    console.log('选中的值', value);
    childStore.org_dw_id = value;
    childStore.dw_id = value;
    childStore.queryDwOrgTree();
    setTreeValue('');
  };

  /**
   * 获取用户编号
   * @param {*} val
   */
  const getyhCode = (val) => {
    childStore.yh_code = val.target.value;
  };

  /**
   * 获取用户名称
   * @param {*} val
   */
  const getyhName = (val) => {
    childStore.yh_name = val.target.value;
  };

  /**
   * 点击查询
   */
  const onButtonClick = () => {
    childStore.queryYhByRole();
  };

  /**
   * 多选启用角色用户
   */
  const onPut_moreAdd = async (data) => {
    const value = JSON.stringify(data);
    var formData = new FormData();
    formData.append('data', value);
    const response = await fetch.post(
      `/api/eps/control/main/yhrole/saveYhRole`,
      formData,
    );
    if (response.data) {
      message.success('操作成功');
      childStore.queryYhByRole();
    } else {
      message.error('操作失败');
    }
  };

  var dataValue = [];
  const onSelectChange = (selectedRowKeys, selectedRows) => {
    for (var i = 0; i < selectedRows.length; i++) {
      let newData = {};
      newData.yhid = selectedRows[i].yhid;
      newData.roleid = selectedRows[i].roleid;
      newData.syhrole = selectedRows[i].syhrole;
      dataValue.push(newData);
    }
    setSelectedRowKeys(dataValue);
  };

  //多选操作
  const rowSelection = {
    onChange: onSelectChange,
  };

  const getSelectOpenId = () => {
    var selectValue = [];
    if (selectedRowKeys && selectedRowKeys.length <= 0) {
      message.error('操作失败,请至少选择一行数据');
    } else {
      for (var i = 0; i < selectedRowKeys.length; i++) {
        let newData = {};
        newData.yhid = selectedRowKeys[i].yhid;
        newData.roleid = selectedRowKeys[i].roleid;
        newData.syhrole = 'Y';
        selectValue.push(newData);
      }
      onPut_moreAdd(selectValue);
    }
  };
  const getSelectClosedId = () => {
    var cancelValue = [];
    if (selectedRowKeys && selectedRowKeys.length <= 0) {
      message.error('操作失败,请至少选择一行数据');
    } else {
      for (var i = 0; i < selectedRowKeys.length; i++) {
        let newData = {};
        newData.yhid = selectedRowKeys[i].yhid;
        newData.roleid = selectedRowKeys[i].roleid;
        newData.syhrole = 'N';
        cancelValue.push(newData);
      }
      onPut_moreAdd(cancelValue);
    }
  };

  return (
    <>
      <Tooltip title="角色用户">
        <Button
          size="small"
          style={{ fontSize: '12px' }}
          type="primary"
          shape="circle"
          icon={<EyeTwoTone />}
          onClick={() => click()}
        />
      </Tooltip>
      <Modal
        title={<span className="m-title">角色用户</span>}
        visible={add_visible}
        onOk={() => setAddVisible(false)}
        onCancel={() => setAddVisible(false)}
        width="95%"
        style={{ top: 50 }}
      >
        <div>
          <Radio.Group
            defaultValue={childStore.value}
            onChange={handleSizeChange}
            buttonStyle="solid"
          >
            <Radio.Button value="0">全部</Radio.Button>
            <Radio.Button value="1">已配置</Radio.Button>
            <Radio.Button value="2">未配置</Radio.Button>
          </Radio.Group>
          &nbsp; &nbsp;
          <Button type="primary" onClick={() => getSelectOpenId()}>
            {' '}
            启用所选{' '}
          </Button>
          &nbsp;
          <Button type="primary" onClick={() => getSelectClosedId()}>
            {' '}
            禁用所选{' '}
          </Button>
          &nbsp; &nbsp;
          <TreeSelect
            style={{ width: 320 }}
            // defaultValue={RoleStore.dw_id}
            treeData={childStore.dwTreeData}
            placeholder="请选择单位"
            treeDefaultExpandAll
            allowClear
            onChange={handleDwChange}
          />
          &nbsp;
          <TreeSelect
            style={{ width: 200 }}
            //value={treeValue}
            treeData={childStore.orgData}
            placeholder="请选择部门"
            treeDefaultExpandAll
            allowClear
            onChange={treeOnChange}
          />
          &nbsp; &nbsp;
          <Input
            style={{ width: 180 }}
            allowClear
            name="yhcode"
            placeholder="请输入用户编号"
            onChange={getyhCode}
          ></Input>
          &nbsp; &nbsp;
          <Input
            style={{ width: 180 }}
            allowClear
            name="yhname"
            placeholder="请输入用户名称"
            onChange={getyhName}
          ></Input>
          &nbsp; &nbsp;
          <Button type="primary" onClick={() => onButtonClick()}>
            查询
          </Button>
        </div>
        <div className="table">
          <Table
            className="ant-table"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={childStore.yhByRoleDataSource}
            bordered
            size="middle"
            loading={loading}
            style={{ marginTop: '30px' }}
            scroll={{ x: 1000, y: 333 }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              defaultCurrent: 1,
              defaultPageSize: 50,
              showTotal: () => `共${childStore.yhByRoleDataTotal}条`,
              pageSize: childStore.page_Size,
              current: childStore.page_No,
              total: childStore.yhByRoleDataTotal,
              onChange: (pageNo, pageSize = 50) => {
                childStore.page_No = pageNo;
                childStore.page_Size = pageSize;
                childStore.queryYhByRole();
              },
            }}
          />
        </div>
      </Modal>
    </>
  );
});

export default roleUser;

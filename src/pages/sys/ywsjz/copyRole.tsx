import React, { useEffect, useRef, useState } from 'react';
import {
  Input,
  message,
  Tooltip,
  Modal,
  Table,
  Button,
  notification,
} from 'antd';
import RoleStore from '../../../stores/system/YwsjzStore';
import { CopyOutlined } from '@ant-design/icons';
import { Observer, useLocalObservable } from 'mobx-react';
import './table.less';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import fetch from '../../../utils/fetch';
import SysStore from '@/stores/system/SysStore';

const { loading } = RoleStore;

function copyRole(text, record, index, store: EpsTableStore) {
  const ref = useRef();
  /**
   * childStore
   */
  /**
   * childStore
   */
  const copyRoleStore = useLocalObservable(() => ({
    dwTotal: 0,
    dwData: [],
    notid: '',
    dwbh: '',
    dwmc: '',
    page_No: 1,
    page_Size: 50,
    yhid: SysStore.getCurrentUser().id,
    //获取当前默认用户的角色
    roleCode: SysStore.getCurrentUser().golbalrole,

    async queryDwList() {
      if (this.roleCode === 'SYSROLE01' || this.roleCode === 'SYSROLE02') {
        const response = await fetch.get(
          `/api/eps/control/main/dw/queryForList_e9_superUser_roleCopy?dwbh=${
            this.dwbh
          }&dwmc=${this.dwmc}&pageIndex=${this.page_No - 1}&pageSize=${
            this.page_Size
          }&page=${this.page_No - 1}&limit=${this.page_Size}`,
        );
        if (response.status === 200) {
          var sjData = [];
          if (response.data.length > 0) {
            for (var i = 0; i < response.data.length; i++) {
              let newKey = {};
              newKey = response.data[i];
              newKey.key = newKey.id;
              newKey.title = newKey.mc;
              sjData.push(newKey);
            }
            this.dwData = sjData;
            this.dwTotal = sjData.length;
          }
          return;
        }
      } else {
        const response = await fetch.get(
          `/api/eps/control/main/dw/queryForListByYhid?yhid=${
            this.yhid
          }&notid=${this.notid}&dwbh=${this.dwbh}&dwmc=${this.dwmc}&pageIndex=${
            this.page_No - 1
          }&pageSize=${this.page_Size}&page=${this.page_No - 1}&limit=${
            this.page_Size
          }`,
        );
        if (response.status === 200) {
          var sjData = [];
          if (response.data.length > 0) {
            for (var i = 0; i < response.data.length; i++) {
              let newKey = {};
              newKey = response.data[i];
              newKey.key = newKey.id;
              newKey.title = newKey.mc;
              sjData.push(newKey);
            }
            this.dwData = sjData;
            this.dwTotal = sjData.length;
          }
          return;
        }
      }
    },
  }));
  var dwIds = [];
  const [add_visible, setAddVisible] = useState(false);
  const checkButton = () => {
    copyRoleStore.queryDwList();
    RoleStore.page_No = 1;
    setAddVisible(true);
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
        index + (RoleStore.page_No - 1) * RoleStore.page_Size + 1,
    },
    {
      title: '编码',
      dataIndex: 'dwbh',
      textWrap: 'word-break',
      align: 'center',
      width: 70,
    },
    {
      title: '名称',
      dataIndex: 'mc',
      textWrap: 'word-break',
      align: 'center',
      width: 200,
    },
    {
      title: '全宗号',
      dataIndex: 'qzh',
      textWrap: 'word-break',
      align: 'center',
      width: 80,
    },
    {
      title: '档案馆',
      dataIndex: 'dag',
      textWrap: 'word-break',
      align: 'center',
      width: 50,
      render: (text, record, index) => {
        if (text) {
          return text === 'Y' ? '是' : '否';
        } else {
          return (text = '无');
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'bz',
      textWrap: 'word-break',
      align: 'center',
      width: 100,
    },
    {
      title: '维护人',
      dataIndex: 'whr',
      textWrap: 'word-break',
      align: 'center',
      ellipsis: true,
      width: 50,
    },
    {
      title: '维护时间',
      dataIndex: 'whsj',
      textWrap: 'word-break',
      align: 'center',
      width: 80,
    },
  ];

  //初始化
  useEffect(() => {
    // copyRoleStore.queryDwList();
  }, []);

  const [selectionType] = useState<'checkbox'>('checkbox');

  /**
   * 提交审核
   */
  const onPut_Add = async () => {
    const response = await fetch.get(
      `/api/eps/control/main/role/saveRoletoDw?id=${record.id}&dwid=${dwIds}`,
    );
    if (response.data.success) {
      message.success('操作成功');
    } else {
      console.log(response.data);
      message.error('操作失败,' + response.data.message, 3);
    }
    setAddVisible(false);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      dwIds = selectedRowKeys;
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  /**
   * 获取单位编号
   * @param {*} val
   */
  const getDwbh = (val) => {
    copyRoleStore.dwbh = val.target.value;
  };

  /**
   * 获取单位名称
   * @param {*} val
   */
  const getDwmc = (val) => {
    copyRoleStore.dwmc = val.target.value;
  };

  /**
   * 查询
   * @param {*} current
   */
  const OnSearch = () => {
    copyRoleStore.queryDwList();
  };

  return (
    <Observer>
      {() => (
        <>
          <Tooltip title="复制到其他单位" key={'copyRole' + index}>
            <Button
              size="small"
              style={{ fontSize: '12px' }}
              type="primary"
              shape="circle"
              icon={<CopyOutlined />}
              onClick={() => checkButton()}
            />

            <Modal
              title={<span className="m-title">复制角色</span>}
              visible={add_visible}
              onOk={onPut_Add}
              onCancel={() => setAddVisible(false)}
              style={{ top: 50 }}
              width="1300px"
            >
              <div>
                <Input
                  style={{ width: 180 }}
                  allowClear
                  name="dwbh"
                  placeholder="请输入单位编号"
                  onChange={getDwbh}
                ></Input>
                &nbsp; &nbsp;
                <Input
                  style={{ width: 180 }}
                  allowClear
                  name="dwmc"
                  placeholder="请输入单位名称"
                  onChange={getDwmc}
                ></Input>
                &nbsp; &nbsp; &nbsp; &nbsp;
                <Button type="primary" onClick={() => OnSearch()}>
                  查询
                </Button>
              </div>
              <div className="table">
                <Table
                  className="ant-table"
                  rowSelection={{ type: selectionType, ...rowSelection }}
                  columns={columns}
                  dataSource={copyRoleStore.dwData}
                  bordered
                  size="middle"
                  scroll={{ x: 1500, y: 300 }}
                  loading={loading}
                  style={{ marginTop: '15px' }}
                  pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    defaultCurrent: 1,
                    defaultPageSize: 50,
                    showTotal: () => `共${copyRoleStore.dwTotal}条`,
                    pageSize: copyRoleStore.page_Size,
                    current: copyRoleStore.page_No,
                    total: copyRoleStore.dwTotal,
                    onChange: (current, pageSize = 50) => {
                      copyRoleStore.page_No = current;
                      copyRoleStore.page_Size = pageSize;
                      copyRoleStore.queryDwList();
                    },
                  }}
                />
              </div>
            </Modal>
          </Tooltip>
        </>
      )}
    </Observer>
  );
}

export default copyRole;

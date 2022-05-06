import React, { useEffect, useState } from 'react';
import { runInAction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { TreeSelect, Tabs, Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons'
import fetch from '../../../utils/fetch';
import './index.less';
import SysStore from '../../../stores/system/SysStore';
const { TabPane } = Tabs;
const { DirectoryTree } = Tree;
const Mbsz = observer((props) => {
  const childStore = useLocalObservable(() => ({
    //获取当前默认用户的角色
    roleCode: SysStore.getCurrentUser().golbalrole,
    dwTreeData: [],
    org_dw_id: '',

    //默认当前用户所在单位
    dw_id: SysStore.getCurrentCmp().id,
    async queryTreeDwList() {
      if (!this.dwTreeData || this.dwTreeData.length === 0) {
        if (this.roleCode === 'SYSROLE01' || this.roleCode === 'SYSROLE02') {
          const response = await fetch.get(`/api/eps/control/main/dw/queryForList_e9_superUser`,);
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

    mbTreeData: [],
    mbfirstId: '',
    childUrl: '',
    async queryTreeMbList() {
      let response;
      debugger;
      if (this.org_dw_id != undefined && this.org_dw_id != '') {
        response = await fetch.get(`/api/eps/control/main/mb/queryForPage?dwid=${this.org_dw_id}`,);
      } else {
        response = await fetch.get(`/api/eps/control/main/mb/queryForPage`,);
      }
      if (response.status === 200) {
        runInAction(() => {
          this.mbTreeData = response.data;
          // if (response.data.length > 0) {
          //   this.mbfirstId = this.mbTreeData[0].id;
          //   this.childUrl = `http://localhost:8000/api/eps/control/main/mbzlx/mbzlxgl?mbid=${this.mbfirstId}`,
          //     console.log("mbfirstId", this.mbfirstId)
          // }
          console.log("response.data", response.data)
          console.log("mbTreeData", this.mbTreeData)
          return;
        });
      }
    }
  }));

  useEffect(() => {
    childStore.queryTreeDwList();
    childStore.queryTreeMbList();
  }, []);

  const handleDwChange = (value) => {
    console.log('选中的值', value);
    childStore.org_dw_id = value;
    //childStore.dw_id = value;
    childStore.queryTreeMbList();
  };

  const treeData = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
            },
            {
              title: 'leaf',
              key: '0-0-0-1',
            },
            {
              title: 'leaf',
              key: '0-0-0-2',
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [
            {
              title: 'leaf',
              key: '0-0-1-0',
            },
          ],
        },
        {
          title: 'parent 1-2',
          key: '0-0-2',
          children: [
            {
              title: 'leaf',
              key: '0-0-2-0',
            },
            {
              title: 'leaf',
              key: '0-0-2-1',
            },
          ],
        },
      ],
    },
  ];
  const onSelect = (keys: React.Key[], info: any) => {
    console.log('Trigger Select', keys, info);
  };


  const { menuProp } = props;
  return (
    <>
      <div className="eps-manage">

        <div className={true ? 'content' : 'content hideExpand'}>
          <div className="tree">
            <TreeSelect
              style={{ width: 250 }}
              // defaultValue={RoleStore.dw_id}
              treeData={childStore.dwTreeData}
              placeholder="请选择单位"
              treeDefaultExpandAll
              allowClear
              onChange={handleDwChange}
            />
            <DirectoryTree
              // switcherIcon={<DownOutlined />}
              defaultExpandAll
              onSelect={onSelect}
              treeData={childStore.mbTreeData}
            />
          </div>
         
          <div className="card-container">
            <Tabs tabPosition="left">
              <TabPane tab="著录项管理" key="1">
                <iframe
                  id={`gc_iframe`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="http://localhost:8000/api/eps/control/main/mbzlx/mbzlxgl"
                ></iframe>
              </TabPane>
              <TabPane tab="多业务著录项管理" key="2">
                <iframe
                  id={`gc_iframe`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="http://localhost:8000/api/eps/control/main/dywmbzlx/mbzlxgl"
                ></iframe>
              </TabPane>
              <TabPane tab="固定分组管理" key="3">
                <iframe
                  id={`gc_iframe`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="http://localhost:8000/api/eps/control/main/mb/gdfzgl"
                ></iframe>
              </TabPane>
              <TabPane tab="档号规则设置" key="4">
                <iframe
                  id={`gc_iframe`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="http://localhost:8000/api/eps/control/main/mbgz/dhgzsz"
                ></iframe>
              </TabPane>
              <TabPane tab="归档分组设置" key="5">
                <iframe
                  id={`gc_iframe`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="http://localhost:8000/api/eps/control/main/mbfz/gdfzsz"
                ></iframe>
              </TabPane>
              <TabPane tab="盒号规则设置" key="6">
                <iframe
                  id={`gc_iframe`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="http://localhost:8000/api/eps/control/main/mbgz/hhgzsz"
                ></iframe>
              </TabPane>
              <TabPane tab="盒号分组设置" key="7">
                <iframe
                  id={`gc_iframe`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="http://localhost:8000/api/eps/control/main/mbfz/hhfzsz"
                ></iframe>
              </TabPane>
              <TabPane tab="排序设置" key="8">
                <iframe
                  id={`gc_iframe`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="http://localhost:8000/api/eps/control/main/mbpx/pxsz"
                ></iframe>
              </TabPane>
              <TabPane tab="查询条件" key="9">
                <iframe
                  id={`gc_iframe`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="http://localhost:8000/api/eps/control/main/mbcx/cxtj"
                ></iframe>
              </TabPane>
              <TabPane tab="流程分组管理" key="10">
                <iframe
                  id={`gc_iframe`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="http://localhost:8000/api/eps/control/main/lcfz/lcfzgl"
                ></iframe>
              </TabPane>
              <TabPane tab="唯一性设置" key="11">
                <iframe
                  id={`gc_iframe`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="http://localhost:8000/api/eps/control/main/mbwyx/wyxsz"
                ></iframe>
              </TabPane>
              <TabPane tab="报表设置" key="12">
                <iframe
                  id={`gc_iframe`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="http://localhost:8000/api/eps/control/main/mb/bb"
                ></iframe>
              </TabPane>
              <TabPane tab="页数转页次设置" key="13">
                <iframe
                  id={`gc_iframe`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="http://localhost:8000/api/eps/control/main/mb/yszycsz"
                ></iframe>
              </TabPane>
              <TabPane tab="公式计算" key="14">
                <iframe
                  id={`gc_iframe`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="http://localhost:8000/api/eps/control/main/mbgsjs/gsjs"
                ></iframe>
              </TabPane>
              <TabPane tab="四性检测规则设置" key="15">
                <iframe
                  id={`gc_iframe`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="http://localhost:8000/api/eps/control/main/sxjcsz/sxjcsz"
                ></iframe>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
})

export default Mbsz;

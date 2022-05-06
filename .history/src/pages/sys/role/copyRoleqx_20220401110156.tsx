import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import { Input, message, Tooltip, Modal, Table, Button, notification } from 'antd';
import RoleStore from '../../../stores/system/RoleStore';
import { CopyOutlined } from "@ant-design/icons";
import { observer, useLocalObservable } from 'mobx-react';
import EpsFormType from '@/eps/commons/EpsFormType';
import './table.less';
import {EpsSource, ITable, ITree} from '@/eps/commons/declare';
import fetch from "../../../utils/fetch";
import SysStore from '@/stores/system/SysStore';
import DwStore from '@/stores/system/DwStore';
import RoleService from '@/services/system/RoleService';
const copyRoleqx = observer((props) =>{

    const tableProp: ITable = {
        tableSearch: false,
        disableEdit: true,         // 是否禁用编辑
        disableDelete: true,        // 是否禁用删除
        disableIndex: true,         // 是否使用索引列
        disableAdd: true,          // 是否使用新增
        disableCopy: true,
        rowSelection: {
            type: 'check',
        },
   }

    const ref = useRef()
    /**
   * childStore
   */
    /**
         * childStore
         */
    const copyRoleStore = useLocalObservable(() => (
        {

            name: "",
            code: "",

            yhid: SysStore.getCurrentUser().id,
            //获取当前默认用户的角色
            roleCode: SysStore.getCurrentUser().golbalrole,



            async queryDwList() {
                const response = await fetch.get(`/api/eps/control/main/role/queryForPage?pageIndex=${this.page_No - 1}&pageSize=${this.page_Size}&page=${this.page_No - 1}&limit=${this.page_Size}`);


            }
        }
    ));
    const [add_visible, setAddVisible] = useState(false)
    const checkButton = () => {
        copyRoleStore.queryDwList();
        RoleStore.page_No = 1
        setAddVisible(true);
    }

    const source: EpsSource[] = [

        {
            title: '编号',
            code: 'code',
            align: 'center',
            formType: EpsFormType.Input
          }, {
            title: '名称',
            code: 'name',
            align: 'center',
            formType: EpsFormType.Input
          }, {
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
            }
          },
          {
            title: '停用',
            align: 'center',
            code: 'tybz',
            width: 80,
            formType: EpsFormType.Select,
            render: (text, record, index) => {
              return record.tybz == 'N' ? '否' : '是';
            }
          },
          {
            title: '默认角色',
            align: 'center',
            code: 'sfmryh',
            width: 80,
            formType: EpsFormType.Select,
            render: (text, record, index) => {
              return text == 'N' ? '否' : '是';
            }
          }, {
            title: '类型',
            code: 'lx',
            align: 'center',
            formType: EpsFormType.Input
          },

          {
            title: '停用日期',
            code: 'tyrq',
            align: 'center',
            formType: EpsFormType.Input
          },
          {
            title: '维护人',
            code: 'whr',
            align: 'center',
            formType: EpsFormType.Input
          },
          {
            title: '维护时间',
            code: 'whsj',
            align: 'center',
            formType: EpsFormType.Input
          }
    ]
    const title = {
        name: '复制角色权限'
    }

    const customForm = () => {
        return (
          <>
          </>
        );
      };
    //初始化
    useEffect(() => {
        // copyRoleStore.queryDwList();
        setAddVisible(true);
    }, [])



    const [selectionType] = useState<'checkbox'>('checkbox');



    /**
     * 提交审核
     */
    const onPut_Add = async () => {
        const response = await fetch.get(`/api/eps/control/main/role/saveRoletoDw?id=${record.id}&dwid=${dwIds}`);
        if (response.data.success) {
            message.success('操作成功');
        } else {
            console.log(response.data);
            message.error('操作失败,' + response.data.message, 3);
        }
        setAddVisible(false);
    }


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
    * 获取角色编号
    * @param {*} val
    */
    const getBh = (val) => {
        copyRoleStore.code = val.target.value;
    };

    /**
    * 获取角色名称
    * @param {*} val
    */
    const getName = (val) => {
        copyRoleStore.name = val.target.value;
    };

    /**
    * 查询
    * @param {*} current
    */
    const OnSearch = () => {
        let storeTable = ref.current?.getTableStore();
        storeTable.findByKey('', 1, storeTable.size, {name: copyRoleStore.name,code:copyRoleStore.code});
    };

    return (
        <>
        <div >
            <Input style={{ width: 180 }} allowClear name="code" placeholder="请输入角色编号" onChange={getBh}></Input>
            &nbsp; &nbsp;
            <Input style={{ width: 180 }} allowClear name="name" placeholder="请输入角色名称" onChange={getName}></Input>
            &nbsp; &nbsp; &nbsp; &nbsp;
            <Button type="primary" onClick={() => OnSearch()}>查询</Button> &nbsp; &nbsp;
            <Button type="primary" onClick={() => OnSearch()}>保存</Button>
        </div>
        <div className="table">
            <EpsPanel
                title={title}
                source={source}
                ref={ref}
                tableProp={tableProp}
                formWidth={800}
                //customTableAction={customTableAction}                  // 高级搜索组件，选填
                tableService={RoleService}
                customForm={customForm}
                initParams={{dwid:props.params.dwid,roleid:props.params.roleid}}
                //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
            >
            </EpsPanel>
        </div>
        </>
    );
})

export default copyRoleqx;

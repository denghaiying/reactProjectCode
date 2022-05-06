import { useEffect, useState, useRef } from 'react';
import { Input, Table, Button, message, Form } from 'antd';
import { Observer, useLocalObservable, useLocalStore } from 'mobx-react';
import TreeStore from './treeStore';
import { history } from 'umi';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import DakTree from '@/eps/components/trees/DakTree/DakTree';
import MainChart from '../../Components/MainChart/index';
import fetch from '../../../../utils/fetch';
import SysStore from '@/stores/system/SysStore';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import TableService from '../AppraisaManage/TableService';

import './index.less';
import Arch from '../AppraisaManage/index';
import { runInAction } from 'mobx';
/**
 * @Author: caijc
 * @Date: 2021/8/1
 * @Version: 9.0
 * @Content:
 *    2021/08/10 蔡锦春
 *    修改：
 *      1.状态组件由IceStore改成mobx
 *    2019/9/16 王祥
 *      新增代码
 */

const kkjs = (props) => {
  //const tmzt=3
  const Store = new TreeStore(
    '/api/eps/control/main/dak',
    false,
    true,
    props.tmzt,
  );

  //const archParams = props.params;

  const store = useLocalStore(() => ({
    params: {},
    childParams: {},
    ktable: {},
    childKtable: {},
    //dakid: archParams.dakid,
    childDakid: '',
    // 点击的主表的id，子表查询传递fid参数
    mainRowId: '',
    dakid: '',
    bmc: '',
    // async initKtable() {
    //   const ktable: KtableType = await TableService.queryKTable(archParams);
    //   let childKtable: KtableType;

    //   runInAction(() => {
    //     this.ktable = update(this.ktable, {
    //       $set: ktable,
    //     });
    //     if (isRecords) {
    //       this.childKtable = childKtable;
    //       this.childDakid = childKtable.id;
    //       this.childParams = {
    //         bmc: childKtable.bmc,
    //         lx: childKtable.daklx,
    //         tmzt: archParams.tmzt,
    //         dakid: childKtable.id,
    //       };
    //     }
    //   });
    // },

    async onSelect(selectedKeys, info) {
      const { icon, children, ...others } = info.node;
      if (others.type == 'F') {
        return;
      }
      const params: ArchParams = {
        umname: `${info.node.mc}`,

        bmc: others.mbc,
        path: `/runRfunc/archManage/${others.id}/${props.tmzt}`,
        dakid: others.id,
        lx: others.lx,
        wzlk: 'N',
        type: others.type,
        mc: others.mc,
        title: others.title,
        tmzt: props.tmzt,
      };

      const ktable: KtableType = await TableService.queryKTable({
        dakid: params.dakid,
      });

      runInAction(() => {
        this.params = params;
        this.dakid = params.dakid;
        this.bmc = params;
        this.ktable = ktable;
      });

      //runFunc(params);
    },
    tableRowClick(record) {
      runInAction(() => {
        this.mainRowId = '';
        this.mainRowId = record.id;
      });
    },
  }));

  const ref = useRef();
  const dakztlist = [
    { id: '1', value: '1', label: '文件收集' },
    { id: '2', value: '2', label: '文件整理' },
    { id: '3', value: '3', label: '档案管理' },
    { id: '24', value: '4', label: '档案利用' },
    { id: '5', value: '5', label: '档案编研' },
  ];

  useEffect(() => {
    Store.setColumns([
      {
        title: '编号',
        dataIndex: 'code',
        width: 200,
        lock: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 250,
      },
      {
        title: 'w',
        dataIndex: 'whsj',
        width: 200,
      },
    ]);
    // Store.queryForPage();
    Store.queryTree();
  }, []);

  const kksjsource = [
    {
      title: '档案库状态',
      code: 'dakzt',
      formType: EpsFormType.Input,
      align: 'center',
      width: 70,
      render: (text, record, index) => {
        let xfglist = dakztlist;
        let aa = xfglist.filter((item) => {
          return item.value === text;
        });
        return aa[0]?.label;
      },
    },
    {
      title: '档案库',
      code: 'dakmc',
      formType: EpsFormType.Input,
      align: 'center',
      width: 200,
    },
    {
      title: '数量',
      code: 'sl',
      formType: EpsFormType.Input,
      align: 'center',
      width: 80,
    },
  ];

  /**
   * 查询
   * @param {*} current
   */
  const doSearchAction = (formData, tableStore) => {
    if (Store.dakid === '') {
      message.warning({ type: 'warning', content: '请选择档案库' });
      return;
    }
    if (formData.key === undefined || formData.key === '') {
      message.warning({ type: 'warning', content: '请输入关键字' });
      return;
    }
    Store.key = formData.key;
    const params = { dakzt: props.tmzt, key: formData.key, dakid: Store.dakid };
    //  ApplyStore.setParams(params, true);
    tableStore.findByKey(tableStore.key, 1, tableStore.size, params);
  };

  const tableProp: ITable = {
    tableSearch: false,
    disableEdit: true,
    disableDelete: true,
    disableAdd: true,
    disableCopy: true,
    searchCode: 'key',
  };

  const [form] = Form.useForm();

  const customAction = (store, rows) => {
    return [
      <>
        <Form
          onFinish={(formData) => doSearchAction(formData, store)}
          layout={'inline'}
          form={form}
          initialValues={{
            // datebe: [moment().startOf("month"), moment().endOf("month")],
            sw: 'W',
          }}
        >
          <Form.Item name="key">
            <Input
              style={{ width: 180 }}
              allowClear
              placeholder="请输入关键字"
            ></Input>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType={'submit'}>
              查询
            </Button>
          </Form.Item>
        </Form>
      </>,
    ];
  };

  const customForm = () => {
    //自定义表单校验
    return <></>;
  };

  // end **************
  return (
    <Observer>
      {() => (
        <div className="oa-manage">
          <div className={'content'}>
            <div className="tree">
              <DakTree
                onSelect={store.onSelect}
                checkable={false}
                store={Store}
                treeData={Store.treeData}
              />
            </div>
            <div className="right">
              <div style={{ width: '100%' }}>
                <Arch
                  openProjectArch={props.openProjectArch}
                  // key={`${params.dakid}_select`}
                  archParams={store.params}
                  bmc={store.bmc}
                  isProject={false}
                  tableRowClick={store.tableRowClick}
                  dakid={store.dakid}
                  ktable={store.ktable}
                  {...props}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Observer>
  );
};

export default kkjs;

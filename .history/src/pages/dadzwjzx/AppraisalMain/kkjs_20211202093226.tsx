import { useEffect, useState, useRef } from 'react';
import { Input, Table, Button, message, Form } from 'antd';
import { Observer, useLocalObservable } from 'mobx-react';
import TreeStore from './treeStore';
import { history } from 'umi';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import DakTree from '@/eps/components/trees/DakTree/DakTree';
import MainChart from '../../Components/MainChart/index';
import fetch from '../../../utils/fetch';
import SysStore from '@/stores/system/SysStore';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import KkjsService from './KkjsService';

import './index.less';
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

  const onSelect = (selectedKeys, info) => {
    const { icon, children, ...others } = info.node;
    if (others.type == 'F') {
      return;
    }
    const params: ArchParams = {
      umid: props.jdumid,
      umname: `${info.node.mc}【${props.jdname}】`,
      bmc: others.mbc,
      dakid: others.id,
      lx: others.lx,
      wzlk: 'N',
      type: others.type,
      mc: others.mc,
      title: others.title,
      tmzt: props.tmzt,
    };
    history.push({
      pathname: `/runRfunc/archManage/${others.id}/${props.tmzt}`,
      query: params,
    });
  };

  const ontaleSelect = async (record) => {
    var dakid = record.dakid;
    let url = '/api/eps/wdgl/attachdoc/wjzhOFD';
    const dak = await fetch.post(
      '/eps/control/main/dak/queryForId?id=' + dakid,
    );
    const params: ArchParams = {
      umid: props.jdumid,
      umname: `${dak.data.mc}【${props.jdname}】`,
      bmc: dak.data.mbc,
      dakid: dakid,
      lx: dak.data.lx,
      wzlk: 'N',
      type: 'K',
      mc: dak.data.mc,
      title: dak.data.bh + '|' + dak.data.mc,
      tmzt: props.tmzt,
      key: Store.key,
    };
    history.push({
      pathname: `/runRfunc/archManage/${dakid}/${props.tmzt}`,
      query: params,
    });
  };

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
          <div className="title">{props.jdname}</div>
          <div className={'content'}>
            <div className="tree">
              <DakTree
                onSelect={onSelect}
                store={Store}
                treeData={Store.treeData}
              />
            </div>
            <div className="right">
              <EpsPanel
                title="跨库检索"
                source={kksjsource}
                tableProp={tableProp}
                formWidth={500}
                ref={ref}
                //customTableAction={customTableAction}                  // 高级搜索组件，选填
                tableRowClick={ontaleSelect}
                tableService={KkjsService}
                customForm={customForm}
                customAction={customAction} // 自定义全局按钮（如新增、导入、全局打印等），选填
              ></EpsPanel>
            </div>
          </div>
        </div>
      )}
    </Observer>
  );
};

export default kkjs;

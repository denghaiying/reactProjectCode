import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  TreeSelect,
  DatePicker,
  message,
  Modal,
} from 'antd';
import fetch from '../../../utils/fetch';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import RecycleBinService from '@/services/dagl/recycleBin/RecycleBinService';
import { ITable, ITitle } from '@/eps/commons/declare';
import { observer, useLocalObservable } from 'mobx-react';
import { useRef } from 'react';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import {
  CloseCircleOutlined,
  UndoOutlined,
  DeleteOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
const { RangePicker } = DatePicker;
const { confirm } = Modal;

import { useForm } from 'antd/lib/form/Form';
import ResetDagsbmService from './ResetDagsbmService';
const tableProp: ITable = {
  tableSearch: true,
  disableEdit: true,
  disableDelete: true,
  disableAdd: true,
  disableCopy: true,
  rowSelection: { type: 'radio' },
};

// 归属部门调整
const ResetDagsbm = observer((props) => {
  console.log('props:', props);

  const [umid, setUmid] = useState('');

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(
    new EpsTableStore(ResetDagsbmService),
  );

  const ResetDagsbmStore = useLocalObservable(() => ({
    org: {},
    filegre: '',
    xtid: '',
    xtgjDisabled: false,
    importDisabled: false,
    zcdate: '',
    gninfo: {},
    fjsc: false,

    async queryForId(id) {
      if (id != '') {
        const response = await fetch.post(
          `/api/eps/control/main/org/queryForIdDetail?id=` + id,
        );
        if (response && response.status === 200) {
          this.org = response.data;
        } else {
          this.loading = true;
        }
      }
    },

    async updatebm(ids) {
      const yidss = props.store.selectRecords;
      const idss = [];
      if (yidss.length > 0) {
        for (let i = 0; i < yidss.length; i++) {
          idss.push(yidss[i].id);
        }
      } else {
        message.warning('操作失败,请至少选择一行数据!');
        return;
      }

      const res = await fetch.post(
        '/api/eps/control/main/dagl/reSetDabm',
        this.params,
        {
          params: {
            mbid: props.store.ktable.mbid,
            bmc: props.store.ktable.bmc,
            daklx: props.store.ktable.daklx,
            ids: idss.toString(),
            ssbmid: ids[0].id,
            tmzt: props.store.tmzt,
            ssbmmc: ids[0].name,
            ...this.params,
          },
        },
      );

      if (res && res.status === 200) {
        message.info('操作成功！');
      } else {
        message.error('操作失败！');
      }
    },
  }));

  // const customTableAction = (text, record, index, store) => {

  //     return (<>
  //         {[
  //             //  <Detail title="模块详情" column={ource} data={record} store={tableStore} customForm={customForm} />,
  //         ]}
  //     </>)}

  // useEffect(() => {
  //     // SearchStore.queryDw();
  //    // setUmid('CONTROL0005');
  // }, []);

  const tzsave = async (ids) => {
    debugger;
    // const yidss=props.store.selectRecords;
    const idss = [];
    if (ids.length > 0) {
      for (let i = 0; i < ids.length; i++) {
        idss.push(ids[i].id);
      }
    } else {
      message.warning('操作失败,请至少选择一行数据!');
      return;
    }
    ResetDagsbmStore.updatebm(ids);

    props.closeModal();
    //   props.modalVisit= false;
  };

  const customAction = (store: EpsTableStore, ids: any[]) => {
    return [
      <>
        {/* <EpsReportButton store={store} umid={umid} /> */}
        {/* <EpsReportButton store={store} umid={umid} /> */}
        <Button
          type="primary"
          onClick={() => tzsave(ids)}
          // icon={<SaveOutlined />}
        >
          调整
        </Button>
      </>,
    ];
  };

  const span = 24;
  const _width = 240;

  // 自定义表单

  const customForm = () => {
    //自定义表单校验

    return (
      <>
        <Row gutter={20}>
          <Col span={span}>
            <Form.Item label="编号" name="mkbh">
              <Input style={{ width: _width }} className="ant-input" />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="名称" name="mc">
              <Input style={{ width: _width }} className="ant-input" />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="版本" name="bb">
              <Input style={{ width: _width }} className="ant-input" />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="URL" name="url">
              <Input style={{ width: _width }} className="ant-input" />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="停用" name="tymc">
              <Input style={{ width: _width }} className="ant-input" />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="停用日期" name="tyrq">
              <Input style={{ width: _width }} className="ant-input" />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="维护人" name="whr">
              <Input style={{ width: _width }} className="ant-input" />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="维护时间" name="whsj">
              <Input style={{ width: _width }} className="ant-input" />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  const source: EpsSource[] = [
    {
      title: '编码',
      code: 'code',
      align: 'center',
      fixed: 'left',
      width: 120,
      formType: EpsFormType.Input,
    },
    {
      title: '名称',
      code: 'name',
      align: 'center',
      ellipsis: true, // 字段过长自动东隐藏
      width: 200,
      formType: EpsFormType.Input,
    },
    {
      title: '类型',
      align: 'center',
      code: 'lx',
      width: 120,
      ellipsis: true,
      formType: EpsFormType.Select,
    },
    {
      title: '停用',
      code: 'tybz',
      width: 60,
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        //  return text == 'N' ? '启用' : '停用';
        //为null的时候表示启用
        return text == 'Y' ? '停用' : '启用';
      },
    },
    {
      title: '维护人',
      code: 'whr',
      width: 100,
      align: 'center',
      formType: EpsFormType.Input,
      /* defaultSortOrder: 'descend',
         sorter: (a, b) => a.whr - b.whr,*/
    },
    {
      title: '维护时间',
      code: 'whsj',
      width: 160,
      align: 'center',
      formType: EpsFormType.None,
    },
  ];
  const title = {
    name: '归档部门调整',
  };

  return (
    <div style={{ height: '100%' }}>
      <EpsPanel
        title={title}
        source={source}
        tableProp={tableProp}
        formWidth={600}
        //customTableAction={customTableAction}                  // 高级搜索组件，选填
        tableService={ResetDagsbmService}
        //    customForm={customForm}
        customAction={customAction} // 自定义全局按钮（如新增、导入、全局打印等），选填
      ></EpsPanel>
    </div>
  );
});
export default ResetDagsbm;

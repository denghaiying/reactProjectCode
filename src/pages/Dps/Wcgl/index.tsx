import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import React, { useEffect, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { DatePicker, Form, Input, message, Select } from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import WcglService from '../Wcgl/Service/WcglService';
import moment from 'moment';
import fetch from '../../../utils/fetch';
import OptrightStore from '@/stores/user/OptrightStore';

/**
 * 外出管理
 */
const Wcgl = observer((props) => {
  //权限按钮
  const umid = 'DPS010';
  OptrightStore.getFuncRight(umid);
  useEffect(() => {
    WcglStore.findYhData();
    WcglStore.findWclx();
  }, []);

  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: true,
    disableCopy: true,
    searchCode: 'xm',
    disableAdd: !OptrightStore.hasRight(umid, 'SYS101'),
    disableEdit: !OptrightStore.hasRight(umid, 'SYS102'),
    disableDelete: !OptrightStore.hasRight(umid, 'SYS103'),
    onAddClick: (forma, data) => {
      WcglStore.JKsDate = '';
      WcglStore.JJsDate = '';
      WcglStore.SJsDate = '';
      WcglStore.SKsDate = '';
    },
    onEditClick: (form, data) => {
      WcglStore.JKsDate = data.pstime;
      WcglStore.JJsDate = data.petime;
      WcglStore.SJsDate = data.aetime;
      WcglStore.SKsDate = data.astime;
      data.pstime = data.pstime
        ? moment(data.pstime, 'YYYY-MM-DD HH:ss:mm')
        : '';
      data.petime = data.petime
        ? moment(data.petime, 'YYYY-MM-DD HH:ss:mm')
        : '';
      data.astime = data.astime
        ? moment(data.astime, 'YYYY-MM-DD HH:ss:mm')
        : '';
      data.aetime = data.aetime
        ? moment(data.aetime, 'YYYY-MM-DD HH:ss:mm')
        : '';
    },
  };

  // 表单名称
  const title: ITitle = {
    name: '外出管理',
  };

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '用户姓名',
      code: 'xm',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '外出类型',
      code: 'code',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text: any, record: any, index: any) => {
        const a: any[] = [];
        WcglStore.wclxData.forEach((w) => {
          if (text === w.value) {
            a.push(w.label);
          }
        });
        return a;
      },
    },
    {
      title: '计划开始时间',
      code: 'pstime',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input,
    },
    {
      title: '计划结束时间',
      code: 'petime',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input,
    },
    {
      title: '外出天数',
      code: 'days',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '外出事由',
      code: 'origin',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '实际开始时间',
      code: 'astime',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input,
    },
    {
      title: '实际结束时间',
      code: 'aetime',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input,
    },
    {
      title: '实际天数',
      code: 'adays',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '说明',
      code: 'explain',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '状态',
      code: 'state',
      align: 'center',
      formType: EpsFormType.Input,
    },
  ];

  //外出管理store
  const WcglStore = useLocalObservable(() => ({
    yhSelectData: [],
    yhData: [],
    wclxData: [],
    JKsDate: '',
    JJsDate: '',
    SKsDate: '',
    SJsDate: '',
    Jhts: '',
    Sjts: '',

    //查询全部用户数据
    async findYhData(params: any) {
      const response = await fetch.get(
        '/api/eps/control/main/yh/queryForList',
        { params },
      );
      if (response.status === 200) {
        if (response.data.length >= 1) {
          this.yhData = response.data;
          this.yhSelectData = response.data.map(
            (item: { id: any; yhmc: any }) => ({
              value: item.id,
              label: item.yhmc,
            }),
          );
        }
      }
    },
    //查询外出类型
    async findWclx() {
      const response = await fetch.get('/api/eps/dps/outtype/', {
        params: { size: 9999 },
      });
      if (response.status === 200) {
        if (response.data.list.length > 0) {
          this.wclxData = response.data.list.map(
            (item: { code: any; name: any }) => ({
              value: item.code,
              label: item.name,
            }),
          );
        }
      }
    },
  }));

  // 自定义弹框表单
  const customForm = (text, form) => {
    const yhonChange = (record: any) => {
      WcglStore.yhData.forEach((w) => {
        if (record === w.id) {
          text.setFieldsValue({ yhId: w.id });
          text.setFieldsValue({ login: w.bh });
          text.setFieldsValue({ xm: w.yhmc });
        }
      });
    };

    //开始时间和结束时间处理
    const JPstimeChange = (record) => {
      WcglStore.JKsDate = record;
      const sjc = moment(WcglStore.JJsDate)._d - moment(WcglStore.JKsDate)._d;
      WcglStore.Jhts = (sjc / 86400000).toFixed(2);
      if (WcglStore.Jhts) {
        text.setFieldsValue({ days: WcglStore.Jhts });
      }
    };
    //计划结束时间
    const JPetimeChange = (record) => {
      WcglStore.JJsDate = record;
      const sjc = moment(WcglStore.JJsDate)._d - moment(WcglStore.JKsDate)._d;
      WcglStore.Jhts = (sjc / 86400000).toFixed(2);
      if (WcglStore.Jhts) {
        text.setFieldsValue({ days: WcglStore.Jhts });
      }
    };
    const SPstimeChange = (record) => {
      WcglStore.SKsDate = record;
      const sjc = moment(WcglStore.SJsDate)._d - moment(WcglStore.SKsDate)._d;
      WcglStore.Sjts = (sjc / 86400000).toFixed(2);
      if (WcglStore.Sjts) {
        text.setFieldsValue({ adays: WcglStore.Sjts });
      }
    };
    //实际结束时间
    const SPetimeChange = (record) => {
      WcglStore.SJsDate = record;
      const sjc = moment(WcglStore.SJsDate)._d - moment(WcglStore.SKsDate)._d;
      WcglStore.Sjts = (sjc / 86400000).toFixed(2);
      if (WcglStore.Sjts) {
        text.setFieldsValue({ adays: WcglStore.Sjts });
      }
    };
    //可选和不可选的判断
    const JPstdisabledDate = (current) => {
      return current >= moment(WcglStore.JJsDate);
    };
    const JPetdisableDate = (current) => {
      return current <= moment(WcglStore.JKsDate);
    };
    const SPstdisabledDate = (current) => {
      return current >= moment(WcglStore.SJsDate);
    };
    const SPetdisableDate = (current) => {
      return current <= moment(WcglStore.SKsDate);
    };

    // 自定义表单
    return (
      <>
        <Form.Item label="用户id:" name="yhId" hidden></Form.Item>
        <Form.Item label="用户名:" name="login" hidden></Form.Item>
        <Form.Item
          label="用户姓名:"
          name="xm"
          required
          rules={[{ required: true, message: '请输入用户姓名' }]}
        >
          <Select
            allowClear
            placeholder="请选择用户姓名"
            style={{ width: 300 }}
            showArrow
            options={WcglStore.yhSelectData}
            onChange={yhonChange}
            showSearch
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
          ></Select>
        </Form.Item>
        <Form.Item label="外出类型:" name="code">
          <Select
            showSearch
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            allowClear
            placeholder="请选择外出类型"
            style={{ width: 300 }}
            showArrow
            options={WcglStore.wclxData}
          ></Select>
        </Form.Item>
        <Form.Item
          label="计划开始时间:"
          name="pstime"
          required
          rules={[{ required: true, message: '请输入计划开始时间' }]}
        >
          <DatePicker
            showTime
            allowClear
            style={{ width: 300 }}
            onChange={JPstimeChange}
            disabledDate={JPstdisabledDate}
          />
        </Form.Item>
        <Form.Item
          label="计划结束时间:"
          name="petime"
          required
          rules={[{ required: true, message: '请输入计划结束时间' }]}
        >
          <DatePicker
            showTime
            allowClear
            style={{ width: 300 }}
            disabledDate={JPetdisableDate}
            onChange={JPetimeChange}
          />
        </Form.Item>
        <Form.Item label="外出天数:" name="days">
          <Input allowClear style={{ width: 300 }} disabled />
        </Form.Item>
        <Form.Item label="外出事由:" name="origin">
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          label="实际开始时间:"
          name="astime"
          required
          rules={[{ required: true, message: '请输入实际开始时间' }]}
        >
          <DatePicker
            showTime
            allowClear
            style={{ width: 300 }}
            onChange={SPstimeChange}
            disabledDate={SPstdisabledDate}
          />
        </Form.Item>
        <Form.Item
          label="实际结束时间:"
          name="aetime"
          required
          rules={[{ required: true, message: '请输入实际结束时间' }]}
        >
          <DatePicker
            showTime
            allowClear
            style={{ width: 300 }}
            onChange={SPetimeChange}
            disabledDate={SPetdisableDate}
          />
        </Form.Item>
        <Form.Item label="实际天数:" name="adays">
          <Input allowClear style={{ width: 300 }} disabled />
        </Form.Item>
        <Form.Item label="说明:" name="explain">
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
        {/* <Form.Item label="状态:" name="state" >
          <Input allowClear style={{ width: 300 }} />
        </Form.Item> */}
      </>
    );
  };

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={WcglService} // 右侧表格实现类，必填
        formWidth={500}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      ></EpsPanel>
    </>
  );
});

export default Wcgl;

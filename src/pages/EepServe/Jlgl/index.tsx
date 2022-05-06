import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import React, { useEffect, useState, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import {
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Select,
  Tooltip,
  Button,
  message,
} from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import { ArrowDownOutlined } from '@ant-design/icons';
import SysStore from '../../../stores/system/SysStore';
import moment from 'moment';
import fetch from '../../../utils/fetch';
import JlglService from './service/JlglService';
import ViewEEP from './viewEEP';

const FormItem = Form.Item;
/**
 * 数据包服务---EEP模版服务
 */
const Jlgl = observer((props) => {
  const ref = useRef();
  useEffect(() => {
    JlglStore.findMb();
  }, []);
  /**
   * childStore
   */
  const JlglStore = useLocalObservable(() => ({
    mbdata: [],
    mbSelectdata: [],
    // 查询模版数据
    async findMb() {
      const response = await fetch.get('/api/eps/e9eep/eepmb/getmblist', {
        params: { mbenable: '0' },
      });
      if (response.status === 200) {
        if (response.data.length !== 0) {
          this.mbdata = response.data;
          this.mbSelectdata = response.data.map(
            (item: { id: any; mbname: any }) => ({
              value: item.id,
              label: item.mbname,
            }),
          );
        }
      }
    },
    async downloadEEP(params) {
      await fetch
        .post('/api/eps/e9eep/packet/downloadEep', params, {
          responseType: 'blob',
        })
        .then((res) => {
          if (res.status === 200) {
            const type =
              res.headers['context-type'] && 'application/octet-stream';
            debugger;
            const blob = new Blob([res.data], { type });
            const url = window.URL.createObjectURL(blob);
            const aLink = document.createElement('a');
            aLink.style.display = 'none';
            aLink.href = url;
            const eeppath = params.packetfilepath.replace(/\\/g, '/');
            const fileString = eeppath.split('/');
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < fileString.length; i++) {
              if (fileString[i].indexOf('.eep') !== -1) {
                aLink.setAttribute(
                  'download',
                  decodeURIComponent(fileString[i]),
                );
                document.body.appendChild(aLink);
                aLink.click();
                document.body.removeChild(aLink);
                window.URL.revokeObjectURL(url);
              }
            }
          } else {
            message.error(
              'EEP数据包下载失败,原因：当前数据包不存在或源文件已被删除！',
            );
          }
        })
        .catch((err) => {
          message.error(
            'EEP数据包下载失败,原因：当前数据包不存在或源文件已被删除！',
          );
        });
    },
  }));

  // 高级搜索框
  const searchFrom = () => {
    return (
      <>
        <FormItem label="记录类型" className="form-item" name="packettype">
          <Select style={{ width: 300 }} placeholder="请选择记录类型">
            <option value="0">下载</option>
            <option value="1">解析</option>
          </Select>
        </FormItem>
        <FormItem label="数据包名称" className="form-item" name="packetname">
          <Input style={{ width: 300 }} placeholder="请输入数据包名称" />
        </FormItem>
      </>
    );
  };
  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
    // disableEdit: true,          // 是否禁用编辑
    disableAdd: true, // 是否使用新增
  };

  // 表单名称
  const title: ITitle = {
    name: '记录管理',
  };

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '数据包名称',
      code: 'packetname',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '所属模版',
      code: 'packetmbid',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        for (let i = 0; i < JlglStore.mbdata.length; i++) {
          const mb = JlglStore.mbdata[i];
          if (mb.id === text) {
            return mb.mbname;
          }
        }
      },
    },
    {
      title: '所属结构',
      code: 'packetmbeepjg',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text === '0') {
          return '一文一件';
        }
        if (text === '1') {
          return '案卷';
        }
        if (text === '2') {
          return '党政机关一文一件';
        }
        if (text === '3') {
          return '会计档案一文一件';
        }
        if (text === '4') {
          return '财务档案案卷';
        }
        if (text === '5') {
          return '苏州地铁案卷';
        }
        if (text === '6') {
          return '中交二公局一文一件';
        }
        if (text === '7') {
          return '溧水档案馆一文一件';
        }
        if (text === '8') {
          return '申万宏源案卷';
        }       
         if (text === '9') {
          return '申万宏源合同类一文一件';
        }
        if (text === '10') {
          return '申万宏源流程类一文一件';
        }
      },
      width: 100,
    },
    {
      title: '记录类型',
      code: 'packettype',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text === '0') {
          return '下载';
        }
        if (text === '1') {
          return '解析';
        }
      },
      width: 100,
    },
    {
      title: '记录状态',
      code: 'packetstatus',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text === '0') {
          return '打包中';
        }
        if (text === '1') {
          return '打包成功';
        }
        if (text === '2') {
          return '打包失败';
        }
        if (text === '3') {
          return '解析成功';
        }
        if (text === '4') {
          return '解析失败';
        }
      },
      width: 100,
    },
    {
      title: '包简介',
      code: 'packetremarks',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '打包信息',
      code: 'packetinfo',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '存放路径',
      code: 'packetfilepath',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '解析EEP结果',
      code: 'packetparsejg',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '记录创建人',
      code: 'packetcjr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
    },
    {
      title: '记录创建时间',
      code: 'packetcjsj',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
    },
  ];
  // 自定义弹框表单
  const customForm = (text, form) => {
    // 自定义表单
    return (
      <>
        <Form.Item label="数据包名称:" name="packetname">
          <Input allowClear style={{ width: 300 }} disabled />
        </Form.Item>
        <Form.Item label="所属模版:" name="packetmbid">
          <Select
            disabled
            style={{ width: 300 }}
            placeholder="请选择模版"
            options={JlglStore.mbSelectdata}
          />
        </Form.Item>
        <Form.Item label="模版结构:" name="packetmbeepjg">
          <Select style={{ width: 300 }} placeholder="请选择模版结构" disabled>
            <option value="0">一文一件</option>
            <option value="1">案卷</option>
          </Select>
        </Form.Item>
        <Form.Item label="记录类型:" name="packettype">
          <Select style={{ width: 300 }} className="ant-select" disabled>
            <option value="0">下载</option>
            <option value="1">解析</option>
          </Select>
        </Form.Item>
        <Form.Item label="打包状态:" name="packettype">
          <Select style={{ width: 300 }} className="ant-select" disabled>
            <option value="0">打包中</option>
            <option value="1">打包成功</option>
            <option value="3">打包失败</option>
            <option value="4">解析成功</option>
            <option value="5">解析失败</option>
          </Select>
        </Form.Item>
        <Form.Item label="包简介:" name="packetremarks">
          <Input.TextArea disabled style={{ height: '10px', width: '300px' }} />
        </Form.Item>
        <Form.Item label="存放路径:" name="packetfilepath">
          <Input disabled style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="打包或解析信息:" name="packetinfo">
          <Input.TextArea disabled style={{ height: '10px', width: '300px' }} />
        </Form.Item>
        <Form.Item label="解析结果:" name="packetparsejg">
          <Input.TextArea disabled style={{ height: '50px', width: '300px' }} />
        </Form.Item>
        <Form.Item label="记录创建人:" name="packetcjr">
          <Input disabled style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="记录创建时间:" name="packetcjsj">
          <Input disabled style={{ width: 300 }} />
        </Form.Item>
      </>
    );
  };
  // 自定义表格行按钮
  const customTableAction = (text, record, index, store) => {
    const res: any[] = [];
    res.push(
      <Tooltip title="下载">
        <Button
          size="small"
          style={{ fontSize: '12px' }}
          type="primary"
          shape="circle"
          icon={<ArrowDownOutlined />}
          onClick={() => downloadEep(record)}
        />
      </Tooltip>,
    );
    res.push(<ViewEEP record={record} key={'ViewEEP' + index} store={store} />);
    return res;
    // return (
    //   <>
    //     <Tooltip title="下载">
    //       <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<ArrowDownOutlined />} onClick={() => downloadEep(record)} />
    //     </Tooltip>
    //   </>
    // )
  };
  const downloadEep = (record) => {
    if (
      record.packetfilepath === null ||
      record.packetfilepath === '' ||
      record.packetfilepath === undefined
    ) {
      message.warning('当前记录无数据包路径！');
      return;
    }
    const params = { id: record.id, packetfilepath: record.packetfilepath };
    JlglStore.downloadEEP(params);
  };
  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={JlglService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        formWidth={500}
        searchForm={searchFrom} // 高级搜索查询框
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction} // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
      ></EpsPanel>
    </>
  );
});

export default Jlgl;

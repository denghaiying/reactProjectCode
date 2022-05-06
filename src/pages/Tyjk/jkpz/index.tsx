import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import jkpzService from './service/JkpzService';
import {
  Form,
  Input,
  message,
  Select,
  Checkbox,
  Row,
  Col,
  Button,
  Modal,
  Divider,
} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import Zddy from './zddy';
import zjkService from './service/ZjkService';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import {
  InteractionTwoTone,
  ContactsTwoTone,
  ControlTwoTone,
  GoldTwoTone,
} from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from '../../../utils/fetch';

import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;

const lxData = [
  { value: '1', label: '数据同步' },
  { value: '2', label: '用户同步' },
  { value: '3', label: '组织机构同步' },
  { value: '4', label: '数据导入到表' },
  { value: '5', label: 'AD域数据同步' },
  { value: '6', label: '温湿度远程数据同步' },
  { value: '7', label: '档案库到编研库同步' },
  { value: '8', label: 'ASIP包更新' },
  { value: '9', label: 'EEP包更新' },
];
const dbData = [
  { value: 'ORACLE', label: 'ORACLE' },
  { value: 'SQLSERVER', label: 'SQLSERVER' },
  { value: 'MYSQL', label: 'MYSQL' },
  { value: 'H2', label: 'H2' },
  { value: 'KINGBASE8', label: '人大金仓' },
  { value: 'DM', label: '达梦' },
];
const cslx = [
  { value: '1', label: 'ftp传输' },
  { value: '2', label: '存储二进制传输' },
  { value: '3', label: 'AWS3模式' },
];
const sfyw = [
  { value: '是', label: '是' },
  { value: '否', label: '否' },
];
const jklxData = [
  { value: '1', label: 'ASIP包' },
  { value: '2', label: '中间库数据' },
  { value: '3', label: 'EEP包' },
  { value: '4', label: 'EEP中间库数据' },
];

/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const span = 8;
const _width = 240;

const Jkpz = observer((props) => {
  const ref = useRef();
  const [checkrow, setCheckRow] = useState();
  const [zjklist, setZjklist] = useState<
    Array<{ id: string; label: string; value: string }>
  >([]);
  const [mblist, setMblist] = useState<
    Array<{ id: string; label: string; value: string }>
  >([]);
  const [visible, setVisiblezddy] = useState(false);
  const [recrodid, setRecrodid] = useState<string>('');
  const [jkpname, setJkpname] = useState<string>('');
  const [mbid, setMbid] = useState<string>('');
  const [zjkid, setZjkid] = useState<string>('');
  const [midtbname, setMidtbname] = useState<string>('');
  const [asipjkpzlist, setAsipjkpzlist] = useState<
    Array<{ id: string; label: string; value: string }>
  >([]);
  const [isqycfjy, setIsqycfjy] = useState(true);

  const tableProp: ITable = {
    searchCode: 'name',
    labelColSpan: 8,
    rowSelection: {
      type: 'checkbox',
    },
    enableBatchDelete: true,
    onEditClick: (form, record) => {
      if (record.sqjcqy == 'Y') {
        record.sqjcqy = true;
      } else {
        record.sqjcqy = false;
      }
      if (record.scdh == 'Y') {
        record.scdh = true;
      } else {
        record.scdh = false;
      }
      if (record.qycfjy == 'Y') {
        record.qycfjy = true;
        setIsqycfjy(false);
      } else {
        record.qycfjy = false;
        setIsqycfjy(true);
      }
      if (record.afterdele == '是') {
        record.afterdele = true;
      } else {
        record.afterdele = false;
      }
      form.setFieldsValue(record);
    },
  };

  const onButtonClick = (val) => {
    if (val.length != 1) {
      message.error('操作失败,请选择一行数据');
    } else {
      setRecrodid(val[0].id);
      setJkpname(val[0].name);
      setMbid(val[0].mb);
      setZjkid(val[0].zjkid);
      setMidtbname(val[0].midtbname);
      setVisiblezddy(true);
    }
  };

  const onbatchDeleteClick = async (val) => {
    if (val.length == 0) {
      message.error('操作失败,请至少选择一行数据');
    } else {
      const tableStores = ref.current?.getTableStore();
      tableStores.batchDelete(val);
    }
  };

  const handleCancel = () => {
    setVisiblezddy(false);
  };

  const handleOk = () => {
    setVisiblezddy(false);
  };
  const onNumberChange = (e) => {
    debugger;
    if (e.target.checked) {
      setIsqycfjy(false);
    } else {
      setIsqycfjy(true);
    }
  };
  const customForm = () => {
    return (
      <>
        <Row gutter={20}>
          <Col span={span}>
            <Form.Item
              label="接口类型:"
              name="jklx"
              required
              rules={[{ required: true, message: '请选择接口类型' }]}
            >
              <Select
                allowClear
                placeholder="接口类型"
                options={jklxData}
                style={{ width: _width }}
              />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item
              label="中间库"
              name="zjkid"
              required
              rules={[{ required: true, message: '请选择中间库' }]}
            >
              <Select
                allowClear
                placeholder="中间库"
                options={zjklist}
                style={{ width: _width }}
              />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item
              label="名称:"
              name="name"
              required
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item
              label="模版"
              name="mb"
              required
              rules={[{ required: true, message: '请选择模版' }]}
            >
              <Select
                allowClear
                placeholder="模版"
                options={mblist}
                style={{ width: _width }}
              />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item
              label="附件传输类型"
              name="lx"
              required
              rules={[{ required: true, message: '请选择附件传输类型' }]}
            >
              <Select
                allowClear
                placeholder="附件传输类型"
                options={cslx}
                style={{ width: _width }}
              />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item
              label="中间FTP地址:"
              name="ftpip"
              required
              rules={[{ required: true, message: '请输入中间FTP地址' }]}
            >
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item
              label="中间FTP端口:"
              name="ftpport"
              required
              rules={[{ required: true, message: '请输入中间FTP端口' }]}
            >
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item
              label="中间FTP用户名称:"
              name="ftpuname"
              required
              rules={[{ required: true, message: '请输入中间FTP用户名称' }]}
            >
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item
              label="中间FTP密码:"
              name="ftppass"
              required
              rules={[{ required: true, message: '请输入中间FTP密码' }]}
            >
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="中间表表名:" name="midtbname">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="中间表ID字段名:" name="idfield">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Divider orientation="left" plain>
            {' '}
            原文信息
          </Divider>
          <Col span={span}>
            <Form.Item label="原文表名称:" name="midfiletbname">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="原文表ID字段:" name="fileidfield">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="原表条目表ID字段:" name="recidfield">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="原文表文件标题字段名:" name="filenamefield">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="原文表文件类型字段名:" name="filetypefield">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="原文表文件大小字段名:" name="filesizefield">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="原文表文件路径字段名:" name="filepathfield">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="原文表文件后缀名字段名:" name="fileextfield">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="原文表文件内容字段名:" name="filewjnrfield">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="删除原文:" name="afterdele">
              <Checkbox style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Divider orientation="left" plain>
            {' '}
            EEP信息
          </Divider>
          <Col span={span}>
            <Form.Item label="EEP包表名:" name="asipbmc">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="EEP包ID字段名:" name="asipid">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="EEP包标题字段名:" name="asipname">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="EEP包路径字段名:" name="asippatch">
              <Input allowClear style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="EEP数据接口" name="asipjkpzid">
              <Select
                placeholder="ASIP数据接口"
                options={asipjkpzlist}
                style={{ width: _width }}
              />
            </Form.Item>
          </Col>
          <Divider orientation="left" plain>
            {' '}
            条目重复校验信息
          </Divider>
          <Col span={span}>
            <Form.Item
              label="启用重复校验:"
              valuePropName="checked"
              name="qycfjy"
            >
              <Checkbox style={{ width: _width }} onChange={onNumberChange}>
                <p style={{ color: 'red' }}>
                  (启用后若重复则update,反之则insert)
                </p>
              </Checkbox>
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="校验条件字段1:" name="jytjzd1">
              <Input allowClear style={{ width: _width }} disabled={isqycfjy} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="校验条件字段2:" name="jytjzd2">
              <Input allowClear style={{ width: _width }} disabled={isqycfjy} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="校验条件字段3:" name="jytjzd3">
              <Input allowClear style={{ width: _width }} disabled={isqycfjy} />
            </Form.Item>
          </Col>
          <Divider orientation="left" plain>
            {' '}
            其它信息
          </Divider>

          <Col span={span}>
            <Form.Item label="生成档号:" valuePropName="checked" name="scdh">
              <Checkbox style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item
              label="启用四性检测:"
              valuePropName="checked"
              name="sqjcqy"
            >
              <Checkbox style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}></Col>
          <Col span={span}>
            <Form.Item label="维护时间:" name="whsj" initialValue={getDate}>
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
              <Input disabled style={{ width: _width }} />
            </Form.Item>
          </Col>
          <Col span={span}>
            <Form.Item label="接口ID:" name="fid" hidden>
              <Input disabled style={{ width: 300 }} />
            </Form.Item>
          </Col>
        </Row>
        {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
      </>
    );
  };
  // 全局功能按钮
  const customAction = (store: EpsTableStore, ids: any[]) => {
    return [
      <>
        <Button type="primary" onClick={() => onButtonClick(ids)}>
          字段对应
        </Button>
      </>,
    ];
  };

  // 创建右侧表格Store实例

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return <></>;
  };
  useEffect(() => {
    const queryZjkList = async (params) => {
      let url = '/api/eps/tyjk/jkpz/queryForZjkList';
      const response = await fetch.post(url, params);
      if (response.status === 200) {
        if (response.data.length > 0) {
          let zjkData = response.data.map((o) => ({
            id: o.id,
            label: o.name,
            value: o.id,
          }));
          setZjklist(zjkData);
        } else {
          setZjklist(response.data);
        }
      }
    };
    const querymbkList = async (params) => {
      let url = "/api/eps/control/main/mb/queryForPage?notree='Y'";
      const response = await fetch.post(url, params);
      if (response.status === 200) {
        if (response.data.length > 0) {
          let mbData = response.data.map((o) => ({
            id: o.id,
            label: o.mc,
            value: o.id,
          }));
          setMblist(mbData);
        } else {
          setMblist(response.data);
        }
      }
    };
    const querysjjkList = async (params) => {
      let url = '/api/eps/tyjk/jkpz/findList?jklx=3';
      const response = await fetch.post(url, params);
      if (response.status === 200) {
        if (response.data.length > 0) {
          let mbData = response.data.map((o) => ({
            id: o.id,
            label: o.name,
            value: o.id,
          }));
          setAsipjkpzlist(mbData);
        } else {
          setAsipjkpzlist(response.data);
        }
      }
    };
    queryZjkList({});
    querymbkList({});
    querysjjkList({});
  }, []);

  const source: EpsSource[] = [
    {
      title: '中间库',
      code: 'zjkid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let zlxlist = zjklist;
        let aa = zlxlist.filter((item) => {
          return item.value === text;
        });
        return aa[0]?.label;
      },
    },
    {
      title: '名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '类型',
      code: 'jklx',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let jlxlist = jklxData;
        let aa = jlxlist.filter((item) => {
          return item.value === text;
        });
        return aa[0]?.label;
      },
    },
    {
      title: '模版',
      code: 'mb',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let lxlist = mblist;
        let aa = lxlist.filter((item) => {
          return item.value === text;
        });
        return aa[0]?.label;
      },
    },
    {
      title: '附件传输类型',
      code: 'lx',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let fslxlist = cslx;
        let aa = fslxlist.filter((item) => {
          return item.value === text;
        });
        return aa[0]?.label;
      },
    },
    {
      title: '中间ftp地址',
      code: 'ftpip',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '中间ftp端口',
      code: 'ftpport',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '中间FTP用户名称',
      code: 'ftpuname',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '中间表表名',
      code: 'midtbname',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '中间表ID字段名',
      code: 'idfield',
      align: 'center',
      formType: EpsFormType.Input,
    },
    {
      title: '原文表名称',
      code: 'midfiletbname',
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
  const title: ITitle = {
    name: '数据库接口配置',
  };

  const searchFrom = () => {
    return (
      <>
        <Form.Item label="中间库" className="form-item" name="zjkid">
          {' '}
          <Select allowClear placeholder="中间库" options={zjklist} />
        </Form.Item>
        <Form.Item label="接口类型" className="form-item" name="jklx">
          <Select allowClear placeholder="接口类型" options={jklxData} />
        </Form.Item>
      </>
    );
  };

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        ref={ref}
        source={source} // 组件元数据，必填
        treeService={zjkService} // 左侧树 实现类，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={jkpzService} // 右侧表格实现类，必填
        formWidth={1380}
        searchForm={searchFrom}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}
        customAction={customAction}
      ></EpsPanel>
      <Modal
        title="字段对应"
        visible={visible}
        onOk={() => handleOk()}
        onCancel={() => handleCancel()}
        width="1380px"
      >
        <div style={{ height: '500px' }}>
          <Zddy
            jkpzid={recrodid}
            jkpname={jkpname}
            mbid={mbid}
            zjkid={zjkid}
            midtbname={midtbname}
          />
        </div>
      </Modal>
    </>
  );
});

export default Jkpz;

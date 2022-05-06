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
  Badge,
  Col,
  Row,
  Tooltip,
} from 'antd';
import fetch from '@/utils/fetch';
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
  FolderOutlined,
} from '@ant-design/icons';
const { RangePicker } = DatePicker;
const { confirm } = Modal;

import { useForm } from 'antd/lib/form/Form';
import YwzdgzService from './ywzdgzService';

interface IProp {
  store: EpsTableStore;
  record: {};
}

//
const Ywzhgz = observer((props: IProp) => {
  console.log('gzprops:', props);

  const [umid, setUmid] = useState('');

  const [visible, setVisible] = useState(false);

  const [gzVisible, setGzVisible] = useState(false);

  const [datmid, setDatmid] = useState('');

  const [checkRow, setCheckRow] = useState({});

  const [formzd] = Form.useForm();

  const ref = useRef();

  // 创建右侧表格Store实例
  const [tableStore, setTableStore] = useState<EpsTableStore>(
    new EpsTableStore(YwzdgzService),
  );

  const tableProp: ITable = {
    tableSearch: false,
    disableEdit: true,
    disableDelete: true,
    disableAdd: true,
    disableCopy: true,
    rowSelection: { type: 'radio' },
  };

  const ywzdgzStore = useLocalObservable(() => ({
    zcdate: '',
    gninfo: {},
    fjsc: false,
    mcdataSource: [],
    logCount: 0,
    rowdata: {},

    async queryForId(id) {
      const res = await fetch.post(
        '/api/eps/control/main/dazd/queryforDazdmxnr',
        this.params,
        {
          params: {
            datmid: props.record.id,
            id: id,
            ...this.params,
          },
        },
      );

      if (res && res.status === 200) {
        if (res.data.length > 0) {
          this.rowdata = res.data[0];
          setCheckRow(res.data[0]);
          debugger;
        } else {
          return;
        }
      }
    },

    async loadHistoryCount() {
      const response = await fetch.post(
        `/api/eps/control/main/dazd/queryforDazdmxnr?datmid=` + props.record.id,
      );
      if (response.status === 200) {
        this.logCount = response.data.length;
      }
    },

    async updateDazdmxnr(data) {
      const res = await fetch.post(
        '/api/eps/control/main/dazd/updateDazdmxnr',
        this.params,
        {
          params: {
            tmid: props.record.id,
            wtms: data.wtms,
            zdnr: data.zdnr,
            gznr: data.gznr,
            ids: data.id,
            bmc: props.record.bmc,
            wtlx: data.wtlx,
            gzrid: SysStore.getCurrentUser().id,
            gzr: SysStore.getCurrentUser().yhmc,
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

  useEffect(() => {
    setTableStore(ref.current?.getTableStore());
    ywzdgzStore.loadHistoryCount();
  }, []);

  useEffect(() => {
    setDatmid({ datmid: props.record.id });
  }, [props.record.id]);

  const tzsave = async (ids, store) => {
    if (ids.length > 0) {
      const res = await fetch.post(
        '/api/eps/control/main/dazd/queryforDazdmxnr?datmid=' +
          props.record.id +
          '&id=' +
          store.checkedRows[0].id,
      );
      if (res && res.status === 200) {
        if (res.data.length > 0) {
          const rowdata = res.data[0];
          formzd.setFieldsValue(rowdata);
          //   setCheckRow(res.data[0]);
          debugger;
        } else {
          return;
        }
      }

      //   setCheckRow(store.checkedRows[0]);
      setGzVisible(true);
    } else {
      message.warning('操作失败,请至少选择一行数据!');
      return;
    }
  };

  const customAction = (store: EpsTableStore, ids: any[]) => {
    return [
      <>
        {/* <EpsReportButton store={store} umid={umid} /> */}
        {/* <EpsReportButton store={store} umid={umid} /> */}

        <Button
          type="primary"
          onClick={() => tzsave(ids, store)}
          icon={<SaveOutlined />}
        >
          更正
        </Button>
      </>,
    ];
  };

  const span = 24;
  const _width = 240;

  // 自定义表单

  const source: EpsSource[] = [
    {
      title: '更正状态',
      code: 'gzzt',
      align: 'center',
      fixed: 'left',
      width: 80,
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text) {
          if (text === '1') {
            return (text = '未更正');
          } else if (text === '2') {
            return (text = '已更正');
          }
        } else {
          return (text = '未知');
        }
      },
    },
    {
      title: '问题类型',
      code: 'wtlx',
      align: 'center',
      ellipsis: true, // 字段过长自动东隐藏
      width: 120,
      formType: EpsFormType.Input,
    },
    {
      title: '问题描述',
      align: 'center',
      code: 'wtms',
      width: 180,
      ellipsis: true,
      formType: EpsFormType.Select,
    },
    {
      title: '提出人',
      code: 'whr',
      width: 80,
      align: 'center',
      formType: EpsFormType.Input,
      /* defaultSortOrder: 'descend',
         sorter: (a, b) => a.whr - b.whr,*/
    },
    {
      title: '提出时间',
      code: 'whsj',
      width: 100,
      align: 'center',
      formType: EpsFormType.None,
    },
  ];
  const title = {
    name: '指导意见更正',
  };

  const onFinish = (values: any) => {
    formzd
      .validateFields()
      .then((data) => {
        ywzdgzStore
          .updateDazdmxnr(data)
          .then((res) => {
            ref.current
              ?.getTableStore()
              .findByKey('', 1, 50, { datmid: props.record.id });
            formzd.resetFields();
            setGzVisible(false);
          })
          .catch((err) => {
            message.error(err);
          });
      })
      .catch((err) => {
        message.error(err);
      });
  };

    return (
        <>
        <Tooltip title="指导意见">
            <a key={`fileView_${props.record.id}`} style={{ width: 22, margin: "0 10px" }} onClick={()=>setVisible(true)}>

                <Badge size="small" count={ywzdgzStore.logCount}>
                 <FolderOutlined style={{ color: "#55acee" }} />
                </Badge>
                </a>
            </Tooltip >
            <Modal
                title="指导意见更正"
                centered
                visible={visible}
                footer={null}
                width={800}

              //  style={{maxHeight: "500px",height:"500px"}}
                onCancel={() => setVisible(false)}
            >
        <div style={{height: '100%'}}>
        <EpsPanel
            title={title}
            source={source}
            tableProp={tableProp}
            formWidth={600}
            initParams={datmid}
            ref={ref}
            //customTableAction={customTableAction}                  // 高级搜索组件，选填
            tableService={YwzdgzService}
            //    customForm={customForm}
            customAction={customAction} // 自定义全局按钮（如新增、导入、全局打印等），选填
          />
        </div>
      </Modal>
      {/* 更正 */}
      <Modal
        title="更正内容"
        centered
        visible={gzVisible}
        footer={null}
        width={500}
        style={{ maxHeight: '500px', height: '500px' }}
        onCancel={() => {
          setGzVisible(false);
          formzd.resetFields();
          setCheckRow({});
        }}
      >
        <div style={{ height: '100%' }}>
          <Form
            form={formzd}
            onFinish={onFinish}
         //   initialValues={checkRow}
            name="form" >

              <Row>
              <Col span={24}  >
                  <Form.Item
                    label="&nbsp;&nbsp;问题类型"
                    name="wtlx"
                  >
                     {/* <Select    placeholder="问题类型" className="ant-select"   options={DazdStore.mcdataSource}
                     style={{width:  '98%'}}/> */}
                  <input disabled style={{ width: '98%' }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="&nbsp;&nbsp;问题描述" name="wtms">
                  <Input disabled style={{ width: '98%' }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="&nbsp;&nbsp;指导内容" name="zdnr">
                  <Input.TextArea
                    disabled
                    //    placeholder="请输入对利用目的详细说明"
                    rows={3}
                    style={{ width: '98%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="更正内容"
                  name="gznr"
                  rules={[{ required: true, message: '请填写详细内容!' }]}
                >
                  <Input.TextArea
                    //    placeholder="请输入对利用目的详细说明"
                    rows={3}
                    style={{ width: '98%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="id" name="id" hidden>
                  <Input hidden />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <div
                  className="btns"
                  style={{
                    textAlign: 'right',
                    height: '30px',
                    marginTop: '10px',
                    marginRight: '10px',
                    padding: ' 0 20px',
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ fontSize: '12px' }}
                    icon={<SaveOutlined />}
                  >
                    保存
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button
                    type="primary"
                    onClick={() => {
                      setGzVisible(false);
                      formzd.resetFields();
                      setCheckRow({});
                    }}
                    style={{ fontSize: '12px' }}
                    icon={<SaveOutlined />}
                  >
                    关闭
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
});
export default Ywzhgz;

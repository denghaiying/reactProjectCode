import { EpsGroupPanel } from '../../../eps/inner/panel/EpsGroupPanel';
import EpsFormType from '@/eps/commons/EpsFormType';
import { useState, useEffect, useRef } from 'react';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Button,
  Modal,
  message,
  Table,
  notification,
} from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import { EpsSource, ITitle, ITable } from '@/eps/commons/declare';
import XshtService from './XshtService';
import moment from 'moment';
import SysStore from '../../../stores/system/SysStore';
import XshtmxService from './XshtmxService';
import { CheckCircleOutlined } from '@ant-design/icons';
import fetch from '../../../utils/fetch';
import { WflwButtons } from '../../../components/Wflw';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import WldwService from '../Wldw/WldwService';
import materialService from '../Material/materialService';
import { ProColumns } from '@ant-design/pro-table';
import { SearchOutlined } from '@ant-design/icons';
import './index.less';
/**
 * 内部管理---销售合同登记页面
 */

const Xsht = observer((props) => {
  type DataSourceType = {
    id: React.Key;
    title?: string;
    decs?: string;
    state?: string;
    created_at?: string;
    children?: DataSourceType[];
  };
  const ref = useRef();
  const { RangePicker } = DatePicker;
  // 获取当前用户id,当前用户名称和维护时间
  const whr = SysStore.getCurrentUser().yhmc;
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');
  const [initParams, setInitParams] = useState({});

  //弹窗中物料表格数据
  const [wlTableData, setWlTableData] = useState([]);
  //弹窗中客户表格数据
  const [khTableData, setKhTableData] = useState([]);

  //控制物料信息弹框是否可见
  const [wlVisible, setWlvisible] = useState(false);
  //控制客户信息弹框是否可见
  const [khVisible, setKhvisible] = useState(false);

  //  表格选中行时，记录当前行数据
  const [selectedRowData, setSelectedRowData] = useState();

  //控制流程提交按钮的显隐
  const [disableDelete, setDisabledelete] = useState(false);

  const [disableSave, setDisablesave] = useState(true);

  // 销售合同登记的本地store
  const XshtStore = useLocalObservable(() => ({
    //销售人员数据源
    yhData: [],
    yhSelectData: [],
    yhmc: '',
    //销售部门id，即单位id
    bmid: '',
    bmmc: '',
    //查询条件---销售部门数据源
    orgSelectData: [],
    //流程是否启用
    lcData: false,

    //查询用户数据
    async findYhData(params) {
      const response = await fetch.get(
        '/api/eps/control/main/yh/queryForList',
        { params },
      );
      if (response.status === 200) {
        if (response.data.length > 1) {
          //查询全部用户数据
          this.yhData = response.data;
          this.yhSelectData = response.data.map((item) => ({
            value: item.id,
            label: item.yhmc,
          }));
        }

        //根据用户id查询用户数据
        if (params.hasOwnProperty('id')) {
          this.bmid = response.data[0].bmid;
          this.bmmc = response.data[0].orgmc;
          this.yhmc = response.data[0].yhmc;
        }
      }
    },

    //查询组织机构数据
    async findOrgData(params) {
      const response = await fetch.get('/api/eps/nbgl/xsht/findOrg', {
        params,
      });
      if (response.status === 200) {
        if (response.data.length > 1) {
          //查询全部组织机构数据
          this.orgSelectData = response.data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
        }
      }
    },

    //查询流程是否启用
    async findLc(params) {
      const response = await fetch.get('/api/eps/nbgl/xsht/findlc', {
        params,
      });
      if (response.status === 200) {
        if (response.data === 'Y') {
          this.lcData = true;
        }
      }
    },
    //查询物料数据
    async findWlData(params) {
      const response = await fetch.get('/api/eps/nbgl/material/list/', {
        params: { params: params },
      });
      if (response && response.status === 200) {
        if (response.data.length > 0) {
          setWlTableData(response.data);
        } else {
          setWlTableData([]);
        }
      }
    },
    //查询客户数据(往来单位)
    async findKhData(params) {
      const response = await fetch.get('/api/eps/nbgl/wldw/list/', {
        params: { params: params },
      });
      if (response && response.status === 200) {
        if (response.data.length > 0) {
          setKhTableData(response.data);
        } else {
          setKhTableData([]);
        }
      }
    },
  }));

  useEffect(() => {
    XshtStore.findYhData({});
    XshtStore.findOrgData({});
    XshtStore.findLc({});
  }, []);

  //主表按钮和查询框区域(新增、编辑、删除按钮默认可使用)
  const tableProp: ITable = {
    rowSelection: {
      type: 'radio',
    },
  };

  const onQdrqChange = (val, vals) => {
    let startDate;
    let endDate;
    if (vals && vals.length !== 0) {
      startDate = moment(vals[0]).format('YYYY-MM-DD');
      endDate = moment(vals[1]).format('YYYY-MM-DD');
      setInitParams({ startDate: startDate, endDate: endDate });
    }
  };
  //主表高级搜索框
  const searchForm = () => {
    return (
      <>
        <Form.Item label="合同号:" name="xshtcode">
          <Input allowClear placeholder="请输入合同号" />
        </Form.Item>
        <Form.Item label="销售员:" name="yhmc">
          <Input allowClear placeholder="请输入销售员" />
        </Form.Item>
        <Form.Item label="销售部门:" name="bmid">
          <Select
            allowClear
            placeholder="请选择销售部门"
            options={XshtStore.orgSelectData}
            showSearch
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
          />
        </Form.Item>
        <Form.Item label="签订日期:" name="xshtqdrq">
          <RangePicker allowClear format="YYYY-MM-DD" onChange={onQdrqChange} />
        </Form.Item>
      </>
    );
  };
  //主表表单名称
  const title: ITitle = {
    name: '销售合同登记',
  };

  const onBeforeAction = async (action) => {
    if (!selectedRowData || selectedRowData.length === 0) {
      notification.open({
        message: '提示',
        description: '请选择一条数据',
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
      return false;
    }
    return true;
  };

  const onAfterAction = () => {
    const indexStroe = ref.current?.getTableStore();
    indexStroe.findByKey(indexStroe.key, indexStroe.page, indexStroe.size, {});
    return message.success('操作成功');
  };

  const getWfid = () => {
    return 'nbgl_xsht';
  };

  const getWfinst = () => {
    if (selectedRowData && selectedRowData.length > 0) {
      return selectedRowData[0].wfinst;
    }
    return '';
  };

  //form表单值
  const [fm, setFm] = useState();
  //控制主表单中各字段是否能编辑
  const [disabled, setDisabled] = useState(false);
  const qronClick = () => {
    fm?.setFieldsValue({ xshtstatus: '1' });
  };

  // 自定义主表功能按钮(确认按钮)
  const customAction = (store, row) => {
    return [
      <>
        {!XshtStore.lcData && (
          <Button
            type="primary"
            style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }}
            icon={<CheckCircleOutlined />}
            disabled={disableSave}
            onClick={qronClick}
          >
            确认
          </Button>
        )}
        {XshtStore.lcData && !disableDelete && (
          <span id={'xsht-wflwbuttons'}>
            <WflwButtons
              offset={[18, 0]}
              type={['submit', 'return', 'reject']}
              wfid={getWfid()}
              wfinst={getWfinst()}
              onBeforeAction={onBeforeAction}
              onAfterAction={onAfterAction}
            />
          </span>
        )}
      </>,
    ];
  };

  //定义主表table表格字段
  const source: EpsSource[] = [
    {
      title: '状态',
      code: 'xshtstatus',
      align: 'center',
      formType: EpsFormType.Select,
      width: 100,
      fixed: 'left',
      render: (text, record, index) => {
        if (text === '0') {
          return '初始';
        } else if (text === '1') {
          return '确认';
        } else if (text === '2') {
          return '完成';
        }
      },
    },
    {
      title: '合同号',
      code: 'xshtcode',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '合同名称',
      code: 'xshtname',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '客户',
      code: 'wldwname',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '销售员',
      code: 'yhid',
      align: 'center',
      formType: EpsFormType.Select,
      width: 80,
      render: (text, record, index) => {
        const result = XshtStore.yhData?.filter((item) => item.id === text);
        return result[0] ? result[0].yhmc : '';
      },
    },
    {
      title: '销售部门',
      code: 'bmmc',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '签订日期',
      code: 'xshtqdrq',
      align: 'center',
      formType: EpsFormType.DatePicker,
      width: 120,
    },
    {
      title: '计划完工日期',
      code: 'xshtjhwgrq',
      align: 'center',
      formType: EpsFormType.DatePicker,
      width: 120,
    },
    {
      title: '总金额',
      code: 'xshtzje',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      width: 180,
    },
    {
      title: '备注',
      code: 'xshtbz',
      align: 'center',
      formType: EpsFormType.TextArea,
      width: 100,
    },
    {
      title: '合同重要条款',
      code: 'xshtzytk',
      align: 'center',
      formType: EpsFormType.TextArea,
      width: 150,
      fixed: 'right',
    },
  ];

  //定义客户弹窗table表格字段 --- 客户信息
  const khModalTableColumns = [
    {
      title: '客户编码',
      dataIndex: 'wldwcode',
      align: 'center',
      width: 80,
    },
    {
      title: '客户名称',
      dataIndex: 'wldwname',
      align: 'center',
      width: 120,
    },
  ];
  //客户信息弹框中的双击确认
  const onkhDoubleClickConfirm = (record) => {
    setKhvisible(false);
    fm?.setFieldsValue({ wldwid: record.id });
    fm?.setFieldsValue({
      wldwname: record.wldwcode + '|' + record.wldwname,
    });
  };

  // 自定义弹框表单---主表
  const customForm = (text, form) => {
    setFm(form);
    // 销售人员切换时带出销售部门
    const onYhChange = (value, record) => {
      //根据用户id查询用户数据
      XshtStore.findYhData({ id: value }).then(() => {
        form.setFieldsValue({ bmmc: XshtStore.bmmc });
        form.setFieldsValue({ yhmc: XshtStore.yhmc });
        form.setFieldsValue({ bmid: XshtStore.bmid });
      });
    };

    //客户的查询按钮
    const onKhSearch = (value) => {
      XshtStore.findKhData({ wldwkh: '1' }).then(() => setKhvisible(true));
      setFm(form);
    };
    return (
      <>
        <Row>
          <Col span={6} style={{ height: '32px' }}>
            <Form.Item label="合同号:" name="xshtcode">
              <Input allowClear placeholder="自动生成" disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="合同名称:" name="xshtname">
              <Input allowClear disabled={disabled} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="客户:"
              name="wldwname"
              // rules={[
              //   //输入的客户名称的校验
              //   {
              //     async validator(_, value, callback) {
              //       if(!value){
              //         fm?.setFieldsValue({
              //           wldwid:  undefined,
              //           wldwname: undefined,
              //         });
              //          return
              //       }
              //       const param = {
              //         //类型为1的表示客户
              //         params: { wldwKh: '1', wldwname: value, source: 'add' },
              //       };
              //       return new Promise(async (resolve, reject) => {
              //         await fetch
              //           .get('/api/eps/nbgl/wldw/list/', { params: param })
              //           .then((res) => {
              //             if (res.data.length === 0) {
              //               reject('客户不存在,请点击搜索选择客户');
              //             } else {
              //               //存在的情况下
              //               fm?.setFieldsValue({
              //                 wldwid:  res.data[0].id,
              //                 wldwname: res.data[0].wldwcode + '|' + res.data[0].wldwname,
              //               });
              //               return resolve(res.data[0].wldwcode + '|' + res.data[0].wldwname);
              //             }
              //           });
              //       });
              //     },
              //   },
              // ]}
            >
              <Input.Search
                // allowClear
                onSearch={(val) => onKhSearch(val)}
                disabled={disabled}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="状态:" name="xshtstatus">
              <Select disabled>
                <Select.Option value="0">初始</Select.Option>
                <Select.Option value="1">确认</Select.Option>
                <Select.Option value="2">完成</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item label="销售员:" name="yhid">
              <Select
                options={XshtStore.yhSelectData}
                onChange={onYhChange}
                disabled={disabled}
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="销售部门:" name="bmmc">
              <Input allowClear disabled={disabled} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="签订日期:" name="xshtqdrq">
              <DatePicker disabled={disabled} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="计划完工日期:" name="xshtjhwgrq">
              <DatePicker disabled={disabled} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Row>
              <Col span={24}>
                <Form.Item label="总金额:" name="xshtzje">
                  <Input allowClear disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="备注:" name="xshtbz">
                  <Input.TextArea
                    style={{ height: '32px' }}
                    disabled={disabled}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="重要条款:"
                  name="xshtzytk"
                  labelCol={{ span: 3 }}
                >
                  <Input.TextArea
                    style={{ height: '80px' }}
                    disabled={disabled}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={24}>
                <Form.Item label="维护人:" name="whr">
                  <Input allowClear disabled defaultValue={whr} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="维护时间:" name="whsj">
                  <Input allowClear defaultValue={whsj} disabled />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col span={6}>
            <Form.Item label="销售员名称:" name="yhmc" hidden>
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="销售部门id:" name="bmid" hidden>
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="客户id:" name="wldwid" hidden>
              <Input allowClear />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  // 明细表的含税单价
  let hsdj: number;
  //明细表的数量
  let sl: number;
  let materialid: string;
  let materialcode: string;
  let materialname: string;
  let materialggxh: string;
  let materialrate: string;
  let materialjldw: string;

  //物料弹窗表格字段
  const wlModalTableColumns = [
    {
      title: '物料编码',
      dataIndex: 'materialcode',
      align: 'center',
      width: 80,
    },
    {
      title: '物料名称',
      dataIndex: 'materialname',
      align: 'center',
      width: 120,
    },
  ];
  //物料弹窗信息的查询按钮
  const onWlSearch = (value) => {
    XshtStore.findWlData({}).then(() => {
      setWlvisible(true);
    });
  };
  //明细表字段
  const detailSource: ProColumns<DataSourceType>[] = [
    {
      title: '物料编码',
      dataIndex: 'materialcode',
      align: 'center',
      valueType: 'text',
      width: 160,
      ellipsis: true,
      renderFormItem: (_, config, data) => (
        <Input
          addonAfter={
            <SearchOutlined
              onClick={(val) => onWlSearch(val)}
              style={{ color: 'rgba(0, 0, 0, 0.45)' }}
            />
          }
          placeholder="请直接查询"
          readOnly
        />
      ),
      renderText: (
        text: any,
        record: Entity,
        index: number,
        action: ProCoreActionType,
      ) => {
        if (
          materialcode != undefined &&
          record['materialid'] === undefined &&
          record['materialcode'] == undefined
        ) {
          text = materialcode;
          record['materialid'] = materialid;
          record['materialcode'] = materialcode;
        }
        return text;
      },
    },

    {
      title: '物料名称',
      dataIndex: 'materialname',
      align: 'center',
      valueType: 'text',
      width: 250,
      fieldProps: (form, { rowKey, rowIndex }) => {
        return {
          readOnly: true,
        };
      },
      renderText: (
        text: any,
        record: Entity,
        index: number,
        action: ProCoreActionType,
      ) => {
        if (materialname != undefined && record['materialname'] == undefined) {
          text = materialname;
          record['materialname'] = materialname;
        }
        return text;
      },
    },
    {
      title: '规格型号',
      dataIndex: 'materialggxh',
      align: 'center',
      valueType: 'text',
      width: 100,
      fieldProps: (form, { rowKey, rowIndex }) => {
        return {
          readOnly: true,
        };
      },
      renderText: (
        text: any,
        record: Entity,
        index: number,
        action: ProCoreActionType,
      ) => {
        if (materialggxh != undefined && record['materialggxh'] == undefined) {
          text = materialggxh;
          record['materialggxh'] = materialggxh;
        }
        return text;
      },
    },
    {
      title: '税率%',
      dataIndex: 'xshtmxrate',
      align: 'center',
      valueType: () => ({
        type: 'percent',
        precision: 1,
      }),
      width: 80,
      renderText: (
        text: any,
        record: Entity,
        index: number,
        action: ProCoreActionType,
      ) => {
        if (materialrate != undefined && record['xshtmxrate'] == undefined) {
          text = materialrate;
          record['xshtmxrate'] = materialrate;
        }
        return text;
      },
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '计量单位',
      dataIndex: 'materialjldw',
      align: 'center',
      valueType: 'text',
      width: 80,
      fieldProps: (form, { rowKey, rowIndex }) => {
        return {
          readOnly: true,
        };
      },
      renderText: (
        text: any,
        record: Entity,
        index: number,
        action: ProCoreActionType,
      ) => {
        if (materialjldw != undefined && record['materialjldw'] == undefined) {
          text = materialjldw;
          record['materialjldw'] = materialjldw;
        }
        return text;
      },
    },
    {
      title: '数量',
      dataIndex: 'xshtmxcount',
      align: 'center',
      valueType: 'digit',
      width: 120,
      renderText: (
        text: any,
        record: Entity,
        index: number,
        action: ProCoreActionType,
      ) => {
        if (record.hasOwnProperty('id')) {
          sl = text;
        }
        return text;
      },
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '含税单价',
      dataIndex: 'xshtmxhsdj',
      align: 'center',
      valueType: 'money',
      width: 140,
      renderText: (
        text: any,
        record: Entity,
        index: number,
        action: ProCoreActionType,
      ) => {
        if (record.hasOwnProperty('id')) {
          hsdj = text;
        }
        return text;
      },
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '含税金额',
      dataIndex: 'xshtmxhsje',
      align: 'center',
      valueType: 'money',
      width: 140,
      fieldProps: (form, { rowKey, rowIndex }) => {
        return {
          readOnly: true,
        };
      },
      renderText: (
        text: any,
        record: Entity,
        index: number,
        action: ProCoreActionType,
      ) => {
        if (sl !== undefined && hsdj !== undefined) {
          text = (sl * hsdj).toFixed(2);
          record['xshtmxhsje'] = Number((sl * hsdj).toFixed(2));
        }
        return text;
      },
    },
    {
      title: '备注',
      dataIndex: 'xshtmxbz',
      align: 'center',
      valueType: 'text',
      width: 200,
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 70,
      align: 'center',
      render: (text, record, _, action) => [
        <Button
          disabled={disabled}
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
          type="link"
          style={{ fontSize: '12px' }}
        >
          编辑
        </Button>,
      ],
    },
  ];

  //物料双击确认选择行
  const onWlDoubleClickConfirm = (record) => {
    materialid = record.id;
    materialcode = record.materialcode;
    materialname = record.materialname;
    materialggxh = record.materialggxh;
    materialrate = record.materialrate;
    materialjldw = record.materialjldw;
    setWlvisible(false);
  };

  return (
    <>
      <EpsGroupPanel
        title={title} // 组件标题，必填
        source={source} // 主表组件元数据，必填
        searchForm={searchForm} // 搜索查询框
        tableService={XshtService} // 主表实现类，必填
        customForm={customForm} // 主表的列表字段
        tableProp={tableProp} // 主表的表格设置属性
        detailService={XshtmxService} // 明细表的实现类
        detailSource={detailSource} // 明细表组件元数据，必填
        customAction={customAction} // 自定义按钮
        setDisabled={(value) => setDisabled(value)}
        setSelectedRowData={(value) => setSelectedRowData(value)}
        setDisabledelete={(value) => setDisabledelete(value)}
        setDisablesave={(value) => setDisablesave(value)}
        ref={ref}
        initParams={initParams}
      />
      <Modal
        title="客户信息"
        zIndex={1001}
        forceRender={true} //  强制渲染modal
        visible={khVisible}
        onCancel={() => setKhvisible(false)}
        width={1000}
        bodyStyle={{ height: 500 }}
        footer={false}
      >
        <Form id="kh-modal-table-seach-form">
          <Form.Item style={{ marginRight: 10 }}>
            <Input.Search
              allowClear
              onSearch={(val) => XshtStore.findKhData({ wldwname: val })}
              style={{ width: 300 }}
              placeholder="请输入客户名称"
            />
          </Form.Item>
        </Form>
        <Table
          id={'kh-modal-table'}
          dataSource={khTableData}
          scroll={{ y: 400 }}
          columns={khModalTableColumns}
          rowKey={'id'}
          bordered
          onRow={(record) => {
            return {
              onDoubleClick: () => onkhDoubleClickConfirm(record),
            };
          }}
        />
      </Modal>

      <Modal
        title="物料信息"
        zIndex={1001}
        forceRender={true} //  强制渲染modal
        visible={wlVisible}
        onCancel={() => setWlvisible(false)}
        width={1000}
        bodyStyle={{ height: 500 }}
        footer={false}
      >
        <Form id="wl-modal-table-seach-form">
          <Form.Item style={{ marginRight: 10 }}>
            <Input.Search
              allowClear
              onSearch={(val) => XshtStore.findWlData({ materialname: val })}
              style={{ width: 300 }}
              placeholder="请输入物料名称"
            />
          </Form.Item>
        </Form>
        <Table
          id={'wl-modal-table'}
          dataSource={wlTableData}
          scroll={{ y: 400 }}
          columns={wlModalTableColumns}
          rowKey={'id'}
          bordered
          onRow={(record) => {
            return {
              onDoubleClick: () => onWlDoubleClickConfirm(record),
            };
          }}
        />
      </Modal>
    </>
  );
});

export default Xsht;

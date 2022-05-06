import EpsFormType from '@/eps/commons/EpsFormType';
import { useEffect, useRef, useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Checkbox,
  Modal,
  Table,
  Row,
  Col,
} from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import ProjectService from './Service/ProjectService';
import fetch from '../../../utils/fetch';
import {
  ExclamationCircleOutlined,
  PlusCircleTwoTone,
} from '@ant-design/icons';
import XmzwhService from '../Xmzwh/Service/XmzwhService';
import OptrightStore from '@/stores/user/OptrightStore';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import './index.less';

/**
 * 项目管理
 */
const Project = observer((props: any) => {
  //权限按钮
  const umid = 'DPS003';
  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    ProjectStore.findWorktpl();
    ProjectStore.findMb();
    ProjectStore.findYhData('');
  }, []);
  const ref = useRef();
  //控制负责人弹框
  const [fzrVisible, setfzrvisible] = useState(false);
  //控制著录库弹窗是否可见
  const [sctmzlkVisible, setSctmzlkVisible] = useState(false);
  //form表单值
  const [fm, setFm] = useState();

  //提交条目著录库表单
  const onOKSctmzlk = () => {
    const param = {};
    param['xmid'] = ProjectStore.rowData[0]['xmid'];
    param['mbid'] = ProjectStore.rowData[0]['mbId'];
    param['id'] = ProjectStore.rowData[0]['id'];
    if (param['mbid'].indexOf(',') != -1) {
      param['mbid'] = param['mbid'].substring(0, param['mbid'].indexOf(','));
    }

    //是否为单机著
    param['isSingle'] = '否';
    const worktplId = ProjectStore.rowData[0]['worktplId'];

    ProjectStore.findProcess(worktplId)
      .then(() => {
        ProjectStore.processData.forEach((p) => {
          const isSingle = p.workctt.indexOf('0120');
          if (isSingle !== -1) {
            //如果包含单机著录
            param['isSingle'] = '是';
          }
        });
      })
      .then(() => {
        ProjectStore.addDak(param)
          .then((response) => {
            if (response && response.status == 201) {
              if (response.data === true) {
                setSctmzlkVisible(false);
                const tableStore = ref.current.getTableStore();
                tableStore.findByKey(
                  tableStore.key,
                  tableStore.page,
                  tableStore.size,
                  {},
                );
                ProjectStore.rowData[0]['sfczzlk'] = 'Y';
                return message.success('生成成功');
              } else {
                return message.error('生成失败');
              }
            } else {
              return message.error('生成失败');
            }
          })
          .catch((e) => {
            message.error(e.response.data);
          });
      });
  };

  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: true,
    disableCopy: true,
    searchCode: 'xmmc',
    disableAdd: !OptrightStore.hasRight(umid, 'SYS101'),
    disableEdit: !OptrightStore.hasRight(umid, 'SYS102'),
    disableDelete: !OptrightStore.hasRight(umid, 'SYS103'),
    rowSelection: {
      type: 'radio',
    },
    onAddClick: (form) => {
      ProjectStore.gzlcData = true;
      ProjectStore.sfxgData = false;
      ProjectStore.xmmcData = [];
      setFm(form);
    },
    onEditClick: (form, data) => {
      ProjectStore.xmmcData = data.xmmc;
      ProjectStore.sfzrData = data.mgnername;
      //当编辑的时候则把模板Id裁剪
      if (data['mbId'] != undefined && data['mbId'].indexOf(',') != -1) {
        data['jnmbId'] = data['mbId'].substring(
          data['mbId'].indexOf(',') + 1,
          data['mbId'].length,
        );
        data['mbId'] = data['mbId'].substring(0, data['mbId'].indexOf(','));
      }

      ProjectStore.gzlcData = true;
      const aa = ['0120', '0130', '0140'];
      ProjectStore.findProcess(data.worktplId).then(() => {
        ProjectStore.processData.forEach((p: any) => {
          const d: any[] = [];
          if (p.workctt.length > 3) {
            d.push(p.workctt.split(','));
            aa.forEach((a) => {
              d[0].forEach((e: string) => {
                if (e === a) {
                  return (ProjectStore.gzlcData = false);
                }
              });
            });
          } else {
            aa.forEach((a) => {
              if (a === p.workctt) {
                return (ProjectStore.gzlcData = false);
              }
            });
          }
        });
      });
      if (ProjectStore.gzlcData === true) {
        form.setFieldsValue({ mbId: '' });
      }

      const tableStore = ref.current?.getTableStore();
      XmzwhService.findByKey(tableStore.key, 1, tableStore.size, {
        projectId: data.id,
      }).then((res) => {
        if (res.total !== 0) {
          ProjectStore.sfxgData = true;
        } else {
          ProjectStore.sfxgData = false;
        }
      });
      data.enable = data.enable === 'Y' ? true : false;
      setFm(form);
      //当编辑行不是选择行的时候清空已选择的
      if (ProjectStore.rowData.length > 0) {
        if (ProjectStore.rowData[0].id !== data.id) {
          ref.current.clearTableRowClick();
        }
      }
    },
    onDeleteClick: async (data) => {
      const tableStore = ref.current?.getTableStore();
      const res = await XmzwhService.findByKey(
        tableStore.key,
        1,
        tableStore.size,
        {
          projectId: data.id,
        },
      );
      if (res.total !== 0) {
        return Promise.reject('该条数据已使用，不允许删除！');
      }
      return Promise.resolve();
    },
  };

  //自定义布局组件（生成条目著录库）
  const customAction = (store: EpsTableStore) => {
    return [
      <>
        {OptrightStore.hasRight(umid, 'SYS104') && (
          <Button
            type="primary"
            style={{ marginLeft: '10px', fontSize: '12px' }}
            onClick={sctmzlk}
            icon={<PlusCircleTwoTone />}
          >
            生成条目著录库
          </Button>
        )}
      </>,
    ];
  };

  //弹窗中负责人搜索
  const onfzrtableSearch = (value) => {
    ProjectStore.findYhData({ yhmc: value });
  };

  const fzrcustomAction = (
    <Form id="modal-table-seach-form">
      <Row>
        <Col>
          <Form.Item style={{ marginRight: 10 }}>
            <Input.Search
              allowClear
              onSearch={(val) => onfzrtableSearch(val)}
              style={{ width: 300 }}
              placeholder="请输入负责人名称"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  const sctmzlk = () => {
    if (ProjectStore.rowData.length === 0) {
      return message.warning('请先选择项目');
    }
    if (ProjectService.rows != null && ProjectService.rows.length >= 0) {
      ProjectStore.rowData[0]['mbId'] = ProjectService.rows;
    }
    if (
      ProjectStore.rowData[0]['mbId'] === undefined ||
      ProjectStore.rowData[0]['mbId'] === ''
    ) {
      return message.warning('不存在档案库模板');
    }
    setSctmzlkVisible(true);
    Modal.confirm({
      title:
        ProjectStore.rowData[0]['sfczzlk'] === 'Y'
          ? '该项目条目著录库已存在,确定重新生成吗?'
          : '确定要生成该项目的条目著录库吗?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      visible: sctmzlkVisible,
      onOk: () => {
        onOKSctmzlk();
      },
    });
  };

  //表格行选择事件
  const onRowCheck = (record) => {
    ProjectService.rows = null;
    ProjectStore.rowData = record;
  };

  //项目管理store
  const ProjectStore = useLocalObservable(() => ({
    worktplData: [],
    worktplSelectData: [],
    mbData: [],
    mbSelectData: [],
    processData: [],
    yhSelectData: [],
    xmmcData: [],
    sfzrData: [],
    fzrData: [],
    mgnernameData: [],
    //用来判断工作流程情况
    gzlcData: true,
    //行点击事件的值
    rowData: [],
    //用来判断此项目是否使用，使用不可删除不可修改名称
    sfxgData: false,
    //获取档案库模板
    allMbData: [],
    //档案库分组的id和mc
    dakfzselectData: [],

    //查询worktpl数据
    async findWorktpl() {
      const response = await fetch.get('/api/eps/dps/worktpl/', {
        params: { size: 9999 },
      });
      if (response.status === 200) {
        if (response.data.list.length > 0) {
          this.worktplSelectData = response.data.list;
          this.worktplData = response.data.list.map(
            (item: { id: any; name: any }) => ({
              value: item.id,
              label: item.name,
            }),
          );
        }
      }
    },
    //查询模板数据
    async findMb() {
      const response = await fetch.get('/api/eps/control/main/mb/queryAll');
      if (response.status === 200) {
        if (response.data.length > 0) {
          this.mbData = response.data;
          response.data = response.data.filter(
            (item) =>
              item.lx.substring(0, 2) === '01' ||
              item.lx.substring(0, 2) === '02',
          );
          this.mbSelectData = response.data.map(
            (item: { id: any; mc: any }) => ({
              value: item.id,
              label: item.mc,
            }),
          );
        }
      }
    },

    //查询选择的工作流程是否是单机、双机、三机著录，不是则不能生成档案库，不能选择档案库模板
    async findProcess(record: any) {
      const param = { params: { worktplId: record } };
      const response = await fetch.get('/api/eps/dps/process/list/', {
        params: param,
      });
      this.processData = response.data;
    },
    //生成条目著录库
    async addDak(param) {
      return await fetch.get('/api/eps/dps/project/addtmzlk', {
        params: param,
      });
    },

    //查询全部用户数据
    async findYhData(params: any) {
      const response = await fetch.get(
        '/api/eps/control/main/yh/queryForList',
        { params },
      );
      if (response.status === 200) {
        this.fzrData = response.data;
      }
    },
  }));

  // 表单名称
  const title: ITitle = {
    name: '项目管理',
  };

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '项目编号',
      code: 'xmid',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
      tableHidden: true,
    },
    {
      title: '项目名称',
      code: 'xmmc',
      align: 'center',
      formType: EpsFormType.Input,
      width: 150,
    },
    {
      title: '工作流程',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input,
      width: 100,
    },
    {
      title: '档案库模版',
      code: 'mbId',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input,
      render: (text: any, record: any, index: any) => {
        debugger;
        if (text == null) {
          return ' ';
        }
        if (text.indexOf(',') != -1) {
          text = text.substring(0, text.indexOf(','));
        }
        const result = ProjectStore.mbData.filter(
          (item) =>
            item.id === text &&
            (item.lx.substring(0, 2) === '01' ||
              item.lx.substring(0, 2) === '02'),
        );
        return result[0] ? result[0].mc : '';
      },
    },

    {
      title: '启用',
      code: 'enable',
      align: 'center',
      formType: EpsFormType.Input,
      width: 50,
      render: (text, record, index) => {
        return <Checkbox checked={text === 'Y' ? true : false} />;
      },
    },
    {
      title: '是否存在条目著录库',
      code: 'sfczzlk',
      align: 'center',
      formType: EpsFormType.Input,
      width: 150,
      render: (text, record, index) => {
        return <Checkbox checked={text === 'Y' ? true : false} />;
      },
    },
    {
      title: '负责人',
      code: 'mgnername',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '备注',
      code: 'remark',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input,
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
  ];

  // //定义table表格字段 ---负责人信息
  const fzrcolumns = [
    {
      title: '负责人账户',
      dataIndex: 'bh',
      align: 'center',
      width: 100,
    },
    {
      title: '负责人名称',
      dataIndex: 'yhmc',
      align: 'center',
      width: 100,
    },
  ];

  // 项目双击选择
  const onfzr = (record) => {
    setfzrvisible(false);
    fm?.setFieldsValue({ mgnername: record.yhmc });
    fm?.setFieldsValue({ mgner: record.bh });
  };
  // 自定义弹框表单
  const customForm = (text: any, form: any) => {
    //工作流程下拉框onchange
    const lcOnchange = (record: any) => {
      ProjectStore.gzlcData = true;
      const aa = ['0120', '0130', '0140'];
      ProjectStore.findProcess(record).then(() => {
        ProjectStore.processData.forEach((p: any) => {
          const d: any[] = [];
          if (p.workctt.length > 3) {
            d.push(p.workctt.split(','));
            aa.forEach((a) => {
              d[0].forEach((e: string) => {
                if (e === a) {
                  return (ProjectStore.gzlcData = false);
                }
              });
            });
          } else {
            aa.forEach((a) => {
              if (a === p.workctt) {
                return (ProjectStore.gzlcData = false);
              }
            });
          }
        });
      });
      if (ProjectStore.gzlcData === true) {
        text.setFieldsValue({ mbId: '', jnmbId: null });
      }
    };

    //表单负责人的查询按钮
    const onfzrSearch = (value) => {
      setfzrvisible(true);
    };

    const mbOnChange = (record) => {
      ProjectStore.mbData.forEach((m) => {
        if (record === m.id) {
          if (m.children != undefined && m.children != null) {
            m.children.forEach((jnmb) => {
              if (jnmb.id !== undefined) {
                text.setFieldsValue({ jnmbId: jnmb.id });
              }
            });
          } else {
            text.setFieldsValue({ jnmbId: null });
          }
        }
      });
    };

    // 自定义表单
    return (
      <>
        <Form.Item label="负责人id:" name="mgner" hidden></Form.Item>
        <Form.Item
          label="项目名称:"
          name="xmmc"
          required
          validateFirst
          rules={[
            { required: true, message: '请输入项目名称' },
            { max: 20, message: '项目名称过长' },
            {
              async validator(_, value) {
                if (ProjectStore.xmmcData === value) {
                  return Promise.resolve();
                }
                const param = { params: { xmmc: value, source: 'jq' } };
                await fetch
                  .get('/api/eps/dps/project/list/', { params: param })
                  .then((res) => {
                    if (res.data.length === 0) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error('此名称已存在，请重新命名'),
                      );
                    }
                  });
              },
            },
          ]}
        >
          <Input
            allowClear
            style={{ width: 300 }}
            disabled={ProjectStore.sfxgData}
          />
        </Form.Item>
        <Form.Item
          label="工作流程:"
          name="worktplId"
          required
          rules={[{ required: true, message: '请选择工作流程' }]}
        >
          <Select
            allowClear
            placeholder="请选择工作流程"
            style={{ width: 300 }}
            showArrow
            showSearch
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            options={ProjectStore.worktplData}
            onChange={lcOnchange}
            disabled={ProjectStore.sfxgData}
          ></Select>
        </Form.Item>
        <Form.Item label="档案库模版:" name="mbId">
          <Select
            allowClear
            placeholder="请选择档案库模板"
            style={{ width: 300 }}
            showArrow
            showSearch
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            options={ProjectStore.mbSelectData}
            disabled={ProjectStore.gzlcData || ProjectStore.sfxgData}
            onChange={(record) => {
              mbOnChange(record);
            }}
          ></Select>
        </Form.Item>
        <Form.Item label="卷内模板" name="jnmbId" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label="启用:"
          name="enable"
          initialValue={true}
          valuePropName="checked"
        >
          <Checkbox />
        </Form.Item>
        <Form.Item
          label="负责人:"
          name="mgnername"
          required
          validateFirst
          rules={[{ required: true, message: '请输入负责人' }]}
        >
          <Input.Search
            readOnly
            allowClear
            onSearch={(val) => onfzrSearch(val)}
            style={{ width: 300 }}
          />
        </Form.Item>
        <Form.Item label="备注:" name="remark">
          <Input.TextArea
            allowClear
            showCount
            maxLength={500}
            style={{ height: '10px', width: '300px' }}
          />
        </Form.Item>
      </>
    );
  };

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={ProjectService} // 右侧表格实现类，必填
        formWidth={500}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customAction={customAction} // 自定义全局按钮（如新增、导入、查询条件、全局打印 等），选填
        setCheckRows={(record) => onRowCheck(record)} //表格行选择
        ref={ref}
      />

      <Modal
        className="project"
        title="负责人信息"
        zIndex={1001}
        forceRender={true} //  强制渲染modal
        visible={fzrVisible}
        onCancel={() => setfzrvisible(false)}
        width={600}
        bodyStyle={{ height: 500 }}
        footer={false}
      >
        {fzrcustomAction}
        <Table
          id={'modal-table'}
          dataSource={ProjectStore.fzrData}
          scroll={{ y: 400 }}
          columns={fzrcolumns}
          bordered
          rowKey={'id'}
          onRow={(record) => {
            return {
              onDoubleClick: () => onfzr(record),
            };
          }}
        />
      </Modal>
    </>
  );
});

export default Project;

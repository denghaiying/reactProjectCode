import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsRecordPanel from '@/eps/components/panel/EpsRecordPanel';
import EpsFormType from '@/eps/commons/EpsFormType';
import { useEffect, useState, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import {
  Form,
  Input,
  Select,
  message,
  Tooltip,
  Button,
  Checkbox,
  Modal,
  FormInstance,
} from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import fetch from '../../../utils/fetch';
import ProjectService from './Service/ProjectService';
import WorktplService from './Service/WorktplService';
import ProcessService from './Service/ProcessService';
import { UpCircleTwoTone, DownCircleTwoTone } from '@ant-design/icons';
import EpsTableStore from '@/eps/components/panel/EpsRecordPanel/EpsTableStore';
import { add, fromPairs, set } from 'lodash';
import moment from 'moment';
import EpsRecordPanelTab from '@/eps/components/panel/EpsRecordPanelTab';
import { IProps } from 'ahooks/lib/useWhyDidYouUpdate';
import { FileAddOutlined } from '@ant-design/icons';
import EpsAddButton from '@/eps/components/buttons/EpsAddButton';
import OptrightStore from '@/stores/user/OptrightStore';

/**
 * 加工流程
 */
const Jglc = observer((props) => {
  const xmref = useRef();
  const [initParamsmx] = useState({});
  //控制此流程的名称是否可以编辑(在项目中已经使用就不可以编辑)
  const [isDisable, setIsDisable] = useState(false);
  //控制定义的新增表单是否可见
  const [addModalIsVisable, setAddModalIsVisable] = useState(false);
  //新增时候的表单
  const [addForm] = Form.useForm();
  //权限按钮
  const umid = 'DPS002';

  const JglcStore = useLocalObservable(() => ({
    selectWorkData: [],
    workdata: [],
    processdata: '',
    //worktplId
    worktplidData: '',
    //用来判断此项目是否使用，使用不可删除不可修改名称
    sfxgData: false,
    //主表表单的名称验证
    nameData: [],
    //主表编号验证
    codeData: [],
    //明细表的名称验证
    namemxData: [],
    //明细表工作内容验证
    selectData: [],

    workdatazs: [],

    async findWorkdata() {
      const response = await fetch.get('/api/eps/dps/work/list/');
      if (response.status === 200) {
        if (response.data.length > 0) {
          debugger;
          this.workdata = response.data.map(
            (item: { code: any; name: any }) => ({
              value: item.code,
              label: item.name,
            }),
          );
          this.selectWorkData = this.workdata;
        }
      }
    },
    //上移、下移按钮
    async moverow(data: any) {
      await fetch.put('/api/eps/dps/process/moverow', data);
    },

    async mxbshuaxin() {
      const xmtableStore = refPanel.current?.getTableStore();
      xmtableStore.findByKey(xmtableStore.key, 1, xmtableStore.size, {
        worktplId: '1',
      });
    },
  }));
  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tablePropz: ITable = {
    searchCode: 'name',
    disableCopy: true,
    disableAdd: true,
    disableEdit: !OptrightStore.hasRight(umid, 'SYS102'),
    disableDelete: !OptrightStore.hasRight(umid, 'SYS103'),
    // rowSelection: {type: 'radio'},
    onEditClick: (form, data) => {
      JglcStore.nameData = data.name;
      JglcStore.codeData = data.code;
      const xmtableStore = refPanel.current?.getTableStore();
      ProjectService.findByKey(xmtableStore.key, 1, xmtableStore.size, {
        worktplId: data.id,
      }).then((response) => {
        if (response.total !== 0) {
          setIsDisable(true);
        } else {
          setIsDisable(false);
        }
      });
      data.enable = data.enable === 'Y' ? true : false;
    },
    onDeleteClick: async (data) => {
      const tableStore = refPanel.current?.getTableStore();
      await ProjectService.findByKey(tableStore.key, 1, tableStore.size, {
        worktplId: data.id,
      }).then((res) => {
        if (res.total !== 0) {
          return Promise.reject('该条数据已使用，不允许删除！');
        }
        return Promise.resolve();
      });
    },
  };

  // 表单名称
  const title: ITitle = {
    name: '加工流程',
  };

  const [initParams, setInitParams] = useState({});
  const ref = useRef();
  const refPanel = useRef();

  // 定义table表格字段
  const source: EpsSource[] = [
    // {
    //   title: '编号',
    //   code: 'code',
    //   align: 'center',
    //   formType: EpsFormType.Input,
    //   width: 80,
    //   tableHidden:true,
    // },
    {
      title: '名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input,
      width: 150,
    },
    {
      title: '启用',
      code: 'enable',
      align: 'center',
      formType: EpsFormType.Input,
      width: 50,
      render: (text: string, record: any, index: any) => {
        return <Checkbox checked={text === 'Y' ? true : false} />;
      },
    },
    {
      title: '备注',
      code: 'remark',
      align: 'center',
      formType: EpsFormType.Input,
      width: 180,
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
      width: 100,
    },
  ];
  const onAddClick = (record) => {
    console.log('新增点击事件');
    setIsDisable(false);
    setAddModalIsVisable(true);

    addForm.resetFields();
  };
  // 自定义弹框表单
  const customForm = (text, form) => {
    // 自定义表单
    return (
      <>
        {/* <Form.Item
          label="编号:"
          name="code"
          required
          rules={[
            { required: true, message: '请输入编号' },
            { max: 10, message: '编号长度不能大于10个字符' },
            {
              async validator(_, value) {
                if (JglcStore.codeData === value) {
                  return Promise.resolve();
                }
                const param = { params: { code: value } };
                await fetch.get('/api/eps/dps/worktpl/list/', { params: param }).then((res) => {
                  if (res.data.length === 0) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(new Error('此编号已存在，请重新输入'));
                  }
                });
              },
            },
          ]}
        >
          <Input allowClear style={{ width: 300 }} disabled={JglcStore.sfxgData} />
        </Form.Item> */}
        <Form.Item
          hidden
          label="编号"
          name="code"
          initialValue={`${moment().format('YYYYMMDDHHmmssSSS')}`}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="名称:"
          name="name"
          validateFirst
          rules={[
            { required: true, message: '请输入名称' },
            { max: 20, message: '名称长度不能大于20个汉字' },
            {
              async validator(_, value) {
                if (JglcStore.nameData === value) {
                  return Promise.resolve();
                }
                const param = { params: { name: value, source: 'jq' } };
                await fetch
                  .get('/api/eps/dps/worktpl/list/', { params: param })
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
          <Input allowClear style={{ width: 300 }} disabled={isDisable} />
        </Form.Item>
        <Form.Item
          label="启用:"
          name="enable"
          initialValue={true}
          valuePropName="checked"
        >
          <Checkbox />
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
  const customAction = (store, record) => {
    const addWorktpl = () => {
      addForm.validateFields().then(() => {
        store.service
          .saveByKey(store.key, addForm.getFieldsValue())
          .then((response) => {
            if (response.status === 201) {
              setAddModalIsVisable(false);
              //刷新数据
              store.findByKey(store.key, store.page, store.size, store.params);
              message.success('添加成功');
            } else {
              message.error('添加失败');
            }
          });
      });
    };
    return (
      <>
        <Modal
          title="新增流程"
          visible={addModalIsVisable}
          onCancel={() => setAddModalIsVisable(false)}
          onOk={addWorktpl}
          centered
          width={500}
        >
          <Form labelCol={{ span: 6 }} form={addForm}>
            {customForm}
          </Form>
        </Modal>
        {OptrightStore.hasRight(umid, 'SYS101') && (
          <Button type="primary" onClick={onAddClick}>
            <FileAddOutlined />
            新建
          </Button>
        )}
      </>
    );
  };

  // 主表格行点击事件
  const onPanelChange = (record: any) => {
    JglcStore.worktplidData = record.id;
    const tableStore = refPanel.current?.getTableStore();
    tableStore
      .findByKey(tableStore.key, 1, tableStore.size, { worktplId: record.id })
      .then(() => {});
  };

  // 自定义从组件
  const bottomAction = (store: EpsTableStore, rows: any[]) => {
    useEffect(() => {}, []);

    const shangclick = (
      record: { [x: string]: string; worktplId: any },
      index: any,
      store: any,
    ) => {
      record['lx'] = 's';
      const tableStoresy = refPanel.current?.getTableStore();
      if (tableStoresy.params.hasOwnProperty('worktplId')) {
        JglcStore.moverow(record).then(() => {
          tableStoresy.findByKey(
            tableStoresy.key,
            tableStoresy.page,
            tableStoresy.size,
            {
              worktplId: record.worktplId,
            },
          );
        });
      } else {
        message.warning('请先选择上表数据，再上移!');
        return false;
      }
    };
    const xiaclick = (
      record: { [x: string]: string; worktplId: any },
      index: number,
      store: { total: any },
    ) => {
      record['lx'] = 'x';
      if (index + 1 === store.total) {
        return;
      }
      const tableStorexy = refPanel.current?.getTableStore();
      if (tableStorexy.params.hasOwnProperty('worktplId')) {
        JglcStore.moverow(record).then(() => {
          tableStorexy.findByKey(
            tableStorexy.key,
            tableStorexy.page,
            tableStorexy.size,
            {
              worktplId: record.worktplId,
            },
          );
        });
      } else {
        message.warning('请先选择上表数据，再下移!');
        return false;
      }
    };

    const workOnchange = (record) => {
      const codes = '0120,0130,0140';
      //遍历所选数据,判断是否存在单机双机三机著录
      for (let a = 0; a < record.length; a++) {
        if (codes.indexOf(record[a]) >= 0) {
          //若已选任何一个著录,则把数据源清空,重新设置
          // JglcStore.selectWorkData.splice(0, JglcStore.selectWorkData.length);
          JglcStore.selectWorkData = [];
          JglcStore.workdata.forEach((item) => {
            if (item.value === record[a] || codes.indexOf(item.value) === -1) {
              JglcStore.selectWorkData.push(item);
            }
          });
          return;
        }
        //所选数据中不包含著录,则重新给下拉框选项赋值
        JglcStore.selectWorkData = JglcStore.workdata;
      }
    };

    const customTableAction = (
      text: any,
      record: any,
      index: any,
      store: any,
    ) => {
      return [
        <Tooltip title="上移">
          {OptrightStore.hasRight(umid, 'SYS107') && (
            <Button
              size="small"
              style={{ fontSize: '12px' }}
              type="primary"
              shape="circle"
              icon={<UpCircleTwoTone />}
              onClick={() => shangclick(record, index, store)}
            />
          )}
        </Tooltip>,
        <Tooltip title="下移">
          {OptrightStore.hasRight(umid, 'SYS108') && (
            <Button
              size="small"
              style={{ fontSize: '12px' }}
              type="primary"
              shape="circle"
              icon={<DownCircleTwoTone />}
              onClick={() => xiaclick(record, index, store)}
            />
          )}
        </Tooltip>,
      ];
    };

    // 按钮和查询框区域(新增、编辑、删除按钮)
    const tableProp: ITable = {
      searchCode: 'name',
      disableCopy: true,
      disableAdd: !OptrightStore.hasRight(umid, 'SYS104'),
      disableEdit: !OptrightStore.hasRight(umid, 'SYS105'),
      disableDelete: !OptrightStore.hasRight(umid, 'SYS106'),

      onAddClick: (form) => {
        const tableStores = refPanel.current?.getTableStore();
        ProcessService.findByKey(
          tableStores.key,
          tableStores.page,
          tableStores.size,
          {
            worktplId: JglcStore.worktplidData,
          },
        ).then((res) => {
          if (res.list.length === 0) {
            form.setFieldsValue({ processIndex: 1 });
          } else {
            form.setFieldsValue({
              processIndex: res.list[res.list.length - 1].processIndex + 1,
            });
          }
        });
        if (tableStores.params.hasOwnProperty('worktplId')) {
          var att = tableStores.params.worktplId;
          form.setFieldsValue({ worktplId: att });
        } else {
          message.warning('请先选择上表数据，再新增!');
          return false;
        }
        // JglcStore.selectWorkData = JglcStore.workdata;
      },
      onEditClick: (form, data) => {
        JglcStore.namemxData = data.name;
        data.workctt = data.workctt.split(',');
        // workOnchange(data.workctt);
        // JglcStore.selectWorkData = JglcStore.workdata;
      },
    };

    // 表单名称
    const title: ITitle = {
      name: '工序',
    };
    // 定义table表格字段
    const source: EpsSource[] = [
      {
        title: '流程序号',
        code: 'processIndex',
        align: 'center',
        width: 180,
        formType: EpsFormType.Input,
        tableHidden: true,
      },
      {
        title: '名称',
        code: 'name',
        align: 'center',
        width: 180,
        formType: EpsFormType.Input,
      },
      {
        title: '工作内容',
        code: 'workctt',
        align: 'center',
        width: 180,
        formType: EpsFormType.Input,
        render: (
          text: string,
          record: { workctt: string | any[] },
          index: any,
        ) => {
          if (record.workctt.length > 4) {
            const a: (string | any[])[] = [];
            JglcStore.workdata.forEach((y) => {
              text.split(',').forEach((t: any) => {
                debugger
                if (y.value === t) {
                  a.push(y.label + '，');
                }
              });
            });
            if (a.length > 0) {
              a[a.length - 1] = a[a.length - 1].replace(
                a[a.length - 1].charAt(a[a.length - 1].length - 1),
                ' ',
              );
            }

            return a;
          } else {
            const a: any[] = [];
            JglcStore.workdata.forEach((y) => {
              if (y.value === text) {
                a.push(y.label);
              }
            });
            return a;
          }
        },
      },
      {
        title: '备注',
        code: 'remark',
        align: 'center',
        width: 180,
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

    // 自定义弹框表单
    const customForm = (text: any, form: any) => {
      // 自定义表单
      return (
        <>
          <Form.Item label="加工流程Id:" name="worktplId" hidden>
            <Input disabled style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="流程序号" name="processIndex" hidden>
            <Input disabled style={{ width: 300 }} />
          </Form.Item>
          <Form.Item
            label="名称:"
            name="name"
            validateFirst
            rules={[
              { required: true, message: '请输入名称' },
              { max: 20, message: '名称长度不能大于20个汉字' },
              {
                async validator(_, value) {
                  if (JglcStore.namemxData === value) {
                    return Promise.resolve();
                  }
                  const tableStores = refPanel.current?.getTableStore();
                  const param = {
                    params: {
                      name: value,
                      source: 'jq',
                      worktplId: tableStores.params.worktplId,
                    },
                  };
                  await fetch
                    .get('/api/eps/dps/process/list/', { params: param })
                    .then((res) => {
                      if (res.data.length === 0) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject(
                          new Error('该流程下此名称已存在，请重新输入'),
                        );
                      }
                    });
                },
              },
            ]}
          >
            <Input allowClear style={{ width: 300 }} />
          </Form.Item>
          <Form.Item
            label="工作内容:"
            name="workctt"
            required
            validateFirst
            rules={[
              { required: true, message: '请输入工作内容' },
              {
                async validator(_, value) {
                  let b = 0;
                  const codes = '0120,0130,0140';
                  //遍历所选数据,判断是否存在单机双机三机著录
                  for (let a = 0; a < value.length; a++) {
                    if (codes.indexOf(value[a]) >= 0) {
                      b++;
                    }
                    if (b >= 2) {
                      return Promise.reject(
                        '只能选择一种著录方式（单机、双击、三机著录）',
                      );
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Select
              allowClear
              placeholder="请选择工作内容"
              mode="multiple"
              style={{ width: 300 }}
              showArrow
              filterOption={(input, option) => {
                return (
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
              options={JglcStore.selectWorkData}
              // onChange={(record) => {
              //   workOnchange(record);
              // }}
            ></Select>
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
          source={source}
          initParams={initParamsmx} // 组件元数据，必填
          tableProp={tableProp} // 右侧表格设置属性，选填
          tableService={ProcessService} // 右侧表格实现类，必填
          ref={refPanel} // 获取组件实例，选填
          formWidth={500}
          customTableAction={customTableAction}
          customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
          tableAutoLoad={false}
        ></EpsPanel>
      </>
    );
  };
  useEffect(() => {
    JglcStore.findWorkdata();
    JglcStore.mxbshuaxin();
    OptrightStore.getFuncRight(umid);
  }, [ref.current?.getTableStore().total]);

  return (
    <>
      <EpsRecordPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tablePropz}
        initParams={initParams} // 右侧表格设置属性，选填
        tableService={WorktplService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        formWidth={500}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        bottomAction={(store, record) => bottomAction(store, record)}
        tableRowClick={(record) => onPanelChange(record)}
        customAction={customAction}
      />
    </>
  );
});

export default Jglc;

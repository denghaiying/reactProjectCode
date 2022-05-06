import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { useEffect, useRef, useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  List,
  message,
  Modal,
  Popconfirm,
  Row,
  Table,
} from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import SysStore from '@/stores/system/SysStore';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import ProjectService from './Service/ProjectService';
import {
  ExclamationCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import './Zrgl.less';
import yhService from './Service/yhService';
import fetch from '@/utils/fetch';
import OptrightStore from '@/stores/user/OptrightStore';

/**
 * 值日管理
 */
const Zrgl = observer((props) => {
  //权限按钮
  const umid = 'DPS011';
  OptrightStore.getFuncRight(umid);
  //主页上方搜索表单实例
  const [seachForm] = Form.useForm();
  //控制项目弹框
  const [xmVisible, setxmvisible] = useState(false);
  //获取当前用户名称
  const whrid = SysStore.getCurrentUser().id;
  //项目数据
  const [projectData, setProjectData] = useState([]);
  //仅显示我负责的项目
  const [currentUserIsChecked, setCurrentUserIsChecked] = useState(false);
  //弹窗中输入框项目名称
  const [xmmcData, setXmmcData] = useState('');
  const [tableData, setTableData] = useState([]);

  //当前页码
  const [currentPage, setCurrentPage] = useState(1);
  //每页几条
  const [pageSize, setPageSize] = useState(10);
  //控制新增是否保存了
  const [addIsSaved, setAddIsSaved] = useState(true);
  //控制编辑是否保存了
  const [editIsSaved, setEditSaved] = useState(true);
  //控制选择项目之后是否重新查询了
  const [isQueried, setIsQueried] = useState(false);
  const [addPersonsParams, setAddPersonsParams] = useState({});
  // 用户信息
  const refYh = useRef();
  const [yhVisible, setYhVisible] = useState(false);
  // 用户选择弹窗的用户信息列表
  const yhTableProp: ITable = {
    searchCode: 'yhmc',
    disableCopy: true,
    disableAdd: true,
    disableEdit: true,
    disableDelete: true,
    rowSelection: {
      type: 'checkBox',
    },
  };

  // 用户弹窗表单信息
  const yhTitle: ITitle = {
    name: '用户信息',
  };

  // 用户弹窗表格信息
  const yhSource: EpsSource[] = [
    {
      title: '用户名',
      code: 'bh',
      align: 'center',
      formType: EpsFormType.Input,
      width: 80,
    },
    {
      title: '姓名',
      code: 'yhmc',
      align: 'center',
      formType: EpsFormType.Input,
      width: 120,
    },
  ];
  const ZrglStore = useLocalObservable(() => ({
    xmid: '',
    remarkInfo: [{}],
    xmmcData: '',
    whrData: false,
    xmmcName: '项目名称',
    xmidData: '',
    tableData: [],
    //查询全部数据
    async findZrgl(xmidData) {
      const response = await fetch.get('/api/eps/dps/duty/list/', {
        params: { params: { projectId: xmidData } },
      });
      if (response.status === 200) {
        if (response.data.length >= 0) {
          this.tableData = response.data;
          setTableData(response.data);
        }
      }
      return response;
    },
    //查询备注信息
    async findZrglRemark(xmidData) {
      const response = await fetch.get(
        `/api/eps/dps/duty/${'remark' + xmidData}`,
      );
      if (response.status === 200) {
        this.remarkInfo[0] = response.data;
      }
      return response;
    },

    //保存整个表格数据
    async saveTableData(data) {
      console.log(tableData);
      return await fetch.post('/api/eps/dps/duty/savetable', data);
    },
    async deleteRow(row) {
      return await fetch.delete(`/api/eps/dps/duty/${row.id}`);
    },
  }));
  //查询按钮点击事件
  const findZrglById = () => {
    //控制没保存的时候提示不让查询
    if (!addIsSaved || !editIsSaved) {
      return message.warn('请先确定当前修改是否需要保存');
    }
    // //未选择项目时不能查询
    // if (ZrglStore.xmidData === '') {
    //   return message.warn('请先选择项目');
    // }
    seachForm.validateFields().then(() => {
      ZrglStore.findZrgl(ZrglStore.xmidData)
        .then((response) => {
          //数据源有数据说明有任务,有任务则存在备注信息
          if (response.data.length > 0) {
            ZrglStore.findZrglRemark(ZrglStore.xmidData)
              .then(() => {
                ZrglStore.xmid = ZrglStore.xmidData;
                setIsQueried(true);
                //不加这个数据不刷新,而且要放最后
                setAddPersonsParams({});
              })
              .catch(() => {
                message.error('系统异常');
              });
          } else {
            ZrglStore.remarkInfo[0]['remark'] = '';
            setTableData([]);
            ZrglStore.xmid = ZrglStore.xmidData;
            setIsQueried(true);
            return message.success('暂无任务数据');
          }
        })
        .catch(() => {
          message.error('系统异常');
        });
    });
  };

  //主页table表格中删除人员
  const deletePerson = (record, rowIndex, column, itemIndex, ps) => {
    //控制切换了项目之后必须先查询才能去修改
    if (!isQueried) {
      return message.warn('请先查询数据');
    }
    rowIndex = (currentPage - 1) * pageSize + rowIndex;
    if (rowIndex !== tableData.length - 1) {
      if (!addIsSaved) {
        return message.warn('请先保存新增数据再修改');
      }
    }
    //删除
    ps.splice(itemIndex, 1);
    //名称存在id也就存在,删除相同位置的id
    const perids = record['perid' + column].split(',');
    perids.splice(itemIndex, 1);
    //删除id和名称
    tableData[rowIndex]['perid' + column] = perids.toString();
    tableData[rowIndex]['pername' + column] =
      ps.length === 0 ? null : ps.toString();
    setEditSaved(false);
    //不加这个数据不刷新,而且要放最后
    setAddPersonsParams({});
  };
  //主页新增人员点击事件
  const addPerson = (text, record, rowIndex, column) => {
    //控制切换了项目之后必须先查询才能去修改
    if (!isQueried) {
      return message.warn('请先查询数据');
    }
    rowIndex = (currentPage - 1) * pageSize + rowIndex;
    if (rowIndex !== tableData.length - 1) {
      if (!addIsSaved) {
        return message.warn('请先保存新增数据再修改');
      }
    }
    //清空选项或可改成把已存在人员提前选中
    refYh.current.clearTableRowClick();

    setYhVisible(true);
    //把参数暂时存起来
    setAddPersonsParams({
      text: text,
      record: record,
      rowIndex: rowIndex,
      column: column,
    });
  };

  //删除一行数据
  const deleteTableRow = (record, rowIndex) => {
    //控制切换了项目之后必须先查询才能去修改
    if (!isQueried) {
      return message.warn('请先查询数据');
    }
    //控制新增数据时不能修改其他行数据
    rowIndex = (currentPage - 1) * pageSize + rowIndex;
    if (!addIsSaved && rowIndex !== tableData.length - 1) {
      return message.warn('请先保存新增数据再执行删除');
    }

    Modal.confirm({
      title: '确定要删除该条数据吗?',
      icon: <ExclamationCircleOutlined />,
      content: '数据删除后将无法恢复，请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        ZrglStore.deleteRow(record)
          .then((response) => {
            if (response && response.status === 200) {
              ZrglStore.findZrgl(ZrglStore.xmidData).then(() => {
                const remark = [];
                const data = ZrglStore.tableData;
                for (let i = 0; i < data.length; i++) {
                  remark.push('（' + data[i].task0 + '）');
                }
                ZrglStore.remarkInfo[0]['remark'] = remark.toString();
                data.push(ZrglStore.remarkInfo[0]);
                ZrglStore.saveTableData(data).then(() => {
                  ZrglStore.findZrgl(ZrglStore.xmidData);
                });
              });
              return message.success('删除成功');
            } else {
              return message.error('删除失败');
            }
          })
          .catch(() => message.error('系统异常'));
      },
    });
  };

  //用户确认后新增人员
  const yhOnOK = () => {
    const selectRow = refYh.current?.getCheckedRows();
    if (!selectRow || selectRow.length < 1) {
      return message.warning('请选择一条数据!');
    }
    setYhVisible(false);

    const rowIndex = addPersonsParams['rowIndex'];
    const column = addPersonsParams['column'];
    const text = addPersonsParams['text'];
    const record = addPersonsParams['record'];
    let pernames: any[] = [];
    let perids: any[] = [];
    let addPername: any[] = [];
    let addPerid: any[] = [];
    //取出用户名称
    selectRow.forEach((row) => {
      addPername.push(row.yhmc);
      addPerid.push(row.bh);
    });
    if (text !== undefined && text !== null) {
      pernames = text.split(',');
      perids = record['perid' + column].split(',');
      // for (let a = 0; a < pernames.length; a++) {
      //   for (let b = 0; b < addPername.length; b++) {
      //     if (pernames[a] === addPername[b]) {
      //       //删除选中行与已存在的人员中相同的数据
      //       addPername.splice(b, 1);
      //       break;
      //     }
      //   }
      // }
      for (let a = 0; a < perids.length; a++) {
        for (let b = 0; b < addPerid.length; b++) {
          if (perids[a] === addPerid[b]) {
            //删除选中行与已存在的人员中相同的数据
            addPerid.splice(b, 1);
            addPername.splice(b, 1);
            break;
          }
        }
      }

      pernames = pernames.concat(addPername);
      perids = perids.concat(addPerid);
    } else {
      pernames = addPername;
      perids = addPerid;
    }
    //根据rowIdnex替换数据源中的数据
    tableData[rowIndex]['pername' + column] = pernames.toString();
    tableData[rowIndex]['perid' + column] = perids.toString();
    setEditSaved(false);
  };

  const addTaskOnClick = () => {
    if (!isQueried) {
      return message.warn('请先查询数据');
    }
    if (!editIsSaved) {
      return message.warn('请先保存修改的内容再新增');
    }
    if (!addIsSaved) {
      return message.warn('每次只能新增一个任务,请先保存');
    }
    //如果该项目相关的任务数据没有,则表示备注数据也没有则根据项目id新增一条数据
    if (tableData.length === 0) {
      ZrglStore.remarkInfo[0] = {
        id: 'remark' + ZrglStore.xmidData,
        remark: '',
      };
    }
    ZrglStore.tableData.push({
      id: Math.random(),
      projectId: ZrglStore.xmidData,
    });
    setTableData(ZrglStore.tableData);
    setAddIsSaved(false);
    //不加这个数据不刷新,而且要放最后
    setAddPersonsParams({});
  };

  //取消新增点击事件
  const cancelAddOnClick = () => {
    ZrglStore.findZrgl(ZrglStore.xmidData);
    setAddIsSaved(true);
  };

  //保存数据按钮点击事件
  const saveTableOnClick = () => {
    debugger;
    if (addIsSaved && editIsSaved) {
      return message.warn('您目前没有做出更改');
    }
    for (let a = 0; a < tableData.length; a++) {
      debugger;
      if (tableData[a].task0 === undefined || tableData[a].task0 === '') {
        return message.warn('任务为必填');
      }
    }
    //保存之前把备注信息加入数据源
    //是新增数据时
    const data = tableData;
    const remark = [];
    if (!addIsSaved) {
      for (let i = 0; i < tableData.length; i++) {
        remark.push('（' + data[i].task0 + '）');
      }
      ZrglStore.remarkInfo[0]['remark'] = remark.toString();
    } else if (addIsSaved) {
      for (let i = 0; i < tableData.length; i++) {
        remark.push('（' + data[i].task0 + '）');
      }
      ZrglStore.remarkInfo[0]['remark'] = remark.toString();
    }
    data.push(ZrglStore.remarkInfo[0]);
    ZrglStore.saveTableData(data)
      .then((response) => {
        if (response.status === 201) {
          setAddIsSaved(true);
          setEditSaved(true);
          ZrglStore.findZrgl(ZrglStore.xmidData);
          message.success('数据保存成功');
        } else {
          return message.error('数据保存失败');
        }
      })
      .catch((error) => message.error('数据保存失败'));
  };

  //主页的项目查询按钮
  const onProjectSearch = (value) => {
    //控制没保存数据时不让更换项目
    if (!addIsSaved || !editIsSaved) {
      return message.warn('请先确定当前修改是否需要保存');
    }

    // const xmtableStore = xmref.current?.getTableStore();
    // xmtableStore
    //   .findByKey(xmtableStore.key, xmtableStore.page, xmtableStore.size, {
    //     // xmid: value,
    //     source: 'mh',
    //   })
    //   .then(() => {
    setxmvisible(true);
    // });
  };

  //渲染主页单元格数据
  const showCell = (text, record, rowIndex, column) => {
    let ps: any[] = [];
    if (text !== undefined && text !== null) {
      ps = text.split(',');
    }

    if (rowIndex < tableData.length) {
      return {
        children: (
          <span>
            <Col
              hidden={ps.length === 0 || text === '' ? true : false}
              style={{ maxHeight: 94, overflow: 'scroll' }}
            >
              <List
                dataSource={ps}
                renderItem={(item, itemIndex) => (
                  <Row style={{ height: 22 }}>
                    <Col span={18} style={{ textAlign: 'center' }}>
                      {item}
                    </Col>

                    <Col span={6} style={{ textAlign: 'left' }}>
                      <Popconfirm
                        title="确认删除吗?"
                        onConfirm={() => {
                          deletePerson(record, rowIndex, column, itemIndex, ps);
                        }}
                        okText="是"
                        cancelText="否"
                      >
                        {OptrightStore.hasRight(umid, 'SYS102') && (
                          <MinusCircleOutlined />
                        )}
                      </Popconfirm>
                    </Col>
                  </Row>
                )}
              />
            </Col>
            <span>
              {OptrightStore.hasRight(umid, 'SYS102') && (
                <Button
                  style={{ fontSize: '12px' }}
                  type="text"
                  size="small"
                  onClick={() => {
                    addPerson(text, record, rowIndex, column);
                  }}
                >
                  【添加人员】
                </Button>
              )}
            </span>
          </span>
        ),
      };
    }
  };

  // 定义主页table表格字段
  const columns = [
    {
      title: '任务/星期',
      dataIndex: 'task0',
      align: 'center',
      width: '21%',
      render: (text, record, rowIndex, column = 'task0') => {
        return (
          <Input.TextArea
            placeholder="请填写任务详情"
            id={'textaea_' + rowIndex}
            autoSize
            className="task_input"
            readOnly={
              // 判断新增保存了再去判断是否切换了项目切换了则先查询才能编辑,没保存则只最后一行可编辑
              addIsSaved
                ? !isQueried
                  ? true
                  : false
                : (currentPage - 1) * pageSize + rowIndex !==
                  tableData.length - 1
                ? true
                : false
            }
            onFocus={() => {
              //控制切换了项目之后必须先查询才能去修改
              if (!isQueried) {
                return message.warn('请先查询数据');
              }
              //控制新增数据时不能修改其他行
              if (!addIsSaved) {
                if (
                  (currentPage - 1) * pageSize + rowIndex !==
                  tableData.length - 1
                ) {
                  return message.warn('请先保存新增数据');
                }
              }
            }}
            onBlur={(record) => {
              if (record.currentTarget.textContent !== text) {
                //如何修改了数据,把数据修改到源数据
                tableData[(currentPage - 1) * pageSize + rowIndex][column] =
                  record.currentTarget.textContent === undefined
                    ? ''
                    : record.currentTarget.textContent;
                //新增时不可以编辑其他数据
                if (!addIsSaved) {
                  if (
                    (currentPage - 1) * pageSize + rowIndex !==
                    tableData.length - 1
                  ) {
                    setEditSaved(false);
                  }
                } else {
                  //不是新增则是编辑,设置为编辑未保存
                  setEditSaved(false);
                }
              }
            }}
            defaultValue={text}
          />
        );
      },
    },
    {
      title: '日',
      dataIndex: 'pername0',
      align: 'center',
      editable: true,
      width: '10.52%',
      render: (text, record, rowIndex, column = '0') => {
        return showCell(text, record, rowIndex, column);
      },
    },
    {
      title: '一',
      dataIndex: 'pername1',
      align: 'center',
      width: '10.52%',
      editable: true,
      render: (text, record, rowIndex, column = '1') => {
        return showCell(text, record, rowIndex, column);
      },
    },
    {
      title: '二',
      dataIndex: 'pername2',
      align: 'center',
      editable: true,
      width: '10.52%',
      render: (text, record, rowIndex, column = '2') => {
        return showCell(text, record, rowIndex, column);
      },
    },
    {
      title: '三',
      dataIndex: 'pername3',
      align: 'center',
      editable: true,
      width: '10.52%',
      render: (text, record, rowIndex, column = '3') => {
        return showCell(text, record, rowIndex, column);
      },
    },
    {
      title: '四',
      dataIndex: 'pername4',
      align: 'center',
      editable: true,
      width: '10.52%',
      render: (text, record, rowIndex, column = '4') => {
        return showCell(text, record, rowIndex, column);
      },
    },
    {
      title: '五',
      dataIndex: 'pername5',
      align: 'center',
      editable: true,
      width: '10.52%',
      render: (text, record, rowIndex, column = '5') => {
        return showCell(text, record, rowIndex, column);
      },
    },
    {
      title: '六',
      dataIndex: 'pername6',
      align: 'center',
      editable: true,
      width: '10.52%',
      innerHeight: '120px',
      render: (text, record, rowIndex, column = '6') => {
        return showCell(text, record, rowIndex, column);
      },
    },
    {
      title: '操作',
      align: 'center',

      render: (text, record, rowIndex) => {
        return (currentPage - 1) * pageSize + rowIndex !==
          tableData.length - 1 ? (
          // OptrightStore.hasRight(umid,'SYS104') &&
          <Button
            size="small"
            type="link"
            onClick={() => {
              deleteTableRow(record, rowIndex);
            }}
          >
            删除
          </Button>
        ) : !addIsSaved ? (
          <span>
            <Button
              size="small"
              type="link"
              onClick={() => {
                cancelAddOnClick();
              }}
            >
              取消
            </Button>
          </span>
        ) : (
          OptrightStore.hasRight(umid, 'SYS104') && (
            <Button
              size="small"
              type="link"
              onClick={() => {
                deleteTableRow(record, rowIndex);
              }}
            >
              删除
            </Button>
          )
        );
      },
    },
  ];

  //项目双击的确认按钮
  const onProjectConfirm = (record) => {
    setxmvisible(false);
    ZrglStore.xmidData = record.id;
    seachForm.setFieldsValue({
      xmmc: record.xmmc,
      xmid: record.xmid,
      projectId: record.id,
    });
    //选择完成后将标识设置为''
    ZrglStore.xmid = '';
    setIsQueried(false);
    // const xmtableStore = xmref.current?.getTableStore();
    // xmtableStore.findByKey(xmtableStore.key, xmtableStore.page, xmtableStore.size, { xmid: selectRow[0].id });
    // fm?.setFieldsValue({ 'projectName': selectRow[0].xmmc });
    // fm?.setFieldsValue({ 'projectId': selectRow[0].id });
  };
  //定义table表格字段 ---项目信息
  const modalColumns = [
    {
      title: '项目名称',
      dataIndex: 'xmmc',
      align: 'center',
      width: 100,
    },
  ];
  //弹窗中项目搜索
  const onxmtableSearch = (value) => {
    ProjectService.findAllProjectData({
      mgner: currentUserIsChecked ? whrid : null,
      xmmc: value,
    }).then((data) => {
      setProjectData(data);
    });
  };
  //仅显示我负责的项目
  const fzxmOnchange = (record) => {
    if (record.target.checked) {
      setCurrentUserIsChecked(true);
      ProjectService.findAllProjectData({ mgner: whrid, xmmc: xmmcData }).then(
        (data) => {
          setProjectData(data);
        },
      );
    } else {
      setCurrentUserIsChecked(false);
      ProjectService.findAllProjectData({ xmmc: xmmcData }).then((data) => {
        setProjectData(data);
      });
    }
  };
  //弹窗搜索区域
  const modalCustomAction = (
    <Form id="modal-table-seach-form">
      <Row>
        <Col>
          <Form.Item style={{ marginRight: 10 }}>
            <Input.Search
              allowClear
              onSearch={(val) => onxmtableSearch(val)}
              onChange={(record) => {
                setXmmcData(record.target.value);
              }}
              style={{ width: 300 }}
              placeholder="请输入项目名称"
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Checkbox onChange={(record) => fzxmOnchange(record)}>
              仅显示我负责的项目
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
  useEffect(() => {
    ProjectService.findAllProjectData({}).then((data) => {
      setProjectData(data);
    });
  }, []);
  return (
    <>
      <Card style={{ height: 'auto' }}>
        <Row style={{ marginTop: -10 }}>
          <Form form={seachForm}>
            <Row>
              <Col className="top_cols">
                <Form.Item hidden label="项目关键字" name="projectId">
                  <Input allowClear style={{ width: 300 }} />
                </Form.Item>
                <Form.Item hidden label="项目编号" name="xmid">
                  <Input allowClear style={{ width: 300 }} />
                </Form.Item>
                <Form.Item
                  label="项目名称"
                  name="xmmc"
                  rules={[{ required: true, message: '请选择项目' }]}
                >
                  <Input.Search
                    allowClear
                    onSearch={(val) => onProjectSearch(val)}
                    style={{ width: 300 }}
                    value={ZrglStore.xmidData}
                    placeholder="请选择项目"
                    readOnly
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Col className="top_cols">
            {OptrightStore.hasRight(umid, 'SYS106') && (
              <Button
                type="primary"
                onClick={() => {
                  findZrglById();
                }}
              >
                {' '}
                查询
              </Button>
            )}
          </Col>
          <Col className="top_cols">
            {OptrightStore.hasRight(umid, 'SYS101') && (
              <Button
                style={{ float: 'right' }}
                type="primary"
                size="middle"
                onClick={() => {
                  saveTableOnClick();
                }}
              >
                保存数据
              </Button>
            )}
          </Col>
        </Row>

        <Modal
          title="项目信息"
          zIndex={1001}
          forceRender={true} //  强制渲染modal
          visible={xmVisible}
          onCancel={() => setxmvisible(false)}
          width={600}
          bodyStyle={{ height: 500 }}
          footer={false}
        >
          {modalCustomAction}
          <Table
            id={'modal-table'}
            dataSource={projectData}
            scroll={{ y: 400 }}
            columns={modalColumns}
            rowKey={'id'}
            bordered
            onRow={(record) => {
              return {
                onDoubleClick: () => onProjectConfirm(record),
              };
            }}
          />
        </Modal>

        <Modal
          title="人员选择"
          zIndex={1001}
          centered
          forceRender={true} //  强制渲染modal
          visible={yhVisible}
          onOk={yhOnOK}
          onCancel={() => setYhVisible(false)}
          bodyStyle={{ height: 500 }}
        >
          <EpsPanel
            title={yhTitle} // 组件标题，必填
            source={yhSource} // 组件元数据，必填
            tableProp={yhTableProp} // 右侧表格设置属性，选填
            tableService={yhService} // 右侧表格实现类，必填
            ref={refYh} // 获取组件实例，选填
          />
        </Modal>

        {/* 主页表格 */}
        <Table
          id="zrgl_zhuyeTable"
          onChange={(record) => {
            setCurrentPage(record.current);
            setPageSize(record.pageSize);
            console.log(tableData);
          }}
          pagination={false}
          columns={columns}
          bordered
          dataSource={tableData}
          summary={() => {
            return (
              <tr>
                <td style={{ textAlign: 'center' }}>备注</td>
                <td colSpan={8} style={{ textAlign: 'left' }}>
                  {ZrglStore.remarkInfo[0]['remark']}
                </td>
              </tr>

              // <Col span={24}style={{ border:'1px solid green'}}>
              //   <Col span={(21/100.0)*24} >备注</Col>
              //   <Col span={(79/100.0)*24}>备注的内容</Col>
              // </Col>
            );
          }}
          footer={() => {
            return (
              OptrightStore.hasRight(umid, 'SYS105') && (
                <Button
                  style={{ width: '100%', height: '100%' }}
                  onClick={() => {
                    addTaskOnClick();
                  }}
                >
                  添加新任务
                </Button>
              )
            );
          }}
        />
      </Card>
    </>
  );
});

export default Zrgl;

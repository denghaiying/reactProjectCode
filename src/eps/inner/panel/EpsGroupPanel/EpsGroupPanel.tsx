import { observer } from "mobx-react";
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Table, Button, Form, Row, Col, Tabs, message, Modal } from "antd";
import './index.less';
import { SearchOutlined, FileAddOutlined, EditOutlined, DeleteOutlined, SaveOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { EpsTableStore, EpsDetailTableStore } from ".";
import { EpsSource, TableColumn } from "@/eps/commons/declare";
import EpsFormType from '@/eps/commons/EpsFormType';
import EpsForm from '../../form/EpsForm';
import { EditableProTable } from '@ant-design/pro-table';
import { EpsDetailProps } from '../EpsGroupPanel/EpsDetailPanel';
import moment from 'moment';

const formItemLayout = {
  colon: false,
  labelCol: {
    span: 8
  },
};

const { confirm } = Modal;
const EpsGroupPanel = observer(forwardRef((props: EpsDetailProps, ref) => {

  // 搜索表单
  const searchForm = props.searchForm;
  const [form] = Form.useForm();
  const data = {};
  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(props.tableService))
  const [columns, setColumns] = useState<TableColumn[]>([])
  // 设置tab激活状态
  const [activeKey, setActiveKey] = useState("1");
  // 表格选中行时，设置key值
  const [rowSelection, setRowSelection] = useState(props.tableProp?.rowSelection);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  // 表格选中行时， 设置行属性
  const [checkedRows, setCheckedRows] = useState<any>([]);
  //  表格选中行时，记录当前行数据
  const [selectedRowData, setSelectedRowData] = useState({});
  let { tableList, loading, page, size, total } = tableStore;
  const onPageSizeChange = (page, size) => {
    page != tableStore.page && (tableStore.page = page);
    size !== tableStore.size && (tableStore.size = size);
  }

  // 暴露tableStore
  useImperativeHandle(ref, () => ({
    getTableStore: () => tableStore
  }));

  // 自定义功能按钮
  const customAction = props.customAction || undefined;
  // 自定义表单，用于替换默认
  size !== tableStore.size && (tableStore.size = size);
  const customForm = props.customForm || undefined;
  // // 表格按钮相关配置,外部控制按钮的显隐
  // const enableEdit = !props.tableProp?.disableEdit;
  // const enableDelete = !props.tableProp?.disableDelete;
  // const enableAdd = !props.tableProp?.disableAdd;
  //表格按钮相关配置,控制按钮是否可可点击
  const [disableSave, setDisablesave] = useState(true);
  const [disableCancel, setDisablecancel] = useState(true);
  const [disableEdit, setDisableedit] = useState(false);
  const [disableDelete, setDisabledelete] = useState(false);
  const [disableAdd, setDisableadd] = useState(false);
  //用于区分是新增、编辑操作（1是新增,2是编辑）
  const [czType, setCztype] = useState("");
  //控制主表单在详情页与列表页切换时是否提示保存
  const [isDisabled, setIsDisabled] = useState(false);

  // 创建明细表格Store实例
  const [detailStore] = useState<EpsDetailTableStore>(new EpsDetailTableStore(props.detailService))
  let { detailTablelist, detailLoading, detailPage, detailSize, detailTotal } = detailStore;
  const [detailColumns, setDetailcolumns] = useState<TableColumn[]>([])
  //主表单
  const [formBd] = Form.useForm();
  //明细表数据
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  type DataSourceType = {
    id: React.Key;
    title?: string;
    decs?: string;
    state?: string;
    created_at?: string;
    update_at?: string;
    children?: DataSourceType[];
  };

  useEffect(() => {
    //获取主表的表格列
    setColumns(getTableColumn(props.source));
    //获取明细表的表格列
    setDetailcolumns(props.detailSource);
  }, [props.source, props.detailSource]);
  useEffect(() => {
    tableStore.findByKey(tableStore.key, 1, tableStore.size, tableStore.params);
  }, [tableStore.key])

  //获取搜索框
  const makeForm = (searchForm) => {
    if (searchForm) {
      const { props: { children } } = searchForm();
      if (children) {
        if (Object.prototype.toString.call(children) === '[object Object]') {
          return (
            <><div className="row">{children}</div></>
          )
        }
        if (Array.isArray(children)) {
          if (children && children.length > 0) {
            return children.map((item, index) => {
              return (
                <Col span={6} key={index}>
                  {item}
                </Col>
              )
            })
          } else {
            return (<></>)
          }
        }
      }
    }
  }
  //搜索事件
  const handleSearch = () => {
    form.validateFields().then(data => {
      data = Object.assign({}, props.initParams || {}, data)
      if (tableStore.page === 1) {
        tableStore.findByKey(tableStore.key, tableStore.page, tableStore.size, data)
      } else {
        tableStore.params = data;
        tableStore.page = 1;
      }
    })
      .catch(info => {
        message.error('数据搜索失败,' + info)
      }).finally(() => {
      })
  }

  // 获取主表格列
  const getTableColumn = (list: Array<EpsSource>) => {
    const columns: Array<any> = [{
      title: '序号',
      align: 'center',
      fixed: 'left',
      width: 60,
      render: (_, __, index: number) => index + (tableStore.page - 1) * tableStore.size + 1,
    }];
    if (list) {
      for (let item of list) {
        item && columns.push(new TableColumn(item.code, item.title, item.align, item.render, item.width, item.ellipsis, item.fixed));
      }
    }
    return columns;
  }


  //点击新增按钮时跳转到空白详情页
  const onAddClick = () => {
    formBd.resetFields();
    setDataSource([]);
    setSelectedRowData({});
    setDisablesave(false);
    //控制保存、确认按钮是否可编辑
    props?.setDisablesave(false);
    setDisablecancel(false);
    setDisableadd(true);
    setDisableedit(true);
    setDisabledelete(true);
    //控制详情页流程按钮的显隐
    props?.setDisabledelete(true);
    //控制主表单是否可以编辑
    props?.setDisabled(false);
    setIsDisabled(false);
    setActiveKey('2');
    setCztype('1');

  }
  //点击编辑按钮时跳转到数据回显的详情页
  const onEditClick = () => {
    if (!selectedRowKeys || selectedRowKeys.length < 1) {
      return message.warning('请选择一条数据!');
    }
    let fData = JSON.parse(JSON.stringify(selectedRowData));
    props.source.forEach(item => {
      if (item.formType === EpsFormType.DatePicker) {
        if (selectedRowData.hasOwnProperty(item.code)) {
          fData[item.code] = moment(selectedRowData[item.code]);
        }
      }
    });
    formBd.setFieldsValue(fData);
    setDisablecancel(false);
    setDisablesave(false);
    //控制保存、确认按钮是否可编辑
    props?.setDisablesave(false);
    setDisableadd(true);
    setDisabledelete(true);
    //控制详情页流程按钮的显隐
    props?.setDisabledelete(true);
    setDisableedit(true);
    //控制主表单是否可以编辑
    props?.setDisabled(false);
    setIsDisabled(false);
    setCztype('2');
    setActiveKey('2');
    setDataSource(detailTablelist);
  }

  //点击列表页的删除按钮事件
  const onDeleteClick = () => {
    if (!selectedRowKeys || selectedRowKeys.length < 1) {
      return message.warning('请选择一条数据!');
    }
    setSelectedRowData(selectedRowData);
    showDeleteconfirm();
  }
  //列表页删除的提示弹框
  const showDeleteconfirm = () => {
    confirm({
      title: '确定要删除该条数据么?',
      icon: <ExclamationCircleOutlined />,
      content: '数据删除后将无法恢复，请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: handleDeleteOk,
      onCancel: handleCancel,
    });
  }
  //删除的提示弹框的确定按钮
  const handleDeleteOk = async () => {
    //删除主表和明细表数据
    let list = [];
    if (detailTablelist.length > 0) {
      detailTablelist.forEach((detail) => {
        list.push(detail['id']);
      });
    }
    selectedRowData['ids'] = list;
    const res = await tableStore.delete(selectedRowData);
    if (res) {
      tableStore.findByKey(tableStore.key, 1, tableStore.size, tableStore.params);
      Modal.destroyAll();
    }
  };

  //封装用于多处使用---新增主表数据和明细表数据
  const addData = () => {
    //新增主表数据和明细表数据保存
    formBd.validateFields().then(values => {
      values['detailList'] = dataSource;
      tableStore.save(values).then(res => {
        tableStore.findByKey(tableStore.key, 1, tableStore.size, tableStore.params);
        //控制主表单是否可以编辑
        props?.setDisabled(true);
        setIsDisabled(true);
        setDisablecancel(true);
        setDisablesave(true);
        //控制保存、确认按钮是否可编辑
        props?.setDisablesave(true);
        setDisableadd(false);
        setDisableedit(true);
        setDisabledelete(true);
        //控制详情页流程按钮的显隐
        props?.setDisabledelete(true);
        setCztype("");
        formBd.setFieldsValue(res.data.id);
      }).catch(err => {
        message.error(err);
      });
    }).catch(info => {
      message.error(`数据添加失败,${info}`)
    });
  }
  //封装用于多处使用---修改主表数据和明细表保存
  const editData = () => {
    //修改主表数据和明细表保存
    formBd.validateFields().then(values => {
      values['id'] = selectedRowData['id'];
      // 修改Switch的值
      const switchs = props.source.filter(item => item.formType === EpsFormType.Switch)
      if (switchs) {
        switchs.forEach(it => {
          let result = it.dataSource;
          values[it.code] = values[it.code] ? result[0]?.key : result[1]?.key
        })
      }
      //明细数据
      values['detailList'] = dataSource;
      let list = [];
      if (detailTablelist.length > 0) {
        detailTablelist.forEach((detail) => {
          list.push(detail['id']);
        });
      }
      values['ids'] = list;
      tableStore.update(values).then(res => {
        message.success('数据修改成功');
        tableStore.findByKey(tableStore.key, 1, tableStore.size, tableStore.params);
        formBd.resetFields();
        setSelectedRowData({});
        setSelectedRowKeys([]);
        setDisablesave(true);
        //控制保存、确认按钮是否可编辑
        props?.setDisablesave(true);
        setDisablecancel(true);
        setDisableadd(false);
        setDisableedit(false);
        setDisabledelete(false);
        //控制详情页流程按钮的显隐
        props?.setDisabledelete(false);
        setActiveKey('1');
        setCztype("");
      }
      ).catch(err => {
        message.error(err);
      }
      );
    }).catch(info => {
      message.error(`数据修改失败,${info}`)
    });
  }


  //点击列表页的保存按钮事件
  const onSaveClick = () => {
    if (czType === '1') {
      //新增主表数据和明细表数据保存
      if (dataSource.length > 0) {
        //明细内容有数据
        addData();
      } else {
        //明细内容无数据
        showSaveconfirm();
      }
    } else if (czType === '2') {
      //修改主表数据和明细表保存
      editData();
    }
  }
  //点击保存按钮时无明细内容时确认是否保存
  const showSaveconfirm = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '明细内容为空，是否保存?',
      okText: '保存',
      okType: 'danger',
      cancelText: '取消',
      onOk: addData,
      onCancel: handleCancel,
    });
  }
  //删除和保存提示弹框的取消按钮、新增和编辑到列表页的取消按钮
  const handleCancel = () => {
    console.log('Clicked cancel button');
  };

  //点击列表页的取消按钮事件
  const onCancelClick = () => {
    tableStore.findByKey(tableStore.key, 1, tableStore.size, tableStore.params);
    formBd.resetFields();
    setDataSource([]);
    setSelectedRowData({});
    setSelectedRowKeys([]);
    setDisablecancel(true);
    setDisablesave(true);
    //控制保存、确认按钮是否可编辑
    props?.setDisablesave(true);
    setDisableadd(false);
    setDisableedit(false);
    setDisabledelete(false);
    //控制详情页流程按钮的显隐
    props?.setDisabledelete(false);
    //返回列表页
    setActiveKey('1');
    setCztype("");
  }
  //table表格的onChange事件
  const onTableRowChange = (selectedRowKeys, records) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRowData(records[0]);
    props?.setSelectedRowData(records);
    //根据主表id查询明细表数据
    if (records.length > 0) {
      detailStore.findByKey(detailStore.detailKey, 1, detailStore.detailSize, { "id": records[0].id });
    }
  };

  //切换tab页事件
  const onTabClick = (val) => {
    //在详情页 -> 列表页
    if (val === '1') {
      if (isDisabled === true) {
        tableStore.findByKey(tableStore.key, 1, tableStore.size, tableStore.params);
        setActiveKey('1');
        setDisablesave(true);
        //控制保存、确认按钮是否可编辑
        props?.setDisablesave(true);
        setDisablecancel(true);
        setDisableadd(false);
        setDisableedit(false);
        setDisabledelete(false);
        //控制详情页流程按钮的显隐
        props?.setDisabledelete(false);
        setSelectedRowData({});
        setSelectedRowKeys([]);
        setDataSource([]);
        formBd.resetFields();
        //控制主表单是否可以编辑
        props?.setDisabled(false);
        setIsDisabled(false);
      } else {
        if (activeKey === '2') {
          showTabconfirm();
        }
      }
    } else {
      // 从列表页-> 详情页
      if (!selectedRowKeys || selectedRowKeys.length < 1) {
        return message.warning('请选择一条数据!');
      } else {
        let fData = JSON.parse(JSON.stringify(selectedRowData));
        props.source.forEach(item => {
          if (item.formType === EpsFormType.DatePicker) {
            if (selectedRowData.hasOwnProperty(item.code)) {
              fData[item.code] = moment(selectedRowData[item.code]);
            }
          }
        });
        formBd.setFieldsValue(fData);
        setDataSource(detailTablelist);
        setIsDisabled(true);
        //控制主表单是否可以编辑
        props?.setDisabled(true);
        setDisablesave(true);
        //控制保存、确认按钮是否可编辑
        props?.setDisablesave(true);
        setDisablecancel(true);
        setDisableadd(false);
        setDisableedit(false);
        setDisabledelete(true);
        //控制详情页流程按钮的显隐
        props?.setDisabledelete(true);
        setActiveKey('2');
      }
    }
  }
  //在详情页面想要点击列表页的确认弹框
  const showTabconfirm = () => {
    confirm({
      title: czType === '2' ? '是否切换至列表页?' : '是否保存数据?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '保存',
      okType: 'danger',
      cancelText: '取消',
      onOk: czType === '2' ? editData : addData,
      onCancel: handleCancel,
    });
  }

  return (
    <div style={{ height: '100%' }}>
      { //搜索框
        searchForm &&
        <Row>
          <Col span={20}>
            <div className="search">
              <Form name="searchForm" form={form} {...formItemLayout} initialValues={data}>
                <Row className="form-row">
                  {makeForm(searchForm)}
                </Row>
              </Form>
            </div>
          </Col>
          <Col span={4}>
            <div className="btns"> <Button type="primary" style={{ fontSize: '12px' }} onClick={handleSearch} icon={<SearchOutlined />}>查询</Button></div>
          </Col>
        </Row>
      }

      <div className="btns-group">
        <Button.Group >
          <Button onClick={onAddClick} disabled={disableAdd} type="primary" style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }} icon={<FileAddOutlined />}>新增</Button>
          <Button onClick={onEditClick} disabled={disableEdit} type="primary" style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }} icon={<EditOutlined />}>修改</Button>
          <Button onClick={onDeleteClick} disabled={disableDelete} type="primary" style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }} icon={<DeleteOutlined />}>删除</Button>
          <Button onClick={onSaveClick} disabled={disableSave} type="primary" style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }} icon={<SaveOutlined />}>保存</Button>
          <Button onClick={onCancelClick} disabled={disableCancel} type="primary" style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }} icon={<CheckCircleOutlined />}>取消</Button>
          {
            // 自定义功能按钮
            customAction && customAction(tableStore, checkedRows)
          }
        </Button.Group>
      </div>
      <div className="tabs" >
        < Tabs type="card" size="small" activeKey={activeKey} onTabClick={(val) => onTabClick(val)}>
          <Tabs.TabPane tab="列表页" key="1" style={{ height: '100%' }}>
            {
              //列表页的Table表格
              rowSelection ?
                <Table columns={columns} dataSource={tableList} bordered className="group-table"
                  pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                    defaultCurrent: page,
                    defaultPageSize: size,
                    pageSize: size,
                    current: page,
                    showTotal: (total, range) => `共 ${total}  条数据`,
                    onChange: onPageSizeChange,
                    total: total
                  }}
                  loading={loading}
                  expandable={{
                    expandIconColumnIndex: 1,
                    defaultExpandAllRows: true,
                  }}
                  rowSelection={{ onChange: onTableRowChange, selectedRowKeys: selectedRowKeys, type: 'radio' }}
                />
                :
                <Table columns={columns} dataSource={tableList} bordered scroll={{ x: 'max-content' }} pagination={{
                  showQuickJumper: true,
                  showSizeChanger: true,
                  defaultCurrent: page,
                  defaultPageSize: size,
                  pageSize: size,
                  current: page,
                  showTotal: (total, range) => `共 ${total} 条数据`,
                  onChange: onPageSizeChange,
                  total: total
                }}
                  loading={loading}
                  className="group-table"
                  expandable={{
                    expandIconColumnIndex: 1,
                    defaultExpandAllRows: true,
                  }}
                />
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="详情页" key="2" >
            <div className="detail-oa">
              <div className="detail-content">
                <div className="form-content">
                  <EpsForm source={props.source} data={selectedRowData} form={formBd} customForm={customForm} ></EpsForm>
                </div>
                <div className="sec-title">
                  <span className="title-icon"></span>明细内容
                </div>
                <div className="editTable">
                  {isDisabled ?
                    <EditableProTable<DataSourceType>
                      style={{ fontSize: '12px' }}
                      scroll={{ y: '250px' }}
                      rowKey="id"
                      bordered
                      recordCreatorProps={false}
                      columns={detailColumns}
                      value={dataSource}
                      onChange={setDataSource}
                      editable={{
                        type: 'single',
                        editableKeys,
                        onValuesChange: (record, recordList) => {
                          setDataSource(recordList);
                        },
                        onChange: setEditableRowKeys,
                        actionRender: (row, config, defaultDoms) => {
                          return [defaultDoms.save, defaultDoms.delete];
                        },
                      }}
                    /> :
                    <EditableProTable<DataSourceType>
                      style={{ fontSize: '12px' }}
                      scroll={{ y: '250px' }}
                      rowKey="id"
                      bordered
                      recordCreatorProps={{
                        position: 'bottom',
                        newRecordType: 'dataSource',
                        record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
                      }}
                      columns={detailColumns}
                      value={dataSource}
                      onChange={setDataSource}
                      controlled
                      editable={{
                        type: 'single',
                        editableKeys,
                        onValuesChange: (record, recordList) => {
                          setDataSource(recordList);
                        },
                        onChange: setEditableRowKeys,
                        actionRender: (row, config, defaultDoms) => {
                          return [defaultDoms.save, defaultDoms.delete];
                        },
                      }}
                    />}
                </div>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div >
  );
}));

export default EpsGroupPanel;

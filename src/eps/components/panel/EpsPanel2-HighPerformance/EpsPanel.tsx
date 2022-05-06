/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import {
  Input,
  Table,
  Tree,
  Tabs,
  message,
  Button,
  Modal,
  Form,
  Space,
  Checkbox,
  Pagination,
  Spin,
} from 'antd';
import { observer } from 'mobx-react';
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { EpsTableStore } from '.';
import EpsAddButton from '../../buttons/EpsAddButton';
import EpsDeleteButton from '../../buttons/EpsDeleteButton';
import EpsEditButton from '../../buttons/EpsEditButton';
import EpsTreeStore from './EpsTreeStore';
import AdvancedSearch from './advancedSearch';

import './index.less';
import {
  UnorderedListOutlined,
  LeftOutlined,
  RightOutlined,
  AlertOutlined,
  CloseCircleFilled,
} from '@ant-design/icons';
import { EpsProps, EpsSource } from '@/eps/commons/declare';
import { TableColumn } from './EpsTableColumn';
import { runInAction } from 'mobx';
import TreeTableSelect from './treeTableSelect/TreeTableSelect';
import EpsForm from '../../form/EpsForm';
import moment from 'moment';
import EpsFormType from '@/eps/commons/EpsFormType';
import { useForm } from 'antd/es/form/Form';
import EpsBatchDeleteButton from '../../buttons/EpsBatchDeleteButton';
import EpsCopyButton from '../../buttons/EpsCopyButton';
import childIcon from '@/styles/assets/img/tree/icon_child.png';
import parentIcon from '@/styles/assets/img/tree/icon_parent.png';
import emptyIcon from '../../../../styles/assets/img/icon_empty.png';
import iconAddBorder from '../../../../styles/assets/img/icon_add_border.png';

import Img from '@/styles/assets/img/menu-icon/icon_归档.png';
import MenuService from '../../service/MenuService';
import { useTablePipeline, features, BaseTable } from 'ali-react-table';
import { CornerDownLeft, Iron } from '@icon-park/react';
import { AntdBaseTable } from './AntdBaseTable';
import * as fusion from '@alifd/next';
const { TreeNode } = Tree;

const { Search } = Input;
const { TabPane } = Tabs;
const PerImgWidth = 32; // 表格按钮列宽

const getIcon = (name: string) => {
  try {
    return [require(`@/styles/assets/img/menu-icon/icon_${name}.png`)];
  } catch (err) {
    return Img;
  }
};
// 扩展table

const EpsPanel = observer(
  forwardRef((props: EpsProps, ref) => {
    const [treeSelectData, setTreeSelectData] = useState('');

    const onTreeSelect = props.onTreeSelect;

    const treeCheckAble = props.treeProp?.treeCheckAble || false;

    const tabData = props.tabProps?.tabData || [];
    const [tabCheckKey, setTabCheckKey] = useState('');

    // 左侧树选择后，设置选中值
    const onSelect = (e) => {
      runInAction(() => {
        1 !== tableStore.page && (tableStore.page = 1);
        if (!props.noRender) {
          tableStore.params = { ...(props.initParams || {}) };
          tableStore.key = e.length > 1 ? e : e[0];
        } else {
          tableStore.params = Object.assign(
            {},
            { treeData: e.length > 1 ? e : e[0] },
          );
          treeStore.key = e.length > 1 ? e : e[0];
        }
        if (props.afterTreeSelectAction) {
          props.afterTreeSelectAction(e && e[0]);
        }
      });
    };

    // 左侧树伸缩
    const [isExpand, setIsExpand] = useState(
      props.treeProp?.extend === undefined ? true : props.treeProp?.extend,
    );

    // 左侧表格搜索框
    const [treeSearch, setTreeSearch] = useState(true);
    // 右侧表格搜索框
    const [tableSearch, setTableSearch] = useState(true);
    const [drawVisible, setDrawVisible] = useState(false);
    // 创建左侧树Store实例
    const [treeStore] = useState<EpsTreeStore>(
      new EpsTreeStore(props.treeService),
    );
    // 创建右侧表格Store实例
    const [tableStore] = useState<EpsTableStore>(
      new EpsTableStore(props.tableService),
    );
    const [columns, setColumns] = useState<TableColumn[]>([]);

    // 表格选中行时， 设置行属性
    const { checkedRows, setCheckedRows } = tableStore;
    const { selectedRowKeys, setSelectedRowKeys } = tableStore;

    // 暴露tableStore
    useImperativeHandle(ref, () => ({
      getTableStore: () => tableStore,
      getTreeStore: () => treeStore,
      clearTableRowClick: () => {
        setSelectedRowKeys([]);
        setCheckedRows([]);
      },
    }));

    // 表格相关配置
    const enableEdit = !props.tableProp?.disableEdit;
    const enableDelete = !props.tableProp?.disableDelete;
    const enableAdd = !props.tableProp?.disableAdd;
    const enableCopy = !props.tableProp?.disableCopy;
    // 表格选中行时，设置key值
    const [rowSelection, setRowSelection] = useState(
      props.tableProp?.rowSelection,
    );
    let actionWidth =
      0 +
      (enableEdit ? PerImgWidth : 0) +
      (enableDelete ? PerImgWidth : 0) +
      (enableCopy ? PerImgWidth : 0);

    // 详情页Modal控制
    const [viewVisible, setViewVisible] = useState(false);
    const [viewRecord, setViewRecord] = useState({});
    const [form] = Form.useForm();

    // 右侧菜单按钮控制
    const { menuProp } = props;

    const onRowChange = (
      nextValue: string[],
      key: string,
      keys: string[],
      action: 'check' | 'uncheck' | 'check-all' | 'uncheck-all',
    ) => {
      setSelectedRowKeys(nextValue);
      setCheckedRows(nextValue);
      if (props.tableRowClick) {
        props.tableRowClick(
          tableStore.tableList.find((item) => item.id == key),
          tableStore,
        );
      }
      // if (rowSelection) {
      //     // setSelectedRowKeys(keys);
      //     // setCheckedRows(nextValue
      //       );
      //   };
    };

    if (Array.isArray(menuProp) && menuProp.length > 0) {
      // 使用menu，初始化 行选择数据
      if (!rowSelection) {
        setRowSelection({
          selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
          ],
          type: 'radio',
          onChange: (value, row) => {
            props.tableRowClick(record1, tableStore);
            setSelectedRowKeys(value);
            setCheckedRows(row);
          },
          selectedRowKeys: selectedRowKeys,
        });
      }
    }

    // 自定义表单，用于替换默认表单
    const customForm = props.customForm || undefined;
    // 搜索表单，如有设置，则显示高级搜索
    const searchForm = props.searchForm;

    // 自定义功能按钮
    const customAction = props.customAction || undefined;
    // 自定义表格行按钮
    const customTableAction = props.customTableAction || undefined;
    if (customTableAction) {
      const cta = customTableAction('', {}, 0, tableStore, checkedRows);

      if (cta.props?.children) {
        if (
          Object.prototype.toString.call(cta.props?.children) ===
          '[object Object]'
        ) {
          actionWidth += PerImgWidth;
        }
        if (Array.isArray(cta.props?.children)) {
          actionWidth += cta.props?.children.length * PerImgWidth;
        }
      } else {
        actionWidth += cta.length * PerImgWidth;
      }
    }

    // 获取表格列
    const getTableColumn = (list: EpsSource[], rows: any[]) => {
      const col: any[] = [];

      if (!props.tableProp?.disableIndex) {
        col.push({
          title: '序号',
          align: 'center',
          fixed: 'left',
          width: 60,
          render: (_, __, index: number) =>
            index + (tableStore.page - 1) * tableStore.size + 1,
        });
      }
      if (enableDelete || enableEdit || actionWidth > 0) {
        col.push({
          title: '操作',
          align: 'center',
          key: 'action',
          fixed: actionWidth > 0 ? 'left' : false,
          width: actionWidth === PerImgWidth ? 50 : actionWidth,
          onCell: (record, rowIndex) => {
            return {
              onClick: (event) => {
                event.nativeEvent.stopImmediatePropagation();
                event.stopPropagation();
              },
            };
          },
          render: (
            text: string,
            record: Record<string, unknown>,
            index: number,
            control?: { editEnable: boolean; delEnable: boolean },
          ) => {
            const rcd = { ...(props.initParams || {}), ...record };
            const editBtnContrl = (rcd = record) => {
              if (!props.tableProp?.editBtnControl) {
                return true;
              }
              return props.tableProp?.editBtnControl(rcd);
            };
            const delBtnContrl = (rcd = record) => {
              if (!props.tableProp?.delBtnControl) {
                return true;
              }
              return props.tableProp?.delBtnControl(rcd);
            };
            return (
              <Space>
                {customTableAction &&
                  customTableAction(text, rcd, index, tableStore, rows)}
                {enableCopy && (
                  <EpsCopyButton
                    width={props.formWidth}
                    column={props.source}
                    key={`common-copy-${index}`}
                    title={props.title.name}
                    data={rcd}
                    store={tableStore}
                    customForm={customForm}
                    treeStore={treeStore}
                    refresh={props.tableProp?.refreshTree}
                  />
                )}
                {enableEdit && editBtnContrl(record) && (
                  <EpsEditButton
                    width={props.formWidth}
                    column={props.source}
                    key={`common-update-${index}`}
                    title={props.title.name}
                    data={rcd}
                    store={tableStore}
                    customForm={customForm}
                    treeStore={treeStore}
                    refresh={props.tableProp?.refreshTree}
                    onClick={props.tableProp?.onEditClick}
                    labelColSpan={props.tableProp?.labelColSpan}
                    afterEdit={props.tableProp?.afterEdit}
                  />
                )}
                {enableDelete && delBtnContrl(record) && (
                  <EpsDeleteButton
                    data={rcd}
                    store={tableStore}
                    key={`common-delete-${index}`}
                    treeStore={treeStore}
                    refresh={props.tableProp?.refreshTree}
                    deleteMessage={props.tableProp?.deleteMessage}
                    onClick={props.tableProp?.onDeleteClick}
                    afterDelete={props.tableProp?.afterDelete}
                  />
                )}
              </Space>
            );
          },
        });
      }
      if (list) {
        // eslint-disable-next-line no-restricted-syntax
        for (const item of list.filter((i) => !i.tableHidden)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          item &&
            col.push(
              new TableColumn(
                item.code,
                item.title,
                item.align,
                item.render,
                item.width,
                item.ellipsis,
                item.fixed,
              ),
            );
        }
      }
      return col;
    };

    const { loading, page, size, total, key } = tableStore;

    const onPageSizeChange = (page, size) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions

      page !== tableStore.page && (tableStore.page = page);
      page = page == 0 ? 1 : page;
      size !== tableStore.size && (tableStore.size = size);
    };

    // 左侧树区域展开收缩
    const [showMenus, setShowMenus] = useState(false);
    const [addBtnArr, setAddBtnArr] = useState<Array<any>>([]); // 添加到导航栏的按钮
    const [editFlag, setEditFlag] = useState(false);

    const clickAdd = async (item: Record<string, unknown>) => {
      // 添加菜单
      // 添加到后台
      let { params } = item;
      if (params) {
        params.isadd = 'Y';
      }
      const res = await MenuService.modify(params);
      if (res.success) {
        message.success('菜单添加成功');
        let newAddArr: Array<any> = [...addBtnArr];
        if (newAddArr.includes(item)) {
          message.warning({ type: 'warning', content: '请勿重复添加' });
          return;
        }
        newAddArr.push(item);
        setAddBtnArr(newAddArr);
      }
    };

    const delBtn = async (item) => {
      // 删除菜单
      let { params } = item;
      if (params) {
        params.isadd = 'N';
      }
      const res = await MenuService.modify(params);
      if (res.success) {
        message.success('菜单移除成功');
      }
      let newAddArr = [...addBtnArr];
      newAddArr.splice(
        newAddArr.findIndex((val) => val === item),
        1,
      );
      setAddBtnArr(newAddArr);
    };

    useEffect(() => {
      props.tabProps?.onTabChange(tabCheckKey);
    }, [tabCheckKey]);

    // 用户选择表格行时
    useEffect(() => {
      if (props.setCheckRows) {
        props.setCheckRows(checkedRows);
      }
    }, [checkedRows]);

    useEffect(() => {
      tableStore.params = { ...(props.initParams || {}), ...tableStore.params };
    }, [props.initParams]);

    // 初始化按钮栏目按钮
    useEffect(() => {
      const newAddArr = props.menuButton || [];

      setAddBtnArr(newAddArr);
    }, [props.menuButton?.length, props.menuProp?.length]);

    useEffect(() => {
      if (props.tableProp?.refreshTree) {
        treeStore.findTree(treeStore.key);
      }
      debugger;
      setSelectedRowKeys([]);
      setCheckedRows([]);
    }, [tableStore.total]);

    const onTableSearch = (tableSearchValue) => {
      const code = props.tableProp?.searchCode || 'key';
      const params: Record<string, unknown> = { ...(props.initParams || {}) };
      params[code] = tableSearchValue;
      tableStore.findByKey(tableStore.key, 1, tableStore.size, params);
    };

    let _height = window.innerHeight - 314;

    useEffect(() => {
      if (props.tableProp?.defaultSize) {
        runInAction(() => {
          tableStore.size = props.tableProp.defaultSize;
        });
      }
    }, [props.tableProp?.defaultSize]);

    useEffect(() => {
      // eslint-disable-next-line no-underscore-dangle
      let _flag =
        props.treeProp?.treeSearch === undefined
          ? true
          : props.treeProp?.treeSearch;
      if (_flag) {
        _height = _height - 20;
      }
      // 是否显示左侧树查询框
      setTreeSearch(
        props.treeProp?.treeSearch === undefined
          ? true
          : props.treeProp?.treeSearch,
      ); //左侧树搜索框
      // 是否显示右侧表格查询框
      setTableSearch(
        props.tableProp?.tableSearch === undefined
          ? true
          : props.tableProp?.tableSearch,
      ); //右侧树搜索框
      // 设置表格列
      // setColumns(getTableColumn(props.source));
      const autoLoad =
        props.treeAutoLoad === undefined ? true : props.treeAutoLoad;
      autoLoad && treeStore.findTree('', props.treeParams);
    }, []);

    useEffect(() => {
      const tableAutoLoad =
        props.tableAutoLoad === undefined ? true : props.treeAutoLoad;
      if (
        tableAutoLoad ||
        (!tableAutoLoad && key !== '') ||
        tableAutoLoad === undefined
      ) {
        if (tableStore.params.sfdyw && props.onStflChange && key !== '') {
          props.onStflChange(tableStore.key);
        }
        tableStore.findByKey(
          tableStore.key,
          tableStore.page,
          tableStore.size,
          tableStore.params,
        );
      }
      setSelectedRowKeys([]);
      setCheckedRows([]);
    }, [key, page, size]);

    useEffect(() => {
      setColumns(getTableColumn(props.source, checkedRows));
    }, [props.source, checkedRows]);

    useEffect(() => {
      if (props.menuLoad) {
        props.menuLoad();
      }
    }, [addBtnArr.length]);

    // 扩展table
    const pipeline = useTablePipeline({ components: fusion })
      .input({ dataSource: tableStore.tableList, columns })
      .primaryKey('id') // 每一行数据由 id 字段唯一标记
      .use(
        features.multiSelect({
          highlightRowWhenSelected: true,
          defaultValue: [],
          defaultLastKey: '',
          value: selectedRowKeys,
          checkboxPlacement: 'start',
          checkboxColumn: { lock: true },
          clickArea: 'row',
          onChange: onRowChange,
        }),
      )
      .use(
        features.columnResize({
          fallbackSize: 10,
          handleBackground: 'rgba(255,255,255,0.2)',
          handleHoverBackground: '#aaa',
          handleActiveBackground: '#89bff7',
        }),
      );

    // pipeline.getProps() 将生成以下 props
    //    dataSource, columns, primaryKey, getRowProps
    // 使用时注意不要覆盖这些 props

    return (
      <div className="eps-manage">
        <Spin spinning={tableStore.loading}>
          <div className={props.title.name ? 'title' : ''}>
            {props.title.name}
          </div>
          <div className={isExpand ? 'content' : 'content hideExpand'}>
            <div className="tree">
              {props.treeProp?.treeExpand && (
                <div className="treeExpand">
                  {props.treeProp?.treeExpand(props.treeParams, treeStore)}
                </div>
              )}

              {
                // 左侧树搜索框
                treeSearch && (
                  <Search
                    placeholder="搜索"
                    type="normal"
                    className="search"
                    onSearch={async (key) => {
                      await treeStore.findTree(key, treeStore.params);
                    }}
                  />
                )
              }
              {!treeStore.treeList.length ? (
                <div
                  className="empty"
                  style={{ textAlign: 'center', marginTop: '45%' }}
                >
                  <img src={emptyIcon} />
                  <p>暂无数据</p>
                </div>
              ) : (
                <>
                  {props.treeProp?.isAsync ? (
                    <Tree
                      checkable={treeCheckAble}
                      showIcon
                      defaultExpandAll={false}
                      expandedKeys={treeStore.expandedKeys}
                      onSelect={onSelect}
                      onExpand={async (keys, { expanded, node }) => {
                        if (expanded) {
                          await treeStore.loadAsyncData(
                            node,
                            <img src={childIcon} />,
                            <img src={parentIcon} />,
                          );
                        }
                        runInAction(() => {
                          treeStore.expandedKeys = keys;
                        });
                      }}
                      // loadData={loadAsyncData}
                      treeData={treeStore.getList(
                        <img src={childIcon} />,
                        <img src={parentIcon} />,
                      )}
                      // treeData={treeStore.treeList}
                      onCheck={onSelect}
                    />
                  ) : (
                    <Tree
                      checkable={treeCheckAble}
                      showIcon
                      defaultExpandAll={true}
                      onSelect={onSelect}
                      onCheck={onSelect}
                      treeData={treeStore.getList(
                        <img src={childIcon} />,
                        <img src={parentIcon} />,
                      )}
                    ></Tree>
                  )}
                </>
              )}
              <div className="collapse-icon">
                <LeftOutlined
                  size={12}
                  className="icon left-arrow"
                  onClick={() => {
                    props.treeProp?.onExtendChange &&
                      props.treeProp?.onExtendChange(false);
                    setIsExpand(false);
                  }}
                />
                <RightOutlined
                  size={12}
                  className="icon right-arrow"
                  onClick={() => {
                    props.treeProp?.onExtendChange &&
                      props.treeProp?.onExtendChange(true);
                    setIsExpand(true);
                  }}
                />
              </div>
            </div>
            <div className={showMenus ? 'right show-menus' : 'right'}>
              <div
                className={'control'}
                style={{ marginLeft: menuProp ? '60px' : 'auto' }}
              >
                {props.noRender && (
                  <TreeTableSelect
                    tableStore={tableStore}
                    treeStore={treeStore}
                    selectService={props.selectService}
                  />
                )}
                {
                  // 右侧表格搜索框
                  tableSearch && (
                    <>
                      <Search
                        placeholder="请输入搜索内容"
                        style={{ width: 300, marginRight: 10 }}
                        onSearch={(val) => onTableSearch(val)}
                      />
                    </>
                  )
                }
                {searchForm && (
                  <>
                    <Button
                      type="primary"
                      // icon={<AlertOutlined />}
                      style={{ marginRight: 10, fontSize: 12 }}
                      onClick={() => setDrawVisible(true)}
                    >
                      更多检索
                    </Button>
                  </>
                )}
                {enableAdd && (
                  <EpsAddButton
                    width={props.formWidth}
                    column={props.source}
                    title={props.title.name}
                    service={props.tableService}
                    store={tableStore}
                    customForm={customForm}
                    onClick={props.tableProp?.onAddClick}
                    labelColSpan={props.tableProp?.labelColSpan}
                    disabled={props.addReadonly}
                    afterAdd={props.tableProp?.afterAdd}
                  ></EpsAddButton>
                )}
                {checkedRows.length > 0 &&
                  props.tableProp?.rowSelection?.type === 'checkbox' &&
                  props.tableProp?.enableBatchDelete && (
                    <EpsBatchDeleteButton
                      store={tableStore}
                      data={checkedRows}
                      afterDelete={props.tableProp?.afterDelete}
                    />
                  )}
                {
                  // 自定义功能按钮
                  customAction && customAction(tableStore, checkedRows)
                }
                {menuProp && (
                  <>
                    <span className="menu" onClick={() => setShowMenus(true)}>
                      <UnorderedListOutlined
                        style={{
                          marginRight: 5,
                          fontSize: 17,
                          position: 'relative',
                          top: '2px',
                        }}
                      />
                      菜单
                    </span>

                    <Tabs
                      defaultActiveKey={addBtnArr[0]}
                      size="small"
                      type="card"
                    >
                      {addBtnArr.map((item, index) => (
                        <TabPane
                          tab={
                            <div
                              onClick={(event) => {
                                event.nativeEvent.stopImmediatePropagation();
                                event.stopPropagation();
                                item.onClick(
                                  selectedRowKeys,
                                  tableStore,
                                  checkedRows,
                                );
                              }}
                              className="add-btn"
                            >
                              {/* <img src={item.title && getIcon(item.title)} /> */}
                              {item.title}
                              {editFlag ? (
                                <CloseCircleFilled
                                  className="del-icon"
                                  onClick={(event) => {
                                    event.nativeEvent.stopImmediatePropagation();
                                    event.stopPropagation();
                                    delBtn(item);
                                  }}
                                />
                              ) : (
                                ''
                              )}
                            </div>
                          }
                          key={index}
                        >
                          {item.title}
                        </TabPane>
                      ))}
                    </Tabs>
                  </>
                )}
              </div>
              {rowSelection || menuProp ? (
                <div className="my-table">
                  <AntdBaseTable
                    className="bordered my-table-ali"
                    style={{
                      maxHeight: 'calc(100% - 50px)',
                      height: 'calc(100% - 50px)',
                      minHeight: 'calc(100% - 50px)',
                      overflow: 'auto',
                      width: 'calc(100% - 15px)',
                    }}
                    estimatedRowHeight={22}
                    {...pipeline.getProps()}
                  />
                  <br />
                  <Pagination
                    style={{ float: 'right' }}
                    showQuickJumper
                    showSizeChanger
                    total={total}
                    showTotal={(total, range) => `共 ${total} 条数据`}
                    defaultCurrent={page}
                    current={page}
                    pageSize={size}
                    onChange={onPageSizeChange}
                    pageSizeOptions={[
                      '50',
                      '100',
                      '200',
                      '500',
                      '1000',
                      '2000',
                      '3000',
                    ]}
                  />
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={tableStore.tableList}
                  bordered
                  scroll={{ x: '100%', y: 'calc(100% - 40px)' }}
                  pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                    position: props.tableProp?.disablePagination
                      ? ['none']
                      : ['bottomRight'],
                    defaultCurrent: page,
                    defaultPageSize: size,
                    pageSize: size,
                    current: page,
                    showTotal: (total, range) => `共 ${total} 条数据`,
                    onChange: onPageSizeChange,
                    total: total,
                    pageSizeOptions: ['50', '100', '200', '500', '1000'],
                  }}
                  loading={loading}
                  className="my-table"
                  expandable={{
                    defaultExpandAllRows: true,
                  }}
                  onRow={(record) => {
                    record = { ...(props.initParams || {}), ...record };
                    return {
                      onClick: (event) => {
                        console.log('row cllick');
                        event.nativeEvent.stopImmediatePropagation();
                        event.stopPropagation();
                        props.tableRowClick &&
                          props.tableRowClick(record, tableStore);
                      }, // 点击行
                      onDoubleClick: (event) => {
                        event.nativeEvent.stopImmediatePropagation();
                        event.stopPropagation();
                      },
                    };
                  }}
                />
              )}
              {menuProp && (
                <div
                  className="menu-collapse"
                  style={{ display: showMenus ? 'block' : 'none' }}
                >
                  <div className="group">
                    {menuProp &&
                      menuProp.map((item, index) => (
                        <li className="item" key={index}>
                          <img
                            style={{ width: '28px', cursor: 'pointer' }}
                            src={item.title && getIcon(item.title)}
                            onClick={() => {
                              item.onClick(
                                selectedRowKeys,
                                tableStore,
                                checkedRows,
                              );
                              setShowMenus(false);
                            }}
                          />
                          <span>{item.title}</span>
                          <div className="shadow"></div>
                          {editFlag ? (
                            <img
                              src={iconAddBorder}
                              style={{ cursor: 'pointer' }}
                              className="add-icon"
                              onClick={(event) => {
                                event.nativeEvent.stopImmediatePropagation();
                                event.stopPropagation();
                                clickAdd(item);
                              }}
                            />
                          ) : (
                            ''
                          )}
                        </li>
                      ))}
                  </div>
                  <div className="btns">
                    <Button type="primary" onClick={() => setEditFlag(true)}>
                      编 辑
                    </Button>
                    <Button
                      style={{ margin: '0 20px' }}
                      onClick={() => setEditFlag(false)}
                    >
                      重 置
                    </Button>
                    <Button
                      onClick={() => {
                        setShowMenus(false), setEditFlag(false);
                      }}
                    >
                      取 消
                    </Button>
                  </div>
                  <span className="cover"></span>
                </div>
              )}
            </div>
          </div>

          {/* oa详情页面 */}
          {/* <Detail detailVisible={this.state.detailVisible} handleClose={() => {this.setState({detailVisible: false})}}></Detail> */}
          {searchForm && (
            <AdvancedSearch
              drawVisible={drawVisible}
              changeVisible={() => setDrawVisible(false)}
              onClick={props.tableProp?.onSearchClick}
              searchForm={searchForm}
              tableStore={tableStore}
              initParams={props.initParams}
            ></AdvancedSearch>
          )}
          <Modal
            title={props.title.name}
            centered
            visible={viewVisible}
            onOk={() => {
              setViewVisible(false);
            }}
            footer={null}
            onCancel={() => setViewVisible(false)}
            width={props.formWidth || 800}
          >
            <EpsForm
              modal="view"
              form={form}
              source={props.source}
              data={viewRecord}
              customForm={
                props.customForm && props.customForm(form, props.store)
              }
            ></EpsForm>
          </Modal>
        </Spin>
      </div>
    );
  }),
);

export default EpsPanel;
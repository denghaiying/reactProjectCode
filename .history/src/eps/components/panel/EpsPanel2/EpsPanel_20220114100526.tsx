/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { Input, Table, Tree, Tabs, message, Button, Modal, Form } from 'antd';
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
  DeleteRowOutlined,
  ConsoleSqlOutlined,
} from '@ant-design/icons';
import { EpsProps, EpsSource, TableColumn } from '@/eps/commons/declare';
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
import { VariableSizeGrid as Grid } from 'react-window';
import ResizeObserver from 'rc-resize-observer';
import classNames from 'classnames';
import { useRef } from 'react';

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

const EpsPanel = observer(
  forwardRef((props: EpsProps, ref) => {
    const [treeSelectData, setTreeSelectData] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [tableWidth, setTableWidth] = useState(0);

    const onTreeSelect = props.onTreeSelect;

    const treeCheckAble = props.treeProp?.treeCheckAble || false;

    // 左上 tab
    const tabData = props.tabProps?.tabData || [];
    const [tabCheckKey, setTabCheckKey] = useState('');

    // 左侧树选择后，设置选中值
    const onSelect = (e) => {
      runInAction(() => {
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
    const [checkedRows, setCheckedRows] = useState<any>([]);
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

    if (rowSelection) {
      rowSelection['onChange'] = (value, row) => {
        setSelectedRowKeys(value);
        setCheckedRows(row);
        // props.tableProp?.rowSelection?.onChange && props.tableProp?.rowSelection?.onChange(value, row)
      };
      rowSelection['selections'] = [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
      ];
      rowSelection['selectedRowKeys'] = selectedRowKeys;
    }

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
            setSelectedRowKeys(value);
            setCheckedRows(row);
          },
          selectedRowKeys: selectedRowKeys,
        });
      }
    }

    // visualGrid begin
    const widthColumnCount = columns!.filter(({ width }) => !width).length;
    const mergedColumns = columns!.map((column) => {
      if (column.width) {
        return column;
      }

      return {
        ...column,
        width: Math.floor(tableWidth / widthColumnCount),
      };
    });

    // const gridRef = useRef<any>();
    // const [connectObject] = useState<any>(() => {
    //   const obj = {};
    //   Object.defineProperty(obj, 'scrollLeft', {
    //     get: () => null,
    //     set: (scrollLeft: number) => {
    //       if (gridRef.current) {
    //         gridRef.current.scrollTo({ scrollLeft });
    //       }
    //     },
    //   });

    //   return obj;
    // });

    const resetVirtualGrid = () => {
      // gridRef.current.resetAfterIndices({
      //   columnIndex: 0,
      //   shouldForceUpdate: true,
      // });
    };

    useEffect(() => resetVirtualGrid, [tableWidth]);

    const renderVirtualList = (
      rawData: object[],
      { scrollbarSize, ref, onScroll }: any,
    ) => {
     // ref.current = connectObject;
      const totalHeight = rawData.length * 54;

      return (
        <Grid
          ref={gridRef}
          className="virtual-grid"
          columnCount={mergedColumns.length}
          columnWidth={(index: number) => {
            const { width } = mergedColumns[index];
            return totalHeight > scroll!.y! &&
              index === mergedColumns.length - 1
              ? (width as number) - scrollbarSize - 1
              : (width as number);
          }}
          height={scroll!.y as number}
          rowCount={rawData.length}
          rowHeight={() => 54}
          width={tableWidth}
          onScroll={({ scrollLeft }: { scrollLeft: number }) => {
            onScroll({ scrollLeft });
          }}
        >
          {({
            columnIndex,
            rowIndex,
            style,
          }: {
            columnIndex: number;
            rowIndex: number;
            style: React.CSSProperties;
          }) => (
            <div
              className={classNames('virtual-table-cell', {
                'virtual-table-cell-last':
                  columnIndex === mergedColumns.length - 1,
              })}
              style={style}
            >
              {
                (rawData[rowIndex] as any)[
                  (mergedColumns as any)[columnIndex].dataIndex
                ]
              }
            </div>
          )}
        </Grid>
      );
    };
    // visualGrid end

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
          render: (text, record, index) => {
            const rcd = { ...(props.initParams || {}), ...record };
            return (
              <>
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
                {enableEdit && (
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
                  />
                )}
                {enableDelete && (
                  <EpsDeleteButton
                    data={rcd}
                    store={tableStore}
                    key={`common-delete-${index}`}
                    treeStore={treeStore}
                    refresh={props.tableProp?.refreshTree}
                    deleteMessage={props.tableProp?.deleteMessage}
                    onClick={props.tableProp?.onDeleteClick}
                  />
                )}
              </>
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

    const { loadAsyncData } = treeStore;
    const { loading, page, size, total, key } = tableStore;

    const onPageSizeChange = (page, size) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      page !== tableStore.page && (tableStore.page = page);
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
      console.log('props.initParams', props.initParams);
      tableStore.params = { ...(props.initParams || {}), ...tableStore.params };
    }, [JSON.stringify(props.initParams)]);

    // 初始化按钮栏目按钮
    useEffect(() => {
      const newAddArr = props.menuButton || [];

      setAddBtnArr(newAddArr);
    }, [props.menuButton?.length, props.menuProp?.length]);

    useEffect(() => {
      if (props.tableProp?.refreshTree) {
        treeStore.findTree(treeStore.key);
      }
      setSelectedRowKeys([]);
      setCheckedRows([]);
    }, [tableStore.total]);

    const onTableSearch = (tableSearchValue) => {
      const code = props.tableProp?.searchCode || 'key';
      const params: Record<string, unknown> = tableStore.params;
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

    return (
      <div className="eps-manage">
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
                    onExpand={(keys, { expanded, node }) => {
                      runInAction(() => {
                        treeStore.expandedKeys = keys;
                      });
                      if (expanded) {
                        loadAsyncData(node);
                      }
                    }}
                    // loadData={loadAsyncData}
                    treeData={treeStore.getList(
                      <img src={childIcon} />,
                      <img src={parentIcon} />,
                    )}
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
                    icon={<AlertOutlined />}
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
                ></EpsAddButton>
              )}
              {checkedRows.length > 0 &&
                props.tableProp?.rowSelection?.type === 'checkbox' &&
                props.tableProp?.enableBatchDelete && (
                  <EpsBatchDeleteButton store={tableStore} data={checkedRows} />
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
              <ResizeObserver
                onResize={({ width }) => {
                  setTableWidth(width);
                }}
              >
                <Table
                  columns={columns}
                  dataSource={tableStore.tableList}
                  bordered
                  scroll={{ x: '100%', y: 'calc(100% - 40px)' }}
                  pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                    defaultCurrent: page,
                    defaultPageSize: size,
                    pageSize: size,
                    position: props.tableProp?.disablePagination
                      ? ['none']
                      : ['bottomRight'],
                    current: page,
                    showTotal: (t) => `共 ${t} 条数据`,
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
                    const record1 = { ...(props.initParams || {}), ...record };
                    return {
                      onClick: (event) => {
                        event.nativeEvent.stopImmediatePropagation();
                        event.stopPropagation();
                        props.tableRowClick &&
                          sprops.tableRowClick(record1, tableStore);
                      }, // 点击行
                      onDoubleClick: (event) => {
                        event.nativeEvent.stopImmediatePropagation();
                        event.stopPropagation();
                      },
                    };
                  }}
                  rowSelection={rowSelection}
                />
              </ResizeObserver>
            ) : (
              <ResizeObserver
                onResize={({ width }) => {
                  setTableWidth(width);
                }}
              >
                <Table
                  columns={columns}
                  dataSource={tableStore.tableList}
                  bordered
                  scroll={{ x: '100%', y: 'calc(100% - 40px)' }}
                  components={{
                    body: renderVirtualList,
                  }}
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
              </ResizeObserver>
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
                          style={{ width: '28px' }}
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
            customForm={props.customForm && props.customForm(form, props.store)}
          ></EpsForm>
        </Modal>
      </div>
    );
  }),
);

export default EpsPanel;

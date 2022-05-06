import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import { findDOMNode } from 'react-dom';
import { Table, Tree, Icon, Button, Grid, Select, Menu, Message } from '@alifd/next';
import { useDrop, useDrag, DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import classnames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import OptrightStore from '@/stores/user/OptrightStore';
import ContainerTitle from '@/components/ContainerTitle';
import SearchPanel from '@/components/SearchPanel';
import MenuStore from '@/stores/user/MenuStore';
import SysStore from '@/stores/system/SysStore';
import Diagest from '@/utils/diagest';
import EditDailog from './EditDailog';
import './index.scss';

const { SelectionRow } = Table;
const TreeNode = Tree.Node;
const umid = 'usermrg004';
const DragRow = (props) => {
  const {
    moveRow,
    className,
    ...others
  } = props;


  const [{ isDragging }, drag] = useDrag({
    item: { name, type: 'row' },
    begin: () => {
      return { ...props.record, source: 'table' };
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  const style = { ...others.style, cursor: 'move' };

  return (<SelectionRow {...others}
    style={{ ...style, ...{ opacity } }}
    wrapper={row => drag(row)}
  />);
};

const InnerTable = props => {
  const { excludeProvider, ...restProps } = props;
  const tableProps = {
    ...restProps,
    dataSource: props.dataSource,
    rowProps: (ps, index) => ({
      index,
    }),
    components: {
      Row: DragRow,
    },
  };

  return <Table {...tableProps} />;
};

const DragNode = (props) => {
  const ref = useRef(null);
  const { removeNode, addNode, data, className, ...others } = props;
  const [{ isOver }, drop] = useDrop({
    accept: 'row',
    drop: (item, monitor) => {
      const record = monitor.getItem();
      addNode(data, record);
    },
    canDrop: () => {
      return true;
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const [{ isDragging }, drag] = useDrag({
    item: { name, type: 'row' },
    begin: () => {
      return { ...data, source: 'node' };
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => {
      return !data.droot;
    },
    end: (dropResult, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        removeNode(data);
      }
    },
  });

  const opacity = isDragging ? 0 : 1;
  const style = { ...others.style, cursor: 'move' };

  const cls = classnames({
    [className]: className,
    'mt-drop-over-upward': isOver,
    'mt-drop-over-downward': isOver,
  });
  const getNodeDom = () => {
    // eslint-disable-next-line react/no-find-dom-node
    const dom = findDOMNode(ref.current);
    if (dom != null) {
      drop(dom.querySelector('div'));
      drag(dom);
    }
  };

  getNodeDom();

  return (
    <TreeNode style={{ ...style, ...{ opacity } }}
      ref={ref}
      className={cls}
      {...others}
      label={data.menuName}
      record={data}
      key={data.id}
    />);
};


const EditTree = props => {
  const { value, onChange, rootlabel, ...other } = props;
  const [dataSource, setDataSource] = useState(value);

  useEffect(() => {
    OptrightStore.getFuncRight(umid);
    setDataSource(value || []);
  }, [value]);

  const renderNode = (data) => {
    if (data && data.length > 0) {
      return data.map(v => <DragNode key={v.id} data={v} addNode={addNode} removeNode={removeNode} >{renderNode(v.children)}</DragNode>);
    }
  };

  const removeData = (d, rc) => {
    const idx = d.findIndex(n => n.id === rc.id);
    if (idx !== -1) {
      d.splice(idx, 1);
      return d;
    }
    return d.map(c => {
      if (c.children && c.children.length > 0) {
        c.children = removeData(c.children, rc);
      }
      return c;
    });
  };

  const removeNode = (r) => {
    const d = removeData([...dataSource], r);
    setDataSource(d);
    if (onChange) {
      onChange(d, { record: r, type: 'remove' });
    }
  };

  const addNode = (targetData, sourceData) => {
    let d = [...dataSource];
    const { source, ...o } = sourceData;
    let record = {};
    if (source === 'table') {
      record.id = Diagest.uuid();
      record.sysId = MenuStore.sysid;
      record.funcId = o.id;
      record.menuEname = o.funcEname;
      record.menuName = o.funcName;
    } else {
      record = { ...o };
      d = removeData(d, record);
    }
    if (targetData.droot) {
      d.push(record);
    } else if (!targetData.funcId) {
      let found = false;
      const recursionDs = (rd) => {
        if (found) { return rd; }
        const idx = rd.findIndex(r => r.id === targetData.id);
        if (idx !== -1) {
          const { children: dchildren = [], ...ot } = rd[idx];
          found = true;
          record.fid = ot.id;
          dchildren.push(record);
          ot.children = [...dchildren];
          const re = [...rd];
          re.splice(idx, 1, ot);
          return re;
        }
        return rd.map(e => {
          const { children: dchildren, ...ot } = e;
          if (dchildren && dchildren.length > 0) {
            ot.children = recursionDs(dchildren);
          }
          return ot;
        });
      };
      d = [...recursionDs(d)];
    } else {
      let found = false;
      const recursionDs2 = (rd) => {
        if (found) { return; }
        const idx = rd.findIndex(r => r.id === targetData.id);
        if (idx !== -1) {
          found = true;
          record.fid = rd[idx].fid;
          rd.splice(idx, 0, record);
        } else {
          rd.forEach(e => {
            if (e.children && e.children.length > 0) {
              recursionDs2(e.children);
            }
          });
        }
      };
      recursionDs2(d);
    }
    setDataSource(d);
    if (onChange) {
      onChange(d, source === 'table' && { record, type: 'add' });
    }
  };
  return <Tree {...other}> <DragNode data={{ menuName: rootlabel, droot: true }} addNode={addNode} >{renderNode(dataSource)}</DragNode></Tree>;
};

const Menumanage = observer(props => {
  const { intl: { formatMessage } } = props;
  const { treeData, funcData, moduleData } = MenuStore;
  const { Item } = Menu;
  const { Row, Col } = Grid;

  const columns = [{
    dataIndex: 'funcName',
    alignHeader: 'left',
    title: () => (
      <Select size="small" name="moduleid" placeholder={formatMessage({ id: 'e9.sys.menu.con.modName' })} value={MenuStore.moduleid} onChange={(value) => MenuStore.filterFunc(value)} >
        {moduleData && moduleData.map(item => <Select.Option value={item.id} key={item.id}>{item.moduleName}</Select.Option>)}
      </Select>),
    width: 200,
  }];
  useEffect(() => {
    SysStore.queryNorlmalList().then(() => {
      if (SysStore.normallist && SysStore.normallist.length > 0) {
        const sysid = SysStore.normallist[0].id;
        // 查询菜单
        MenuStore.queryData(sysid);
      }
    });
  }, []);

  // begin ******************** 以下是事件响应


  /**
    * 响应右击事件
    * @param {*} record
    */
  const onRightAction = ((info) => {
    event.preventDefault();
    const target = info.event.target;
    const { record } = info.node.props;
    if (!record) { return; }
    const { top, left } = target.getBoundingClientRect();

    Menu.create({
      target: info.event.target,
      offset: [info.event.clientX - left, info.event.clientY - top],
      children: [
        !record.funcId && <Item key="1" onClick={() => onAddAction(record)}>{formatMessage({ id: 'e9.sys.menu.addChildrenMenu' })}</Item>,
        record.funcId && <Item key="2" onClick={() => onEditAction(record)}>{formatMessage({ id: 'e9.sys.menu.editMenu' })}</Item>,
        !record.droot && <Item key="3" onClick={() => onRemoveAction(record)}>{formatMessage({ id: 'e9.sys.menu.deleteMenu' })}</Item>,
      ],
    });
  });

  /**
  * 右键新增菜单
  */
  const onAddAction = ((parentNode) => {
    const json = { sysId: MenuStore.sysid, id: Diagest.uuid(), fid: parentNode.id };
    MenuStore.showEditForm('add', json);
  });

  /**
  * 右键删除菜单 onRollBackAction
  */
  const onRemoveAction = (record) => {
    MenuStore.setTreeDataRemoveOnRight(record);
  };


  /**
  * 右键编辑菜单
  */
  const onEditAction = (record) => {
    edit(record);
  };

  const edit = (record) => {
    MenuStore.showEditForm('edit', record);
  };

  /**
  * 保存菜单树结构数据
  */
  const onSaveAction = (() => {
    MenuStore.save().then(() => {
      Message.notice(formatMessage({ id: 'e9.info.data.savesuccess' }));
    });
  });

  const onCancelAction = () => {
    MenuStore.cancelData();
  };

  const onTreeDataChange = (data, chgs) => {
    MenuStore.resetTreeData(data);
    MenuStore.setEdit();
    if (chgs) {
      const { record, type } = chgs;
      MenuStore.resetFuncData(type, record);
    }
  };

  return (
    <div className="workpage" >
      <ContainerTitle
        title={formatMessage({ id: 'e9.sys.menu.title' })}
        mainroute="/sysuser"
        umid="usermrg005"
        extra={
          <span>
            {/* <Button.Group>
              {OptrightStore.hasRight(umid, 'a202') && <Button type="primary" ><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" /></Button>}
              {OptrightStore.hasRight(umid, 'a201') && <Button type="primary" ><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" /></Button>}
            </Button.Group> */}
            <Button type="primary" style={{ marginLeft: '10px' }} onClick={onCancelAction} ><Icon type="error" /><FormattedMessage id="e9.btn.cancel" /></Button>
            <Button type="primary" style={{ marginLeft: '10px' }} onClick={onSaveAction} ><Icon type="success" /><FormattedMessage id="e9.btn.save" /></Button>
          </span>
        }
      />
      {/* 系统下拉框 */}
      <div className="workcontain">
        <div className="right rightmax">
          <div className="toolbar">
            <Select name="sysid"
              placeholder={formatMessage({ id: 'e9.sys.optright.con.sysid' })}
              value={MenuStore.sysid}
              onChange={(value) => {
                if (MenuStore.inEdit) {
                  Message.notice(formatMessage({ id: 'e9.sys.menu.nosaveinfo' }));
                  return;
                }
                MenuStore.queryData(value);
              }}
            >
              {SysStore.normallist.map(item => <Select.Option value={item.id} key={item.id}>{item.systemName}</Select.Option>)}
            </Select>
          </div>
          <div className="workspace">
            <DndProvider backend={Backend}>
              <Row style={{ height: '100%' }}>
                <Col span={10} style={{ height: '100%' }}>
                  <EditTree
                    autoExpandParent
                    showLine
                    isLabelBlock
                    value={treeData}
                    onRightClick={onRightAction}
                    rootlabel="菜单"
                    onChange={onTreeDataChange}
                  />
                </Col>
                {/* 功能表格 */}
                <Col offset={1} span={10} >
                  <InnerTable
                    dataSource={funcData}
                  >
                    {columns.map(col =>
                      <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
                    )}
                  </InnerTable>
                </Col>
              </Row>
            </DndProvider>
          </div>
          <EditDailog />
        </div>
      </div>
    </div >
  );
});
export default injectIntl(Menumanage);

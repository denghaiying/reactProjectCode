/* eslint-disable react/require-default-props */
import React, { Component, useEffect, useState } from 'react';
import { Table, Input, Select, Checkbox } from '@alifd/next';
import PropTypes from 'prop-types';

const EditTableCell = (props) => {
  const { edittype = 'input', readOnly, dataIndex, value, index, record, onChange, dropdowndata, ...oprops } = props;
  const [editor, setEditor] = useState(false);
  const [evalue, setEvalue] = useState(value);

  useEffect(() => {
    setEvalue(value);
  }, [value]);

  const onKeyDown = (e) => {
    const { keyCode } = e;
    // Stop bubble up the events of keyUp, keyDown, keyLeft, and keyRight
    if (keyCode > 36 && keyCode < 41) {
      e.stopPropagation();
    }
  };

  const onBlur = () => {
    setEditor(false);
    const newrecord = {};
    Object.entries(record).forEach(([k, v]) => {
      newrecord[k] = v;
    });
    newrecord[dataIndex] = evalue;
    if (onChange) {
      onChange(evalue, index, newrecord);
    }
  };

  const onClick = () => {
    setEditor(true);
  };

  const getComponent = () => {
    let cmp;
    switch (edittype) {
      case 'select':
        cmp = (
          <Select style={{ width: '100%' }} >
            {dropdowndata && dropdowndata.map(item => <Select.Option key={item.value} value={item.value}>{item.item}</Select.Option>)}
          </Select >);
        break;
      case 'checkbox':
        cmp = <Checkbox />;
        break;
      case 'mutiinput':
        cmp = <Input.TextArea style={{ width: '100%' }} />;
        break;
      default:
        cmp = <Input style={{ width: '100%' }} />;
    }
    return React.cloneElement(cmp, { ...oprops });
  };

  const getDropItem = (v) => {
    if (dropdowndata && dropdowndata instanceof Array) {
      for (let i = 0; i < dropdowndata.length; i++) {
        const item = dropdowndata[i];
        // eslint-disable-next-line eqeqeq
        if (item.value == v) {
          return item.item;
        }
      }
    }
    return null;
  };

  const getLabel = (v) => {
    let l;
    switch (edittype) {
      case 'select':
        l = getDropItem(v);
        break;
      case 'checkbox':
        l = v;
        break;
      default:
        l = v;
    }
    return l || v;
  };

  return (editor && !readOnly ?
    React.cloneElement(getComponent(), { value: evalue, autoFocus: true, onKeyDown: (e) => onKeyDown(e), onBlur: (e) => onBlur(e), onChange: (v) => setEvalue(v) }) :
    <div onClick={onClick} className="next-table-cell-wrapper" > {getLabel(evalue)}</div >);
};

const newChildren = (cld) => {
  if (cld instanceof Array) {
    const d = [];
    cld.forEach(item => {
      d.push(newChildren(item));
    });
    return d;
  }
  if (cld instanceof Component) {
    const { children, ...prps } = cld.props;

    return <Component {...prps}>{children && newChildren(children)}</Component>;
  }
  return cld;
};

const EditTable = (props) => {
  const { value, columns, isTree, readonly, onChange, children, ...oprops } = props;
  const [data, setData] = useState(value);

  useEffect(() => {
    setData(props.value);
  }, [props.value]);
  /**
   *
   * @param {*} dataIndex
   * @param {*} v 值
   * @param {*} index 行号
   * @param {*} record 行记录
   * @param {*} readOnly 是否只读
   * @param {*} edittype 类型，可以是select、input，由开发者设置
   * @param {*} dropdowndata 当select时可用，用来渲染下拉框
   * @param {*} editprops 编辑组件的其他属性
   * @param {*} onValueChange 值发生变化时，去修改Table的dataSource
   */
  const renderCell = (dataIndex, v, index, record, readOnly, edittype, dropdowndata, editprops, onValueChange) => {
    return (<EditTableCell
      dataIndex={dataIndex}
      index={index}
      record={record}
      value={v}
      edittype={edittype}
      readOnly={readOnly}
      dropdowndata={dropdowndata}
      onChange={onValueChange}
      {...editprops}
    />);
  };

  const resetData = (index, newRecord) => {
    const newData = !isTree ? getTableData(index, newRecord) : getNewTreeData(index, newRecord);
    setData(newData);
    if (onChange) {
      onChange(newData, index, newRecord);
    }
  };

  const getTableData = (index, newRecord) => {
    const odata = [].concat(data || []);
    let newData = odata.slice(0, index).concat(newRecord);
    const oldlen = odata.length;
    if (oldlen - 2 >= index) {
      newData = newData.concat(odata.slice(index + 1));
    }
    return newData;
  };

  const getNewTreeData = (index, newRecord) => {
    let idx = -1;
    const odata = [].concat(data || []);

    const getChidrenData = (cld) => {
      if (!cld || cld.length === 0) {
        return cld;
      }
      const re = [];
      cld.forEach(item => {
        const { children: icld, ...o } = item;
        idx += 1;
        if (idx === index) {
          re.push({ ...newRecord, children: getChidrenData(icld) });
        } else {
          re.push({ ...o, children: getChidrenData(icld) });
        }
      });
      return re;
    };
    const newData = [];
    odata.forEach(item => {
      const { children: cld, ...o } = item;
      idx += 1;
      if (idx === index) {
        newData.push({ ...newRecord, children: getChidrenData(cld) });
      } else {
        newData.push({ ...o, children: getChidrenData(cld) });
      }
    });
    return newData;
  };

  const editColumn = (col) => {
    const { edittype, dataIndex, dropdowndata, onCellChange, readonly: rd, editprops, cell, ...colprops } = col;
    const onCellValueChange = (newValue, index, newRecord) => {
      if (onCellChange) {
        onCellChange(newValue, index, newRecord).then(
          () => {
            resetData(index, newRecord);
          }
        );
      } else {
        resetData(index, newRecord);
      }
    };
    return (<Table.Column
      dataIndex={dataIndex}
      alignHeader="center"
      {...colprops}
      cell={(v, index, record) => (cell ? cell(v, index, record) :
        renderCell(dataIndex, v, index, record, rd, edittype, dropdowndata, editprops, onCellValueChange))}
    />);
  };

  const getColumn = () => {
    return columns.map(col => editColumn({ ...col, key: col.dataIndex || 'ceil', readonly: readonly || col.readonly }));
  };
  return <Table isTree={isTree} {...oprops} dataSource={data}>{children}{getColumn()}</Table>;
};

EditTable.propTypes = {
  value: PropTypes.array.isRequired,
  readonly: PropTypes.bool,
  onChange: PropTypes.func,
  columns: PropTypes.array.isRequired,
};

EditTable.defaultProps = {
  readonly: false,
};

EditTableCell.propTypes = {
  dataIndex: PropTypes.string.isRequired,
  index: PropTypes.number,
  dropdowndata: PropTypes.array,
  readOnly: PropTypes.bool,
  edittype: PropTypes.oneOf(['input', 'select', 'checkbox', 'mutiinput']),
};

EditTableCell.defaultProps = {
  readOnly: false,
  edittype: 'input',
};

export { EditTable, EditTableCell };

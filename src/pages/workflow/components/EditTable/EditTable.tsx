/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/require-default-props */
import React, { Component, useEffect, useState } from 'react';
import { Table, Input, Select, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import './index.less';

const EditTableCell = (props: any) => {
  const { edittype = 'input', readOnly, dataIndex, value, index, record, onChange, dropdowndata, ...oprops } = props;
  const [editor, setEditor] = useState(false);
  const [evalue, setEvalue] = useState(value);

  useEffect(() => {
    setEvalue(value);
  }, [value]);

  const onKeyDown = (e: any) => {
    const { keyCode } = e;
    // Stop bubble up the events of keyUp, keyDown, keyLeft, and keyRight
    if (keyCode > 36 && keyCode < 41) {
      e.stopPropagation();
    }
  };

  const onBlur = (e: any) => {
    // e.stopPropagation();
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
          <Select style={{ width: '100%', margin: 0 }} value={evalue} onChange={(e: any) => {
            setEvalue(e);
          }}>
            {dropdowndata && dropdowndata.map((item: { value: any; item: any }) => <Select.Option key={item.value} value={item.value}>{item.item}</Select.Option>)}
          </Select >);
        break;
      case 'checkbox':
        cmp = <Checkbox checked={evalue} onChange={(e: any) => {
          setEvalue(e.target.checked);
        }} />;
        break;
      case 'mutiinput':
        cmp = <Input.TextArea style={{ width: '100%', margin: 0 }} value={evalue} onChange={(e: any) => {
          setEvalue(e.target.value);
        }} />;
        break;
      default:
        cmp = <Input style={{ width: '100%', margin: 0 }} value={evalue} onChange={(e: any) => {
          setEvalue(e.target.value);
        }} />;
    }
    return React.cloneElement(cmp, { ...oprops });
  };

  const getDropItem = (v: any) => {
    if (dropdowndata && dropdowndata instanceof Array) {
      for (let i = 0; i < dropdowndata.length; i++) {
        const item = dropdowndata[i];
        // eslint-disable-next-line eqeqeq
        if (item.value === v) {
          return item.item;
        }
      }
    }
    return null;
  };

  const getLabel = (v: any) => {
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
    React.cloneElement(getComponent(),
      {
        key: `editor-${dataIndex}`,

        autoFocus: true,
        onKeyDown: (e: any) => onKeyDown(e),
        onBlur: (e: any) => onBlur(e),
      }) :// setEvalue(v);
    <div key={`div-${dataIndex}`} onClick={onClick} className={`editable-cell-value-wrap ${!readOnly && 'editable-cell-value-wrap-editor'} `} style={{ paddingRight: 24 }} title={getLabel(evalue)}> {getLabel(evalue)}</div>);
};

const newChildren = (cld: any): any => {
  if (cld instanceof Array) {
    const d: any[] = [];
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

const EditTable = (props: any) => {
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
  const renderCell = (dataIndex: string, v: any, index: number, record: any, readOnly: boolean | undefined, edittype: string | undefined, dropdowndata: any, editprops: any, onValueChange: Function) => {
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

  const getTableData = (index: number, newRecord: any) => {
    const odata = [].concat(data || []);
    let newData = odata.slice(0, index).concat(newRecord);
    const oldlen = odata.length;
    if (oldlen - 2 >= index) {
      newData = newData.concat(odata.slice(index + 1));
    }
    return newData;
  };

  const getNewTreeData = (index: number, newRecord: any) => {
    let idx = -1;
    const odata = [].concat(data || []);

    const getChidrenData = (cld: any) => {
      if (!cld || cld.length === 0) {
        return cld;
      }
      const re: any = [];
      cld.forEach((item: any) => {
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
    const newData: any = [];
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

  const resetData = ((index: number, newRecord: any) => {
    const newData = !isTree ? getTableData(index, newRecord) : getNewTreeData(index, newRecord);
    setData(newData);
    if (onChange) {
      onChange(newData, index, newRecord);
    }
  });

  const editColumn = (col: any) => {
    const { edittype, dataIndex, dropdowndata, onCellChange, readonly: rd, editprops, render, ...colprops } = col;
    const onCellValueChange = (newValue: any, index: number, newRecord: any) => {
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
      {...colprops}
      render={(v, record, index) => (render && render(v, record, index) ||
        renderCell(dataIndex, v, index, record, rd, edittype, dropdowndata, editprops, onCellValueChange))}
    />);
  };

  const getColumn = () => {
    return columns.map((col: any) => editColumn({ ...col, key: col.dataIndex || 'ceil', readonly: readonly || col.readonly }));
  };
  return <Table rowClassName={() => 'editable-row'} {...oprops} dataSource={data}>{children}{getColumn()}</Table>;
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

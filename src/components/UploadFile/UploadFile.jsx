/* eslint-disable no-shadow */
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import React, { useState, useEffect } from 'react';
import { Table, Upload, Button, Icon } from '@alifd/next';
import { EditTableCell } from '../EditTable';
import fetch from '../../utils/fetch';
import util from '../../utils/util';
import { uuid } from './UFileUnit';

import './UploadFile.scss';

const UploadFile = (props) => {
  const { columns, accept, value, sysid, tableprops, readOnly, showtype, onChange, limit = Infinity } = props;
  const { intl: { formatMessage } } = props;
  const [grpid, setGrpid] = useState(value);
  const [datasource, setDatasource] = useState();
  const baseurl = '/docapi/doc/';
  const defaultColumns = [{
    title: formatMessage({ id: 'e9.doc.upload.col.filename' }),
    dataIndex: 'filename',
    readonly: true,
    width: '200px',
  }, {
    title: formatMessage({ id: 'e9.doc.upload.col.size' }),
    dataIndex: 'size',
    readonly: true,
    width: '200px',
  }, {
    title: formatMessage({ id: 'e9.doc.upload.col.uploader' }),
    dataIndex: 'uploader',
    readonly: true,
    width: '200px',
  }, {
    title: formatMessage({ id: 'e9.doc.upload.col.uploadTime' }),
    dataIndex: 'uploadTime',
    readonly: true,
    width: '200px',
  }];

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
    const newData = getTableData(index, newRecord);
    setDatasource(newData);
  };

  const getTableData = (index, newRecord) => {
    const odata = [].concat(datasource || []);
    let newData = odata.slice(0, index).concat(newRecord);
    const oldlen = odata.length;
    if (oldlen - 2 <= index) {
      newData = newData.concat(odata.slice(index + 1, oldlen - 1));
    }
    return newData;
  };

  const editColumn = (col) => {
    const { edittype, dataIndex, dropdowndata, onCellChange, readonly: rd, editprops, cell, ...colprops } = col;
    const onCellValueChange = (newValue, index, newRecord) => {
      resetData(index, newRecord);
    };
    return (<Table.Column
      key={`col-${dataIndex}`}
      dataIndex={dataIndex}
      alignHeader="center"
      {...colprops}
      cell={(v, index, record) => (cell ? cell(v, index, record) :
        renderCell(dataIndex, v, index, record, rd, edittype, dropdowndata, editprops, onCellValueChange))}
    />);
  };

  const getColumn = () => {
    const cols = columns || [];
    cols.concat(defaultColumns);
    return cols.map(col => editColumn({ ...col, readonly: readOnly || col.readonly }));
  };

  useEffect(() => {
    setGrpid(value);
    getData(value);
  }, [value]);

  const customRequest = (option) => {
    const param = new FormData();
    if (option.data) {
      Object.keys(option.data).forEach(k => {
        param.append(k, option.data[k]);
      });
    }
    param.append('groupid', grpid || '');
    param.append(option.filename, option.file);
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    if (option && option.onProgress) {
      config.onUploadProgress = ((e) => {
        if (e.lengthComputable) {
          if (e.total > 0) {
            e.percent = (e.loaded / e.total) * 100;
          }
        } else {
          e.percent = 100;
        }
        option.onProgress(e);
      });
    }
    fetch.put(`${baseurl}${sysid}`, param, config).then(res => {
      if (res.status === 201) {
        const d = res.data;

        if (d.groupid !== grpid) {
          setGrpid(d.groupid);
          if (onChange) {
            onChange(d.groupid);
          }
        }
        option.onSuccess(d);
      }
    });
    return { abort () { } };
  };

  const onSelect = (e, index, record) => {
    const r = record || {};
    const fs = e.target;
    if (fs.files && fs.files.length === 1) {
      const f = fs.files[0];

      const option = {
        file: f,
        filename: 'file',
        size: f.size,
        data: r,
        onSuccess: (d) => {
          resetData(index, d);
        },
      };
      customRequest(option);
    }
  };

  const onDeleteFile = (f) => {
    onDeleteAction(f.fileid);
  };

  const onDeleteAction = (fileid, index, record) => {
    if (record && !record.filename) {
      const d = [].concat(datasource || []);
      const nd = d.splice(0, index);
      if (index + 1 < datasource.length) {
        nd.concat(d.splice(index + 1));
      }
      setDatasource(nd);
    }
    fetch.delete(`${baseurl}${fileid}`).then(re => {
      if (re.status === 204) {
        const ds = [].concat(datasource || []);
        setDatasource(ds.filter(d => d.fileid !== fileid));
      }
    });
  };

  const onDownload = (fileid) => {
    fetch.get(`${baseurl}${sysid}/${fileid}`, { responseType: 'blob' }).then(
      response => {
        if (response.status === 200) {
          const type = response.headers['context-type'] && 'application/octet-stream';
          let filename = response.headers['content-disposition'];
          const pos = filename.indexOf('filename=');
          if (pos > 0) {
            filename = filename.substring(pos + 9);
            if (filename.indexOf('"') > -1) {
              filename = filename.substring(1, filename.length - 1);
            }
          }
          const blob = new Blob([response.data], { type });
          const url = window.URL.createObjectURL(blob);
          const aLink = document.createElement('a');
          aLink.style.display = 'none';
          aLink.href = url;
          aLink.setAttribute('download', decodeURIComponent(filename));
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        } else {
          throw (util.bussinessException(response.status, response.data));
        }
      }
    );
  };

  const renderEditCell = (v, index, record) => {
    return (
      <div>
        {!readOnly && record.filename &&
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <label style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.fileid, index, record)} >{formatMessage({ id: 'e9.btn.delete' })}</label>}
        {!readOnly && !record.filename &&
          <label>{formatMessage({ id: 'e9.btn.upload' })}
            <input
              type="file"
              accept={accept || ''}
              //  name={name}
              onChange={(e) => onSelect(e, index, record)}
              style={{ display: 'none' }}
            />
          </label>}
        <label>{formatMessage({ id: 'e9.btn.download' })}<a href="javascript:void(0)" style={{ marginLeft: '5px' }} onClick={() => onDownload(record.fileid)} /></label>

      </div>);
  };

  const getData = (gid) => {
    if (gid) {
      fetch.get(`${baseurl}files/${gid}`).then(res => {
        if (res && res.status === 200) {
          setDatasource(res.data);
        }
      });
    }
  };

  const getFileList = () => {
    if (datasource && datasource.length > 0) {
      return datasource.map(ds => ({ fileid: ds.fileid, fname: ds.filename, fsize: ds.size, state: 'done', url: 'javascript:#;', rtl: false }));
    }
    return [];
  };

  const onNewRecord = () => {
    const d = [].concat(datasource || []);
    if (d.length > 0) {
      if (!d[d.length - 1].filename) {
        return;// 如果最后一条还未上传记录，那么不允许新增
      }
    }
    d.push({ fileid: uuid() });
    setDatasource(d);
  };

  const onSuccess = (f) => {
    const d = [].concat(datasource || []);
    if (f && f.response) {
      d.push(f.response);
      setDatasource(d);
    }
  };

  const renderDownloadTag = (f) => {
    return (
      <a style={{ marginLeft: 8 }} href="javascript:#;" onClick={() => onDownload(f.fileid)} className="next-upload-list-item-name">
        <span>{f.fname}</span>
        <span className="next-upload-list-item-size">({f.fsize})</span>
      </a>);
  };

  switch (showtype) {
    case 'text':
      return (
        <Upload
          // beforeUpload={beforeUpload}
          // onChange={onChange}
          onSuccess={onSuccess}
          className="e9Upload"
          listType="text"
          // defaultValue={defaultValue}>
          value={getFileList()}
          limit={limit}
          accept={accept || ''}
          request={customRequest}
          onChange={() => { }}
          onRemove={onDeleteFile}
          disabled={readOnly}
          closable={!readOnly}
          extraRender={renderDownloadTag}
        >
          <Button size="small" type="secondary" style={{ margin: '0 0 5px 0px' }}><Icon type="upload" />{formatMessage({ id: 'e9.btn.upload' })}</Button>
          {/* <div className="next-upload-list next-upload-list-text" style={{ width: '100%' }}>
            <div className="next-upload-list-item next-upload-list-item-done">
              <div className="next-upload-list-item-name-wrap">
                <a href="https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg" target="_blank" className="next-upload-list-item-name">
                  <span>1111111111111111111111111111总共昂pic.png</span>
                  <span className="next-upload-list-item-size">(1000.00B)</span>
                  <span className="next-upload-extra"></span>
                </a>
              </div>
              <i role="button" aria-label="删除" tabindex="0" className="next-icon next-icon-close next-large"></i>
            </div>
          </div> */}
        </Upload >
      );
    default:
      return (
        <div>

          {!readOnly && (!datasource || datasource.length < limit) && <div style={{ textAlign: 'right' }}><Button text iconSize="small"><Icon className="iconfont iconadd" onClick={onNewRecord} /></Button></div>
          }
          <Table dataSource={datasource} {...tableprops} fixedHeader primaryKey="fileid">
            {getColumn()}
            <Table.Column width="200px" cell={(v, index, record) => renderEditCell(v, index, record)} lock="right" />
          </Table>
        </div>
      );
  }
};


UploadFile.prototype = {
  value: PropTypes.string.isRequired,
  sysid: PropTypes.string.isRequired,
  showtype: PropTypes.oneOf(['text', 'table']),
  accept: PropTypes.string,
  filelist: PropTypes.array,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableprops: PropTypes.object,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  limit: PropTypes.number,
};

UploadFile.defaultProps = {
  showtype: 'text',
};

export default injectIntl(UploadFile);

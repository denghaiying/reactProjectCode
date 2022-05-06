import React, { useEffect, useState } from 'react';
import { Table, Dialog, Button, Input, Icon, Tab, Checkbox } from '@alifd/next';
import { injectIntl } from 'react-intl';
import EmptyData from '@/components/EmptyData';
import fetch from '@/utils/fetch';
import SvgIcon from '@/components/SvgIcon';
import "./index.less";
import { useIntl, FormattedMessage } from 'umi';

const FileDialog = props => {
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  const {  visible, params, callback, onChange } = props;
  const [dlgVisible, setDlgVisible] = useState(visible);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const baseUrl = "/eps/wdgl/attachdoc";

  let filename="";
  useEffect(() => {
    setDlgVisible(visible);

  }, [visible]);

  useEffect(() => {

    const { ...o } = params || {};
    o.sfzxbb = 1;
    if (visible) {
      queryData(o);
    }
  }, [params]);

  const queryData = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    setLoading(true);
    const res = await fetch
      .post(`${baseUrl}/queryForList`, fd, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } });
    if (res && res.status === 200) {
      setData(res.data);
    }
    setLoading(false);
  };

  const getFile = (record, callback) => {
    const fd = new FormData();
    fd.append("fileid", record.fileid);
    fd.append("daktmid", params.daktmid);
    fd.append("grpid", params.grpid);
    fd.append("doctbl", params.doctbl);
    fd.append("printfile", 0);
    fd.append("downfile", 0);
    fd.append("grptbl", params.grptbl);
    // fd.append("atdw", params.dw);
    fd.append("downlx", "01");
    fetch.post(`${baseUrl}/download`, fd, { responseType: 'blob' }).then(
      response => {
        if (response.status === 200) {
          const type = response.headers['context-type'] && 'application/octet-stream';
           filename = response.headers['content-disposition'];
          // if (filename) {
          //  获取出来的文件名乱码？？？
          //   const pos = filename.indexOf('filename=');
          //   if (pos > 0) {
          //     filename = filename.substring(pos + 9);
          //     if (filename.indexOf('"') > -1) {
          //       filename = filename.substring(1, filename.length - 1);
          //     }
          //   }
          // }
          // else {
          filename = `${record.filename}.${record.ext}`;
          // }
          const blob = new Blob([response.data], { type });
          callback(blob);
        } else {
          throw (util.bussinessException(response.status, response.data));
        }
      }
    );
  }
  const download = (record) => {
    getFile(record, (blob) => {
      const url = window.URL.createObjectURL(blob);
      const aLink = document.createElement('a');
      aLink.style.display = 'none';
      aLink.href = url;
      aLink.setAttribute('download', decodeURIComponent(filename));
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
      window.URL.revokeObjectURL(url);
    });
  };

  const viewFile = (record) => {

    getFile(record, (blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(`/api/eps/control/main/app/lib/pdf/web/viewer.html?file=${url}`);
    });
  };

  const columns = [{
    dataIndex: "title",
    title: "标题",
    width: 240
  }, {
    dataIndex: "filename",
    title: "文件名",
    width: 200
  }, {
    dataIndex: "ext",
    title: "文件类型",
    width: 100
  }, {
    dataIndex: "size",
    title: "文件大小",
    width: 100
  }, {
    dataIndex: "lx",
    title: "文件分类",
    width: 100
  }, {
    dataIndex: "yxrq",
    title: "有效日期",
    width: 100
  }, {
    dataIndex: "tybz",
    title: "停用",
    width: 200,
    cell: (value) => <Checkbox checked={value.tybz == "Y"} />
  }, {
    dataIndex: "bz",
    title: "备注",
    width: 240
  }, {
    dataIndex: "bbh",
    title: "版本号",
    width: 100
  }]
  return (
    <Dialog
      visible={dlgVisible}
      footer={false}
      className="filelist-dialog"
      closeMode={[]}
    >
      <div className="head">
        <span className="title">附件</span>
        <Icon type="close" size='small' style={{ color: '#8c8b8b', cursor: 'pointer' }} onClick={() => { callback(false); setDlgVisible(false); }} />
      </div>
      <div className="body">
        <Table
          // tableLayout="fixed"
          // $work-context-heigth-41px, 41px为表头高度
          maxBodyHeight="500px"
          // className="common-table"
          dataSource={data || []}
          fixedHeader
          loading={loading}
          // rowSelection={{ onChange: onTableRowChange, selectedRowKeys: YjspStore.selectRowKeys, mode: "single" }}
          emptyContent={<EmptyData />}
        >
          <Table.Column
            alignHeader="center"
            width="100px"
            cell={(value, index, record) =>
              <div>
                <SvgIcon type="icondownload" onClick={() => download(record)} />
                <SvgIcon style={{ marginLeft: 10 }} type="iconeye" onClick={() => viewFile(record)} />
              </div>
            }
          />
          {columns.map(col =>
            <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
          )}
        </Table>
      </div>
    </Dialog>
  );
}

export default FileDialog;

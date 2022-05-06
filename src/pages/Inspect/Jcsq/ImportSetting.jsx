import React from 'react';
import { Button, Grid, Upload, Icon, Table, Message } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import JcsqStore from '../../../stores/inspect/JcsqStore';
import EditForm from '../../../components/EditForm';
import YuanWen from './YuanWen';
import ZhuLX from './ZhuLX';

const { Row, Col } = Grid;

const ImportSetting = observer(props => {
  const { intl: { formatMessage } } = props;
  const { step, twoStepData, fieldsData } = JcsqStore;
  const columns = [
    {
      title: formatMessage({ id: 'Jcsq.jcsqmxType' }),
      dataIndex: 'jcsqmxType',
      width: 200,
      cell: (value) => {
        switch (value) {
          case '101':
            return <span>条目著录项</span>;
          case '201':
            return <span>原文类型</span>;
          case '202':
            return <span>原文DPI</span>;
          case '203':
            return <span>原文内容</span>;
          case '204':
            return <span>原文EXIF</span>;
          case '301':
            return <span>条目原文匹配</span>;
          case '302':
            return <span>原文条目匹配</span>;
          case '303':
            return <span>条目原文内容匹配</span>;
          default:
            return null;
        }
      },
    },
    {
      title: formatMessage({ id: 'Jcsq.jcsqmxZlx' }),
      dataIndex: 'jcsqmxZlx',
      width: 200,
    },
    {
      title: formatMessage({ id: 'Jcsq.cfgcode' }),
      dataIndex: 'cfgcode',
      width: 200,
    },
    {
      title: formatMessage({ id: 'Jcsq.cfgname' }),
      dataIndex: 'cfgname',
      width: 200,
    },
    {
      title: formatMessage({ id: 'Jcsq.jcsqmxExpr' }),
      dataIndex: 'jcsqmxExpr',
      width: 200,
    },
    {
      title: formatMessage({ id: 'Jcsq.jcsqmxSm' }),
      dataIndex: 'jcsqmxSm',
      width: 300,
    },
  ];

  const column = [
    {
      title: formatMessage({ id: 'Jcsq.jcsqfieldsName' }),
      dataIndex: 'name1',
    },
    {
      dataIndex: 'name2',
    },
    {
      dataIndex: 'name3',
    },
    {
      dataIndex: 'name4',
    },
    {
      dataIndex: 'name5',
    },
  ];

  /**
   * 下一步
   * @type {nextStep}
   */
  const nextStep = ((value) => {
    if (step === 1) {
      if (fieldsData.length < 1) {
        Message.warning('请导入条目文件');
        return false;
      }
    }
    JcsqStore.setStep(value);
  });
  /**
   * 上一步
   * @type {lastStep}
   */
  const lastStep = ((value) => {
    JcsqStore.setStep(value);
  });
  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    JcsqStore.setSelectRows(selectedRowKeys, records);
  };
  const removeData = ((id) => {
    JcsqStore.removeTableData(id);
  });
  /**
   * 表格操作列
   * @param value
   * @param index
   * @param record
   * @returns {*}
   */
  const renderTableCell = (value, index, record) => {
    return (
      <div>
        <a href="javascript:;" style={{ marginLeft: 5 }} onClick={() => removeData(record.jcsqmxId)}><FormattedMessage id="e9.btn.delete" /></a>
      </div>
    );
  };
  /**
   * 上传条目模板成功回调函数
   * @type {onSuccess}
   */
  const onSuccess = (() => {
    Message.success('文件上传成功');
  });
  /**
   * 上传条目模板失败回调函数
   * @type {onError}
   */
  const onError = (() => {
    Message.error('文件上传失败,请重试');
  });
  /**
   * 打开原文设置弹窗
   * @type {openYuanwen}
   */
  const openYuanwen = (() => {
    JcsqStore.openYuanwen({ types: "'201','202','203','204','301','302','303'" });
  });
  /**
   * 打开著录项设置弹窗
   * @type {openZhulu}
   */
  const openZhulu = (() => {
    JcsqStore.openZhulu({ types: "'101','303'" });
  });
  /**
   * 上传条目文件
   * @type {function(*): {abort()}}
   */
  const UploadRequestion = ((option) => {
    JcsqStore.UploadFile(option.file).then(() => {
      if (JcsqStore.resultrecord) {
        option.onSuccess = onSuccess();
      } else {
        option.onError = onError();
      }
    });
    return { abort () { } };
  });
  /**
   * 完成操作,关闭弹窗
   * @type {completeStep}
   */
  const completeStep = (() => {
    if (twoStepData.length < 1) {
      Message.warning('请设置检测规则');
      return false;
    }
    JcsqStore.closeImportForm();
  });

  return (
    <EditForm
      title={formatMessage({ id: 'Jcsq.title' })}
      visible={JcsqStore.importVisible}
      shouldUpdatePosition
      footer={(() => {
        switch (step) {
          case 1:
            return (
              <Button type="primary" onClick={() => { nextStep(2); }}>{formatMessage({ id: 'Jcsq.nextStep' })}</Button>
            );

          case 2:
            return (
              <div>
                <Button type="secondary" onClick={() => { lastStep(1); }}>{formatMessage({ id: 'Jcsq.lastStep' })}</Button>
                <Button type="primary" style={{ marginLeft: 20 }} onClick={completeStep}>{formatMessage({ id: 'Jcsq.complete' })}</Button>
              </div>
            );
          default:
            return false;
        }
      })()}
      onClose={() => JcsqStore.closeImportForm()}
      opt={JcsqStore.opt}
      style={{ width: '75%' }}
    >
      {(
        () => {
          switch (step) {
            case 1:
              return (
                <Row wrap>
                  <Col span={24}>
                    <Upload
                      onSuccess={onSuccess}
                      onError={onError}
                      request={UploadRequestion}
                      accept=".xlsx,.xls"
                    >
                      <Button type="secondary"><Icon type="download" />{formatMessage({ id: 'Jcsq.importFile' })}</Button>
                    </Upload>
                  </Col>
                  <Col style={{ marginTop: 20 }} span={24}>
                    <Table
                      maxBodyHeight={400}
                      fixedHeader
                      dataSource={fieldsData}
                    >
                      {column.map(col =>
                        <Table.Column align="center" key={col.dataIndex} {...col} />
                      )}
                    </Table>
                  </Col>
                </Row>
              );
            case 2:
              return (
                <div>
                  <Row wrap>
                    <Col span={24}>
                      <Button.Group>
                        <Button type="secondary" onClick={openZhulu}><Icon type="download" />{formatMessage({ id: 'Jcsq.importZhuLu' })}</Button>
                        <Button type="secondary" onClick={openYuanwen}><Icon type="download" />{formatMessage({ id: 'Jcsq.importYunWen' })}</Button>
                      </Button.Group>
                    </Col>
                    <Col style={{ marginTop: 20 }} span={24}>
                      <Table
                        maxBodyHeight={400}
                        fixedHeader
                        dataSource={twoStepData}
                        rowSelection={{ onChange: onTableRowChange }}
                      >
                        {columns.map(col =>
                          <Table.Column align="center" key={col.dataIndex} {...col} />
                        )}
                        <Table.Column cell={renderTableCell} align="center" width="150px" lock="right" />
                      </Table>
                      <YuanWen />
                      <ZhuLX />
                    </Col>
                  </Row>
                </div>
              );
            default:
              return null;
          }
        })()
      }
    </EditForm >
  );
});

export default injectIntl(ImportSetting);

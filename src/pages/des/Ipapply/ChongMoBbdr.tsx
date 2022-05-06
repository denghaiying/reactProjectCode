import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Modal, Form, Input, message } from 'antd';
import IpapplyStore from '@/stores/des/IpapplyStore';
import { Button, Grid, Table, Message } from '@alifd/next';
import { toJS } from 'mobx';

const ChongMoBbdr = observer(
  (props: { zlxvisible: any; setZlxvisible: any; tableStore: any }) => {
    const [form] = Form.useForm();
    const { zlxvisible, setZlxvisible, tableStore } = props;
    const [module, setModule] = useState(false);

    const onRowOpen = (openRowKeys: any[]) => {
      IpapplyStore.openRowKeys = openRowKeys;
    };

    /**
     * 响应模版删除事件
     * @param {*} id
     */
    const onTemplDeleteAction = (id) => {
      Message.show({
        closeable: true,
        duration: 0,
        type: 'warning',
        content: (
          <div style={{ width: '200px', height: '50px' }}>
            <Grid.Row style={{ fontSize: '14px', marginTop: '3px' }}>
              确认删除吗?
            </Grid.Row>
            <Grid.Row style={{ textAlign: 'right', marginTop: '6%' }}>
              <div
                style={{ textAlign: 'right', width: '100%', marginTop: '3%' }}
              >
                <Button
                  type="primary"
                  size="small"
                  onClick={() => deleteTemplData(id)}
                >
                  确认
                </Button>
                <Button
                  type="secondary"
                  size="small"
                  style={{ marginLeft: '3%' }}
                  onClick={() => {
                    Message.hide();
                  }}
                >
                  取消
                </Button>
              </div>
            </Grid.Row>
          </div>
        ),
      });
    };

    //模版删除操作
    const deleteTemplData = (id) => {
      IpapplyStore.deleteTemplData(id)
        .then(() => {
          Message.success('删除成功');
        })
        .catch((err) => {
          if (err && err.response.status !== 204) {
            Message.error('删除失败');
          }
        });
    };

    /**
     * 模版表格操作列
     * @param value
     * @param index
     * @param record
     * @returns {*}
     */
    const renderTemplTableCell = (value, index, record) => {
      return (
        <div>
          <a
            href="javascript:;"
            onClick={() => onTemplImportAction(record.sqid)}
          >
            导入
          </a>
          <a
            href="javascript:;"
            style={{ marginLeft: 5 }}
            onClick={() => onTemplDeleteAction(record.id)}
          >
            删除
          </a>
        </div>
      );
    };

    const onTemplImportAction = (jcsqId) => {
      // IpapplyStore.jcsqId = jcsqId;
      IpapplyStore.queryModuleDetail(jcsqId).then(() => {
        onImportTempl();
      });
    };

    const onImportTempl = () => {    
      IpapplyStore.insertJcsqMx(toJS(IpapplyStore.jcmxdata)).then((response) => {
        if (response) {
          tableStore.findByKey(tableStore.key, 1, tableStore.size, { sqid: IpapplyStore.editRecord.id }).then(()=>{
            Message.show('导入模板成功！');
          setZlxvisible(false);
          });
      }else{
        Message.error('导入模板失败！');
      }
      }).catch(()=>{
        Message.error('服务器内部错误');
      });
    };
    return (
      <Modal
        visible={zlxvisible}
        onCancel={() => setZlxvisible(false)}
        width={800}
        title="从模板导入"
        footer={null}
      >
        <Table
          maxBodyHeight={450}
          fixedHeader
          dataSource={IpapplyStore.templdata}
          loading={IpapplyStore.templloading}
          expandedIndexSimulate
          expandedRowRender={IpapplyStore.expandedRowRender}
          expandedRowIndent={[1, 1]}
          openRowKeys={IpapplyStore.openRowKeys}
          onRowOpen={onRowOpen}
        >
          {IpapplyStore.templcolumn.map((col) => (
            <Table.Column
              alignHeader="left"
              align="left"
              key={col.dataIndex}
              {...col}
            />
          ))}
          <Table.Column
            cell={renderTemplTableCell}
            align="center"
            width="100px"
          />
        </Table>
      </Modal>
    );
  },
);
export default ChongMoBbdr;

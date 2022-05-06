import React,{useState} from 'react';
import { observer } from "mobx-react";
import { Modal, message, Table } from 'antd';
import IpapplyStore from '@/stores/des/IpapplyStore';

const YuanWenZlx = observer((props) => {

    const { zlxvisible, setZlxvisible, tableStore } = props;

    const { } = IpapplyStore;

    const [selectedRowKeys,setSelectedRowKeys] = useState([]);

    const onSave = () => {
        if (selectedRowKeys.length > 0) {
            IpapplyStore.saveYuanwen(selectedRowKeys).then((response) => {
                if (response && response.status == 201) {
                    tableStore.findByKey(tableStore.key, 1, tableStore.size, { sqid: IpapplyStore.editRecord.id });
                }
                setZlxvisible(false);
            })
        }else{
            message.warning('暂无选择行！');
        }
    };
    const columns = [
        {
            title: '检测编码',
            dataIndex: 'code',
            width: 100,
        },
        {
            title: '检测名称',
            dataIndex: 'name',
            width: 200,
        },
        {
            title: '检测表达式',
            dataIndex: 'expr',
            width: 200,
        },
    ];
    /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
    const onTableRowChange = (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    return (<div>
        <Modal
            title="原文著录项设置"
            visible={zlxvisible}
            onOk={onSave}
            onCancel={() => setZlxvisible(false)}
            width={800}
        >
            <Table
                rowKey="id"
                rowSelection={{ onChange: onTableRowChange, selectedRowKeys: selectedRowKeys }}
                dataSource={IpapplyStore.yuanweniptcfgData}
            >
                {columns.map(col =>
                    <Table.Column align="center" key={col.dataIndex} {...col} />
                )}
            </Table>
        </Modal>
    </div>
    );

});
export default YuanWenZlx;
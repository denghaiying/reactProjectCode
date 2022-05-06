import React, { useState, useEffect } from 'react';
import { message, Tooltip, Modal, Button, Table, Transfer } from 'antd';
import fetch from "../../../utils/fetch";
import SysStore from '../../../stores/system/SysStore';
import "./index.less";
import { observer, useLocalObservable } from "mobx-react";

import moment from 'moment';
import difference from 'lodash/difference';
import FlowGroupService from '@/services/base/dak/FlowGroupService';
import { InteractionTwoTone } from '@ant-design/icons';
//import TableTransfer from '@/eps/components/transfer/TableTransfer'
const cqbcZtcl = observer((props) => {


    const flowGroupStore = useLocalObservable(() => (
        {
            //获取当前时间
            getDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            //获取当前用户名称
            yhMc: SysStore.getCurrentUser().yhmc,
            //获取当前用户ID
            yhId: SysStore.getCurrentUser().id,
            //获取当前行数据的ID
            getID: props.record.id,
        }
    ));

    const [add_visible, setAddVisible] = useState(false)

    const [ds, setDs] = useState({ targetKeys: [], leftData: [] });

    //点击后初始化用户角色页面
    const click = () => {
        //显示弹框页面
        setAddVisible(true);
        const getDs = async () => {
            let _ds = {}
            var fzData = [];
            let getId = props.record.id
            const rightResponse = await fetch.get(`/api/eps/control/main/lcfz/queryForList?dakid=${getId}&lx=2`);
            const leftResponse = await fetch.get(`/api/eps/control/main/lcfz/queryUnFzMbzlxList?dakid=${getId}&lx=2`);

            if (leftResponse.status === 200) {
                if (leftResponse.data.length > 0) {
                    for (var i = 0; i < leftResponse.data.length; i++) {
                        let newKey = {};
                        newKey = leftResponse.data[i];
                        newKey.key = newKey.id
                        fzData.push(newKey)
                    }
                }
            }

            if (rightResponse.status === 200) {
                if (rightResponse.data.length > 0) {
                    var fzrData = [];
                    for (var i = 0; i < rightResponse.data.length; i++) {
                        let newKey = {};
                        newKey = rightResponse.data[i];
                        newKey.key = newKey.zlxid
                        fzData.push(newKey);
                        fzrData.push(newKey);
                    }
                    _ds.targetKeys = fzrData.map(it => (it.zlxid))

                }
            }
            _ds.leftData = fzData;
            setDs(_ds);
        }
        getDs();




    }

    const leftTableColumns = [
        {
            dataIndex: 'mc',
            title: '名称'
        },
        {
            dataIndex: 'ms',
            title: '描述',
        }
    ];
    const rightTableColumns = [
        {
            dataIndex: 'mc',
            title: '名称'
        },
        {
            dataIndex: 'ms',
            title: '描述',
        }
    ];

    const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
        <Transfer {...restProps} showSelectAll={false}>
            {({
                direction,
                filteredItems,
                onItemSelectAll,
                onItemSelect,
                selectedKeys: listSelectedKeys,
                disabled: listDisabled
            }) => {
                const columns = direction === 'left' ? leftColumns : rightColumns;

                const rowSelection = {
                    getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
                    onSelectAll(selected, selectedRows) {
                        const treeSelectedKeys = selectedRows
                            .filter(item => !item.disabled)
                            .map(({ key }) => key);
                        const diffKeys = selected
                            ? difference(treeSelectedKeys, listSelectedKeys)
                            : difference(listSelectedKeys, treeSelectedKeys);
                        onItemSelectAll(diffKeys, selected);
                    },
                    onSelect({ key }, selected) {
                        onItemSelect(key, selected);
                    },
                    selectedRowKeys: listSelectedKeys
                };
                return (
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={filteredItems}
                        size="small"
                        style={{ pointerEvents: listDisabled ? 'none' : null }}
                        onRow={({ key, disabled: itemDisabled }) => ({
                            onClick: () => {
                                if (itemDisabled || listDisabled) return;
                                onItemSelect(key, !listSelectedKeys.includes(key));
                            }
                        })}
                        pagination={false}
                        scroll={{ y: 420 }}
                    />
                );
            }}
        </Transfer>
    );


    useEffect(() => {
        const settarDs = () => {setTargetKeys(ds.targetKeys);}
        settarDs();
    }, [ds.targetKeys])

    const [targetKeys, setTargetKeys] = useState([]);


    const onChange = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
        var data = [];
        for (var i = 0; i < nextTargetKeys.length; i++) {
            var sss = nextTargetKeys[i];
            let f = {};
            f['zlxid'] = sss;
            f['xh'] = i * 10 + 10;
            data.push(f);
        }
        addFunction(data);
    };

    const addFunction = async (arr) => {
        FlowGroupService.saveFzZlx(flowGroupStore.getID, arr, flowGroupStore.yhMc, flowGroupStore.yhId).then(res => {
            message.success('操作成功')
            props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)

        })
    }
    return (
        <>
            <Tooltip title="流程分组">
                <Button size="small" style={{ fontSize: '12px' }} type={'primary'} shape="circle" icon={<InteractionTwoTone />} onClick={() => click()} />
            </Tooltip>
            <Modal title={<span className="m-title">流程分组</span>}
                visible={add_visible}
                onOk={() => setAddVisible(false)}
                onCancel={() => setAddVisible(false)}
                width="850px"
                footer={null}
                style={{ height: 20 }}>

                <div>
                    <TableTransfer
                        dataSource={ds.leftData}
                        targetKeys={targetKeys}
                        onChange={onChange}
                        leftColumns={leftTableColumns}
                        rightColumns={rightTableColumns}
                    />


                </div>


            </Modal>
        </>
    )
});

export default cqbcZtcl

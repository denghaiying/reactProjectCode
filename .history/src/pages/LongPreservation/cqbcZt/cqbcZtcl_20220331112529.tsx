import React, { useState, useEffect } from 'react';
import { message, Tooltip, Modal, Button, Table, Transfer } from 'antd';
import fetch from "../../../utils/fetch";
import SysStore from '../../../stores/system/SysStore';
import "./index.less";
import { observer, useLocalObservable } from "mobx-react";

import moment from 'moment';
import difference from 'lodash/difference';
import ztclService from './service/ZtclService';
import { InteractionTwoTone } from '@ant-design/icons';
//import TableTransfer from '@/eps/components/transfer/TableTransfer'
const cqbcZtcl = observer((props) => {


    const ztclStore = useLocalObservable(() => (
        {
            selectRData: [],
            //获取当前时间
            getDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            //获取当前用户名称
            yhMc: SysStore.getCurrentUser().yhmc,
            //获取当前用户ID
            yhId: SysStore.getCurrentUser().id,
            //获取当前行数据的ID
            getID: props.record[0]?.dak,
            ztId: props.record[0]?.id,
        }
    ));

    const [add_visible, setAddVisible] = useState(false)

    const [selectdrightdata, setRData] = useState({});
    const [ds, setDs] = useState({ targetKeys: [], leftData: [] });

    const onButtonClick = (a)=> {
        var sjdata = [];
         for(var i=0;i < ztclStore.selectRData.length; i++){
            var szsj=ztclStore.selectRData[i];
            var index = targetKeys.indexOf(szsj);
            debugger
            if(a=='sy'){
                targetKeys.splice(index-1,1,...targetKeys.splice(index,1,targetKeys[index-1]))
            }else{
                targetKeys.splice(index,1,...targetKeys.splice(index+1,1,targetKeys[index]))
            }
        }
        for (var i = 0; i < targetKeys.length; i++) {
            var sss = targetKeys[i];
            let f = {};
            f['zd'] = sss;
            f['xh'] = i * 10 + 10;
            sjdata.push(f);
        }
        updateFunction(sjdata);
        console.log("targetKeys",targetKeys);
    };

    const getDs = async () => {
        let _ds = {}
        var fzData = [];
        let getId = props.record[0].dak
        ztclStore.getID=getId;
        ztclStore.ztId=props.record[0].id;
        const rightResponse = await fetch.post(`/api/eps/lg/cqbcztcl/findForKey`,{dakid:getId,ztid:ztclStore.ztId});
        const leftResponse = await fetch.post(`/api/eps/lg/cqbcztcl/queryUnFzMbzlxList`,{dakid:getId,ztid:ztclStore.ztId});
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
                    newKey.key = newKey.zd
                    fzData.push(newKey);
                    fzrData.push(newKey);
                }
                _ds.targetKeys = fzrData.map(it => (it.zd))
            }
        }
        _ds.leftData = fzData;

        setDs(_ds);
    }

    const updateFunction = async (arr) => {
        let _ds = {}
        ztclService.updateZtclsyxy(ztclStore.ztId,ztclStore.getID, arr, ztclStore.yhMc, ztclStore.yhId).then(res => {
            message.success('操作成功')
             getDs();
        })
    }
    //点击后初始化用户角色页面
    const click = () => {

         if (props.record.length != 1) {
             message.error('操作失败,请选择一行数据');
        }else{
        //显示弹框页面
        setAddVisible(true);

        getDs();
    }

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
                        debugger
                        onItemSelect(key, selected);
                        if(selected){
                            var index = ztclStore.selectRData.indexOf(key);
                           if(index<0){
                            ztclStore.selectRData.push(key);
                           }
                        }else{
                            var index = ztclStore.selectRData.indexOf(key);
                            if(index>0){
                                ztclStore.selectRData.splice(index,1);
                            }

                        }
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
            f['zd'] = sss;
            f['xh'] = i * 10 + 10;
            data.push(f);
        }
        addFunction(data);
    };

    const addFunction = async (arr) => {
        ztclService.saveFzZlx(ztclStore.ztId,ztclStore.getID, arr, ztclStore.yhMc, ztclStore.yhId).then(res => {
            message.success('操作成功')
            props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)

        })
    }
    return (
        <>
            <Button type="primary"  onClick={() => click()}>策略</Button>
            <Modal title={<span className="m-title">策略</span>}
                visible={add_visible}
                onOk={() => setAddVisible(false)}
                onCancel={() => setAddVisible(false)}
                width="900px"
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
                <div   class="ant-modal-footer">
                    <Button type="primary" onClick={() => onButtonClick('sy')}>上移</Button>
                    <Button type="primary" onClick={() => onButtonClick('xy')}>下移</Button>
                </div>


            </Modal>
        </>
    )
});

export default cqbcZtcl

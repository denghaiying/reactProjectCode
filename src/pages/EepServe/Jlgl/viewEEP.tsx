import React, { useEffect, useState } from 'react';
import { message, Tooltip, Modal, Button, Table } from 'antd';
import { FolderViewOutlined } from "@ant-design/icons";
import { observer, useLocalObservable } from "mobx-react";
import './index.less';
import fetch from "../../../utils/fetch";

const viewEEP = observer((props) => {
    const [visible, setVisible] = useState(false)
    const EepjgViewStore = useLocalObservable(() => (
        {
            eepjgviewloading: false,
            jgdata: [],
            async findJbByMb(params) {
                this.eepjgviewloading = true;
                const response = await fetch.get("/api/eps/e9eep/packet/getViewJgTree", params);
                if (response && response.status === 200) {
                    this.jgdata = response.data;
                    this.eepjgviewloading = false;
                }
            }
        }
    ));
    // 点击后初始化页面
    const click = () => {
        // 显示弹框页面
        setVisible(true);
        const params = { params: { id: props.record.id, packettype: props.record.packettype, packetmbeepjg: props.record.packetmbeepjg, packetfilepath: props.record.packetfilepath } };
        EepjgViewStore.findJbByMb(params).catch(err => {
            EepjgViewStore.eepjgviewloading = false;
            message.error("EEP数据包结构浏览失败！")

        }
        );
    }
    // 初始化加载数据
    useEffect(() => {
    }, [])
    const eepjgviewcolumns = [
        {
            title: '名称',
            dataIndex: 'jgname',
            width: '70%',
            key: 'jgname',
        }, {
            title: '结构类型',
            dataIndex: 'jgtype',
            width: '50px',
            key: 'jgtype',
            render: (text, record, index) => {
                if (text === '0') {
                    return '文件';
                } if (text === '1') {
                    return '文件夹';
                }
            }
        }
    ];
    const handlePZBJGCancel = () => {
        setVisible(false);
    };
    return (
        <>
            <Tooltip title="EEP数据包结构浏览">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<FolderViewOutlined />} onClick={event => {
                    event.nativeEvent.stopImmediatePropagation()
                    event.stopPropagation()
                    click()
                }} />
            </Tooltip>
            <Modal title={<span className="m-title">EEP数据包结构浏览</span>}
                visible={visible}
                onCancel={event => {
                    event.nativeEvent.stopImmediatePropagation()
                    event.stopPropagation()
                    handlePZBJGCancel()
                }}
                footer={null}
                style={{ paddingLeft: '24px 0', paddingRight: '24px 0', paddingTop: '24px 0' }}
                width="40%">
                <Table
                    columns={eepjgviewcolumns}
                    dataSource={EepjgViewStore.jgdata}
                    pagination={false}
                    className="record-bottomtable"
                    loading={EepjgViewStore.eepjgviewloading}
                    expandable={{ defaultExpandAllRows: true }}
                    onRow={record => {
                        return {
                            onClick: event => {
                                event.nativeEvent.stopImmediatePropagation()
                                event.stopPropagation()
                                console.log(record);
                            }
                        };
                    }}
                />
            </Modal>
        </>
    )
});

export default viewEEP

import React, {useEffect,  useState} from 'react';
import {Tooltip, Modal, Table, Button} from 'antd';

import "./index.less";
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import {AuditOutlined, CopyOutlined} from "@ant-design/icons";

import YhStore from "@/stores/system/YhStore";


function Zd(text, record, index, store: EpsTableStore) {

    const [visible, setVisible] = useState(false);

    useEffect(() => {
    YhStore.setRoleColumns([{
            title: "全宗号",
            dataIndex: "dwqzh",
            width: 150,
            align: 'center',
            lock: true
        },
            {
                title: "所属单位",
                dataIndex: "dwid",
                align: 'center',
                width: 300
            }, {
                title: "角色编号",
                dataIndex: 'rolecode',
                align: 'center',
                width: 100,
            }, {
                title: "角色名称",
                dataIndex: 'rolename',
                align: 'center',
                width: 250,
            }]);

    }, []);




    return (
        <>
            <Tooltip title="角色">
                <Button size="small" style={{fontSize: '12px'}} type="primary" shape="circle" icon={<AuditOutlined /> } onClick={() => { YhStore.queryRole(record);setVisible(true)}}/>
            </Tooltip>
            <Modal
                title="角色"
                centered
                visible={visible}
                footer={null}
                width={1000}
                onCancel={() => setVisible(false)}
            >

                    <Table
                    columns={YhStore.roleColumns}
                    dataSource={YhStore.roleDataSource}
                    pagination={false} />
            </Modal>
        </>
    );
}

export default Zd

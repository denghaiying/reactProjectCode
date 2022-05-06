import React, {useEffect,  useState} from 'react';
import {Tooltip, Modal, Table, Button,Tabs} from 'antd';

//import "./index.less";
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import {AuditOutlined, } from "@ant-design/icons";
//import { StickyContainer, Sticky } from 'react-sticky';

import YhStore from "@/stores/system/YhStore";

const { TabPane } = Tabs;

function YwqxDetail(text, record, index, store: EpsTableStore) {
     console.log('store===',store)

     const [visible, setVisible] = useState(false);

    useEffect(() => {


    }, []);

    function callback(key) {
        console.log(key);
      }
      


    return (
        <>
            <Tooltip title="业务权限">
                <Button size="small" style={{fontSize: '12px'}} type="primary" shape="circle" icon={<AuditOutlined /> } onClick={() => { YhStore.queryRole(record);setVisible(true)}}/>
            </Tooltip>
            <Modal
                title="业务权限"
                centered
                visible={visible}
                footer={null}
                width={1200}
                onCancel={() => setVisible(false)}
            >

                    <Tabs defaultActiveKey="1" onChange={callback}>
                        <TabPane tab="Tab 1" key="1">
                        Content of Tab Pane 1
                        </TabPane>
                        <TabPane tab="Tab 2" key="2">
                        Content of Tab Pane 2
                        </TabPane>
                        <TabPane tab="Tab 3" key="3">
                        Content of Tab Pane 3
                        </TabPane>
                    </Tabs>
            </Modal>
        </>
    );
}

export default YwqxDetail;

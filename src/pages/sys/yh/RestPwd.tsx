import {Button, message, Modal, Tooltip} from 'antd';
import React from 'react';
import {ExclamationCircleOutlined, InteractionOutlined, UnlockOutlined} from '@ant-design/icons';
import YhStore from "@/stores/system/YhStore";
import {EpsTableStore} from "@/eps/components/panel/EpsPanel";

const { confirm } = Modal;




function RestPwd(text, record, index, store: EpsTableStore)  {

    const handleOk = async () => {

        // const res=  await YhStore.resepassword(record);
        // /*if (res && res.status === 200) {
        // }*/
        // store.findByKey(store.key);
        const res = await YhStore.resepassword(record).catch(err => {
            message.error(err.message || err)
          });
        store.findByKey(store.key);
        Modal.destroyAll();
    };
    
    const handleCancel = () => {
        console.log('Clicked cancel button');
    };


    function showPopconfirm() {
        confirm({
            title: '确定要重置密码么?',
            icon: <ExclamationCircleOutlined />,
            content: '重置后的密码为888!',
            okText: '重置',
            okType: 'danger',
            cancelText: '取消',
            onOk: handleOk,
            onCancel: handleCancel,
        });
    }



    return (
        <Tooltip title="密码重置">
            <Button size="small"  style={{fontSize: '12px'}} type={'primary'} shape="circle" icon={<InteractionOutlined />} onClick={showPopconfirm}/>
        </Tooltip>
    );
}

export default RestPwd;

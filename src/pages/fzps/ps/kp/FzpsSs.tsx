import {Button, message, Modal, Tooltip} from 'antd';
import React from 'react';
import { ExclamationCircleOutlined, UnlockOutlined} from '@ant-design/icons';
import YhStore from "@/stores/system/YhStore";
import {EpsTableStore} from "@/eps/components/panel/EpsPanel";
import { useLocalStore } from 'mobx-react';
import fetch from '@/utils/fetch';
import { showMessage } from '@/eps/components/message';
const { confirm } = Modal;


const FzpsSs= observer((props: IProp) => {
//function FzpsSs(text, record, index, store: EpsTableStore)  {
    const ssstore = useLocalStore(() => ({
   

        async ss() {
            const response = await fetch.post(`/api/eps/control/main/fzsp/addFlow?status=2&id=`+record.id);
                if (response.status === 200) {
                    if (response.data.success == false) {
                       // message.error(`解除锁定失败!`);
                       showMessage('加入移交申请单成功', 'info');
                      } else {
                          
                        showMessage('加入移交申请单失败！\r\n' + res.message, 'warn');
                       // message.success(`解除锁定成功!`);
                      }
            }
        },        
      }));



    function showPopconfirm() {
        confirm({
            title: '确定要将方志送审么?',
            icon: <ExclamationCircleOutlined />,
            content: '方志将送审！',
            okText: '送审',
          //  okType: 'danger',
            cancelText: '取消',
            onOk: handleOk,
            onCancel: handleCancel,
        });
    }

    const handleOk = async () => {
        if (record.status !=="1") {
            message.warning(`此方志无法送审!只有开篇的方志才能送审！`);
            return;
        }
       // const res = await YhStore.updateJc(record);
        /*if (res) {
        }*/
        const res=  await YhStore.updateJc(record);
        /*if (res && res.status === 200) {
            //   openNotification('解除锁定成功', 'warning');
        }*/
        store.findByKey(store.key);
        Modal.destroyAll();

    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
    };

    return (
        <Tooltip title="送审">
            <Button size="small"  style={{fontSize: '12px'}} type={'primary'} shape="circle" icon={<UnlockOutlined />} onClick={showPopconfirm}/>
        </Tooltip>
    );
}

export default FzpsSs;

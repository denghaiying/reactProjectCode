

import { Tooltip, Button, message, Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import SysStore from '../../../stores/system/SysStore';
import RecycleBinService from '@/services/dagl/recycleBin/RecycleBinService';
import { useRef } from 'react';
const { confirm } = Modal;
//删除数据
const Deleted = observer((props) => {

    const ref = useRef()
    /**
     * 调用方法
     */
    const click_Event = async (value) => {
        const RemoveFunc = async () => {
            var args: any = {}
            args['bmc'] = value.ktable.bmc;
            args['dakid'] = value.dakid;
            args['daklx'] = value.ktable.daklx;
            args['ids'] = value.id;
            args['tmzt'] = value.tmzt;
            args['whr'] = SysStore.getCurrentUser().yhmc
            args['whrid'] = SysStore.getCurrentUser().id;
            await RecycleBinService.recycleRemove(args).then(res => {
                if (res.success) {
                    message.success('删除成功');
                } else {
                    message.error('删除失败,' + res.message, 3);
                }
            });
            props.store.findByKey(props.store.key, 1, props.store.size, value);
        }
        const handleCancel = () => {
            console.log('Clicked cancel button');
        };
        confirm({
            title: '确定要删除该条数据吗?',
            icon: <ExclamationCircleOutlined />,
            content: '数据删除后将无法恢复，请谨慎操作',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: RemoveFunc,
            onCancel: handleCancel,
        });
    };

    return (
        <>
            <Tooltip title="删除">
                <Button size="small" danger style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => click_Event(props.record)} />
            </Tooltip>
        </>
    )
});
export default Deleted

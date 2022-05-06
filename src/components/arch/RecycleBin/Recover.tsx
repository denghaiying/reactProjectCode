
import { Tooltip, Button, message,Modal } from 'antd';
import { UndoOutlined,ExclamationCircleOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import SysStore from '../../../stores/system/SysStore';
import RecycleBinService from '@/services/dagl/recycleBin/RecycleBinService';
import { useRef } from 'react';
const { confirm } = Modal;
//加入实体借阅车
const Recover = observer((props) => {
    const ref = useRef()
    /**
     * 调用方法
     */
    const click_Event = async (value) => {
      

        const RestoreFunc = async () => {
            var args: any = {}
            args['bmc'] = value.ktable.bmc;
            args['dakid'] = value.dakid;
            args['daklx'] = value.ktable.daklx;;
            args['ids'] = value.id;
            args['tmzt'] = value.tmzt;
            args['whr'] = SysStore.getCurrentUser().yhmc
            args['whrid'] = SysStore.getCurrentUser().id;
            await RecycleBinService.recycleRestore(args).then(res => {
                if (res.success) {
                    message.success('还原成功');
                } else {
                    message.error('还原失败,' + res.message, 3);
                }
            });
            props.store.findByKey(props.store.key, 1, props.store.size, value);
        }

        const handleCancel = () => {
            console.log('Clicked cancel button');
        };
        confirm({
            title: '确定要还原该条数据吗?',
            icon: <ExclamationCircleOutlined />,
            // content: '数据删除后将无法恢复，请谨慎操作',
            okText: '还原',
            okType: 'danger',
            cancelText: '取消',
            onOk: RestoreFunc,
            onCancel: handleCancel,
        });
       
    };

    return (
        <>
            <Tooltip title="还原">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<UndoOutlined />} onClick={() => click_Event(props.record)} />
            </Tooltip>
        </>
    )
});
export default Recover

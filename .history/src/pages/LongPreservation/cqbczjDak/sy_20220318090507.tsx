import { Tooltip, Button, message } from 'antd';
import { UpCircleTwoTone } from "@ant-design/icons";
import { observer } from "mobx-react";
import DakService from './service/CqbcZjDakService';
const sy = observer((props) => {
    //点击后初始化页面
    const click = () => {
        if (props.record.type === 'F') {
            var formData = new FormData();
            formData.append('id', props.record.id);
            formData.append('fx', "sy");
            formData.append('xh', props.record.xh);
            DakService.moveFunction(formData).then(res => {
                message.success('上移成功')
                props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)
            })

        }
        if (props.record.type === 'K') {
            var formData = new FormData();
            formData.append('id', props.record.id);
            formData.append('fid', props.record.fid);
            formData.append('fx', "sy");
            formData.append('xh', props.record.xh);
            DakService.moveFunction(formData).then(res => {
                message.success('上移成功')
                props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)
            })
        }

    }

    return (
        <>
            <Tooltip title="上移">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<UpCircleTwoTone />} onClick={() => click()} />
            </Tooltip>

        </>
    )
});

export default sy

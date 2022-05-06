import { Tooltip, Button, message } from 'antd';
import { DownCircleTwoTone } from "@ant-design/icons";
import { observer } from "mobx-react";
import byDakService from '@/services/base/bydak/ByDakService';
const xy = observer((props) => {

    //点击后初始化页面
    const click = () => {
        if (props.record.type === 'F') {
            var formData = new FormData();
            formData.append('id', props.record.id);
            formData.append('fx', "xy");
            formData.append('xh', props.record.xh);
            byDakService.moveFunction(formData).then(res => {
                message.success('下移成功')
                props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)
            })
        }
        if (props.record.type === 'K') {
            var formData = new FormData();
            formData.append('id', props.record.id);
            formData.append('fid', props.record.fid);
            formData.append('fx', "xy");
            formData.append('xh', props.record.xh);
            byDakService.moveFunction(formData).then(res => {
                message.success('下移成功')
                props.store.findByKey(props.store.key, 1, props.store.size, props.store.params)
            })
        }
    }
    return (
        <>
            <Tooltip title="下移">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<DownCircleTwoTone />} onClick={() => click()} />
            </Tooltip>

        </>
    )
});

export default xy

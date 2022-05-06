
import { Tooltip, Button, message } from 'antd';
import { CloseCircleTwoTone } from "@ant-design/icons";
import { observer } from "mobx-react";
import fetch from "../../../utils/fetch";

const stopTask = observer((props) => {
    /**
     * 调用方法
     */
    const click_Event = async (value) => {
        const response = await fetch.get(`eps/dsrw/dsrw/stopDsrw?id=${value.id}`);
        if (response.data.success) {
            message.success('停用成功');
            props.store.findByKey(props.store.key, 1, props.store.size, props.store.params);
        } else {
            console.log(response.data);
            message.error('操作失败,' + response.data.message, 3);
        }
    };

    return (
        <>

            <Tooltip title="停用">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<CloseCircleTwoTone />} onClick={() => click_Event(props.record)} />
            </Tooltip>
        </>
    )
});
export default stopTask

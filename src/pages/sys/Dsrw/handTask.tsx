
import { Tooltip, Button, message } from 'antd';
import { ToolTwoTone } from "@ant-design/icons";
import { observer } from "mobx-react";
import fetch from "../../../utils/fetch";

const handTask = observer((props) => {
    /**
     * 调用方法
     */
     const click_Event = async (value) => {
        const response = await fetch.get(`eps/dsrw/dsrw/runDsrw?id=${value.id}`);
        if (response.data.success) {
            message.success('手动启动成功');
            props.store.findByKey(props.store.key, 1, props.store.size, props.store.params);
        } else {
            console.log(response.data);
            message.error('操作失败,' + response.data.message, 3);
        }

    };

    return (
        <>
            <Tooltip title="手动启动">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<ToolTwoTone />} onClick={() => click_Event(props.record)} />
            </Tooltip>
        </>
    )
});
export default handTask

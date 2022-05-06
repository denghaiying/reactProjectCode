
import { Tooltip, Button, message } from 'antd';
import { CheckCircleTwoTone } from "@ant-design/icons";
import { observer } from "mobx-react";
import fetch from "../../../utils/fetch";

//加入实体借阅车
const addLydjd = observer((props) => {
    /**
     * 调用方法
     */
     const click_Event = async (value) => {
        const response = await fetch.get(`api/eps/control/main/daxc/addXcd?id=${value.id}`);
        if (response.data.success) {
            message.success('加入利用登记单成功');
            props.store.findByKey(props.store.key, 1, props.store.size, props.store.params);
        } else {
            console.log(response.data);
            message.error('操作失败,' + response.data.message, 3);
        }
    };

    return (
        <>
            <Tooltip title="加入">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<CheckCircleTwoTone />} onClick={() => click_Event(props.record)} />
            </Tooltip>
        </>
    )
});
export default addLydjd

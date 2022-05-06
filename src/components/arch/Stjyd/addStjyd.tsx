
import { Tooltip, Button, message } from 'antd';
import { CheckCircleTwoTone } from "@ant-design/icons";
import { observer } from "mobx-react";
import SysStore from '../../../stores/system/SysStore';
import StjycService from '@/services/daly/stjyd/StjycService';
import { await } from '@umijs/deps/compiled/signale';

//加入实体借阅车
const addStjyd = observer((props) => {
    /**
     * 调用方法
     */
    const click_Event = async (value, ids) => {
        var args: any = {}
        args['bmc'] = value.bmc;
        args['yhid'] = SysStore.getCurrentUser().id;
        args['dakid'] = value.dakid;
        args['daklx'] = value.lx;
        args['ids'] = ids.toString();
        args['tmzt'] = value.tmzt;
        args['dwid'] = SysStore.getCurrentUser().dwid
        args['stjydid'] = value.id;

        if (ids.length <= 0) {
            message.warning({ type: 'warning', content: '请至少选择一行条目数据' })
        } else {
            var isExsist = true;
            if (ids.length > 0) {
                for (var i = 0; i < ids.length; i++) {
                    await StjycService.checkStjyd(value.id, ids[i]).then(res => {
                        if (res.results && res.results.length > 0) {
                            isExsist = false;
                        } else {
                            isExsist = true;
                        }
                    });
                }
            }

            if (isExsist) {
                await StjycService.addStjyd(args).then(res => {
                    if (res.success) {
                        message.success('加入实体借阅车成功');
                    } else {
                        message.error('操作失败,' + res.message, 3);
                    }
                });
            } else {
                message.error('操作失败,所选条目已加入过该借阅单，请确认后在添加!');
            }
        }
    };

    return (
        <>
            <Tooltip title="加入">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<CheckCircleTwoTone />} onClick={() => click_Event(props.record, props.ids)} />
            </Tooltip>
        </>
    )
});
export default addStjyd

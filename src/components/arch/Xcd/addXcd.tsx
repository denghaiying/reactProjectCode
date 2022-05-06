
import { Tooltip, Button, message } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import XcdService from '@/services/daly/xcd/XcdService';
import SysStore from '../../../stores/system/SysStore';

//放入协查单
const addXcd = observer((props) => {
    /**
     * 调用方法
     */
    const click_Event = async (value, ids) => {
        var code = "DALYF004";
        var yhid = SysStore.getCurrentUser().id;
        var sftj = "Y";
        var args: any = {}
        args['bmc'] = value.bmc;
        args['yhid'] = value.whrid;
        args['dakid'] = value.dakid;
        args['daklx'] = value.lx;
        args['ids'] = ids.toString();
        args['tmzt'] = value.tmzt;
        args['dwid'] = value.dwid;
        args['xcdid'] = value.id;

        if (ids.length <= 0) {
            message.warning({ type: 'warning', content: '请至少选择一行条目数据' })
        } else {
            XcdService.getUserOption(code, yhid).then(res => {
                if (res.message && res.message === 'N') {
                    sftj = "N";
                } else {
                    args['wpid'] = value.wpid;
                    args['nextwpid'] = "ZZZZ";
                    args['wfinst'] = value.wfinst;
                    args['curUserName'] = value.yhmc;
                    args['curUserid'] = value.yhid;
                    args['sftj'] = sftj;
                    args['wfid'] = "DAXC_NEW";
                    args['action'] = 1;
                }
            })
            var isExsist = true;
            // if (ids.length > 0) {
            //     for (var i = 0; i < ids.length; i++) {
            //         await XcdService.checkXcd(value.id, ids[i]).then(res => {
            //             if (res.results && res.results.length > 0) {
            //                 isExsist = false;
            //             } else {
            //                 isExsist = true;
            //             }
            //         });
            //     }
            // }
            if (isExsist) {
               await  XcdService.addXcd(args).then(res => {
                    debugger;
                    if (res.success) {
                        message.success('加入协查单成功!');
                        window.top.RightStore.queryAllDbswCount(); 
                    } else {
                        console.log(res.data);
                        message.error('操作失败,所选条目已加入过该协查单，请确认后在添加!');
                    }
                });
            } else {
                message.error('操作失败,所选条目已加入过该协查单，请确认后在添加!');
            }
        }
    };

    return (
        <>
            <Tooltip title="加入">
                <Button size="small" style={{ fontSize: '12px' }} type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => click_Event(props.record, props.ids)} />
            </Tooltip>
        </>
    )
});
export default addXcd

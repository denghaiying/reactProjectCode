import BaseService from '@/eps/commons/v2/BaseService';
import SysStore from '@/stores/system/SysStore';
import { message } from "antd";

class DetailService extends BaseService {
    // 用户 id
    yhid = SysStore.getCurrentUser().id
    // 用户 bh
    yhbh = SysStore.getCurrentUser().bh
    // 用户 mc
    yhmc = SysStore.getCurrentUser().yhmc
    // 获取当前默认单位id
    dwid = SysStore.getCurrentUser().dwid
    // 获取当前默认部门id
    bmid = SysStore.getCurrentUser().bmid


    // 获取菜单
    // @ts-ignore
    getOptions(url,params) {
        return new Promise((resolve, reject) => {
            return super.post({ url, params }).then(res => {
                if (res.status > 300) {
                    return reject(res)
                }
                return resolve(res.data)
            }).catch(err => {
                return reject(err)
            })
        }
        )
    }

}

export default new DetailService('/api/eps/jc');

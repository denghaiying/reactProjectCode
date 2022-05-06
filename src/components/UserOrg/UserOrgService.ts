import HttpRequest from "@/eps/commons/v2/HttpRequest";

class UserOrgService extends HttpRequest {

    url: string = ''
    constructor(url: string) {
        super(url)
        this.url = url;
    }

    getUserOrg() {
        return new Promise((resolve, reject) => {
            return super.post({ url: `${this.url}/dw/queryForListByYhid` }).then(res => {
                if (res && res.data) {

                    return resolve(res?.data.map(item => ({ value: item.key, ...item })))
                } else {
                    return reject("单位信息获取失败")
                }
            }).catch(err => {
                return reject(err)
            })
        })
    }

    setEpsSession(dwid: string) {
        return new Promise((resolve, reject) => {
            return super.post({ url: `${this.url}/setEpsSession`, data: { dwid } }).then(res => {
                return resolve(res.data)
            }).catch(err => {
                return reject(err)
            })
        })
    }

    setEpsSessionByGet(dwid: string) {
        return new Promise((resolve, reject) => {
            return super.get({ url: `${this.url}/setEpsSession`, params: { dwid } }).then(res => {
                return resolve(res.data)
            }).catch(err => {
                return reject(err)
            })
        })
    }

}

export default new UserOrgService('/api/eps/control/main');

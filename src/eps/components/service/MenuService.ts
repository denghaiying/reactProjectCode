import HttpRequest from "@/eps/commons/v2/HttpRequest";
import qs from 'qs'

class MenuService extends HttpRequest {

    readonly url: string;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(url: string){
        super(url)
        this.url = url;
    }

    modify(params: Record<string, unknown>){
        return new Promise((resolve, reject) => {
            super.post({url: `${this.url  }/updateYhOpts` ,data: qs.stringify(params),  headers: {
                "content-type": "application/x-www-form-urlencoded"
                }}).then(res => {
                if(res.status > 300){
                    return reject(res)
                }
                return resolve(res.data)
            }).catch(err => {
                return reject(err)
            })
        })
    }

    findYhDakOpt(params: Record<string, unknown>){
        return new Promise((resolve, reject) => {
            super.post({url: `${this.url  }/queryYhDakopts` ,data: qs.stringify(params),  headers: {
                "content-type": "application/x-www-form-urlencoded"
                }}).then(res => {
                if(res.status > 300){
                    return reject(res)
                }
                return resolve(res.data)
            }).catch(err => {
                return reject(err)
            })
        })
    }
}

export default new MenuService('/api/eps/control/main/dakqx')

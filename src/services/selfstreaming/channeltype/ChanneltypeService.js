import BaseService from '../../BaseService';
import fetch from "../../../utils/fetch";
import util from "../../../utils/util";

class ChanneltypeService extends BaseService {
    constructor(url) {
    super(url);
    this.IsLogin = false;
  }

    delete(id) {
        return new Promise((resolve, reject) => {
        fetch
            .delete(`${this.url}/${encodeURIComponent(id)}`)
            .then(response => {
            if (response.status === 204) {
                resolve(true);
            } else {
                reject(util.bussinessException(response.status, response.data));
            }
            })
            .catch(err => {
            reject(
                util.bussinessException(
                err.response ? err.response.status : "404",
                err.response ? err.response.data : err
                )
            );
            });
        });
    }

}

export default new ChanneltypeService('/streamingapi/channeltype');

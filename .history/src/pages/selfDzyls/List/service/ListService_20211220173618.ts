import BaseService from '@/eps/commons/v2/BaseService';

class ListService extends BaseService {
  findByKey(
    key: string | number,
    page: number = 1,
    size: number = 10,
    args: object = {},
  ): Promise<any> {

    return new Promise((resolve, reject) => {
      debugger
      return super.post({ url: this.url + `/queryForPage?pageno=${page}&pagesize=${size}`, data: args })
        .then((res) => {
          debugger
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}

export default new ListService('/api/streamingapi/content');

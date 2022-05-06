import fetch from '@/utils/fetch';
import { action, observable } from 'mobx';
import BaseStore from '../BaseStore';

/**
 * @summary 发文
 */
class FwStore extends BaseStore {
  /**
   * 保存发文数据
   * @param values
   * @returns
   */
  @action saveFWData = (opt, values) => {
    return new Promise((resolve, reject) => {
      if (opt === 'add') {
        fetch
          .post(`${this.url}`, values)
          .then((response) => {
            if (response.status === 201) {
              resolve(response.data);
            } else {
              reject(response.data);
            }
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        fetch
          .put(`${this.url}/${values.id}`, values)
          .then((response) => {
            if (response.status === 200) {
              resolve(true);
            } else {
              reject(response.data);
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  };

  /**
   * 根据流程id查询数据
   */
  @action findByWfinst = (wfinst) => {
    return new Promise((resolve, reject) => {
      fetch
        .get(`${this.url}/wfinst/${wfinst}`)
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
export default new FwStore('/api/eps/gwgl/fw');

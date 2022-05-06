import BaseService from '@/eps/commons/v2/BaseService';
import SysStore from '@/stores/system/SysStore';
class ApplyService extends BaseService  {
    findAll(params) {
        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/queryForList', params }).then(res => {
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

  findByKey(params) {
    return new Promise((resolve, reject) => {
      return super.post({ url: this.url + '/queryByKey', params }).then(res => {
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
    save(data){

        return new Promise((resolve, reject) => {
          if( !data){
            return reject('请检查待保存数据，不能为空')
          }
          data['spr'] = SysStore.getCurrentUser().yhmc;
          data['sprid'] = SysStore.getCurrentUser().id;
          return super.get({url: this.url + '/add', params: data,}).then(res => {
            if (res.data && res.data.success){
              return resolve(res.data);
            }
            return reject(res.data.message)
          }).catch(err => {
            return reject(err);
          })
        })
      }
    update(data) {
        console.log("updatedata",data);

        return new Promise((resolve, reject) => {
          if( !data){
            return reject('请检查待保存数据，不能为空')
          }
          data['whr'] = SysStore.getCurrentUser().yhmc;
          data['whrid'] = SysStore.getCurrentUser().id;
          super.get({
            url : `${this.url}/update/`,
            params: data
          }).then(res => {
            if (res.data && res.data.success){
              return resolve(res.data);
            }
            return reject(res.data.message)
          }).catch(err => {
            return reject(err);
          })
        })
      }


      updateBatch(data) {
        console.log("updatebatchdata",data);
        return new Promise((resolve, reject) => {
          if( !data){
            return reject('请检查待保存数据，不能为空')
          }
          data['whr'] = SysStore.getCurrentUser().yhmc;
          data['whrid'] = SysStore.getCurrentUser().id;
          super.get({
            url : `${this.url}/updateBatch/`,
            params: data
          }).then(res => {
            if (res.data && res.data.success){
              return resolve(res.data);
            }
            return reject(res.data.message)
          }).catch(err => {
            return reject(err);
          })
        })
      }
}

export default new ApplyService('/api/eps/control/main/kfjdlog');

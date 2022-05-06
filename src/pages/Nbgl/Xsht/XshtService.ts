import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';
import moment from 'moment';

class XshtService extends BaseService implements ITableService {
  //销售人员数据源
  yhSelectData: [] | undefined
  yhmc: '' | undefined
  bmid: '' | undefined




  //分页查询
  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    const params = { params: args, page, size };
    return new Promise((resolve, reject) => {
      return super.findAll(params).then(res => {
        return resolve(res.data);
      }).catch(err => {
        return reject(err);
      })
    });
  }

  creatXshtcode() {
    let code = '';
    // 设置长度，这里看需求，我这里设置了4
    const codeLength = 4;
    // 设置随机字符
    const random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    // 循环codeLength 我设置的4就是循环4次
    for (let i = 0; i < codeLength; i++) {
      // 设置随机数范围,这设置为0 ~ 36
      const index = Math.floor(Math.random() * 9);
      // 字符串拼接 将每次随机的字符 进行拼接
      code += random[index];
    }
    return `XS${moment().format('YYYY')}${code}`;
  }
  //新增主表数据和明细表数据
  saveByKey(key, data) {
    let xshtZje = 0;
    data['xshtcode'] = this.creatXshtcode();
    //根据明细表的各个含税金额计算总金额
    if (data.hasOwnProperty('detailList') && data['detailList'].length > 0) {
      for (var i = 0; i < data['detailList'].length; i++) {
        xshtZje = xshtZje + data['detailList'][i].xshtmxhsje;
      }
    }
    data['xshtzje'] = xshtZje;
    return super.save(data);
  }

  //修改主表数据和明细表数据
  updateForTable(data) {
    let xshtZje = 0;
    if (data.hasOwnProperty('detailList') && data['detailList'].length > 0) {
      for (var i = 0; i < data['detailList'].length; i++) {
        xshtZje = xshtZje + data['detailList'][i].xshtmxhsje;
      }
    }
    data['xshtzje'] = xshtZje;
    return super.update(data);
  }
  // 删除主表数据和明细表数据（参数为实体）
  deleteForTable(data: object): Promise<any> {
    return super.deleteData(data);
  };
}

export default new XshtService('/api/eps/nbgl/xsht');
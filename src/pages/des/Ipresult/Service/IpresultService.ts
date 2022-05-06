import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';
import { message } from 'antd';

class IpresultService extends BaseService implements ITableService {
  //分页查询
  findByKey(
    key: string | number,
    page: number = 1,
    size: number = 10,
    args: object = {},
  ): Promise<any> {
    const params = { params: args, page: page + 1, size };
    return new Promise((resolve, reject) => {
      return super
        .findAll(params)
        .then((res) => {
          //数据渲染
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 新增数据
  saveByKey(key, data) {
    return super.save(data);
  }

  // 修改数据
  updateForTable(data) {
    return super.update(data);
  }

  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  }

  OutToPdfOne(currentRows: Array<object>) {
    //{  }
    const pdf = '.pdf';
    super
      .get({
        url: `${this.url}/outpdf/` + currentRows[0]['id'],
        params: { sqdw: currentRows[0]['sqdw'] },
        responseType: 'blob',
      })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          if (!data) {
            message.warning('该pdf文件不存在！');
          } else {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', currentRows[0]['sqdw'] + pdf);
            document.body.appendChild(link);
            link.click();
            const list = currentRows.slice(1);
            if (list.length > 0) {
              this.OutToPdfOne(list);
            }
          }
        } else {
          message.warning('导出错误：原因是：' + response.data);
        }
      });
  }
}

export default new IpresultService('/api/eps/des/jcsq');

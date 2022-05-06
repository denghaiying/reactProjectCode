import BaseService from "@/eps/commons/BaseService";
import { ITableService } from "@/eps/commons/panel";
import { message } from "antd";
import { AxiosResponse } from "axios";
/**
 * 服务调用
 * tyq
 */
class EncalrService extends BaseService implements ITableService{

  /**
   * 返回的非工作日字符串日期数据
   */
  Data: Array<string> = [];
  /**
   * 返回的非工作日数据源
   */
  dataSource: Array<any> = [];

  /**
   * 返回的所有的数据源
   */
  AlldataSource: Array<any> = [];

  findAll(params: any): Promise<any>{
    return super.findAll({params: params,page: 1,size: 40}).then((response: AxiosResponse)=>{
      let list: Array<string> = [];
      const data: Array<any> = response.data.list.filter((f: any)=> f.workday === 'N');
      data.forEach((element: any) => {
        list.push(`${element.year}-${element.month}-${element.day}`);
      });;
      this.Data = list;
      this.dataSource = data;
      this.AlldataSource = response.data.list;
    }).catch((reason)=>{
      message.error(reason);
    });
  }

  // 新增数据
  saveByKey(data: any) {
    data['id'] = `${Math.random()}`
    return super.save(data);
  };
  /**
   * 保存当前月份的所有周六周日
   * @param params 
   * @returns 
   */
  saveAllCurrentWeek(params: object){
    return super.get({
      url: `${this.url}/addweek`,
      params: params
    });
  }

  // 修改数据
  updateForTable(data: any) {
    return super.update(data);
  };

  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  };
}

export default new EncalrService('/api/eps/dps/encalr');
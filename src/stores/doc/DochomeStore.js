import { action } from 'mobx';
import BaseStore from '../BaseStore';
import ChartL1 from './DochomeEcharts/chart-l-1';
import ChartR1 from './DochomeEcharts/chart-r-1';

/**
 * @Author: 徐香香
 * @Date: 2020-09-02
 * @content: 文档管理首页Store层
 */

class DochomeStore extends BaseStore {
  // 设置左下图表数据-文档服务启用情况
  @action setChartDownLeft = async (myChart) => {
    myChart.setOption(ChartL1);
  }


  // 设置右下图表数据-文档类型统计
  @action setChartDownRight = async (myChart) => {
    myChart.setOption(ChartR1);
  }
}

export default new DochomeStore('/docapi');

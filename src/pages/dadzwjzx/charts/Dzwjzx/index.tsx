import { useEffect } from 'react';
import style from './index.less';
import { observer, useLocalStore } from 'mobx-react';
import Column from './Column';
import Pie from './Pie';
import DemoLine from './DemoLine';
import tableService from './tableService';
import { runInAction } from 'mobx';
import { Table, Button } from 'antd';
const Dzwjzx = observer((props) => {
  const store = useLocalStore(() => ({
    pieData: {},
    columnData: {},
    dzwjzxCount: {},
    dataSource: [],

    columns: [
      {
        title: '状态',
        dataIndex: 'KFJD_WPID',
        render: function (value) {
          if (value == 'ZZZZ') {
            return '审批结束';
          } else if (value == '0010') {
            return '编制';
          } else {
            return '审批中';
          }
        },
      },
      {
        title: '标题',
        dataIndex: 'KFJD_TITLE',
      },
      {
        title: '申请单号',
        dataIndex: 'KFJD_BH',
      },
      {
        title: '日期',
        dataIndex: 'KFJD_DATE',
      },
      {
        title: '档案库名称',
        dataIndex: 'KFJD_DAKMC',
      },
      {
        title: '申请人',
        dataIndex: 'KFJD_TJR',
      },
    ],
    async initCharts() {
      const resBanner = await tableService.queryDzwjzxCharts();
      debugger;
      runInAction(() => {
          this.dzwjzxCount = resBanner;
      });
    },
  }));

  useEffect(() => {
    store.initCharts();
  }, []);

  /**
 *  isnull(KFZSL,'0') ,
      isnull(KZZSL,'0'),
      isnull(BNKFSL,'0'),
      isnull(BNKZSL,'0'),
      isnull(JDZSL,'0')
 */
  return (
    <div className={`${style['chartsSecond-content']}`}>
      <div className={`${style['tabs-list']} ${style['common-wrap']}`}>
        <div className={`${style['title']}`}>电子文件中心</div>
        <div className={`${style['tabs-det']} ${style['common-content']}`}>
          <div className={`${style['cards']} ${style['cards-img-2']}`}>
            <div className={`${style['num']}`}>{store.dzwjzxCount?.zsl}</div>
            <div className={`${style['name']}`}>总数</div>
          </div>
          <div className={`${style['cards']} ${style['cards-img-3']}`}>
            <div className={`${style['num']}`}>{store.dzwjzxCount.sbl}</div>
            <div className={`${style['name']}`}>失败数</div>
          </div>
          <div className={`${style['cards']} ${style['cards-img-1']}`}>
            <div className={`${style['num']}`}>{store.dzwjzxCount.zcl}</div>
            <div className={`${style['name']}`}>正常数</div>
          </div>
          <div className={`${style['cards']} ${style['cards-img-1']}`}>
            <div className={`${style['num']}`}>{store.dzwjzxCount.fjs}</div>
            <div className={`${style['name']}`}>电子文件数量</div>
          </div>
        </div>
      </div>
      <div className={`${style['charts-area']}`}>
        <div className={`${style['common-wrap']}`}>
          <div className={`${style['title']}`}>按档案类型</div>
          <div className={`${style['common-content']}`}>
            <Column />
          </div>
        </div>
        <div className={`${style['common-wrap']}`}>
          <div className={`${style['title']}`}>占比</div>
          <div className={`${style['common-content']}`}>
            <Pie data={store.dzwjzxCount}/>
          </div>
        </div>
      </div>
      <div className={`${style['table-area']} ${style['common-wrap']}`}>
        <div className={`${style['title']}`}>按年度</div>
        <div className={`${style['common-content']}`}>
        <DemoLine />
        </div>
      </div>
    </div>
  );
});

export default Dzwjzx;

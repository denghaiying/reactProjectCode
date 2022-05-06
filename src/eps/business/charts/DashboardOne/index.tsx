import { useEffect } from 'react';
import style from './index.less';
import { Table, Button } from 'antd';
import { observer, useLocalStore } from 'mobx-react';
import Column from './Column';
import Pie from './Pie';
import tableService from './tableService';
import { runInAction } from 'mobx';
const DashboardOne = observer((props) => {
  const store = useLocalStore(() => ({
    pieData: {},
    columnData: {},
    kfjdCount: {},
    kfjdNd: {},
    kfjdKz: {},
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
      const resBanner = await tableService.queryKfjdCharts();
      const resNd = await tableService.queryNdkfCharts();
      const resKz = await tableService.queryKzkzCharts();
      const resTable = await tableService.queryKfjlCharts();
      debugger;
      runInAction(() => {
        if (resBanner.success) {
          this.kfjdKz = resKz?.results;
          this.kfjdNd = resNd?.results;
          this.dataSource = resTable.results;
          this.kfjdCount = resBanner.results;
        }
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
        <div className={`${style['title']}`}>档案开放鉴定</div>
        <div className={`${style['tabs-det']} ${style['common-content']}`}>
          <div className={`${style['cards']} ${style['cards-img-2']}`}>
            <div className={`${style['num']}`}>{store.kfjdCount.KFZSL}</div>
            <div className={`${style['name']}`}>总开放</div>
          </div>
          <div className={`${style['cards']} ${style['cards-img-3']}`}>
            <div className={`${style['num']}`}>{store.kfjdCount.KZZSL}</div>
            <div className={`${style['name']}`}>总控制</div>
          </div>
          <div className={`${style['cards']} ${style['cards-img-1']}`}>
            <div className={`${style['num']}`}>{store.kfjdCount.BNKFSL}</div>
            <div className={`${style['name']}`}>本年开放</div>
          </div>
          <div className={`${style['cards']} ${style['cards-img-1']}`}>
            <div className={`${style['num']}`}>{store.kfjdCount.KFZSL}</div>
            <div className={`${style['name']}`}>本年控制</div>
          </div>
          <div className={`${style['cards']} ${style['cards-img-3']}`}>
            <div className={`${style['num']}`}>{store.kfjdCount.JDZSL}</div>
            <div className={`${style['name']}`}>鉴定中</div>
          </div>
        </div>
      </div>
      <div className={`${style['charts-area']}`}>
        <div className={`${style['common-wrap']}`}>
          <div className={`${style['title']}`}>按年度开放鉴定</div>
          <div className={`${style['common-content']}`}>
            <Column data={store.kfjdNd} />
          </div>
        </div>
        <div className={`${style['common-wrap']}`}>
          <div className={`${style['title']}`}>开放控制</div>
          <div className={`${style['common-content']}`}>
            <Pie data={store.kfjdKz} />
          </div>
        </div>
      </div>
      <div className={`${style['table-area']} ${style['common-wrap']}`}>
        <div className={`${style['title']}`}>开放记录</div>
        <div className={`${style['common-content']}`}>
          <Table
            columns={store.columns}
            dataSource={store.dataSource}
            className={`${style['table']}`}
            pagination={{ pageSize: 8 }}
          />
        </div>
      </div>
    </div>
  );
});

export default DashboardOne;

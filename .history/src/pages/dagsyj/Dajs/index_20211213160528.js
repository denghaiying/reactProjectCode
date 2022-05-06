import { useEffect, useState, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import style from './index.less';
import * as echarts from 'echarts';
import { Table, Button, Modal, message } from 'antd';
import Column from './Column';
import Pie from './Pie';
import DajsService from './service/DajsService';

const Dajs = observer((props) => {
  const store = useLocalStore(() => ({

    sytjdata:[],
    dataSource: [],
    // 主表档案库信息
    columns: [
      {
        title: '状态',
        dataIndex: 'zt',
      },
      {
        title: '单位名称',
        dataIndex: 'dwmc',
      },
      {
        title: '移交人',
        dataIndex: 'sqrmc',
      },
      {
        title: '移交时间',
        dataIndex: 'sqsj',
      },
      {
        title: '移交审核人',
        dataIndex: 'yjshr',
      },
      {
        title: '移交审核时间',
        dataIndex: 'yjshsj',
      },  {
        title: '接收人',
        dataIndex: 'jsr',
      },
      {
        title: '接收时间',
        dataIndex: 'jssj',
      },
      {
        title: '接收审核人',
        dataIndex: 'jsshr',
      },
      {
        title: '接收审核时间',
        dataIndex: 'jsshsj',
      },
      {
        title: '操作',
        dataIndex: 'opt',
        width: 200,
        render: (key, item, index) => {
          return (
            <div className={`${style['opts-area']}`}>
              <div className={`${style['guidang']} ${style['common']}`}>
                四性
              </div>
              <div className={`${style['fenxiang']} ${style['common']}`}>
                接收
              </div>
              <div
                className={`${style['shangchu']} ${style['common']}`}
               // onClick={this.handleOpt.bind(this, 'delete', item)}
              >
                拒绝
              </div>
              <div className={`${style['chakan']} ${style['common']}`}>
                报表
              </div>
              <div className={`${style['chakan']} ${style['common']}`}>
                下载
              </div>
            </div>
          );
        },
      },
    ],
    async initSj() {
      const resBanner = await DajsService.qureydajssytj();
      const ressj = await DajsService.qureydajssj({zt:"D"});
      debugger;
      this.sytjdata=resBanner;
      this.dataSource=ressj;
    },
  }));
  useEffect(() => {
   store.initSj();
  }, []);
    return (
      <div className={`${style['chartsSecond-content']}`}>
        <div className={`${style['tabs-list']} ${style['common-wrap']}`}>
          <div className={`${style['title']}`}>统计</div>
          <div className={`${style['tabs-det']} ${style['common-content']}`}>
            <div className={`${style['cards']} ${style['cards-img-2']}`}>
              <div className={`${style['num']}`}>{store.sytjdata.zdwsl}</div>
              <div className={`${style['name']}`}>进馆总数</div>
            </div>
            <div className={`${style['cards']} ${style['cards-img-3']}`}>
              <div className={`${style['num']}`}>{store.sytjdata.bnddwsl}</div>
              <div className={`${style['name']}`}>本年进馆</div>
            </div>
            <div className={`${style['cards']} ${style['cards-img-1']}`}>
              <div className={`${style['num']}`}>{store.sytjdata.djs}</div>
              <div className={`${style['name']}`}>待接收</div>
            </div>
            <div className={`${style['cards']} ${style['cards-img-1']}`}>
              <div className={`${style['num']}`}>{store.sytjdata.spz}</div>
              <div className={`${style['name']}`}>审批中</div>
            </div>
          </div>
        </div>
        <div className={`${style['charts-area']}`}>
          <div className={`${style['common-wrap']}`}>
            <div className={`${style['title']}`}>标题3</div>
            <div className={`${style['common-content']}`}>
            <Column/>
            </div>
          </div>
          <div className={`${style['common-wrap']}`}>
            <div className={`${style['title']}`}>标题2</div>
            <div className={`${style['common-content']}`}>
            <Pie />
            </div>
          </div>
        </div>
        <div className={`${style['table-area']} ${style['common-wrap']}`}>
          <div className={`${style['title']}`}>标题4</div>
          <div className={`${style['common-content']}`}>
            <div className={`${style['btns-area']}`}>
              <Button type="primary" className={`${style['btns']}`}>
                待接收
              </Button>
              <Button type="primary" className={`${style['btns']}`}>
                已接收
              </Button>
              <Button type="primary" className={`${style['btns-type']}`}>
                全部
              </Button>
            </div>
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
export default Dajs;

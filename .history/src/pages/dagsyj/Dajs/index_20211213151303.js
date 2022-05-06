import { useEffect, useState, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import style from './index.less';
import * as echarts from 'echarts';
import { Table, Button, Modal, message } from 'antd';

const Dajs = observer((props) => {
  const archStore: ArchStoreType = useLocalObservable(() => ({
    // 参数
    archParams,
    columns: [],
    // 主表档案库信息
    ktable: {},
    // 动态字段信息
    columns: [
      {
        title: '状态',
        dataIndex: 'name',
      },
      {
        title: '单位名称',
        dataIndex: 'dep',
      },
      {
        title: '移交单名称',
        dataIndex: 'person',
      },
      {
        title: '移交人',
        dataIndex: 'status',
      },
      {
        title: '移交时间',
        dataIndex: 'time',
      },
      {
        title: '审批人',
        dataIndex: 'time',
      },
      {
        title: '审批时间',
        dataIndex: 'time',
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
  }));
  useEffect(() => {
    //store.queryDzylssy();
   // store.dalysycdnrtj();
   // store.dalysylymdtj();
  }, []);


    return (
      <div className={`${style['chartsSecond-content']}`}>
        <div className={`${style['tabs-list']} ${style['common-wrap']}`}>
          <div className={`${style['title']}`}>进馆总数</div>
          <div className={`${style['tabs-det']} ${style['common-content']}`}>
            <div className={`${style['cards']} ${style['cards-img-2']}`}>
              <div className={`${style['num']}`}>16</div>
              <div className={`${style['name']}`}>本年进馆</div>
            </div>
            <div className={`${style['cards']} ${style['cards-img-3']}`}>
              <div className={`${style['num']}`}>16</div>
              <div className={`${style['name']}`}>管理</div>
            </div>
            <div className={`${style['cards']} ${style['cards-img-1']}`}>
              <div className={`${style['num']}`}>16</div>
              <div className={`${style['name']}`}>待接收</div>
            </div>
            <div className={`${style['cards']} ${style['cards-img-1']}`}>
              <div className={`${style['num']}`}>16</div>
              <div className={`${style['name']}`}>审批中</div>
            </div>
          </div>
        </div>
        <div className={`${style['charts-area']}`}>
          <div className={`${style['common-wrap']}`}>
            <div className={`${style['title']}`}>标题3</div>
            <div className={`${style['common-content']}`}>
              <div ref={this.charts2} className={`${style['common-charts']}`} />
            </div>
          </div>
          <div className={`${style['common-wrap']}`}>
            <div className={`${style['title']}`}>标题2</div>
            <div className={`${style['common-content']}`}>
              <div ref={this.charts1} className={`${style['common-charts']}`} />
            </div>
          </div>
        </div>
        <div className={`${style['table-area']} ${style['common-wrap']}`}>
          <div className={`${style['title']}`}>标题4</div>
          <div className={`${style['common-content']}`}>
            <div className={`${style['btns-area']}`}>
              <Button type="primary" className={`${style['btns']}`}>
                创建项目
              </Button>
              <Button type="primary" className={`${style['btns']}`}>
                项目类型
              </Button>
              <Button type="primary" className={`${style['btns-type']}`}>
                按类型排序
              </Button>
              <Button type="primary" className={`${style['btns-time']}`}>
                按时间排序
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={dataSource}
              className={`${style['table']}`}
              pagination={{ pageSize: 8 }}
            />
          </div>
        </div>
      </div>
    );
});
export default Dalysy;

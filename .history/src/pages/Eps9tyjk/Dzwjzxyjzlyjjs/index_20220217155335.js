import { useEffect, useState, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import style from './index.less';
import * as echarts from 'echarts';
import { Table, Button, Modal, message, Progress, Icon } from 'antd';
import Column from './Column';
import Pie from './Pie';
import zlyjjsService from './service/YjjsService';
import ZlyjjsStore from '@/stores/dzwjzx/ZlyjjsStore';
import './Dajstype.less';
import SysStore from '@/stores/system/SysStore';

const Dajs = observer((props) => {
  const store = useLocalStore(() => ({
    recordsid: '1',
    sytjdata: [],
    dataSource: [],
    jszt:false,
    // 主表档案库信息
    columns: [
      {
        title: '状态',
        dataIndex: 'zt',
        align: 'center',
        width: 80,
      },
      {
        title: '单位名称',
        dataIndex: 'dwmc',
        width: 100,
      },
      {
        title: '标题',
        dataIndex: 'title',
        align: 'center',
        width: 140,
      },
      {
        title: '移交人',
        dataIndex: 'sqrmc',
        width: 90,
      },
      {
        title: '移交时间',
        dataIndex: 'sqsj',
      },
      {
        title: '移交审核人',
        dataIndex: 'yjshr',
        width: 90,
      },
      {
        title: '移交审核时间',
        dataIndex: 'yjshsj',
      },
      {
        title: '接收人',
        dataIndex: 'jsr',
        width: 90,
      },
      {
        title: '接收时间',
        dataIndex: 'jssj',
        align: 'center',
      },
      {
        title: '接收审核人',
        dataIndex: 'jsshr',
        align: 'center',
        width: 90,
      },
      {
        title: '接收审核时间',
        dataIndex: 'jsshsj',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'opt',
        align: 'center',
        fixed: 'right',
        width: 200,
        render: (key, item, index) => {
          debugger
          return (
            <div className={`${style['opts-area']}`}>
              <div
                className={`${style['guidang']} ${style['common']}`}
                onClick={() => showSxjction(item)}
              >
                四性
              </div>
              <div
                className={`${style['fenxiang']} ${style['common']}`}
                onClick={() => sjJsction(item)}
              >
                接收
              </div>
              <div
                className={`${style['fenxiang']} ${style['common']}`}
                onClick={() => jjdata(item.id)}
                // onClick={this.handleOpt.bind(this, 'delete', item)}
              >
                拒绝
              </div>
              <div className={`${style['chakan']} ${style['common']}`}>
                报表
              </div>
              {store.jszt  &&
                <div
                  className={`${style['chakan']} ${style['common']}`}
                  onClick={() => doDownloadAction(item)}
                >
                  下载
                </div>
              }
            </div>
          );
        },
      },
    ],
    async initSj() {
      const resBanner = await zlyjjsService.qureydajssytj();
      const ressj = await zlyjjsService.qureydajssj({
        zt: 'D',
        username: SysStore.getCurrentUser().yhmc,
      });
      this.sytjdata = resBanner;
      this.dataSource = ressj;
    },
  }));
  const [visible, setVisible] = useState(false);
  const doztAction = async (e) => {
    if(e==='Y'){
      store.jszt=true;
    }else{
      store.jszt=false;
    }
    const ressj = await zlyjjsService.qureydajssj({
      zt: e,
      username: SysStore.getCurrentUser().yhmc,
    });
    store.dataSource = ressj;
  };

  const handleCancel = async () => {
    setVisible(false);
    const ressj = await zlyjjsService.qureydajssj({
      zt: 'D',
      username: SysStore.getCurrentUser().yhmc,
    });
    store.dataSource = ressj;
  };

  const handleOk = async () => {
    setVisible(false);
    const ressj = await zlyjjsService.qureydajssj({
      zt: 'D',
      username: SysStore.getCurrentUser().yhmc,
    });
    store.dataSource = ressj;
  };

  const checkSxjc = () => {
    let timer = null;
    let newpprogressValue = 0;
    if (timer == null) {
      timer = setInterval(() => {
        newpprogressValue = ZlyjjsStore.progressValue + 10;
        // 这里的算法很重要，进度条容器的宽度为 400px 所以这里除以400再乘100就能得到 1-100的百分比了。
        if (ZlyjjsStore.progressValue === 20) {
          ZlyjjsStore.setTmmer(newpprogressValue);
          //  await fetch.post(`/api/eps/control/main/gszxyjsqd/duoJc`, fd);
          ZlyjjsStore.xduoJc(store.recordsid).then(() => {
            clearInterval(timer);
          });
        } else if (ZlyjjsStore.progressValue === 75) {
          clearInterval(timer);
        } else if (ZlyjjsStore.progressValue === 100) {
          clearInterval(timer);
        } else {
          ZlyjjsStore.setTmmer(newpprogressValue);
        }
      }, 900);
    }
  };

  const showSxjction = async (val) => {
    store.recordsid = val.id;
    var id = store.recordsid;
    if (id === '1') {
      message.warning({ type: 'warning', content: '请选择条目信息' });
    } else {
      ZlyjjsStore.progressValue = 0;
      ZlyjjsStore.jczt = false;
      ZlyjjsStore.opt = 'add';
      setVisible(true);
    }
  };

  const sjdata = async (val) => {
    const ressj = await zlyjjsService.sjdatajs({
      id: val,
      jsr: SysStore.getCurrentUser().yhmc,
      jsrid: SysStore.getCurrentUser().id,
      jsdwmc: SysStore.getCurrentCmp().mc,
      jsdw: SysStore.getCurrentCmp().id,
    });
    if (ressj.success) {
      message.success('成功');
    }
  };

  const jjdata = async (val) => {
    const ressj = await zlyjjsService.sjdatajj({
      id: val,
      jsr: SysStore.getCurrentUser().yhmc,
      jsrid: SysStore.getCurrentUser().id,
      jsdwmc: SysStore.getCurrentCmp().mc,
      jsdw: SysStore.getCurrentCmp().id,
    });
    if (ressj.success) {
      message.success('操作成功');
    }
  };

  const sjJsction = async (val) => {
    if (val.jczt === 'Y') {
      Modal.confirm({
        type: 'warning',
        title: `确定接收吗`,
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          sjdata(val.id);
        },
      });
    } else {
      message.warning({
        type: 'warning',
        content: '不能接收，需先进行四性检测！',
      });
    }
  };

  const doDownloadAction = (record) => {
    if (record.gsyjsqd_wpid === 'ZZZZ') {
      const params = {
        dakid: record.dakid,
        // tmid: "DAIM202004031357510010",
        sqdwmc: record.dwmc,
        id: record.id,
        xtname: SysStore.xtname,
      };
      ZlyjjsStore.xdownloadEEP(params);
    } else {
      message.warning({
        type: 'warning',
        content: '审批未结束无法下载！',
      });
    }
  };

  useEffect(() => {
    store.initSj();
  }, []);
  return (
    <>
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
            <div className={`${style['title']}`}>统计图</div>
            <div className={`${style['common-content']}`}>
              <Column />
            </div>
          </div>
          <div className={`${style['common-wrap']}`}>
            <div className={`${style['title']}`}>统计图</div>
            <div className={`${style['common-content']}`}>
              <Pie />
            </div>
          </div>
        </div>
        <div className={`${style['table-area']} ${style['common-wrap']}`}>
          <div className={`${style['title']}`}>信息列表</div>
          <div className={`${style['common-content']}`}>
            <div className={`${style['btns-area']}`}>
              <Button
                type="primary"
                className={`${style['btns']}`}
                onClick={() => doztAction('D')}
              >
                待接收
              </Button>
              <Button
                type="primary"
                className={`${style['btns']}`}
                onClick={() => doztAction('Y')}
              >
                已接收
              </Button>
              <Button
                type="primary"
                className={`${style['btns-type']}`}
                onClick={() => doztAction('Q')}
              >
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
      <Modal
        title="四性检测"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        //footer={null}
        width="1300px"
      >
        <div id="app" className="main-page">
          <div className="banner">
            <div className="inner">
              <div className="bottom">
                <div className="process">
                  <Progress
                    percent={ZlyjjsStore.progressValue}
                    progressive
                    shape="circle"
                    size="large"
                  />
                </div>
                <div className="steps">
                  <li
                    className={
                      ZlyjjsStore.progressValue > 10
                        ? 'first common on'
                        : 'first common'
                    }
                  >
                    <div className="node-d">
                      <span className="node">
                        <span className="el-icon-check"></span>
                      </span>
                      <img src="/api/eps/xsxjc/images/column-line.png"></img>
                      <span className="node-text">生成检测包</span>
                    </div>
                  </li>
                  <li
                    className={
                      ZlyjjsStore.progressValue > 30
                        ? 'second common on'
                        : 'second common'
                    }
                  >
                    <div className="node-d">
                      <span className="node">
                        <span className="el-icon-check"></span>
                      </span>
                      <img src="/api/eps/xsxjc/images/column-line.png"></img>
                      <span className="node-text">检测中</span>
                    </div>
                  </li>
                  <li
                    className={
                      ZlyjjsStore.progressValue > 80
                        ? 'third common on'
                        : 'third common'
                    }
                  >
                    <div className="node-d">
                      <span className="node">
                        <span className="el-icon-check"></span>
                      </span>
                      <img src="/api/eps/xsxjc/images/column-line.png"></img>
                      <span className="node-text">生成报告</span>
                    </div>
                  </li>
                  <li
                    className={
                      ZlyjjsStore.progressValue === 100
                        ? 'fourth common on'
                        : 'fourth common'
                    }
                  >
                    <div className="node-d">
                      <span className="node">
                        <span className="el-icon-check"></span>
                      </span>
                      <img src="/api/eps/xsxjc/images/column-line.png"></img>
                      <span className="node-text">完成</span>
                    </div>
                  </li>
                </div>
                <div className="btn-group">
                  <Button
                    type="primary"
                    loading={false}
                    onClick={checkSxjc}
                    disabled={ZlyjjsStore.opt === 'edit'}
                  >
                    开始检测
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="list-content">
            <div className="correct">
              <p className="label-btn">提醒</p>
              {ZlyjjsStore.jczt && (
                <div className="icon-style-demo">
                  <Icon
                    type="success"
                    style={{ color: '#1DC11D', marginRight: '10px' }}
                  />
                  <code style={{ color: '#1DC11D', marginRight: '10px' }}>
                    检测成功!
                  </code>
                </div>
              )}
              {!ZlyjjsStore.jczt && (
                <div className="icon-style-demo">
                  <code style={{ color: '#FF3333', marginRight: '10px' }}>
                    检测数量大可关闭界面,检测结束选择已填写的申请单继续完成步骤
                  </code>
                  <code style={{ color: '#FF3333', marginRight: '10px' }}>
                    {ZlyjjsStore.jcjg}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
});
export default Dajs;

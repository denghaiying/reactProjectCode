import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Icon, Search } from '@alifd/next';
import { observer } from 'mobx-react';
import echarts from 'echarts';
// 引入饼状图\线形图、柱状图
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import DochomeStore from '../../../stores/doc/DochomeStore';
import ContainerTitle from '../../../components/ContainerTitle';
import './index.scss';

/**
 * @Author: 徐香香
 * @Date: 2020-09-02
 * @content: 文档管理首页页面
 */

const Dochome = observer((props) => {
  const { intl: { formatMessage } } = props;
  const { Row, Col } = Grid;

  // 页面初始化
  useEffect(() => {
    doChartDownLeft();
    doChartDownRight();
  }, []);

  // 左下,文档服务启用情况
  const doChartDownLeft = () => {
    const myChart = echarts.init(document.getElementById('chart_down_left'));
    DochomeStore.setChartDownLeft(myChart);
  };
  // 右下,文档类型统计
  const doChartDownRight = () => {
    const myChart = echarts.init(document.getElementById('chart_down_right'));
    DochomeStore.setChartDownRight(myChart);
  };


  return (
    <div>
      <ContainerTitle title={formatMessage({ id: 'e9.doc.dochome.title' })} mainroute="/doccenter" />
      <div className="main-dochome">
        <div className="mainSecond-dochome">
          <Row >
            <Col span={16}>
              <div className="dochome-search">
                <div className="dochome-Title">
                  <div className="dochome-Font" >
                    {formatMessage({ id: 'e9.doc.dochome.search' })}
                  </div>
                </div>
                <Row >
                  <Col span={10} />
                  <Col>
                    <Row>
                      <Col span={12} style={{ color: '#1E90FF', fontSize: 17, textAlign: 'right', marginTop: 87, fontWeight: 'bold' }}>
                        {formatMessage({ id: 'e9.doc.dochome.wd' })}
                      </Col>
                      <Col span={6}>
                        <img width={25} height={25} alt="" src={[require('../../../styles/img/tsearch.png')]} style={{ marginLeft: 6, marginTop: 87 }} />
                      </Col>
                      <Col span={6} style={{ color: '#1E90FF', fontSize: 17, textAlign: 'left', marginTop: 87, fontWeight: 'bold' }}>
                        {formatMessage({ id: 'e9.doc.dochome.ss' })}
                      </Col>
                    </Row>
                  </Col>
                  <Col span={11} />
                </Row>
                <Row>
                  <Col>
                    <div style={{ width: '100%', textAlign: 'center', paddingTop: '1vh', height: 50, marginTop: 20 }}>
                      <Search type="primary"
                        size="medium"
                        hasIcon={false}
                        searchText={formatMessage({ id: 'e9.doc.dochome.wdss' })}
                        label={<Icon type="search" />}
                        placeholder={formatMessage({ id: 'e9.doc.dochome.ss' })}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col span={8}>
              <div className="dochome-use">
                <div className="dochome-Title">
                  <div className="dochome-Font" >
                    {formatMessage({ id: 'e9.doc.dochome.use' })}
                  </div>
                </div>
                <Row>
                  <Col sapn={12}>
                    <div className="dochome-space" >{formatMessage({ id: 'e9.doc.dochome.zkj' })}</div>
                  </Col>
                  <Col span={12}>
                    <div className="dochome-imgcardblue">
                      <div className="dochome-spacefont">200T</div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sapn={12}>
                    <div className="dochome-space" >{formatMessage({ id: 'e9.doc.dochome.yykj' })}</div>
                  </Col>
                  <Col span={12}>
                    <div className="dochome-imgcardorange">
                      <div className="dochome-spacefont">80T</div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sapn={12}>
                    <div className="dochome-space" >{formatMessage({ id: 'e9.doc.dochome.wykj' })}</div>
                  </Col>
                  <Col span={12}>
                    <div className="dochome-imgcardpurple">
                      <div className="dochome-spacefont">120T</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <div className="dochome-enable">
                <div className="dochome-Title">
                  <div className="dochome-Font" >
                    {formatMessage({ id: 'e9.doc.dochome.enable' })}
                  </div>
                </div>
                <Row>
                  <Col>
                    <div id="chart_down_left" style={{ height: '300px', marginTop: '64px' }} />
                  </Col>
                </Row>
              </div>
            </Col>
            <Col span={12}>
              <div className="dochome-type">
                <div className="dochome-Title">
                  <div className="dochome-Font" >
                    {formatMessage({ id: 'e9.doc.dochome.type' })}
                  </div>
                  <div id="chart_down_right" style={{ height: '380px', marginRight: '10px' }} />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div >
    </div >
  );
});

export default injectIntl(Dochome);

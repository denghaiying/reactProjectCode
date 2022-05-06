import React, { useEffect, useState } from 'react';
import { Button, Layout, message, Row, Col } from 'antd';
import { Space } from 'antd';
import { ReadOutlined, CarryOutFilled } from '@ant-design/icons';
import { Input } from 'antd';
import { Tabs } from 'antd';
import { observer } from 'mobx-react';
import './index.less';
import { runFunc } from '@/utils/menuUtils';
import DoctypeService from '../Doctype/Service/DoctypeService';
import FwService from './Service/FwService';
import SysStore from '@/stores/system/SysStore';
const { TabPane } = Tabs;

const Gwzx = observer((props) => {
  const userinfo = SysStore.getCurrentUser();

  //公文种类数据
  const [doctypeData, setDoctypeData] = useState([]);
  //发文数据
  const [fwdata, setFwdata] = useState([]);
  //发文总数
  const [fwCount, setFwCount] = useState(0);

  const [inputValue, setInputValue] = useState('');
  //tab的key值
  const [tabkey, setTabkey] = useState('1');

  useEffect(() => {
    initDatas();
  }, []);
  /**
   * 查询发文数据
   */
  const findFwData = (params) => {
    FwService.findAllData(params)
      .then((data: any) => {
        setFwCount(data.length);
        const list = data.slice(0, 5);
        setFwdata(list);
      })
      .catch((error) => {
        message.error(`查询出现错误：${error}`);
      });
  };

  const initDatas = () => {
    DoctypeService.findAllData({})
      .then((data: any) => {
        setDoctypeData(data);
      })
      .catch((error) => {
        message.error(`查询出现错误：${error}`);
      });
    findFwData({ wfawaiter: userinfo.yhmc });
  };

  /**
   * tab的改变事件
   * @param key
   */
  const callbackTab = (key: string) => {
    setTabkey(key);
  };

  const onSFWClick = (value: any) => {
    let mywindow = window.open(
      `/runRfunc/${value === 1 ? 'gwfw/form' : 'gwsw/form'}`,
    );
    if (mywindow) {
      mywindow.onload = () => {
        if (mywindow) {
          mywindow.document.title =
            value === 1 ? '新增-发文拟稿' : '新增-收文登记';
          mywindow.onunload = () => {
            console.log('onunload');
            initDatas();
          };
        }
      };
    }
  };
  /**
   * 点击了发文标题
   * @param record
   */
  const onTitleClick = (record) => {
    let mywindow = window.open(`/runRfunc/gwfw/form/${record.wfinst}`);
    if (mywindow) {
      mywindow.onload = () => {
        if (mywindow) {
          mywindow.document.title = record.title;
          mywindow.onunload = () => {
            initDatas();
          };
        }
      };
    }
  };
  /**
   * 搜索
   */
  const onSearchClick = () => {
    findFwData({ wfawaiter: userinfo.yhmc, title: inputValue });
  };
  //检索
  const onTitleChange = (e) => {
    setInputValue(e.target.value);
  };
  //更多跳转
  const onManyChange = () => {
    const params = {
      umid: tabkey === '1' ? 'GWGL003' : 'GWGL004',
      umname: tabkey === '1' ? '代办发文' : '代办收文',
      path: `/runRfunc/${tabkey === '1' ? 'gwfw' : 'gwsw'}`,
    };
    runFunc(params);
  };
  return (
    <div className="gw-box">
      <div className="gw-boxbox">
        {/* 顶部的标题和logo */}
        <div className="gw-dingbu">
          <div className="gw-dbBox">
            <div className="gw-ltbox">
              <div className="gw-logo">
                <Space>
                  <ReadOutlined className="gw-tb" />
                </Space>
              </div>
              <div className="gw-title">
                <p className="gw-titlea">公文中心</p>
              </div>
            </div>
          </div>
        </div>

        {/* 中间部分 */}
        <div className="gw-zj">
          <div className="gw-left">
            <div className="gw-btubox">
              {/* 第一行两个按钮 */}
              <div className="gw-btuboxbox">
                <Button className="gw-btua" onClick={() => onSFWClick(1)}>
                  发文拟稿
                </Button>
                <Button className="gw-btub" onClick={() => onSFWClick(2)}>
                  收文登记
                </Button>
              </div>
              {/* 分类 */}
              <div className="gw-fl">
                <div className="gw-fltle">
                  <span className="gw-zia">丨</span>
                  <span className="gw-zib">
                    按公文种类分类（{doctypeData.length}）
                  </span>
                </div>
                <Row>
                  {doctypeData.map((element, index) => (
                    <Col span={12} id={`${index}`}>
                      <Button className="gw-bta">
                        <span className="gwzia">{element.name}</span>
                        <span className="gwzib">1</span>
                      </Button>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </div>
          {/* 右边内容 */}
          <div className="gw-right">
            {/* 搜索框 */}
            <div className="gw-inp">
              <Input.Group compact>
                <Input
                  className="gw-inpa"
                  style={{ width: 'calc(50% - 200px)' }}
                  defaultValue=" "
                  placeholder="请输入标题"
                  onChange={onTitleChange}
                />
                <Button
                  type="primary"
                  className="gw-ina"
                  onClick={onSearchClick}
                >
                  搜索
                </Button>
                <Button type="primary" className="gw-inaa">
                  高级搜索
                </Button>
              </Input.Group>
            </div>

            {/* 下方tab切换内容 */}
            <div className="gw-tab">
              {/* 标题-待办公文 */}
              <div className="gw-taba">
                <div className="gw-tabaa">
                  <div className="gw-tblog">
                    {/* <CarryOutFilled /> */}
                    <Space>
                      <CarryOutFilled className="gw-tba" />
                      <p className="gw-tbtle">待办公文</p>
                    </Space>
                  </div>
                </div>
                {/* 更多 */}
                <div className="gw-tabtlegd">
                  <a href="#" onClick={onManyChange}>
                    更多
                  </a>
                </div>
              </div>

              {/* 切换 */}
              <div className="gw-tabnr">
                <div className="gw-tabnrbox">
                  <Tabs defaultActiveKey="1" onChange={callbackTab}>
                    <TabPane tab={`待办发文（${fwCount}）`} key="1">
                      {/* tab里的内容 */}
                      {fwdata.map((record: any, index) => (
                        <div className="gw-list" key={`tab${index}`}>
                          <div className="gwlistleft">
                            <span className="gwlistbtn">
                              {record.doctypename
                                ? record.doctypename
                                : '未设置'}
                            </span>
                          </div>
                          <div className="gwlistright">
                            <div className="gwlistrightnra">
                              <a href="#">
                                <p
                                  className="gwlistrightnrazi"
                                  onClick={() => onTitleClick(record)}
                                >
                                  {record.title}
                                </p>
                              </a>
                            </div>
                            <div className="gwlistrightnrb">
                              <span className="zia">
                                {record.cjr}
                                <span className="ziaa">
                                  {record.createTime}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabPane>
                    <TabPane tab="待办收文（0）" key="2">
                      内容2内容2内容2内容2内容2
                    </TabPane>
                    <TabPane tab="待办签报（0）" key="3">
                      内容3内容3内容3内容3内容3
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
export default Gwzx;

import React, {useEffect} from 'react';
import {Search, Tab, Input, Button, Form, DatePicker, Checkbox, Table, Pagination, Icon, Grid} from '@alifd/next';
import {injectIntl} from 'react-intl';
import {observer} from 'mobx-react';
import LoginStore from '../../../stores/system/LoginStore';
import Store from "../../../stores/datj/AccussusetjStore";
import './index.less'
import 'antd/dist/antd.css';

import { useIntl, FormattedMessage } from 'umi';
import ExportJsonExcel from 'js-export-excel';

const {Row, Col} = Grid;

const FormItem = Form.Item;
/**
 * @Author: Mr.Wang
 * @Date: 2019/9/16 15:45
 * @Version: 9.0
 * @Content:
 *    2019/12/10 王祥
 *    修改：
 *      1.状态组件由IceStore改成mobx
 *    2019/9/16 王祥
 *      新增代码
 */
const ArchiveInfo = observer(props => {
  //const {intl: {formatMessage}} = props;
  const {data, columns, loading, pageno, pagesize} = Store;
  const {userinfo} = LoginStore;
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = ((values) => {
    Store.setParams(values);
  });
  // end **************
  return (
      <div className="file-table">
        <Form inline style={{marginTop:"2px"}}>
          <FormItem label="年度:">
            <DatePicker name="ksrq"  placeholder="起始日期" />
          </FormItem>
          <FormItem label="至:">
            <DatePicker name="jsrq"  placeholder="结束日期" />
          </FormItem>
          <FormItem label=" ">
            <Form.Submit type="primary"  onClick={doSearchAction}>查询</Form.Submit>
          </FormItem>
        </Form>
        <div className="table-content">
          <div className="control">

          </div>
          <div className="out-table">
            <div className="table">
              <div className="row" key={1}>
                <div className="part1">
                  <p className="lg-p">本月档案利用接待人次</p>
                  <div className="flex">
                    <div className="left">
                      <div className="flex">
                        <p className="md-p"><b/>到馆<b/>总人数</p>
                        <p className="md-p"><input value={data.slcount} readOnly={true}></input></p>
                      </div>
                      <p className="sm-p">其<b/><b/>中</p>
                      <div className="flex">
                        <p className="column">共享平台</p>
                        <p className="column">12345</p>
                        <p className="column">公开信息</p>
                        <p className="column">国(境)外</p>
                      </div>
                    </div>
                    <div className="right flex">
                      <p className="column">电<b/><b/><b/><b/><b/><b/>话</p>
                      <p className="column">信<b/><b/><b/><b/><b/><b/>函</p>
                      <p className="column">其<b/><b/><b/><b/><b/><b/>他</p>
                    </div>
                  </div>
                  <div className="inputs">
                    <p className="sm-input"><input value="" readOnly={true}></input></p>
                    <p className="sm-input"><input value="" readOnly={true}></input></p>
                    <p className="sm-input"><input value="" readOnly={true}></input></p>
                    <p className="sm-input"><input value="" readOnly={true}></input></p>
                    <p className="sm-input"><input value="" readOnly={true}></input></p>
                    <p className="sm-input"><input value="" readOnly={true}></input></p>
                    <p className="sm-input"><input value="" readOnly={true}></input></p>
                  </div>
                </div>
                <div className="part2">
                  <p className="long-p">本月查阅利用档案目的</p>
                  <div className="second-p">
                    <p className="company">单<b/><b/>位</p>
                    <p className="person">个<b/><b/><b/><b/><b/><b/>人</p>
                  </div>
                  <div className="flex columns">
                    <p className="column">工<b/>作<b/>查<b/>考</p>
                    <p className="column">编<b/>史<b/>修<b/>志</p>
                    <p className="column">其<b/><b/><b/><b/><b/><b/><b/>他</p>
                    <p className="column">学<b/>术<b/>研<b/>究</p>
                    <p className="column">财<b/>产<b/>继<b/>承</p>
                    <p className="column">招<b/>工<b/>调<b/>动</p>
                    <p className="column">婚<b/>姻<b/>登<b/>记</p>
                    <p className="column">独<b/>生<b/>子<b/>女</p>
                    <p className="column">职<b/>称<b/>评<b/>定</p>
                    <p className="column">退<b/>休<b/>供<b/>养</p>
                    <p className="column">工<b/>龄<b/>购<b/>房</p>
                    <p className="column">其<b/><b/><b/><b/><b/><b/><b/>他</p>
                  </div>
                  <div className="inputs">
                    <p className="sm-input"><input value={data.dwgzkc} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.dwbsxz} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.dwqt} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.grxsyj} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.grccjc} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.grzgdd} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.grhydj} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.grdszv} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.grzcpd} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.grtxgy} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.grgngf} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.grqt} readOnly={true}></input></p>
                  </div>
                </div>
                <div className="part3">
                  <p className="long-p">本月查阅利用档案数量（卷、件、册等）</p>
                  <div className="second-p">
                    <div className="left">
                      <div className="flex">
                        <p className="history">历史档案</p>
                        <p className="now">现行档案</p>
                      </div>
                      <div className="flex">
                        <div className="third-left">
                          <div className="flex">
                            <p className="md-p">文书</p>
                            <p className="md-p">其他</p>
                            <p className="md-p">文书</p>
                          </div>
                          <div className="flex">
                            <p className="column">电<b/><b/><b/><b/>子</p>
                            <p className="column">实<b/><b/><b/><b/>体</p>
                            <p className="column">电<b/><b/><b/><b/>子</p>
                            <p className="column">实<b/><b/><b/><b/>体</p>
                            <p className="column">电<b/><b/><b/><b/>子</p>
                            <p className="column">实<b/><b/><b/><b/>体</p>
                          </div>
                        </div>
                        <div className="third-center flex">
                          <p className="column">声<b/><b/><b/><b/><b/><b/><b/>像</p>
                          <p className="column">公<b/>开<b/>信<b/>息</p>
                          <p className="column">共<b/>享<b/>平<b/>台</p>
                        </div>
                        <div className="third-right">
                          <p className="md-p">其他</p>
                          <div className="flex">
                            <p className="column">电<b/><b/><b/><b/>子</p>
                            <p className="column">实<b/><b/><b/><b/>体</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="right">
                      <p className="column">资<b/><b/><b/><b/><b/><b/><b/><b/>料</p>
                    </div>
                  </div>
                  <div className="inputs">
                    <p className="sm-input"><input value={data.lswsdz} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.lswsst} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.lsqtdz} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.lsqtst} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.xxwsdz} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.xxwsst} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.xxsx} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.xxgkxx} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.xxgxpt} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.xxqtdz} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.xxqtst} readOnly={true}></input></p>
                    <p className="sm-input"><input value="0" readOnly={true}></input></p>
                  </div>
                </div>
                <div className="part4">
                  <p className="double-p">本月利用提供取证数量（页、幅、张等）</p>
                  <div className="flex">
                    <p className="column">复<b/><b/><b/><b/>印</p>
                    <p className="column">打<b/><b/><b/><b/>印</p>
                    <p className="column">翻<b/><b/><b/><b/>拍</p>
                    <p className="column">扫<b/><b/><b/><b/>描</p>
                    <p className="column">下<b/><b/><b/><b/>载</p>
                    <p className="column">刻<b/><b/><b/><b/>盘</p>
                  </div>
                  <div className="inputs">
                    <p className="sm-input"><input value={data.fyys} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.dyys} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.fbys} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.zcys} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.xzwjs} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.kpzs} readOnly={true}></input></p>
                  </div>
                </div>
                <div className="part5">
                  <p className="double-p">备注</p>
                  <p className="remark-input"><textarea rows="8"></textarea></p>
                </div>
              </div>
              <div className="row" key={2}>
                <div className="part1">
                  <p className="lg-p">去年同期档案利用接待人次</p>
                  <div className="flex">
                    <div className="left">
                      <div className="flex">
                        <p className="md-p"><b/>到馆<b/>总人数</p>
                        <p className="md-p"><input value={data.qnslcount} readOnly={true}></input></p>
                      </div>
                      <p className="sm-p">其<b/><b/>中</p>
                      <div className="flex">
                        <p className="column">共享平台</p>
                        <p className="column">12345</p>
                        <p className="column">公开信息</p>
                        <p className="column">国(境)外</p>
                      </div>
                    </div>
                    <div className="right flex">
                      <p className="column">电<b/><b/><b/><b/><b/><b/>话</p>
                      <p className="column">信<b/><b/><b/><b/><b/><b/>函</p>
                      <p className="column">其<b/><b/><b/><b/><b/><b/>他</p>
                    </div>
                  </div>
                  <div className="inputs">
                    <p className="sm-input"><input value="" readOnly={true}></input></p>
                    <p className="sm-input"><input value="" readOnly={true}></input></p>
                    <p className="sm-input"><input value="" readOnly={true}></input></p>
                    <p className="sm-input"><input value="" readOnly={true}></input></p>
                    <p className="sm-input"><input value="" readOnly={true}></input></p>
                    <p className="sm-input"><input value="" readOnly={true}></input></p>
                    <p className="sm-input"><input value="" readOnly={true}></input></p>
                  </div>
                </div>
                <div className="part2">
                  <p className="long-p">去年同期查阅利用档案目的</p>
                  <div className="second-p">
                    <p className="company">单<b/><b/>位</p>
                    <p className="person">个<b/><b/><b/><b/><b/><b/>人</p>
                  </div>
                  <div className="flex columns">
                    <p className="column">工<b/>作<b/>查<b/>考</p>
                    <p className="column">编<b/>史<b/>修<b/>志</p>
                    <p className="column">其<b/><b/><b/><b/><b/><b/><b/>他</p>
                    <p className="column">学<b/>术<b/>研<b/>究</p>
                    <p className="column">财<b/>产<b/>继<b/>承</p>
                    <p className="column">招<b/>工<b/>调<b/>动</p>
                    <p className="column">婚<b/>姻<b/>登<b/>记</p>
                    <p className="column">独<b/>生<b/>子<b/>女</p>
                    <p className="column">职<b/>称<b/>评<b/>定</p>
                    <p className="column">退<b/>休<b/>供<b/>养</p>
                    <p className="column">工<b/>龄<b/>购<b/>房</p>
                    <p className="column">其<b/><b/><b/><b/><b/><b/><b/>他</p>
                  </div>
                  <div className="inputs">
                    <p className="sm-input"><input value={data.qndwgzkc} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qndwbsxz} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qndwqt} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qngrxsyj} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qngrccjc} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qngrzgdd} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qngrhydj} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qngrdszv} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qngrzcpd} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qngrtxgy} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qngrgngf} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qngrqt} readOnly={true}></input></p>
                  </div>
                </div>
                <div className="part3">
                  <p className="long-p">去年同期查阅利用档案数量（卷、件、册等）</p>
                  <div className="second-p">
                    <div className="left">
                      <div className="flex">
                        <p className="history">历史档案</p>
                        <p className="now">现行档案</p>
                      </div>
                      <div className="flex">
                        <div className="third-left">
                          <div className="flex">
                            <p className="md-p">文书</p>
                            <p className="md-p">其他</p>
                            <p className="md-p">文书</p>
                          </div>
                          <div className="flex">
                            <p className="column">电<b/><b/><b/><b/>子</p>
                            <p className="column">实<b/><b/><b/><b/>体</p>
                            <p className="column">电<b/><b/><b/><b/>子</p>
                            <p className="column">实<b/><b/><b/><b/>体</p>
                            <p className="column">电<b/><b/><b/><b/>子</p>
                            <p className="column">实<b/><b/><b/><b/>体</p>
                          </div>
                        </div>
                        <div className="third-center flex">
                          <p className="column">声<b/><b/><b/><b/><b/><b/><b/>像</p>
                          <p className="column">公<b/>开<b/>信<b/>息</p>
                          <p className="column">共<b/>享<b/>平<b/>台</p>
                        </div>
                        <div className="third-right">
                          <p className="md-p">其他</p>
                          <div className="flex">
                            <p className="column">电<b/><b/><b/><b/>子</p>
                            <p className="column">实<b/><b/><b/><b/>体</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="right">
                      <p className="column">资<b/><b/><b/><b/><b/><b/><b/><b/>料</p>
                    </div>
                  </div>
                  <div className="inputs">
                    <p className="sm-input"><input value={data.qnlswsdz} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qnlswsst} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qnlsqtdz} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qnlsqtst} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qnxxwsdz} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qnxxwsst} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qnxxsx} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qnxxgkxx} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qnxxgxpt} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qnxxqtdz} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qnxxqtst} readOnly={true}></input></p>
                    <p className="sm-input"><input value="0" readOnly={true}></input></p>
                  </div>
                </div>
                <div className="part4">
                  <p className="double-p">去年同期利用提供取证数量（页、幅、张等）</p>
                  <div className="flex">
                    <p className="column">复<b/><b/><b/><b/>印</p>
                    <p className="column">打<b/><b/><b/><b/>印</p>
                    <p className="column">翻<b/><b/><b/><b/>拍</p>
                    <p className="column">扫<b/><b/><b/><b/>描</p>
                    <p className="column">下<b/><b/><b/><b/>载</p>
                    <p className="column">刻<b/><b/><b/><b/>盘</p>
                  </div>
                  <div className="inputs">
                    <p className="sm-input"><input value={data.qnfyys} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qndyys} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qnfbys} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qnzcys} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qnxzwjs} readOnly={true}></input></p>
                    <p className="sm-input"><input value={data.qnkpzs} readOnly={true}></input></p>
                  </div>
                </div>
                <div className="part5">
                  <p className="double-p">备注</p>
                  <p className="remark-input"><textarea rows="8"></textarea></p>
                </div>
              </div>
              <div className="intro">
                <p>1. 为进一步规范我市各级综合档案馆查档利用服务工作，根据国家档案局档案事业统计年报的填报内容，综合我市日常查档服务工作制定本表；</p>
                <p>2. 本表于2018年7月启用，各市档案馆需于每月前五个工作日内完成统计上报工作，该项工作将纳入相关考核项目；</p>
                <p>3. 报送方式：传真68781999或邮箱301071920@qq.com，联系人：金善、吕美勇，联系电话：68782000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

  );
});

export default ArchiveInfo;

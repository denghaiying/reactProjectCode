import React from 'react';
import Layout from '../layout/index';
import { Search, Tab, Input, Button, Form, DatePicker, Checkbox, Icon, Grid,TreeSelect , Switch,Select, Field, Notification } from '@alifd/next';
import {  injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import Store from "../../../stores/datj/DacltjStore";
import SearchStore from "../../../stores/datj/SearchStore";
import { Typography } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import ExportJsonExcel from 'js-export-excel';


const { Row, Col } = Grid;

const FormItem = Form.Item;
const { Text } = Typography;

const tjxsdataSource = [
  {
  value: "dwsx",
  label: "单位名称"
}, {
  value: "daklbsx",
  label: "档案库类别"
} ,{
  value: "daksx",
  label: "档案库名称"
}, {
  value: "daklxsx",
  label: "档案库类型"
}, {
  value: "tmztsx",
  label: "档案库状态"
}, {
  value: "ndsx",
  label: "年度"
}, {
  value: "bgqxsx",
  label: "保管期限"
}, {
  value: "gdrmcsx",
  label: "归档人"
}];

/**
 * 查询条件按钮点击事件
 * @param {*} values
 * @param {*} errors
 */
  const doSearchAction = ((values) => {
  var df=true;
  if(values){
    ;
    var ks=values["ndksrq"];
    var js=values["ndjsrq"];
    if(js==undefined){
      js="";
    }

    if(ks==undefined){
      ks="";
    }
    if ((ks == "" && js != "") || (ks != "" && js == "")) {
      openNotification('年度需输入起止日期', 'warning');
      df=false;

    }
    if (Date.parse(ks) - Date.parse(js) > 0) {
      openNotification('起始年度要在结束年度之前', 'warning');
      df=false;
    }
  }
  if(df) {
    Store.setParams(values);
  }
});


function handleChange(value) {
  value= value.join();
 console.log(value);
}


const daklxDataSource=[{
  value: "01",
  label: "一文一件"
}, {
  value: "02",
  label: "传统立卷"
}, {
  value: "0201",
  label: "卷内"
}];


const handledwChange=(value) =>{

  SearchStore.dwChange(value);
}

const handledakChange=(value) =>{
  this.setState({dakid: value});
}


const summaryColumn = [{
  title: "条目数量",
  dataIndex: "tms",
  width: 200,
  lock: true
},
{
  title: "原文数量",
  dataIndex: "fjs",
  width: 250
}, {
  title: "页数",
  dataIndex: 'ys',
  width: 200,
}]

const Datjzs =  observer(props => {
 // const { intl: { formatMessage } } = props;
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  const field = Field.useField();
  return (
    <div>
      <Layout summaryColumn={summaryColumn} store={Store}>
        <div search="true">
        <Form inline style={{marginTop:"15px"}} >
        <Row gutter="10">
            <Col >
              <FormItem   label="单位名称：" labelTextAlign="right" labelAlign="left">
              <Select  style={{width: 200}} name="dw" mode="multiple"
                  placeholder={formatMessage({ id: 'e9.datj.select' })}
                  onChange={handledwChange}
                  dataSource={SearchStore.dwDataSource}
                  defaultValue={SysStore.getCurrentUser().dwid}
                  >
            </Select>
              </FormItem>

              <FormItem   label="档案库类型：" labelAlign="left">
                <Select  style={{width: 200}} name="daklx" mode="multiple"
                placeholder={formatMessage({ id: 'e9.datj.select' })}
                    onChange={handledwChange}
                    dataSource={daklxDataSource}
                    >
              </Select>
              </FormItem>
              <FormItem   label="档案库状态：" labelAlign="left" labelTextAlign="right">
              <Select   name="tmzt" style={{width: 200}} placeholder={formatMessage({ id: 'e9.datj.select' })}  mode="multiple">
                  <Option value="1">文件收集</Option>
                  <Option value="2">文件整理</Option>
                  <Option value="3">档案管理</Option>
              </Select>
              </FormItem>
              </Col>
              </Row>
              <Row gutter="10">
              <Col>
              <FormItem   label="保管期限：" labelAlign="left">
              <Select  style={{width: 200}} name="bgqx" mode="multiple"
                placeholder={formatMessage({ id: 'e9.datj.select' })}
                dataSource={SearchStore.bgqxDataSource} onChange={handleChange}
                  >
            </Select>
          </FormItem>
              <FormItem label="档案库名称：" labelAlign="left">
              <TreeSelect {...field.init('dakid', {})}  placeholder={formatMessage({ id: 'e9.datj.select' })}
              hasClear name="dakid"   treeCheckable  dataSource={SearchStore.dakDataSource}   style={{width: 200}}/>
              </FormItem>
              <FormItem   label="起始年度：" labelAlign="left" hasFeedback >
                <FormItem>
                  <Input name="ndksrq" style={{width: 200}} placeholder="请输入起始年度"/>
                </FormItem>
                <FormItem><div className="abc">至：</div></FormItem>
                <FormItem >
                  <Input name="ndjsrq" style={{width: 200}} placeholder="请输入结束年度" />
                </FormItem>
              </FormItem>
              </Col>
              </Row>
              <Row gutter="10">
              <Col>
              <FormItem   label="统计显示：" labelAlign="left">
              <Select  style={{width: 200}} name="tjxs" mode="multiple"
              placeholder={formatMessage({ id: 'e9.datj.select' })}
                  dataSource={tjxsdataSource}
                  >
            </Select>
              </FormItem>

              <FormItem label="显示类型：" labelAlign="left">
                <Select   style={{width: 200}} defaultValue="tjlb"  name="xslx" placeholder={formatMessage({ id: 'e9.datj.select' })}>
                    <Option value="tjlb">统计列表</Option>
                </Select>
              </FormItem>
              <FormItem label=" " labelAlign="left">
                  <Form.Submit type="primary" onClick={doSearchAction}>{formatMessage({ id: 'e9.btn.search' })}</Form.Submit>
              </FormItem>
          </Col>
        </Row>
       </Form>
        </div>
        <div contextAction="true">
          <div className="btns-control">
              <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" />
              </Button>
              <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.preview" />
              </Button>
              <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" />
              </Button>
              <Button type="primary" style={{ marginRight: 10 }}><Icon type="download" /><FormattedMessage id="e9.btn.file.export.excel" />
              </Button>
              <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.help" />
              </Button>
          </div>
        </div>
      </Layout>
    </div>
  );
})

export default Datjzs;

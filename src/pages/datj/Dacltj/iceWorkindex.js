/*
import React, { useEffect } from 'react';
import { Search, Tab, Input, Button, Form, DatePicker, Checkbox, Table, Pagination, Icon, Grid,Tree,TreeSelect , Switch,Select, Field } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
 import ContainerTitle from '../../../components/ContainerTitle';
import LoginStore from '../../../stores/system/LoginStore';
import Store from "../../../stores/datj/DacltjStore";
import E9Config from '../../../utils/e9config';
import './index.less';
import SearchStore from "../../../stores/datj/SearchStore";

const { Row, Col } = Grid;

const FormItem = Form.Item;
/!**
 * @Author: Mr.Wang
 * @Date: 2019/9/16 15:45
 * @Version: 9.0
 * @Content:
 *    2019/12/10 王祥
 *    修改：
 *      1.状态组件由IceStore改成mobx
 *    2019/9/16 王祥
 *      新增代码
 *!/
const Dacltj = observer(props => {
  const { intl: { formatMessage } } = props;
  const { data, columns, loading, pageno, pagesize,queryData } = Store;
  const { userinfo } = LoginStore;
  const field = Field.useField();
  const Option = Select.Option;
  const TreeNode = TreeSelect.Node;

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


  
  useEffect(() => {
    Store.setColumns([{
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
    }]);
    SearchStore.queryDw();
    SearchStore.queryBgqx();
  }, []);




  // begin ******************** 以下是事件响应
  /!**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   *!/
  const doSearchAction = ((values) => {     
    Store.setParams(values);
  });


  function handleChange(value) {
     value= value.join();
    console.log(value);
}


  /!**
   * 分页器，切换页数
   * @param {*} current
   *!/
  const onPaginationChange = ((current) => {
    Store.setPageNo(current);
  });

  /!**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   *!/
  const onPageSizeChange = ((pageSize) => {
    Store.setPageSize(pageSize);
  });

  /!**
   * 最后一列操作列绘制修改 删除按钮
   * @param {*} value
   * @param {*} index
   * @param {*} record
   *!/
  const renderTableCell = (value, index, record) => {
    return (
      <div>
        <a href="javascript:;" onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>
        <a href="javascript:;" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.id)}><FormattedMessage id="e9.btn.delete" /></a>
      </div>);
  };

  /!**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   *!/
  const onTableRowChange = (selectedRowKeys, records) => {
    Store.setSelectRows(selectedRowKeys, records);
  };

  const handledwChange=(value) =>{
   
    SearchStore.dwChange(value);
    console.log(SearchStore.dakDataSource);
}

  const handledakChange=(value) =>{
    this.setState({dakid: value});
    console.log(this.state.dwid, value);
}


  // end ********************

  // begin *************以下是自定义函数区域


  // end **************
  return (
    <div className="hall-regist">
      <div className="control">
        
        <Form inline style={{marginTop:"15px"}}>
        <FormItem   label="单位：">
        <Select  style={{width: 200}} name="dw" mode="multiple"
            placeholder={formatMessage({ id: 'e9.datj.select' })}
            onChange={handledwChange}
            dataSource={SearchStore.dwDataSource} 
            >
      </Select>
        </FormItem>

        <FormItem   label="档案库类型：">
          <Select  style={{width: 200}} name="daklx" mode="multiple"
          placeholder={formatMessage({ id: 'e9.datj.select' })}
              onChange={handledwChange}
              dataSource={daklxDataSource} 
              >
        </Select>
        </FormItem>

        <FormItem   label="保管期限：">
        <Select  style={{width: 200}} name="bgqx" mode="multiple"
          placeholder={formatMessage({ id: 'e9.datj.select' })}
          dataSource={SearchStore.bgqxDataSource} onChange={handleChange}
            >
      </Select>
        </FormItem>

        <FormItem   label="档案库状态：">
        <Select   name="tmzt" style={{width: 200}} placeholder={formatMessage({ id: 'e9.datj.select' })}  mode="multiple">
            <Option value="1">文件收集</Option>
            <Option value="2">文件整理</Option>
            <Option value="3">档案管理</Option>
        </Select>
        </FormItem>
        
        <FormItem label="档案库名称:" >
        <TreeSelect {...field.init('dakid', {})}  placeholder={formatMessage({ id: 'e9.datj.select' })}
        hasClear name="dakid"   treeCheckable  dataSource={SearchStore.dakDataSource}   style={{width: 200}}/>
        </FormItem>

        <FormItem   label="年度：">
          <Input name="ndksrq" style={{width: 200}} placeholder="请输入编号"/> 至： <Input name="ndjsrq" style={{width: 200}} placeholder="请输入编号"/>
        </FormItem>

        <FormItem   label="统计显示：">
        <Select  style={{width: 200}} name="tjxs" mode="multiple"
        placeholder={formatMessage({ id: 'e9.datj.select' })}
            dataSource={tjxsdataSource} 
            >
      </Select>
        </FormItem>

        <FormItem label="显示类型:" >
          <Select   style={{width: 200}} defaultValue="tjlb"  name="xslx" placeholder={formatMessage({ id: 'e9.datj.select' })}>
              <Option value="tjlb">统计列表</Option>
          </Select>
        </FormItem>

          <FormItem label=" ">
              <Form.Submit type="primary" onClick={doSearchAction}>{formatMessage({ id: 'e9.btn.search' })}</Form.Submit>
          </FormItem>
        </Form>
        
      </div>
      <div className="main-content">
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
        <div className="table-container">
        <Table
              tableLayout="fixed"
                isZebra={true}
              // $work-context-heigth-41px, 41px为表头高度
              maxBodyHeight="calc(100vh - 259px)"
              dataSource={data.results}
              fixedHeader
              loading={loading}
            >
            {columns.map(col =>
              <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
            )}
          </Table>
        </div>
      </div>
    </div>

  );
});

export default injectIntl(Dacltj);*/

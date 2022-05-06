import React, { useEffect } from 'react';
import { Search, Tab, Input, Button, Form, DatePicker, Checkbox, Pagination, Icon, Grid,Tree,TreeSelect , Switch,Select, Field, Notification } from '@alifd/next';
import {  injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
 import ContainerTitle from '../../../components/ContainerTitle';
import LoginStore from '../../../stores/system/LoginStore';
import Store from "../../../stores/datj/Kfaqtj";
import E9Config from '../../../utils/e9config';

import 'antd/dist/antd.css';
import '../style/index.less';
import '../style/search.less'
import SearchStore from "../../../stores/datj/SearchStore";
import { Table, Typography } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import ExportJsonExcel from 'js-export-excel';


const { Row, Col } = Grid;

const FormItem = Form.Item;
const { Text } = Typography;

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
const Kfaqtj = observer(props => {
 // const { intl: { formatMessage } } = props;
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  const { data, columns, loading, pageno, pagesize,queryData } = Store;
  const { userinfo } = LoginStore;
  const field = Field.useField();
  const Option = Select.Option;
  const TreeNode = TreeSelect.Node;

  const searchStyle = {
    marginTop:"15px",
    padding: '20px',

};

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
        title: "月份",
        dataIndex: "yf",
        key:"yf",
        width: 100,
        lock: true,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.yf - b.yf,
    },
    {
        title: "遗失",
        dataIndex: "ys",
        key:"ys",
        width: 120,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.ys - b.ys,
    }, {
        title: "错位",
        dataIndex: 'cw',
        key:"cw",
        width: 120,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.cw - b.cw,
    },
    {
        title: "褪变",
        dataIndex: "tb",
        key:"tb",
        width: 120,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.tb - b.tb,
    }, {
        title: "脆黄",
        dataIndex: 'ch',
        key:"ch",
        width: 120,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.ch - b.ch,
    },
        {
            title: "破损",
            dataIndex: "ps",
            key:"ps",
            width: 120,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.ps - b.ps,
        }, {
            title: "虫蛀",
            dataIndex: 'cz',
            key:"cz",
            width: 120,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.cz - b.cz,
        },
        {
            title: "霉变",
            dataIndex: "mb",
            key:"mb",
            width: 120,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.mb - b.mb,
        }, {
            title: "其它",
            dataIndex: 'qt',
            key:"qt",
            width: 120,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.qt - b.qt,
        }]);

  }, []);



  const openNotification = (a,type) => { Notification.open({ title: a, type, }); };
  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = ((values) => {
      var df=true;
      if(values){
          ;
          var ks=values["nd"];

          if(ks==undefined){
              ks="";
          }
          if (ks == "" ) {
              openNotification('请输入年度！', 'warning');
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


  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    Store.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    Store.setPageSize(pageSize);
  });

  /**
   * 最后一列操作列绘制修改 删除按钮
   * @param {*} value
   * @param {*} index
   * @param {*} record
   */
  const renderTableCell = (value, index, record) => {
    return (
      <div>
        <a href="javascript:;" onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>
        <a href="javascript:;" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.id)}><FormattedMessage id="e9.btn.delete" /></a>
      </div>);
  };

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
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
  const downloadFileToExcel = (() => {
 
    const  getRepaymentPlanList  = data.results;  //获取数据源
		let option = {};  //option代表的就是excel文件
		let dataTable = [];  //excel文件中的数据内容
		if (getRepaymentPlanList && getRepaymentPlanList.length > 0) {
      let tys= 0 ;  
      let tcw= 0 ;  
      let ttb= 0 ;  
      let tch= 0 ;  
      let tps= 0 ;  
      let tcz= 0 ;  
      let tmb= 0 ;  
      let tqt= 0 ;  
			for (let i in getRepaymentPlanList) {  //循环获取excel中每一行的数据
	//			let _planDay = formatTime(getRepaymentPlanList[i].planDay, true);  //格式化日期（自定义方法）
				let obj = {
           			'月份': getRepaymentPlanList[i].yf,
           			'遗失': getRepaymentPlanList[i].ys,
           			'错位': getRepaymentPlanList[i].cw,
           			'褪变': getRepaymentPlanList[i].tb,
           			'脆黄': getRepaymentPlanList[i].ch,
                '破损': getRepaymentPlanList[i].ps,
           			'虫蛀': getRepaymentPlanList[i].cz,
           			'霉变': getRepaymentPlanList[i].mb,
           			'其它': getRepaymentPlanList[i].qt,
            	}
            	dataTable.push(obj);  //设置excel中每列所获取的数据源
              tys += getRepaymentPlanList[i].ys;
              tcw += getRepaymentPlanList[i].cw;
              ttb += getRepaymentPlanList[i].tb;
              tch += getRepaymentPlanList[i].ch;
              tps += getRepaymentPlanList[i].ps;
              tcz += getRepaymentPlanList[i].cz;
              tmb += getRepaymentPlanList[i].mb;
              tqt += getRepaymentPlanList[i].qt;
        }
        let tobj = {

          '遗失': '遗失总计：'+ tys,
          '错位': '错位总计：'+ tcw,
          '褪变': '褪变总计：'+ ttb,
          '脆黄': '脆黄总计：'+ tch,
          '破损': '破损总计：'+ tps,
          '虫蛀': '虫蛀总计：'+ tcz,
          '霉变': '霉变总计：'+ tmb,
          '其它': '其它总计：'+ tqt,
       }
       dataTable.push(tobj);  //设置excel中总计的数据源
    }
        option.fileName = '库房安全统计';  //excel文件名称
        option.datas = [
      		{
        		sheetData: dataTable,  //excel文件中的数据源
        		sheetName: '库房安全统计',  //excel文件中sheet页名称
        		sheetFilter: ['月份','遗失','错位','褪变','脆黄','破损','虫蛀','霉变','其它',],  //excel文件中需显示的列数据
        		sheetHeader: ['月份','遗失','错位','褪变','脆黄','破损','虫蛀','霉变','其它',],  //excel文件中每列的表头名称
      		}
    	]
    	let toExcel = new ExportJsonExcel(option);  //生成excel文件
    	toExcel.saveExcel();  //下载excel文件
  });


  // begin *************以下是自定义函数区域


  // end **************
  return (
    <div className="hall-regist">
      <div className="control">

          <Form inline style={{marginTop:"15px"}} >

              <FormItem   label="年度：" labelAlign="left" hasFeedback >
                  <Input name="nd" style={{width: 200}} placeholder="请输入年度"/>
              </FormItem>
              <FormItem label="显示类型：" labelAlign="left">
                  <Select   style={{width: 200}} defaultValue="tjlb"  name="xslx" placeholder={formatMessage({ id: 'e9.datj.select' })}>
                      <Option value="tjlb">统计列表</Option>
                  </Select>
              </FormItem>
              <FormItem label=" " labelAlign="left">
                  <Form.Submit type="primary" onClick={doSearchAction}>{formatMessage({ id: 'e9.btn.search' })}</Form.Submit>
              </FormItem>
          </Form>

      </div>
      <div className="main-content">
        <div className="btns-control">
             {/* <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" />
             </Button>
             <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.preview" />
             </Button>
             <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" />
             </Button> */}
             <Button type="primary" style={{ marginRight: 10 }} onClick={downloadFileToExcel}><Icon type="download" /><FormattedMessage id="e9.btn.file.export.excel" />
             </Button>
             {/* <Button type="primary" style={{ marginRight: 10 }}><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.help" />
             </Button> */}

        </div>
        <div className="table-container">
        <Table
        columns={columns}
        dataSource={data.results}
        pagination={false}
        rowkey="id"
        bordered
        summary={pageData => {
            let ystotal = 0;
                let cwtotal = 0;
                let tbtotal = 0;
                let chtotal = 0;
                let pstotal = 0;
                let cztotal = 0;
                let mbtotal = 0;
                let qttotal = 0;

          pageData.forEach(({ ys,cw,tb,ch,ps,cz,mb,qt }) => {
              ystotal += ys;
              cwtotal +=cw;
              tbtotal +=tb;
              chtotal +=ch;
              pstotal +=ps;
              cztotal +=cz;
              mbtotal +=mb;
              qttotal +=qt;
          });
          return (
            <>
              <Table.Summary.Row >
                <Table.Summary.Cell  colSpan={2} className="textAlignRight">
                  <Text >遗失总计：{ystotal} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>错位总计：{cwtotal}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>褪变总计：{tbtotal}</Text>
                </Table.Summary.Cell>
                  <Table.Summary.Cell>
                      <Text>脆黄总计：{chtotal}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                      <Text>破损总计：{pstotal}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                      <Text>虫蛀总计：{cztotal}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                      <Text>霉变总计：{mbtotal}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                      <Text>其它总计：{qttotal}</Text>
                  </Table.Summary.Cell>
              </Table.Summary.Row>

            </>
          );
        }}
      />
        </div>
      </div>
    </div>

  );
});

export default Kfaqtj;

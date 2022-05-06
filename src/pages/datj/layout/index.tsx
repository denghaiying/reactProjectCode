import React, { useEffect } from 'react';
import { Form, Grid,TreeSelect ,Select, Field, Notification } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import LoginStore from '../../../stores/system/LoginStore';
// 
import BaseStore from '../../../stores/BaseStore.js'

import 'antd/dist/antd.css';
import './index.less';
import SearchStore from "../../../stores/datj/SearchStore";
import { Table, Typography } from 'antd';
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
export interface IReport {
  propes: any;
  summaryColumn?: Array<Object>;
  intl?: Object;
  store: BaseStore;
  children: any;
}



const Dacltj = observer((params: IReport) => {
  const { intl: { formatMessage }, summaryColumn, store } = params;
  const { data, columns, loading, pageno, pagesize } = store;
  const { userinfo } = LoginStore;
  const field = Field.useField();
  const Option = Select.Option;
  const TreeNode = TreeSelect.Node;

  const isArray = Array.isArray(params?.children) 
  const search = isArray && params.children.map(child => {
    if (child.props.search)
      return child;
    return <></>
  })
  const contextAction = isArray && params.children.map(child => {
    if (child.props?.contextAction)
      return child;
  })


  const searchStyle = {
    marginTop:"15px",
    padding: '20px',

    };
  useEffect(() => {
    store.setColumns(summaryColumn);
    SearchStore.queryDw();
    SearchStore.queryBgqx();
    SearchStore.queryDak();
  }, []);



  const openNotification = (a,type) => { Notification.open({ title: a, type, }); };
  // begin ******************** 以下是事件响应

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    store.setPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    store.setPageSize(pageSize);
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
    store.setSelectRows(selectedRowKeys, records);
  };

  const renderSummay = (summaryCloumn:Object[]) => {
    if (summaryCloumn) {
      const colcount = summaryCloumn.length +1
      return (
        <Table.Summary.Row >
          {
            summaryCloumn.map((data, index) => {
              <Table.Summary.Cell colSpan={index == 0 && colcount} className={index == 0 && "textAlignRight"} key={index}>
                <Text >{data.title}总计：{data.total|| 0} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
              </Table.Summary.Cell>
            })
          }
        </Table.Summary.Row>
      )
    }
  }

  return (
    <div className="hall-regist">
      <div className="control">
      { search }
      </div>
      <div className="main-content">
        {contextAction}
        <div className="table-container">
        <Table
          columns={columns}
          dataSource={data.results}
          pagination={false}
          rowKey="id"
          bordered
          summary={pageData => {
            const _col = JSON.parse(JSON.stringify(summaryColumn)) || []
            const dataIndex = _col.map(data => data.dataIndex)

           let summ =  _col.map(data => {
              return {'total': 0, key: data.dataIndex, name: data.title}
            })

            console.log('sum', summ)

            let totaltms = 0;
            let totalfjs = 0;
            let totalys=0;

            let colcount=columns.length -_col.length + 1;
    
            pageData.forEach(({ tms, fjs,ys }) => {
              totaltms += tms;
              totalfjs += fjs;
              totalys +=ys;
            });
    
            return (
              <>
                {renderSummay( summaryColumn)}
              </>
            );
          }}
        />
        </div>
      </div>
    </div>

  );
});

export default injectIntl(Dacltj);
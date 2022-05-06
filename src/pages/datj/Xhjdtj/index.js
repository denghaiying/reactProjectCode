import React, { useEffect, useState } from 'react';
import {
  Search,
  Tab,
  Input,
  Button,
  Form,
  DatePicker,
  Checkbox,
  Pagination,
  Icon,
  Grid,
  Tree,
  TreeSelect,
  Switch,
  Select,
  Field,
  Notification,
} from '@alifd/next';

import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import ContainerTitle from '../../../components/ContainerTitle';
import LoginStore from '../../../stores/system/LoginStore';
import Store from '../../../stores/datj/XhjdtjStore';
import E9Config from '../../../utils/e9config';
import SysStore from '../../../stores/system/SysStore';
import DwStore from '@/stores/system/DwStore';
import 'antd/dist/antd.css';
import '../style/index.less';
import '../style/search.less';
import SearchStore from '../../../stores/datj/SearchStore';
import { Table, Typography } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { action } from 'mobx';
import { useIntl, FormattedMessage } from 'umi';
import ExportJsonExcel from 'js-export-excel';

moment.locale('zh-cn');

const { Row, Col } = Grid;

const FormItem = Form.Item;
const { Text } = Typography;

/**
 * @Author: lw
 * @Date: 2021/5/26 15:45
 * @Version: 1.0
 */
const Xhjdtj = observer((props) => {
  //  const { intl: { formatMessage } } = props;
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const { data, columns, loading, pageno, pagesize, queryData } = Store;
  const { userinfo } = LoginStore;
  const field = Field.useField();
  const Option = Select.Option;
  const TreeNode = TreeSelect.Node;
  const [isExpand, setExpand] = useState(false);
  const { RangePicker, MonthPicker, YearPicker } = DatePicker;
  const searchStyle = {
    marginTop: '15px',
    padding: '20px',
  };

  const tjxsdataSource = [
    {
      value: 'dw',
      label: '单位名称',
    },
    {
      value: 'dak',
      label: '档案库名称',
    },
    {
      value: 'bgqx',
      label: '保管期限',
    },
  ];

  useEffect(() => {
    Store.setColumns([
      //     {
      //     title: "单位名称",
      //     dataIndex: "dwid",
      //     key: "dwid",
      //     width: 200,
      //     lock: true,
      //     defaultSortOrder: 'descend',
      //     sorter: (a, b) => a.dwid - b.dwid,
      // },
      {
        title: '档案年度',
        dataIndex: 'nd',
        key: 'nd',
        width: 200,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.nd - b.nd,
      },

      // {
      //     title: "档案库名称",
      //     dataIndex: 'dakmc',
      //     key: 'dakmc',
      //     width: 200,
      //     defaultSortOrder: 'descend',
      //     sorter: (a, b) => a.dakmc - b.dakmc,
      // },
      // {
      //     title: "保管期限",
      //     dataIndex: 'bgqx',
      //     key: 'bgqx',
      //     width: 200,
      //     defaultSortOrder: 'descend',
      //     sorter: (a, b) => a.bgqx - b.bgqx,
      // },
      {
        title: '到期数量',
        dataIndex: 'kfsl',
        key: 'kfsl',
        width: 200,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.kfsl - b.kfsl,
      },
      {
        title: '未到期数量',
        dataIndex: 'bkfsl',
        key: 'bkfsl',
        width: 200,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.bkfsl - b.bkfsl,
      },
    ]);
    SearchStore.queryDw();
    SearchStore.queryBgqx();
    DwStore.queryForList();
    Store.queryForPage();
  }, []);

  const openNotification = (a, type) => {
    Notification.open({ title: a, type });
  };
  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = () => {
    Store.queryForPage();
  };

  const handledwChange = (value) => {
    console.log(value);

    if (value == null) {
      Store.dws.push(SysStore.currentUser.dwid);
    } else {
      Store.setDws(value);
      SearchStore.dwChange(value);
    }
  };

  // end ********************

  // begin *************以下是自定义函数区域

  const handleBgqx = (bgqx) => {
    Store.setBgqx(bgqx);
  };

  const handleTjxs = (tjxs) => {
    console.log(tjxs);
    Store.setTjxs(tjxs);
  };

  const onDateOK = (val) => {
    Store.beginDate = val[0].format('YYYY-MM-DD');
    Store.endDate = val[1].format('YYYY-MM-DD');
  };

  const handleDate = (val) => {
    if (val[0] != null) {
      console.log(val[0]);
      Store.setBeginDate = val[0].format('YYYY-MM-DD');
    } else {
      Store.setBeginDate = '';
    }

    if (val[1] != null) {
      console.log(val[1]);
      Store.setEndDate = val[1].format('YYYY-MM-DD');
    } else {
      Store.setEndDate = '';
    }
  };
  const handleTm = (tm) => {
    Store.setTm(tm);
  };
  const handleNd = (nd) => {
    Store.setNd(nd);
  };

  const toggle = () => {
    setExpand(!isExpand);
  };

  // end **************
  return (
    <div className="statistic-page">
      <div className="search-content">
        <div className="cell">
          <span className="label">单位:</span>
          <Select
            className="input"
            name="dws"
            mode="multiple"
            placeholder={formatMessage({ id: 'e9.datj.select' })}
            onChange={handledwChange}
            tagInline
            dataSource={SearchStore.dwDataSource}
            defaultValue={SysStore.getCurrentUser().dwid}
            hasSelectAll
          ></Select>
        </div>

        <div className="cell">
          <span className="label">开放日期:</span>
          <RangePicker
            onChange={handleDate}
            onOk={onDateOK}
            className="input"
            placeholder={['开始日期', '结束日期']}
          ></RangePicker>
        </div>

        <div className="cell">
          <span className="label">档案年度:</span>
          <Input
            name="nd"
            className="input"
            placeholder="请输入档案年度"
            onChange={handleNd}
          />
        </div>

        <div className="cell">
          <span className="label">保管期限:</span>
          <Select
            className="input"
            name="bgqx"
            placeholder={formatMessage({ id: 'e9.datj.select' })}
            dataSource={SearchStore.bgqxDataSource}
            onChange={handleBgqx}
          ></Select>
        </div>

        <div className="cell" className={isExpand ? 'cell' : 'cell hidden'}>
          <span className="label">题名:</span>
          <Input
            name="tm"
            className="input"
            placeholder="请输入题名"
            onChange={handleTm}
          />
        </div>

        <div className="cell" className={isExpand ? 'cell' : 'cell hidden'}>
          <span className="label">统计显示:</span>

          <Select
            tagInline
            className="input"
            name="tjxs"
            mode="multiple"
            placeholder={formatMessage({ id: 'e9.datj.select' })}
            dataSource={tjxsdataSource}
            onChange={handleTjxs}
          ></Select>
        </div>

        <div className="collapse" style={{ textAlign: 'center' }}>
          <Form.Submit
            style={{ marginRight: 20 }}
            htmlType="submit"
            type="primary"
            onClick={doSearchAction}
          >
            {formatMessage({ id: 'e9.btn.search' })}
          </Form.Submit>
          <a type="link" onClick={toggle}>
            {isExpand ? '收起' : '展开'}
            <UpOutlined className={isExpand ? 'up' : 'up rotate'} />
          </a>
        </div>
      </div>

      {/* <div className="btns">
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

            </div> */}
      <Table
        columns={columns}
        dataSource={data.xhtj}
        loading={loading}
        pagination={false}
        rowkey="id"
        bordered
        summary={(pageData) => {
          let totalfjs = 0;
          let totalys = 0;
          let colcount = columns.length - 2;
          pageData.forEach(({ kfsl, bkfsl }) => {
            totalfjs += kfsl;
            totalys += bkfsl;
          });

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell
                  colSpan={colcount}
                  className="textAlignRight"
                >
                  <Text>
                    合计：
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{totalfjs}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{totalys}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </div>
  );
});

export default Xhjdtj;

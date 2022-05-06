import React, { useEffect, useState } from 'react';
import {
  Search,
  Tab,
  Input,
  Button,
  Form,
  // DatePicker,
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
import { injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import ContainerTitle from '../../../components/ContainerTitle';
import LoginStore from '../../../stores/system/LoginStore';
import DalydjntjStore from '../../../stores/datj/DalydjntjStore';
import E9Config from '../../../utils/e9config';
import SysStore from '../../../stores/system/SysStore';

import 'antd/dist/antd.css';
import '../style/index.less';
import '../style/search.less';
import SearchStore from '../../../stores/datj/SearchStore';
import { Table, Typography, DatePicker } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { action } from 'mobx';
import { useIntl, FormattedMessage } from 'umi';
import ExportJsonExcel from 'js-export-excel';

moment.locale('zh-cn');
const { Row, Col } = Grid;
const monthFormat = 'YYYY/MM';
const FormItem = Form.Item;
const { Text } = Typography;

const Dalydjntj = observer((props) => {
  // const { intl: { formatMessage } } = props;
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const { data, columns, loading, pageno, pagesize, queryData } =
    DalydjntjStore;
  const { userinfo } = LoginStore;
  const field = Field.useField();
  const Option = Select.Option;
  const TreeNode = TreeSelect.Node;

  const [isExpand, setExpand] = useState(false);
  const { RangePicker, MonthPicker, YearPicker } = DatePicker;
  const tjxsdataSource = [
    // {
    //   value: 'lyndxs',
    //   key: 'lyndxs',
    //   label: '年度',
    // },
    {
      value: 'lyyfxs',
      key: 'lyyfxs',
      label: '月份',
    },
    {
      value: 'djrxs',
      key: 'djrxs',
      label: '登记人',
    },
    {
      value: 'jyrxzxs',
      key: 'jyrxzxs',
      label: '利用人性质',
    },
    {
      value: 'lydanrxs',
      key: 'lydanrxs',
      label: '查档内容',
    },
    {
      value: 'lyfsxs',
      key: 'lyfsxs',
      label: '利用方式',
    },
    {
      value: 'lymdxs',
      key: 'lymdxs',
      label: '利用目的',
    },
    {
      value: 'lyxgxs',
      key: 'lyxgxs',
      label: '利用效果',
    },
  ];

  useEffect(() => {
    DalydjntjStore.setColumns([
      {
        dataIndex: 'lynd',
        width: 100,
        title: '年度',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.lynd - b.lynd,
        fixed: true,
      },
      {
        dataIndex: 'lyrc',
        width: 100,
        title: '利用人次',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.lyrc - b.lyrc,
      },
      {
        dataIndex: 'lyjc',
        width: 100,
        title: '利用件次',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.lyjc - b.lyjc,
      },
      {
        dataIndex: 'dyys',
        width: 100,
        title: '打印页数',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.dyys - b.dyys,
      },
      {
        dataIndex: 'fpys',
        width: 100,
        title: '翻拍页数',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.fpys - b.fpys,
      },
      {
        dataIndex: 'xzwjs',
        width: 120,
        title: '下载文件数',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.xzwjs - b.xzwjs,
      },
      {
        dataIndex: 'kpzs',
        width: 100,
        title: '复印页数',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.kpzs - b.kpzs,
      },
      {
        dataIndex: 'dzlcs',
        width: 120,
        title: '调资料册数',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.dzlcs - b.dzlcs,
      },
      {
        dataIndex: 'cjzms',
        width: 120,
        title: '出具证明数',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.cjzms - b.cjzms,
      },
    ]);
    // 查档内容
    DalydjntjStore.getDakTree();
    // 数据字典
    DalydjntjStore.getSjzdData('利用方式');
    DalydjntjStore.getSjzdData('利用效果');
    DalydjntjStore.getSjzdData('借阅目的');
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
    var df = true;
    let lynd = DalydjntjStore.lynd;
    let lyyf = DalydjntjStore.lyyf;
    let djr = DalydjntjStore.djr;
    let jyrxz = DalydjntjStore.jyrxz;
    let lydanr = DalydjntjStore.lydanr;
    let lyfs = DalydjntjStore.lyfs;
    let lymd = DalydjntjStore.lymd;
    let xslx = DalydjntjStore.xslx;
    let lyxg = DalydjntjStore.lyxg;
    let djrq = DalydjntjStore.djrq;
    let tjxs = DalydjntjStore.tjxs;
    let ks = '';
    let js = '';
    if (djrq) {
      ks = djrq[0];
      js = djrq[1];
      if (js == undefined) {
        js = '';
      } else {
        const jsyear = js.format('YYYY');
        const jsmonth = js.format('MM');
        js = js.format('YYYY-MM') + '-' + mGetDate(jsyear, jsmonth);
      }
      if (ks == undefined) {
        ks = '';
      } else {
        ks = ks.format('YYYY-MM') + '-01';
      }
    }
    let values = {};
    values['lynd'] = lynd;
    values['lyyf'] = lyyf;
    values['djr'] = djr;
    values['jyrxz'] = jyrxz;
    values['lydanr'] = lydanr;
    values['lyfs'] = lyfs;
    values['lymd'] = lymd;
    values['xslx'] = xslx;
    values['lyxg'] = lyxg;
    // values["djrq"] = djrq;
    values['tjxs'] = tjxs;
    if (djrq) {
      values['djksrq'] = ks;
      values['djjsrq'] = js;
    }
    if (df) {
      DalydjntjStore.setParams(values);
    }
  };
  const mGetDate = (year, month) => {
    var d = new Date(year, month, 0);
    return d.getDate();
  };
  //利用人性质
  const handleJyrxzChange = (value) => {
    DalydjntjStore.setJyrxz(value);
  };
  //查档内容
  const handleLydanrChange = (value) => {
    DalydjntjStore.setLydanr(value);
  };
  //利用方式
  const handleLyfsChange = (value) => {
    DalydjntjStore.setLyfs(value);
  };
  //显示类型
  const handleXslxChange = (value) => {
    DalydjntjStore.setXslx(value);
  };
  //利用目的
  const handleLymdChange = (value) => {
    DalydjntjStore.setLymd(value);
  };
  //利用效果
  const handleLyxgChange = (value) => {
    DalydjntjStore.setLyxg(value);
  };
  //统计显示
  const handleTjxsChange = (value) => {
    DalydjntjStore.setTjxs(value);
  };
  //登记时间
  const handleDjrqChange = (value) => {
    debugger;
    DalydjntjStore.setDjrq(value);
  };
  // 控制展开收起
  const toggle = () => {
    setExpand(!isExpand);
  };

  const downloadFileToExcel = () => {
    const getRepaymentPlanList = data; //获取数据源
    const getcolumnameList = DalydjntjStore.columnameList;
    debugger;
    let option = {}; //option代表的就是excel文件
    let dataTable = []; //excel文件中的数据内容
    if (getRepaymentPlanList && getRepaymentPlanList.length > 0) {
      let lyrc = 0;
      let lyjc = 0;
      let dyys = 0;
      let fpys = 0;
      let xzwjs = 0;
      let kpzs = 0;
      let dzlcs = 0;
      let cjzms = 0;
      let onex = 0;
      let twox = 0;
      let threex = 0;
      let fourx = 0;
      let fivex = 0;
      for (let i in getRepaymentPlanList) {
        //循环获取excel中每一行的数据
        lyrc += getRepaymentPlanList[i].lyrc;
        lyjc += getRepaymentPlanList[i].lyjc;
        dyys += getRepaymentPlanList[i].dyys;
        fpys += getRepaymentPlanList[i].fpys;
        xzwjs += getRepaymentPlanList[i].xzwjs;
        kpzs += getRepaymentPlanList[i].kpzs;
        dzlcs += getRepaymentPlanList[i].dzlcs;
        cjzms += getRepaymentPlanList[i].cjzms;
        onex += getRepaymentPlanList[i].onex;
        twox += getRepaymentPlanList[i].twox;
        threex += getRepaymentPlanList[i].threex;
        fourx += getRepaymentPlanList[i].fourx;
        fivex += getRepaymentPlanList[i].fivex;
      }
      dataTable = DalydjntjStore.columnResult;
      let tobj = {
        利用人次: '总计：' + lyrc,
        利用件次: lyjc,
        打印页数: dyys,
        翻拍页数: fpys,
        下载文件数: kpzs,
        复印页数: kpzs,
        调资料册数: dzlcs,
        出具证明数: cjzms,
        满意度一星: onex,
        满意度二星: twox,
        满意度三星: threex,
        满意度四星: fourx,
        满意度五星: fivex,
      };
      dataTable.push(tobj); //设置excel中总计的数据源
    }
    option.fileName = '查档登记统计_' + moment().format('YYYYMMDDHHmmss'); //excel文件名称
    option.datas = [
      {
        sheetData: dataTable, //excel文件中的数据源
        sheetName: '查档登记统计', //excel文件中sheet页名称
        sheetFilter: getcolumnameList,
        sheetHeader: getcolumnameList,
      },
    ];
    let toExcel = new ExportJsonExcel(option); //生成excel文件
    toExcel.saveExcel(); //下载excel文件
  };

  // end **************时间范围：查档登记时间 查档内容/利用方式/利用目弟/利用效果支持多选 参考存量统计统计显示（支持多选）
  return (
    <div className="statistic-page">
      <div className="search-content">
        <div className="cell">
          {/* <Row>
            <span className="label">登记日期</span>
            <Col className="input"><DatePicker size="middle" format={monthFormat} picker="month" /> 至 <DatePicker format={monthFormat} picker="month" /></Col>
          </Row> */}
          <span className="label">登记日期</span>
          <RangePicker
            onChange={handleDjrqChange}
            className="input"
            name="djrq"
            format={monthFormat}
            picker="month"
          ></RangePicker>
        </div>
        <div className="cell">
          <span className="label">查档内容</span>
          <Select
            className="input"
            name="lydanr"
            mode="multiple"
            placeholder="请选择查档内容"
            onChange={handleLydanrChange}
            tagInline
            dataSource={DalydjntjStore.daklist}
            hasSelectAll
          ></Select>
        </div>
        <div className="cell">
          <span className="label">利用方式</span>
          <Select
            className="input"
            name="lyfs"
            mode="multiple"
            placeholder="请选择利用方式"
            onChange={handleLyfsChange}
            tagInline
            hasSelectAll
          >
            {(DalydjntjStore.sjzdData['利用方式'] || []).map((o) => (
              <Option value={o.mc} key={o.id}>
                {o.mc}
              </Option>
            ))}
          </Select>
        </div>
        <div className="cell">
          <span className="label">利用目的</span>
          <Select
            className="input"
            name="lymd"
            mode="multiple"
            tagInline
            placeholder="请选择利用目的"
            onChange={handleLymdChange}
            hasSelectAll
          >
            {(DalydjntjStore.sjzdData['借阅目的'] || []).map((o) => (
              <Option value={o.mc} key={o.id}>
                {o.mc}
              </Option>
            ))}
          </Select>
        </div>
        <div className="cell" className={isExpand ? 'cell' : 'cell hidden'}>
          <span className="label">利用效果</span>
          <Select
            tagInline
            onChange={handleLyxgChange}
            name="lyxg"
            className="input"
            placeholder="请选择利用效果"
            mode="multiple"
            hasSelectAll
          >
            {(DalydjntjStore.sjzdData['利用效果'] || []).map((o) => (
              <Option value={o.mc} key={o.id}>
                {o.mc}
              </Option>
            ))}
          </Select>
        </div>
        <div className="cell" className={isExpand ? 'cell' : 'cell hidden'}>
          <span className="label">统计显示</span>
          <Select
            tagInline
            className="input"
            name="tjxs"
            mode="multiple"
            placeholder="请选择统计显示"
            dataSource={tjxsdataSource}
            onChange={handleTjxsChange}
            hasSelectAll
          ></Select>
        </div>
        <div className="cell" className={isExpand ? 'cell' : 'cell hidden'}>
          <span className="label">显示类型</span>
          <Select
            tagInline
            onChange={handleXslxChange}
            className="input"
            defaultValue="tjlb"
            name="xslx"
            placeholder="请选择显示类型"
          >
            <Option value="tjlb">统计列表</Option>
          </Select>
        </div>
        <div className="cell" className={isExpand ? 'cell' : 'cell hidden'}>
          <span className="label">利用人性质</span>
          <Select
            tagInline
            onChange={handleJyrxzChange}
            name="jyrxz"
            className="input"
            placeholder="请选择查档类型"
            mode="multiple"
            hasSelectAll
          >
            <Option value="A">个人</Option>
            <Option value="B">单位</Option>
          </Select>
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
      <div className="btns">
        <Button
          type="primary"
          style={{ marginRight: 10 }}
          onClick={downloadFileToExcel}
        >
          <Icon type="download" />
          <FormattedMessage id="e9.btn.file.export.excel" />
        </Button>
      </div>
      <Table
        dataSource={data}
        pagination={false}
        rowKey="id"
        bordered
        scroll={{ x: 500 }}
        summary={(pageData) => {
          let totallyrc = 0;
          let totallyjc = 0;
          let totaldyys = 0;
          let totalfpys = 0;
          let totalxzwjs = 0;
          let totalkpzs = 0;
          let totaldzlcs = 0;
          let totalcjzms = 0;
          let totalonex = 0;
          let totaltwox = 0;
          let totalthreex = 0;
          let totalfourx = 0;
          let totalfivex = 0;
          let colcount = columns.length - 8;
          pageData.forEach(
            ({
              lyrc,
              lyjc,
              dyys,
              fpys,
              xzwjs,
              kpzs,
              dzlcs,
              cjzms,
              onex,
              twox,
              threex,
              fourx,
              fivex,
            }) => {
              totallyrc += lyrc;
              totallyjc += lyjc;
              totaldyys += dyys;
              totalfpys += fpys;
              totalxzwjs += xzwjs;
              totaldzlcs += kpzs;
              totaldzlcs += dzlcs;
              totalcjzms += cjzms;
              totalonex += onex;
              totaltwox += twox;
              totalthreex += threex;
              totalfourx += fourx;
              totalfivex += fivex;
            },
          );
          return (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell
                  colSpan={colcount}
                  className="textAlignCenter"
                >
                  <Text>总计</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell className="textAlignCenter">
                  <Text>{totallyrc}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell className="textAlignCenter">
                  <Text>{totallyjc}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell className="textAlignCenter">
                  <Text>{totaldyys}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell className="textAlignCenter">
                  <Text>{totalfpys}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell className="textAlignCenter">
                  <Text>{totalxzwjs}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell className="textAlignCenter">
                  <Text>{totalkpzs}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell className="textAlignCenter">
                  <Text>{totaldzlcs}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell className="textAlignCenter">
                  <Text>{totalcjzms}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell className="textAlignCenter">
                  <Text>{totalonex}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell className="textAlignCenter">
                  <Text>{totaltwox}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell className="textAlignCenter">
                  <Text>{totalthreex}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell className="textAlignCenter">
                  <Text>{totalfourx}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell className="textAlignCenter">
                  <Text>{totalfivex}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      >
        {columns.map((col) => (
          <Table.Column align="center" key={col.dataIndex} {...col} />
        ))}
        <Table.ColumnGroup title="满意度(星)" align="center">
          <Table.Column
            alignHeader="center"
            title="一"
            width={50}
            dataIndex="onex"
            defaultSortOrder="descend"
            sorter={(a, b) => a.dzlcs - b.dzlcs}
          />
          <Table.Column
            alignHeader="center"
            title="二"
            width={50}
            dataIndex="twox"
            defaultSortOrder="descend"
            sorter={(a, b) => a.twox - b.twox}
          />
          <Table.Column
            alignHeader="center"
            title="三"
            width={50}
            dataIndex="threex"
            defaultSortOrder="descend"
            sorter={(a, b) => a.threex - b.threex}
          />
          <Table.Column
            alignHeader="center"
            title="四"
            width={50}
            dataIndex="fourx"
            defaultSortOrder="descend"
            sorter={(a, b) => a.fourx - b.fourx}
          />
          <Table.Column
            alignHeader="center"
            title="五"
            width={50}
            dataIndex="fivex"
            defaultSortOrder="descend"
            sorter={(a, b) => a.fivex - b.fivex}
          />
        </Table.ColumnGroup>
      </Table>
    </div>
  );
});

export default Dalydjntj;

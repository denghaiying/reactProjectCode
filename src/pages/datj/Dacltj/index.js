import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Input,
  Table,
  Form,
  Button,
  Select,
  Notification,
  Icon,
  TreeSelect,
  Typography,
  DatePicker,
  message,
} from 'antd';

import IceNotification from '@icedesign/notification';
import moment from 'moment';
import ContainerTitle from '../../../components/ContainerTitle';
import LoginStore from '../../../stores/system/LoginStore';
import Store from '../../../stores/datj/DacltjStore';
import E9Config from '../../../utils/e9config';
import SysStore from '../../../stores/system/SysStore';
import { observer } from 'mobx-react';
import { DownloadOutlined } from '@ant-design/icons';
import './index.less';
import SearchStore from '../../../stores/datj/SearchStore';

import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { action } from 'mobx';
import { USERWHITESPACABLE_TYPES } from '@babel/types';
import ExportJsonExcel from 'js-export-excel';
import { set } from 'lodash';
moment.locale('zh-cn');
const { Text } = Typography;

const Dacltj = observer((props) => {
  const { data, columns, loading, pageno, pagesize, queryData } = Store;
  const { dwDataSource, bgqxDataSource, dakDataSource } = SearchStore;
  const Option = Select.Option;
  const [searchForm] = Form.useForm();
  const [tjxs, setTjxs] = useState(Store.tjxs);
  const [dataSum, setDataSum] = useState({ tms: 0, fjs: 0, ys: 0, ywdx: 0 });
  const tjxsdataSource = [
    {
      value: 'dwsx',
      label: '单位',
    },
    {
      value: 'daklbsx',
      label: '档案类别',
    },
    {
      value: 'daksx',
      label: '档案库',
    },
    {
      value: 'daklxsx',
      label: '档案类型',
    },
    {
      value: 'ndsx',
      label: '年度',
    },
    {
      value: 'bgqxsx',
      label: '保管期限',
    },
    {
      value: 'gdrmcsx',
      label: '归档人',
    },
  ];

  const daklxDataSource = [
    {
      value: '01',
      label: '一文一件',
    },
    {
      value: '02',
      label: '传统立卷',
    },
    {
      value: '0201',
      label: '卷内',
    },
  ];

  useEffect(() => {
    SearchStore.queryDw();
    SearchStore.queryBgqx();
    SearchStore.queryDak();
    Store.queryQzmcDataSource({ dwid: Store.dw });
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
    
    searchForm.validateFields().then((value) => {
      Store.loading=true;
      value['daklx'] = Store.daklx;
      if (value['dw'].length == 0) {
        value['dw'] = Store.yhdwData;
      }
      value['dakid'] = Store.dakid;
      value['bgqx'] = Store.bgqx;
      value['tmzt'] = Store.tmzt;
      value['tjlb'] = Store.tjlb;
      value['yhdw'] = SysStore.getCurrentCmp().id;
      value['qzmc'] = Store.qzmc;
      if (value['tjxs'].length > 0) {
        setTjxs(value.tjxs);
        Store.setTjxs(value.tjxs);
      } else {
        setTjxs([]);
      }
      value['ndksrq'] = value['ndksrq'] && value['ndksrq'].year();
      value['ndjsrq'] = value['ndjsrq'] && value['ndjsrq'].year();

      Store.searchCltjResult(value)
        .then((response) => {
          if (response && response.status === 200) {
            const data = response.data;
            //设置表格最后的合计值
            setDataSum(data[data.length - 1]);
            //设置表格主体内容的值
            Store.setData(data.slice(0, data.length - 1));
            //渲染导出excel的表头以及内容
            Store.setExcleContent(data.slice(0, data.length - 1));
            Store.setExcleHeader();
            Store.loading= false;
            message.success('查询成功');
          }
        })
        .catch((err) => {
          message.error('服务器内部错误');
        });
    });
  };

  const handledwChange = (value) => {
    if (value.length == 0) {
      for (let i in dwDataSource) {
        Store.yhdwData[i] = dwDataSource[i].value;
      }
    }
    Store.setDw(value);
    SearchStore.dwChange(value);
    Store.queryQzmcDataSource({ dwid: value });
    Store.setQzmc([]);
    searchForm.setFieldsValue({ qzmc: [] });
    // console.log(SearchStore.dakDataSource);
  };

  const handledakChange = (value) => {
    this.setState({ dakid: value });
    console.log(this.state.dwid, value);
  };

  // end ********************

  // begin *************以下是自定义函数区域

  const handleDakid = (dakid) => {
    Store.setDakid(dakid);
  };

  const handleXslx = (xslx) => {
    Store.setXslx(xslx);
  };

  const handleBgqx = (bgqx) => {
    Store.setBgqx(bgqx);
  };

  const handleDaklx = (daklx) => {
    Store.setDaklx(daklx);
  };

  const handleTjxs = (tjxs) => {};

  const handleTmzt = (tmzt) => {
    Store.setTmzt(tmzt);
  };

  const handleQzmc = (qzmc) => {
    Store.setQzmc(qzmc);
  };

  const handleNd = (nd) => {
    Store.setNd(nd);
  };

  const downloadFileToExcel = () => {
    console.log(Store.columnResult);

    const getcolumnameList = Store.columnameList.slice(
      0,
      Store.columnameList.length,
    );
    let option = {}; //option代表的就是excel文件
    //使用slice进行获取数据,不要直接赋值,否则后面push会改变源数据
    let dataTable = Store.columnResult.slice(0, Store.columnResult.length); //excel文件中的数据内容
    //合计字段
    const hjzd = getcolumnameList[0];
    let end = {};
    end[hjzd] = '合计';
    end['条目数量'] = dataSum.tms;
    end['原文数量'] = dataSum.fjs;
    end['页数'] = dataSum.ys;
    end['原文大小（G）'] = dataSum.ywdx;
    dataTable.push(end); //设置excel中总计的数据源
    console.log('datatable', dataTable);
    option.fileName = '档案存量统计'; //excel文件名称
    option.datas = [
      {
        sheetData: dataTable, //excel文件中的数据源
        sheetName: '档案存量统计', //excel文件中sheet页名称
        sheetFilter: getcolumnameList,
        sheetHeader: getcolumnameList,
      },
    ];

    let toExcel = new ExportJsonExcel(option, true); //生成excel文件
    toExcel.saveExcel(); //下载excel文件
  };

  // end **************
  return (
    <div className="hall-regist-dacltj">
      <div className="control">
        <Col span={24}>
          <Form
            style={{ marginTop: '15px' }}
            form={searchForm}
            labelCol={{ span: 6 }}
            layout={'horizontal'}
            colon={false}
          >
            <Row>
              <Form.Item
                labelCol={{ span: 4 }}
                style={{ width: 330 }}
                name="dw"
                label="单位"
                initialValue={Store.dw}
              >
                <Select
                  allowClear
                  style={{ width: 250 }}
                  mode="multiple"
                  placeholder={'请选择'}
                  onChange={handledwChange}
                  maxTagCount={1}
                  options={SearchStore.dwDataSource}
                ></Select>
              </Form.Item>
              <Form.Item
                labelTextAlign="right"
                name="dakid"
                label="档案库"
                style={{ width: 350 }}
              >
                <TreeSelect
                  style={{ width: 250 }}
                  placeholder={'请选择'}
                  allowClear
                  onChange={handleDakid}
                  value={Store.dakid}
                  maxTagCount={2}
                  treeCheckedStrategy="child"
                  treeCheckable
                  treeData={SearchStore.dakDataSource}
                />
              </Form.Item>
              <Form.Item
                style={{ width: 350 }}
                name="tmzt"
                label="档案状态"
                labelTextAlign="right"
                initialValue={Store.tmzt}
                hidden
              >
                <Select
                  style={{ width: 250 }}
                  maxTagCount={3}
                  onChange={handleTmzt}
                  allowClear
                  placeholder={'请选择'}
                  mode="multiple"
                >
                  <Option value="1">收集</Option>
                  <Option value="2">整理</Option>
                  <Option value="3">归档</Option>
                </Select>
              </Form.Item>
              <Form.Item
                style={{ width: 350 }}
                name="qzmc"
                label="全宗名称"
                labelTextAlign="right"
              >
                <Select
                  style={{ width: 250 }}
                  maxTagCount={1}
                  onChange={handleQzmc}
                  allowClear
                  placeholder={'请选择'}
                  mode="multiple"
                >
                  {Store.qzmcDataSource.map((o) => (
                    <Select.Option value={o} key={o}>
                      {o}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                labelTextAlign="right"
                name="bgqx"
                label="保管期限"
                style={{ width: 350 }}
              >
                <Select
                  style={{ width: 250 }}
                  allowClear
                  maxTagCount={2}
                  mode="multiple"
                  placeholder={'请选择'}
                  hasSelectAll
                  options={SearchStore.bgqxDataSource}
                  onChange={handleBgqx}
                ></Select>
              </Form.Item>

              {/* <Form.Item name="daklx" label="档案类型" style={{marginRight: 20}}>
                  <Select
                    style={{ width: 250}}
                    allowClear
                    maxTagCount={2}
                    mode="multiple"
                    placeholder={'请选择'}
                    hasSelectAll
                    options={daklxDataSource}
                    onChange={handleDaklx}
                  ></Select>
                </Form.Item> */}
            </Row>
            <Row>
              <Form.Item
                labelCol={{ span: 4 }}
                label="开始年度"
                name="ndksrq"
                style={{ width: 330 }}
              >
                <DatePicker
                  style={{ width: 250 }}
                  // onChange={handleNd}
                  picker="year"
                  placeholder={'开始年度'}
                ></DatePicker>
              </Form.Item>
              <Form.Item label="结束年度" name="ndjsrq" style={{ width: 350 }}>
                <DatePicker
                  style={{ width: 250 }}
                  // onChange={handleNd}
                  picker="year"
                  placeholder={'结束年度'}
                ></DatePicker>
              </Form.Item>

              <Form.Item
                style={{ marginRight: 20, width: 350 }}
                name="tjxs"
                label="统计显示"
                initialValue={Store.tjxs}
                rules={[{ required: true, message: '最少选择一个' }]}
              >
                <Select
                  style={{ width: 250 }}
                  allowClear
                  maxTagCount={2}
                  size="middle"
                  mode="multiple"
                  placeholder={'请选择'}
                  options={tjxsdataSource}
                  // onChange={handleTjxs}
                ></Select>
              </Form.Item>
              <Button
                style={{ marginRight: 10, marginLeft: 20 }}
                type="primary"
                onClick={doSearchAction}
              >
                查询
              </Button>
              <Button type="primary" onClick={downloadFileToExcel}>
                <DownloadOutlined />
                导出Excel
              </Button>
            </Row>
          </Form>
        </Col>
      </div>
      <div className="main-content">
        <div className="table-container">
          <Table
            loading={Store.loading}
            size="small"
            dataSource={Store.data}
            pagination={false}
            rowkey="id"
            bordered
            summary={() => {
              return (
                <tr style={{ backgroundColor: 'rgb(138, 163, 247)' }}>
                  {tjxs.length > 0 && (
                    <td style={{ textAlign: 'left' }}>合计</td>
                  )}
                  {tjxs.length > 1 && <td></td>}
                  {tjxs.length > 2 && <td></td>}
                  {tjxs.length > 3 && <td></td>}
                  {tjxs.length > 4 && <td></td>}
                  {tjxs.length > 5 && <td></td>}
                  {tjxs.length > 6 && <td></td>}
                  {tjxs.length > 7 && <td></td>}
                  {tjxs.length > 8 && <td></td>}
                  <td colSpan={0} style={{ textAlign: 'left' }}>
                    {dataSum.tms}
                  </td>
                  <td colSpan={0} style={{ textAlign: 'left' }}>
                    {dataSum.fjs}
                  </td>
                  <td colSpan={0} style={{ textAlign: 'left' }}>
                    {dataSum.ys}
                  </td>
                  <td colSpan={0} style={{ textAlign: 'left' }}>
                    {dataSum.ywdx}
                  </td>
                </tr>
              );
            }}
          >
            {tjxs && tjxs.includes('dwsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="单位"
                dataIndex="dwmc"
              />
            )}
            {tjxs && tjxs.includes('daklbsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="档案类别"
                dataIndex="daklb"
              />
            )}
            {tjxs && tjxs.includes('daksx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="档案库"
                dataIndex="dakmc"
              />
            )}
            {tjxs && tjxs.includes('daklxsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="档案类型"
                dataIndex="daklx"
              />
            )}
            {tjxs && tjxs.includes('tmztsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="档案状态"
                dataIndex="tmzt"
              />
            )}
            {tjxs && tjxs.includes('ndsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="年度"
                dataIndex="nd"
              />
            )}
            {tjxs && tjxs.includes('bgqxsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="保管期限"
                dataIndex="bgqx"
              />
            )}
            {tjxs && tjxs.includes('gdbmsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="归档部门"
                dataIndex="gdbm"
                defaultSortOrder="descend"
                sorter={(a, b) => a.ys - b.ys}
              />
            )}
            {tjxs && tjxs.includes('gdrmcsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="归档人"
                dataIndex="gdrmc"
              />
            )}
            <Table.Column
              alignHeader="center"
              width={120}
              title="条目数量"
              dataIndex="tms"
            />
            <Table.Column
              alignHeader="center"
              width={120}
              title="原文数量"
              dataIndex="fjs"
            />
            <Table.Column
              alignHeader="center"
              width={120}
              title="页数"
              dataIndex="ys"
            />
            <Table.Column
              alignHeader="center"
              width={120}
              title="原文大小（G）"
              dataIndex="ywdx"
            />
          </Table>
        </div>
      </div>
    </div>
  );
});

export default Dacltj;
const { Option } = Select;

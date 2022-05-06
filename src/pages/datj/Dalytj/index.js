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
import moment from 'moment';
import { observer } from 'mobx-react';
import Store from '../../../stores/datj/Dalytj';
import SearchStore from '../../../stores/datj/SearchStore';
import ExportJsonExcel from 'js-export-excel';
import { DownOutlined, DownloadOutlined, UpOutlined } from '@ant-design/icons';
import './index.less';

/**
 * 修改,组件替换,页面风格统一修改,档案利用统计改为借阅统计
 *
 * 李康康 2022-04-25
 *
 */

const Dalytj = observer((props) => {
  const [searchForm] = Form.useForm();
  const { data, columns, loading, pageno, pagesize, queryData } = Store;
  const [tjxs, setTjxs] = useState(Store.tjxs);
  const [dataSum, setDataSum] = useState({ jyrc: 0, jyajc: 0, jyjc: 0 });

  const searchStyle = {
    marginTop: '15px',
    padding: '20px',
  };

  const tjxsdataSource = [
    {
      value: 'dwsx',
      label: '单位',
    },
    {
      value: 'dalbsx',
      label: '档案种类',
    },
    {
      value: 'daksx',
      label: '档案库',
    },
    {
      value: 'nfsx',
      label: '年度',
    },
    {
      value: 'yfsx',
      label: '月份',
    },
    {
      value: 'jyrsx',
      label: '借阅人',
    },
    {
      value: 'bgqxsx',
      label: '保管期限',
    },
    {
      value: 'jymdsx',
      label: '借阅目的',
    },
    {
      value: 'jylxsx',
      label: '借阅类型',
    },
  ];

  useEffect(() => {
    SearchStore.queryDw();
    SearchStore.queryBgqx();
    SearchStore.queryDak();
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
      Store.loading = true;
      if (value['dw'].length == 0) {
        value['dw'] = SearchStore.dwDataSource.map((m) => m.value);
      }
      value['dakid'] = Store.dakid;

      if (value['tjxs'].length > 0) {
        setTjxs(value.tjxs);
        Store.setTjxs(value.tjxs);
      } else {
        setTjxs([]);
      }
      value['jyrqks'] =
        value['jyrqks'] && moment(value['jyrqks']).format('YYYYMM');
      value['jyrqjs'] =
        value['jyrqjs'] && moment(value['jyrqjs']).format('YYYYMM');

      Store.searchJytjResult(value)
        .then((response) => {
          if (response && response.status === 200) {
            const data = response.data;
            //设置表格最后的合计值
            setDataSum(data[data.length - 1]);
            //设置表格主体内容的值
            Store.setData(data.slice(0, data.length));
            Store.setData(data.slice(0, data.length - 1));
            //渲染导出excel的表头以及内容
            Store.setExcleContent(data.slice(0, data.length - 1));
            Store.setExcleHeader();
            Store.loading = false;
            message.success('查询成功');
          }
        })
        .catch((err) => {
          message.error('服务器内部错误');
        });
    });
  };

  function handleChange(value) {
    value = value.join();
    console.log(value);
  }

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = (current) => {
    Store.setPageNo(current);
  };

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = (pageSize) => {
    Store.setPageSize(pageSize);
  };

  /**
   * 最后一列操作列绘制修改 删除按钮
   * @param {*} value
   * @param {*} index
   * @param {*} record
   */
  const renderTableCell = (value, index, record) => {
    return (
      <div>
        <a href="javascript:;" onClick={() => onEditAction(record)}>
          <FormattedMessage id="e9.btn.edit" />
        </a>
        <a
          href="javascript:;"
          style={{ marginLeft: '5px' }}
          onClick={() => onDeleteAction(record.id)}
        >
          <FormattedMessage id="e9.btn.delete" />
        </a>
      </div>
    );
  };

  /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    Store.setSelectRows(selectedRowKeys, records);
  };

  const handledwChange = (value) => {
    Store.setDw(value);
    SearchStore.dwChange(value);
    console.log(SearchStore.dakDataSource);
  };

  const handledakChange = (value) => {
    this.setState({ dakid: value });
    console.log(this.state.dwid, value);
  };

  // end ********************

  // begin *************以下是自定义函数区域
  const handleDakid = (value, data) => {
    console.log(value, data);
    Store.setDakid(value);
  };

  const handleXslx = (xslx) => {
    Store.setXslx(xslx);
  };

  const handleTjxs = (tjxs) => {
    Store.setTjxs(tjxs);
  };

  const handleYhmc = (yhmc) => {
    Store.setYhmc(yhmc);
  };

  const handleRq = (rq) => {
    Store.setRq(rq);
  };

  const toggle = () => {
    setExpand(!isExpand);
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
    end['借阅人次'] = dataSum.jyrc;
    end['借阅卷次'] = dataSum.jyajc;
    end['借阅件次'] = dataSum.jyjc;
    dataTable.push(end); //设置excel中总计的数据源
    console.log('datatable', dataTable);
    option.fileName = '借阅统计'; //excel文件名称
    option.datas = [
      {
        sheetData: dataTable, //excel文件中的数据源
        sheetName: '借阅统计', //excel文件中sheet页名称
        sheetFilter: getcolumnameList,
        sheetHeader: getcolumnameList,
      },
    ];

    let toExcel = new ExportJsonExcel(option, true); //生成excel文件
    toExcel.saveExcel(); //下载excel文件
  };
  // end **************
  return (
    <div className="hall-regist-jytj">
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
                initialValue={Store.dwid}
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
                  maxTagCount={1}
                  treeCheckedStrategy="child"
                  treeCheckable
                  treeData={SearchStore.dakDataSource}
                />
              </Form.Item>
              <Form.Item style={{ width: 350 }} name="jyr" label="借阅人">
                <Input style={{ width: 250 }} />
              </Form.Item>
            </Row>
            <Row>
              <Form.Item
                labelCol={{ span: 4 }}
                label="开始年月"
                name="jyrqks"
                style={{ width: 330 }}
              >
                <DatePicker
                  style={{ width: 250 }}
                  picker="month"
                  placeholder={'开始年月'}
                ></DatePicker>
              </Form.Item>
              <Form.Item label="结束年月" name="jyrqjs" style={{ width: 350 }}>
                <DatePicker
                  style={{ width: 250 }}
                  picker="month"
                  placeholder={'结束年月'}
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
                  {tjxs.length > 9 && <td></td>}
                  {tjxs.length > 10 && <td></td>}
                  <td colSpan={0} style={{ textAlign: 'left' }}>
                    {dataSum.jyrc}
                  </td>
                  <td colSpan={0} style={{ textAlign: 'left' }}>
                    {dataSum.jyajc}
                  </td>
                  <td colSpan={0} style={{ textAlign: 'left' }}>
                    {dataSum.jyjc}
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
            {tjxs && tjxs.includes('dalbsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="档案类别"
                dataIndex="dalb"
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
            {tjxs && tjxs.includes('nfsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="年度"
                dataIndex="nf"
              />
            )}
            {tjxs && tjxs.includes('yfsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="月份"
                dataIndex="yf"
              />
            )}
            {tjxs && tjxs.includes('jyrsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="借阅人"
                dataIndex="jyr"
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
            {tjxs && tjxs.includes('jymdsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="借阅目的"
                dataIndex="jymd"
              />
            )}
            {tjxs && tjxs.includes('jylxsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="借阅类型"
                dataIndex="jylx"
              />
            )}
            <Table.Column
              alignHeader="center"
              width={120}
              title="借阅人次"
              dataIndex="jyrc"
            />
            <Table.Column
              alignHeader="center"
              width={120}
              title="借阅卷次"
              dataIndex="jyajc"
            />

            <Table.Column
              alignHeader="center"
              width={120}
              title="借阅件次"
              dataIndex="jyjc"
            />
          </Table>
        </div>
      </div>
    </div>
  );
});

export default Dalytj;

import React, { useEffect ,useState} from 'react';
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
import Store from '../../../stores/datj/Wsdtj';
import SearchStore from '../../../stores/datj/SearchStore';
import ExportJsonExcel from 'js-export-excel';
import { DownOutlined,DownloadOutlined, UpOutlined } from '@ant-design/icons';
import './index.less'

const FormItem = Form.Item;
const { Text } = Typography;
const Wsdtj = observer((props) => {
  const [searchForm] = Form.useForm();
  const { data, columns, loading, pageno, pagesize, queryData } = Store;
  const [tjxs, setTjxs] = useState(Store.tjxs);
  const [dataSum, setDataSum] = useState({ wdbhhl: 0, wdbhbhl: 0, sdbhhl: 0, sdbhbhl: 0 });
  const tjxsdataSource = [
    {
      value: 'dwsx',
      label: '单位',
    },
    {
      value: 'kfsx',
      label: '库房',
    },
    {
      value: 'jcdsx',
      label: '监测点',
    },
    {
      value: 'nfsx',
      label: '年份',
    },
    {
      value: 'yfsx',
      label: '月份',
    },
  ];

  useEffect(() => {
    SearchStore.queryDw();
    SearchStore.querykf({ dwid: Store.dw });
    Store.queryJcd({});
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
searchForm.validateFields().then((value)=>{
  Store.loading=true;
  if (value['dw'].length == 0) {
    value['dw'] = SearchStore.dwDataSource.map(m=>(m.value));
  }
  if(value['kf'].length==0){
    value['kf'] = SearchStore.kfDataSource.map(m=>(m.value));
  }
  if (value['tjxs'].length > 0) {
    setTjxs(value.tjxs);
    Store.setTjxs(value.tjxs);
  } else {
    setTjxs([]);
  }
  value['jcrqks'] =  value['jcrqks'] && moment(value['jcrqks']).format('YYYYMM');
  value['jcrqjs'] =  value['jcrqjs'] && moment(value['jcrqjs']).format('YYYYMM');

    Store.queryForPage(value)
    .then((response) => {
      if (response && response.status === 200) {
        const data = response.data;
        Store.excelData = response.data;
        //设置表格最后的合计值
        setDataSum(data[data.length - 1]);
        //设置表格主体内容的值
        Store.setData(data.slice(0, data.length - 1));
        Store.loading= false;
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

 


  const handledwChange = (value) => {
    // if (value.length == 0) {
    //   for (let i in dwDataSource) {
    //     Store.yhdwData[i] = dwDataSource[i].value;
    //   }
    // }
    Store.setDw(value);
    SearchStore.dwChange(value);
    SearchStore.querykf({ dwid: value });
    searchForm.setFieldsValue({ kfmc: [] });
  };
  const handlekfChange = (value) => {};

  const handledakChange = (value) => {
    this.setState({ dakid: value });
    console.log(this.state.dwid, value);
  };

  // end ********************

  // begin *************以下是自定义函数区域
  const downloadFileToExcel = () => {
    Store.downloadExcel(Store.excelData,tjxsdataSource);
  };

  // end **************
  return (
    <div className="hall-regist-wsdtj">
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
                style={{ width: 350 }}
                name="kf"
                label="库房"
                initialValue={[]}
              >
                <Select
                  allowClear
                  style={{ width: 250 }}
                  mode="multiple"
                  placeholder={'请选择'}
                  onChange={handlekfChange}
                  maxTagCount={1}
                  options={SearchStore.kfDataSource}
                ></Select>
              </Form.Item>
              <Form.Item
                style={{ width: 350 }}
                name="jcd"
                label="监测点"
              >
                <Select
                  allowClear
                  style={{ width: 250 }}
                  mode="multiple"
                  placeholder={'请选择'}
                  onChange={handlekfChange}
                  maxTagCount={1}
                >
                    {Store.jcdDataSource.map((o) => (
                      <Select.Option value={o} key={o}>
                        {o}
                      </Select.Option>
                    ))}
                  

                </Select>
              </Form.Item>
              </Row>
              <Row>
              <Form.Item
                labelCol={{ span: 4 }}
                label="开始年月"
                name="jcrqks"
                style={{ width: 330 }}
              >
                <DatePicker
                  style={{ width: 250 }}
                  picker="month"
                  placeholder={'开始年月'}
                ></DatePicker>
              </Form.Item>
              <Form.Item label="结束年月" name="jcrqjs"  style={{ width: 350 }}>
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
                  maxTagCount={3}
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
              <Button type="primary" 
              onClick={downloadFileToExcel}
              >
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
            loading={ Store.loading}
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
                    {dataSum.wdbhhl}
                  </td>
                  <td colSpan={0} style={{ textAlign: 'left' }}>
                    {dataSum.wdbhbhl}
                  </td>
                  <td colSpan={0} style={{ textAlign: 'left' }}>
                    {dataSum.sdbhhl}
                  </td>
                  <td colSpan={0} style={{ textAlign: 'left' }}>
                    {dataSum.sdbhbhl}
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
            {tjxs && tjxs.includes('kfsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="库房"
                dataIndex="kfmc"
              />
            )}
            {tjxs && tjxs.includes('jcdsx') && (
              <Table.Column
                alignHeader="center"
                width={120}
                title="监测点"
                dataIndex="jcd"
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
             <Table.ColumnGroup title="温度" alignHeader="center">
            <Table.Column
              alignHeader="center"
              width={120}
              title="合格天数"
              dataIndex="wdbhhl"
            />
            <Table.Column
              alignHeader="center"
              width={120}
              title="不合格天数"
              dataIndex="wdbhbhl"
            />
            </Table.ColumnGroup>
            <Table.ColumnGroup title="湿度" alignHeader="center">
            <Table.Column
              alignHeader="center"
              width={120}
              title="合格天数"
              dataIndex="sdbhhl"
            />
            <Table.Column
              alignHeader="center"
              width={120}
              title="不合格天数"
              dataIndex="sdbhbhl"
            />
            </Table.ColumnGroup>
          </Table>
        </div>
      </div>
    </div>
  );
});

export default Wsdtj;

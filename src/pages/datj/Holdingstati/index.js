import React, { useEffect, useState } from 'react';
import {
  Form,
  Grid,
  Input,
  Table,
  Select,
  Button,
  Icon,
  DatePicker,
} from '@alifd/next';
import { injectIntl } from 'react-intl';
import moment, { isMoment } from 'moment';
import { observer } from 'mobx-react';
import EditDailog from './EditDailog';
import LoginStore from '../../../stores/system/LoginStore';
import Store from '../../../stores/datj/Holdingstati';
import './index.less';
import ZxjstjStore from '@/stores/datj/ZxjstjStore';
import { useIntl, FormattedMessage } from 'umi';
import ExportJsonExcel from 'js-export-excel';

const { Row, Col } = Grid;
const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];
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
const ArchiveInfo = observer((props) => {
  //  const {intl: {formatMessage}} = props;
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const { data, columns, loading, pageno, pagesize, seardataSource } = Store;
  const [qzhdata, setQzhdata] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
  /**
   * 保管期限数据源
   */
  const [bgqxdata, setBgqxdata] = useState([]);
  const { userinfo } = LoginStore;
  let timestamp = Date.now();

  useEffect(() => {
    Store.setColumns([
      {
        title: '名称',
        dataIndex: 'name',
        width: 400,
      },
      {
        title: '案卷级(卷)',
        dataIndex: 'name',
        width: 250,
      },
      {
        title: '卷内(条)',
        dataIndex: 'dakbmc',
        width: 250,
      },
      {
        title: '一文一件目录数(件)',
        dataIndex: 'dakbmc',
        width: 250,
      },
      {
        title: '数字化案卷数(卷)',
        dataIndex: 'dakbmc',
        width: 250,
      },
      {
        title: '数字化卷内数(条)',
        dataIndex: 'dakbmc',
        width: 250,
      },
      {
        title: '数字化件数(件)',
        dataIndex: 'dakbmc',
        width: 250,
      },
      {
        title: '卷数字化件数(页)',
        dataIndex: 'dakbmc',
        width: 250,
      },
      {
        title: '卷数字化幅面数(页)',
        dataIndex: 'dakbmc',
        width: 250,
      },
      {
        title: '件数数字化幅面数(页)',
        dataIndex: 'dakbmc',
        width: 250,
      },
      {
        title: '卷总容量(G)',
        dataIndex: 'dakbmc',
        width: 250,
      },
      {
        title: '件总容量(G)',
        dataIndex: 'dakbmc',
        width: 250,
      },
      {
        title: '总容量(G)',
        dataIndex: 'dakbmc',
        width: 250,
      },
    ]);
    Store.queryQzhlist().then(() => {
      debugger;
      const dataSource = Store.qzhlist.map((item) => ({
        label: item.qzh,
        value: item.qzh,
      }));
      setQzhdata(dataSource);
      // Store.setDataSource(dataSource)
    });
    Store.findlist().then(() => {
      Store.queryForPage();
    });
    Store.getBgqx().then((data) => {
      const list = [];
      data.forEach((element) => {
        list.push(element.mc);
      });
      setBgqxdata(list);
    });
  }, []);

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = (values) => {
    const { qzh, startnd, endnd, bgqxs, ...params } = values;
    if (qzh && qzh.length == 0) {
      params.qzh = qzh.join(',');
    }
    if (startnd && isMoment(startnd)) {
      params.startnd = moment(startnd).format('YYYY');
    }
    if (endnd && isMoment(endnd)) {
      params.endnd = moment(endnd).format('YYYY');
    }
    if (bgqxs) {
      //不含有其他
      if (bgqxs.indexOf('qt') == -1) {
        params.bgqxs1 = bgqxs.join(',');
      } else {
        //含有有两种情况，1是只有其他，2是除了选择其他，还选择了别的保管期限
        if (bgqxs.length === 1) {
          params.bgqxs3 = bgqxdata.join(',');
        } else {
          const list = bgqxs.filter((f) => f != 'qt');
          const datas = bgqxdata.filter((f) => {
            return list.every((e) => {
              return e !== f;
            });
          });
          params.bgqxs3 = datas.join(',');
        }
      }
      console.log(params);
    }
    Store.setParams(params);
  };

  const handleSearch = (value) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const searchTimeout = setTimeout(() => {
      let dataSource = [];
      value
        ? Store.queryQzhlist(value).then(() => {
            debugger;
            dataSource = Store.qzhlist.map((item) => ({
              label: item.qzh,
              value: item.qzh,
            }));
            setQzhdata(dataSource);
          })
        : setQzhdata([]);
    }, 100);
  };
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
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    Store.setSelectRows(selectedRowKeys, records);
  };

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = () => {
    const json = { whrid: userinfo.id, whr: userinfo.userName, whsj: moment() };
    Store.showEditForm('add', json);
  };
  const downloadExcel = () => {
    Store.downloadExcel(data);
  };
  /**
   * 起始年度变动
   * @param {*} value
   */
  const onStartNdChange = (value) => {
    if (value) {
      setCurrentDate(value);
    } else {
      setCurrentDate(null);
    }
  };
  /**
   * 禁止选择的年度
   * @param {*} date
   * @param {*} view
   */
  const disabledDate = (date, view) => {
    switch (view) {
      case 'year':
        if (currentDate) {
          return date.year() < currentDate.year();
        } else {
          return false;
        }
      default:
        return false;
    }
  };
  // end **************
  return (
    <div className="hall-regist">
      <div className="control">
        <br />
        <Form inline style={{ marginTop: '15px' }}>
          <FormItem label="全宗号:">
            <Select
              mode="multiple"
              name="qzh"
              placeholder="全宗号"
              showSearch
              onSearch={handleSearch}
              style={{ width: 200 }}
              onClear={true}
              hasClear
            >
              {/* <Select.Option key={1} value={'all'}>
                全部
              </Select.Option> */}
              {qzhdata.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
          <FormItem label="全宗名称:">
            <Input
              name="qzmc"
              style={{ width: 180 }}
              placeholder="请输入全宗名称"
              hasClear
            />
          </FormItem>
          <FormItem label="年度起始:">
            <DatePicker.YearPicker
              name="startnd"
              defaultValue={moment().year}
              hasClear
              onChange={onStartNdChange}
            />
          </FormItem>
          <FormItem label="年度结束:">
            <DatePicker.YearPicker
              name="endnd"
              disabledDate={disabledDate}
              defaultValue={moment().year}
              hasClear
            />
          </FormItem>
          <FormItem label="保管期限:">
            <Select
              name="bgqxs"
              style={{ width: 180 }}
              placeholder="请选择保管期限"
              mode="multiple"
              hasClear
            >
              {bgqxdata.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
              <Select.Option key={1} value={'qt'}>
                其他
              </Select.Option>
            </Select>
          </FormItem>
          <FormItem label=" ">
            <Form.Submit type="primary" onClick={doSearchAction}>
              查询
            </Form.Submit>
          </FormItem>
        </Form>
      </div>
      <div className="main-content">
        <div className="btns-control">
          <Button type="primary" onClick={downloadExcel}>
            {' '}
            <Icon type="download" />
            导出EXCEL
          </Button>
        </div>
        <div className="table-container">
          <Table
            tableLayout="fixed"
            isZebra={true}
            // $work-context-heigth-41px, 41px为表头高度
            maxBodyHeight="calc(100vh - 259px)"
            dataSource={data}
            fixedHeader
            loading={loading}
          >
            <Table.Column
              alignHeader="center"
              width={120}
              title="名称"
              dataIndex="name"
            />
            <Table.ColumnGroup title="案卷级" alignHeader="center">
              <Table.Column
                alignHeader="center"
                width={90}
                title="案卷(卷)"
                dataIndex="ajtms"
              />
              <Table.Column
                alignHeader="center"
                width={90}
                title="卷内(条)"
                dataIndex="jntms"
              />
            </Table.ColumnGroup>
            <Table.Column
              alignHeader="center"
              width={110}
              title="一文一件(件)"
              dataIndex="ywyjtms"
            />
            <Table.ColumnGroup title="载体数量(页)" alignHeader="center">
              <Table.Column
                alignHeader="center"
                width={90}
                title="案卷(页)"
                dataIndex="ajtmys"
              />
              <Table.Column
                alignHeader="center"
                width={100}
                title="一文一件(页)"
                dataIndex="ywyjtmys"
              />
            </Table.ColumnGroup>
            <Table.ColumnGroup title="数字化" alignHeader="center">
              <Table.Column
                alignHeader="center"
                width={90}
                title="案卷(卷)"
                dataIndex="szhantms"
              />
              <Table.Column
                alignHeader="center"
                width={100}
                title="卷内(条)"
                dataIndex="szhjntms"
              />
              <Table.Column
                alignHeader="center"
                width={100}
                title="一文一件(件)"
                dataIndex="szhywyyjtms"
              />
              <Table.Column
                alignHeader="center"
                width={100}
                title="案卷(页)"
                dataIndex="szhantmys"
              />
              <Table.Column
                alignHeader="center"
                width={100}
                title="一文一件(页)"
                dataIndex="szhywyjtms"
              />
            </Table.ColumnGroup>
            <Table.Column
              alignHeader="center"
              width={100}
              title="数字化率(%)"
              dataIndex="szhl"
            />
            <Table.ColumnGroup title="总容量" alignHeader="center">
              <Table.Column
                alignHeader="center"
                width={90}
                title="卷(G)"
                dataIndex="zrlg"
              />
              <Table.Column
                alignHeader="center"
                width={90}
                title="件(G)"
                dataIndex="zrlj"
              />
              <Table.Column
                alignHeader="center"
                width={90}
                title="总容量(G)"
                dataIndex="zrlz"
              />
            </Table.ColumnGroup>
          </Table>
        </div>
      </div>
      <EditDailog />
    </div>
  );
});

export default ArchiveInfo;

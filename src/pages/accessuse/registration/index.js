import React, { useEffect, useState } from 'react';
import { Search, Tab, Input, Button, Form, DatePicker, Upload, Table, Pagination, Icon, Grid ,Message} from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import EditDailog from './EditDailog';
import LoginStore from '../../../stores/system/LoginStore';
import Store from "../../../stores/accessuse/RegistrationStore";
import E9Config from '../../../utils/e9config';
import './index.less'
import AreceiveStore from "@/stores/Ucas/AreceiveStore";
import styles from "@/pages/UcasCLJS/Areceive/Areceive.module.less";
import HomeStore from "@/stores/Ucas/HomeStore";
import UnitproStore from "@/stores/Ucas/UnitproStore";
const { Row, Col } = Grid;

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
const ArchiveInfo = observer(props => {
  const { intl: { formatMessage } } = props;
  const { data, columns, loading, pageno, pagesize } = Store;
  const { userinfo } = LoginStore;
  const [complete, setComplete] = useState(false);
  const [prefix, setPrefix] = useState('');
  const [preview, setPreview] = useState(false);
  const [fileData, setFileData] = useState([]);

  useEffect(() => {
    Store.setColumns([{
      title: "登记号",
      dataIndex: "lsh",
      width: 100,
    },
      {
        title: "查阅人",
        dataIndex: "cyrxm",
        width: 100
      },  {
        title: "证件",
        dataIndex: "zjmc",
        width: 100
      },  {
        title: "证件号",
        dataIndex: "zjhm",
        width: 200
      },  {
        title: "性质",
        dataIndex: "jyrxz",
        width: 80
      },  {
        title: "联系电话",
        dataIndex: "lxdh",
        width: 150
      },  {
        title: "单位",
        dataIndex: "dw",
        width: 250
      }, {
        title: "家庭住址",
        dataIndex: "jtzz",
        width: 200
      },{
        title: "利用目的",
        dataIndex: "lymd",
        width: 100
      },{
        title: "登记日期",
        dataIndex: 'djrq',
        width: 50,
      },{
        title: formatMessage({ id: 'e9.pub.whsj' }),
        dataIndex: 'whsj',
        width: 150,
      }]);
    Store.findSzjd().then(() => { Store.findDakList().then(() => { Store.queryForPage(); }); });
  }, []);

  // begin ******************** 以下是事件响应
  /**
   * 查询条件按钮点击事件
   * @param {*} values
   * @param {*} errors
   */
  const doSearchAction = ((values) => {
    Store.setParams(values);
  });

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

  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
    Store.setRegistPage(true);
    Store.setDjdid();
    Store.setCdnrNum();
    const json = { whrid: userinfo.id, whr: userinfo.userName, whsj: moment() };
    Store.showEditForm('add', json);
  });


  /**
   * 响应删除事件
   * @param {*} id
   */
  const onDeleteAction = (id) => {
    deleteData(id);
  };

  /**
   * 响应删除事件
   * @param {*} id
   */
  const onDeleteActionTop = () => {
    if(Store.selectRowRecords.length==0){
      Message.warning('请选择一条数据!');
      return;
    }
    for (let i = 0; i < Store.selectRowRecords.length; i++) {
      const  id =  Store.selectRowRecords[i].id;
      deleteData(id);
    }
  };
  /**
   * 响应编辑事件
   * @param {*} record
   */
  const onEditAction = (record) => {
    Store.setRegistPage(true);
    Store.queryCdnrNub(record.id);
    edit(record);
    Store.setBase64(record);
  };
  /**
   * 响应编辑事件
   * @param {*} record
   */
  const onEditActionTop = () => {
    if(Store.selectRowRecords.length==0){
      Message.warning('请选择一条数据!');
      return;
    }
    const  record = Store.selectRowRecords[0];
    Store.setRegistPage(true);
    Store.queryCdnrNub(record.id);
    edit(record);
    Store.setBase64(record);
  };
  // end ********************

  // begin *************以下是自定义函数区域
  const fileSelect = values => {
    const count = values.length;
    HomeStore.changeCount(count);
  };
  // 自定义文件上传
  const customRequest = option => {
    HomeStore.uploadFiles(option)
        .then(res => {
          const startCount = HomeStore.count;
          HomeStore.changeCount(startCount - 1);
          if (res.data.result.length > 0) {
            // 文件上传成功
            UnitproStore.findXml(AreceiveStore.unitId, 'ucas_xmlbf').then(() => {});
            UnitproStore.changeUnitdajsData(res.data.result);
          }
          const endCount = HomeStore.count;
          if (endCount === 0) {
            setPrefix('');
            setComplete(false);
            Message.success(formatMessage({ id: 'eps.unitpro.uploadComplete' }));
            // 开始进行检测
            HomeStore.fileDetection(AreceiveStore.indexType, AreceiveStore.unitId, 'ucas_xmlbf');
          }
        })
        .catch(err => {
          HomeStore.changeCount(0);
          setComplete(false);
          if (err.response) {
            Message.error(err.response.data.message);
          }
        });
    return {
      abort () {
      },
    };
  };

  /**
   * 文件上传之前
   * @param file
   * @param options
   * @returns {boolean}
   */
  const before = (file, options) => {
    let fileId = `${AreceiveStore.unitId}`;
    const fileNumbers = [];
    const filePrefix = file.name.split('.')[0];
    const fileSuffix = `.${file.name.split('.')[1]}`;
    filePrefix.split('').forEach(item => {
      fileId = `${fileId}${item.charCodeAt()}`;
    });

    options.data.fileId = fileId;
    HomeStore.fileData.forEach(item => {
      fileNumbers.push(item.macode);
      item.sfhg = 0;
    });
    if (fileNumbers.length === 0 || fileNumbers.includes(filePrefix) || fileSuffix === '.xml') {
      if ((prefix !== '' && filePrefix === prefix) || prefix === '') {
        if (!complete) {
          setComplete(true);
          Message.notice(formatMessage({ id: 'eps.unitpro.startUploadFile' }));
        }
        options.filename = 'file';
        options.file = file;
        customRequest(options);
        return true;
      }
    }
    Message.warning(formatMessage({ id: 'eps.unitpro.uploadFileMistake' }));
    return false;
  };
  /**
   * 删除操作
   * @param {* string} id
   */
  const deleteData = (id) => {
    Store.delete(id);
  };

  /**
   *  修改记录
   * @param {* User} record
   */
  const edit = ((record) => {
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });

    json.whrid = userinfo.id;
    json.whr = userinfo.userName;
    json.whsj = moment();
    Store.showEditForm('edit', json);
    Store.setDjdid(record.id);
  });
  const mainPage = () => {
    return (
        <div className="hall-regist">
          <div className="control">

            <Form inline style={{marginTop:"15px"}}>
              <FormItem  label="查阅人姓名:">
                <Input name="text_dalydj_cyrxm" style={{width: 180}} placeholder="请输入查阅人姓名"/>
              </FormItem>
              <FormItem label="证件号码:">
                <Input name="cx_zjhm" style={{width: 180}} placeholder="请输入证件号码"/>
              </FormItem>
              <FormItem label="登记日期:">
                <DatePicker name="cx_kssqrq"  placeholder="起始日期" />
              </FormItem>
              <FormItem label="至:">
                <DatePicker name="cx_jssqrq"  placeholder="结束日期" />
              </FormItem>
              <FormItem label=" ">
                <Form.Submit type="primary" onClick={doSearchAction}>查询</Form.Submit>
              </FormItem>
            </Form>

          </div>
          <div className="main-content">
            <div className="btns-control">

              <div className="custome-btn" onClick={onAddAction}><img src={require('../../../styles/assets/img/hall-regist/icon_dengji.png')}/>登记</div>
              <div className="custome-btn"  onClick={onEditActionTop}><img src={require('../../../styles/assets/img/hall-regist/icon_xiugai.png')}/>修改</div>
              <div className="custome-btn" onClick={onDeleteActionTop}><img src={require('../../../styles/assets/img/hall-regist/icon_shanchu.png')}/>删除</div>
              <div className="custome-btn"><img src={require('../../../styles/assets/img/hall-regist/icon_tiaodang.png')}/>调档</div>
              <div className="custome-btn"><Upload
                  multiple
                  onSelect={fileSelect}
                  data={{ unitId: AreceiveStore.unitId, protypeId: AreceiveStore.unitType, index: 'ucas_xmlbf' }}
                  beforeUpload={before}
                  request={() => {}}
                  className={styles.uploadBlock}
              >
                <Button type="primary"><Icon id="upload" />上传文件</Button>
              </Upload>
              </div>
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
                  rowSelection={{ onChange: onTableRowChange, selectedRowKeys: Store.selectRowKeys }}
              >
                {columns.map(col =>
                    <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
                )}
                <Table.Column cell={renderTableCell} width="100px" lock="right" />
              </Table>
            </div>
            <Pagination shape="arrow-only" defaultCurrent={1}  className="paginate"
                        current={pageno}
                        pageSize={pagesize}
                        total={data.total}
                        onChange={onPaginationChange}
                        shape={E9Config.Pagination.shape}
                        pageSizeSelector={E9Config.Pagination.pageSizeSelector}
                        pageSizePosition={E9Config.Pagination.pageSizePosition}
                        onPageSizeChange={onPageSizeChange}
                        popupProps={E9Config.Pagination.popupProps}
                        totalRender={total => <span className="pagination-total"> {`${formatMessage({ id: 'e9.pub.total' })}：${total}`}</span>}
            />
          </div>
        </div>);
  }
  return (
      Store.showRegistPage?  <EditDailog  /> : mainPage()
  );
});

export default injectIntl(ArchiveInfo);
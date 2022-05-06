import React, { useEffect } from 'react';
import { Search, Tab, Input, Button, Form, DatePicker, Checkbox, Table, Pagination, Icon, Grid } from '@alifd/next';
import { injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import EditDailog from './EditDailog';
import ContainerTitle from '../../../components/ContainerTitle';
import LoginStore from '../../../stores/system/LoginStore';
import Store from "../../../stores/datj/HoldingGroup";
import E9Config from '../../../utils/e9config';
import './index.less'
import { useIntl, FormattedMessage } from 'umi';
import ExportJsonExcel from 'js-export-excel';
import SysStore from '@/stores/system/SysStore';


const { Row, Col } = Grid;

const FormItem = Form.Item;

const ArchiveInfo = observer(props => {
    // const {intl: {formatMessage}} = props;
    const intl = useIntl();
    const formatMessage = intl.formatMessage;
    const { data, columns, loading, pageno, pagesize } = Store;
    const userinfo = SysStore.getCurrentUser();
    useEffect(() => {
        Store.setColumns([{
            title: "编号",
            dataIndex: "code",
            width: 200,
            lock: true
        }, {
            title: "名称",
            dataIndex: "name",
            width: 250
        }, {
            title: "档案库名称",
            dataIndex: "dakbmc",
            width: 250
        }]);
        Store.findlist();
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
                <a href="javascript:;" onClick={() => onEditAction(record)}>
                    <FormattedMessage id="e9.btn.edit" />
                </a>
                <a href="javascript:;" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.id)}>
                    <FormattedMessage id="e9.btn.delete" />
                </a>
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
        const json = { whrid: userinfo.id, whr: userinfo.userName, whsj: moment() };
        Store.showEditForm('add', json);
    });

    /**
     * 点击修改密码按钮事件响应
     */
    const onChangePswBtnAction = () => {
        if (!Store.selectRowRecords || Store.selectRowRecords.length < 1) {
            IceNotification.info({
                message: formatMessage({ id: 'e9.info.info' }),
                description: formatMessage({ id: 'e9.info.selectNone' })
            });
            return;
        }
        if (Store.selectRowRecords.length > 1) {
            IceNotification.info({
                message: formatMessage({ id: 'e9.info.info' }),
                description: formatMessage({ id: 'e9.info.selectOneOnly' })
            });
            return;
        }
        const record = Store.selectRowRecords[0];
        const json = { id: record.id, userName: record.userName };
        Store.setPasswordValues(json);
        Store.showPasswordDailog(true);
    };

    /**
     * 点击角色设置按钮事件响应
     */
    const onSetRoleAction = () => {
        if (!Store.selectRowRecords || Store.selectRowRecords.length < 1) {
            IceNotification.info({
                message: formatMessage({ id: 'e9.info.info' }),
                description: formatMessage({ id: 'e9.info.selectNone' })
            });
            return;
        }
        if (Store.selectRowRecords.length > 1) {
            IceNotification.info({
                message: formatMessage({ id: 'e9.info.info' }),
                description: formatMessage({ id: 'e9.info.selectOneOnly' })
            });
            return;
        }
        Store.showRsDailog(true);
    };

    /**
     * 响应删除事件
     * @param {*} id
     */
    const onDeleteAction = (id) => {
        deleteData(id);
    };

    /**
     * 响应编辑事件
     * @param {*} record
     */
    const onEditAction = (record) => {
        Store.setDakid(record.dakid)
        edit(record);
    };

    // end ********************

    // begin *************以下是自定义函数区域
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

        
    });

    // end **************
    return (
        <div className="hall-regist">
            <div className="control">

                <Form inline style={{ marginTop: "15px" }}>
                    <FormItem label="编号:">
                        <Input name="code" style={{ width: 180 }} placeholder="请输入编号" />
                    </FormItem>
                    <FormItem label="名称:">
                        <Input name="name" style={{ width: 180 }} placeholder="请输入名称" />
                    </FormItem>
                    <FormItem label=" ">
                        <Form.Submit type="primary" onClick={doSearchAction}>查询</Form.Submit>
                    </FormItem>
                </Form>

            </div>
            <div className="main-content">
                <div className="btns-control">

                    <Button type="primary" style={{ marginRight: 10 }} onClick={onAddAction}>
                        <Icon type="add" />新增
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
                        rowSelection={{ onChange: onTableRowChange, selectedRowKeys: Store.selectRowKeys }}
                    >
                        {columns.map(col =>
                            <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
                        )}
                        <Table.Column cell={renderTableCell} width="100px" lock="right" />
                    </Table>
                </div>
                <Pagination shape="arrow-only" defaultCurrent={1} className="paginate"
                    current={pageno}
                    pageSize={pagesize}
                    total={data.total}
                    onChange={onPaginationChange}
                    shape={E9Config.Pagination.shape}
                    pageSizeSelector={E9Config.Pagination.pageSizeSelector}
                    pageSizePosition={E9Config.Pagination.pageSizePosition}
                    onPageSizeChange={onPageSizeChange}
                    popupProps={E9Config.Pagination.popupProps}
                    totalRender={total => <span
                        className="pagination-total"> {`${formatMessage({ id: 'e9.pub.total' })}：${total}`}</span>}
                />
            </div>
            <EditDailog />
        </div>

    );
});

export default ArchiveInfo;

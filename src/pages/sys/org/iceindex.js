import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Table, Icon, Button } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import ContainerTitle from '../../../components/ContainerTitle';
import LoginStore from '../../../stores/system/LoginStore';
import EditDailog from './EditDailog';
import OrgStore from '../../../stores/user/OrgStore';

/**
 * 组织机构管理
 * @Date: 2020/05/28 15:45
 * 替换新样式
 * @Version: 1.0
 */
const Org = observer(props => {
    const { intl: { formatMessage } } = props;
    const { loading, columns } = OrgStore;
    const { userinfo } = LoginStore;
    const OrgType = {
        A: '单位',
        B: '部门',
    };
    const umid = 'usermrg003';
    useEffect(() => {
        OptrightStore.getFuncRight(umid);
        OrgStore.setColumns([{
            title: formatMessage({ id: 'e9.sys.org.orgCode' }),
            dataIndex: 'orgCode',
            width: 120,
            cell: (value, index, record) => {
                if (record.children) {
                    return <div><Icon style={{ cursor: 'pointer', marginRight: '2px' }} onClick={() => OrgStore.toggleExpand(record)} type={OrgStore.openRowKeys.indexOf(record.id) > -1 ? 'arrow-down' : 'arrow-right'} size="xs" />{value}</div >;
                }
                return value;
            },
        }, {
            title: formatMessage({ id: 'e9.sys.org.orgName' }),
            dataIndex: 'orgName',
            width: 200,
        }, {
            title: formatMessage({ id: 'e9.sys.org.orgType' }),
            dataIndex: 'orgType',
            width: 100,
            cell: (value) => (OrgType[value]),
        }, {
            title: formatMessage({ id: 'e9.sys.org.orgQyrq' }),
            dataIndex: 'orgQyrq',
            width: 120,
        }, {
            title: formatMessage({ id: 'e9.sys.org.orgTyrq' }),
            dataIndex: 'orgTyrq',
            width: 120,
        }, {
            title: formatMessage({ id: 'e9.pub.whr' }),
            dataIndex: 'whr',
            width: 120,
        }, {
            title: formatMessage({ id: 'e9.pub.whsj' }),
            dataIndex: 'whsj',
            width: 200,
        }]);
        OrgStore.queryData();
        OrgStore.queryUser();
    }, []);


    // begin ******************** 以下是事件响应

    /**
     * 最后一列操作列绘制修改 删除按钮
     * @param {*} value
     * @param {*} index
     * @param {*} record
     */
    const renderTableCell = (value, index, record) => {
        return (
            <div>
                {OptrightStore.hasRight(umid, 'a102') && <a href="javascript:void(0)" onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>}
                {OptrightStore.hasRight(umid, 'a103') && <a href="javascript:void(0)" style={{ marginLeft: '5px' }} onClick={() => onDeleteAction(record.id)}><FormattedMessage id="e9.btn.delete" /></a>}
            </div>);
    };

    /**
     * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
     * @param {*} selectedRowKeys
     * @param {*} records
     */
    const onTableRowChange = (selectedRowKeys, selectRowRecords) => {
        OrgStore.setSelectRows(selectedRowKeys, selectRowRecords);
    };

    /**
     * 点击新增按钮事件响应
     */
    const onAddAction = (() => {
        let fid = '';
        if (OrgStore.selectRowRecords && OrgStore.selectRowRecords.length) {
            if (OrgStore.selectRowRecords.length > 1) {
                IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectOneOnly' }) });
                return;
            }
            fid = OrgStore.selectRowRecords[0].id;
        }
        const json = { fid, orgType: 'B', orgQyrq: moment().format('YYYY-MM-DD'), whrid: userinfo.id, whr: userinfo.userName, whsj: moment() };
        OrgStore.showEditForm('add', json);
    });


    /**
     * 响应删除事件
     * @param {*} id
     */
    const onDeleteAction = (id) => {
        OrgStore.delete(id);
    };
    /**
     * 响应编辑事件
     * @param {*} record
     */
    const onEditAction = (record) => {
        edit(record);
    };

    // end ********************

    // begin *************以下是自定义函数区域

    const edit = (record) => {
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
        OrgStore.showEditForm('edit', json);
    };

    return (
        <div className="workpage">
            <ContainerTitle
                title={formatMessage({ id: 'e9.sys.org.title' })}
                mainroute="/sysuser"
                umid="usermrg003"
                extra={
                    <span>
            {/* <Button.Group>
              {OptrightStore.hasRight(umid, 'a202') && <Button type="primary" ><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" /></Button>}
              {OptrightStore.hasRight(umid, 'a201') && <Button type="primary" ><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" /></Button>}
            </Button.Group> */}
                        <Button.Group style={{ marginLeft: '10px' }} >
              {OptrightStore.hasRight(umid, 'a101') && <Button type="primary" onClick={onAddAction}><Icon type="add" /><FormattedMessage id="e9.btn.add" /></Button>}
            </Button.Group>
          </span>
                }
            />
            <div className="workcontain">
                <div className="right rightmax">
                    <div className="workspace">
                        <Table
                            tableLayout="fixed"
                            maxBodyHeight="calc(100vh - 259px)"
                            dataSource={OrgStore.data}
                            fixedHeader
                            isTree
                            openRowKeys={OrgStore.openRowKeys}
                            loading={loading}
                            rowSelection={{ onChange: onTableRowChange, selectedRowKeys: OrgStore.selectRowKeys }}
                        >

                            {columns.map(col =>
                                <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
                            )}
                            <Table.Column cell={renderTableCell} width="100px" lock="right" />
                        </Table>
                    </div>
                </div>
            </div>
            <EditDailog />
        </div>
    );
});

export default injectIntl(Org);

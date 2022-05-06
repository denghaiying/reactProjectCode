/* eslint-disable react/no-unused-state, no-plusplus */
/**
 * author caijc
 * 函数式组件，业界趋势是函数式组件
 */
import React, {useEffect} from "react";
import {Table, Icon, Pagination, Button} from "@alifd/next";
import IceContainer from "@icedesign/container";
import {FormattedMessage, injectIntl} from "react-intl";

import ContainerTitle from "../../../components/ContainerTitle";

const formItemLayout = {
    labelCol: {
        fixedSpan: 6
    },
    wrapperCol: {
        span: 18
    }
};
/**
 * @param {*} props react props参数
 */
const ArchiveInfoGrid = props => {
    const {
        dataSource,
        onTableRowChange,
        colums,
        onEditAction,
        onAddAction,
        remove
    } = etlStore;
    const {
        // eslint-disable-next-line no-unused-vars
        intl: {formatMessage}
    } = props;
    useEffect(() => {
        // etlStore.setColums();
      
    }, []);

    /**
     * 列信息
     */
        // todo:列信息应该从store当中获取，国际化？

        // eslint-disable-next-line no-unused-vars
    const onChange = (...args) => {
            console.log(...args);
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
                    <FormattedMessage id="e9.btn.edit"/>
                </a>
                <a
                    href="javascript:;"
                    style={{marginLeft: "5px"}}
                    onClick={() => remove(record.id)}
                >
                    <FormattedMessage id="e9.btn.delete"/>
                </a>
            </div>
        );
    };

    // eslint-disable-next-line no-shadow
    const intlTitle = colums => {
        colums.map(o => {
            o.title = o.title; // formatMessage({ id: o.title });
            return o;
        });
    };

    const height=document.body.clientHeight-200;
    const width=document.body.clientWidth-260;
    // 对colums title列进行国际化
    intlTitle(colums);

    return (
             <IceContainer style={{ padding: '0', height: height, width: width, marginBottom: '0' }}>
            <ContainerTitle
                title={formatMessage({id: "e9.etl.archiveInfo.title"})}
            />
            <div style={{margin: "5px"}}>
                <Button.Group>
                    <Button type="secondary" onClick={onAddAction}>
                        <Icon type="add"/>
                        <FormattedMessage id="e9.btn.add"/>
                    </Button>
                </Button.Group>
            </div>

            <Table
                dataSource={dataSource}
                fixedHeader
                rowSelection={{onChange: onTableRowChange}}
            >
                {colums.map(o => (
                    <Table.Column alignHeader="center" key={o.dataIndex} {...o} />
                ))}
                <Table.Column cell={renderTableCell} width="100px" lock="right"/>
            </Table>
        </IceContainer>
    );
};

const styles = {
    headRow: {
        marginBottom: "10px"
    },
    icon: {
        color: "#2c72ee",
        cursor: "pointer"
    },
    deleteIcon: {
        marginLeft: "20px"
    },
    center: {
        textAlign: "right"
    },
    button: {
        borderRadius: "4px"
    },
    pagination: {
        marginTop: "20px",
        textAlign: "right"
    }
};

export default injectIntl(ArchiveInfoGrid);

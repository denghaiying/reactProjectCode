import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import { Select, Button, Modal, Tooltip, Input, Form, Row, Col } from 'antd';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import JcjgErrService from './Service/JcjgErrService';
import { SmileOutlined, FundViewOutlined } from '@ant-design/icons';
import './index.scss';
import IpapplyStore from '../../../stores/des/IpapplyStore';

const JcjgErrDialog = observer((props) => {

    const { errvisable, SetErrVisable, modaltitle, mxeditRecord } = props;

    const ref = useRef();

    const [source, setSource] = useState([]);

    useEffect(() => {
        BindingTableColumns();
        BindingTableData();
    }, []);

    const displayedit = (record) => {
        switch (record.type) {
            case '101':
            case '301':
            case '302':
            case '303':
            default:
                return 1;
            case '201':
            case '202':
            case '203':
            case '204':
                return 2;
        }
    }

    const fileColumns: EpsSource[] = [
        {
            title: '文件名称',
            code: 'filename',
            align: 'center',
            width: 200,
            formType: EpsFormType.None,
        },
        {
            title: '文件类型',
            code: 'type',
            align: 'center',
            width: 200,
            formType: EpsFormType.None,
        },
        {
            title: '文件路径',
            code: 'filepath',
            align: 'center',
            width: 200,
            formType: EpsFormType.None,
        },
        {
            title: '页数',
            code: 'page',
            align: 'center',
            width: 200,
            formType: EpsFormType.None,
        },
        {
            title: '错误内容',
            code: 'context',
            align: 'center',
            width: 200,
            fixed: 'right',
            formType: EpsFormType.None,
        },
    ]
    const BindingTableColumns = () => {
        const type = displayedit(mxeditRecord);
        if (type) {
            const columns = [];
            IpapplyStore.zhuluData.forEach(element => {
                columns.push({
                    title: element.name,
                    code: element.name,
                    align: 'center',
                    formType: EpsFormType.Input,
                    width: 200,
                });
            });
            columns.push({
                title: '错误内容',
                code: 'context',
                align: 'center',
                width: 200,
                fixed: 'right',
                formType: EpsFormType.None,
            });
            setSource(columns);
        } else {
            setSource(fileColumns);
        }
    };

    const BindingTableData = () => {
        const tableStore = ref.current?.getTableStore();
        tableStore.findByKey(tableStore.key, 1, tableStore.size, mxeditRecord);
    };


    // 按钮和查询框区域(新增、编辑、删除按钮)
    const tableProp: ITable = {
        tableSearch: false,
        disableCopy: true,
        disableDelete: false,
        disableEdit: true,
        disableAdd: true,
    };

    // 表单名称
    const title: ITitle = {
        name: '检测结构'
    };

    const onExcelClick = () => {

    };

    //自定义布局组件（上班、下班按钮）
    const customAction = (store: EpsTableStore) => {
        return ([
            <>
                {/* <Button type="primary" style={{ marginLeft: '10px', fontSize: '12px', marginTop: '10px' }}
                    icon={<SmileOutlined />} onClick={onExcelClick}>导出Excel</Button> */}
            </>
        ])
    };

    return (
        <Modal
            title={`${modaltitle}【浏览】`}
            onCancel={() => SetErrVisable(false)}
            footer={false}
            visible={errvisable}
            width={1200}
        >
            <EpsPanel
                initParams={{}}
                title={title}                    // 组件标题，必填
                source={source}                          // 组件元数据，必填
                tableProp={tableProp}                    // 右侧表格设置属性，选填
                tableService={JcjgErrService}           // 右侧表格实现类，必填
                formWidth={500}
                ref={ref}
                customAction={customAction}              // 自定义全局按钮（如新增、导入、查询条件、全局打印 等），选填
                tableAutoLoad={false}
            >
            </EpsPanel>
        </Modal>
    );

});
export default JcjgErrDialog;
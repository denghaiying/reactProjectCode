import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react";
import DwService from '../DwTableLayout/service/DwService'

import { TreeSelect} from 'antd';

export interface DwSelectLayoutProps {
    yhid: string

}

const DwSelect = observer((props: DwSelectLayoutProps) => {

    const [treeData, setTreeData]= useState([]);

    useEffect( () => {
        //  数据初始化
       let result =  DwService.findTree(props.yhid)
        setTreeData(result)
    }, [])
    return (
        <TreeSelect className="ant-tree-select-dropdown" treeData={treeData} {...props} ></TreeSelect>

    );
});

export default DwSelect;

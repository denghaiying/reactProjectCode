import React,{useState} from 'react';
import './index.less'
import { Input, Icon, Table, Pagination, Tab, Search, Button, Dropdown, Menu } from '@alifd/next'
import CollapseTree from "@/components/collapseTree";
import OfficeChild from './officeChild/index'
import AdvancedSearch from '@/components/advancedSearch'
import { observer } from "mobx-react";
import { FormattedMessage, injectIntl } from "react-intl";
import "./index.less";
import Store from "@/stores/appraisa/AppraisaManageStore";

/**
 * @Author: Caijc
 * @Date: 2019/9/16 15:45
 * @Version: 9.0
 * @Content:
 *   鉴定库
 */
const AppraisaManage = observer((props) => {
  const [isExpand, setExpand] = useState(true);
  const [drawVisible, setDrawVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  const {params}= Store;
  const dakid=params.id;
  const tmzt=3;
  const daparams={tmzt,dakid,...params}
  const getExpand = (data) => {       // 展开收起树
    this.setExpand( data)
  }
  const onSelectChange = (ids, records) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const treeData=[{
    key:"allAppraisa",
    title:"所有"
  },
  {
    key:"noAppraisa",
    title:"未鉴定"
  },
  {
    key:"doAppraisa",
    title:"已鉴定"
  }
]
  // end **************
  return (
    <div className="office-manage">
        <Tab defaultActiveKey="1">
          <Tab.Item title="档案库" key="1"></Tab.Item>
        </Tab>
        <div className={isExpand ? 'isExpand main-content' : 'main-content'}>
          <div className='left-tree'>
            <CollapseTree showLine treeData={treeData} getExpand={getExpand}></CollapseTree>
          </div>
          <div className="file-content">
            <OfficeChild daparams={daparams} showAdvance={() => {setDrawVisible(false)}}/>
            <hr style={{marginBottom: 15}}></hr>
            {/* <OfficeChild showAdvance={() => {setDrawVisible(false)}}/> */}
          </div>
        </div>
        {/* <AdvancedSearch drawVisible={drawVisible} changeVisible={() => {setDrawVisible(false)}}></AdvancedSearch>
       */}
      </div>
  );
});

export default injectIntl(AppraisaManage);

import React,{useState} from 'react';
import { observer } from "mobx-react";
import { FormattedMessage, injectIntl } from "react-intl";
import IceNotification from '@icedesign/notification';
import "./index.less";
import Datable from "../../../datable"
import {  Icon, Button, Dropdown, Menu, Message, Tab } from '@alifd/next'
import SelectDialStore from "@/stores/appraisa/DaxhSelStore";
import SelectDialog from "../../AppraisaApply/SelectDailog";
import DapubStore from '@/stores/dagl/DapubStore';
import { isDuration } from 'moment';

import { Input } from "antd";

const { Search } = Input;
/**
 * @Author: Caijc
 * @Date: 2019/9/16 15:45
 * @Version: 9.0
 * @Content:
 *   鉴定库
 */
const AppraisaChild = observer((props) => {
  const { intl: { formatMessage },queryparams } = props;
  const [isExpand, setExpand] = useState(true);
  const [drawVisible, setDrawVisible] = useState(false);
  const {dlgVisible, setDlgVisible} = SelectDialStore;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showMenus, setShowMenus] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [addBtnArr, setAddBtnArr] = useState([]);
  const [selectDialogParams, setSelectDialogParams] = useState([]);

  const [querykey, setQuerykey] = useState("");
  

  const {daparams}=props;
  const getExpand = (data) => {       // 展开收起树
    setExpand( data)
  }
  const onSelectChange = (ids, records) => {
    setSelectedRowKeys(selectedRowKeys);
  };


  const clickAdd = (item) => {      // 添加菜单
    let newAddArr = [...addBtnArr]
    if(newAddArr.includes(item)) {
      Message.show({type: 'warning', content: '请勿重复添加'})
      return
    } else {
      newAddArr.push(item)
      setAddBtnArr(newAddArr)
    }
  }
  const delBtn = (item) => {      // 删除菜单
    let newAddArr = [...addBtnArr]
    newAddArr.splice(newAddArr.findIndex(val => val === item), 1)
    setAddBtnArr(newAddArr);
  }

  const callback=(res)=>{
    console.log("res",res)
  }


  const onTableSearch=(val)=>{
    setQuerykey(val)
  }

  const doRunAction=()=>{
    if (!DapubStore.selectRowRecords || DapubStore.selectRowRecords.length < 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectNone' }) });
      return;
    }

  

    const params={dakid:daparams.dakid,ids:DapubStore.selectRowKeys.join(","),bmc:daparams.mbc,dakmc:daparams.mc }
    
    setSelectDialogParams(params);
    setShowMenus(false);
    setDlgVisible(true);
  }

    const menuMore = (
      <Menu>
        <Menu.Item icon={<Icon type="search" />}>搜索</Menu.Item>
        <Menu.Item icon={<Icon type="list" />}>显示列定制</Menu.Item>
        <Menu.Item icon={<Icon type="help" />}>帮助</Menu.Item>
      </Menu>
    )
    const data1 = []

    const render = (value, index, record) => {
      return (
        <div>
          <img src={require('../../../../../styles/assets/img/file-transfer/icon_copy.png')} alt="" style={{width: 16, cursor: "pointer"}}/>
          <img src={require('../../../../../styles/assets/img/file-transfer/icon_edit.png')} alt="" style={{width: 20, margin: '0 10px', cursor: "pointer"}}/>
          <img src={require('../../../../../styles/assets/img/file-transfer/icon_link.png')} alt="" style={{width: 16, cursor: "pointer"}}/>
        </div>
      )
    };
 
   
    const colorArr = ['#30B0D5', '#CFA32A', '#3F8EFF', '#1DA291', '#D1C61C', '#7A8EFC', '#3F8EFF', '#1DA291', '#30B0D5', '#7956EF', '#3F8EFF', '#8DDE04', '#3F8EFF',
                      '#1DA291', '#30B0D5', '#2C75DE', '#3F8EFF', '#1DA291', '#30B0D5', '#2C75DE', '#3CA2E3', '#1DA291', '#30B0D5', '#3F8EFF', '#2C75DE', '#94C343',
                      '#7956EF', '#3F8EFF', '#1DA291', '#94C343', '#FB9770', '#3F8EFF', '#8DDE04', '#1DA291', '#D1C61C', '#4BB4C3', '#1DA291', '#FB9770', '#259BAD',
                      '#1DA291', '#94C343', '#4B98E8', '#28A0B7', '#3F8EFF', '#30B0D5', '#3F8EFF', '#30B0D5', '#1DA291', '#7A8EFC', '#2C75DE', '#94C343', '#1DA291']
   const cancelMenu=()=>{
    setShowMenus(false);
    setEditFlag(false);
   }

  // end **************
  return (
    <div className={showMenus ? 'office-child show-menus' : 'office-child'}>
        <div className="condition">
        <Search placeholder="请输入搜索内容" style={{ width: 300, marginRight: 10 }} onSearch={(val) => onTableSearch(val)}/>
       
          {/* <Button type="primary" style={{marginRight: 10}}>
            <Icon type="add" style={{marginRight: 10}}/>新增
          </Button>
          <Button type="primary" style={{marginRight: 10}}>
            <Icon type="ashbin" style={{marginRight: 10}} />删除
          </Button>
          <Button type="primary" style={{marginRight: 10}}>
            <Icon type="refresh" style={{marginRight: 10}}/>刷新
          </Button> */}
          <Tab shape="wrapped" activeKey={setAddBtnArr[0]} excessMode="slide" className="add-btn-tab">
            {
              addBtnArr.map((item, index) => (
                <Tab.Item 
                  title={
                    <div onClick={doRunAction} className="add-btn"><img src={require('../../../../../styles/assets/img/icon_import_multi.png')}/>{item}
                      {editFlag ? <Icon type="delete-filling" className="del-icon" onClick={delBtn}/> : ''}
                    </div>
                  }
                  key={item}>
                  {item}
                </Tab.Item>
              ))
            }
          </Tab>
          <div className="menu-right" onClick={() => {setShowMenus(true)}}><Icon type="list" className="more"/>菜单</div>
        </div>
        <div className="table-container">
          <Datable querykey={querykey} params={...daparams} queryparams={queryparams}/>
        </div>
       <div className="menu-collapse">
          <div className="group">
            {
              props.menuArr.map((item, index) => (
                <li className="item" onClick={doRunAction} key={index} style={{backgroundColor: colorArr[index]}}>
                  <img src={require('../../../../../styles//assets/img/icon_import_white.png')}/>
                  <span>{item}</span>
                  <div className="shadow"></div>
                  {editFlag ? <img src={require('../../../../../styles/assets/img/icon_add_border.png')} className="add-icon" onClick={()=>clickAdd(item)}/> : ''}
                </li>
              ))
            }
          </div>
          <div className="btns">
            <Button type="primary" onClick={() => {setEditFlag(true)}}>编 辑</Button>
            <Button style={{margin: '0 20px'}} onClick={() => {setEditFlag(false)}}>重 置</Button>
            <Button onClick={cancelMenu}>取 消</Button>
          </div>
        </div>
        <span className="cover"></span>
        <SelectDialog params={selectDialogParams} callback={callback} visible={dlgVisible}/>
      </div>
  );
});

export default injectIntl(AppraisaChild);

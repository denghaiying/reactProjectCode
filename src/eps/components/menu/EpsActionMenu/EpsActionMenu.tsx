import { UnorderedListOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less'

export interface EpsActionMenuProps {
  menuProp: Array<any>;

}

function EpsActionMenu(props: EpsActionMenuProps) {

      const menuProp = props.menuProp || [];

      // 左侧树区域展开收缩
      const [showMenus, setShowMenus] = useState(false);
      const [addBtnArr, setAddBtnArr] = useState<Array<any>>([])
      const [editFlag, setEditFlag]= useState(false)
  
      const clickAdd = (item) => {      // 添加菜单
        let newAddArr: Array<any> = [...addBtnArr]
        if(newAddArr.includes(item)) {
          message.warning({type: 'warning', content: '请勿重复添加'})
          return
        } else {
          newAddArr.push(item)
          setAddBtnArr(newAddArr)
        }
      }
  
      const delBtn = (item) => {      // 删除菜单
        let newAddArr = [...addBtnArr]
        newAddArr.splice(newAddArr.findIndex(val => val === item), 1)
        setAddBtnArr(newAddArr)
      }
      //初始化按钮栏目按钮
      useEffect(() => {
        let newAddArr = [...menuProp]
        setAddBtnArr(newAddArr.filter(item=>item.toolbarShow))
      }, [menuProp.length])

  return (
    <>
      <span className="menu" onClick={() => setShowMenus(true)}><UnorderedListOutlined style={{marginRight: 5, fontSize: 16}}/>菜单</span>
      <div className="menu-collapse">
                <div className="group">
                  {
                    menuProp && menuProp.map((item, index) => (
                      <li className="item" key={index} style={{backgroundColor: item.color}}>
                      <img style={{width: '28px'}}  src={require(`@/styles/assets/img/${item.icon}.png`)} onClick={() => item.onClick(selectedRowKeys, tableStore, checkedRows)}/>
                        <span>{item.title}</span>
                        <div className="shadow"></div>
                        {editFlag ? <img src={require('@/styles/assets/img/icon_add_border.png')} className="add-icon" onClick={() => clickAdd(item)}/> : ''}
                      </li>
                    ))
                  }
                </div>
                <div className="btns">
                <Button type="primary" onClick={() => setEditFlag(true)}>编 辑</Button>
                  <Button style={{margin: '0 20px'}} onClick={() => setEditFlag(false)}>重 置</Button>
                  <Button onClick={() => {setShowMenus(false), setEditFlag(false)}}>取 消</Button>
                </div>
              <span className="cover"></span>
            </div>
    </>
  );
}

export default EpsActionMenu;

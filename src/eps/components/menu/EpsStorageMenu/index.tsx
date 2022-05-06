import React, { ReactNode } from 'react';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import { Button, Dropdown, Menu, message, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import EpsModalButton from '../../buttons/EpsModalButton';
import { useState } from 'react';
import { useEffect } from 'react';

export interface EpsStorageMenuProps {
    isIcon?: boolean;                // 是否图标按钮，用于customTableAction中使用
    name: string;              // 按钮文字
    store?: EpsTableStore;          // tableStore
    title: ReactNode;              // 对话框标题
    data: Array<any>;              // 
}

function EpsStorageMenu(props: EpsStorageMenuProps) {

    const menu = () => {
        // <Menu>
            {
                props.data &&
                props.data.map((item, index) => (
                    <div key={index}>
                        {item}
                    </div>
                ))
            }
        // </Menu>
    }
    
  return (
      <>
      {
        props.isIcon ?
        <Dropdown.Button overlay={menu}>
        </Dropdown.Button> :
        <Dropdown.Button overlay={menu}>
          更多功能 
      </Dropdown.Button>
      }
      </>
  );
}

export default EpsStorageMenu;

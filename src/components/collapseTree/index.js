import React from 'react';
import './index.less';
import { Input, Tree, Icon, Field} from '@alifd/next'
import {observer} from 'mobx-react'
import { SearchOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import  MenuTree  from './menu.tsx'


const CollapseTree = observer(props => {

  const field = Field.useField();

  const doSearchAction = (() => {
    field.validate((errors, values) => {
      
      if (!errors) {
        Store.setParams(values);
      }
    });
  });
    return (
      <div className="collapse-tree">
    

       <MenuTree treeData={props.treeData} {...props}/>
        <div className="collapse-icon">
          <Icon type="arrow-left" size={12} className="icon left-arrow" onClick={()=>Store.setExpand(false)}/>
          <Icon type="arrow-right" size={12} className="icon right-arrow" onClick={()=>Store.setExpand(true)}/>
        </div>
      </div>
    )
});

export default CollapseTree;
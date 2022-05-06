import './index.less'
import {observer} from "mobx-react";
import { Link } from 'react-router-dom'
import React from "react";
import {BasicListItemDataType} from "@/eps/business/Approve/Fzps/data";


interface IProp
{
  list: [];

}

const PanelListNoDate = observer((props: IProp) => {


  /**
   * 下载
   * @param val
   */
  // const onDownClick = async (currentItem: BasicListItemDataType) => {
  //   // if (currentItem.length == 0) {
  //   //   message.error('操作失败,请至少选择一行数据');
  //   // } else {
  //   var ulr =
  //     '/api/eps/portal/content/download?id=' + currentItem.id
  //   window.open(ulr);
  //   //  }
  // };


  return (
    <div className="panel-list">
      {
        props.list.map((item, index) => (
          <Link key={index} className="panel-item"
                // to={
                //   {
                //     pathname:`/api/eps/portal/content/download`,
                //     state:{id:item.id}
                //   }
                // }
                to={
                  {
                    pathname:`/runRfunc/searchdetail`,
                    state:{id:item.id}
                  }
                }
          >
            <div className="left">
              <div className="title">{item.title}</div>
              {/*{ item.whsj ? <div className="time">{item.whsj}</div> : '' }*/}
            </div>
            {/*<img src={item.img} alt="" style={{height: 50, width: 40}}></img>*/}
            {/*<div>下载</div>*/}
          </Link>        ))
      }
    </div>
  );
});

export default PanelListNoDate;

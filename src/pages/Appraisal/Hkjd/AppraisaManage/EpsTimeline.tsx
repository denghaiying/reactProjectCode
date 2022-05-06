import React, {  useEffect, useRef, useState } from "react";

import { Timeline } from "antd";
import timeService from './timelineService'
import { observer } from "mobx-react";


const EpsTimeLine = observer((props) => {
  const {daktmid} = props;
  const [data,setData]=useState([])
//   {
//     "bmc": "DAK0010002",
//     "daktmid": "DA202105221753550012",
//     "edittype": 0,
//     "fjs": 0,
//     "fullinfo": "{\"档案库\":\"DAK0010002\",\"条目编号\":\"DA202105221753550012\"}",
//     "gnid": "DAGL003",
//     "gnmc": "档案管理",
//     "id": "SYSLOG202105221753550016",
//     "ip": "192.168.8.1",
//     "mkbh": "DAGL",
//     "op": "批量导入数据添加",
//     "rq": "2021-05-22 17:53:55",
//     "whsj": "2021-05-24 10:34:28",
//     "yhbh": "gly",
//     "yhid": "YH201904132026100005",
//     "yhmc": "管理员",
//     "ywid": "DA202105221753550012"
// }
  useEffect(() => {
   timeService.findAll({daktmid}).then((res)=>{
      setData(res);
   })
  }, [daktmid]);

  return (
    <Timeline mode={"left"}>
      {
        data.map(item=>{
          return <Timeline.Item label={`${item.rq}`}>
              <p> {`${item.op}`}</p>
             <p>操作人:{item.yhmc}</p>
           
          </Timeline.Item>
        })
      }
  
  </Timeline>
  )
});

export default EpsTimeLine;
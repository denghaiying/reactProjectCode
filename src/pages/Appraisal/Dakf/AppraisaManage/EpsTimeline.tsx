import React, {  useEffect, useRef, useState } from "react";

import { Timeline } from "antd";
import timeService from './timelineService'
import { observer } from "mobx-react";


const EpsTimeLine = observer((props) => {
  const {daktmid} = props;
  const [data,setData]=useState([])

  useEffect(() => {
   timeService.findAll({daktmid}).then((res)=>{
      setData(res);
   })
  }, [daktmid]);

  return (
    <Timeline mode={"left"}>
      {
        data.map(item=>{
          return <Timeline.Item label={`${item.rq}`}>{`${item.op}`}</Timeline.Item>
        })
      }
  
  </Timeline>
  )
});

export default EpsTimeLine;
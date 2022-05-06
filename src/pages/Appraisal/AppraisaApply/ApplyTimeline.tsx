import React, { useEffect, useState } from "react";

import { Timeline, Empty } from "antd";
import timeService from "./ApplyService";
import { observer } from "mobx-react";

const ApplyTimeLine = observer((props) => {
  const { kfjdmxid } = props;
  const [data, setData] = useState([]);
  //   {
  //   {
  //     "daid": "DA202105111945090005",
  //     "edittype": 0,
  //     "fjs": 0,
  //     "id": "DAJDCK202105311505290027",
  //     "kfjdmxid": "KFJDMX202105301111510005",
  //     "remark": "ertet",
  //     "spr": "管理员",
  //     "sprid": "YH201904132026100005",
  //     "sprq": "2021-05-31 00:00:00",
  //     "spzt": "N",
  //     "whsj": "2021-05-31 15:15:23",
  //     "wpid": "0010"
  // }
  // }
  useEffect(() => {
    setData([]);
    timeService.findAll({ kfjdmxid }).then((res) => {
      setData(res);
    });
  }, [props.kfjdmxid]);
  const getTimeLinePanel = () => {
    if(!data || data.length==0){
      return <Empty/>
    }
   return <Timeline mode={"left"}>
      {data.map((item) => {
        return (
          <Timeline.Item label={`${item.sprq}`}>
            <p> 审批人：{item.spr}</p>
            <p> 审批意见：{item.spzt == "Y" ? "开放" : "不开放"}</p>
            <p> 备注：{item.remark}</p>
          </Timeline.Item>
        );
      })}
    </Timeline>;
  };
  return getTimeLinePanel();
});

export default ApplyTimeLine;

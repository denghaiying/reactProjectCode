import  { useEffect} from "react";
import TableService from "./TableService";
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import { observer, useLocalStore } from "mobx-react";
import { runInAction } from 'mobx';
import Approve from "@/eps/business/Approve"
import { useIntl } from 'umi';
import WfdefStore from "@/stores/workflow/WfdefStore";


const Kfjd = observer((props) => {
  // eslint-disable-next-line prefer-destructuring
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const location: locationType = props.location;
  const archParams: ArchParams = location.query;
  // 是否案卷
  const isRecords = archParams.lx != "01" && archParams.lx != "0201";

  // tmzt
  const tmzt=3;
  // 鉴定编号
  const jdlx="yjsp"
  // 流程编号
  const wfcode="dagl_yjsp"

  // 主表columns
  const columns=[
    {
      title: formatMessage({ id: "e9.dagl.yjsp.zt" }),
      code: "wpid",
      width: 100,
      render: (value, record, index) => {
        if (value === "ZZZY") {
          return "否决";
        }
        const list = WfdefStore.proclist["kfjd"];

        if (list) {
          for (let i = 0; i <= list.length - 1; i++) {
            if (list[i].wpid == value) {
              return list[i].name;
            }
          }
        }
        return value;
      },
    },
    {
      title: formatMessage({ id: "e9.dagl.yjsp.dakmc" }),
      code: "dakmc",
      width: 100,
    },
    {
      title: formatMessage({ id: "e9.dagl.yjsp.yjtitle" }),
      code: "title",
      width: 250,
    },
    {
      title: formatMessage({ id: "e9.dagl.yjsp.year" }),
      code: "year",
      width: 100,
    },
    {
      title: formatMessage({ id: "e9.dagl.yjsp.month" }),
      code: "month",
      width: 100,
    },
    {
      title: formatMessage({ id: "e9.dagl.yjsp.date" }),
      code: "date",
      width: 180,
    },
    {
      title: formatMessage({ id: "e9.dagl.yjsp.yjr" }),
      code: "yjr",
      width: 200,
    },
    {
      title: formatMessage({ id: "e9.dagl.yjsp.jsr" }),
      code: "jsr",
      width: 200,
    },
    {
      title: formatMessage({ id: "e9.dagl.yjsp.remark" }),
      code: "remark",
      width: 200,
    },
    {
      title: formatMessage({ id: "e9.wflw.pub.wfawaiter" }),
      code: "wfawaiter",
      width: 250,
    },
    {
      title: formatMessage({ id: "e9.wflw.pub.wfahandler" }),
      code: "wfahandler",
      width: 200,
    },
  ]

  const store = useLocalStore(() => (
    {
      params:archParams,

      async init() {

      },
      tableRowClick(record){
        console.log("record",record)
        runInAction(()=>{

        })
      }
    }
  ));


  useEffect(() => {

 //   }
  }, []);


  return (
    <Approve columns={columns} tmzt={tmzt} jdlx={jdlx} wfCode={wfcode} {...props}/>
  );
});

export default Kfjd;

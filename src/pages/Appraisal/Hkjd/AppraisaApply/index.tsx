import  { useEffect} from "react";
import TableService from "./TableService";
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import { observer, useLocalStore } from "mobx-react";
import { runInAction } from 'mobx';
import Approve from "@/eps/business/Approve"
import { useIntl } from 'umi';
import WfdefStore from "@/stores/workflow/WfdefStore";


const Dasp = observer((props) => {
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
  const jdlx="hkjd"
  // 流程编号
  const wfCode="hkjd"
  //umid
  const umid="DAJD023"
   //umid
   const jdurl="hkjd"

  // 主表columns


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
    <Approve tmzt={tmzt} jdlx={jdlx} wfCode={wfCode} umid={umid} spurl={jdurl} {...props}/>
  );
});

export default Dasp;

import  { useEffect} from "react";
import TableService from "./TableService";
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import { observer, useLocalStore } from "mobx-react";
import { runInAction } from 'mobx';
import DzwjzxTransferApply from "@/eps/business/Approve/DzwjzxTransferApply"
import { useIntl } from 'umi';
import WfdefStore from "@/stores/workflow/WfdefStore";


const DzwjzxZLyjsq = observer((props) => {
  // eslint-disable-next-line prefer-destructuring
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const location: locationType = props.location;
  const archParams: ArchParams = location.query;
  // 是否案卷
  const isRecords = archParams.lx != "01" && archParams.lx != "0201";

  // tmzt
  const tmzt=2;
  // 鉴定编号
  const jdlx="dzyjsqdzl"
  // 流程编号
  const wfCode="dzyjsqdzl"
  //umid
  const umid="EPS9TYJK0008"
  //umid
  const jdurl="dzwjzxsqd"
  //移交类型状态 2整理移交；3管理移交
  const lxzt="3"
  //移交类型  yjsqd(移交) yjjs(移交接收)
  const yjlx="yjsqd"

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
    <DzwjzxTransferApply tmzt={tmzt} jdlx={jdlx} wfCode={wfCode} umid={umid} spurl={jdurl} lxzt={lxzt} yjlx={yjlx} {...props}/>
  );
});

export default DzwjzxZLyjsq;

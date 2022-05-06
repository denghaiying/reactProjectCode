import React, { useEffect} from "react";

import { observer, useLocalStore } from "mobx-react";
import { runInAction } from 'mobx';
import { useIntl } from 'umi';
import FzspApply from "@/eps/business/Approve/FzspApply.tsx";
import Daxc9Module from "@/eps/business/Approve/Daxc9Module";
import FzspFsApply from "@/eps/business/Approve/FzspFsApply";


const FzpsFs = observer((props) => {
  // eslint-disable-next-line prefer-destructuring
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const location: locationType = props.location;
  const archParams: ArchParams = location.query;
  // 是否案卷
  const isRecords = archParams.lx != "01" && archParams.lx != "0201";

  // tmzt
  const tmzt=4;
  // 鉴定编号
  const jdlx="FSFZPS"
  // 流程编号
  const wfCode="FSFZPS"
  //umid
  const umid="FZPS005"
  //umid
  const jdurl="fzsp"

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
    <>
      <FzspFsApply  spurl={jdurl} umid={umid} tmzt={tmzt} jdlx={jdlx} wfCode={wfCode} {...props}/>
    </>
  );
});

export default FzpsFs;

import React, { useEffect, useState, useRef } from "react";
import TableService from "./TableService";
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import { observer, useLocalStore } from "mobx-react";
import { runInAction } from 'mobx';
// import EpsModalButton from "@/eps/components/buttons/EpsModalButton";

const httpRequest = new HttpRequest("/api/eps/control/main");
import Arch from "./hglindex";
import update from "immutability-helper";

import  './ArchPanel.less';
const demohgl = observer((props) => {
  // eslint-disable-next-line prefer-destructuring
  const location: locationType = props.location;
  const archParams: ArchParams = location.query;
  const [modalHeight, setModalHeight] = useState(0);
  const [width, setWidth] = useState(0);
  // 是否案卷
  const isRecords = archParams.lx !== "01" && archParams.lx !== "0201";

  const store = useLocalStore(() => (
    {
      params:archParams,
      childParams:{},
      ktable: {},
      childKtable: {},
      dakid:archParams.dakid,
      childDakid:"",
      // 点击的主表的id，子表查询传递fid参数
      mainRowId:"",
      async initKtable() {
        const ktable: KtableType = await TableService.queryKTable(archParams);
        let childKtable:KtableType;
        debugger
        if(isRecords){
           childKtable = await TableService.queryKTable({fid: archParams.dakid});
        }
        runInAction( () => {
           this.ktable= update(this.ktable,{
                $set : ktable
              },

            )


          if(isRecords){
            this.childKtable=childKtable;
            this.childDakid=childKtable.id;
            this.childParams={
              bmc: childKtable.bmc,
              lx: childKtable.daklx,
              tmzt: archParams.tmzt,
              dakid: childKtable.id
            }
          }
        })
      },
      tableRowClick(record){
        runInAction(()=>{
          this.mainRowId="";
          this.mainRowId=record.id;
        })
      }
    }
  ));


  useEffect(() => {

   // if (archParams.dakid) {
      store.initKtable();
   //   setWidth(props.width || 800)

 //   setModalHeight(window.innerHeight - 300)
 //   }
  }, []);

  
//   const filter = {
//     path:"hgl_dak",
//     dakid: params.dakid,
//     mbid: archStore.ktable?.mbid,
//     bmc: params.bmc,
//     tmzt: params.tmzt
//   }

//   const title=params.mc+"【盒管理】";
//   return { url: `/api/eps/control/main/hgl/openDak?${qs.stringify(filter)}`, params: filter, title, filter, width: 1200, height: 700 };

  const urlhgl="/api/eps/control/main/hgl/openDak?path=hgl_dak&dakid="+archParams.dakid+"&mbid="+store.ktable?.mbid+"&bmc="+archParams.bmc+"&tmzt="+archParams.tmzt;


  return (
    //   <div className="record-arch">
    //         <div className={isRecords?'top':'content'}>
    //           <Arch key={`${archParams.dakid}_YWYJ`} archParams={archParams} tableRowClick={store.tableRowClick} dakid={store.dakid} ktable={store.ktable} {...props} />
    //         </div>
    //     {isRecords &&
    //     <div className={"bottom"}>
    //           <Arch zIndex={0} style={{zIndex:-99}} archParams={store.childParams} treeAutoLoad={false} tableAutoLoad={false} dakid={store.childDakid} fid={store.mainRowId} ktable={store.childKtable} {...props} />
    //         </div>}

    //   </div>
 
        <div className="record-arch">
            <div className={isRecords?'top':'content'}>
            <iframe id="auxLcsp" name="auxLcsp" style={{width:(props.width || width )-48, height: (props.height || modalHeight) + 'px',border:"solid 1px #f4f4f4"}}
             src={urlhgl} ></iframe> 
            {/* <Arch key={`${archParams.dakid}_YWYJ`} archParams={archParams} tableRowClick={store.tableRowClick} dakid={store.dakid} ktable={store.ktable} {...props} /> */}
            </div>

        </div>



    // <div >
    //      <iframe id="auxLcsp" name="auxLcsp" style={{width:(props.width || width )-48, height: (props.height || modalHeight) + 'px',border:"solid 1px #f4f4f4"}}
    //         src={urlhgl} ></iframe> 
	    
	// </div>
  );
});

export default demohgl;

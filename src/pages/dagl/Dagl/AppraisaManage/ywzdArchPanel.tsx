import React, { useEffect, useState, useRef } from "react";
import TableService from "./TableService";
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import { observer, useLocalStore } from "mobx-react";
import { runInAction } from 'mobx';
// import EpsModalButton from "@/eps/components/buttons/EpsModalButton";

const httpRequest = new HttpRequest("/api/eps/control/main");
import Arch from "./ywzdArchIndex";
import update from "immutability-helper";

import './ArchPanel.less';
const demoYwzd = observer((props) => {
  // eslint-disable-next-line prefer-destructuring

  const location: locationType = props.location;
  const archParams: ArchParams = location.query;
  // 是否案卷
  const isRecords = archParams.lx != "01" && archParams.lx != "0201";

  const store = useLocalStore(() => (
    {
      params: archParams,
      childParams: {},
      ktable: {},
      childKtable: {},
      dakid: archParams.dakid,
      childDakid: "",
      // 点击的主表的id，子表查询传递fid参数
      mainRowId: "",
      async initKtable() {
        const ktable: KtableType = await TableService.queryKTable(archParams);
        let childKtable: KtableType;
        if (isRecords) {
          childKtable = await TableService.queryKTable({ fid: archParams.dakid });
        }
        runInAction(() => {
          this.ktable = update(this.ktable, {
            $set: ktable
          },
          )
          if (isRecords) {
            this.childKtable = childKtable;
            this.childDakid = childKtable.id;
            this.childParams = {
              bmc: childKtable.bmc,
              lx: childKtable.daklx,
              tmzt: archParams.tmzt,
              dakid: childKtable.id
            }
          }
        })
      },
      tableRowClick(record) {
        runInAction(() => {
          this.mainRowId = "";
          this.mainRowId = record.id;
        })
      }
    }
  ));

  useEffect(() => {
    // if (archParams.dakid) {
    store.initKtable();
    //   }
  }, []);

  return (
    <div className="record-arch">
      <div className={isRecords ? 'top' : 'content'}>
        <Arch key={`${archParams.dakid}_YWYJ`} archParams={archParams} tableRowClick={store.tableRowClick} dakid={store.dakid} ktable={store.ktable} {...props} />
      </div>
      {isRecords &&
        <div className={"bottom"}>
          <Arch key={`${archParams.dakid}_JN`} fdakid={archParams.dakid} zIndex={0} style={{ zIndex: -99 }} archParams={store.childParams} treeAutoLoad={false} tableAutoLoad={false} dakid={store.childDakid} fid={store.mainRowId} ktable={store.childKtable} {...props} />
        </div>}
    </div>
  );
});

export default demoYwzd;

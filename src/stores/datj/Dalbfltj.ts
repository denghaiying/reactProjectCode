import { observable, action, makeAutoObservable, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import SysStore from "@/stores/system/SysStore";

class Dalbfltj {

  url = "";
  wfenable = false;
  oldver = true;
  constructor(url, wfenable, oldver = true) {

    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
    makeAutoObservable(this)
  }

  @observable isExpand = true;
    @observable dw  = SysStore.currentUser.dwid;
    @observable dakid = "";
    @observable tjxs = "";
    @observable nd = [];
    @observable tmzt = "";




    @observable data = [];
    @observable record = {};
    @observable params = {};
    @observable loading = false;
    @observable pageno = 1;
    @observable pagesize = 20;
    @observable opt = "view";
    @observable editVisible = false;
    @observable editRecord = {};
    @observable selectRowKeys = [];
    @observable selectRowRecords = [];
    @observable columns = [];
    @observable signcomment = "";
    @observable procOpt = {};
    @observable dataSource=[];

    @observable paramValue = "";

    columnameList=[];
    columnResult=[];


    @action setDw = (dw) => {
        this.dw = dw;
    }

    @action setDdakid = (dakid) => {
        this.dakid = dakid;
    }


    @action setTjxs = (tjxs) => {
        this.tjxs = tjxs;
    }

    @action setTmzt = (tmzt) => {
        this.tmzt = tmzt;
    }

    @action setNd = (nd) => {
        this.nd = nd;
    }


    @action setExpand = (expend) => {
        this.expand = expend;
    };




    openNotification = (a, type) => {
        Notification.open({ title: a, type });
      };

      setSigncomment = (comment) => {
        this.signcomment = comment;
      };

      setColumns = (columns) => {
        this.columns = columns;
      };

      setPageNo = async (pageno) => {
        this.pageno = pageno;
        await this.queryForPage();
      };

      setPageSize = async (pageSize) => {
        this.pagesize = pageSize;
        await this.queryForPage();
      };

      setParams = async (params, nosearch) => {
        this.params = { ...params };
        if (!nosearch) {
          await this.queryForPage();
        }
      };

      setDataSource = (dataSource) => {
        this.dataSource = dataSource;
      };

      setSelectRows = async (selectRowKeys, selectRowRecords) => {

        this.selectRowKeys = selectRowKeys;
        this.selectRowRecords = selectRowRecords;
      };

      afterQueryData(data) {
        return data;
      }
      


      @action queryForPage = async () => {

        this.loading = true;

        const par=this.params;
        const xs=par["tjxs"];
        const columsetslist = [];
        const columname=[];
        if( xs && xs.length>0){
            for (var i = 0, l = xs.length; i < l; i++) {
                var a = xs[i];
                switch (a) {
                    case "dwsx":
                        columsetslist.push({
                            title: "单位名称",
                            dataIndex: "dwmc",
                            width: 100,
                            key:"dwmc",
                            defaultSortOrder: 'descend',
                            sorter: (a, b) => a.dwmc - b.dwmc,
                        });
                        columname.push('单位名称');
                        break;
                    case "ndsx":
                        columsetslist.push({
                            dataIndex: "nd",
                            key:"nd",
                            width: 100,
                            title: "年度",
                            defaultSortOrder: 'descend',
                            sorter: (a, b) => a.nd - b.nd,
                        });
                        columname.push('年度');
                        break;
                }

            }
        }
        columsetslist.push({ dataIndex: "lbzt", key:"lbzt",width: 120,  defaultSortOrder: 'descend',sorter: (a, b) => a.lbzt - b.lbzt, title: "类别"});
        columname.push('类别');
        const list = await fetch
            .post(`${this.url}/queryDakBGQXmap`, this.params, { params: { ...this.params } });

        const dakData = await fetch
            .post(`${this.url}/queryForDakList`, this.params, { params: { ...this.params } });
        if(dakData) {
            let columsdakli=[];
            let columsli=[];

            let colMapList=[];

            for(let j = 0, m = dakData.length; j < m; j++){
                let dakls = dakData[j];
                let colMap;
                colMap.put("title",dakls.mc);
                colMap.put("dataIndex",dakls.id);
                colMap.put("key",dakls.id);
                columname.push(dakls.mc);

                let bcqxMapList=[];
                let bgqxlist=  await fetch
                    .post(`${this.url}/queryDAkFlh`, this.params, { params: { mbid:dakls.mbid,dakid:dakls.id,bmc:dakls.mbc,...this.params } });
                if(bgqxlist.length>0) {
                    for (let b = 0, u = bgqxlist.length; b < u; b++) {
                        let led = bgqxlist[b];
                        let aaaa;
                        let bcqxMap;
                        if (led.mc) {
                            aaaa = dakls.id + "_" + led.mc;
                        } else {
                            aaaa = dakls.id + "_BGQXnull"
                        }
                        let flhfileid;
                        for (let n in list) {
                            let alist = list[n];
                            if (alist.hasOwnProperty(aaaa)) {
                                flhfileid = alist[aaaa]
                            }
                        }

                        bcqxMap.put("title", flhfileid);
                        bcqxMap.put("dataIndex", lhfileid);
                        bcqxMap.put("key", flhfileid);
                        bcqxMap.put("width", "100");
                        columname.push(flhfileid);

                        bcqxMapList.push(bcqxMap);
                    }

                    }else{
                        columsdakli.push({ field: dakls.id+"_", width: 120, headerAlign:"center", allowSort: true, header: "",align:"center"});
                    }


            colMap.push("children",bcqxMapList);
            columsetslist.push(colMap);

            }
            columname.push('件数');
            this.setColumns(columsetslist);
        }else{
            Eps.showTip(reslut.message);
        }

        ;
        const response = await fetch
            .post(`${this.url}/queryForDaklbtjList`, this.params, { params: { ...this.params } });
        if (response && response.status === 200) {
            runInAction(() => {
                this.data = this.afterQueryData(response.data);
                // const records=response.data.results;
                // this.columnameList = columname;
                //         for(var i in records){
                //             const record=records[i];
                //             const obj={};
                //             for(var name in record){
                //                 if(name === "dwmc"){
                //                     obj['单位名称']=record['dwmc']
                //                 }else if(name === 'nd'){
                //                     obj['年度']=record['nd']
                //                 }
                //             }
                //             this.columnResult.push(obj);
                //         }
                this.loading = false;
            });
        }
        else {
            this.loading = true;
        }
    }



}

export default new Dalbfltj('/api/eps/control/main/basetj');

import React, { useEffect, useState } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import './index.less';
import { Radio, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import util from '@/utils/util';
import SysStore from '@/stores/system/SysStore';

import img1 from './assets/img/img1-icon.png'
import img2 from './assets/img/img2-icon.png'
import img3 from './assets/img/img3-icon.png'
import img4 from './assets/img/img4-icon.png'
import img5 from './assets/img/img5-icon.png'

import fetch from '@/utils/fetch';
import { runFunc } from '@/utils/menuUtils';

const FzpsIndex = observer((props) => {
  const [vmcdata, setVmcdata] = useState([]);

  const [vsjdata, setVsjdata] = useState([]);

  const [vlymdtjdata, setVlymdtjdata] = useState([]);

  const store = useLocalStore(() => ({

    keyparams: '',
    kpcount: 0,
    sscount: 0,
    yscount:0,
    escount:0,
    dgcount:0,
    sjdata: [],
    daylsyData: [],
    async querykp() {
      const response = await fetch.get(
        `/api/eps/control/main/fzsp/queryCountindex?spzt=1`,
      );
      if (response.status === 200) {

          this.kpcount =response.data;

      }
    },

    async queryss() {
      const response = await fetch.get(
        `/api/eps/control/main/fzsp/queryCountindex?spzt=2`,
      );
      if (response.status === 200) {

          this.sscount =response.data;

      }
    },
    async queryys() {
      const response = await fetch.get(
        `/api/eps/control/main/fzsp/queryCountindex?spzt=3`,
      );
      if (response.status === 200) {

          this.yscount =response.data;

      }
    },

    async queryes() {
      const response = await fetch.get(
        `/api/eps/control/main/fzsp/queryCountindex?spzt=4`,
      );
      if (response.status === 200) {

          this.escount =response.data;

      }
    },

    async querydg() {
      const response = await fetch.get(
        `/api/eps/control/main/fzsp/queryCountindex?spzt=5`,
      );
      debugger;
      if (response.status === 200) {

          this.dgcount =response.data;

      }
    },

  }));

  const openclicknum = (e) => {
    const params = {
      umid: e,
    };
    if(e==='FZPS002'){
      params.path=`/runRfunc/fzpskp`;
      params.umname=`志鉴地情资料评审登记`;
    }
    if(e==='FZPS003'){
      params.path=`/runRfunc/fzpsss`;
      params.umname=`志鉴地情资料评审登记`;
    }
    if(e==='FZPS004'){
      params.path=`/runRfunc/fzpsys`;
      params.umname=`志鉴地情资料评审初审`;
    }
    if(e==='FZPS005'){
      params.path=`/runRfunc/fzpses`;
      params.umname=`志鉴地情资料评审复审`;
    }
    if(e==='FZPS006'){
      params.path=`/runRfunc/fzpsdg`;
      params.umname=`志鉴地情资料评审终稿`;
    }
    runFunc(params);

  };




  useEffect(() => {
    store.querydg();
    store.queryes();
    store.querykp();
    store.queryss();
    store.queryys();
  }, []);

  return (
    <div className="online-review">
      <div className="title">志鉴地情资料评审</div>
      <div className="review-body">
        <div className="common-tab">
          <div className="name">
            登记<span> ({store.kpcount ? store.kpcount : 0})</span>
          </div>
          <div className="imgs">
            <img src={img1} alt=""
                onClick={() => {
                  openclicknum("FZPS002");
                }}
            />
          </div>
          <div className="num">
            1
          </div>
        </div>
        {/*<div className="common-tab">*/}
        {/*  <div className="num-t">*/}
        {/*    2*/}
        {/*  </div>*/}
        {/*  <div className="imgs">*/}
        {/*    <img src={img2} alt=""*/}
        {/*        //  onClick={() => {*/}
        {/*        //   openclicknum("FZPS003");*/}
        {/*        // }}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*  <div className="name-b">*/}
        {/*    送审<span> ({store.sscount ? store.sscount : 0})</span>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className="common-tab">
          <div className="name">
            初审<span> ({store.yscount ? store.yscount : 0})</span>
          </div>
          <div className="imgs">
            <img src={img3} alt=""
                 onClick={() => {
                  openclicknum("FZPS004");
                }}
            />
          </div>
          <div className="num">
            2
          </div>
        </div>
        <div className="common-tab">
          <div className="name">
            复审<span> ({store.escount ? store.escount : 0})</span>
          </div>
          <div className="imgs">
            <img src={img4} alt=""
              onClick={() => {
                openclicknum("FZPS005");
              }}
            />
          </div>
          <div className="num">
            3
          </div>
        </div>
        <div className="common-tab">
          <div className="name">
            终稿<span> ({store.dgcount ? store.dgcount : 0})</span>
          </div>
          <div className="imgs">
            <img src={img5} alt=""
                 onClick={() => {
                  openclicknum("FZPS006");
                }}
            />
          </div>
          <div className="num">
            4
          </div>
        </div>
      </div>
    </div>
  );
});
export default FzpsIndex;

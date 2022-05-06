import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
} from 'antd';
import './index.less';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel4';
import { ITable, ITitle } from '@/eps/commons/declare';
import EpsFormType from '@/eps/commons/EpsFormType';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
  SyncOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import { observer, useLocalObservable } from 'mobx-react';
import fetch from '@/utils/fetch';
import CartService from '@/pages/daly/jyc/cart/CartService';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import RightStore from '@/components/RightContent/RightStore';

const { Panel } = Collapse;
const { confirm } = Modal;
import { isMoment } from 'moment';
const Daxj = observer((props) => {
  console.log('xujie=========');
  const { umid = 'DALY013', umname = '借阅车' } = props;

  const ref = useRef();

  const [key, setKey] = useState(['4']);

  const [rowSelection, setRowSelection] = useState(
    props.tableProp?.rowSelection,
  );

  const [tableStore, setTableStore] = useState<EpsTableStore>(
    new EpsTableStore(CartService),
  );

  //table表格的onChange事件
  // const onTableRowChange = (selectedRowKeys, records) => {
  //   setSelectedRowKeys(selectedRowKeys);
  //   setSelectedRowData(records[0]);
  //   //根据主表id查询明细表数据
  //   if (records.length > 0) {
  //     detailStore.findByKey(detailStore.detailKey, 1, detailStore.detailSize, { "id": records[0].id });
  //   }
  // };

  // 主表按钮和查询框区域(新增、编辑、删除按钮默认可使用)
  const tableProp: ITable = {
    tableSearch: false,
    disableEdit: true,
    disableAdd: true,
    disableCopy: true,
    // rowSelection: {
    //   type: 'checkbox',
    //   defaultSelectedRowKeys: ['7B112E0105A63F084E41E12FE8260159','D79605D5C2C4949EAD9ECF7B031BD7FD']
    // },
  };

  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD');

  const [initParams, setInitParams] = useState({});
  // const [umid, setUmid] = useState('');
  const [checkJysm, setCheckJysm] = useState(true);
  const [checkLymd, setCheckLymd] = useState(true);
  //借阅单是否启用防扩散功能，判断文件下载，打开，打印次数是否显示
  const [checkFksshow, setCheckFksshow] = useState(false);
  // 腾讯通提醒
  const [checktxtxt, setChecktxtxt] = useState(false);
  // 打印下载
  const [checkisDyXz, setCheckisDyXz] = useState(true);
  // 打印
  const [checkdy, setCheckdy] = useState(true);
  // 下载
  const [checkxz, setCheckxz] = useState(true);
  // 借阅单短信和腾讯通是否显示
  const [checkdxtxtShow, setCheckdxtxtShow] = useState(true);
  // 水印文字
  const [checksywzShow, setChecksywzShow] = useState(true);
  // 手机邮箱
  const [checktx, setChecktx] = useState(true);

  const [showxxfs, setShowxxfs] = useState('Y');

  const [fjShow, setFjShow] = useState(false);

  // 本地store
  const CartStore = useLocalObservable(() => ({
    paramfj: '',
    lxdata: [],
    userInfo: {},
    dwInfo: {},
    pDALYF002: 0,
    lymdData: [],
    cartDataSource: [],
    dwmc: '',
    pjysm: '',
    plymd: '',
    ptxtxt: '',
    pdyxz: '',
    pfksshow: '',
    pdxtxtshow: '',
    psywzshow: '',
    ptx: '',
    keyList: [],
    filegrpid: '',

    async query() {
      const url =
        '/api/eps/control/main/daly/queryForCart?yhid=' +
        SysStore.getCurrentUser().id;

      const res = await fetch.get(url);
      if (res && res.status === 200) {
        this.cartDataSource = res.data.results;
      } else {
        return;
      }
    },

    async getUserOptionByDAJYC001() {
      const url =
        '/api/eps/control/main/params/getParamsDevOption?code=DAJYC001&yhid=' +
        SysStore.getCurrentUser().id;
      const response = await fetch.get(url);

      if (response.status === 200) {
        this.paramfj = response.data;
        if (response.data === 'Y') {
          setFjShow(true);
        } else {
          setFjShow(false);
        }

        // if (response.data.length > 0) {
        //   if(response.data ==='Y' || response.data ===""){
        //     this.paramfj=true;
        //   }else{
        //     this.paramfj=false;
        //   }
        // }else{
        //   return;
        // }
      }
    },

    async getUserOptionByDALYF002() {
      const url =
        '/api/eps/control/main/params/getParamsDevOption?code=DALYF002&yhid=' +
        SysStore.getCurrentUser().id;
      const response = await fetch.get(url);
      if (response.status === 200) {
        if (response.data === '' || response.data == null) {
          this.pDALYF002 = 1;
        } else {
          this.pDALYF002 = response.data;
        }
      } else {
        return;
      }
    },

    async getUserOptionByJysm() {
      const url =
        '/api/eps/control/main/params/getParamsDevOption?code=DALYS002&yhid=' +
        SysStore.getCurrentUser().id;
      const response = await fetch.get(url);

      if (response.status === 200) {
        this.pjysm = response.data;
        if (response.data === 'Y') {
          setCheckJysm(false);
        } else {
          setCheckJysm(true);
        }
      } else {
        return;
      }
    },

    async getUserOptionByLymd() {
      const url =
        '/api/eps/control/main/params/getParamsDevOption?code=DAJYC002&yhid=' +
        SysStore.getCurrentUser().id;
      const response = await fetch.get(url);
      if (response.status === 200) {
        if (response.status === 200) {
          this.plymd = response.data;
          if (response.data === 'Y') {
            setCheckLymd(true);
          } else {
            setCheckLymd(false);
          }
        } else {
          return;
        }
      }
    },

    async getLx() {
      const url = '/api/eps/control/main/sjzdmx/querySjzdmxBySjzd?bh=019';
      const response = await fetch.get(url);
      debugger;
      if (response && response.status === 200) {
        //  var sjData = [];
        //  if (totals > 0) {
        //    for (var i = 0; i < response.data.results.length; i++) {
        //      var newKey = {};
        //      newKey = response.data.results[i];
        //      newKey.key = newKey.id;
        //      sjData.push(newKey);
        //    }
        // }
        //  this.lxdata=sjData;

        if (response.data) {
          this.lxdata = response.data.map((o) => ({
            id: o.bh,
            label: o.mc,
            value: o.bh,
          }));
        }
      } else {
        return;
      }
    },

    async getLymd() {
      let url = '/api/eps/control/main/sjzdmx/queryForList?fid=SJZD015';
      const response = await fetch.get(url);
      if (response && response.status === 200) {
        this.lymdData = response.data.map((o) => ({
          id: o.bh,
          label: o.mc,
          value: o.bh,
        }));
      } else {
        return;
      }
    },

    // async getUserInfo() {
    //   const url= "api/eps/control/main/yh/queryForId?id="+SysStore.getCurrentUser().id
    //   const response=await fetch.get(url);
    //   if (response && response.status === 200) {
    //     this.userInfo=response.data;
    //     this.dwmc=response.data.dwmc;
    //   } else {
    //     return
    //   }
    // },

    async getDwInfo() {
      const url =
        '/api/eps/control/main/dw/queryForId?id=' +
        SysStore.getCurrentUser().dwid;
      const response = await fetch.get(url);
      if (response && response.status === 200) {
        this.dwInfo = response.data;
      } else {
        return;
      }
    },

    async clearCache() {
      const url = '/api/eps/control/main/xt/clearCache';
      const response = await fetch.post(url);
      if (response && response.status === 200) {
        if (response.data.success) {
          message.success(`清除缓存成功!`);
        } else {
          return;
        }
      }
    },

    async delete(record) {
      const url =
        '/api/eps/control/main/daly/delete?bmc=DAJYC&ids=' + record.id;
      try {
        const response = await fetch.post(url);
        console.log('deleteres==', response);
        //  if (response && response.status === 200) {
        if (response.data && response.data.success) {
          const url1 =
            '/api/eps/control/main/daly/queryForCart?yhid=' +
            SysStore.getCurrentUser().id;
          const res = await fetch.get(url1);
          if (res && res.status === 200) {
            this.cartDataSource = res.data.results;
            RightStore.queryAllCartCount();
          } else {
            return;
          }
        } else {
          message.error(response.data.message);
          return;
        }
      } catch (err) {
        message.error(err.message || err);
      }
    },

    async getUserOptionByTxtxt() {
      const url =
        '/api/eps/control/main/params/getParamsDevOption?code=DALYS012&yhid=' +
        SysStore.getCurrentUser().id;
      const response = await fetch.get(url);

      if (response.status === 200) {
        this.ptxtxt = response.data;
      } else {
        return;
      }
    },

    async getUserOptionByDyXz() {
      const url =
        '/api/eps/control/main/params/getParamsDevOption?code=DALYS004&yhid=' +
        SysStore.getCurrentUser().id;
      const response = await fetch.get(url);

      if (response.status === 200) {
        this.pdyxz = response.data;
      } else {
        return;
      }
    },

    async getUserOptionByFksshow() {
      const url =
        '/api/eps/control/main/params/getParamsDevOption?code=DALYS011&yhid=' +
        SysStore.getCurrentUser().id;
      const response = await fetch.get(url);

      if (response.status === 200) {
        this.pfksshow = response.data;
      } else {
        return;
      }
    },

    async getUserOptionByDxtxtShow() {
      const url =
        '/api/eps/control/main/params/getParamsDevOption?code=WFM003&yhid=' +
        SysStore.getCurrentUser().id;
      const response = await fetch.get(url);

      if (response.status === 200) {
        this.pdxtxtshow = response.data;
      } else {
        return;
      }
    },

    async getUserOptionBySywzShow() {
      const url =
        '/api/eps/control/main/params/getParamsDevOption?code=DALYS014&yhid=' +
        SysStore.getCurrentUser().id;
      const response = await fetch.get(url);

      if (response.status === 200) {
        this.psywzshow = response.data;
      } else {
        return;
      }
    },

    async getUserOptionByTx() {
      const url =
        '/api/eps/control/main/params/getParamsDevOption?code=DALYS017&yhid=' +
        SysStore.getCurrentUser().id;
      const response = await fetch.get(url);

      if (response.status === 200) {
        this.ptx = response.data;
      } else {
        return;
      }
    },

    async getFilegrpid() {
      const response = await fetch.post('/api/eps/wdgl/attachdoc/getGuid');
      if (response.status === 200) {
        this.filegrpid = response.data.message;
      } else {
        return;
      }
    },

    async apply(bdInfo, data) {
      // 获取默认的查看、打印、下载方式
      const urlck =
        '/api/eps/control/main/params/getParamsDevOption?code=DALYS030&yhid=' +
        SysStore.getCurrentUser().id;
      const ckRes = await fetch.get(urlck);
      const ckdev = ckRes.data;
      const filegrpid = '';
      const fjs = 0;
      let actionck = '';
      if (bdInfo.action) {
        actionck = bdInfo.action.toString();
      }

      let ckys = '';
      let ckcq = '';
      let cksy = '';
      let dyys = '';
      let dycq = '';
      let dysy = '';
      let xzys = '';
      let xzcq = '';
      let xzsy = '';

      if (actionck.indexOf('看') > 0) {
        const ck = 'ck_' + ckdev;
        if (ck === 'ck_ys') {
          ckys = 'Y';
        }
        if (ck === 'ck_cq') {
          ckcq = 'Y';
        }
        if (ck === 'ck_sy') {
          cksy = 'Y';
        }
      }

      if (actionck.indexOf('印') > 0) {
        const dy = 'dy_' + ckdev;
        if (dy === 'dy_ys') {
          dyys = 'Y';
        }
        if (dy === 'dy_cq') {
          dycq = 'Y';
        }
        if (dy === 'dy_sy') {
          dysy = 'Y';
        }
      }

      if (actionck.indexOf('载') > 0) {
        const xz = 'xz_' + ckdev;
        if (xz === 'xz_ys') {
          xzys = 'Y';
        }
        if (xz === 'xz_cq') {
          xzcq = 'Y';
        }
        if (xz === 'xz_sy') {
          xzsy = 'Y';
        }
      }
      const { ghrq } = bdInfo;
      let end = moment(ghrq);
      if (isMoment(ghrq)) {
        bdInfo.ghrq = ghrq.format('YYYY-MM-DD');
      }
      let start = moment(new Date());
      bdInfo.jyts = end.diff(start, 'days');
      // var isJyts = getDefaultv("DALYF003");  //借阅单中借阅天数限制  Y:是;N:否
      const urlJyts =
        '/api/eps/control/main/params/getParamsDevOption?code=DALYF003&yhid=' +
        SysStore.getCurrentUser().id;
      const isJytsRes = await fetch.get(urlJyts);
      const isJyts = isJytsRes.data;

      // var jytsData = getDefaultv("DALYF002"); //协查单或借阅单的借阅天数，默认值为1
      const urljytsData =
        '/api/eps/control/main/params/getParamsDevOption?code=DALYF002&yhid=' +
        SysStore.getCurrentUser().id;
      const jytsDataRes = await fetch.get(urljytsData);
      const jytsData = jytsDataRes.data;

      let dzseleed = 0;
      const newdata = [];

      /*if (data) {
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            const sjdata = data[i];
            if (sjdata.dzjy === 'N' && sjdata.stjy === 'N') {
              dzseleed = 1;
              message.error('没有选择借阅方式，请选择实体借阅或电子借阅！');
              return;
            } else {
              newdata.push(sjdata);
            }
          }
        } else {
          message.error('没有借阅清单明细，请选择借阅条目！');
          return;
        }

        if (newdata.length > 0) {
          for (let i = 0; i < newdata.length; i++) {
            const stsl = newdata[i];
            if (stsl.stjy === 'Y') {
              if (stsl.stfs === 0) {
                message.error(stsl.tm + '实体份数为0,不能借阅');
                return;
              }
            }
            if (stsl.dzjy === 'Y') {
              if (stsl.fjs < 1) {
                message.error(stsl.tm + '附件数为0,不能借阅');
                return;
              }
            }
          }
        }
      }*/

      /*const jycList = [];
      for (let i = 0; i < newdata.length; i++) {
        const newKey = newdata[i];
        delete newKey.tmmap;
        delete newKey.whsj;
        jycList.push(newKey);
      }

      if (
        jytsData &&
        isJyts !== 'N' &&
        (bdInfo.jyts > jytsData || bdInfo.jyts < 2)
      ) {
        message.error('借阅天数只能在【2】-【' + jytsData + '】天');
        return;
      }*/

      // console.log('systoreuser',SysStore.getCurrentUser());
      const getDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      const formData = new FormData();
      let sj = '';
      if (bdInfo.sj !== undefined) {
        sj = bdInfo.sj;
      }

      let sywz = '';
      if (bdInfo.sywz !== undefined) {
        sywz = bdInfo.sywz;
      }

      let gw = '';
      if (SysStore.getCurrentUser().gw !== undefined) {
        gw = SysStore.getCurrentUser().gw;
      }

      let mail = '';
      if (bdInfo.yx !== undefined) {
        mail = bdInfo.yx;
      }

      //formData.append('jyc', JSON.stringify(jycList));
      formData.append('jylx', props.jydxx.jylx);
      formData.append('yhid', SysStore.getCurrentUser().id);
      formData.append('yhbh', SysStore.getCurrentUser().bh);
      formData.append('dwid', SysStore.getCurrentCmp().id);
      formData.append(
        'bmid',
        SysStore.getCurrentUser().bmid ? SysStore.getCurrentUser().bmid : '',
      );
      formData.append('sqr', SysStore.getCurrentUser().yhmc);
      formData.append('jyts', bdInfo.jyts);
      formData.append('dw', SysStore.getCurrentUser().dwmc);
      formData.append('email', mail);
      formData.append('sj', sj);
      formData.append('dh', '');
      formData.append('gw', gw);
      formData.append(
        'bm',
        SysStore.getCurrentUser().orgmc ? SysStore.getCurrentUser().orgmc : '',
      );
      formData.append('bz', bdInfo.jysm);
      formData.append('yhlx', SysStore.getCurrentUser().lx);
      formData.append('lymd', bdInfo.lymd ? bdInfo.lymd : '');
      formData.append('ck', ckys === '' ? 'N' : ckys);
      formData.append('ckcq', ckcq === '' ? 'N' : ckcq);
      formData.append('cksy', cksy === '' ? 'N' : cksy);
      formData.append('dy', dyys === '' ? 'N' : dyys);
      formData.append('dycq', dycq === '' ? 'N' : dycq);
      formData.append('dysy', dysy === '' ? 'N' : dysy);
      formData.append('xz', xzys === '' ? 'N' : xzys);
      formData.append('xzcq', xzcq === '' ? 'N' : xzcq);
      formData.append('sywz', sywz);
      formData.append('xzsy', xzsy == null ? 'N' : xzsy);
      formData.append('sqrq', getDateTime);
      formData.append('printnum', bdInfo.printnum);
      formData.append('opennum', bdInfo.opennum);
      formData.append('dowlnnum', bdInfo.dowlnnum);
      formData.append('dxtx', bdInfo.dxtx === 'Y' ? '短信提醒' : '');
      formData.append('txtxt', bdInfo.txtxt === 'Y' ? '腾讯通提醒' : '');
      formData.append('showxxfs', showxxfs);
      formData.append('grpid', filegrpid);
      formData.append('fjs', fjs);
      formData.append('ghrq', bdInfo.ghrq);
      formData.append('sfjggz', checkedData.sfjggz ? checkedData.sfjggz : 'N');
      formData.append(
        'sfjgfrgz',
        checkedData.sfjgfrgz ? checkedData.sfjgfrgz : 'N',
      );
      formData.append(
        'zzclfyj',
        checkedData.zzclfyj ? checkedData.zzclfyj : 'N',
      );
      formData.append('jybt', bdInfo.jybt);
      formData.append('id', props.jydxx.id);
      // await fetch.post({ url: '/api/eps/control/main/daly/apply', formData }).then(response => {
      //   if (response && response.status === 200) {
      //     if (response.data.results.length<=0) {
      //       message.success(`借阅申请提交成功!`)
      //     } else {
      //       let mess="";
      //       for (let i = 0; i < response.data.results.length; i++) {
      //         let newKey = {}
      //         newKey = response.data.results[i];
      //         if(newKey.jyc.id ){
      //           message.error( <font color="red">`借阅申请提交失败!{newKey.message}` </font>);
      //         }

      //       }

      //     }
      //   }
      // })
      //   .catch(function (error) {
      //     console.log(error);
      //   });

      const response = await fetch.post(
        `/api/eps/control/main/jydcx/applyXj`,
        formData,
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            dataType: 'json',
          },
        },
      );

      if (response && response.status === 200) {
        if (response.data.results.length <= 0) {
          message.success(`申请提交成功!`);
        } else {
          let mess = '';
          for (let i = 0; i < response.data.results.length; i++) {
            let newKey = {};
            newKey = response.data.results[i];
            if (newKey.jyc.id) {
              message.error(
                <font color="red">`借阅申请提交失败!{newKey.message}` </font>,
              );
            }
          }
        }
      }
    },
  }));

  const plainOptions = ['查看', '打印', '下载'];

  const defaultVals = [
    { value: 'ck', name: '查看' },
    { value: 'dy', name: '打印' },
    { value: 'xz', name: '下载' },
  ];

  const [checkedData, setCheckedData] = React.useState([]);
  // const [defaultVals, setDefaultVals] = React.useState([]);

  const onChange = (list) => {
    console.log('list', list);
    //setCheckedData(list);
  };

  const onotherChange = (e) => {
    console.log('checked = ', e.target.checked);
    checkedData[e.target.name] = e.target.checked ? 'Y' : 'N';
    setCheckedData(checkedData);
  };
  useEffect(() => {
    CartStore.getUserOptionByDAJYC001();
    CartStore.getUserOptionByDALYF002();
    CartStore.getLx();
    CartStore.getDwInfo();
    // CartStore.getUserInfo();
    CartStore.query();
    CartStore.getLymd();
    CartStore.getUserOptionByJysm();
    CartStore.getUserOptionByLymd();
    CartStore.getUserOptionByTxtxt();
    CartStore.getUserOptionByDyXz();
    CartStore.getUserOptionByFksshow();
    CartStore.getUserOptionByDxtxtShow();
    CartStore.getUserOptionBySywzShow();
    CartStore.getUserOptionByTx();
    CartStore.getFilegrpid();
    //  setUmid('DALY013');
    setTableStore(ref.current?.getTableStore());
  }, []);

  useEffect(() => {
    setGridData(CartStore.cartDataSource);
  }, [CartStore.cartDataSource]);

  useEffect(() => {
    setKey(window.innerHeight > 800 ? ['2', '4'] : ['4']);
  }, []);

  const jysmShow = () => {
    const uo = CartStore.pjysm;
    if (uo === 'Y') {
      setCheckJysm(false);
    } else {
      setCheckJysm(true);
    }
  };

  const lymdShow = () => {
    const uo = CartStore.plymd;
    if (uo === 'Y') {
      setCheckLymd(true);
    } else {
      setCheckLymd(false);
    }
  };

  const txtxtShow = () => {
    const uo = CartStore.ptxtxt;
    if (uo === 'Y') {
      setChecktxtxt(true);
    } else {
      setChecktxtxt(false);
    }
  };

  const isDyXzShow = () => {
    const uo = CartStore.pdyxz;
    if (uo === 'Y') {
      setCheckdy(false);
      setCheckxz(false);
      setCheckisDyXz(true);
    } else {
      setCheckdy(true);
      setCheckxz(true);
      setCheckisDyXz(false);
    }
  };

  const fksshowShow = () => {
    const uo = CartStore.pfksshow;
    if (uo === 'Y') {
      setCheckFksshow(false);
    } else {
      setCheckFksshow(true);
    }
  };

  const dxtxtShow = () => {
    const uo = CartStore.pdxtxtshow;
    if (uo === 'Y') {
      setCheckdxtxtShow(false);
      setShowxxfs('Y');
    } else {
      setCheckdxtxtShow(true);
      setShowxxfs('N');
    }
  };

  const sywzShow = () => {
    const uo = CartStore.psywzshow;
    if (uo === 'Y') {
      setChecksywzShow(false);
    } else {
      setChecksywzShow(true);
    }
  };

  const txShow = () => {
    const uo = CartStore.ptx;
    if (uo === 'Y') {
      setChecktx(false);
    } else {
      setChecktx(true);
    }
  };
  // 借阅天数
  const [jyts, setJyts] = useState(1);

  const jytsdev = () => {
    setJyts(CartStore.pDALYF002);
  };

  const [gridData, setGridData] = useState([]);

  // const [gridChangeData,setGridChangeData] =useState([]);

  const getGridData = () => {
    const uo = CartStore.cartDataSource;
    setGridData(uo);
  };

  const [filegrpid, setFilegrpid] = useState('');
  const [idv, setIdv] = useState('');

  const getFilegrpid = () => {
    const uo = CartStore.filegrpid;
    setFilegrpid(uo);
    const ss = { id: filegrpid };
    setIdv(JSON.stringify(ss));
  };

  const getParamfj = () => {
    const uo = CartStore.paramfj;
    if (uo === 'Y') {
      setFjShow(true);
    } else {
      setFjShow(false);
    }
  };

  useEffect(() => {
    jysmShow();
    lymdShow();
    txtxtShow();
    isDyXzShow();
    fksshowShow();
    dxtxtShow();
    sywzShow();
    txShow();
    jytsdev();
    getGridData();
    getFilegrpid();
    getParamfj();
  }, [
    CartStore.pjysm,
    CartStore.plymd,
    CartStore.ptxtxt,
    CartStore.pdyxz,
    CartStore.pfksshow,
    CartStore.pdxtxtshow,
    CartStore.psywzshow,
    CartStore.ptx,
    CartStore.pDALYF002,
    CartStore.cartDataSource,
    CartStore.filegrpid,
    CartStore.paramfj,
  ]);

  const handleOk = async (record) => {
    CartStore.delete(record);
    CartStore.query();
    RightStore.queryAllCartCount();
    Modal.destroyAll();
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
  };

  function showConfrim(record) {
    confirm({
      title: `确定要移除这条数据么?`,
      icon: <ExclamationCircleOutlined />,
      content: '数据移除后将无法进行借阅申请，请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        handleOk(record);
      },
      onCancel: handleCancel,
    });
  }

  const source = [
    {
      title: '序号',
      align: 'center',
      fixed: 'left',
      width: 60,
      render: (_, __, index: number) => index + 1,
    },
    {
      title: '电子借阅',
      dataIndex: 'dzjy',
      align: 'center',
      fixed: 'left',
      width: 80,
      formType: EpsFormType.Input,
      render: (text, record1) => {
        // setSwitchValue();
        const [switchValue, setSwitchValue] = useState(text === 'Y');
        useEffect(() => {
          setSwitchValue(text === 'Y');
        }, [text]);

        const onChange = async (checked) => {
          if (gridData) {
            for (let i = 0; i < gridData.length; i++) {
              const record = gridData[i];
              if (record.id === record1.id) {
                let statdzjy = 'Y';
                if (!checked) {
                  statdzjy = 'N';
                }

                //   Object.defineProperty(gridData[i],'dzjy',{ value:statdzjy,configurable: true});
                gridData[i].dzjy = statdzjy;
              }
            }
          }
        };
        return (
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            size="small"
            onChange={onChange}
            onClick={(val) => setSwitchValue(val)}
            checked={switchValue}
            defaultChecked={switchValue}
          />
        );
      },
    },
    {
      title: '实体借阅',
      dataIndex: 'stjy12',
      align: 'center',
      fixed: 'left',
      width: 300,
      formType: EpsFormType.Input,
      children: [
        {
          title: '原件',
          dataIndex: 'stjy',
          align: 'center',
          fixed: 'left',
          width: 80,
          formType: EpsFormType.Input,

          render: (text, record1) => {
            // setSwitchValue();
            const [switchValue, setSwitchValue] = useState(text === 'Y');
            useEffect(() => {
              setSwitchValue(text === 'Y');
            }, [text]);

            const onChange = async (checked) => {
              if (gridData) {
                for (let i = 0; i < gridData.length; i++) {
                  const record = gridData[i];
                  if (record.id === record1.id) {
                    let statstjy = 'Y';
                    if (!checked) {
                      statstjy = 'N';
                    } else {
                      message.info(
                        '本人承诺负责妥善保管借阅的档案原件，本人保证归还的档案未发生遗失、泄密、污损，严禁涂改、勾画、拆散、抽换、转借等情况。',
                      );
                    }
                    gridData[i].stjy = statstjy;
                  }
                }
              }
            };
            return (
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                size="small"
                onChange={onChange}
                onClick={(val) => setSwitchValue(val)}
                checked={switchValue}
                defaultChecked={switchValue}
              />
            );
          },
        },
        {
          title: '复印件份数',
          dataIndex: 'fyfs',
          align: 'center',
          fixed: 'left',
          width: 100,
          formType: EpsFormType.Input,
          render: (text: any, record: any, index: number) => {
            const [fyfsValue, setfyfsValue] = useState(text);
            useEffect(() => {
              setfyfsValue(text);
            }, [text]);
            const textChange = async (e: any, record: any) => {
              if (gridData) {
                let rows = [...CartStore.cartDataSource];
                let row = rows.find((item) => item.id === record.id);
                if (row) {
                  row.fyfs = e.target.value;
                }
                console.log('textChange=====');
              }
            };
            return (
              <Input
                disabled={false}
                onChange={(e) => {
                  textChange(e, record);
                }}
                defaultValue={fyfsValue}
              />
            );
          },
        },
      ],
    },
    // {
    //   title: '年度',
    //   dataIndex: 'nd',
    //   align: 'center',
    //   fixed: 'left',
    //   width: 80,
    //   formType: EpsFormType.Input
    // },
    {
      title: '题名',
      dataIndex: 'tm',
      align: 'center',
      fixed: 'left',
      width: 300,
      formType: EpsFormType.Input,
    },
    {
      title: '全宗号',
      dataIndex: 'qzh',
      align: 'center',
      fixed: 'left',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '全宗名',
      dataIndex: 'qzmc',
      align: 'center',
      fixed: 'left',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '档号',
      dataIndex: 'dh',
      align: 'center',
      fixed: 'left',
      width: 150,
      formType: EpsFormType.Input,
    },
    {
      title: '密级',
      dataIndex: 'mj',
      align: 'center',
      fixed: 'left',
      width: 120,
      formType: EpsFormType.Input,
    },
    {
      title: '保管期限',
      dataIndex: 'bgqx',
      align: 'center',
      fixed: 'left',
      width: 150,
      formType: EpsFormType.Input,
    },
    {
      title: '操作',
      key: 'option',
      align: 'center',
      fixed: 'center',
      width: 80,
      render: (text, record, index) => {
        return (
          <Tooltip title="删除">
            <Button
              size="small"
              danger={true}
              style={{ fontSize: '12px' }}
              type={'primary'}
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => showConfrim(record)}
            />
          </Tooltip>
        );
      },
    },
  ];

  const title: ITitle = {
    name: '借阅车管理',
  };

  const searchTm = () => {
    //  tableStore.findByKey();
    CartStore.query();
  };

  const [needFixed, setNeedFixed] = useState(false);

  const onFinish = (values: any) => {
    form
      .validateFields()
      .then((data) => {
        CartStore.apply(data, gridData)
          .then((res) => {
            debugger;
            /* //  message.success('密码修改成功');
             CartStore.query();
             RightStore.queryAllCartCount();*/
          })
          .catch((err) => {
            message.error(err);
          });
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const [form] = Form.useForm();
  const span = 6;

  const height = 32;

  const anchorHeaderStyle = needFixed
    ? { position: 'fixed', top: 0, zIndex: 3 }
    : {};

  const ininval = {
    action: plainOptions,
    sqr: props.jydxx.jyr,
    sqrq: props.jydxx.sqrq,
    yhlx: props.jydxx.yhlx,
    jybt: props.jydxx.jybt,
    lymd: props.jydxx.lymd,
    scghrq: moment(props.jydxx.ghrq),
    jysm: props.jydxx.bz,
  };

  let res: Array<any> = [];
  // @ts-ignore
  if (fjShow) {
    res.push(
      <EpsModalButton
        name="附件"
        title="附件"
        width={1200}
        useIframe={true}
        params={{
          docTbl: 'ATTACHDOC',
          docGrpTbl: 'DOCGROUP',
          grpid: filegrpid,
          idvs: idv,
          wrkTbl: 'JYD',
          lx: null,
          atdw: 'DEFAULT',
          tybz: 'N',
          whr: yhmc,
          whsj: getDate,
          fjsctrue: true,
        }}
        url={
          '/api/eps/control/main/6/scripts/thirdparty/uploadwindow/uploadwindow1.html'
        }
        icon={<ToolOutlined />}
        height={600}
      />,
    );
  } else {
    res.push(
      <Button
        type="primary"
        htmlType="submit"
        style={{ fontSize: '12px' }}
        icon={<SaveOutlined />}
      >
        提交
      </Button>,
    );
    res.push('       ');

    res.push(
      <Button
        type="primary"
        style={{ fontSize: '12px' }}
        onClick={searchTm}
        icon={<SyncOutlined />}
      >
        刷新明细
      </Button>,
    );
  }

  function disabledDate(current) {
    // Can not select days before today and today
    return (
      current < moment().subtract(0, 'days') ||
      current > moment().add(10, 'days')
    );
    // return current && current > moment().endOf('day');
  }

  //const _width=96%;
  return (
    <div style={{ height: '100%', overflowX: 'hidden', overflowY: 'auto' }}>
      <div className={props.umname ? 'title' : ''}>{props.umname}</div>
      <Space direction="vertical">
        <Form
          labelCol={{ span: 6, offset: 3 }}
          form={form}
          onFinish={onFinish}
          name="form1"
          style={anchorHeaderStyle}
          initialValues={ininval}
        >
          <Row>
            <Col>
              <div
                className="btns"
                style={{
                  marginTop: '10px',
                  marginRight: '10px',
                  padding: ' 0 20px',
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ fontSize: '12px' }}
                  icon={<SaveOutlined />}
                >
                  提交
                </Button>
                &nbsp;&nbsp;&nbsp;
                <EpsModalButton
                  name="附件"
                  title="附件"
                  width={1200}
                  useIframe={true}
                  hidden={!fjShow}
                  params={{
                    docTbl: 'ATTACHDOC',
                    docGrpTbl: 'DOCGROUP',
                    grpid: filegrpid,
                    idvs: idv,
                    wrkTbl: 'JYD',
                    lx: null,
                    atdw: 'DEFAULT',
                    tybz: 'N',
                    whr: yhmc,
                    whsj: getDate,
                    fjsctrue: true,
                  }}
                  url={
                    '/api/eps/control/main/6/scripts/thirdparty/uploadwindow/uploadwindow1.html'
                  }
                  icon={<ToolOutlined />}
                  height={600}
                />
              </div>
            </Col>
          </Row>
          <Divider orientation="left" plain>
            借阅人信息
          </Divider>
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            style={{ width: '96%' }}
          >
            <Col span={span} style={{ height: 52 }}>
              <Form.Item label="申请人" name="sqr">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={span} style={{ height: 52 }}>
              <Form.Item label="申请日期" name="sqrq">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={span} style={{ height: 52 }}>
              <Form.Item label="借阅人密级" name="yhlx">
                <Select disabled options={CartStore.lxdata} />
              </Form.Item>
            </Col>
            <Col span={span} style={{ height: 52 }}>
              <Form.Item
                label="单位"
                name="dw"
                initialValue={SysStore.getCurrentUser().dwmc}
              >
                <Input disabled />
              </Form.Item>{' '}
            </Col>
            <Col span={span} style={{ height: height }}>
              <Form.Item
                label="部门"
                name="bm"
                initialValue={SysStore.getCurrentUser().orgmc}
              >
                <Input disabled />
              </Form.Item>{' '}
            </Col>
            <Col span={span} style={{ height: height }}>
              <Form.Item
                label="借阅人岗位"
                name="yhgw"
                initialValue={SysStore.getCurrentUser().gw}
              >
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={span} style={{ height: height }}>
              <Form.Item
                label="手机"
                name="sj"
                hidden={checktx}
                initialValue={SysStore.getCurrentUser().sjh}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={span} style={{ height: height }}>
              <Form.Item
                label="邮箱"
                name="yx"
                hidden={checktx}
                initialValue={SysStore.getCurrentUser().mail}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" plain>
            借阅操作
          </Divider>
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            style={{ width: '96%' }}
          >
            <Col
              span={span}
              style={{
                padding: '0px 0px 0px 110px',
              }}
            >
              <Form.Item name="sfjggz">
                <Checkbox
                  disabled
                  name="sfjggz"
                  defaultvule={false}
                  onChange={(e) => {
                    onotherChange(e);
                  }}
                >
                  是否加盖公司公章
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={span}>
              <Form.Item name="sfjgfrgz">
                <Checkbox
                  disabled
                  name="sfjgfrgz"
                  defaultvule={false}
                  onChange={(e) => {
                    onotherChange(e);
                  }}
                >
                  是否加盖公司法人章
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="zzclfyj">
                <Checkbox
                  disabled
                  name="zzclfyj"
                  defaultvule={false}
                  onChange={(e) => {
                    onotherChange(e);
                  }}
                >
                  证照等材料复印件
                  <span
                    style={{
                      color: 'red',
                    }}
                  >
                    (证照等材料包括：公司营业执照正副本、经营许可证正副本、法人身份证、基本账户信息、公司年报、审计报告、公司章程等文件材料。
                    注：如果选择，则打印下载不可选择)
                  </span>
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={span}>
              <Form.Item
                label="标题"
                name="jybt"
                rules={[{ required: true, message: '标题不允许为空!' }]}
              >
                <Input
                  disabled
                  placeholder="举例：关于xx事项（项目）调阅档案申请"
                />
              </Form.Item>
            </Col>
            <Col span={span}>
              <Form.Item label="上次归还日期" name="scghrq">
                <DatePicker
                  disabled
                  disabledDate={disabledDate}
                  placeholder="上次归还日期"
                />
              </Form.Item>
            </Col>
            <Col span={span}>
              <Form.Item
                label="归还日期"
                name="ghrq"
                rules={[{ required: true, message: '归还日期不允许为空!' }]}
              >
                <DatePicker
                  disabledDate={disabledDate}
                  placeholder="归还日期"
                />
              </Form.Item>
            </Col>
            <Col span={span}>
              <Form.Item label="" labelCol={{ span: 12 }} name="action">
                <Checkbox.Group
                  key={defaultVals}
                  options={plainOptions}
                  defaultValue={defaultVals}
                  onChange={onChange}
                />
              </Form.Item>
            </Col>

            <Col span={24} style={{ height: 98 }}>
              <Form.Item
                label="利用说明"
                labelCol={{ span: 2 }}
                name="jysm"
                rules={[
                  { required: checkJysm, message: '利用说明不允许为空!' },
                ]}
              >
                <Input.TextArea
                  placeholder="请输入对利用目的详细说明"
                  rows={4}
                ></Input.TextArea>
              </Form.Item>
            </Col>

            <Col span={24}>
              <div
                style={{
                  color: 'red',
                  padding: '10px 10px 10px 100px',
                  fontSize: '15px',
                }}
              >
                本人承诺本次借阅的电子档案，借阅期间不私自篡改、转借、复制或改作其他用途。
              </div>
            </Col>
          </Row>

          <div hidden={checksywzShow}>
            <Divider orientation="left" plain>
              文件相关
            </Divider>

            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ height: height, width: '96%' }}
            >
              <Col span={span}>
                <Form.Item label="水印文字" name="sywz">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col span={span}>
                <Form.Item
                  label="文件下载数"
                  name="dowlnnum"
                  initialValue="0"
                  hidden={checkFksshow}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={span}>
                <Form.Item
                  label="文件打印数"
                  name="printnum"
                  initialValue="0"
                  hidden={checkFksshow}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={span}>
                <Form.Item
                  label="文件打开数"
                  name="opennum"
                  initialValue="0"
                  hidden={checkFksshow}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={span}>
                <Form.Item
                  hidden
                  name="yhid"
                  initialValue={SysStore.getCurrentUser().id}
                >
                  <Input hidden />
                </Form.Item>
              </Col>

              <Col span={span}>
                <Form.Item
                  name="dwid"
                  hidden
                  initialValue={SysStore.getCurrentUser().dwid}
                >
                  <Input hidden />
                </Form.Item>
              </Col>

              <Col span={span}>
                <Form.Item
                  name="bmid"
                  hidden
                  initialValue={SysStore.getCurrentUser().bmid}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Space>
    </div>
  );
});

export default Daxj;

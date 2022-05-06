import { observable, action, makeAutoObservable, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import SysStore from '@/stores/system/SysStore';

class DalydjntjStore {
  url = '';
  wfenable = false;
  oldver = true;

  // 查询条件
  @observable isExpand = true;
  @observable jyrxz = '';
  @observable lydanr = '';
  @observable lyfs = '';
  @observable lymd = '';
  @observable xslx = 'tjlb';
  @observable lyxg = '';
  @observable tjxs = '';
  @observable djrq = [];

  @observable loading = false;
  @observable params = {};
  @observable data = [];
  @observable dataSource = [];
  columns = [];
  columnameList = [];
  columnResult = [];
  //查档内容
  @observable daklist = [];
  //数据字典
  @observable sjzdData = {};

  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
    makeAutoObservable(this);
  }

  @action setJyrxz = (jyrxz) => {
    this.jyrxz = jyrxz;
  };

  @action setLydanr = (lydanr) => {
    this.lydanr = lydanr;
  };

  @action setLyfs = (lyfs) => {
    this.lyfs = lyfs;
  };

  @action setLymd = (lymd) => {
    this.lymd = lymd;
  };

  @action setXslx = (xslx) => {
    this.xslx = xslx;
  };

  @action setLyxg = (lyxg) => {
    this.lyxg = lyxg;
  };

  @action setDjrq = (djrq) => {
    this.djrq = djrq;
  };

  @action setTjxs = (tjxs) => {
    this.tjxs = tjxs;
  };

  @action setExpand = (expend) => {
    this.isExpand = expend;
  };

  setColumns = (columns) => {
    runInAction(() => {
      this.columns = columns;
    });
  };
  setDataSource = (dataSource) => {
    this.dataSource = dataSource;
  };
  // 查询查档内容
  @action getDakTree = async () => {
    const params = { isby: 'N', noshowdw: 'Y', node: 'root', tmzt: '4' };
    params['dayh'] = SysStore.getCurrentUser().id;
    params['dw'] = SysStore.getCurrentCmp().id;
    const res = await fetch.get('/api/eps/control/main/dak/queryTree', {
      params,
    });
    runInAction(() => {
      //   this.treeData = this.getData(res && res.data);
      this.daklist = this.getDakList(res && res.data);
    });
  };
  getDakList = (data) => {
    if (!data || data.length === 0) {
      return null;
    }
    const arr = [];
    data.forEach((d) => {
      d.type !== 'F' &&
        arr.push({
          label: d.label,
          value: d.mc,
          key: d.id,
        });
      const chld = this.getDakList(d.children);
      chld && arr.push(...chld);
    });
    return arr;
  };
  //数据字段查询
  getSjzdData = async (zdmc) => {
    const fd = new FormData();
    fd.append('zdx', zdmc);
    const res = await fetch.post('/api/eps/control/main/dalydj/querySjzd', fd);
    if (res && res.data && res.data.success) {
      runInAction(() => {
        this.sjzdData[zdmc] = res.data.results;
      });
    }
  };
  setParams = async (params, nosearch) => {
    this.params = { ...params };
    if (!nosearch) {
      this.loading = true;
      const par = this.params;
      const xs = par['tjxs'];
      const lxxs = par['xslx'];
      const columsetslist = [];
      const columname = [];
      if (lxxs == 'tjlb') {
        columsetslist.push({
          dataIndex: 'lynd',
          width: 100,
          title: '年度',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.lynd - b.lynd,
          fixed: true,
        });
        columname.push('年度');
        if (xs && xs.length > 0) {
          for (var i = 0, l = xs.length; i < l; i++) {
            var a = xs[i];
            switch (a) {
              // case 'lyndxs':
              //   columsetslist.push({
              //     dataIndex: 'lynd',
              //     width: 100,
              //     title: '年度',
              //     defaultSortOrder: 'descend',
              //     sorter: (a, b) => a.lynd - b.lynd,
              //     fixed: true,
              //   });
              //   columname.push('年度');
              //   break;
              case 'lyyfxs':
                columsetslist.push({
                  dataIndex: 'lyyf',
                  width: 100,
                  title: '月份',
                  defaultSortOrder: 'descend',
                  sorter: (a, b) => a.lyyf - b.lyyf,
                });
                columname.push('月份');
                break;
              case 'djrxs':
                columsetslist.push({
                  dataIndex: 'djr',
                  width: 150,
                  title: '登记人',
                  defaultSortOrder: 'descend',
                  sorter: (a, b) => a.djr - b.djr,
                });
                columname.push('登记人');
                break;
              case 'jyrxzxs':
                columsetslist.push({
                  title: '利用人性质',
                  dataIndex: 'jyrxz',
                  width: 150,
                  defaultSortOrder: 'descend',
                  sorter: (a, b) => a.jyrxz - b.jyrxz,
                });
                columname.push('利用人性质');
                break;
              case 'lydanrxs':
                columsetslist.push({
                  dataIndex: 'lydanr',
                  width: 200,
                  title: '查档内容',
                  defaultSortOrder: 'descend',
                  sorter: (a, b) => a.lydanr - b.lydanr,
                });
                columname.push('查档内容');
                break;
              case 'lyfsxs':
                columsetslist.push({
                  dataIndex: 'lyfs',
                  width: 120,
                  title: '利用方式',
                  defaultSortOrder: 'descend',
                  sorter: (a, b) => a.lyfs - b.lyfs,
                });

                columname.push('利用方式');
                break;
              case 'lymdxs':
                columsetslist.push({
                  dataIndex: 'lymd',
                  width: 120,
                  title: '利用目的',
                  defaultSortOrder: 'descend',
                  sorter: (a, b) => a.lymd - b.lymd,
                });
                columname.push('利用目的');
                break;
              case 'lyxgxs':
                columsetslist.push({
                  dataIndex: 'lyxg',
                  width: 120,
                  title: '利用效果',
                  defaultSortOrder: 'descend',
                  sorter: (a, b) => a.lyxg - b.lyxg,
                });
                columname.push('利用效果');
                break;
            }
          }
        }
        columsetslist.push({
          dataIndex: 'lyrc',
          width: 120,
          title: '利用人次',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.lyrc - b.lyrc,
        });
        columsetslist.push({
          dataIndex: 'lyjc',
          width: 120,
          title: '利用件次',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.lyjc - b.lyjc,
        });
        columsetslist.push({
          dataIndex: 'dyys',
          width: 120,
          title: '打印页数',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.dyys - b.dyys,
        });
        columsetslist.push({
          dataIndex: 'fpys',
          width: 120,
          title: '翻拍页数',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.fpys - b.fpys,
        });
        columsetslist.push({
          dataIndex: 'xzwjs',
          width: 150,
          title: '下载文件数',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.xzwjs - b.xzwjs,
        });
        columsetslist.push({
          dataIndex: 'kpzs',
          width: 120,
          title: '复印页数',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.kpzs - b.kpzs,
        });
        columsetslist.push({
          dataIndex: 'dzlcs',
          width: 150,
          title: '调资料册数',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.dzlcs - b.dzlcs,
        });
        columsetslist.push({
          dataIndex: 'cjzms',
          width: 150,
          title: '出具证明数',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.cjzms - b.cjzms,
        });
        columname.push('利用人次');
        columname.push('利用件次');
        columname.push('打印页数');
        columname.push('翻拍页数');
        columname.push('下载文件数');
        columname.push('复印页数');
        columname.push('调资料册数');
        columname.push('出具证明数');
        columname.push('满意度一星');
        columname.push('满意度二星');
        columname.push('满意度三星');
        columname.push('满意度四星');
        columname.push('满意度五星');
        const response = await fetch.post(
          '/api/eps/control/main/basetj/queryForDalydjntjQueryList',
          this.params,
        );
        console.log('repppsss=', response.data);
        runInAction(() => {
          debugger;
          this.columns = columsetslist;
          this.columnameList = columname;
          if (response && response.status === 200) {
            this.setDataSource = response.data;
            this.data = response.data;
            this.dataSource = response.data;
            const records = response.data;
            for (var i in records) {
              const record = records[i];
              const obj = {};
              debugger;
              for (var name in record) {
                if (name === 'lynd') {
                  obj['年度'] = record['lynd'];
                } else if (name === 'lyyf') {
                  obj['月份'] = record['lyyf'];
                } else if (name === 'djr') {
                  obj['登记人'] = record['djr'];
                } else if (name === 'jyrxz') {
                  obj['利用人性质'] = record['jyrxz'];
                } else if (name === 'lydanr') {
                  obj['查档内容'] = record['lydanr'];
                } else if (name === 'lyfs') {
                  obj['利用方式'] = record['lyfs'];
                } else if (name === 'lymd') {
                  obj['利用目的'] = record['lymd'];
                } else if (name === 'lyxg') {
                  obj['利用效果'] = record['lyxg'];
                } else if (name === 'djrq') {
                  obj['登记时间'] = record['djrq'];
                } else if (name === 'lyrc') {
                  obj['利用人次'] = record['lyrc'];
                } else if (name === 'lyjc') {
                  obj['利用件次'] = record['lyjc'];
                } else if (name === 'dyys') {
                  obj['打印页数'] = record['dyys'];
                } else if (name === 'fpys') {
                  obj['翻拍页数'] = record['fpys'];
                } else if (name === 'xzwjs') {
                  obj['下载文件数'] = record['xzwjs'];
                } else if (name === 'kpzs') {
                  obj['复印页数'] = record['kpzs'];
                } else if (name === 'dzlcs') {
                  obj['调资料册数'] = record['dzlcs'];
                } else if (name === 'cjzms') {
                  obj['出具证明数'] = record['cjzms'];
                } else if (name === 'onex') {
                  obj['满意度一星'] = record['onex'];
                } else if (name === 'twox') {
                  obj['满意度二星'] = record['twox'];
                } else if (name === 'threex') {
                  obj['满意度三星'] = record['threex'];
                } else if (name === 'fourx') {
                  obj['满意度四星'] = record['fourx'];
                } else if (name === 'fivex') {
                  obj['满意度五星'] = record['fivex'];
                }
              }
              this.columnResult.push(obj);
            }

            console.log('columsetslist=====', this.columnResult);
            this.loading = false;
          } else {
            this.loading = true;
          }
        });
      }
    }
  };
}

export default new DalydjntjStore('/api/eps/control/main/basetj');

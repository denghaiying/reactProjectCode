import { useEffect } from 'react';
import TableService from './dataDictionaryService';
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import { observer, useLocalObservable } from 'mobx-react';
import { runInAction } from 'mobx';
import Approve from '@/eps/business/Approve/ApproveTab';
import { useIntl } from 'umi';
import { Label } from '@icon-park/react';

const Kfjd = observer((props) => {
  // eslint-disable-next-line prefer-destructuring
  const intl = useIntl();
  const location: locationType = props.location;
  const archParams: ArchParams = location.query;
  // 是否案卷
  const isRecords = archParams.lx != '01' && archParams.lx != '0201';
  // tmzt
  const tmzt = 3;
  // 鉴定编号
  const jdlx = 'kfjd';
  // 流程编号
  const wfCode = 'kfjd';
  //umid
  const umid = 'DAJD008';
  //umid
  const jdurl = 'kfjdsp';
  // 审批意见标记描述
  const approveMark = { agree: '开放', disAgree: '控制' };
  const canAdd = true;
  // 主表columns

  const store = useLocalObservable(() => ({
    // 审批
    applylevel: {
      label: '鉴定标识',
      name: 'applylevel',
      options: [
        {
          label:
            'A.馆藏档案形成未满30年，属于绝密级期限内或涉及重大政治、经济、外交、国防和个人隐私、省市级以上各种重要会议、区级以上党政机关常务会议及行政办公会议的档案；馆藏档案形成虽已满30年，但仍关系党和国家形象、利益、安全等重大问题的档案',
          value: 'A',
        },
        {
          label:
            'B.馆藏档案中属于机密、秘密期限内的档案文件以及区级以下各级党、政、社、团机关常务会议记录、组织名录、工作笔记等；馆藏档案虽已解密，但属于一般控制类档案',
          value: 'B',
        },
        {
          label:
            'C.馆藏档案形成不满30年非涉密的非普发性文件及已经解密的档案文件',
          value: 'C',
        },
        {
          label: 'D.馆藏档案中依照档案法必须向社会开放的和已经公开的现行文件',
          value: 'D',
        },
      ],
    },
    // applyLevel:nu,
    async initApplyLevel() {
      const res = await TableService.query({ mc: '鉴定标识' });
      console.log(res);
      if (res) {
        runInAction(() => {
          const options = res.map((item) => {
            return { lable: item.mc, value: item.bh };
          });
          debugger;
          store.options = options;
        });
      }
    },
  }));

  useEffect(() => {
    //  store.initApplyLevel();
    //   }
  }, []);

  return (
    <Approve
      tmzt={tmzt}
      canAdd={canAdd}
      jdlx={jdlx}
      applylevel={store.applylevel}
      wfCode={wfCode}
      umid={umid}
      approveMark={approveMark}
      spurl={jdurl}
      {...props}
    />
  );
});

export default Kfjd;

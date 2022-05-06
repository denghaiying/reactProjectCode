import { useEffect } from 'react';
import TableService from './TableService';
import { observer, useLocalStore } from 'mobx-react';
import { runInAction } from 'mobx';
import ArchPanel from './ArchPanel';
// import EpsModalButton from "@/eps/components/buttons/EpsModalButton";
import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { Button, Form, Input, message, Modal, Select, Tooltip } from 'antd';
import EpsFormType from '@/eps/commons/EpsFormType';
import EpsUploadButton from '@/eps/components/buttons/EpsUploadButton';
import SysStore from '@/stores/system/SysStore';
import wdglAttachdocService from './WdglAttachdocService';
import { ArchParams } from '@/stores/appraisa/AppraisaManageStore';
import dakoptService from './dakoptService';

const Dakupload = observer((props) => {
  const store = useLocalStore(() => ({
    ktable: {},
    doctypelist: [],
    daqx: '',
    fjmjlist: [],
    /**
     * 附件列表 表格source
     */
    uploadProp: {
      disableUpload: true,
      disableBigUpload: true,
      disableConvertFiles: true,
      disableMediaTwo: true,
      disableMediaSpilit: true,
      disableMediaConcat: true,
      uploadUrl: '/api/eps/wdgl/attachdoc/upload', //上传url地址
      dw: SysStore.getCurrentUser().dwid, //用户单位ID
      umId: 'DAGL003',
      aprint: '', //水印打印次数
      adown: '', //水印下载 次数
    },
    uploadtableProp: {
      disableAdd: true,
      disableCopy: true,
      labelColSpan: 8,
      tableSearch: false,
      rowSelection: {
        //type: 'radio',
        type: 'checkbox',
      },
      searchCode: 'title',
      afterDelete: () => {
        if (props.refreshPage != undefined) {
            var xxx =props.refreshPage;
            xxx();
        }
      },
    },

    fjsource: [
      {
        title: '标题',
        code: 'title',
        align: 'center',
        formType: EpsFormType.Input,
        width: 150,
      },
      {
        title: '文件名',
        code: 'filename',
        align: 'center',
        formType: EpsFormType.Input,
        width: 150,
      },
      {
        title: '文件类型',
        code: 'ext',
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '文件大小',
        code: 'fullsize',
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '文件分类',
        code: 'lx',
        align: 'center',
        formType: EpsFormType.Input,
        render: (text, record, index) => {
          let xfglist = store.doctypelist;
          let aa = xfglist.filter((item) => {
            return item.value === text;
          });
          return aa[0]?.label;
        },
      },
      {
        title: '文件密级',
        code: 'mj',
        align: 'center',
        formType: EpsFormType.Input,
        render: (text, record, index) => {
          let xfglist = store.fjmjlist;
          let aa = xfglist.filter((item) => {
            return item.value === text;
          });
          return aa[0]?.label;
        },
      },
      {
        title: '版本号',
        code: 'bbh',
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '校验码',
        code: 'md5code',
        align: 'center',
        formType: EpsFormType.Input,
      },
      {
        title: '文件转换',
        code: 'wjzh',
        align: 'center',
        formType: EpsFormType.Input,
        render: (text, record) => {
          // if (text == "undefined") {
          //   return "未转换";
          // } else if (text == 0) {
          //   return "未转换";
          // } else if (text == 1) {
          //   return "转换成功";
          // } else if (text == 13) {
          //   return "转换失败";
          // }
          if (text === '1') {
            return '转换成功';
          } else {
            return '未转换';
          }
        },
      },
    ],
    ywpsql: '',
    initSysOpertion(archParams: ArchParams, bmc: string, dakqx) {
      this.uploadProp.doctbl = bmc + '_FJ'; //附件表名
      this.uploadProp.grptbl = bmc + '_FJFZ'; //附件分组表名
      this.uploadProp.wrkTbl = bmc; //数据表名
      this.uploadProp.dakid = archParams.dakid;
      this.ywpsql = archParams.ywpsql;
      if (dakqx != undefined && dakqx != null && dakqx != '') {
        /**附件权限 */
        if (dakqx.indexOf('SYS302') > 0) {
          this.uploadProp['disableViewDoc'] = false;
        }
        if (dakqx.indexOf('SYS309') > 0) {
          this.uploadProp['disableYwViewDoc'] = false;
        }
        if (dakqx.indexOf('SYS310') > 0) {
          this.uploadProp['disableYwDown'] = false;
        }
        if (dakqx.indexOf('SYS303') > 0) {
          this.uploadProp['disableDown'] = false;
        }
        if (dakqx.indexOf('SYS304') > 0) {
          this.uploadProp['fjdyViewODC'] = false;
        }
        if (dakqx.indexOf('SYS305') > 0) {
          this.uploadProp['disableUpload'] = false;
          this.uploadProp['disableBigUpload'] = false;
        } else {
          this.uploadProp['disableUpload'] = true;
          this.uploadProp['disableBigUpload'] = true;
        }

        if (dakqx.indexOf('SYS311') > 0) {
          this.uploadProp['disableConvertViewDoc'] = false;
        } else {
          this.uploadProp['disableConvertViewDoc'] = true;
        }

        if (dakqx.indexOf('SYS312') > 0) {
          this.uploadProp['disableConvertDown'] = false;
        } else {
          this.uploadProp['disableConvertDown'] = true;
        }

        if (dakqx.indexOf('SYS308') > 0) {
          this.uploadProp['disableScanner'] = false;
        }
        if (dakqx.indexOf('MEDIA001') > 0) {
          this.uploadProp['disableMediaTwo'] = false;
        } else {
          this.uploadProp['disableMediaTwo'] = true;
        }

        if (dakqx.indexOf('MEDIA002') > 0) {
          this.uploadProp['disableMediaSpilit'] = false;
        } else {
          this.uploadProp['disableMediaSpilit'] = true;
        }

        if (dakqx.indexOf('MEDIA003') > 0) {
          this.uploadProp['disableMediaConcat'] = false;
        } else {
          this.uploadProp['disableMediaConcat'] = true;
        }
        this.uploadProp['disableConvertFiles'] = false;
      }
    },

    // 权限初始化数据
    async initAuth(archParams: ArchParams, ktable) {
      if (!ktable.bmc) {
        return;
      }
      const { dakid, tmzt } = archParams;

      const dakqx = await dakoptService.findqx({
        tmzt: tmzt,
        yhid: dakoptService.yhid,
        dakid: archParams.dakid,
      });

      const doctype = await TableService.getDoctype();
      store.doctypelist = doctype;

      const fjmj = await TableService.getFjmjlist();
      store.fjmjlist = fjmj;
      // 系统按钮权限
      this.daqx = dakqx;
      const mjkq = await TableService.fjmjSfqy();
      this.uploadProp['mjkq'] = mjkq;
      this.initSysOpertion(archParams, props?.bmc, dakqx);
    },
  }));

  //附件修改表单
  const upcustomForm = () => {
    return (
      <>
        <Form.Item label="标题:" name="title">
          <Input style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="文件名:" name="filename">
          <Input disabled style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="文件类型:" name="ext">
          <Input disabled style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="文件大小:" name="fullsize">
          <Input disabled style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="文件分类:" name="lx">
          <Select
            style={{ width: 180 }}
            placeholder="文件类型"
            allowClear
            options={store.doctypelist}
          />
        </Form.Item>
        <Form.Item label="文件密级:" name="mj">
          <Select
            style={{ width: 180 }}
            placeholder="文件类型"
            allowClear
            options={store.fjmjlist}
          />
        </Form.Item>
        <Form.Item label="版本号:" name="bbh">
          <Input disabled style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="校验码:" name="md5code">
          <Input disabled style={{ width: 180 }} />
        </Form.Item>
        <Form.Item
          label="xxx:"
          name="doctbl"
          hidden
          initialValue={props.bmc + '_FJ'}
        >
          <Input disabled style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="xx:" name="fileid" hidden>
          <Input disabled style={{ width: 180 }} />
        </Form.Item>
      </>
    );
  };

  useEffect(() => {
    store.initAuth(props.archParams, props.ktable);
  }, []);

  return (
    <EpsUploadButton
      title={'附件信息'} // 组件标题，必填
      uploadProp={store.uploadProp} //附件上传prop
      width={1500}
      source={store.fjsource}
      height={700}
      refesdata={props.refreshPage}
      grpid={props.filegrpid}
      mj={props.mj}
      fjs={props.fjs}
      tmzt={props.tmzt}
      customForm={upcustomForm}
      daktmid={props.daktmid}
      store={props.store}
      onUploadClick={() => {
        return Promise.resolve({
          wrkTbl: props?.bmc,
          docTbl: props?.bmc + '_FJ',
          docGrpTbl: props?.bmc + '_FJFZ',
          grpid: props.filegrpid,
          daktmid: props.daktmid,
          tmzt: props.tmzt,
          dakid: props.dakid,
          atdw: SysStore.getCurrentUser().dwid,
          idvs: JSON.stringify({ id: props.daktmid }),
          mj: '无密级',
        });
      }}
      params={{
        wrkTbl: props?.bmc,
        docTbl: props?.bmc + '_FJ',
        docGrpTbl: props?.bmc + '_FJFZ',
        grpid: props.filegrpid,
        daktmid: props.daktmid,
        tmzt: props.tmzt,
        dakid: props.dakid,
        atdw: SysStore.getCurrentUser().dwid,
        idvs: JSON.stringify({ id: props.daktmid }),
        mj: '无密级',
      }} //附件上传参数
      tableProp={store.uploadtableProp} //附件列表prop
      tableService={wdglAttachdocService} //附件列表server
      tableparams={{
        wrkTbl: props?.bmc,
        doctbl: props?.bmc + '_FJ',
        grptbl: props?.bmc + '_FJFZ',
        grpid: props.filegrpid,
        daktmid: props.daktmid,
        psql: store.ywpsql,
      }} //附件列表参数
    />
  );
});

export default Dakupload;

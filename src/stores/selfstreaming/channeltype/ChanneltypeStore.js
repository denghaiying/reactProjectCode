import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../../BaseStore';
import ChanneltypeService from '../../../services/selfstreaming/channeltype/ChanneltypeService';
import diagest from '../../../utils/diagest';
import fetch from '../../../utils/fetch';


class ChanneltypeStore extends BaseStore {


    @observable columns =[
      {
        title: 'e9.channeltype.channeltype.channeltypebh',
        dataIndex: 'channeltypebh',
        width: 90,
      },
      {
        title:  'e9.channeltype.channeltype.channeltypename',
        dataIndex: 'channeltypename',
        width: 120,
      },
      {
        title:  'e9.pub.whr',
        dataIndex: 'whr',
        width: 90,
      },
      {
        title:  'e9.pub.whsj',
        dataIndex: 'whsj',
        width: 90
      },
    ];

  @action setParams = async (params, nosearch) => {
    this.params = params;
    if (!nosearch) {
      await this.queryData();
    }
  }


  @action showEditForm = (opt, editRecord) => {
    this.opt = opt;
    this.editVisible = true;
    this.editRecord = this.beforeSetEditRecord(editRecord);
    if (this.wfenable) {
      this.getProcOpt(this.editRecord);
    }
  };

  @action queryData  = async () => {
    this.loading = true;
    try {
      var xdataS = await ChanneltypeService.findForPage(this.params, this.pageno, this.pagesize);
      this.data=[];
      this.data=xdataS;
      this.loading = false;
    } catch (err) {
      this.loading = true;
      throw err;
    }
  }

    @action setPageNo = async (pageno) => {
     this.pageno = pageno;
     this.loading = true;
    try {
         var xdataS = await ChanneltypeService.findForPage(this.params, this.pageno, this.pagesize);
      this.data=[];
      this.data=xdataS;
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }

  @action setPageSize = async (pageSize) => {
    this.pagesize = pageSize;
    this.loading = true;
    try {
       var xdataS = await ChanneltypeService.findForPage(this.params, this.pageno, this.pagesize);
      this.data=[];
      this.data=xdataS;
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }

  @action saveData = async (values) => {
    try {
      if (this.opt === 'edit') {
         await ChanneltypeService.updatesome(this.editRecord.id, values);
      } else {
        await ChanneltypeService.add(values);
      }
      this.editVisible = false;
      this.loading = true;
      var xdataS = await ChanneltypeService.findForPage(this.params, this.pageno, this.pagesize);
      this.data=[];
      this.data=xdataS;
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }

   /**
   * 删除操作
   */
  @action delete = async (id) => {
    try {
    // this.deletevisible = false;
      await ChanneltypeService.delete(id);
      this.editVisible = false;
      this.loading = true;
       var xdataS = await ChanneltypeService.findForPage(this.params, this.pageno, this.pagesize);
      this.data=[];
      this.data=xdataS;
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }

}

export default new ChanneltypeStore('/streamingapi/channeltype');

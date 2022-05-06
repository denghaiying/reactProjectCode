import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';
import React from 'react';


class KfDakStore extends BaseStore {

  @observable total = "";
  @observable StartTime = "";
  @observable EndTime = "";
  @observable tm = "";

  @observable page_no = 1;
  @observable page_size = 100;





  @action setPage_No = async (pageno) => {
    this.page_no = pageno;
    await this.queryForPage();
  }

  @action setPage_Size = async (pageSize) => {
    this.page_size = pageSize;
    await this.queryForPage();
  }




   queryForPage = async () => {
    this.loading = true;

    const response = await fetch.get(`${this.url}/queryForPage?pageIndex=${this.page_no - 1}&pageSize=${this.page_size}&page=${this.page_no - 1}&limit=${this.page_size}&tm=${this.tm}&StartTime=${this.StartTime}&EndTime=${this.EndTime}`);
    if (response && response.status === 200) {
      runInAction( () => {
        this.total = response.data.total;
        this.data = response.data.results;
        this.loading = false;
      });
    }
    else {
      this.loading = true;
    }

  }

}

export default new KfDakStore('/api/eps/control/main/kfdak');

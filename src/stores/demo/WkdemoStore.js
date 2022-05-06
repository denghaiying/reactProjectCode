import React from 'react';
import { makeObservable, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
import fetch from '@/utils/fetch';
import SysStore from '@/stores/system/SysStore';
import FgService from '@/services/ksh/FgService';
import diagest from '@/utils/diagest';
import BaseWfStore from '../workflow/BaseWfStore';
import DapubStore from '../dagl/DapubStore';
import { message } from 'antd';
import { AirConditioning } from '@icon-park/react';

class WkdemoStore extends BaseWfStore {
  constructor(url, wfenable, oldver = true) {
    super(url, wfenable, oldver);
  }

}



export default new WkdemoStore('/eps/demo/wkdemo', true, false);


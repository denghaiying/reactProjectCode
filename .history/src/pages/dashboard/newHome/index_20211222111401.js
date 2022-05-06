import React, { useEffect } from 'react';
import './index.less';
import {
  Calendar,
  Button,
  Input,
  Icon,
  Select,
  Radio,
  Slider,
  TreeSelect,
} from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import E9Config from '../../../utils/e9config';
import fetch from '../../../utils/fetch';
import dbxx from '../../../styles/assets/img/icon_db.png'
import jstj from '../../../styles/assets/img/icon_js.png'
import lytj from '../../../styles/assets/img/icon_lytj.png'
import ybxx from '../../../styles/assets/img/icon_ybxx.png'

import { useIntl } from 'umi';

//var xzpkList=[];
const Rgjhome = observer((props) => {
  const { xzpkList } = props;
  const intl = useIntl();
  const formatMessage = intl.formatMessage;

  //   fetch.post('/eps/portalui/portalui/queryForChanelName?page=1&start=0&limit=6&bh=tpda').then((result) => {
  //
  //               xzpkList=result.data.results;

  //             })
  useEffect(() => {

  }, []);



  // end **************

  return (
    <div className='newHome-page'>
    <div className='newHome-body'>
      <div className='common-line'>
        <div className='common-b'>
          <div className='title'>
            <img src={dbxx} alt=""/>
            <span className='val'>待办信息</span>
            <span className='num'>8</span>
          </div>
          <div className='content'>1</div>
        </div>
        <div className='common-b'>
          <div className='title'>
            <img src={ybxx} alt=""/>
            <span className='val'>已办信息</span>
            <span className='num'>6</span>
          </div>
          <div className='content'>2</div>
        </div>
      </div>
      <div className='common-line'>
        <div className='common-b'>
          <div className='title'>
            <img src={lytj} alt=""/>
            <span className='val'>利用统计</span>
          </div>
          <div className='content'>3</div>
        </div>
        <div className='common-b'>
          <div className='title'>
            <img src={jstj} alt=""/>
            <span className='val'>接收统计</span>
          </div>
          <div className='content'>4</div>
        </div>
      </div>
    </div>
  </div>
  );
});
export default Rgjhome;

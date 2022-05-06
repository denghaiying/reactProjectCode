import React, { useEffect } from 'react';
import './index.less';
import { observer } from 'mobx-react';
import E9Config from '../../../utils/e9config';
import fetch from '../../../utils/fetch';
import dbxx from '../../../styles/assets/img/icon_db.png'
import jstj from '../../../styles/assets/img/icon_js.png'
import lytj from '../../../styles/assets/img/icon_lytj.png'
import ybxx from '../../../styles/assets/img/icon_ybxx.png'
import RgjhomeStore from "../../../stores/dashboard/RgjhomeStore";
import { useIntl } from 'umi';
import moment from 'moment';
//var xzpkList=[];
const newHome = observer((props) => {
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const {dbpage, dbList } = RgjhomeStore;

  useEffect(() => {
    dbpage();
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
          <div className='content'>

          {
                dbList && dbList.map(item => (
                    <li key={item.wfinst} className="p_item">
                      <a href="javascript:;"  onClick={() => handleSw(item)}>{item.title ? item.title.substring(0, 15):item.title}</a>
                      <span>{moment(item.pbegin).format('YYYY-MM-DD')}</span>
                    </li>
                ))
              }
              <p className="bottom" onClick={() => opendb()}>{'<更多>'}</p>
          </div>
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
export default newHome;

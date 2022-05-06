/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-useless-escape */
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Row, Col } from '@alifd/next/lib/grid';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
// import xtglImg from '../../styles/images/ico_xtgl.png';
import defaultImg from '../../styles/images/ico_default.png';
import './Desktop.scss';
import LoginStore from '../../stores/system/LoginStore';
import { getLocale } from '../../utils/locale';

const Desktop = observer(() => {
  const local = getLocale();

  useEffect(() => {
    LoginStore.findSystem({ allshow: 1 });
  }, []);

  const getSystems = () => {
    const modules = [];
    LoginStore.systems.filter(item => item.systemShowtype !== 0 || (LoginStore.userinfo.userType === 1 && item.id === 'sysuser')).forEach(item => {
      modules.push({
        title: local && local === 'en-US' ? item.systemEnname : item.systemName,
        img: item.systemType !== 9 ? require(`../../styles/images/icon_${item.id}.png`) : defaultImg,
        systype: item.systemType,
        // url: item.systemUrl,
        url: item.systemUrl,
        key: item.id,
        type: item.systemShowtype,
      });
    });
    return modules;
  };


  return (
    <div role="grid" className="desktop">
      <Row wrap>{getSystems().map((item) => (
        <Col key={`col-${item.key}`} offset="1" span="3" style={{ textAlign: 'center', fontSize: '16px' }}>
          {item.type === 1 &&
            <Link to={item.systype === 9 ? `/rurl/${encodeURIComponent(item.url)}` : `/run/${item.key}`} >
              <div className="colitem">
                <img src={item.img} alt="" />
              </div>
              <p >{item.title}</p>
            </Link>}
          {item.type === 2 &&
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <div className="colitem">
                <img src={item.img} alt="" />
              </div>
              <p >{item.title}</p>
            </a>}
        </Col>
        // {(index + 1) % 6 == 0 && </Row>}
      )
      )}
      </Row>
    </div >);
});

export default injectIntl(Desktop);

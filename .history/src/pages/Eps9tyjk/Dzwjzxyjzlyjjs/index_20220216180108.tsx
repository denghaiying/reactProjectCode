import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import { Link, useModel, useRequest } from 'umi';
import styles from './style.less';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import MainChart from '../Components/MainChart/index.tsx';

const Dzwjzxzlyjjs = observer((props) => {
    useEffect(() => {
  }, []);

  return (
    <>
      <div style={{ height: '80%' ,margin: "5px"}}>
          <div className="right">
            <MainChart />
          </div>
      </div>
    </>
  );
})

export default Dzwjzxzlyjjs;

import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import { Avatar, Card, Col, List, Skeleton, Row, Statistic } from 'antd';
import { Link, useModel, useRequest } from 'umi';
import styles from './style.less';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import MainChart from '../Components/MainChart/index.tsx';

const Sxjcsxsz = observer((props) => {
  useEffect(() => {}, []);

  return (
    <>
      <div style={{ height: '90%', margin: '10px' }}>
        <Card
          className={styles.projectList}
          style={{ marginBottom: 24 }}
          title="四性检测-四性设置"
          bordered={false}
          bodyStyle={{ padding: 0 }}
        >
          <Card.Grid className={styles.projectGrid} key="1">
            <Card bodyStyle={{ padding: 0 }} bordered={false}>
              <Card.Meta
                title={
                  <div className={styles.cardTitle}>
                    <Avatar
                      size="small"
                      src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"
                    />
                    <Link to="/runRFunc/jcszZsx?umname=四性设置(真实性)">
                      真实性
                    </Link>
                  </div>
                }
                description="针对元数据设置真实性检测"
              />
            </Card>
          </Card.Grid>
          <Card.Grid className={styles.projectGrid} key="2">
            <Card bodyStyle={{ padding: 0 }} bordered={false}>
              <Card.Meta
                title={
                  <div className={styles.cardTitle}>
                    <Avatar
                      size="small"
                      src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"
                    />
                    <Link to="/runRFunc/jcszWzx?umname=四性设置(完整性)">
                      完整性
                    </Link>
                  </div>
                }
                description="针对元数据设置完整性检测"
              />
            </Card>
          </Card.Grid>
          <Card.Grid className={styles.projectGrid} key="3">
            <Card bodyStyle={{ padding: 0 }} bordered={false}>
              <Card.Meta
                title={
                  <div className={styles.cardTitle}>
                    <Avatar
                      size="small"
                      src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"
                    />
                    <Link to="/runRFunc/jcszKkx?umname=四性设置(安全性)">
                      安全性
                    </Link>
                  </div>
                }
                description="针对元数据设置安全性检测"
              />
            </Card>
          </Card.Grid>
          <Card.Grid className={styles.projectGrid} key="4">
            <Card bodyStyle={{ padding: 0 }} bordered={false}>
              <Card.Meta
                title={
                  <div className={styles.cardTitle}>
                    <Avatar
                      size="small"
                      src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"
                    />
                    <Link to="/runRFunc/jcszKyx?umname=四性设置(可用性)">
                      可用性
                    </Link>
                  </div>
                }
                description="针对元数据设置可用性检测"
              />
            </Card>
          </Card.Grid>
        </Card>
        <div className="right">
          <MainChart />
        </div>
      </div>
    </>
  );
});

export default Sxjcsxsz;

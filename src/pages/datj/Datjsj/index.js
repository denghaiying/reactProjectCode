import React, { useEffect } from 'react';
import { Search, Tab, Input, Button, Form, DatePicker, Checkbox, Pagination, Icon, Grid,Tree,TreeSelect , Switch,Select, Field, Notification } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
 import ContainerTitle from '../../../components/ContainerTitle';
import LoginStore from '../../../stores/system/LoginStore';
import Store from "../../../stores/datj/DatjsjStore";
import E9Config from '../../../utils/e9config';

import 'antd/dist/antd.css';
import './index.less';
import SearchStore from "../../../stores/datj/SearchStore";
import { Table, Typography } from 'antd';
import SysStore from '../../../stores/system/SysStore';


const { Row, Col } = Grid;

const FormItem = Form.Item;
const { Text } = Typography;

/**
 * @Author: Mr.Wang
 * @Date: 2019/9/16 15:45
 * @Version: 9.0
 * @Content:
 *    2019/12/10 王祥
 *    修改：
 *      1.状态组件由IceStore改成mobx
 *    2019/9/16 王祥
 *      新增代码
 */
const Datjsj = observer(props => {
});

export default injectIntl(Datjsj);
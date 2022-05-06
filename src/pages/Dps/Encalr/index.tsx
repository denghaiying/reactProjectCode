import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Badge, Button, Calendar, Card, Col, message, Row } from 'antd';
import moment, { Moment } from 'moment';
import { SettingOutlined } from '@ant-design/icons';
import EncalrService from './Service/EncalrService';
import OptrightStore from '@/stores/user/OptrightStore';

export declare type CalendarMode = 'year' | 'month';

/**
 * @author tyq
 * @description 日历设置
 * @constant 20210826
 */
const Encalr = observer((props: any) => {
    //权限按钮
    const umid = 'DPS006';

    const [rq, setRq] = useState(moment());

    const onSelect = (date: Moment) => {
        EncalrService.findAll({ year: Number(date.format('YYYY')), month: Number(date.format('MM')) }).then(() => {
            if (EncalrService.AlldataSource.length === 0) {
                message.warning({
                    content: '正在初始化当前月份的数据...',
                    duration: 0,
                });
                EncalrService.saveAllCurrentWeek({ date: date.format('YYYY-MM-DD') }).then(() => {
                    message.success('当前月份的数据初始化已完成！');
                    EncalrService.findAll({ year: Number(date.format('YYYY')), month: Number(date.format('MM')) }).then(() => {
                        setRq(date);
                    }).catch((err) => {
                        console.log(err);
                    });
                }).catch((err) => {
                    message.error('数据初始化失败！' + err);
                }).finally(() => {
                    setTimeout(() => {
                        message.destroy();
                    }, 3000);
                });
                //代表当前年月没有数据
            } else {
                setRq(date);
            }
        });
    };

    useEffect(() => {
        OptrightStore.getFuncRight(umid);
        const now = moment();
        onSelect(now);
    }, []);
    /**
     * 设置工作日
     */
    const onGzrSetClick = () => {
        const index = EncalrService.Data.indexOf(rq.format('YYYY-M-D'));
        if (index === -1) {
            message.warning('此日期已经是工作日！');
            return;
        }
        const record = EncalrService.dataSource[index];

        EncalrService.updateForTable({ id: record.id, workday: 'Y' }).then(() => {
            message.success(rq.format('YYYY-MM-DD') + '已设置为工作日！');
            EncalrService.findAll({ year: Number(rq.format('YYYY')), month: Number(rq.format('MM')) });
        }).catch((err) => {
            message.error('执行失败！' + err);
        });
    };
    /**
     * 设置非工作日
     */
    const onFGzrSetClick = () => {
        if (EncalrService.Data.indexOf(rq.format('YYYY-M-D')) !== -1) {
            message.warning('此日期已经是非工作日！');
            return;
        }
        EncalrService.saveByKey({ year: rq.format('YYYY'), month: rq.format('M'), day: rq.format('D'), workday: 'N' }).then(() => {
            message.success(rq.format('YYYY-MM-DD') + '已设置为非工作日！');
            EncalrService.findAll({ year: Number(rq.format('YYYY')), month: Number(rq.format('MM')) });
        }).catch((err) => {
            message.error('执行失败！' + err);
        });
    };
    const dateCellRender = (data: Moment) => {
        const day = data.format('DD');

        if (data.format('YYYY-MM-DD') === rq.format('YYYY-MM-DD')) {
            return (
                <div style={{ backgroundColor: '#1890ff', width: '30%', marginLeft: '35%', color: 'white' }}>
                    {day}
                </div>
            );
        } else if (EncalrService.Data.indexOf(data.format('YYYY-M-D')) !== -1) {
            return (
                <div style={{ width: '30%', marginLeft: '35%', color: 'red', fontWeight: 'bold' }}>
                    {day}
                </div>
            );
        } else {
            return (
                <div>{day}</div>
            );
        }
    }
    return (
        <Card >
            <Row>
                <Col span={10}>
                    {OptrightStore.hasRight(umid, 'SYS101') &&
                        <Button
                            type="primary"
                            icon={<SettingOutlined />}
                            onClick={onGzrSetClick}>
                            设置为工作日
                        </Button>
                    }
                    {OptrightStore.hasRight(umid, 'SYS102') &&
                        <Button
                            style={{ marginLeft: 10 }}
                            type="primary"
                            icon={<SettingOutlined />}
                            onClick={onFGzrSetClick}>
                            设置为非工作日
                        </Button>
                    }
                </Col>
                <Col span={12}>
                    <Badge
                        style={{ marginLeft: 10 }}
                        status="warning"
                        text="红色字体是非工作日"
                    />
                </Col>
            </Row>
            <Calendar
                fullscreen={false}
                onSelect={onSelect}
                dateFullCellRender={dateCellRender}

            />
        </Card>
    );
});
export default Encalr;
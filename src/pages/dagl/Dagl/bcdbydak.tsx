import React, { useEffect, useState } from 'react';
import {
    message,
    Card,
    Row,
    Col,
    Form,
    Input,
    Checkbox,
    Table,
    TreeSelect,
} from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import {
    SwapOutlined,
    SaveOutlined,
    CaretUpOutlined,
    CaretDownOutlined,
    MinusOutlined,
    SyncOutlined,
    CloseOutlined,
} from '@ant-design/icons';
// import { color } from 'echarts';
import fetch from '../../../utils/fetch';
import SysStore from '../../../stores/system/SysStore';
import './Lcdzlk.less';
import update from 'immutability-helper';


const Lcdzlk = observer((props) => {
    const [rowId, setRowId] = useState();
    const [mbDakRowId, setMbDakRowId] = useState();
    const [form] = Form.useForm();
    const columns = [
        {
            title: '序号',
            align: 'center',
            fixed: 'left',
            //   width: 30,
            render: (_, __, index) => index + 1,
        },
        {
            title: '字段名称',
            dataIndex: 'mc',
            align: 'center',
            key: 'mc',
            //   width: 50,
        },
        {
            title: '字段描述',
            dataIndex: 'ms',
            align: 'center',
            key: 'ms',
            //   width: 100,
        },
    ];
    const LcdzlkStore = useLocalObservable(() => ({
        pageno: 1,
        pagesize: 50,
        dwdata: [],
        loading: false,
        mbdakloading: false,
        currentdak: {},
        daktreedata: [],
        dakzlxdata: [],
        initdakzlxdata: [],
        mbkzzlxdata: [],
        initmbkzzlxdata: [],
        selectedRow: {}, // 当前档案库选中的数据
        selectedRowIndex: 0, // 当前档案库当前行index
        selectedMbRow: {}, // 目标档案库选中的数据
        selectedMbRowIndex: 0, // 目标档案库当前行index
        saveYw: 'Y',
        deleteOldData: 'N',
        selectedmbdakid: '',
        // 档案库单位列表
        async findDwList() {
            //   const response = await fetch.get(
            //     '/api/eps/control/main/dw/queryForList',
            //     {},
            //   );
            //   if (response && response.status === 200) {
            //     debugger;
            //     this.dwdata = getDwTreeNodeData(response.data);
            //     console.log(SysStore.getCurrentCmp().id);
            //     form.setFieldsValue({
            //       mbdw: SysStore.getCurrentCmp().id,
            //     });
            //   }
        },
        // 根据单位,状态,档案用户查询档案库树形
        async findDakTree(params) {
            //   const response = await fetch.get(
            //     '/api/eps/control/main/dak/queryTree?isby=N&noshowdw=Y&node=root&iszlk=Y&dw=' +
            //       params.dwid +
            //       '&tmzt=' +
            //       props.extendParams.dakGrid.tmzt +
            //       '&dayh=' +
            //       props.extendParams.dakGrid.dayh,
            //     {},
            //   );
            //   if (response && response.status === 200) {
            //     this.daktreedata = getDakTreeNodeData(response.data);
            //     form.setFieldsValue({ mbdak: '' });
            //     this.mbkzzlxdata = [];
            //   }
        },
        // 根据档案库,状态查询当前档案库著录项
        async findDakZlxList() {
            //   this.loading = true;
            //   const response = await fetch.get(
            //     '/api/eps/control/main/mbkzzlx/queryForList?dakid=' +
            //       props.extendParams.dakGrid.dakid +
            //       '&lx=' +
            //       props.extendParams.dakGrid.tmzt,
            //     {},
            //   );
            //   if (response && response.status === 200) {
            //     this.dakzlxdata = response.data;
            //     this.initdakzlxdata = response.data;
            //     // setDakzlxdata(response.data);
            //     this.loading = false;
            //   }
        },
        // 根据档案库,状态查询目标档案库著录项
        // async findMbkZlxList(params: { dakid: any }) {
        //   this.mbdakloading = true;
        //   const response = await fetch.get(
        //     '/api/eps/control/main/mbkzzlx/queryForList?dakid=' +
        //       params.dakid +
        //       '&lx=' +
        //       props.extendParams.dakGrid.tmzt,
        //     {},
        //   );
        //   if (response && response.status === 200) {
        //     this.mbkzzlxdata = response.data;
        //     this.initmbkzzlxdata = response.data;
        //     this.mbdakloading = false;
        //   }
        // },
        // 根据档案库id查询档案库具体信息
        async findDakById() {
            //   const response = await fetch.get(
            //     '/api/eps/control/main/dak/queryForId?id=' +
            //       props.extendParams.dakGrid.dakid,
            //     {},
            //   );
            //   if (response && response.status === 200) {
            //     this.currentdak = response.data;
            //     form.setFieldsValue({
            //       dakmc: response.data.bh + '|' + response.data.mc,
            //     });
            //   }
        },
        async saveAsDak(params) {
            const response = await fetch.get('/api/eps/control/main/dagl/saveAsDak', {
                params,
            });
            debugger;
            if (response && response.status === 200) {
                if (response.data.success) {
                    message.success('另存到资料库操作成功!');
                } else {
                    message.error('另存到资料库操作成功!原因：' + response.data.message);
                }
                LcdzlkStore.loading = false;
                LcdzlkStore.mbdakloading = false;
            } else {
                message.error('另存到资料库操作失败!');
                return;
            }
        },
    }));
    const getDwTreeNodeData = (treeNodes) => {
        let nodes = treeNodes.map((node) => {
            node.value = node.id;
            node.title = node.text;
            node.key = node.id;
            if (node.children && node.children.length > 0) {
                node.children = getDwTreeNodeData(node.children);
            }
            return node;
        });
        return nodes;
    };
    const getDakTreeNodeData = (treeNodes) => {
        let nodes = treeNodes.map((node) => {
            node.disabled = node.lx == 'F';
            node.key = node.id;
            node.value = node.id;
            if (node.children && node.children.length > 0) {
                node.children = getDakTreeNodeData(node.children);
            }
            return node;
        });
        return nodes;
    };
    useEffect(() => {
        LcdzlkStore.findDwList();
        LcdzlkStore.findDakTree({ dwid: SysStore.getCurrentCmp().id });
        LcdzlkStore.findDakById();
        LcdzlkStore.findDakZlxList();
        form.setFieldsValue({
            saveYw: true,
        });
    }, []);

    const onClickRow = (record: { id?: any }, index: number, store: any) => {
        return {
            onClick: () => {
                setRowId(record.id);
                LcdzlkStore.selectedRowIndex = index;
                LcdzlkStore.selectedRow = record;
            },
        };
    };
    const setRowClassName = (record: { id: undefined }) => {
        return record.id === rowId ? 'clickRowStyle' : '';
    };

    const setMbDakRowClassName = (record: { id: undefined }) => {
        return record.id === mbDakRowId ? 'mbDakClickRowStyle' : '';
    };
    const onMbDakClickRow = (record: { id?: any }, index: number, store: any) => {
        return {
            onClick: () => {
                setMbDakRowId(record.id);
                LcdzlkStore.selectedMbRowIndex = index;
                LcdzlkStore.selectedMbRow = record;
            },
        };
    };
    //添加切换目标单位联动查询目标档案库
    const handleMbDwChange = (value: any, label: any, extra: any) => {
        debugger;
        LcdzlkStore.findDakTree({ dwid: value });
    };
    //   const handleMbDakChange = (value: any, label: any, extra: any) => {
    //     LcdzlkStore.selectedmbdakid = value;
    //     LcdzlkStore.findMbkZlxList({ dakid: value });
    //   };
    //档案库著录项
    //上移
    const moveUpZlx = () => {
        if (JSON.stringify(LcdzlkStore.selectedRow) == '{}') {
            message.warning('请先选择一个著录项！');
            return;
        }
        if (LcdzlkStore.selectedRowIndex <= 0) {
            message.warning('已经是第一个了！');
            return;
        }
        // 下面三行代码意思就相当于冒泡排序 替换ordernum这个值
        let x = LcdzlkStore.selectedRowIndex;
        let updakzlxs = LcdzlkStore.dakzlxdata;
        console.log(updakzlxs);
        let orderNum = updakzlxs[x - 1].kpsxh; // 获取点击行上一行的排序号
        updakzlxs[x - 1].kpsxh = updakzlxs[x].kpsxh; // 将点击行的排序号赋值给点击行上一行
        updakzlxs[x].kpsxh = orderNum; // 将点击行上一行的排序号赋值给点击行
        // 使用splice来交换数据
        updakzlxs.splice(
            x - 1,
            1,
            ...updakzlxs.splice(x + 1 - 1, 1, updakzlxs[x - 1]),
        );
        LcdzlkStore.selectedRow.kpsxh = orderNum;
        LcdzlkStore.selectedRowIndex = x - 1;
        //重新拷贝数组并定义不可变数组存放，以此解决table赋值无变化问题；
        const newupdakzlxs = JSON.parse(JSON.stringify(updakzlxs));
        LcdzlkStore.dakzlxdata = newupdakzlxs;
        message.success('上移成功');
    };
    //下移
    const moveDownZlx = () => {
        debugger;
        if (JSON.stringify(LcdzlkStore.selectedRow) == '{}') {
            message.warning('请先选择一个著录项！');
            return;
        }
        if (LcdzlkStore.selectedRowIndex >= LcdzlkStore.dakzlxdata.length - 1) {
            message.warning('已经是最后一个了！');
            return;
        }
        let x = LcdzlkStore.selectedRowIndex + 1;
        let y = LcdzlkStore.selectedRowIndex + 2;
        let a = LcdzlkStore.selectedRowIndex;
        let downdakzlxs = LcdzlkStore.dakzlxdata;
        let orderNum = downdakzlxs[a + 1].kpsxh;
        downdakzlxs[a + 1].kpsxh = downdakzlxs[a].kpsxh;
        downdakzlxs[a].kpsxh = orderNum;
        LcdzlkStore.selectedRow.kpsxh = orderNum;
        downdakzlxs.splice(
            x - 1,
            1,
            ...downdakzlxs.splice(y - 1, 1, downdakzlxs[x - 1]),
        );
        LcdzlkStore.selectedRowIndex = x;
        // setDakzlxdata(dakzlxs);
        //重新拷贝数组并定义不可变数组存放，以此解决table赋值无变化问题；
        const newdowndakzlxs = JSON.parse(JSON.stringify(downdakzlxs));
        LcdzlkStore.dakzlxdata = newdowndakzlxs;
        message.success('下移成功');
    };
    //移除
    const removeZlx = () => {
        if (JSON.stringify(LcdzlkStore.selectedRow) == '{}') {
            message.warning('请先选择一个著录项！');
            return;
        }
        let x = LcdzlkStore.selectedRowIndex;
        let dakzlxs = LcdzlkStore.dakzlxdata;
        dakzlxs.splice(x, 1);
        const newdakzlxs = JSON.parse(JSON.stringify(dakzlxs));
        LcdzlkStore.dakzlxdata = newdakzlxs;
        message.success('移除成功');
        LcdzlkStore.selectedRowIndex = 0;
        LcdzlkStore.selectedRow = {};
        setRowId('');
    };
    //刷新
    const refreshZlx = () => {
        const initdakzlxs = JSON.parse(JSON.stringify(LcdzlkStore.initdakzlxdata));
        const newinitdakzlxs = initdakzlxs;
        LcdzlkStore.dakzlxdata = newinitdakzlxs;
        LcdzlkStore.selectedRowIndex = 0;
        LcdzlkStore.selectedRow = {};
        setRowId('');
        message.success('刷新成功');
    };
    //删除多余
    const removeExcessZlx = () => {
        const num = LcdzlkStore.dakzlxdata.length;
        const mbnum = LcdzlkStore.mbkzzlxdata.length;
        let dakzlxs = LcdzlkStore.dakzlxdata;
        if (num == 0) {
            message.warning('档案库著录项不允许为空!');
            return;
        }
        if (mbnum == 0) {
            message.warning('目标档案库著录项不允许为空');
            return;
        }
        //删除多余目标档案库的著录项
        if (num > mbnum) {
            dakzlxs.splice(mbnum, num - mbnum);
        }
        const newdakzlxs = JSON.parse(JSON.stringify(dakzlxs));
        LcdzlkStore.dakzlxdata = newdakzlxs;
        message.success('删除多余');
    };
    //目标档案库著录项
    //上移
    const moveUpMbZlx = () => {
        if (JSON.stringify(LcdzlkStore.selectedMbRow) == '{}') {
            message.warning('请先选择一个著录项！');
            return;
        }
        if (LcdzlkStore.selectedMbRowIndex <= 0) {
            message.warning('已经是第一个了！');
            return;
        }
        // 下面三行代码意思就相当于冒泡排序 替换ordernum这个值
        let x = LcdzlkStore.selectedMbRowIndex;
        let upmbdakzlxs = LcdzlkStore.mbkzzlxdata;
        console.log(upmbdakzlxs);
        let orderNum = upmbdakzlxs[x - 1].kpsxh; // 获取点击行上一行的排序号
        upmbdakzlxs[x - 1].kpsxh = upmbdakzlxs[x].kpsxh; // 将点击行的排序号赋值给点击行上一行
        upmbdakzlxs[x].kpsxh = orderNum; // 将点击行上一行的排序号赋值给点击行
        // 使用splice来交换数据
        upmbdakzlxs.splice(
            x - 1,
            1,
            ...upmbdakzlxs.splice(x + 1 - 1, 1, upmbdakzlxs[x - 1]),
        );
        LcdzlkStore.selectedMbRow.kpsxh = orderNum;
        LcdzlkStore.selectedMbRowIndex = x - 1;
        //重新拷贝数组并定义不可变数组存放，以此解决table赋值无变化问题；
        const newupmbdakzlxs = JSON.parse(JSON.stringify(upmbdakzlxs));
        LcdzlkStore.mbkzzlxdata = newupmbdakzlxs;
        message.success('上移成功');
    };
    //下移
    const moveDownMbZlx = () => {
        debugger;
        if (JSON.stringify(LcdzlkStore.selectedMbRow) == '{}') {
            message.warning('请先选择一个著录项！');
            return;
        }
        if (LcdzlkStore.selectedMbRowIndex >= LcdzlkStore.mbkzzlxdata.length - 1) {
            message.warning('已经是最后一个了！');
            return;
        }
        let x = LcdzlkStore.selectedMbRowIndex + 1;
        let y = LcdzlkStore.selectedMbRowIndex + 2;
        let a = LcdzlkStore.selectedMbRowIndex;
        let downmbdakzlxs = LcdzlkStore.mbkzzlxdata;
        let orderNum = downmbdakzlxs[a + 1].kpsxh;
        downmbdakzlxs[a + 1].kpsxh = downmbdakzlxs[a].kpsxh;
        downmbdakzlxs[a].kpsxh = orderNum;
        LcdzlkStore.selectedMbRow.kpsxh = orderNum;
        downmbdakzlxs.splice(
            x - 1,
            1,
            ...downmbdakzlxs.splice(y - 1, 1, downmbdakzlxs[x - 1]),
        );
        LcdzlkStore.selectedMbRowIndex = x;
        // setDakzlxdata(dakzlxs);
        //重新拷贝数组并定义不可变数组存放，以此解决table赋值无变化问题；
        const newdownmbdakzlxs = JSON.parse(JSON.stringify(downmbdakzlxs));
        LcdzlkStore.mbkzzlxdata = newdownmbdakzlxs;
        message.success('下移成功');
    };
    //移除
    const removeMbZlx = () => {
        if (JSON.stringify(LcdzlkStore.selectedMbRow) == '{}') {
            message.warning('请先选择一个著录项！');
            return;
        }
        let x = LcdzlkStore.selectedMbRowIndex;
        let mbdakzlxs = LcdzlkStore.mbkzzlxdata;
        mbdakzlxs.splice(x, 1);
        const newmbdakzlxs = JSON.parse(JSON.stringify(mbdakzlxs));
        LcdzlkStore.mbkzzlxdata = newmbdakzlxs;
        message.success('移除成功');
        LcdzlkStore.selectedMbRowIndex = 0;
        LcdzlkStore.selectedMbRow = {};
        setMbDakRowId('');
    };
    //刷新
    const refreshMbZlx = () => {
        const initmbdakzlxs = JSON.parse(
            JSON.stringify(LcdzlkStore.initmbkzzlxdata),
        );
        const newinitmbdakzlxs = initmbdakzlxs;
        LcdzlkStore.mbkzzlxdata = newinitmbdakzlxs;
        message.success('刷新成功');
        LcdzlkStore.selectedMbRowIndex = 0;
        LcdzlkStore.selectedMbRow = {};
        setMbDakRowId('');
    };
    //删除多余
    const removeExcessMbZlx = () => {
        debugger;
        const num = LcdzlkStore.dakzlxdata.length;
        const mbnum = LcdzlkStore.mbkzzlxdata.length;
        let mbdakzlxs = LcdzlkStore.mbkzzlxdata;
        if (mbnum == 0) {
            message.warning('目标档案库著录项不允许为空');
            return;
        }
        if (mbnum > num) {
            mbdakzlxs.splice(num, mbnum - num);
        }
        const newmbdakzlxs = JSON.parse(JSON.stringify(mbdakzlxs));
        LcdzlkStore.mbkzzlxdata = newmbdakzlxs;
        message.success('删除多余');
    };
    const onSaveYwChange = (e) => {
        debugger;
        console.log('checked = ', e.target.checked);
        if (e.target.checked) {
            LcdzlkStore.saveYw = 'Y';
        } else {
            LcdzlkStore.saveYw = 'N';
        }
    };
    const onDeleteOldDataYwChange = (e) => {
        console.log('checked = ', e.target.checked);
        debugger;
        if (e.target.checked) {
            LcdzlkStore.deleteOldData = 'Y';
        } else {
            LcdzlkStore.deleteOldData = 'N';
        }
    };
    const dakSaveDoAutoDy = () => {
        let num = LcdzlkStore.dakzlxdata.length;
        let mbnum = LcdzlkStore.mbkzzlxdata.length;
        if (num == 0) {
            message.warning('档案库著录项不允许为空!');
            return;
        }
        if (mbnum == 0) {
            message.warning('目标档案库著录项不允许为空');
            return;
        }
        //自动对应
        let i = 0;
        while (i < num && i < mbnum) {
            let flag = false;
            for (let j = i; j < mbnum; j++) {
                const record = LcdzlkStore.mbkzzlxdata[j];
                debugger;
                if (LcdzlkStore.dakzlxdata[i].mc == record.mc) {
                    if (j != i) {
                        // LcdzlkStore.mbkzzlxdata = update(mbdakzlxs, { $remove: record });
                        const mbdakzlxs = LcdzlkStore.mbkzzlxdata;
                        const newmbdakzlxs = update(new Set(mbdakzlxs), {
                            $remove: [record],
                        });
                        const newzlxs = update(Array.from(newmbdakzlxs), {
                            $splice: [
                                [i, 0],
                                [i, 0, record],
                            ],
                        });
                        debugger;
                        LcdzlkStore.mbkzzlxdata = newzlxs;

                    }
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                // 如果左边的记录在右边没定位到，则把这条记录移到最后,且记录数减少1个，因为最后这条记录无需再处理
                const dakzlxrecord = LcdzlkStore.dakzlxdata[i];
                debugger;
                const dakzlxs = update(new Set(LcdzlkStore.dakzlxdata), {
                    $remove: [dakzlxrecord],
                });
                const newdakzlxs = update(dakzlxs, { $add: [dakzlxrecord] });
                LcdzlkStore.dakzlxdata = Array.from(newdakzlxs);

                num--;
            } else {
                i++;
                // 如果左边的记录在右边定位到le，则处理下一条
            }
        }
        message.success('自动对应成功');
    };

    const doDaSaveOk = () => {
        LcdzlkStore.loading = true;
        LcdzlkStore.mbdakloading = true;
        const num = LcdzlkStore.dakzlxdata.length;
        const mbnum = LcdzlkStore.mbkzzlxdata.length;
        const dakzlxs = LcdzlkStore.dakzlxdata;
        const mbdakzlxs = LcdzlkStore.mbkzzlxdata;
        if (num != mbnum) {
            message.warning('请先匹配著录项！');
            LcdzlkStore.loading = false;
            LcdzlkStore.mbdakloading = false;
            return;
        }
        if (props.extendParams.dakGrid.dakid == LcdzlkStore.selectedmbdakid) {
            message.warning('目标档案库不允许和源档案库是同一档案库！');
            LcdzlkStore.loading = false;
            LcdzlkStore.mbdakloading = false;
            return;
        }
        let ids = props.extendParams.dakGrid.selectIds;
        let fn = {};
        let str = '';
        for (let i = 0; i < num; i++) {
            str += ',' + mbdakzlxs[i].mc + '=' + dakzlxs[i].mc;
        }
        str = str.substring(1);
        fn['dygx'] = str;
        fn['jndygx'] = '';
        fn['sdwid'] = SysStore.getCurrentCmp().id;
        fn['ddwid'] = form.getFieldValue('mbdw');
        fn['sdak'] = props.extendParams.dakGrid.dakid;
        fn['ddak'] = form.getFieldValue('mbdak');
        fn['ids'] = ids;
        fn['tmzt'] = props.extendParams.dakGrid.tmzt;
        fn['usrid'] = SysStore.getCurrentUser().id;
        fn['usrbh'] = SysStore.getCurrentUser().bh;
        fn['usrname'] = SysStore.getCurrentUser().yhmc;
        fn['saveyw'] = LcdzlkStore.saveYw;
        fn['delolddata'] = LcdzlkStore.deleteOldData;
        debugger;
        LcdzlkStore.saveAsDak(fn);
    };
    return (
        <div>
            <Form form={form} layout="inline" colon={false}>
                <Card style={{ height: '600px', width: '100%' }}>
                    <Row className='rowbox'>
                        <Col span={8}  style={{marginLeft:1}}>
                            <Form.Item label="档案库名称" name="dakmc">
                                <Input
                                    className="input"
                                    allowClear
                                    placeholder="请输入档案库名称"
                                    style={{ width: 250 }}
                                //   disabled
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{marginLeft:49}}>
                            <Form.Item label="目标单位" name="mbdw">
                                <TreeSelect
                                    style={{ width: 250 }}
                                    placeholder="请选择目标单位"
                                    treeData={LcdzlkStore.dwdata}
                                    treeDefaultExpandAll
                                    allowClear
                                    onChange={handleMbDwChange}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={5} style={{marginLeft:49}}>
                            <Form.Item label="目标资料库" name="mbdak">
                                <TreeSelect
                                    style={{ width: 250 }}
                                    placeholder="请选择目标资料库"
                                    treeData={LcdzlkStore.daktreedata}
                                    treeDefaultExpandAll
                                    allowClear
                                //   onChange={handleMbDakChange}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{ paddingTop: '16px' }}>
                        <Col span={24}>
                            <Card
                                actions={[
                                    <a onClick={(e) => dakSaveDoAutoDy()}>
                                        <SwapOutlined /> &nbsp;自动对应
                                    </a>,
                                    <Form.Item name="deleteOldData">
                                        <Checkbox
                                            checked={LcdzlkStore.deleteOldData === 'Y'}
                                            onChange={onDeleteOldDataYwChange}
                                        >
                                            删除原始数据
                                        </Checkbox>
                                    </Form.Item>,
                                    <Form.Item name="saveYw">
                                        <Checkbox
                                            checked={LcdzlkStore.saveYw === 'Y'}
                                            onChange={onSaveYwChange}
                                        >
                                            同步保存原文
                                        </Checkbox>
                                    </Form.Item>,
                                    <a onClick={(e) => doDaSaveOk()}>
                                        <SaveOutlined /> &nbsp;确定
                                    </a>,
                                ]}
                            >
                                <Row>
                                    <Col span={8}>
                                        <Card
                                            type="inner"
                                            title="当前档案库数据项"
                                            style={{ height: '480px' }}
                                            bodyStyle={{ padding: '0px' }}
                                        >
                                            <Table
                                                columns={columns}
                                                // bordered
                                                size="small"
                                                scroll={{ y: 400 }}
                                                pagination={false}
                                                // dataSource={dakzlxdata}
                                                dataSource={LcdzlkStore.dakzlxdata}
                                                loading={LcdzlkStore.loading}
                                                onRow={onClickRow}
                                                rowClassName={setRowClassName}
                                            />
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card type="inner" title="操作" style={{ height: '480px' }}>
                                            <Row>
                                                <a onClick={() => moveUpZlx()}>
                                                    <CaretUpOutlined />
                                                    &nbsp;上移
                                                </a>
                                            </Row>
                                            <Row style={{ paddingTop: '5px' }}>
                                                <a onClick={(e) => moveDownZlx()}>
                                                    <CaretDownOutlined />
                                                    &nbsp;下移
                                                </a>
                                            </Row>
                                            <Row style={{ paddingTop: '5px' }}>
                                                <a onClick={(e) => removeZlx()}>
                                                    <MinusOutlined />
                                                    &nbsp;移除
                                                </a>
                                            </Row>
                                            <Row style={{ paddingTop: '5px' }}>
                                                <a onClick={(e) => refreshZlx()}>
                                                    <SyncOutlined />
                                                    &nbsp;刷新
                                                </a>
                                            </Row>
                                            <Row style={{ paddingTop: '5px' }}>
                                                <a onClick={(e) => removeExcessZlx()}>
                                                    <CloseOutlined />
                                                    &nbsp;删除多余
                                                </a>
                                            </Row>
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card
                                            type="inner"
                                            title="目标档案库著录项"
                                            style={{ height: '480px' }}
                                            bodyStyle={{ padding: '0px' }}
                                        >
                                            <Table
                                                columns={columns}
                                                // bordered
                                                size="small"
                                                scroll={{ y: 400 }}
                                                pagination={false}
                                                dataSource={LcdzlkStore.mbkzzlxdata}
                                                loading={LcdzlkStore.mbdakloading}
                                                onRow={onMbDakClickRow}
                                                rowClassName={setMbDakRowClassName}
                                            />
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card type="inner" title="操作" style={{ height: '480px' }}>
                                            <Row>
                                                <a onClick={() => moveUpMbZlx()}>
                                                    <CaretUpOutlined />
                                                    &nbsp;上移
                                                </a>
                                            </Row>
                                            <Row style={{ paddingTop: '5px' }}>
                                                <a onClick={(e) => moveDownMbZlx()}>
                                                    <CaretDownOutlined />
                                                    &nbsp;下移
                                                </a>
                                            </Row>
                                            <Row style={{ paddingTop: '5px' }}>
                                                <a onClick={(e) => removeMbZlx()}>
                                                    <MinusOutlined />
                                                    &nbsp;移除
                                                </a>
                                            </Row>
                                            <Row style={{ paddingTop: '5px' }}>
                                                <a onClick={(e) => refreshMbZlx()}>
                                                    <SyncOutlined />
                                                    &nbsp;刷新
                                                </a>
                                            </Row>
                                            <Row style={{ paddingTop: '5px' }}>
                                                <a onClick={(e) => removeExcessMbZlx()}>
                                                    <CloseOutlined />
                                                    &nbsp;删除多余
                                                </a>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Form>
        </div>
    );
});

export default Lcdzlk;

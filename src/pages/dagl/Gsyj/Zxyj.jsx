import React, {useEffect, useState,Fragment} from 'react';
import {observer} from 'mobx-react';
import {injectIntl} from 'react-intl';
import {
    Button,
    DatePicker,
    Field,
    Form,
    Grid,
    Icon,
    Input,
    Pagination,
    Progress,
    Radio,
    Select,
    Step,
    Table
} from '@alifd/next';
import moment from 'moment';
import EmptyData from '@/components/EmptyData';
import ZxyjStore from '@/stores/dagl/ZxyjStore';
import DapubStore from '@/stores/dagl/DapubStore';
import E9Config from '@/utils/e9config';
import './index.less';
import LoginStore from '@/stores/system/LoginStore';
import LydjStore from "@/stores/dadt/LydjStore";
import { useIntl } from 'umi';
import SysStore from "@/stores/system/SysStore";
const Zxyj = observer(props => {
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
    const {Item: FormItem} = Form;
    const {data, columns, loading, pageno, pagesize, tpageno, tpagesize} = ZxyjStore;
    const {Row, Col} = Grid;
    const [step, setStep] = useState(0);
    const [field, setField] = useState(null);
    const [fieldLyxx, setFieldLyxx] = useState(null);
    const [tabIndex, setTabIndex] = useState(-1);
    const formItemLayout = {
        labelCol: {
            fixedSpan: 5
        },
        wrapperCol: {
            // span: 16
        }
    };
    const steps = [
        "第一步：移交申请",
        "第二步：四性检测",
        "第三步：检测结果"
    ];
    const newsteps = [
        "进馆移交",
    ];
  /*  const field = Field.useField();
    const fieldLyxx = Field.useField();*/
    useEffect(() => {
        ZxyjStore.setParams(props.params,true);
        ZxyjStore.queryForList({wpidnull: "111", yhid:SysStore.getCurrentUser().id,jczt:"Y"});
        ZxyjStore.getSjzdData('保管期限');
        ZxyjStore.getDWlist();
        ZxyjStore.getDak(props.store.dakid);
        ZxyjStore.getColumns(ZxyjStore.params);
        const json = {
            sqrmc:  SysStore.getCurrentUser().yhmc,
            sqsj: moment(),
            dw: SysStore.getCurrentCmp().id,
            dh: SysStore.getCurrentUser().sjh,
            qzh: SysStore.getCurrentCmp().id,
            dakid: props.store.dakid,
            bmc: props.store.ktable.bmc,
            tmzt: props.store.tmzt,
            sqrid: SysStore.getCurrentUser().id,
            sqr: SysStore.getCurrentUser().yhmc,
            sqrbh: SysStore.getCurrentUser().id,
            sqbmid: SysStore.getCurrentUser().bmid,
        };
        ZxyjStore.showEditForm(json);

    }, []);


    const doSumitTj = () => {
        field.validate((errors, values) => {
            if (!errors) {
                ZxyjStore.doSumitTj(values);
            }
        });
    }
    const jsSearch = () => {
        field.validate((errors, values) => {
            if (!errors) {
                ZxyjStore.setsearparams(values, ZxyjStore.params,props.store.ktable);
                ZxyjStore.saveDjrData(values,  props.store.dakid,  props.store.ktable.bmc);
            }
        });
    }
    const onClick = (currentStep) => {
        setStep(currentStep);
        if (currentStep === 0) {
            field.setValues(fieldLyxx.getValues());
        }
    }
    const checkSxjc = () => {
        let timer = null;
        let newpprogressValue = 0;
        if (timer == null) {
            timer = setInterval(() => {
                newpprogressValue = ZxyjStore.progressValue + 10;
                // 这里的算法很重要，进度条容器的宽度为 400px 所以这里除以400再乘100就能得到 1-100的百分比了。
                if (ZxyjStore.progressValue === 20) {
                    ZxyjStore.setTmmer(newpprogressValue)
                    ZxyjStore.duoJc(ZxyjStore.params).then(() => {
                            clearInterval(timer);
                        }
                    );
                } else if (ZxyjStore.progressValue === 75) {
                    clearInterval(timer);
                } else if (ZxyjStore.progressValue === 100) {
                    clearInterval(timer);
                } else {
                    ZxyjStore.setTmmer(newpprogressValue)
                }
            }, 900);
        }
    }
    const doNext = () => {
        switch (step) {
            case 0:
                field.validate((errors, values) => {
                    if (!errors) {
                        setStep(step + 1);
                        ZxyjStore.setsearparams(values, ZxyjStore.params,props.store.ktable);
                        ZxyjStore.saveDjrData(values,props.store.dakid, props.store.ktable.bmc);
                        if (ZxyjStore.opt === "add") {
                            ZxyjStore.saveData(values);
                        }
                    }
                });
                break;
            case 1:
                ZxyjStore.setFdw(ZxyjStore.params);
                if (props.store.ktable.daklx === '01') {
                    ZxyjStore.queryTmSl(ZxyjStore.params);
                } else {
                    ZxyjStore.queryTmSl(ZxyjStore.params);
                    ZxyjStore.queryJnTmSl(ZxyjStore.params);
                }
                ZxyjStore.queryForList({wpidnull: "111", yhid:SysStore.getCurrentUser().id,jczt:"Y"});
                setStep(step + 1);
                break;
            case 2:
                fieldLyxx.validate((errors, values) => {
                    if (!errors) {
                        ZxyjStore.saveData(values);
                    }
                })
                break;
        }
    };

    const doPrev = () => {
        if (step > 0) {
            field.setValues(ZxyjStore.editRecord);
            console.log(ZxyjStore.editRecord);
            setStep(step - 1);
        }
    };

    const doSearchAction = () => {
        fieldDak.validate((errors, values) => {
            const index = tabIndex + 1;
            setTabIndex(index);
            DapubStore.getDaklist(values.dakid, '4', umid).then(
                () => {
                    const {...params} = values;
                    params["bmc"] = DapubStore.ktables[values.dakid].bmc;
                    ZxyjStore.queryDakData(index, params);
                }
            );
        })
    };

    const onTableClose = (key) => {
        ZxyjStore.removeTab(key);
        if (tabIndex >= ZxyjStore.tpageno.length) {
            setTabIndex(tabIndex - 1);
        }
    };

    /**
     * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
     * @param {*} selectedRowKeys
     * @param {*} records
     */
    const onTableRowChange = (selectedRowKeys, records) => {

        ZxyjStore.setSelectRows(selectedRowKeys, records);
        records && records.length > 0 && onChangeRow(records[0]);

    };
    const onChangeRow = (record) => {
        if (props.store.ktable.daklx === '02') {
            ZxyjStore.jsJnSearch(record.id,props.store.dakid, props.store.ktable.bmc)
        }
    };

    const onPaginationChange = ((current) => {
        ZxyjStore.setTPageNo(current, field.getValue('bgqx'), field.getValue("ndb"), field.getValue("nde"), props.store.dakid, props.store.ktable.bmc);
    });

    const onPageSizeChange = ((pageSize) => {
        ZxyjStore.setTPageSize(pageSize, field.getValue('bgqx'), field.getValue("ndb"), field.getValue("nde"), props.store.dakid, props.store.ktable.bmc);
    });
    const renderCdrxx = () =>

        <Form labelAlign="left" labelTextAlign="right" field={field} value={ZxyjStore.editRecord}
              onChange={ZxyjStore.onRecordChange}
              saveField={(f) => {
                  setField(f);
              }}
        >
            <Row>
                <Col span={24}>
                    <Row>
                        <Col span={4}>
                            <FormItem fullWidth label="申请人："  {...formItemLayout}>
                                <Input
                                    name="sqrmc"
                                    placeholder="申请人"
                                    readOnly={true}
                                />
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem fullWidth label="申请单位："  {...formItemLayout}>
                                <Select
                                    name="dw"
                                    placeholder="申请单位"
                                    disabled
                                >
                                    {ZxyjStore.dwData.map(o => <Select.Option value={o.id}
                                                                              key={o.id}>{o.mc}</Select.Option>)}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem fullWidth label="申请全宗："  {...formItemLayout}>
                                <Select
                                    name="qzh"
                                    placeholder="申请全宗"
                                    disabled
                                >
                                    {ZxyjStore.dwData.map(o => <Select.Option value={o.qzh}
                                                                              key={o.id}>{o.qzh}</Select.Option>)}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem fullWidth label="申请时间：" {...formItemLayout}>
                                <DatePicker
                                    name="sqsj"
                                    showTime
                                    disabled
                                    placeholder="申请时间"
                                />
                            </FormItem>
                        </Col>

                        <Col span={5}>
                            <FormItem fullWidth label="联系方式：" {...formItemLayout}>
                                <Input
                                    name="dh"
                                    placeholder="联系方式"
                                    readOnly={true}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <div className="clsmdiv">
                    </div>
                    <Row>
                        <Col span={8}>
                            <FormItem fullWidth label="保管期限：" required
                                      requiredMessage={`${formatMessage({id: 'e9.info.data.require'})}`} {...formItemLayout}>
                                <Select
                                    name="bgqx"
                                    placeholder="保管期限"
                                    maxTagCount={2}
                                    tagInline
                                    mode="multiple"
                                >
                                    {ZxyjStore.bqgxData.map(o => <Select.Option value={o.mc}
                                                                                key={o.id}>{o.mc}</Select.Option>)}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem fullWidth label="移交年度：" required
                                      requiredMessage={`${formatMessage({id: 'e9.info.data.require'})}`} {...formItemLayout}>
                                <Input
                                    name="ndb"
                                    placeholder="移交年度"
                                />
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem fullWidth label="至：" required
                                      requiredMessage={`${formatMessage({id: 'e9.info.data.require'})}`} {...formItemLayout}>
                                <Input
                                    name="nde"
                                    placeholder="至" addonAfter={<Button loading={LydjStore.loadingCard} type="primary"
                                                                        onClick={jsSearch}>查询</Button>}
                                />
                            </FormItem>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={24}>
                            <Table
                                // tableLayout="fixed"
                                // $work-context-heigth-41px, 41px为表头高度
                                maxBodyHeight="200px"
                                // className="common-table"
                                dataSource={ZxyjStore.jsResult.results}
                                fixedHeader
                                loading={loading}
                                rowSelection={{
                                    onChange: onTableRowChange,
                                    selectedRowKeys: ZxyjStore.selectRowKeys,
                                    mode: "single"
                                }}
                                emptyContent={<EmptyData/>}
                            >

                                {ZxyjStore.dakKfields.map(col =>
                                    <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
                                )}
                                <Table.Column cell={renderTableCell} width="120px" lock="right"/>
                            </Table>
                            <Pagination
                                //   className="footer"
                                size={E9Config.Pagination.size}
                                current={pageno}
                                pageSize={pagesize}
                                total={ZxyjStore.jsResult.total}
                                onChange={onPaginationChange}
                                shape={E9Config.Pagination.shape}
                                pageSizeSelector={E9Config.Pagination.pageSizeSelector}
                                pageSizePosition={E9Config.Pagination.pageSizePosition}
                                onPageSizeChange={onPageSizeChange}
                                popupProps={E9Config.Pagination.popupProps}
                                totalRender={total => <span
                                    className="pagination-total"> {`${formatMessage({id: 'e9.pub.total'})}：${total}`}</span>}
                            />
                        </Col>
                    </Row>
                    {props.store.ktable.daklx === "02" && <Row>
                        <Col span={24}>
                            <Table
                                // tableLayout="fixed"
                                // $work-context-heigth-41px, 41px为表头高度
                                maxBodyHeight="200px"
                                // className="common-table"
                                dataSource={ZxyjStore.jsJnResult.results}
                                fixedHeader
                                loading={loading}
                                emptyContent={<EmptyData/>}
                            >

                                {ZxyjStore.dakJnKfields.map(col =>
                                    <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
                                )}
                                <Table.Column cell={renderTableCell} width="120px" lock="right"/>
                            </Table>
                            <Pagination
                                //   className="footer"
                                size={E9Config.Pagination.size}
                                current={tpageno}
                                pageSize={tpagesize}
                                total={ZxyjStore.jsJnResult.total}
                                onChange={onPaginationChange}
                                shape={E9Config.Pagination.shape}
                                pageSizeSelector={E9Config.Pagination.pageSizeSelector}
                                pageSizePosition={E9Config.Pagination.pageSizePosition}
                                onPageSizeChange={onPageSizeChange}
                                popupProps={E9Config.Pagination.popupProps}
                                totalRender={total => <span
                                    className="pagination-total"> {`${formatMessage({id: 'e9.pub.total'})}：${total}`}</span>}
                            />
                        </Col>
                    </Row>
                    }
                </Col>
            </Row>
        </Form>;

    const renderTableCell = (value, index, record) => {
        return (
            <div>
                <a href="javascript:void(0)" style={{marginLeft: 10}} onClick={() => console.log(record)}>文件</a>
            </div>);
    };


    const renderLydj = () =><Fragment> <div id="app" className="main-page">
        <div className="banner">
            <div className="inner">
                <div className="bottom">
                    <div className="process">
                        <Progress
                            percent={ZxyjStore.progressValue}
                            progressive
                            shape="circle"
                            size="large"
                        />
                    </div>
                    <div className="steps">
                        <li className={ZxyjStore.progressValue > 10 ? "first common on" : "first common"}>
                            <div className="node-d">
                                <span className="node"><span className="el-icon-check"></span></span>
                                <img src="/api/eps/xsxjc/images/column-line.png"></img>
                                <span className="node-text">生成检测包</span>
                            </div>
                        </li>
                        <li className={ZxyjStore.progressValue > 30 ? "second common on" : "second common"}>
                            <div className="node-d">
                                <span className="node"><span className="el-icon-check"></span></span>
                                <img src="/api/eps/xsxjc/images/column-line.png"></img>
                                <span className="node-text">检测中</span>
                            </div>
                        </li>
                        <li className={ZxyjStore.progressValue > 80 ? "third common on" : "third common"}>
                            <div className="node-d">
                                <span className="node"><span className="el-icon-check"></span></span>
                                <img src="/api/eps/xsxjc/images/column-line.png"></img>
                                <span className="node-text">生成报告</span>
                            </div>
                        </li>
                        <li className={ZxyjStore.progressValue === 100 ? "fourth common on" : "fourth common"}>
                            <div className="node-d">
                                <span className="node"><span className="el-icon-check"></span></span>
                                <img src="/api/eps/xsxjc/images/column-line.png"></img>
                                <span className="node-text">完成</span>
                            </div>
                        </li>
                        <span className="total" v-if="processVal === 1">共{3}条</span>
                    </div>
                    <div className="btn-group">
                        <Button
                            type="primary"
                            loading={false}
                            onClick={checkSxjc}
                            disabled={ZxyjStore.opt === "edit"}
                        >
                            开始检测
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <div className="list-content">
            <div className="correct">
                <p className="label-btn">提醒</p>
                {ZxyjStore.jczt &&
                <div className="icon-style-demo">
                    <Icon type="success" style={{color: "#1DC11D", marginRight: "10px"}}/>
                    <code style={{color: "#1DC11D", marginRight: "10px"}}>检测成功!</code>
                </div>
                }
                {!ZxyjStore.jczt &&
                <div className="icon-style-demo">
                    <code style={{color: "#FF3333", marginRight: "10px"}}>检测数量大可关闭界面,检测结束选择已填写的申请单继续完成步骤</code>
                    <code style={{color: "#FF3333", marginRight: "10px"}}>{ZxyjStore.jcjg}</code>
                </div>
                }
            </div>
        </div>
    </div>  </Fragment>;;

    const renderJgsp = () => <Form labelAlign="left" labelTextAlign="right" field={fieldLyxx} value={ZxyjStore.editRecord}
                                   onChange={ZxyjStore.onRecordChange}
                                   saveField={(f) => {
                                       setFieldLyxx(f);
                                   }}
    ><h5>选择已有的申请单</h5><br/>
        <Radio.Group itemDirection="ver"
                     value={ZxyjStore.saveParams.id}
                     onChange={(v) => ZxyjStore.setSaveParams("id", v)} className="radiogrp">
            <div className="choose-list">
                {ZxyjStore.list && ZxyjStore.list.map(item =>
                    <li key={`li-${item.id}`} className="item">
                        <Radio value={item.id}><span style={{marginLeft: 10, color: '#999'}}>{item.title}</span></Radio>
                    </li>)}
            </div>
        </Radio.Group>
        <div className="clsmdiv">
        </div>
        <Row>
            <Col span={24}>
                <Row>
                    <Col>
                        <FormItem fullWidth label="移交年度："
                                  {...formItemLayout}>
                            <Input
                                name="ndb"
                                placeholder="移交年度"
                                readOnly={true}
                            />
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem fullWidth label="至："
                                  {...formItemLayout}>
                            <Input
                                name="nde"
                                placeholder="至"
                                readOnly={true}
                            />
                        </FormItem>
                    </Col>
                </Row>
                <div className="clsmdiv">
                </div>
                <Row>
                    <Col span={8}>
                        <FormItem fullWidth label="进馆单位："
                                  {...formItemLayout}>
                            <Select
                                name="gmc"
                                placeholder="进馆单位"
                                onChange={ZxyjStore.onchagedw}
                            >
                                {ZxyjStore.dwData.map(o => <Select.Option value={o.id}
                                                                          key={o.id}>{o.mc}</Select.Option>)}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem fullWidth label="移交档案库："
                                  {...formItemLayout}>
                            <Select
                                name="gdakid"
                                placeholder="移交档案库"
                            >
                                {ZxyjStore.scDakDate.map(o => <Select.Option value={o.id}
                                                                             key={o.id}>{o.bh}|{o.mc}</Select.Option>)}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem fullWidth label="移交说明：" required
                                  requiredMessage={`${formatMessage({id: 'e9.info.data.require'})}`} {...formItemLayout}>
                            <Input.TextArea
                                style={{width: '100%', fontSize: 14, padding: 8, marginBottom: 5}}
                                autoHeight={{minRows: 2, maxRows: 6}}
                                maxLength={300}
                                name="yjsm"
                            />
                        </FormItem>
                    </Col>
                </Row>
                <div className="clsmdiv">
                </div>
                <Row>
                    <Col span={6}>
                        <FormItem fullWidth label="真实性："
                                  {...formItemLayout}>
                            <Input
                                name="zsx"
                                placeholder="真实性"
                                readOnly={true}
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem fullWidth label="完整性："
                                  {...formItemLayout}>
                            <Input
                                name="wzx"
                                placeholder="完整性"
                                readOnly={true}
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem fullWidth label="可用性："
                                  {...formItemLayout}>
                            <Input
                                name="kyx"
                                placeholder="可用性"
                                readOnly={true}
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem fullWidth label="安全性："
                                  {...formItemLayout}>
                            <Input
                                name="aqx"
                                placeholder="安全性"
                                readOnly={true}
                            />
                        </FormItem>
                    </Col>
                </Row>
                <div className="clsmdiv">
                </div>
                <Row>
                    <Col span={6}>
                        <FormItem fullWidth label="电子数量档案："
                                  {...formItemLayout}>
                            <Input
                                name="tmsl"
                                placeholder="电子数量档案"
                                readOnly={true}
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem fullWidth label="原文数量："
                                  {...formItemLayout}>
                            <Input
                                name="ywsl"
                                placeholder="原文数量"
                                readOnly={true}
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem fullWidth label="原文大小："
                                  {...formItemLayout}>
                            <Input
                                name="ywsize"
                                placeholder="原文大小"
                                addonTextAfter="M"
                                readOnly={true}
                            />
                        </FormItem>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Form>;
    return (
        <div className="hall-regist">
            <div className="editform">

                <Step current={step} shape="arrow">
                    {steps.map((s, index) =>
                        <Step.Item onClick={onClick} title={s} key={index} disabled={index == "1"}/>)}
                </Step>
                <div className="editContext">
                    {step === 0 && renderCdrxx()}
                    {step === 1 && renderLydj()}
                    {step === 2 && renderJgsp()}
                    <div className="effooter">
                        <Button.Group>
                            {step !== 0 &&
                            <Button type="primary" onClick={doPrev}><Icon type="arrow-left"/>上一步</Button>}
                            {ZxyjStore.dakDate.sxjc === "N" && <Button type="primary"
                                                                       onClick={doSumitTj}>{'提交'}{step !== steps.length - 1 &&
                            <Icon type='arrow-right'/>}</Button> ||
                            <Button type="primary" disabled={step == 1 && !ZxyjStore.jczt}
                                    onClick={doNext}>{step === steps.length - 1 && '提交' || '下一步'}{step !== steps.length - 1 &&
                            <Icon type='arrow-right'/>}</Button>}
                        </Button.Group>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Zxyj;

// import React from 'react';
// import './addSchedule.less'
// import { Form, Input, Button, Select, DatePicker, Dialog, Checkbox  } from '@alifd/next';

// import moment from 'moment';
// const { Option } = Select;
// const { TextArea } = Input;

// export default class addSchedule extends React.Component {
//   render() {
//     const options = [
//       { label: '短信提醒', value: '1' },
//       { label: '邮件提醒', value: '2' },
//     ];
//     return (
//       <div className="add-schedule">
//         <Dialog  className="scheduleModal" 
//           title={<span className="m-title"><img src={require('../../../assets/img/icon_rili.png')} />新建日程</span>}
//           visible={this.props.addModalVisible} 
//           onOk={() => {this.props.closeModal()}} 
//           onCancel={() => {this.props.closeModal()}}
//         >
//           <Form labelCol={{ span: 5 }} className="schedule-form">
//             <Form.Item label="日程类型" name="dateType">
//               <Select defaultValue='1'>
//                 <Option value="1">工作安排</Option>
//                 <Option value="2">日程类型2</Option>
//               </Select>
//             </Form.Item>
//             <Form.Item label="标题" name="title" rules={[{ required: true, message: 'Please input your username!' }]}>
//               <Input placeholder="请输入标题名称" />
//             </Form.Item>
//             <Form.Item label="内容" name="content">
//               <TextArea rows={2} />
//             </Form.Item>
//             <Form.Item label="接收人" name="receiver">
//               <Input placeholder="请输入接收人" />
//             </Form.Item>
//             <Form.Item label="紧急程度" name="emergency">
//               <Select defaultValue='1'>
//                 <Option value="1">一般</Option>
//                 <Option value="2">紧急</Option>
//               </Select>
//             </Form.Item>
//             <Form.Item label="开始时间" name="start">
//               <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />
//             </Form.Item>
//             <Form.Item label="结束时间" name="end">
//               <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />
//             </Form.Item>
//             <Form.Item label="提醒方式" name="notice">
//               <Checkbox.Group dataSource={options} onChange={() => {}} />
//             </Form.Item>
//           </Form>
//         </Dialog >
//       </div>
//     )
//   }
// }
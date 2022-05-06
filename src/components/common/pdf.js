// import React from 'react';
// import { Document, Page } from 'react-pdf';
// import {Loading} from '@alifd/next';
// import './pdf.less'
// export default class Pdf extends React.Component {
//     constructor(props){
//         super(props);
//         this.state = {
//             numPages: 1,
//             file: props.url,
//             width: props.width > 745 ? 745 : props.width,
//             error: props.error || '加载pdf文件失败！',
//             loading: true,
//             loadingNum: 0
//         }
//     }

//     componentWillReceiveProps(nextProps){
//         if (nextProps.url !== this.props.url) {
//             this.setState({
//                 file: nextProps.url
//             });
//         }
//         if (nextProps.width !== this.props.width) {
//             this.setState({
//                 width: nextProps.width > 745 ? 745 : nextProps.width
//             });
//         }
//     }

//     onDocumentLoadSuccess = (pdf) => {
//         this.setState({
//             numPages: pdf.numPages,
//             loadingNum: pdf.numPages - 1
//         });
//     };

//     onLoadSuccess = () => {
//         this.setState({
//             loadingNum: this.state.loadingNum - 1
//         });
//     }

//     render() {
//         let documents = [];
//         for(let i = 0; i < this.state.numPages; i++){
//             if(i > 0){
//                 documents.push(<Document key={i+1}
//                                          file={this.state.file}
//                                          onLoadError={(error) => console.log(error)}
//                                          onLoadSuccess={this.onLoadSuccess}
//                                          error={this.state.error}
//                                          loading=""
//                 >
//                     <Page
//                         pageNumber={i+1}
//                         width={this.state.width}/>
//                 </Document>);
//             }
//         }
//         return (
//             <div style={{margin: '0 auto', width: this.state.width}}>
//                 {this.state.loadingNum !== 0 ? <Loading size="large" type="info" className="loading"/> : ''}
//                 <Document
//                     key={0}
//                     file={this.state.file}
//                     onLoadSuccess={this.onDocumentLoadSuccess}
//                     onLoadError={(error) => console.log(error)}
//                     loading=""
//                     error={this.state.error}
//                 >
//                     <Page
//                         pageNumber={1}
//                         width={this.state.width}
//                     />
//                 </Document>
//                 {documents}
//             </div>
//         );
//     }
// }
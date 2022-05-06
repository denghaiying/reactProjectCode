import React, { useEffect, useState, Fragment, useRef } from 'react';
import { observer } from 'mobx-react';
import {
  Input, NumberPicker, Button, Table, Pagination, Icon, Field, Checkbox,
  Form, Grid, Select, TreeSelect, Tab, Card, Dialog, Loading, Nav
} from '@alifd/next';
import { pdfjs, Document, Page } from 'react-pdf/dist/esm/entry.webpack';///dist/esm/entry.webpack
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import LydjStore from '@/stores/dadt/LydjStore';
import SvgIcon from '@/components/SvgIcon';
import util from '@/utils/util';
import 'react-virtualized/styles.css'   //导入样式
import { AutoSizer, List } from 'react-virtualized'; //导入list组件
// import url from "pdfjs-dist/build/pdf.worker";
import './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = "/work/pdf.worker.min.js";

const FileView = observer(() => {
  const umid = 'DADT0002';
  const { Item: FormItem } = Form;
  const { Row, Col } = Grid;
  const [selectedKey, setSelectedKey] = useState('');
  const [nums, setNums] = useState(0);
  const [curNum, setCurNum] = useState(0);
  const [pageHeight, setPageHeight] = useState([]);
  const [scale, setScale] = useState(1);
  const [selectPages, setSelectPages] = useState([]);
  const ref = useRef(null);
  const printRef = useRef(null);

  useEffect(() => {
    if (LydjStore.fileDialogShow) {
      setSelectedKey('');
      setNums(0);
      setCurNum(0);
      setScale(1);
      setPageHeight([]);
      setSelectPages([]);
    }
  }, [LydjStore.fileDialogShow]);

  useEffect(() => {
    if (LydjStore.fileData && LydjStore.fileData.length > 0) {
      const o = LydjStore.fileData[0];
      viewFile(o.grpid, o.fileid)
    }
  }, [LydjStore.fileData]);

  const viewFile = (grpid, fileid) => {
    if (selectedKey !== fileid) {
      setSelectedKey(fileid);
      LydjStore.downloadFile(fileid, grpid);
    }
  };

  const onDocumentLoadSuccess = async (docproxy) => {
    const { numPages } = docproxy;
    if (numPages > 0) {
      const dom = ref.current;
      if (dom) {
        const data = await Promise.all(util.num2arr(numPages).map(n => docproxy.getPage(n + 1)));
        const vws = data.map(page => page.getViewport({ scale: 1 }));
        const mw = Math.max.apply(Math, vws.map(vw => vw.width));
        const sc = ((dom.offsetWidth - 50) / mw).toFixed(2);
        setScale(sc);
        setPageHeight(Array.from(vws.map(vw => vw.height)));
      }
    }
    setNums(numPages);
    setCurNum(1);
    setSelectPages([]);
  };

  const onChangePage = (value) => {
    const { checked, pageno } = value;
    let vs = selectPages || [];
    if (checked) {
      vs.push(pageno);
    } else {
      vs = [...vs.filter((o) => o != pageno)];
    }
    vs = vs.sort((n1, n2) => n1 - n2);
    setSelectPages([...vs]);
  }

  const doDownloadPdf = () => {
    if (!selectedKey) {
      return;
    }
    LydjStore.downloadPdf(selectedKey, selectPages, nums).then(data => {
      debugger;
      const dom = printRef.current;
      const blob = new Blob([data], { type: 'application/pdf' });
      dom.src = window.URL.createObjectURL(blob);
      if (dom.attachEvent) {
        dom.attachEvent("onload", () => {
          dom.contentWindow.print();
          if (LydjStore.opt !== "view") {
            debugger;
            LydjStore.setRecordValue("fyys", parseInt(LydjStore.editRecord.fyys || 0) + parseInt(selectPages && selectPages.length || nums));
          }
        });
      } else {
        dom.onload = () => {
          dom.contentWindow.print();
          if (LydjStore.opt !== "view") {
            LydjStore.setRecordValue("fyys", parseInt(LydjStore.editRecord.fyys || 0) + parseInt(selectPages && selectPages.length || nums));
          }
        };
      }

    });
  }


  const doPrintLyPdf = () => {
    if (!selectedKey) {
      return;
    }
    const dom = printRef.current;
    const blob = new Blob([LydjStore.files[selectedKey].data], { type: 'application/pdf' });
    dom.src = window.URL.createObjectURL(blob);
    if (dom.attachEvent) {
      dom.attachEvent("onload", () => {
        dom.contentWindow.print();
      });
    } else {
      dom.onload = () => {
        dom.contentWindow.print();
      };
    }

  }

  return (
    <Dialog
      isFullScreen
      title={<Row>
        <Col span={4}>附件</Col>
        <Col >
          <input type="range" min="10" step="10" max="400" value={scale * 100} onChange={e => setScale((e.target.value / 100).toFixed(2))} />{`${Math.floor(scale * 100)}%`}
          {LydjStore.fileshowtype === "D" &&
            <Button
              style={{ marginLeft: 20 }}
              type="secondary"
              onClick={() => {
                doDownloadPdf();
              }}><SvgIcon type="iconprint" style={{ marginRight: 2 }} />{`打印${selectPages && (selectPages.length > 0) && "第".concat(selectPages.join("、"), "页") || '所有页'}`}</Button>
          }
          {LydjStore.fileshowtype === "L" &&
            <Button
              style={{ marginLeft: 20 }}
              type="secondary"
              onClick={() => {
                doPrintLyPdf();
              }}><SvgIcon type="iconprint" style={{ marginRight: 2 }} />打印</Button>
          }
        </Col></Row>
      }
      visible={LydjStore.fileDialogShow}
      onClose={() => { LydjStore.closeFileDialog(); }}
      footer={false}
      height={"100vh"}
      align="tc tc"
      // style={{ width: "calc(100vw - 100px)" }}
      style={{ width: "100%" }}
      className="docViewDailog"
    >
      <Row align="stretch" className="docViewDailogContent"  >
        <Col span={4} style={{ borderRight: "1px dashed #c4c6cf" }}>
          <Nav type="normal" embeddable selectedKeys={[selectedKey]}>{LydjStore.fileData && LydjStore.fileData.map(o => <Nav.Item key={o.fileid} onClick={() => { viewFile(o.grpid, o.fileid) }}>{o.title || o.filename}</Nav.Item>)}</Nav>
        </Col>
        <Col span={20}>
          <div className="docViewDailogContentInner" ref={ref}>
            <Loading visible={LydjStore.downloadingfile || LydjStore.downloadingpdf} />
            {!LydjStore.downloadingfile && !LydjStore.downloadingpdf && <div style={{ width: "100%", height: "100%" }}>
              {selectedKey &&
                <Document
                  className="fileContent"
                  options={{
                    cMapUrl: 'cmaps/',
                    cMapPacked: true,
                  }}
                  file={LydjStore.files[selectedKey] && LydjStore.files[selectedKey].data} onLoadSuccess={(docproxy) => { onDocumentLoadSuccess(docproxy) }}>
                  <AutoSizer style={{ width: "100%", height: "100%" }}>{
                    ({ width, height }) =>
                      <List rowCount={nums}
                        width={width}
                        height={window.innerHeight - 200}
                        overscanRowCount={1}
                        rowHeight={({ index }) => pageHeight && pageHeight.length > 0 && (pageHeight[index] * scale + 20) || 20}
                        rowRenderer=
                        {({
                          index, // Index of row
                          isScrolling, // The List is currently being scrolled
                          isVisible, // This row is visible within the List (eg it is not an overscanned row)
                          key, // Unique key within array of rendered rows
                          parent, // Reference to the parent List (instance)
                          style, // Style object to be applied to row (to position it);
                        }) =>
                          <div style={style} className='filePage'>
                            {LydjStore.fileshowtype === "D" &&
                              <div id={`page${key}`} className="pdfpagecheck">
                                <Checkbox onChange={checked => { onChangePage({ checked: checked, pageno: index + 1 }) }}><span >第 {index + 1}页</span></Checkbox>
                              </div>
                            }
                            <Page className="pdfPage" loading="" pageNumber={index + 1} scale={scale} />
                          </div>}
                      />
                  }
                  </AutoSizer>
                </Document>
              }

            </div>
            }
          </div>
        </Col>
      </Row>
      <iframe type="data:application/pdf" style={{ display: "none" }} ref={printRef} />
    </Dialog>
  );
});

export default FileView;

import { Space, Badge, Popover, Tooltip,  List} from 'antd';
import { ContainerOutlined, CreditCardOutlined, DownloadOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import { useModel, history } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import NoticeIconView from '../NoticeIcon';
import UserOrg from '../UserOrg';
import RightStore from "@/components/RightContent/RightStore";
import { observer } from 'mobx-react';
import SysStore from '@/stores/system/SysStore';
export type SiderTheme = 'light' | 'dark';


const GlobalHeaderRight: React.FC = observer((props) => {
  const { initialState } = useModel('@@initialState');

  const [xtgjList, setXtgjList]=useState([]);

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  function cutString (str, len) {
    // length属性读出来的汉字长度为1
    if(str.length*2 <= len) {
      return str;
    }
    let strlen = 0;
    let s = "";
    for(let i = 0;i < str.length; i++) {
      s = s + str.charAt(i);
      if (str.charCodeAt(i) > 128) {
        strlen = strlen + 2;
        if(strlen >= len){
          return s.substring(0,s.length-1) + "...";
        }
      } else {
        strlen = strlen + 1;
        if(strlen >= len){
          return s.substring(0,s.length-2) + "...";
        }
      }
    }
    return s;
  }


  useEffect(() => {
    RightStore.queryAllDbswCount();
    RightStore.queryAllCartCount();
    RightStore.querygjx();
  }, []);

  const getxtgj = ()=>{
    const uo= RightStore.xtgjData;
    const sjData = [];
    if (uo.length > 0) {
      for (let i = 0; i < uo.length; i++) {
        let newKey = {};
        newKey = uo[i];
        newKey.shortfilename = cutString(newKey.filename,16);
        sjData.push(newKey);
      }
      setXtgjList(sjData);
    }

  }


  useEffect(() => {
    getxtgj();
  }, [RightStore.xtgjData]);


  const downloadFj = (item)=>{

    const url="/api/eps/wdgl/attachdoc/download?fileid=" + item.fileid
    + "&grpid=" + item.grpid + "&doctbl= ATTACHDOC&grptbl=DOCGROUP&atdw=" + SysStore.getCurrentUser().dwid
    + "&umid=CONTROL0001&mkbh=" + null + "&downlx=01";
    window.open(url);
  }





  const content = (
    <List
    dataSource={RightStore.xtgjData}
    renderItem={item => (
      <List.Item

      >
          <List.Item.Meta
        title={<Tooltip title={item.filename}> {item.shortfilename}</Tooltip>}
        />
        <div>
          <a
            onClick={() => {
              downloadFj(item);
            }}>
          <DownloadOutlined />
          </a>
       </div>
      </List.Item>
    )} />

  );

  return (

    <Space className={className}>
      <UserOrg />
      <span
        className={styles.action}
        onClick={() => {
          history.push({ pathname: "/eps/daly/dajyc", query: {umname:"档案借阅车"} });
        }}
      >
        <Badge size={"small"} count={RightStore.cartCount ? RightStore.cartCount : 0}>
          <ShoppingCartOutlined style={{ fontSize: "18px" }} />
        </Badge>

      </span>

      <span
        className={styles.action}
        onClick={() => {
          history.push("/eps/workflow/dbsw");
        }}
      >
        <Badge size={"small"} count={RightStore.dbswCount ? RightStore.dbswCount : 0}>
            <ContainerOutlined style={{fontSize: "13px"}}/>
        </Badge>
      </span>
      <span
        className={styles.action}
        // onClick={() => onToolsInfo()}
      >
        {/* <Badge size={"small"} count={RightStore.cartCount ? RightStore.cartCount : 0}>
          <CreditCardOutlined  style={{ fontSize: "18px" }} />
        </Badge> */}
         {/* <Tooltip title="工具箱"> */}
            <Popover content={content} title="工具名称" >
            <   CreditCardOutlined  style={{ fontSize: "18px" }} />
            </Popover>
        {/* </Tooltip> */}

      </span>

      <NoticeIconView/>

      <Avatar menu/>
      {/* <SelectLang className={styles.action}/> */}
    </Space>

  );
})

export default GlobalHeaderRight;

import React, { useEffect } from "react";
import { Input, Table, Pagination, Icon, Grid, Form } from "@alifd/next";
import { FormattedMessage, injectIntl } from "react-intl";
import IceNotification from "@icedesign/notification";
import moment from "moment";
import { observer } from "mobx-react";
import LoginStore from "@/stores/system/LoginStore";
import Store from "@/stores/appraisa/AppraisaStore.ts";
import UserMenuStore from "@/stores/system/UserMenuStore";
import E9Config from "@/utils/e9config";
import "./index.less";
import CollapseTree from "@/components/collapseTree";
import util from "@/utils/util";


import Xhjd from "../../Kfjd/AppraisalMain";
/**
 *
 */
const ArchiveInfo = observer((props) => {
  const {
    intl: { formatMessage },
  } = props;
 

  // useEffect(() => {
    
  // }, []);

  return (
   <Xhjd jdumid={"DAJD022"}/>
  );
});

export default injectIntl(ArchiveInfo);

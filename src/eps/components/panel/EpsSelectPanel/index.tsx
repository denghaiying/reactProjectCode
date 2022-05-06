import React from "react";
import { observer } from "mobx-react";
import { EpsProps} from "@/eps/commons/declare";
import DwTableLayout from "@/eps/business/DwTableLayout";

export interface EpsSelectPanelProps extends EpsProps {

  selectService: any;
} 

const EpsSelectPanel = observer((props: EpsProps) => {
  return (
    <DwTableLayout {...props} noRender={true}></DwTableLayout>
  );
})

export default EpsSelectPanel;

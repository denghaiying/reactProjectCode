import { Transfer } from "@alifd/next";
import React, { useEffect } from "react";
import FrontIntStore from "../../../stores/etl/FrontIntStore";
import { observer } from "mobx-react";

const StepColumn = observer(props => {
  const { tableColums = [], findColumns,transferDefaultValue } = FrontIntStore;
   const defaultCheck=transferDefaultValue[props.stepType]?transferDefaultValue[props.stepType].split(","):[];
  const handleChange = (value, data, extra) => {
    const v={};
    v[props.stepType]=value.join(",")
    FrontIntStore.setStepValues(v);
  };

  useEffect(() => {
    findColumns();
  }, []);

  return (
    <Transfer
      style={{ padding: 8 }}
      dataSource={tableColums}
      defaultValue={defaultCheck}
      onChange={handleChange}
      titles={["Title", "Title"]}
    />
  );
});

export default StepColumn;

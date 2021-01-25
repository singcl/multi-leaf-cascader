import * as React from "react";
import { useState, useEffect } from "react";
import Cascader from "./core/Cascader";
import { getAllLeafOptions } from "./_util";
import Select from "rc-select";

type NodeValue = string | number;

interface Node {
  value: NodeValue;
  label: string;
  children?: Array<Node>;
}

interface Props {
  options: Array<Node>;
  value?: Array<NodeValue>;
  onChange?: (value: Array<NodeValue>, options?: Array<Node>) => void;
}

// TODO: 提供通用的Props， 目前没时间先这样写死
export const MultiLeafCascader: React.FC<Props> = ({
  options = [],
  onChange = function () {},
  value = [],
}) => {
  const [allLeafOptions, setAllLeafOptions] = useState<Array<Node>>([]);
  useEffect(() => {
    const allLeafOptions = getAllLeafOptions(options);
    setAllLeafOptions(allLeafOptions as Array<Node>);
  }, [options]);

  return (
    <div className="App">
      <Cascader
        value={value}
        options={options}
        allLeafOptions={allLeafOptions}
        onChange={onChange}
        getPopupContainer={(node) => node}
      >
        <Select
          value={value}
          placeholder="请选择"
          mode="tags"
          onChange={onChange}
          open={false}
          options={allLeafOptions}
          allowClear
          style={{ width: "360px" }}
        />
      </Cascader>
    </div>
  );
};

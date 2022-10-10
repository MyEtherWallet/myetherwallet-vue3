const platform = require("platform");
import * as t from "./types";
import * as n from "./nodes";
import type { Network } from "./types/types";
import type { Node } from "./nodes/types";
const nodes: NodeList = n;
const types: TypeList = t;
const nodeList: Nodes = {};

Object.keys(types).forEach((key) => {
  nodeList[types[key].name] = [];
});

Object.keys(nodes).forEach((key) => {
  if (
    nodes[key].service === "infura.io" &&
    platform.name &&
    platform.name === "firefox"
  )
    return;
  // temp until infura fix https://github.com/INFURA/infura/issues/174

  nodeList[nodes[key].type.name].push(nodes[key]);
});
export type Nodes = {
  [key: string]: Array<Node>;
};
type NodeList = {
  [key: string]: Node;
};
type TypeList = {
  [key: string]: Network;
};
export default nodeList;

import { Node } from "./types";
import { BSC } from "../types";
export default <Node>{
  type: BSC,
  service: "myetherwallet.com-ws",
  url: "wss://nodes.mewapi.io/ws/bsc",
  port: 443,
  auth: false,
  username: "",
  password: "",
};

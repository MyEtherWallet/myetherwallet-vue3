import { Node } from "./types";
import { GOERLI } from "../types";
export default <Node>{
  type: GOERLI,
  service: "myetherwallet.com-ws",
  url: "wss://nodes.mewapi.io/ws/goerli",
  port: 443,
  auth: false,
  username: "",
  password: "",
};

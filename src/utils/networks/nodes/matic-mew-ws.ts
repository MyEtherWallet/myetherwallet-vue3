import { Node } from "./types";
import { MATIC } from "../types";
export default <Node>{
  type: MATIC,
  service: "myetherwallet.com-ws",
  url: "wss://nodes.mewapi.io/ws/matic",
  port: 443,
  auth: false,
  username: "",
  password: "",
};

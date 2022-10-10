import { Node } from "./types";
import { ROP } from "../types";
export default <Node>{
  type: ROP,
  service: "myetherwallet.com-ws",
  url: "wss://nodes.mewapi.io/ws/rop",
  port: 443,
  auth: false,
  username: "",
  password: "",
};

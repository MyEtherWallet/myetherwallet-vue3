import { Node } from "./types";
import { KOV } from "../types";
export default <Node>{
  type: KOV,
  service: "myetherwallet.com-ws",
  url: "wss://nodes.mewapi.io/ws/kovan",
  port: 443,
  auth: false,
  username: "",
  password: "",
};

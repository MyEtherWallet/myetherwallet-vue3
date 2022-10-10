import { Node } from "./types";
import { RIN } from "../types";
export default <Node>{
  type: RIN,
  service: "myetherwallet.com-ws",
  url: "wss://nodes.mewapi.io/ws/rinkeby",
  port: 443,
  auth: false,
  username: "",
  password: "",
};

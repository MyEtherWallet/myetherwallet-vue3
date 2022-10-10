import { Node } from "./types";
import XDC from "../types/XDC";
export default <Node>{
  type: XDC,
  service: "xdc-network-ws",
  url: "wss://mewws.blocksscan.io/ws",
  port: 443,
  auth: false,
  username: "",
  password: "",
};

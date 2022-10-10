import { Node } from "./types";
import { MOONBEAM } from "../types";
export default <Node>{
  type: MOONBEAM,
  service: "moonbeam.network-ws",
  url: "wss://wss.api.moonbeam.network/",
  port: 443,
  auth: false,
  username: "",
  password: "",
};

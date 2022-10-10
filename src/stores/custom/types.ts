export type State = {
  localStore: boolean;
  tokens: { [key: string]: Array<any> };
  paths: Array<any>;
  stateVersion: string;
  addressBook: Array<string>;
};

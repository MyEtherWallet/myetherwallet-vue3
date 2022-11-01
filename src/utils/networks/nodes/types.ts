import { Network } from '../types/types';
export type Node = {
  type: Network;
  service: string;
  url: string;
  port: number;
  auth: boolean;
  username: string;
  password: string;
};

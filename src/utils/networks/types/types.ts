export type Network = {
    name: string;
    name_long?: string;
    homePage?: string;
    blockExplorer?: string;
    blockExplorerTX?: string;
    blockExplorerAddr?: string;
    chainID?: number;
    tokens?: any;
    contracts?: any;
    isTestNetwork?: boolean;
    ens?: {
      registry?: string;
      registrarTLD?: string;
      registrarType?: string;
      supportedTld?: Array<string>;
      subgraphPath?: string;
    };
    icon?: SVGAElement;
    currencyName?: string;
    isEthVMSupported?: {
      supported?: boolean;
      url?: string | null;
      blockExplorerTX?: string;
      blockExplorerAddr?: string;
      websocket?: null;
    };
    gasPriceMultiplier?: number;
    canBuy?: boolean;
    coingeckoID?: string | null;
  };
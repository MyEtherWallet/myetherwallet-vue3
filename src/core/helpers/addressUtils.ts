import web3 from 'web3';
const isAddress = (address: string): boolean => {
  return web3.utils.isHexStrict(address) && web3.utils.isAddress(address);
};
const toChecksumAddress = (address: string): string => {
  return web3.utils.toChecksumAddress(address);
};
export { isAddress, toChecksumAddress };

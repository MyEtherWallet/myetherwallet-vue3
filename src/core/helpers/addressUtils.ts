import web3 from "web3/types";

const isAddress = (address: string): boolean => {
  return (
    address && web3.utils.isHexStrict(address) && web3.utils.isAddress(address)
  );
};
const toChecksumAddress = (address: string): boolean => {
  return web3.utils.toChecksumAddress(address);
};
export { isAddress, toChecksumAddress };

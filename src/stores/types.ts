import { Store } from 'pinia';
interface index {
  [key: string]: any;
}

export type PiniaActionAdaptor<
  Type extends Record<string, (...args: any) => any>,
  StoreType extends Store & index
> = {
  [Key in keyof Type]: (
    this: StoreType,
    ...p: Parameters<Type[Key]>
  ) => ReturnType<Type[Key]>;
};

export type PiniaGetterAdaptor<GettersType, StoreType extends Store> = {
  [Key in keyof GettersType]: (
    this: StoreType,
    state: StoreType['$state']
  ) => GettersType[Key];
};

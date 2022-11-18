import { Store } from 'pinia';
interface index {
  [key: string]: any;
}

export type PiniaActionAdaptor<
  Type extends Record<string, (...args: any) => any>,
  StoreType extends Store
> = {
  [Key in keyof Type]: (
    this: StoreType,
    ...p: Parameters<Type[Key]>
  ) => ReturnType<Type[Key]>;
};

export type PiniaGetterAdaptor<GettersType, StoreType extends Store> = {
  [Key in keyof GettersType]: GettersType[Key] extends (...args: any) => infer R
    ? (
        this: StoreType & GettersType,
        state: StoreType['$state']
      ) => (...p: Parameters<GettersType[Key]>) => R
    : (
        this: StoreType & GettersType,
        state: StoreType['$state']
      ) => GettersType[Key];
};

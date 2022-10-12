export {};
declare module 'vue' {
  import lokalise from './filters/lokalise';
  interface ComponentCustomProperties {
    lokalise: typeof lokalise;
  }
}

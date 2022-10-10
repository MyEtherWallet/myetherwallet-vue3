import translations from './index';
interface Code {
  [key: string]: string;
}
const codes: Code = {};
const translationKeys = Object.keys(translations);

translationKeys.forEach(key => {
  codes[key.substring(0, 2)] = key;
});

export default codes;

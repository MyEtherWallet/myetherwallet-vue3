import xss from 'xss';

interface Query {
  [key: string]: string;
}
export default function (queryObj: Query) {
  const newObj: Query = {};
  Object.keys(queryObj).forEach(key => {
    newObj[key] = xss(queryObj[key]);
  });
  return newObj;
}

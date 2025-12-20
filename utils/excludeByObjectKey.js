export default function excludeByObjectKey({ data, excludeList, objKey }) {
  return data.filter((item) => !excludeList.includes(`${item[objKey]}`));
}

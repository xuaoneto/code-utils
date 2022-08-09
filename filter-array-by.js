export function filterArrayBy(array = [{}], searchText = "", findKeys = []) {
  let resultArray = [];
  let indexes = [];
  const search = searchText.toLowerCase();

  for (let key of findKeys) {
    array.map((current, index) => {
      if (current[key].toLowerCase().includes(search)) indexes.push(index);
    });
  }
  let uniqIndexes = [...new Set(indexes)];
  for (let index of uniqIndexes) resultArray.push(array[index]);

  return resultArray;
}

const fs = require("fs");

const thisPath =
  "C:/Users/jofer/OneDrive/Desktop/Trabalho/Goldcare-Vercel/src/components/ui/vectors";

function getDirectories(thisPath) {
  const rawPaths = fs.readdirSync(thisPath, { withFileTypes: true });
  let pathNamesArray = [];

  for (let currentPath of rawPaths) {
    if (!currentPath.name.includes(".js"))
      pathNamesArray.push(currentPath.name);
  }

  return pathNamesArray;
}

const dirs = getDirectories(thisPath);

console.log(dirs);

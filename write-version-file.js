const fs = require("fs");
const process = require('node:process');

const writeTextFile = (filePath, data) => {
    fs.writeFile(filePath, data, function(err) {
        if (err) {
            throw err;
        }
        console.log(`${filePath} has been saved`);
    });
};

const getFileContent = (currApiVersion) => (
`// This file is automatically generated, please do not change it
// and please don't remove it from git in order not to break the yarn run:local commands

const backendVersion = "${currApiVersion}";
export default backendVersion;`
);

const currApiVersion = process.env.API_VERSION || "testing";

(async () => {
    const filePath = "./src/backend-version.ts";
    const fileContent = getFileContent(currApiVersion);
    writeTextFile(filePath, fileContent);
})();
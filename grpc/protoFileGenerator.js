const fs = require('fs');

// function for creating the proto file in the directory using file system module
const createProtoFile = async (protoUrl, fileName) => {
  // get the content from the url
  const protoResponse = await fetch(protoUrl);
  // convert the content to text
  const protoContent = await protoResponse.text();
  // write the file
  fs.writeFileSync(__dirname + `/${fileName}.proto`, protoContent);
};

module.exports = {
  createProtoFile,
};

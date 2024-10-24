const path = require("path");

const uploadSingleFile = async (fileObject) => {
  // let uploadPath = path.resolve(__dirname, '../public/images/' + fileObject.name);
  let uploadPath = path.resolve(__dirname, "../public/images/usersImage/");

  //get image extension
  let extName = path.extname(fileObject.name);
  //get image's name
  let basename = path.basename(fileObject.name, extName);

  //create final name

  let finalName = `${basename}-${Date.now()}${extName}`;
  let finalPath = `${uploadPath}/${finalName}`;
  try {
    await fileObject.mv(finalPath);
    return {
      status: "access",
      path: finalName,
      error: null,
    };
  } catch (error) {
    return {
      status: "faild",
      path: null,
      error: null,
    };
  }
};

const uploadMultipleFile = async (fileArray) => {
    try {
      // let uploadPath = path.resolve(__dirname, '../public/images/' + fileObject.name);
      let uploadPath = path.resolve(__dirname, "../public/images/usersImage/");
      let resultsArr = [];
      let countSuccess = 0;
  
      for (i = 0; i < fileArray.length; i++) {
        //get image extension
        let extName = path.extname(fileArray[i].name);
        //get image's name
        let basename = path.basename(fileArray[i].name, extName);
  
        //create final name
  
        let finalName = `${basename}-${Date.now()}${extName}`;
        let finalPath = `${uploadPath}/${finalName}`;
  
        try {
          await fileArray[i].mv(finalPath);
          resultsArr.push({});
          countSuccess++;
          console.log(countSuccess);
        } catch (error) {
          resultsArr.push({ error: error });
        }
      }
    } catch (error) {
      return {
        status: "access",
        path: finalName,
        error: error,
      };
    }
  };

module.exports = { uploadSingleFile,uploadMultipleFile };

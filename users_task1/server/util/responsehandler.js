exports.successfunction=function successfunction(api_Data){
    let res={
        success:true,
        statuscode:200,
        data:api_Data.data ?api_Data.data:null,
        message:api_Data.message ? api_Data.message:null
       
    }
    return res;
}
exports.errorfunction=function errorfunction(api_Data){
    let res={
        success:false,
        statuscode:400,
        data:api_Data.data ?api_Data.data:null,
        message:api_Data.message ? api_Data.message:null
       
    }
    return res;
}
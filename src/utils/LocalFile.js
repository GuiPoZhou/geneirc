/*
 * @Autor: 焦政
 * @Date: 2021-02-05 15:59:22
 * @Description: 后台返回base64文件格式 先转为blob格式 再转化为url
 */

const LocalFile = {
    base64ToUrl: (code) => {
        //Base64一行不能超过76字符，超过则添加回车换行符。因此需要把base64字段中的换行符，回车符给去掉，有时候因为存在需要把加号空格之类的换回来，取决于base64存取时的规则。
        code = code.replace(/[\n\r]/g, "");
        var raw = window.atob(code);
        let rawLength = raw.length;
        //转换成pdf.js能直接解析的Uint8Array类型
        let uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        let bolb = new Blob([uInt8Array], { type: "application/pdf" });
        return window.URL.createObjectURL(bolb); //转成pdf类型
    },
    fileToUrl: (file) => {
        let url = null;
        if (window.createObjectURL != undefined) {
            // basic
            url = window.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        } else if (window.URL != undefined) {
            // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        }
        return url;
    },

}

export default LocalFile



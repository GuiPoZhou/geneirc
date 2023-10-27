<template>
<div>
      <el-table :data="fileList">
        <el-table-column label="文件名" align="center" prop="fileName"></el-table-column>
        <el-table-column label="文件类型" align="center" width="80" prop="fileType"></el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template v-slot="scope">
            <el-button type="text" size="mini" @click="downloadFile(scope.row)">下载</el-button>
<!--            <el-button type="text" size="mini" @click="deleteFile(scope.row)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>

export default {
  name: "ARCHIVE_AUDIT",
  data() {
    return {
      showLog: false,
      fileList: [],
    }
  },
  methods: {
    init(row) {
      this.showLog = true
      this.$net('/natong/v2/archivesManage/getArchiveFileList/' + row.executionId,'get').then(res => {
        if (res.code === 200) {
          this.fileList = res.data.archiveFileList
        }
      })
    },
    fileType(fileType) {
      switch (fileType) {
        case 'jpg':
        case 'jpeg':
        case 'png':
          return 'image/jpeg'; // 或者 'image/png' 等
        case 'pdf':
          return 'application/pdf';
        case 'doc':
          return 'application/msword'; // doc
        case 'docx':
          return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; // docx
        case 'xls':
          return 'application/vnd.ms-excel'; // xls
        case 'xlsx':
          return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; // xlsx
        default:
          return `application/${fileType}`;
      }
    },
    downloadFile({fileName,downloadType,filePath}) {
      const fileType  = fileName.split('.').pop()
      console.log(fileType);
      let finalData = this.fileType(fileType)
      console.log('type格式',finalData)
      let params = {
        downloadType,
        filePath
      };
      const link = document.createElement('a')
      this.$net('/natong/v2/archivesManage/download','getFile', params)
          .then(res => {
            let blob = new Blob([res],{type: finalData});  // res就是接口返回的文件流了
            let objectUrl = URL.createObjectURL(blob);
            console.log(objectUrl)
            // window.location.href = objectUrl;
            link.href = objectUrl
            link.download = fileName // 自定义文件名
            link.click() // 下载文件
            URL.revokeObjectURL(objectUrl); // 释放内存
          });
    },
    deleteFile() {

    },
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped>

</style>

<template>
    <div>
        <el-dialog :title="titles" :visible.sync="dialogselectShow" center :show-close="true" :close-on-press-escape="false"
            :close-on-click-modal="false" width="70%" @close="cancelbtn">
            <div class="a-c-bottom">
                <el-row :gutter="20">
                    <!--分类-->
                    <el-col :span="5" :xs="24">
                        <logueTree :treeList="treeList" @updata="getFiletree" @handleData="handleData"></logueTree>
                    </el-col>
                    <el-col :span="19" :xs="24">
                        <div>
                            <!-- <el-row :gutter="10" class="searchbox">
                                <el-col :span="1.5"></el-col>
                                <right-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery"
                                    @fullScreen="e_fullScreen" @changeBox="e_changeBox" :boxData="colData"></right-toolbar>
                            </el-row> -->
                            <el-table ref="multipleTable" :data="tableData" 
                                @sort-change="sortChange">
                                
                                <el-table-column label="序号" align="center" type="index" width="50" fixed />
                                <el-table-column prop="fileType" label="文件类型" sortable="custom" show-overflow-tooltip
                                    align="center" v-if="colData[0].istrue">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.fileType === 1">受控文件</span>
                                        <span v-if="scope.row.fileType === 2">外来文件</span>
                                        <span v-if="scope.row.fileType === 3">机密文件</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="fileName" label="文件名称" sortable="custom" show-overflow-tooltip
                                    width="100" align="center" v-if="colData[1].istrue" />
                                <el-table-column prop="fileNumber" label="文件编号" sortable="custom" show-overflow-tooltip
                                    width="100" align="center" v-if="colData[2].istrue" />

                                <el-table-column prop="version" label="版次" sortable="custom" show-overflow-tooltip
                                    align="center" v-if="colData[3].istrue" />
                                <el-table-column prop="status" label="文档状态" sortable="custom" show-overflow-tooltip
                                    align="center" v-if="colData[4].istrue">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.status === 0">有效</span>
                                        <span v-if="scope.row.status === 1" style="color: #ff4949">作废</span>
                                    </template>
                                </el-table-column>

                                <el-table-column prop="createBy" label="编制人" sortable="custom" show-overflow-tooltip
                                    align="center" v-if="colData[5].istrue" />
                                <el-table-column prop="remark" label="备注" sortable="custom" show-overflow-tooltip
                                    align="center" v-if="colData[6].istrue" />
                                <!-- <el-table-column prop="createTime" label="创建日期" sortable="custom" show-overflow-tooltip align="center"
                v-if="colData[7].istrue" />
              <el-table-column prop="treeName" label="所属文件目录" sortable="custom" show-overflow-tooltip align="center"
                v-if="colData[8].istrue" /> -->
                <el-table-column label="单选" width="50" align="center">
                     <template slot-scope="scope">
                <!-- {{&nbsp;}} 或者 {{""}}-->
                     <el-radio v-model="currentFactor" :label="scope.row">{{""}}</el-radio>
                </template>
                 </el-table-column>

                            </el-table>
                            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                                :limit.sync="queryParams.pageSize" @pagination="getList" />
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleOk">确定</el-button>
                <el-button @click="cancelbtn">取消</el-button>
            </div>
        </el-dialog>
      
    </div>
</template>
<script>
import {
    getFiletreeList,
    getFileList,
    getFileredetail,
    deleteControllFile,
    exportControll
} from '@/api/filesManagement/filesManagement'
import logueTree from '../components/logueTree'
export default {
    name: 'selectFile',
    components: { logueTree },
    data() {
        return {
        dialogselectShow: false,
        titles: '添加',
        tableData: [],
        queryParams: {
        pageNum: 1,
        pageSize: 10,
        treeId: null,
        fileNumber: '',
        fileName: '',
        status: null,
        fileType: null,
        idList: [],
        orderByColumn: '',
        orderByType: ''
      },
      treeList: [],
      trssdata: {},
      total: 0,
      fileTypelist: [
        { label: '受控文件', value: 1 },
        { label: '外来文件', value: 2 },
        { label: '机密文件', value: 3 }
      ],
      colData: [
        { title: '文件类型', istrue: true },
        { title: '文件名称', istrue: true },
        { title: '文件编号', istrue: true },
        { title: '版次', istrue: true },
        { title: '文档状态', istrue: true },
        { title: '编制人', istrue: true },
        { title: '备注', istrue: true },
        // { title: '创建日期', istrue: true },
        // { title: '所属文件目录', istrue: true }

      ],

        }
    },
    methods: {
        cancelbtn() {
            this.$emit('close')
        },
        init() {
            this.dialogselectShow = true
        },
        e_fullScreen() {
      this.fullscreen = !this.fullscreen
    },
        getList() {
        getFileList(this.queryParams).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
      })
    },
    sortChange(column, prop, order) {
      this.queryParams.orderByColumn = this.toLine(column.prop)
      if (column.order === 'descending') {
        this.queryParams.orderByType = 'DESC'
      } else if (column.order === 'ascending') {
        this.queryParams.orderByType = 'ASC'
      } else {
        this.queryParams.orderByType = ''
      }
      this.getList()
    },
    toLine(name) {
      return name.replace(/([A-Z])/g, '_$1').toLowerCase()
    },
    getFiletree() {
      getFiletreeList().then(res => {
        this.treeList = res.data
      })
    },
    // 获取点击后的树列表
    handleData(data) {
      // this.radio = ''
      // this.$refs.selectTable.setCurrentRow(row);
      this.trssdata = data
      this.multiple = false
      this.ismultiple = true
      this.queryParams.treeId = this.trssdata.id
      this.getList()
    },
        handleOk() {

        }

    },
    created() {
        this.getList()
    },
    mounted() {
    this.getFiletree()
  },

}
</script>
<style lang="less" scoped></style>
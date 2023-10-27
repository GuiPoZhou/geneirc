<template>
<div class="groupEdit">
  <el-dialog title="修改采样项目分组" :visible.sync="detailsShow" center
  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" @open="open">
      <el-form :model="editParams" :rules="rules" ref="checkForm" :inline="true" label-width="88px">
        <el-form-item label="分组名称" prop="groupName">
          <el-input v-model="editParams.groupName" disabled  clearable size="small"/>
        </el-form-item>
        <el-form-item label="检测类别" prop="detectCategoryName">
          <a-input-search v-model="editParams.detectCategoryName" disabled style="width: 200px" placeholder="选择类别名称" disabled @search="cateShow=true" />
        </el-form-item>
        <el-form-item label="项目名称" prop="itemNameCn">
          <a-input-search v-model="editParams.itemNameCn" disabled style="width: 200px" @search="projectShow=true" placeholder="选择项目" />
        </el-form-item>
        <!-- 储存条件 -->
        <el-form-item label="储存条件">
         <a-select
            style="width:200px"
            :options="storageData"
            :getPopupContainer="getPopupContainer"
            v-model="storageDataUpdata"
            mode="multiple"
            :labelInValue="true"
            disabled
          />
        </el-form-item>
        <!-- 保存剂 -->
        <el-form-item label="保存剂">
          <a-select
            style="width:200px"
            :options="preservativeData"
            :getPopupContainer="getPopupContainer"
            v-model="preservativeDataUpdata"
            mode="multiple"
            :labelInValue="true"
            disabled
          />
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <p>包含项目</p>
      <el-table height="400" v-loading="loading" :data="tableData" align="center">
        <el-table-column prop="id" type="index" label="序号" width="55px" />
        <el-table-column prop="itemNameCn" label="项目名称" :show-overflow-tooltip="true" />
        <el-table-column prop="isScene" label="现场检测">
          <template slot-scope="scope">
            <el-switch
                active-color="#5B7BFA"
                inactive-color="#dadde5"
                v-model="scope.row.isScene"
                :active-value=true
                :inactive-value=false
                disabled
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="stroma"  label="基质"/>
        <el-table-column prop="methodCode"  label="方法编号"/>
        <el-table-column prop="childMethodName"  label="子法名称"/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
      </div>
  </el-dialog>
  <selectDetectName :visible.sync="cateShow" @handleParentName="changeDetectName"/>
  <selectProject :visible.sync="projectShow" @handleItemName='getTableData'/>
</div>
</template>
<script>
// import "@/views/core/components_use";
// import 'ant-design-vue/dist/antd.css';
import {editSamplingList,getDictionaryData} from '@/api/standardManagement/config'
import selectDetectName from './selectDetectName';
import selectProject from './selectProject';

export default {
  components:{
    selectDetectName,
    selectProject
  },
  data() {
    return {
      // 采样项目分组表单数据
      groupParams: {
        groupName: null,
        detectCategoryName:null,
        detectCategory:null, //这是id
        detailList:[],
        preservativeList:[],
        storageList:[]
      },
      rules: {
          groupName: [
            { required: true, message: '请输入分组名称', trigger: 'blur' }
          ],
           detectCategoryName: [
            { required: true, message: '请输入检测类别', trigger: 'blur' }
          ],
           itemNameCn: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],

      },
      //保存剂数据
      preservativeData:[],
      //输入框里面选择的保存剂&&回显
      preservativeDataUpdata:[],
      //存储条件数据
      storageData:[],
      //输入框里面选择的存储条件&&回显
      storageDataUpdata:[],

      cateShow:false,
      projectShow:false,
      //表格数据
      tableData:[],
      //这里需要回头看
      loading: false,
      preservative:'preservative',
      storage:'storage'
    }
  },
  props:{
    detailsShow: {
      type: Boolean,
      default: false,
    },
    //从上一页带过来的所有数据
    editParams:{
      type: Object,
    },
    editIds:{
      type: Number,
    }

  },
  methods:{
    //取消按钮操作1
    close() {
      this.$emit("update:detailsShow", false);
      //在关闭之前需要把以下数据清空
      this.preservativeDataUpdata = [];
      this.storageDataUpdata = [];
      //在关闭之前将项目分组列表的数据清空
      this.tableData = [];
    },
    //处理数据，因为上一页传递过来的数据格式不能正常在文本框中显示
    updateData(){
      if(this.editParams.preservativeList) {
        this.editParams.preservativeList.map(item=>{
          this.preservativeDataUpdata.push({
            key:item.id,
            label:item.preservativeLabel
          })
        })
      }
      if (this.editParams.storageList) {
        this.editParams.storageList.map(item=>{
          this.storageDataUpdata.push({
            key:item.id,
            label:item.storageLabel
          })
        })
      }

    },
    open() {
      //处理回填的字典数据
      this.updateData();
      //将回显的表格数据放在tabledata里面
      this.tableData = this.tableData.concat(this.editParams.detailList)
      console.log('现在是回显的表格数据tableData',this.tableData)
      this.tableData.map(item=>{
        this.groupParams.detailList.push({
          itemMethod:item.id
        })
      })
    },
    //这个是下拉选择用到的
    getPopupContainer(triggerNode) {
      return triggerNode.parentNode
    },
    //获取字典数据中的保存剂1
    getPreservative(){
      console.log('保存剂===>',this.preservative)
      getDictionaryData({dictType:'preservative'}).then(response => {
        const temp = response.data;
        temp.map(item=>{
          this.preservativeData.push({
            value:item.dictCode,
            label:item.dictLabel
          })
        })
        console.log('请求过来的保存剂数据===>',this.preservativeData)
      })
    },
    //获取字典数据中的存储条件1
    getStorage(){
      console.log('存储条件===>',this.storage)
      getDictionaryData({dictType:'storage'}).then(response => {
        const temp = response.data;
        temp.map(item=>{
          this.storageData.push({
            value:item.dictCode,
            label:item.dictLabel
          })
        })
        console.log('请求过来的存储条件===>',this.storageData)
      })
    },
    //val是子组件选择检测类别传递过来的数据1
    changeDetectName(val){
      console.log('子组件传递过来的数据==>',val)
      this.groupParams.detectCategoryName = val.selectDetectName;
      this.groupParams.detectCategory = val.id;
    },
    //val是子组件选择项目传递过来的数据1
    getTableData(val){
      console.log('子组件选择项目传递过来的数据==>',val)
      this.tableData = this.tableData.concat(val.checkData);
      val.ids.map(item=>{
        this.groupParams.detailList.push({
          itemMethod:item
        })
      })
    },
    //删除按钮操作1
    handleDelete(row,scope) {
      console.log('要删除的行数据==>',row);
      console.log(scope.$index)
      const index = scope.$index
      const itemNameCn = row.itemNameCn;
      const groupId = row.id;
      this.$confirm('确定要删除"' + itemNameCn + '"项目？', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=> {
          console.log(this.tableData)
          this.tableData.splice(index,1);
          this.$message.success("删除成功");
        }).catch(function() {});
    },
  },
  computed:{

  },
  created() {
    //获取保存剂数据
    this.getPreservative()
    //获取存储条件数据
    this.getStorage()
  },
  mounted () {

  }
}
</script>
<style lang="less">
.groupAdd {
  ul,li {
    list-style: none;
    padding:0;
  }
}
.searchParentName {
  display:flex;
}
</style>

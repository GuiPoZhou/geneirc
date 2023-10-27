<template>
  <el-dialog title="增加检测信息" :visible.sync="showProModal" append-to-body width="800px"
    center :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" @open="open" @close="beforeClose">
    <el-form ref="form" :model="form" label-width="100px" inline :rules="rules">
      <el-form-item :label="item.label" v-for="(item, index) in filterList" :key="index" :prop="item.model">
        <a-input v-if="item.type==='input'" v-model="form[item.model]" style="width:200px" :disabled="extendedProperties.formShowType === 1" :maxLength="item.model === 'detectDays' ? 2 : 100"></a-input>
        <a-input-number v-else-if="item.type==='number'" type="number" v-model.number="form[item.model]" :disabled="extendedProperties.formShowType === 1" style="width:200px" :min="1"></a-input-number>
        <a-select
          style="width:200px"
          :getPopupContainer="getPopupContainer"
          v-else-if="item.type === 'select'"
          :placeholder="item.options.placeholder"
          :options="item.options.dynamic ? options[index] : item.options.options"
          v-model="form[item.model]"
          :showSearch="item.options.filterable"
          :allowClear="item.options.clearable"
          :mode="item.options.multiple ? 'multiple' : ''"
          :disabled="extendedProperties.formShowType === 1"
        />
        <a-input-search
          style="width:200px"
          v-model="form[item.model]"
          v-else-if="item.type === 'search'"
          :placeholder="item.options.placeholder"
          :type="item.options.type"
          :allowClear="item.options.clearable"
          :maxLength="item.options.maxLength"
          @search="cateShow=true"
		  @click.native="cateShow=true"
		  :readOnly="true"
          :disabled="extendedProperties.formShowType === 1"
        />
<!--   todo 所有类型的渲染     -->
      </el-form-item>
    </el-form>
    <section>
      <div class="btnGroup">
        <el-button type="primary" size="small" @click="edit" :disabled="extendedProperties.formShowType === 1">编辑项目</el-button>
      </div>
      <a-table :columns="proColumns" :data-source="pointMessParam.tableData" :scroll="{ y: 250}" size="small" :pagination="false" bordered rowKey="key"
      >
        <template
          slot="operation"
          slot-scope="text, record, index"
          v-if="extendedProperties.formShowType === 0"
        >
          <a href="javascript:;" @click="deleteRow(index,pointMessParam.tableData,record)" style="color: #40a9ff;">删除</a>
        </template>
      </a-table>
    </section>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSave" v-if="extendedProperties.formShowType === 0">保存</el-button>
      <el-button @click="close">取消</el-button>
    </div>
    <addProject :addShow.sync="addShow" @depth="depth" :editDepth="editDepth" :detectTypeId="pointMessParam.detectTypeId"/>
    <detectType :visible.sync="cateShow" @handleClick="handleClick"/>
  </el-dialog>
</template>
<script>
import addProject from './addProject'
import detectType from './detectType';
import {
  getDynamicData,
} from "@/api/runDynamicPage/config";
import request from '@/utils/request'
import { mapGetters } from 'vuex'
export default {
  components:{addProject,detectType},
  data() {
    const proColumns = [{
      title: '序号',
      width:50,
      align:'center',
      dataIndex: 'index',
      customRender:(text,record,index)=>`${index+1}`,
    },{
      title: '项目名称',
      dataIndex: 'itemNameCn',
      align:'center',
    },{
      title: '方法编码',
      dataIndex: 'methodCode',
      align:'center',
    },{
      title: '子法名称',
      dataIndex: 'childMethodName',
      align:'center',
    },{
      title: '基质',
      dataIndex: 'stroma',
      align:'center',
    },{
      title: '客户指定',
      dataIndex: 'customerAppoint',
      align:'center',
      customRender:(text,record,index)=>text ?'是':'否'
    },{
      title: '操作',
      flag:0,
      dataIndex: 'operation',
      width:100,
      align:'center',
      scopedSlots: { customRender: 'operation' },
    }]

    return {
      form:{},
      addShow:false,
      cateShow:false,
      proColumns,
      editDepth:{},
      deep:[],
      options:[],
      dynamicData:{
        selectCustomerVisible: false,
        selectCustomer(value, event){
          this.selectCustomerVisible = true;
        }
      },
    }
  },
  props:{
    showProModal: {
      type: Boolean,
      default: false,
    },
    list:{
      type:Array
    },
    pointMessParam:{
      type: Object
    },
    pointInfo:{
      type: Object
    },
    extendedProperties:{}
  },
  mounted() {
    this.init()
  },
  computed:{
    rules() {
      let temp = {};
      this.list.map(item => {
        if (item.rules && item.rules.length > 0) {
          temp[item.model] = item.rules[0]
        }
      })
      // console.log(temp)
      return temp
    },
    filterList() {
      return this.list.filter(item=>item.model !== 'detectItem')
    },
    ...mapGetters([
      'detectType',
    ])

  },
  methods:{
    init() {
       this.list.map((item,index)=>{
        if(item.options.dynamic) {
          this.searchList(item.options).then(res=>{
            this.options[index] = res
          })
        }
      })
    },
    getPopupContainer(triggerNode) {
      return triggerNode.parentNode
    },
    open() {
      // console.log(this.pointInfo)
      this.form = this.pointInfo;
      const temp = JSON.parse(JSON.stringify(this.pointInfo))
      if (temp.depth) {
        this.pointMessParam.depth = temp.depth
      }
      if (this.form.detectDays) {
        this.pointMessParam.tableData = this.form.rateList || []
      }
      // this.$refs.form.clearValidate();
    },
    handleClick(row) {
      console.log(row);
      if(this.form.detectTypeId && this.form.detectTypeId !== row.id){
        this.$confirm('更改检测类别将清空已选择项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.pointMessParam.tableData.splice(0);
          this.pointMessParam.depth = [{selectedList:[],selectedRowKeys:[]}];
          this.pointMessParam.pickRequire.depth = [{selectedList:[],selectedRowKeys:[]}];
          this.form.detectTypeId = row.id;
          this.form.detectType = row.detectName;
          this.form.type = row.type;

          this.pointMessParam.detectType = row.detectName;
          this.pointMessParam.detectTypeName = row.detectName;
          this.pointMessParam.detectTypeId = row.id;
        }).catch(() => {
          return;
        });
      }
      //2020年12月2日 首次添加或编辑后选择同ID,进行清空操作
      else{
        this.pointMessParam.tableData.splice(0);
        this.pointMessParam.pickRequire.depth = [{selectedList:[],selectedRowKeys:[]}];
        this.form.detectTypeId = row.id;
        this.form.detectType = row.detectName;
        this.form.type = row.type;

        this.pointMessParam.detectType = row.detectName;
        this.pointMessParam.detectTypeName = row.detectName;
        this.pointMessParam.detectTypeId = row.id;
      }
    },
    searchList(option) {
      return new Promise(resolve => {
        let arr = []
        request({
          url: option.dynamicGetUrl,
          method: 'get'
        }).then(res=>{
          res.data.map(item=>{
            arr.push({
              value:item.dictCode,
              label:item.dictLabel
            })
          })
          resolve(arr)
        })
      })

    },
    depth(val) {
      console.log(val)
      this.pointMessParam.tableData = val[0].selectedList;
      this.pointMessParam.depth = val;
      this.pointMessParam.pickRequire.depth = val;

    },
    close() {
      this.$refs.form.resetFields();
      this.$emit("update:showProModal", false);
    },
    beforeClose() {
      this.pointMessParam.tableData = []
    },
    deleteRow(index, rows,record) {
      rows.splice(index, 1);
      this.pointMessParam.depth[0].selectedRowKeys = this.pointMessParam.tableData.map(item => item.id);
    },
    edit() {
      this.addShow = true;

      this.editDepth.depth = this.pointMessParam.pickRequire.depth

    },
    handleSave() {
      console.log(11111)
      this.$refs['form'].validate((valid) => {
        if (valid) {
           if (!this.pointMessParam.tableData.length) {
            this.$message.error('请填写完整的频次信息!')
            return
          }
          let target = JSON.parse(JSON.stringify(this.form));
          target.detectType = target.detectType;
          target.detectTypeName = this.form.detectType;
          target.detectTypeId = this.form.detectTypeId;
          let depth = [{
          	selectedRowKeys: this.pointMessParam.depth[0].selectedRowKeys,
			  selectedList:  this.pointMessParam.depth[0].selectedList
          }];
          this.$set(target, 'rateList', this.pointMessParam.tableData)
          this.$set(target, 'selectedRowKeys', this.pointMessParam.depth[0].selectedRowKeys);
          this.$set(target, 'selectedList', this.pointMessParam.depth[0].selectedList);
          this.$set(target, 'depth', depth);
          this.$emit("saveInfo", target, true);
          this.$refs.form.resetFields();
          this.$emit("update:showProModal", false);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    loadDataSource(item) {
      //加载数据源
      if(item.options && item.options.dynamic){
        //远程
        if(this.cacheDynamicDataSource[item.dynamicGetUrl]){
          //缓存
          this.$set(this.dynamicDataSource, item.key, this.cacheDynamicDataSource[item.dynamicGetUrl]);
        }else{
          //远程拉取
          getDynamicData(item.dynamicGetUrl).then(response => {
            let dataSource = [];
            response.data.forEach((row, key) => {
              dataSource.push({
                key : row[item.dynamicGetKey],
                value : row[item.dynamicGetValue]
              })
            });
            this.$set(this.dynamicDataSource, item.key, dataSource);
            this.$set(this.cacheDynamicDataSource, item.dynamicGetUrl, dataSource);
          });
        }
      }else if(item.options && item.options.options){
        //本地
        let dataSource = [];
        if(item.key === 'schemeType'){
          let that = this;
          this.tabConfig.forEach((row, key) => {
            dataSource.push({
              value : parseInt(row.id),
              label : row.configName
            });
            item.options.options = dataSource;
            item.options.defaultValue = parseInt(that.activeIndex);
            dataSource = [];
            dataSource.push({
              key : parseInt(row.id),
              value : row.configName
            });
          })
        }else{
          item.options.options.forEach((row, key) => {
            dataSource.push({
              key : row.value,
              value : row.label
            });
          });
        }
        this.$set(this.dynamicDataSource, item.key, dataSource);
      }
    },
  }
}
</script>
<style lang="less" scoped>
.btnGroup {
  line-height:50px;
  width:100%;
  text-align: right;
}
/deep/ .customCol {
  div:not(:last-child) {
    border-bottom:1px solid rgb(203,203,203)
  }
}
/deep/ .daysTable {
  tr>td {
    min-width: 60px;
    max-width: 60px;
  }
}
</style>

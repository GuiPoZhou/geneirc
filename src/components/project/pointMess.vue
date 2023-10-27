<template>
  <el-dialog title="增加点位信息" :visible.sync="showPointModal" append-to-body width="800px"
    center :show-close="true" :close-on-press-escape="false" :close-on-click-modal="false" @open="open" @close="beforeClose">
    <el-form ref="form" :model="form" label-width="100px" inline :rules="rules">
      <el-form-item label="检测类别">
        <el-input v-model="pointMessParam.detectTypeShow" style="width:200px" disabled></el-input>
      </el-form-item>
<!--      <el-form-item label="采样要求">-->
<!--         <el-select v-model="pointMessParam.pickRequire" disabled>-->
<!--           <el-option-->
<!--             v-for="item in pointMessParam.pickRequireOptions"-->
<!--             :label="item.label"-->
<!--             :value="item.value"-->
<!--             :key="item.value">-->
<!--           </el-option>-->
<!--         </el-select>-->
<!--      </el-form-item>-->
      <el-form-item :label="item.label" v-for="(item, index) in filterList" :key="index" :prop="item.model">
        <el-input v-if="item.type==='input'" v-model="form[item.model]" style="width:200px" :disabled="extendedProperties.formShowType === 1" :maxlength="item.model === 'detectDays' ? 2 : 100"></el-input>
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
      <el-form-item label="检测频次">
        <el-input v-model.number="days" style="width:200px" :disabled="extendedProperties.formShowType === 1"></el-input>
        <el-button type="primary" @click="addFrequency" :disabled="extendedProperties.formShowType === 1">批量添加频次</el-button>
      </el-form-item>
    </el-form>
    <div>
      <a-table :columns="columns" :data-source="dayList" :scroll="{ x: true}" size="small" :pagination="false" v-if="form.detectDays" rowKey="key" class="daysTable">
         <template
          v-for="col in tempArr"
          :slot="col"
          slot-scope="text, record, index"
        >
          <div :key="col">
            <a-input
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.key, col)"
              :disabled="extendedProperties.formShowType === 1"
            />
          </div>
        </template>
      </a-table>
    </div>
    <el-button
      type="primary"
      size="mini"
      @click="confirm"
      style="width:100%"
      v-if="!makesure"
      :disabled="extendedProperties.formShowType === 1"
      >确认频次
    </el-button>
    <section v-else>
      <div class="btnGroup">
        <el-button type="primary" size="small" @click="edit()" :disabled="extendedProperties.formShowType === 1">批量添加</el-button>
        <el-button type="primary" size="small" @click="confirm" :disabled="extendedProperties.formShowType === 1">调整频次</el-button>
      </div>
      <a-table :columns="getPointColumns" :data-source="tableData" :scroll="{ y: 250}" size="small" :pagination="false" bordered rowKey="key"
        :row-selection="{ selectedRowKeys: selectedKeys, onChange: onSelectChange}"
      >
        <template
          slot="operation"
          slot-scope="text, record, index"
          v-if="extendedProperties.formShowType === 0"
        >
          <a href="javascript:;" @click="edit([record.key],index)" style="margin-right:10px">编辑</a>
          <a href="javascript:;" @click="deleteRow(index,tableData,record)" style="margin-right:10px;color: #40a9ff;">清除</a>
          <a href="javascript:;" @click="copy(record,index)">复制</a>
        </template>
      </a-table>
    </section>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSave" v-if="extendedProperties.formShowType === 0">保存</el-button>
      <el-button @click="close">取消</el-button>
    </div>
    <addProject :addShow.sync="addShow" :activePoint="activePoint" @depth="depth" :editDepth="editDepth" :detectTypeId="pointMessParam.detectTypeId"/>
  </el-dialog>
</template>
<script>
import addProject from './addProject'
import { mapGetters } from 'vuex'
export default {
  components:{addProject},
  data() {
    const pointColumns = [{
      title: '第N天',
      dataIndex: 'whatDay',
      width:80,
      flag:0,
      align:'center',
    },{
      title: '第N次',
      width:80,
      flag:0,
      dataIndex: 'whatSecond',
      align:'center',
    },{
      title: '深度',
      width:50,
      flag:1,
      dataIndex: 'depth',
      align:'center',
      customRender: (text, row, index) => {
        if (text) {
          const temp = <div class="customCol">
            {text.map(item=>{
              return <div>{item.deep}</div>}
            )}
          </div>
          return temp
        }
      },
      customCell:() => {
        return {
          style:{
            padding:0
          }
        }
      }
    },{
      title: '检测项目',
      dataIndex: 'selectedList',
      align:'center',
      flag:0,
      customRender: (text, row, index) => {
        if (row.depth) {
          let str = ''
          row.depth.map(item=>{
            str += '<div>'
            if (item.selectedList) {
              item?.selectedList.map(item1 =>{
                str += item1.itemNameCn + ','
              })
            }
            str += '</div>'
          })
          return <div class="customCol" domPropsInnerHTML={str}></div>
        }
      },
      customCell:() => {
        return {
          style:{
            padding:0
          }
        }
      }
    },{
      title: '操作',
      flag:0,
      dataIndex: 'operation',
      width:130,
      align:'center',
      scopedSlots: { customRender: 'operation' },
    }]

    return {
      form:{},
      makesure:false,
      tableData: [],
      addShow:false,
      days:1,
      pointColumns,
      dayList:[],
      activePoint:[],
      selectedKeys:[],
      editDepth:{},
      options:[],
    }
  },
  props:{
    showPointModal: {
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
  computed:{
    rules() {
      let temp = {};
      this.list.map(item => {
        if (item.rules && item.rules.length > 0) {
          temp[item.model] = item.rules[0]
        }
      })
      return temp
    },
    filterList() {
      return this.list.filter(item=>item.model !== 'detectItem')
    },
    columns() {
      let arr = [];
      for(let i =0;i < this.form.detectDays;i++) {
        arr.push({
          title:`第${i + 1}天`,
          dataIndex:i,
          width:100,
          key:i,
          scopedSlots: { customRender: i },
        })
      }
      return arr
    },
    tempArr() {
      let arr = [];
      for(let i =0;i < this.form.detectDays;i++) {
        arr.push(i)
      }
      return arr
    },
    getPointColumns() {
      // console.log(this.detectType)
      return this.detectType === 1 ? this.pointColumns : this.pointColumns.filter(item=>item.flag === 0)
    },
    ...mapGetters([
      'detectType',
    ])

  },
  methods:{
    open() {
      this.form = this.pointInfo;
      if (this.form.detectDays) {
        this.addFrequency()
        this.makesure = true;
        this.tableData = this.form.rateList || []
      }
      this.selectedKeys = [];
      // this.$refs.form.clearValidate();
    },
    getPopupContainer(triggerNode) {
      return triggerNode.parentNode
    },
    depth(val) {
      // console.log(val)
      this.activePoint.map((item,index)=>{
        console.log(item,index)
        this.tableData.map(item1=>{
          console.log(item1.key)
          if (item1.key === item) {
           item1.depth = JSON.parse(JSON.stringify(val));
          }
        })
      })
    },
    confirm() {
      this.makesure = true;
      this.tableData = [];
      // this.addFrequency();
      for(var i in this.dayList[0]) {
        if (i !== 'key') {
          // console.log(this.dayList[0][i],i)
          for(var j=0;j< Number(this.dayList[0][i]);j++) {
            this.tableData.push({
              whatDay:Number(i)+1,
              whatSecond:j+1,
              key:Math.random().toString(36).substring(2)
            })
          }
        }
      }
    },
    onSelectChange(selectedRowKeys) {
       this.selectedKeys = selectedRowKeys;
    },
    close() {
      this.$refs.form.resetFields();
      this.$refs.form.clearValidate()
      this.dayList = [];
      this.days = 1;
      this.$emit("update:showPointModal", false);
    },
    beforeClose() {
      this.tableData = []
      this.$refs.form.clearValidate()
      this.makesure = false;
    },
    copy(row,index) {
      if (this.selectedKeys.length !== 1) {
        this.$message.error('最多选一个')
      } else {
        if (this.selectedKeys[0] === row.key) {
          this.$message.error('不能复制自己')
        } else {
          this.tableData.map(item=>{
            if (item.key === this.selectedKeys[0]) {
              // this.tableData[index].depth = item.depth
			  let tempVal = JSON.parse(JSON.stringify(item.depth));
              this.$set(this.tableData[index],'depth', tempVal);
            }
          })
        }
      }
      // console.log(row)
    },
    deleteRow(index, rows, record) {
      const selectedKeys = [...this.selectedKeys];
      // rows.splice(index, 1);
		console.log(index, rows, record);
      this.selectedKeys = selectedKeys.filter((item,index1) => record.key !== item);
      if(rows[index].depth){
		  rows[index].depth.forEach((item) => {
			  item.selectedList = [];
			  item.selectedRowKeys = [];
		  });
	  }
      if(this.tableData[index].depth){
		  this.tableData[index].depth.forEach((item) => {
			  item.selectedList = [];
			  item.selectedRowKeys = [];
		  });
	  }
      // const tableData = JSON.parse(JSON.stringify(this.tableData));
      // //一顿操作
      // if (tableData.every(item=> item.whatDay !== record.whatDay)) {
      //   tableData.map(item=>{
      //     if (item.whatDay > record.whatDay) {
      //       item.whatDay -= 1
      //     }
      //   })
      // } else {
      //   tableData.map(item=>{
      //     if (item.whatDay === record.whatDay) {
      //       if (item.whatSecond > record.whatSecond) {
      //         item.whatSecond -= 1
      //       }
      //     }
      //   })
      // }
      // this.tableData = tableData
      console.log(this.tableData[index], rows, record);
    },
    edit(key = this.selectedKeys,index) {
      if (index === undefined) {
        if (this.selectedKeys.length < 1) {
          this.$message.error('至少选一个')
          return false
        }
      }
      // console.log(key,index,11)
      this.addShow = true;
      this.activePoint = key;
      this.editDepth = index !== undefined ? this.tableData[index] : {}

    },
    addFrequency() {
      let obj = {};
      if(this.form.detectDays === '' || this.days === ''){
		  this.$message.error('请填写检测天数和检测频次信息!');
		  return;
	  }
      for(let i =0;i < this.form.detectDays;i++) {
        obj[i] = this.days;
        obj['key'] = i;
      }
      this.dayList = [];
      this.dayList.push(obj)
    },
    handleChange(value, key, column) {
      const newData = [...this.dayList];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.dayList = newData;
      }
    },
    handleSave() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let temp = []
          if (!this.tableData.length || this.tableData.some(item => !item.depth)) {
            this.$message.error('请填写完整的频次信息!')
            return
          }
          // this.tableData.map(item=>{
          //   item.depth.map(item1=>{
          //     if (item1.deep && item1.selectedList) {
          //       temp.push(1)
          //     } else {
          //       temp.push(0)
          //     }
          //   })
          //
          // })
          // console.log(temp)
          // if (temp.includes(0)) {
          //   this.$message.error('请填写完整')
          //   return
          // }
          let target = JSON.parse(JSON.stringify( this.form));
          this.$set(target, 'rateList', this.tableData)
          this.$emit("savePointInfo", target, true);
          this.$refs.form.resetFields();
          this.$emit("update:showPointModal", false);
          this.dayList = [];
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
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

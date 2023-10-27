<template>
  <div style="flex:1">
    <div class="selected" style="text-align:center">
      <span >{{`已选择分包项目(共${selectedList.length}个)`}}</span>
    </div>
    <a-table :columns="listColumns" :data-source="selectedList"  size="small" :pagination="false" :scroll={y:200} rowKey="dataIndex">
      <template slot="operation" slot-scope="text, record,index" v-if="extendedProperties.formShowType === 0">
        <a href="javascript:;" @click="deletePro(record,index)"  style="color: #40a9ff;">删除</a>
      </template>
    </a-table>
    <section class="subProject">
      <a-form-model layout="inline" :form="form" >
        <span class="subTitle">待分包项目</span>
        <a-form-model-item label="项目名称：" style="margin-right:20px;">
          <a-input v-model="form.itemName" @keyup.enter.native="searchPro" :disabled="extendedProperties.formShowType === 1"/>
        </a-form-model-item>
        <a-form-model-item label="方法编号：">
          <a-input v-model="form.itemCode" @keyup.enter.native="searchPro" :disabled="extendedProperties.formShowType === 1"/>
        </a-form-model-item>
      </a-form-model>
      <a-table
        :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps:getCheckboxProps}"
        :columns="listColumns.filter(item=>item.dataIndex !== 'operation')"
        :data-source="searchList"
        size="small"
        :pagination="false"
        rowKey="id"
        :scroll={y:400}
      />
    </section>
  </div>
</template>
<script>
import {getEntrustWaitList ,getItemWaitList} from '@/api/subcontract'
const listColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    width:50,
    align:'center',
    customRender:(text,record,index)=>`${index+1}`,
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '检测类别',
    dataIndex: 'detectTypeName',
    align:'center',
    scopedSlots: { customRender: 'detectTypeName' },
  },
  {
    title: '项目名称',
    dataIndex: 'itemName',
    align:'center',
    scopedSlots: { customRender: 'itemNameCn' },
  },{
    title: '方法编码',
    dataIndex: 'itemCode',
    align:'center',
    scopedSlots: { customRender: 'itemCode' },
  },{
    title: '子法名称',
    dataIndex: 'subname',
    align:'center',
    scopedSlots: { customRender: 'childMethodName' },
  },{
    title: '基质',
    dataIndex: 'stroma',
    align:'center',
    scopedSlots: { customRender: 'stroma' },
  },{
    title: '委托协议编码',
    dataIndex: 'entrustCode',
    align:'center',
    scopedSlots: { customRender: 'entrustCode' },
  },{
    title: '操作',
    dataIndex: 'operation',
    align:'center',
    scopedSlots: { customRender: 'operation' },
  },
]
export default {
  data() {
    return {
      searchList:[],
      selectedList:[],
      listColumns,
      form:{},
      selectedRowKeys: [],
      params:{},
    }
  },
  props:{
    agreementMeans:{
      type:Number, //1按委托 2按项目
    },
    entrustIds:'',//委托协议ID
    subcontractorId:'',//分包商ID
    extendedProperties:{},
    envDetectInfoPick:[]
  },
  mounted() {
    this.$EventBus.$on('selectedSubcontractor',(v1, v2, v3)=>{
		console.log('selectedSubcontractor', this.$parent.$parent.$parent.$parent);
    	if(this.$parent.dynamicData.disabled2 && this.$parent.$parent.$parent.$parent.activeKey === '1'){
			this.$message.error('请先选择分包商!');
			this.$parent.$parent.$parent.$parent.activeKey = '1';
    		return;
		}else if(!this.$parent.dynamicData.disabled2){
			this.init()
			this.refill()
		}
    })
  },
  beforeDestroy() {
    this.$EventBus.$off('selectedSubcontractor')
  },
  methods:{
    init(search = false) {
      console.log(search)
      let params = {};
      params['agreementMeans'] = this.extendedProperties.agreementMeans;
      params['subcontractorId'] = this.extendedProperties.subcontractorId;
      params = Object.assign(params,this.form)
		console.log('params', params);
      if (this.extendedProperties.agreementMeans === '1') {
        if(this.extendedProperties.entrustIds !== ''){
          //按委托从[分包委托]至[分包协议后],因为列表不在存有委托编号,所以从在[分包协议]中的项目中筛选委托编号到此查询,如无项目列表,则本条数据无项目来源,为废数据,在此不在查询项目列表
          getEntrustWaitList(params, this.extendedProperties.entrustIds).then(res=>{
            this.searchList = res.data
            if(this.extendedProperties.selectedList && this.extendedProperties.selectedList.length > 0) { //编辑
              this.filterList()
            }
          })
        }
      } else {
        params['entrustPackageIds'] = this.extendedProperties.entrustIds;
        getItemWaitList(params).then(res=>{
          this.searchList = res.data
          if(this.extendedProperties.selectedList && this.extendedProperties.selectedList.length > 0) { //编辑
            this.filterList()
          }
        })
      }
    },
    getCheckboxProps(record ) {
      return {
        props: {
          disabled: this.extendedProperties.formShowType === 1,
        },
      }
    },
    filterList() {
      console.log('filterList');
      console.log(...this.extendedProperties.selectedList)
      this.searchList.unshift(...this.extendedProperties.selectedList)
      const temp = JSON.parse(JSON.stringify(this.searchList))
      let map = new Map();
      for (let item of temp) {
        if (!map.has(item.id)) {
          map.set(item.id, item);
        }
      }
      this.searchList = [...map.values()];
      if(this.extendedProperties.formShowType === 1){
		  this.searchList = this.searchList.filter(item => this.selectedRowKeys.includes(item.id));
	  }
    },
    refill() {
      if (this.extendedProperties.selectedList && this.extendedProperties.selectedList.length > 0) {
        this.selectedList = JSON.parse(JSON.stringify(this.extendedProperties?.selectedList))
        this.selectedRowKeys = JSON.parse(JSON.stringify(this.extendedProperties?.selectedRowKeys))
      }
    },
    deletePro(record,index) {
      const selectedList = [...this.selectedList];
      const selectedRowKeys = [...this.selectedRowKeys];
      this.selectedList = selectedList.filter(item => item.id !== record.id);
      this.selectedRowKeys = selectedRowKeys.filter(item => item !== record.id);
    },
    searchPro() {
      this.init(true)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedList.splice(0, this.selectedList.length, ...JSON.parse(JSON.stringify(selectedRows)));
      this.extendedProperties['selectedList'] = this.selectedList;
      this.extendedProperties['selectedRowKeys'] = selectedRowKeys;
      this.selectedRowKeys = selectedRowKeys;
    },
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-form {
  display:flex;
  align-items: center;
  .ant-form-item {
    margin-bottom:0;
  }
}
.subTitle {
  margin-right:20px;
  font-size:18px;
  font-weight: bold;
}
.subProject {
  max-width:100%!important;
}
/deep/ .ant-table-header {
  margin-bottom:0!important;
  min-width: 100%!important;
  overflow: hidden!important;
}
/deep/ .ant-form-inline {
  height:50px;
}
/deep/ .ant-form-item-label {
  padding:0;
}
/deep/ .ant-form-item {
  padding-bottom:0!important;
  display: flex;
  align-items: center;
}
.selected {
  span {
    line-height:46px;
    font-size:16px;
  }
}
</style>

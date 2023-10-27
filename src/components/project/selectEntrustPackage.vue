<template>
  <div style="flex:1">
    <div class="selected" style="text-align:right">
      <div class="otherGroups">
        <a-button type="primary" size="small" @click="savePackage" :disabled="extendedProperties.formShowType === 1">添加分包信息</a-button>
        <a-button type="primary" size="small" @click="deletePackage" :disabled="extendedProperties.formShowType === 1">删除分包信息</a-button>
      </div>
    </div>
    <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps:getCheckboxProps }" :columns="listColumns" rowKey="key"
             :data-source="entrustPackageSelectedList" size="small" :pagination="false">
    </a-table>

    <a-modal v-model="visible" title="添加分包" @ok="handleOk" :maskClosable="false" width="850px">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
        <el-form-item :label="item.label" :prop="item.key" v-for="item in queryCriteria">
              <el-input
                v-model="queryParams[item.key]"
                :placeholder="item.label"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
                class="input-with-select">
              </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <a-table :row-selection="{ selectedRowKeys: subSelectedRowKeys, onChange: onSubSelectChange }" :columns="selectListColumns" rowKey="key"
               :data-source="distinctSelectListQuery" size="small" :pagination="false">
      </a-table>
    </a-modal>
  </div>
</template>

<script>
  export default {
    name: 'selectEntrustPackage',
    props: {
      //选中的项目
      entrustPackageSelectedList: {
        type: Array,
        default: () => ([])
      },
      //协议下所有项目
      envDetectInfoPick: {
        type: Array,
        default: () => ([])
      },
      //扩展属性
      extendedProperties:{
        type: Object,
        default: () => ({})
      }

    },
    watch: {
      visible(val) {
        if(val){
          console.log('selectEntrustPackage.planType', this.extendedProperties.planType);
          let distinctSelectList = [];
          if(this.extendedProperties.planType === 1){
            //采样过滤
            this.envDetectInfoPick.forEach((infoPick) => {
              infoPick.pickRequire.forEach((pickRequire) => {
                pickRequire.detectPoint.forEach((detectPoint)=>{
                  detectPoint.rateList.forEach((rate) =>{
                    rate.depth.forEach((depth) => {
                      depth.selectedList.forEach((select) => {
                        const copySelect = JSON.parse(JSON.stringify(select));
                        copySelect['detectTypeName'] = pickRequire.detectName;
                        copySelect['detectTypeId'] = pickRequire.detectType;
                        copySelect['key'] = select.id.toString() + select.customerAppoint.toString();
                        distinctSelectList.push(copySelect);
                      })
                    })
                  })
                })
              })
            });
          }else{
            this.listColumns.splice(6, 1);
            this.selectListColumns.splice(6, 1);
            this.envDetectInfoPick.forEach((infoPick) => {
              console.log('infoPick', infoPick);
              infoPick.pickRequire.forEach((pickRequire) => {
                pickRequire.depth.forEach((depth) => {
                  depth.selectedList.forEach((select) => {
                    const copySelect = JSON.parse(JSON.stringify(select));
                    copySelect['detectTypeName'] = pickRequire.detectTypeName;
                    copySelect['detectTypeId'] = pickRequire.detectTypeId;
                    copySelect['key'] = select.id.toString() + select.customerAppoint.toString();
                    distinctSelectList.push(copySelect);
                  })
                })
              })
            });
          }
          const res = new Map();
          distinctSelectList = distinctSelectList.filter((a) => !res.has((a.id + a.detectTypeName + a.customerAppoint)) && res.set((a.id + a.detectTypeName + a.customerAppoint), 1));
          this.entrustPackageSelectedList.filter((a) => this.subSelectedRowKeys.push(a.key));
          this.distinctSelectList = distinctSelectList;
          this.distinctSelectListQuery = distinctSelectList;
        }
      }
    },
    data() {
      return {
        visible: false,
        distinctSelectList:[],
        distinctSelectListQuery:[],
        queryParams: {
          detectName: "",
          detectType: "",
          itemName: "",
          itemCode: "",
        },
        queryCriteria:[{
          label: "检测类别",
          key: "detectType",
        },{
          label: "项目名称",
          key: "itemName",
        },{
          label: "方法编号",
          key: "itemCode",
        }],
        listColumns: [
          {
            title: '序号',
            width: 50,
            dataIndex: 'index',
            sign: false,
            customRender: (text, record, index) => `${index + 1}`,
            scopedSlots: { customRender: 'index' }
          },
          {
            title: '检测类别',
            dataIndex: 'detectTypeName',
            sign: true,
            scopedSlots: { customRender: 'detectTypeName' }
          }, {
            title: '项目名称',
            dataIndex: 'itemNameCn',
            sign: true,
            scopedSlots: { customRender: 'itemNameCn' }
          }, {
            title: '方法编码',
            dataIndex: 'methodCode',
            sign: true,
            scopedSlots: { customRender: 'methodCode' }
          }, {
            title: '子法名称',
            dataIndex: 'childMethodName',
            sign: true,
            scopedSlots: { customRender: 'childMethodName' }
          }, {
            title: '基质',
            dataIndex: 'stroma',
            sign: true,
            scopedSlots: { customRender: 'stroma' },
          }, {
            title: '现场检测',
            dataIndex: 'isScene',
            sign: true,
            scopedSlots: { customRender: 'isScene' },
            customRender: (text) => text ? '是' : '否'
          }, {
            title: '客户指定',
            dataIndex: 'customerAppoint',
            sign: true,
            scopedSlots: { customRender: 'isScene' },
            customRender: (text) => text ? '是' : '否'
          }
        ],
        selectListColumns: [
          {
            title: '序号',
            width: 50,
            dataIndex: 'index',
            sign: false,
            customRender: (text, record, index) => `${index + 1}`,
            scopedSlots: { customRender: 'index' }
          },
          {
            title: '检测类别',
            dataIndex: 'detectTypeName',
            sign: true,
            scopedSlots: { customRender: 'detectTypeName' }
          }, {
            title: '项目名称',
            dataIndex: 'itemNameCn',
            sign: true,
            scopedSlots: { customRender: 'itemNameCn' }
          }, {
            title: '方法编码',
            dataIndex: 'methodCode',
            sign: true,
            scopedSlots: { customRender: 'methodCode' }
          }, {
            title: '子法名称',
            dataIndex: 'childMethodName',
            sign: true,
            scopedSlots: { customRender: 'childMethodName' }
          }, {
            title: '基质',
            dataIndex: 'stroma',
            sign: true,
            scopedSlots: { customRender: 'stroma' },
          }, {
            title: '现场检测',
            dataIndex: 'isScene',
            sign: true,
            scopedSlots: { customRender: 'isScene' },
            customRender: (text) => text ? '是' : '否'
          }, {
            title: '客户指定',
            dataIndex: 'customerAppoint',
            sign: true,
            scopedSlots: { customRender: 'isScene' },
            customRender: (text) => text ? '是' : '否'
          }
        ],
        selectedRowKeys: [],
        subSelectedRowKeys: []
      }
    },
    methods: {
      savePackage() {
        console.log('savePackage');
        this.visible = true;
      },
      deletePackage() {
        if(this.selectedRowKeys.length < 1){
          this.$message.warning('先选择要删除的分包信息!');
          return false;
        }
        let tempDistinctSelectList = JSON.parse(JSON.stringify(this.entrustPackageSelectedList));
        tempDistinctSelectList = tempDistinctSelectList.filter((a) => !this.selectedRowKeys.includes(a.key));
        this.subSelectedRowKeys = this.subSelectedRowKeys.filter((a) => !this.selectedRowKeys.includes(a));
        this.$emit('getEntrustPackageSelectedList', tempDistinctSelectList);
        this.selectedRowKeys.splice(0);
      },
      onSelectChange(selectedRowKeys) {
        console.log('onSelectChange', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys
      },
      onSubSelectChange(selectedRowKeys) {
        this.subSelectedRowKeys = selectedRowKeys
      },
      handleQuery() {
        //带查询条件
        this.distinctSelectList = this.distinctSelectList.filter((a) => this.queryParams.detectType ? a.detectTypeName.includes(this.queryParams.detectType) : true);
        this.distinctSelectList = this.distinctSelectList.filter((a) => this.queryParams.detectType ? a.itemNameCn.includes(this.queryParams.itemName) : true);
        this.distinctSelectList = this.distinctSelectList.filter((a) => this.queryParams.detectType ? a.itemCode.includes(this.queryParams.itemCode) : true);
      },
      handleOk() {
        let tempDistinctSelectList = JSON.parse(JSON.stringify(this.distinctSelectListQuery));
        tempDistinctSelectList = tempDistinctSelectList.filter((a) => this.subSelectedRowKeys.includes(a.key));
        this.$emit('getEntrustPackageSelectedList', tempDistinctSelectList);
        this.visible = false;
        this.selectedRowKeys.splice(0);
      },
      handleQuery() {
        let distinctSelectList = JSON.parse(JSON.stringify(this.distinctSelectList));
        distinctSelectList = distinctSelectList.filter((a) => this.queryParams.detectType ? a.detectTypeName.includes(this.queryParams.detectType) : true);
        distinctSelectList = distinctSelectList.filter((a) => this.queryParams.itemName ? a.itemNameCn.includes(this.queryParams.itemName) : true);
        distinctSelectList = distinctSelectList.filter((a) => this.queryParams.itemCode ? a.methodCode.includes(this.queryParams.itemCode) : true);
        this.distinctSelectListQuery = distinctSelectList;
      },
      resetQuery() {
        console.log('resetQuery');
        this.resetForm("queryForm");
        this.distinctSelectListQuery = JSON.parse(JSON.stringify(this.distinctSelectList));
      },
      getCheckboxProps(record ) {
        return {
          props: {
            disabled: this.extendedProperties.formShowType === 1,
          },
        }
      }
    }
  }
</script>

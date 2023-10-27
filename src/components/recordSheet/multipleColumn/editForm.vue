<template>
  <el-dialog :title="'检测信息'" :visible.sync="multipleEditFormShow"
             class="elDialog" width="70%" append-to-body :destroy-on-close="true" :close-on-click-modal="false" :before-close="beforeClose" @open="openEvent">
    <el-form ref="multipleEditForm" size="small" label-width="220px" v-if="multipleEditFormShow">
      <el-row>
        <el-col :span="22" v-if="item.type === 'date'">
          <el-form-item :label="item.label" prop="editValue">
            <el-date-picker v-model="editValue" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" :placeholder="'请输入' + item.label" />
          </el-form-item>
        </el-col>
        <el-col :span="22" v-if="item.type === 'input'">
          <el-form-item :label="item.label" prop="editValue">
            <el-input v-model="editValue" :placeholder="'请输入' + item.label" />
          </el-form-item>
        </el-col>
        <el-col :span="22" v-if="item.type === 'select'">
          <el-form-item :label="item.label" prop="editValue">
            <el-select v-model="editValue" placeholder="请选择">
              <el-option :key="selectItem.dictValue" :label="selectItem.dictValue" :value="selectItem.dictValue" v-for="selectItem in item.options"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="22" v-if="item.type === 'number'">
          <el-form-item :label="item.label" prop="editValue">
            <el-input-number controls-position="right" :precision="2" :min="0" v-model="editValue" :placeholder="'请输入' + item.label" />
          </el-form-item>
        </el-col>
        <el-col :span="22" v-if="item.type === 'time'">
          <el-form-item :label="item.label" prop="editValue">
            <el-time-picker v-model="editValue" value-format="HH:mm" format="HH:mm" :placeholder="'请输入' + item.label"/>
          </el-form-item>
        </el-col>
        <el-col :span="22" v-if="item.type === 'textarea'">
          <el-form-item :label="item.label" prop="editValue">
            <el-input type="textarea" v-model="editValue" :placeholder="'请输入' + item.label" :rows="2"/>
          </el-form-item>
        </el-col>
        <el-col :span="22" v-if="item.type === 'unitSearch'">
          <el-form-item  :label="item.label" prop="editValue">
            <el-input v-model="editValue" placeholder="请选择结果单位" :readOnly="true">
              <el-button slot="append" icon="el-icon-search" @click="getUnit" />
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" >确 定</el-button>
      <el-button @click="cancelSaveForm">取 消</el-button>
    </div>
    <selectUnit :visible.sync="selectUnitShow"
                @backfill="changeUnit"/>
  </el-dialog>
</template>

<script>
  import selectUnit from "@/components/common/selectUnit";
	export default {
		name: 'multipleEditForm',
		components: {selectUnit},
		data() {
			return {
			  editValue: null,
			  editValueExt: null,
        // 单位选择显示
        selectUnitShow: false,
        // 单位选择内容
        selectUnitData: {},
        selectUnitId: "",
        selectUnitColumn: "",
        selectRow: null,
			}
		},
		props: {
      item: {
        type: Object,
        default: {},
      },
      dataList: {
        type: Array,
        default: () => [],
      },
      multipleEditFormShow: {
        type: Boolean,
        default: false
      }
		},
		mounted() {
		},
		methods: {
      beforeClose(){

      },
      openEvent(){
        let lastValue = this.dataList[0][this.item.key];
        console.log('lastValue', lastValue);
        let diff = false;
        this.dataList.forEach(async row => {
          console.log('row[this.item.key]', row[this.item.key]);
          if(lastValue !== row[this.item.key]){
            diff = true;
          }
        })
        if(!diff){
          this.$set(this, 'editValue', lastValue);
        }
      },
      submitForm(){
        this.dataList.forEach(row => {
          this.$set(row, this.item.key, this.editValue);
          if(this.item.type === 'unitSearch'){
            this.$set(row, 'detectResultUnit', this.editValueExt);
          }
        })
        this.$emit('update:multipleEditFormShow', false);
        this.$emit('editSubmitForm', this.dataList);
        this.editValue = null;
        this.editValueExt = null;
      },
      cancelSaveForm(){
        this.$emit('update:multipleEditFormShow', false);
        this.editValue = null;
        this.editValueExt = null;
      },
      // 选择单位
      getUnit() {
        this.selectUnitData = this.saveForm;
        // 结果单位
        this.selectUnitId = "detectUnit";
        this.selectUnitColumn = "detectUnitStr";
        this.selectUnitShow = true;
      },
      // 选择单位回调
      changeUnit(record) {
        this.$set(this, 'editValueExt', record.id);
        this.$set(this, 'editValue', record.unitName);
      },
    }
	}
</script>

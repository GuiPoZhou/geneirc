<template>
  <div class="properties-centent kk-checkbox">
    <div class="head-title">
      表单属性设置
    </div>
    <div class="properties-body">
      <a-form>
        <a-form-item
          v-if="typeof config.layout !== 'undefined'"
          label="表单布局"
        >
          <a-radio-group buttonStyle="solid" v-model="config.layout">
            <a-radio-button value="horizontal">水平</a-radio-button>
            <a-radio-button value="vertical">垂直</a-radio-button>
            <a-radio-button value="inline">行内</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="方案类别">
          <a-radio-group buttonStyle="solid" v-model="config.planType" @change="changeType">
            <a-radio-button :value="1">采样</a-radio-button>
            <a-radio-button :value="2">送样</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="labelCol（水平布局生效）">
          <div class="change-col-box">
            <a-slider
              id="test"
              :max="24"
              :min="0"
              v-model="config.labelCol.span"
              @change="config.wrapperCol.span = 24 - config.labelCol.span"
            />
          </div>
        </a-form-item>
        <a-form-item label="wrapperCol（水平布局生效）">
          <div class="change-col-box">
            <div>
              <label>span:</label>
              <a-input-number v-model="config.wrapperCol.span" />
            </div>
          </div>
        </a-form-item>
        <a-form-item label="预览模态框宽度">
          <a-input-number style="width:100%;" v-model="previewOptions.width" />
        </a-form-item>
        <a-form-item label="表单CSS">
          <a-input v-model="config.customStyle" />
        </a-form-item>
        <a-form-item label="表单属性">
          <kCheckbox
            v-if="typeof config.hideRequiredMark !== 'undefined'"
            v-model="config.hideRequiredMark"
            label="隐藏必选标记"
          />
        </a-form-item>
        <a-form-item label="表Code">
          <a-input v-model="config.tableCode" inputReadOnly/>
        </a-form-item>
        <a-form-item label="业务Code">
          <a-input v-model="config.businessCode" inputReadOnly/>
        </a-form-item>
        <a-form-item label="表单ID">
          <a-input v-model="config.pageId" inputReadOnly/>
        </a-form-item>
        <a-form-item label="提示">
          实际预览效果请点击预览查看
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 * description 表单属性设置面板组件
 */
import kCheckbox from "../../KCheckbox/index.vue";
export default {
  name: "formProperties",
  components: {
    kCheckbox
  },
  props: {
    config: {
      type: Object,
      required: true
    },
    previewOptions: {
      type: Object,
      required: true
    },
    list:{
      type:Array
    },
    allList:{
      type:Array
    }
  },
  mounted() {
    this.filterTable(this.list);
  },
  methods:{
    changeType() {
      // this.list.map(item=>{
      //   if(item.type ==='plan') {
      //     item.list = this.allList
      //   }
      // })
      // this.filterTable()
      this.changeTypeRecursion(this.list);
    },
    changeTypeRecursion(subList) {
      subList.map(item=>{
        if(item.type == 'grid'){
          item.columns.forEach(c => {
            this.changeTypeRecursion(c.list);
          })
        }
        if(item.type == 'card'){
          this.changeTypeRecursion(item.list);
        }
        if(item.type == 'table'){
          item.trs.forEach(tr => {
            tr.tds.forEach(td => {
              this.changeTypeRecursion(td.list);
            })
          })
        }
        if(item.type == 'tabs'){
          item.columns.forEach(c => {
            this.changeTypeRecursion(c.list);
          })
        }
        if(item.type ==='plan') {
          item.list = this.allList
          this.filterTable(this.list);
        }
      })
    },
    filterTable(subList) {
      const type = this.config.planType
      console.log(subList);
      subList.map(item=>{
        if(item.type == 'grid'){
          item.columns.forEach(c => {
            this.filterTable(c.list);
          })
        }
        if(item.type == 'card'){
          this.filterTable(item.list);
        }
        if(item.type == 'table'){
          item.trs.forEach(tr => {
            tr.tds.forEach(td => {
              this.filterTable(td.list);
            })
          })
        }
        if(item.type == 'tabs'){
          item.columns.forEach(c => {
            this.filterTable(c.list);
          })
        }
        if(item.type ==='plan') {
          item.list = item.list.filter(item=>item.planType === type)
        }
      })
      // console.log(list)
      let list = JSON.parse(JSON.stringify(this.list))
      this.$emit('setList',list)
    }
  }
};
</script>
<style lang="less" scoped>
.change-col-box {
  > div {
    padding: 5px;
    display: flex;
    > label {
      text-align: right;
      padding-right: 8px;
      display: block;
      font-size: 16px;
      width: 45px;
    }
  }
}
</style>

<template>
  <a-modal
    title="预览"
    :visible="visible"
    @ok="handleGetData"
    @cancel="handleCancel"
    okText="获取数据"
    cancelText="关闭"
    style="top:20px;"
    :destroyOnClose="true"
    :width="`${previewWidth}px`"
  >
    <k-form-build :value="jsonData" @submit="handleSubmit" ref="KFormBuild" :extendedProperties="extendedProperties"/>
    <jsonModel ref="jsonModel" />
  </a-modal>
</template>
<script>
  /*
   * author kcz
   * date 2019-11-20
   */
  import jsonModel from '../KFormDesign/module/jsonModal'
  import Vue from 'vue'
  import KFormBuild from '../KFormBuild/index'

  Vue.use(KFormBuild);
export default {
  name: "KFormPreview",
  data() {
    return {
      visible: false,
      previewWidth: 850,
      jsonData: {},
      extendedProperties:{
        formShowType: 0,
      },
      funcList:{

      }
    };
  },
  components: {
    jsonModel
  },
  created() {
    console.log('KFormPreview created...');
  },
  watch:{
    record: {
      handler(newValue, oldValue) {
        this.showFormula(newValue);
      },
      deep: true
    }
  },
  methods: {
    handleSubmit(p) {
      p.then(res => {
        console.log(res, "获取数据成功");
        this.$refs.jsonModel.jsonData = res;
        this.$refs.jsonModel.visible = true;
      }).catch(err => {
        console.log(err, "获取数据失败");
      });
    },
    async handleGetData() {
      await this.calculationFormula();
      this.$refs.KFormBuild.getData()
        .then(res => {
          console.log(res, "获取数据成功");
          this.$refs.jsonModel.jsonData = res;
          this.$refs.jsonModel.visible = true;
        })
        .catch(err => {
          console.log(err, "获取数据失败");
        });
    },
    handleCancel() {
      this.visible = false;
    },

    //公式
    async calculationFormula() {
      for (let i = 0; i < this.jsonData.list.length; i++){
        let item = this.jsonData.list[i];
        if (item.type === 'dynamicFormula') {
          let test = await this.processFormData(item);
        }
      }
    },
    async processFormData(item) {
      let evalStr = "";
      let targetField;
      targetField = item.selected.key;
      console.log('processFormData -> item', item);
      await this.$refs.KFormBuild.getDataAsync().then(res => {
        console.log('this.$refs.KFormBuild.getData', res);
        let traverse = async (element, spacer) => {
          if (element.type === "dynamicFormula") {
            evalStr += '(';
            element.list.forEach(item => {
              traverse(item, ' ');
            });
            evalStr += ')';
          } else if (element.type === "brackets") {
            evalStr += '(';
            element.list.forEach(item => {
              traverse(item, ' ');
            });
            evalStr += ')';
          } else if (element.type === "function") {
            evalStr += ' this.' + element.selected.key + '(';
            element.columns.forEach((item, index) => {
              if (index > 0) {
                evalStr += ',';
              }
              //平均数
              if (element.selected.key === 'getAvgValue') {
                item.list.forEach((subItem, sunIndex) => {
                  if (sunIndex > 0) {
                    traverse(subItem, ',');
                  } else {
                    traverse(subItem, '');
                  }
                })
              } else {
                item.list.forEach(subItem => {
                  traverse(subItem, '');
                })
              }
            });
            evalStr += ')';
          } else if (element.type === 'variable') {
            evalStr += spacer + res[element.selected.key];
          } else if (element.type === 'constant') {
            evalStr += spacer + element.value;
          } else if (element.type === 'symbol') {
            evalStr += spacer + element.selected.key;
          } else {
            evalStr += spacer + element.type;
          }
        }
        traverse(item, '');
        let code = `code => {
                    return ` + evalStr + `
                }`;
        let calcResult
        try {
          let fun = new Function(`return ${code}`)();
          calcResult = fun();
          let temp = {};
          temp[targetField] = calcResult;
          console.log('calcResult', calcResult);
          this.$refs.KFormBuild.form.setFieldsValue(temp);
          console.log('this.$refs.KFormBuild.setData', temp);
        } catch (e) {
          console.log(e);
        }
      });
      console.log('processFormData -> targetField', targetField);
    }
  }
};
</script>

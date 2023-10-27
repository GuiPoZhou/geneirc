<template>
  <div>
<!--    <jsCdn cdn="/MathJax.js"/>-->
<!--    <jsCdn cdn="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS-MML_HTMLorMML"/>-->
    <jsCdn cdn="https://cdn.jsdelivr.net/npm/mathjax@2.7.2/MathJax.js?config=TeX-AMS-MML_HTMLorMML"/>
    <vue-mathjax :formula="mathjax"></vue-mathjax>
  </div>
</template>

<script>
  import {VueMathjax} from 'vue-mathjax';
  export default {
    name: 'dynamicFormulaContainer',
    data() {
      return {
        showText: null,
        mathjax: '$x=\\sqrt[3] {\\frac x y}$'
      }
    },
    components: {
      'vue-mathjax': VueMathjax,
      'jsCdn': {
        render(_) {
          return _('script', {
            attrs: {
              type: 'text/javascript',
              src: this.cdn
            }
          })
        },
        props: {
          cdn: {
            type: String,
            required: true
          }
        }
      },
    },
    props: {
      record: {
        type: Object,
        required: true
      },
    },
    created(){
      this.showFormula(this.record);
    },
    watch:{
      record: {
        handler(newValue, oldValue) {
          this.showFormula(newValue);
        },
        deep: true
      }
    },
    methods:{
      showFormula(record){
        let evalStr = "$"+record.selected.label+"=";
        // console.log(record);
        record.list.forEach(item => {
          if (item.type === 'brackets') {
            evalStr += this.processBrackets(item.list);
          } else if (item.type === 'function'){
            evalStr += this.processFunction(item);
          } else if (item.type === 'symbol'){
            evalStr += this.processSymbol(item);
          } else if (item.type === 'variable'){
            evalStr += this.processVariable(item);
          } else if (item.type === 'constant'){
            evalStr += this.processConstant(item);
          }
        })
        evalStr += "$";
        // console.log(evalStr);
        // evalStr = "${{(水分含量X1+水分含量X2)}\\over2}$";
        this.mathjax = evalStr;
      },
      processBrackets(list) {
        let returnStr = "{(";
        list.forEach(item => {
          if (item.type === 'brackets') {
            returnStr += this.processBrackets(item.list);
          } else if (item.type === 'function'){
            returnStr += this.processFunction(item);
          } else if (item.type === 'symbol'){
            returnStr += this.processSymbol(item);
          } else if (item.type === 'variable'){
            returnStr += this.processVariable(item);
          } else if (item.type === 'constant'){
            returnStr += this.processConstant(item);
          }
        })
        returnStr += ")}";
        return returnStr;
      },
      processFunction(item) {
        let returnStr = "";
        let paramList = [];
        item.columns.forEach((item, index) => {
          let paramStr = "";
          item.list.forEach(subItem => {
            if (subItem.type === 'brackets') {
              paramStr += this.processBrackets(subItem.list);
              paramStr = paramStr.replace(/\(/g, "").replace(/\)/g, "");
            } else if (subItem.type === 'function'){
              paramStr += this.processFunction(subItem.columns);
            } else if (subItem.type === 'symbol'){
              paramStr += this.processSymbol(subItem);
            } else if (subItem.type === 'variable'){
              paramStr += this.processVariable(subItem);
            } else if (subItem.type === 'constant'){
              paramStr += this.processConstant(subItem);
            }
          })
          paramList.push(paramStr);
        })
        switch (item.selected.key) {
          case 'getLogValue':
          //对数,两个参数
            returnStr += "log_" + paramList[0];
            if(paramList.length === 2){
              returnStr += " "+paramList[1];
            }
            break;
          case 'getPowValue':
          //幂函数,两个参数
          case 'getRadicalValue':
            //开根,两个参数
            returnStr += "\\sqrt["+paramList[1]+"] {"+paramList[0]+"}";
            break;
          case 'getAvgValue':
            //平均数,N个参数
            paramList.forEach(item => {
              returnStr += "\\overline (" + item + ")";
            })
            break;
          case 'getAbsValue':
            //绝对值,一个参数
            returnStr += "\\vert" + paramList[0] + "\\vert";
            break;
          default:
            break;
        }
        returnStr += "";
        return returnStr;
      },
      processSymbol(item) {
        if(item.selected.key === '/'){
          return '\\over';
        }
        return item.selected.key;
      },
      processVariable(item) {
        return item.selected.label;
      },
      processConstant(item) {
        return item.value;
      }
    }
  }
</script>

<style scoped>

</style>

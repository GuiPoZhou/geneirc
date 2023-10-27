<template>
  <div>
    <el-select class="main-select-tree" ref="selectTree" size="mini"  v-model="modelValue" :clearable="true">
      <el-option v-for="item in dataSource" :key="item.value" :label="item.label" :value="item.value" style="display: none;" />
      <el-tree class="main-select-el-tree" ref="selecteltree"
               :data="getData"
               node-key="id"
               highlight-current
               :props="defaultProps"
               @node-click="handleNodeClick"
               :current-node-key="modelValue"
               :expand-on-click-node="expandOnClickNode"
               default-expand-all />
    </el-select>
  </div>
</template>

<script>
    export default {
        computed: {
            getData() {
              console.log('selectTree', this.dataSource, this.config);
              let result = this.parseData(this.dataSource, '0');
              console.log('selectTree', result);
              return result;
            },
            modelValue: {
                get() {
                    return this.value;
                },
                set(newValue) {
                    this.$emit('input', newValue);
                },
            },
        },
        model: {
            prop: 'value',
            event: 'input',
        },
        props: {
            dataSource: {
                type: Array,
                default: null
            },
            value: {
                type: [String, Number, Boolean, Object, Array],
                default: null,
            },
            config: {
                type: Object,
                default: null,
            }
        },
        data() {
            return {
                expandOnClickNode: true,
                options:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
            }
        },
        methods: {
            // 四级菜单
            formatData(data){
                let options = [];
                return options;
            },
            parseData(data, parentId = null) {
                const result = [];
                for (const item of data) {
                    if (item.parentId === parentId) {
                        const children = this.parseData(data, item.key);
                        result.push({
                            label: item.label,
                            id: item.value,
                            children: children.length > 0 ? children : null,
                        });
                    }
                }
                return result;
            },
            handleNodeClick(node){
                this.modelValue = node.id;
                this.$refs.selectTree.blur();
            }
        }
    }
</script>
<style>
  .main-select-el-tree .el-tree-node .is-current > .el-tree-node__content{font-weight: bold; color: #409eff;}
  .main-select-el-tree .el-tree-node.is-current > .el-tree-node__content{font-weight: bold; color: #409eff;}
</style>
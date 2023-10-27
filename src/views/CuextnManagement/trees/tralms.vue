<template>
  <div class="a-c-top" style="padding-top: 0">
    <p class="title">区域</p>
    <el-tree
      ref="tree"
      :props="defaultProps"
      @node-click="handleNodeClick"
      :data="treedata"
      node-key="id"
      default-expand-all
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
    >
    </el-tree>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "tralms",
  props: {
    type: String,
    treeList: Array,
  },
  data() {
    return {
      treedata: [],
      defaultProps: {
        children: "childList",
        label: "nodeName",
      },
      choiceData: {},
      isdisable: true,
      adddisable: false,
      dialogVisible: false,
      filterText: "",
      titles: "执行标准分类",
      diaTit: "",
      title: true,
      form: {
        valueTitle: "",
        parentId: 0,
        name: "",
        id: 0,
        ids: 0,
        status: "",
      },
      rules: {
        name: [{ required: true, message: "请输入分类名称" }],
        status: [{ required: true, message: "请选择状态" }],
      },
      parentlist: [],
      isloading: false,
      selectName: "",
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    treeList(val) {
      this.treedata = this.handleTree(val, "deptId");
      if (this.treedata.length === 0) {
        this.adddisable = false;
      } else {
        this.adddisable = true;
      }
    },
  },
  mounted() {
    if (this.type === "0") {
      this.titles = "执行标准分类";
    } else {
      this.titles = "标准中的产品分类";
    }
  },
  components: { Treeselect },
  methods: {
    handleNodeClick(data, node, v) {
      if (node.data.parentId == 0) {
        this.parentlist = node.parent.data[0];
      } else {
        this.parentlist = node.parent.data;
      }
      this.$emit("handleData", data);
      this.choiceData = data;
      this.isdisable = false;
      this.adddisable = false;
    },
    // 初始化值
    initHandle(data, types) {
      if (types == 1) {
        this.form.ids = this.parentlist.id; // 初始化显示
        this.form.id = data.id;
        this.form.status = data.status;
        this.form.parentId = data.parentId;
      } else {
        this.form.ids = data.id; // 初始化显示
        this.form.id = data.id;
      }
    },
    handleNodeClickvis(node, data) {
      this.form.ids = node.id;
      this.form.parentId = node.id;
      this.selectName = node.name;
      this.form.status = node.status;
    },
    inputChange(v) {
      if (v === undefined) {
        this.form.parentId = 0;
        this.selectName = "";
        this.form.status = "";
      }
    },
    filterNode(value, data) {
      if (!value) return true;
    },
    handleClose() {
      this.choiceData = {};
      this.isdisable = true;
      this.adddisable = true;
      this.dialogVisible = false;
    },
    normalizer(node) {
      if (node.childList && !node.childList.length) {
        delete node.childList;
      }
      return {
        id: node.id,
        label: node.nodeName,
        children: node.childList,
        parentId: node.parentId,
        status: node.status,
      };
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.disbody .el-form-item {
  .el-select {
    width: 100%;
  }
}
/deep/.diafot {
  position: absolute;
  bottom: 18px;
  left: 36%;
  .el-button {
    margin-right: 20px;
  }
}
.btnbox {
  margin-top: 20px;
  padding: 10px;
  align-items: center;
  .el-button--medium {
    margin-bottom: 10px;
    width: 90%;
    margin-left: 0;
  }
}
</style>
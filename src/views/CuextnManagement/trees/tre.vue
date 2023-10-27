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
      :render-content="renderContent"
    >
    </el-tree>
    <div class="btnbox">
      <el-button icon="el-icon-delete" :disabled="isdisable" @click="handleDel"
        >删除</el-button
      >
      <el-button icon="el-icon-edit" :disabled="isdisable" @click="handleEdit"
        >修改</el-button
      >
<!--      <el-button icon="el-icon-plus" @click="addTree" :disabled="adddisable"-->
<!--        >增加</el-button-->
<!--      >-->
		<el-button icon="el-icon-plus" @click="addTree"
		>增加</el-button
		>
    </div>
    <!-- 添加或修改设备类型的弹框 -->
    <el-dialog
      :title="diaTit"
      :visible.sync="dialogVisible"
      width="30%"
      @close="hadkong"
    >
      <el-form
        :model="form"
        ref="queryForm"
        :inline="true"
        :prop="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="上级区域名称" v-if="treedata.length !== 0">
          <treeselect
            :default-expand-level="5"
            v-model="form.ids"
            :options="treedata"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="请选择标准分类"
            @select="handleNodeClickvis"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item prop="selectName" label="本级区域名称">
          <el-input v-model="selectName"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option label="正常" :value="0"></el-option>
            <el-option label="停用" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { addeng, editeng, lookeng, deteng } from "@/api/ctactl/config";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "tre",
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
      disabled: [],
      title: true,
      form: {
        valueTitle: "",
        parentId: 0,
        nodeName: "",
        id: 0,
        ids: null,
        status: "",
      },
      rules: {
        nodeName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
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
    //
    handleNodeClick(data, node, v) {
      console.log(data);
      console.log(node);
      if (node.data.parentId == 0) {
        this.parentlist = node.parent.data[0];
      } else {
        this.parentlist = node.parent.data;
      }
      if (data.status === "1") {
        this.adddisable = true;
      } else {
        this.adddisable = false;
      }
      this.$emit("handleData", data);
      this.choiceData = data;
      this.isdisable = false;
      // this.adddisable = false;
    },
    // 添加树形节点
    addTree() {
      this.resetForm("queryform");
      this.selectName = ""
      if (this.treedata.length === 0) {
        this.adddisable = false;
      } else {
        this.adddisable = true;
        if (this.choiceData.id === undefined) {
          this.$message.info("请先选择需要增加的节点名");
          return;
        }
      }
      this.form.nodeName = "";
      (this.form.prop = ""), (this.dialogVisible = true);
      this.diaTit = "新增";
      this.initHandle(this.choiceData, 0);
    },
    handleOk() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.isloading = true;
          if (this.diaTit === "新增") {
            const params = {
              nodeName: this.selectName,
              parentId: this.form.ids,
              status: this.form.status,
            };
            addeng(params).then((res) => {
              if (res.code === 200) {
                this.$message.success("新增成功");
                this.$emit("updata");
                this.close();
              }
            });
          } else {
            console.log(this.form.nodeName)
            console.log(this.selectName)
            if (this.selectName !== "") {
              if (this.form.nodeName === this.selectName) {
                this.$message.error("请重新选择上级分类");
                return;
              }
            }
            const params = {
              nodeName: this.selectName,
              parentId: this.form.parentId,
              id: this.form.id,
              status: this.form.status,
            };
            editeng(params).then((res) => {
              if (res.code === 200) {
                this.isloading = false;
                this.$message.success("修改成功");
                this.$emit("updata");
                this.close();
              }
            });
          }
        }
      });
    },
    // 删除
    handleDel() {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deteng(this.choiceData.id).then((res) => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.$emit("updata");
            this.choiceData = {};
          } else {
            this.$message.info(res.msg);
          }
        });
      });
    },
    // 添加后对表单进行清空
    hadkong() {
      for (let key in this.queryForm) {
        this.queryForm[key] = "";
        this.form.nodeName = this.choiceData.nodeName;
        this.form.status = this.choiceData.status;
      }
    },
    // 修改
    handleEdit() {
      console.log(this.choiceData);
      this.dialogVisible = true;
      this.diaTit = "修改";
      this.selectName=this.choiceData.nodeName
      this.form.status = this.choiceData.status;
      this.initHandle(this.choiceData, 1);
    },
    // 初始化值
    // initHandle(data, types) {
    //   if (types == 1) {
    //     this.form.ids = this.parentlist.id; // 初始化显示
    //     this.form.id = data.id;
    //     this.form.status = "";
    //     this.form.parentId = data.parentId;
    //     this.selectName = node.nodeName;
    //   } else {
    //     this.form.ids = data.id; // 初始化显示
    //     this.form.id = data.id;
    //     this.form.status = "";
    //     this.form.parentId = data.parentId;
    //     this.selectName = node.nodeName;
    //   }
    // },
    initHandle(data, types) {
      console.log(data);
      console.log(types)
      if (types == 1) {
        if (data.parentId === 0) {
          this.form.id = data.id;
          this.form.nodeName = ""; // 初始化显示
        } else {
          this.form.nodeName = this.parentlist.nodeName; // 初始化显示
          this.form.ids = this.parentlist.id; // 初始化显示
        }
        // this.form.id = data.id;
        // this.form.ids = this.parentlist.childList ? this.parentlist.id : null;
        // console.log(this.parentlist.childList)
        // // this.form.status = "";
        // // this.selectName = node.nodeName;
        // this.form.parentId = data.parentId;
        this.form.ids = data.parentId != 0?this.parentlist.id: null;
        console.log(this.parentlist.childList,data.nodeName) // 初始化显示
        this.form.id = data.id;
        this.form.status = data.status;
        this.form.parentId = data.parentId;
        this.selectName = data.nodeName;
      } else {
        this.form.ids = data.id; // 初始化显示
        this.form.id = data.id;
        this.form.status = "";
        this.form.parentId = data.parentId;

        // this.selectName = node.nodeName;
      }
    },
    // 上级区域名称
    handleNodeClickvis(node, data) {
      this.form.ids = node.id;
      this.form.parentId = node.id;
      if(this.diaTit === "新增") {
        this.inputChange()
      }
      // this.selectName = node.nodeName;
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
      return data.nodeName.indexOf(value) !== -1;
    },
    // handleClose() {
    //   this.choiceData = {};
    //   this.isdisable = true;
    //   this.adddisable = true;
    //   this.dialogVisible = false;
    // },
    close() {
      this.$nextTick(() => {
        this.choiceData = {};
        this.isdisable = true;
        this.adddisable = true;
        this.$refs.queryForm.clearValidate();
        this.dialogVisible = false;
      });
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
      };
    },
    //   判断status 选择自己想要的样式
    renderContent(h, { node, data, store }) {
      return (
        <span class={data.status === 1 ? "dataStyle" : ""}>
          {node.data.nodeName}
        </span>
      );
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
/deep/.dataStyle {
  color: #c0c0c0 !important;
}
</style>

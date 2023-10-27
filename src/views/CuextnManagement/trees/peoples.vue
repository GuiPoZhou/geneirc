
<template>
  <el-dialog
    class="elDialog"
    center
    width="40%"
    :visible.sync="dialogShow"
    append-to-body
    title="选择人员"
  >
    <div class="tranferbox">
      <div class="conbox">
        <div class="titbox">
          <el-input
            size="mini"
            placeholder="搜索姓名"
            suffix-icon="el-icon-search"
            v-model="nickName"
          ></el-input>
        </div>
        <div class="wordbox">
          <el-tree
            show-checkbox
            class="filter-tree"
            node-key="id"
            :data="dataLeft"
            :props="defaultProps"
            :filter-node-method="filterNode"
            ref="tree"
          ></el-tree>
        </div>
      </div>
      <el-button type="primary" @click="getData">添加</el-button>
      <div class="conbox">
        <div class="titbox">
          <h2>已选择用户{{ keyarr.length }}</h2>
        </div>
        <div class="wordbox">
          <ul>
            <li v-for="(item, index) in keyarr" :key="index">
              <div class="inli">
                <i class="el-icon-s-custom"></i>
                <span>{{ item.label }}</span>
                <i class="el-icon-close" @click="removeData(item)"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleOk">确定</el-button>
      <el-button @click="dialogShow = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  // props:['datas','defaultProps'],
  data() {
    return {
      input3: "",
      checkList: [],
      keyarr: [],
      nickName: "",
      defaultProps: {
        children: "children",
        label: "label",
      },
      dialogShow: false,
      dataLeft: [],
    };
  },
  watch: {
    nickName(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    //关键词搜索
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    init(data) {
      this.dataLeft = data;
      this.dialogShow = true;
    },
    getData() {
      this.keyarr = [];
		let checkLists = this.$refs.tree.getCheckedNodes();
		this.checkList = checkLists.filter(item => item.type != 2);
		this.checkListKeys = this.$refs.tree.getCheckedKeys();
      // this.checkList = this.$refs.tree.getCheckedNodes();
      if (this.checkList.length != 0) {
        for (var i = 0; i < this.checkList.length; i++) {
          if (!this.checkList[i].children) {
            this.keyarr.push(this.checkList[i]);
          }
        }
      } else {
        this.keyarr = [];
      }
    },
    setCheckedNodes(arr) {
      this.$refs.tree.setCheckedNodes(arr);
    },
    removeData(data) {
      let checklist = this.keyarr;
      for (var i = 0; i < checklist.length; i++) {
        if (checklist[i].label === data.label) {
          checklist.splice(i, 1);
        }
      }
      this.keyarr = checklist;
      this.setCheckedNodes(this.keyarr);
    },
    handleOk() {
      this.$emit("handle", this.keyarr);
      this.dialogShow = false
      this.keyarr = []
    },
  },
};
</script>

<style scoped lang="less">
.tranferbox {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .conbox {
    height: 500px;
    border: 1px solid #e9eaed;
    border-radius: 2px;
    background: #fdfdfd;
    width: 295px;
    padding: 10px;
    .titbox {
      height: 29px;
      line-height: 29px;

      h2 {
        font-size: 14px;
      }
    }
    .wordbox {
      font-size: 12px;
      height: 448px;
      margin-top: 10px;
      overflow-y: auto;

      .el-tree-node__label {
        font-size: 12px;
      }

      ul {
        li {
          .inli {
            display: flex;
            align-items: baseline;
          }

          span {
            font-size: 14px;
            display: block;
            padding-left: 10px;
            padding-right: 5px;
          }

          .el-icon-s-custom {
            color: #93a9d3;
          }

          .el-icon-close {
            color: #808080;
            cursor: pointer;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>

/*  弹框最大化按钮样式*/
/deep/.el-dialog__header {
  padding: 15px 20px 15px;
}
/deep/.el-dialog__headerbtn {
  top: 15px;
}
/deep/.avue-crud__dialog__header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
/deep/.el-dialog__title {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 800;
  font-size: 16px;
  word-wrap: break-word;
}
/deep/.avue-crud__dialog__menu {
  padding-right: 20px;
  float: left;
}
/deep/.avue-crud__dialog__menu i {
  color: #909399;
  font-size: 15px;
}
/deep/.el-icon-full-screen {
  cursor: pointer;
}
/deep/.el-icon-full-screen:before {
  content: "\e719";
}
</style>

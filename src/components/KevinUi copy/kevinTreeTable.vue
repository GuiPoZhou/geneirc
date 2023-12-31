<template>
    <div class="HTable" style="margin-top:10px">
      <el-table width="100%" v-bind="$attrs" :data="tableData" v-on="$listeners" :key="JSON.stringify(checkedCol)">
        <el-table-column v-for="(item, index) in checkedCol" :key="item.prop" v-bind="item" :index="index"
          :column-key="item.prop" :align="item.align ? item.align : 'center'">
          <template v-if="item.slotHeaderName" v-slot:header="scope">
            <slot :name="item.slotHeaderName" v-bind="scope" :item="item"></slot>
          </template>
          <template v-if="item.slotName" v-slot:default="scope">
            <slot :name="item.slotName" v-bind="scope"></slot>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
    
  <script>
  import Sortable from "sortablejs";
  export default {
    name: "HTable",
    props: {
      tableKey: String,
      columns: {
        type: Array,
        default() {
          return [];
        }
      },
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      setColumn: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      columns: {
        handler(newVal) {
          let localVal = this.getStorageCol();
          let hotVal = [];
          if (localVal) {
            hotVal = this.dataDiff(newVal, localVal);
          } else {
            hotVal = [...newVal];
          }
          this.col = hotVal.map(
            (item, index) =>
              (item = { ...item, index, checked: item.checked || true })
          );
          this.checkedCol = this.checkedColFun(this.col);
          this.selectCol = this.checkedCol.map(item => (item = item.prop));
        },
        immediate: true
      },
      data: {
        handler(newVal) {
          this.tableData = [...newVal];
        },
        immediate: true
      },
      col: {
        handler(newVal) {
          this.setStorageCol(newVal);
        },
        deep: true,
        immediate: true
      }
    },
    data() {
      return {
        tableData: [],
        col: [],
        checkedCol: [],
        selectCol: []
      };
    },
  
    mounted() {
      document.body.ondrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
      };
      this.$nextTick(() => {
        this.rowDrop();
        this.columnDrop();
      });
    },
    methods: {
      drap() {
        this.$nextTick(() => {
          this.rowDrop();
          this.columnDrop();
        });
      },
  
      handleChangeSelectColumn() {
        this.col.forEach(item => {
          if (this.selectCol.includes(item.prop)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
        this.checkedCol = this.checkedColFun(this.col);
        this.drap();
      },
  
      rowDrop() {
        const tbody = document.querySelector(".el-table__body-wrapper tbody");
        Sortable.create(tbody, {
          onEnd: ({ newIndex, oldIndex }) => {
            [this.tableData[newIndex], this.tableData[oldIndex]] = [
              this.tableData[oldIndex],
              this.tableData[newIndex]
            ];
            this.drap();
            this.$emit("dropRow", {
              drapRow: this.tableData[oldIndex],
              targetRow: this.tableData[newIndex],
              drapRowIndex: oldIndex,
              targetRowIndex: newIndex,
              data: this.tableData
            });
          }
        });
      },
      columnDrop() {
        const wrapperTr = document.querySelector(".el-table__header-wrapper tr");
        Sortable.create(wrapperTr, {
          animation: 180,
          delay: 0,
          onEnd: ({ newIndex, oldIndex }) => {
            const oldItem = this.checkedCol[oldIndex];
            const newItem = this.checkedCol[newIndex];
            [this.col[newItem.index].index, this.col[oldItem.index].index] = [
              oldItem.index,
              newItem.index
            ];
            this.col.sort((a, b) => {
              return a.index - b.index;
            });
            this.checkedCol = this.checkedColFun(this.col);
            this.tableData = this.tableData.slice(0, this.tableData.length);
            this.drap();
            this.$emit("dropCol", {
              colItem: oldItem,
              newIndex: newIndex,
              oldIndex: oldIndex,
              column: this.checkedCol
            });
          }
        });
      },
      checkedColFun(arr) {
        return arr.filter(item => item.checked);
      },
      setStorageCol(data) {
        if (this.tableKey && data && data.length > 0) {
          localStorage.setItem("HTable-" + this.tableKey, JSON.stringify(data));
        }
      },
      getStorageCol() {
        let datajson = localStorage.getItem("HTable-" + this.tableKey);
        return datajson ? JSON.parse(datajson) : "";
      },
      dataDiff(newVal, localVal) {
        let nl = newVal.length;
        let ll = localVal.length;
        if (nl != ll) {
          return newVal;
        } else {
          let np = newVal.map(item => item.prop).sort();
          let lp = localVal.map(item => item.prop).sort();
          if (np.join() != lp.join()) {
            return newVal;
          } else {
            let nnl = [];
            for (let i = 0; i < localVal.length; i++) {
              const item_l = localVal[i];
              for (let j = 0; j < newVal.length; j++) {
                const item_n = newVal[j];
                if (item_l.prop === item_n.prop) {
                  nnl.push({
                    ...item_n,
                    index: item_l.index
                  });
                }
              }
            }
            return nnl;
          }
        }
      }
    }
  };
  </script>
    
  <style lang="less" scoped>
  .HTable {
    position: relative;
  
    .settingBox {
      width: 36px;
      height: 36px;
      border-radius: 2px;
      border: 1px solid #ebeef5;
      border-bottom: 0;
      margin-left: auto;
      position: relative;
  
      .icon {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 36px;
        height: 36px;
        text-align: center;
        font-size: 20px;
        line-height: 36px;
        color: #909399;
        cursor: pointer;
      }
    }
  }
  </style>
  <style lang="less">
  .settingPopper {
    min-width: 100px !important;
  }
  </style>
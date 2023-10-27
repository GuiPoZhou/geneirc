<template>
  <div>
    <BoDialog :diaLogShow="showKevinLog" :fullScreen="fullScreen" :diaLogTitle="dialogTitle" @close="e_close">
      <template slot="bologbody">
        <el-form :model="form" ref="form" label-width="100px" :form="form" class="demo-ruleForm"
          :label-position="KevinJson.KevinWidget.labelPosition || 'top'">
          <el-row>
            <KevinRender ref="KevinRender" :context="context" :Widget="renderWidget" :form="form" />
          </el-row>
        </el-form>
      </template>
      <template slot="bologfooter">
        <el-button :type="buttonInfo.type" :size="buttonInfo.size"
          v-for="(buttonInfo, buttonIndex) in dialogFooterButtons" :key="buttonIndex" :loading="buttonInfo.isLoading"
          @click="e_dialogButtonEvents(buttonInfo)">
          {{ buttonInfo.title }}
        </el-button>
      </template>
    </BoDialog>
  </div>
</template>
<script>
import {
  listAuthentication,
  searchItemsByName,
  searchMethodsByCode,
  add,
  getDetailById,
  update,
} from "@/api/standardManagement/itemMethod";

import { listAll, listData } from "@/api/system/dict/data";

import selectDetectName from "@/components/project/selectDetectName";
import selectUnit from "@/components/common/selectUnit";
import selectDept from "@/components/common/selectDept";
import selectPost from "@/components/common/selectPost";
import selectEquipmentType from "@/components/common/selectEquipmentType";
import axios from 'axios'
export default {
  components: {
    selectDetectName,
    selectUnit,
    selectDept,
    selectPost,
    selectEquipmentType,
  },
  data() {
    return {
      showKevinLog: false,
      fullScreen: false,
      dialogTitle: '',
      renderWidget: [],
      dialogFooterButtons: [],
      KevinJson: {
        KevinWidget: {}
      },
      context: this,
      form: {
        extData: {}
      },
      runKevinRender: false,
      widgetId: 'a',
      KevinUtils: window.KevinUtils,
      container: null,


      ExpressionOfResultsListData: [],
      tableData: [],
      itemData: [],
      activeName: "first",
      //项目方法数据
      addParam: {
        commonMethod: 0,
        detectCategory: undefined,
        detectCategoryName: undefined,
        itemNameCn: undefined,
        itemNameEn: undefined,
        isScene: 0,
        methodCode: undefined,
        methodNameCn: undefined,
        methodNameEn: undefined,
        childMethodName: undefined,
        stroma: undefined,
        detectLimit: undefined,
        detectUnit: undefined,
        detectPeriod: undefined, //检测周期
        performanceWeight: undefined,
        detectDept: undefined,
        deptName: undefined,
        detectPost: undefined,
        unitName: undefined,
        postName: undefined,
        preSample: undefined,
        itemType: undefined, //项目分类
        authType: undefined, //授权类别
        rationLimit: undefined, //定量限值
        qualityRequirement: undefined, //质控要求
        sampleAge: undefined, // 样品时效
        resultExpression: undefined, //结果表达
        isPx: 0,
        pxNum: 1,
        isResults: 0,
        resultsNum: 1,
        sort: null,
      },
      isMore: {
        itemData: false,
        tableData: false
      },
      //项目方法id，用于编辑和详情
      itemMethodId: undefined,
      //已选择的认证情况
      selectedAuthentications: [],
      //所有设备类型
      equipmentTypeList: [],
      //所有的认证情况
      allAuthentication: [],
      //是否显示类别列表
      categoryShow: false,
      //是否显示计量单位列表
      unitShow: false,
      //是否显示检测部门列表
      deptShow: false,
      //是否显示检测岗位列表
      postShow: false,
      //是否显示设备分类列表
      equipmentTypeShow: false,

      //设备分类【全部，其他】
      equipmentType: 2,

      //对齐方式
      labelPosition: "right",
      rules: {
        detectCategoryName: [
          { required: true, message: "请输入检测类别", trigger: "change" },
        ],
        itemNameCn: [
          { required: true, message: "请输入项目中文名称", trigger: "blur" },
        ],
        methodCode: [
          { required: true, message: "请输入方法编号", trigger: "blur" },
        ],
        methodNameCn: [
          { required: true, message: "请输入方法中文名称", trigger: "blur" },
        ],
        deptName: [
          {
            // 角色 配置该权限控制后 检测部门不需要必填
            required: ((this.$store.state.user.permissions.includes('micGenric:itemMethodManage:Department-Required') == false) || this.$store.state.user.roles.includes('admin')) ? true : false,
            message: "请输入检测部门名称",
            trigger: "change"
          },
        ],
      },
      initAuthCategoryListData: [],
      initItemCategoryListData: [],
      uniShowType: "",
      currentSubTableIndex: -1,
      tableName: "",
    };
  },
  props: {
    addShow: {
      type: Boolean,
      default: false,
    },
    //操作类型：add:新增、detail:详情、update:编辑
    operateType: {
      type: String,
      default: "add",
    },
  },
  methods: {
    e_close() {
      this.$emit('close')
    },
    init() {
      this.form.userName = 'Kevin'
      this.e_getWidgetInfo()

    },
    e_getWidgetInfo() {
      this.$net('/formLayout/v2/getFormLayoutConfig', 'get', { id: this.widgetId }).then(re => {
        let formDataStr = re.data.configStr
        let resultDataStr = formDataStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        let info = JSON.parse(resultDataStr)
        let KevinJson = info.KevinJson
        this.KevinJson = KevinJson
        this.showKevinLog = true
        this.dialogTitle = KevinJson.KevinWidget.title
        this.renderWidget = KevinJson.KevinWidget.children
        this.dialogFooterButtons = KevinJson.KevinWidget.diaLogFooterButton
        this.fullScreen = true
        this.runWidgetAutoEvents(KevinJson.KevinWidget.autoEvents)
        this.$nextTick(() => {
          this.$refs.KevinRender.getWidgetServerData(this.renderWidget)
          this.container = this.$refs.KevinRender
        })
      })
    },
    // 弹框底部动态按钮事件执行
    e_dialogButtonEvents(widgetInfo) {
      new Function('ctx', 'widgetInfo', widgetInfo.events)(this, widgetInfo)
      this.$forceUpdate()
    },
    // 执行动态表单自动执行脚本
    runWidgetAutoEvents(autoEvents) {
      if (autoEvents) {
        for (let key in autoEvents) {
          new Function('ctx', autoEvents[key])(this)
        }
      }
    },





    validateNumber() {
      // 使用正则表达式匹配非数字字符并替换为空字符串
      this.addParam.sort = this.addParam.sort.replace(/\D/g, '');
    },
    /*
     *@author: 焦政
     *@date: 2022-04-11 15:42:24
     *@description:子项目检出限单位
     */
    e_openUnit(type, index, tableName) {
      this.tableName = tableName;
      this.currentSubTableIndex = index;
      this.uniShowType = type;
      this.unitShow = true;
    },
    /*
     *@author: 焦政
     *@date: 2022-04-11 15:15:35
     *@description:新增
     */
    e_add(tableName) {
      let obj = {
        subItemName: "",
        detectLimit: this.addParam.rationLimit || "",
        detectUnit: this.addParam.detectUnit || "",
        detectUnitName: this.addParam.unitName || "",
      };
      this[tableName].push(obj);
    },
    /*
     *@author: 焦政
     *@date: 2022-04-11 15:14:14
     *@description:删除添加的子项目
     */
    e_delete(index, tableName) {
      this[tableName].splice(index, 1);
    },
    //授权类别
    initAuthCategoryList() {
      listData({ dictType: "auth_type" }).then((response) => {
        if (response.code === 200) {
          this.initAuthCategoryListData = response.rows;
        }
      });
    },
    /** 修改多结果 */
    changeMoreRes(e) {
      console.log(e);
      switch (e) {
        case 0:
          this.$set(this.addParam, 'resultsNum', 1)
          break;
        case 1:
          this.$set(this.addParam, 'resultsNum', 2)
          break;
      }
    },
    /** 修改是否多平行 */
    changePx(e) {
      console.log(e);
      switch (e) {
        case 0:
          this.$set(this.addParam, 'pxNum', 1)
          break;
        case 1:
          this.$set(this.addParam, 'pxNum', 2)
          break;
      }
    },
    //授权类别
    initItemCategoryList() {
      listData({ dictType: "item_category" }).then((response) => {
        if (response.code === 200) {
          this.initItemCategoryListData = response.rows;
        }
      });
    },
    //结果表达
    ExpressionOfResultsList() {
      listData({ dictType: 'expression_results' }).then((response) => {
        if (response.code === 200) {
          this.ExpressionOfResultsListData = response.rows
          this.ExpressionOfResultsListData.map((item) => {
            item.dictLabel = item.dictLabel.replace('&lt;', '<')
          })
        }
      })
    },
    //取消按钮操作
    close() {
      this.resetAdd()
      this.$emit("update:addShow", false);
      this.tableData = []
    },
    //重置添加表单
    resetAdd() {
      this.resetForm("addForm");
      this.activeName = 'first'
      this.selectedAuthentications = [];
      this.tableData = []
      this.itemData = []
      this.addParam.isPx = 0
      this.addParam.pxNum = 0
      this.addParam.resultsNum = 0
      this.addParam.isResults = 0
      this.equipmentTypeList.forEach((type) => (type.isSelected = false));
      this.equipmentTypeList.reverse();
    },
    //填充类别
    backfillCategory(detectCategory) {
      this.addParam.detectCategory = detectCategory.id;
      this.addParam.detectCategoryName = detectCategory.selectDetectName;
    },
    //填充计量单位
    backfillUnit(unit) {
      if (this.uniShowType == "sub") {
        console.log(this.currentSubTableIndex);
        let obj = this[this.tableName][this.currentSubTableIndex];
        console.log(obj);
        obj.detectUnit = unit.id;
        obj.detectUnitName = unit.unitName;
        console.log(this.currentSubTableIndex);
        console.log(obj);
        this.$set(this[this.tableName], this.currentSubTableIndex, obj);
      } else {
        this.addParam.detectUnit = unit.id;
        this.addParam.unitName = unit.unitName;
      }
    },
    //填充检测单位
    backfillDept(dept) {
      this.addParam.detectDept = dept.deptId;
      this.addParam.deptName = dept.deptName;
    },
    //填充岗位
    backfillPost(post) {
      this.addParam.detectPost = post.postId;
      this.addParam.postName = post.postName;
    },
    backfillEquipmentType(rows) {
      //选中的设备类型
      console.log(rows)
      let dictCodeArr = rows.map((row) => row.dictCode);
      console.log(1);
      console.log(this.equipmentTypeList);
      this.equipmentTypeList.forEach((type) => {
        console.log(type);
        if (dictCodeArr.indexOf(type.dictCode) > -1) {
          type.isSelected = true;
        } else {
          type.isSelected = false;
        }
      });

      //翻转，为了vue响应数组操作
      this.equipmentTypeList.reverse();
    },

    showEquipmentType() {
      this.equipmentTypeShow = true;
      //勾选选中的
      this.$refs.equipmentType.initSelected();
    },

    //认证情况列表
    initAuthentication() {
      listAuthentication().then((response) => {
        if (response.code === 200) {
          this.allAuthentication = response.data;
        }
      });
    },
    //设备类型列表
    initEquipmentTypeList() {
      listData({ dictType: "equipment_type" }).then((response) => {
        if (response.code === 200) {
          this.equipmentTypeList = response.rows;
        }
      });
    },
    // 根据项目名查询项目
    queryItem(itemName, cb) {
      searchItemsByName(itemName).then((response) => {
        if (response.code === 200) {
          let data = response.data;
          data.forEach((item) => {
            item.value = item.itemNameCn;
          });
          //下拉列表
          cb(response.data);
        }
      });
    },
    //选择项目回填
    selectItem(item) {
      this.addParam.itemNameEn = item.itemNameEn;
    },

    // 根据方法编码查询方法
    queryMethod(methodCode, cb) {
      searchMethodsByCode(methodCode).then((response) => {
        if (response.code === 200) {
          let data = response.data;
          data.forEach((method) => {
            method.value = method.methodCode;
          });
          //下拉列表
          cb(response.data);
        }
      });
    },
    //选择方法回填
    selectMethod(method) {
      this.addParam.methodNameCn = method.methodNameCn;
      this.addParam.methodNameEn = method.methodNameEn;
      this.addParam.childMethodName = method.childMethodName;
    },

    //新增/修改
    save(isContinue) {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          if (this.addParam.sort == '' || this.addParam.sort == undefined) {
            this.addParam.sort = null
          }
          if (this.addParam.sort) {
            this.addParam.sort = parseInt(this.addParam.sort)
          }
          if (
            this.selectedAuthentications.some(
              (au) => au.dictLabel === "资质外"
            ) &&
            this.selectedAuthentications.length > 1
          ) {
            this.$message.error(" 认证情况：资质外不能与其他类型同时选择！");
            return false;
          }
          this.initAddParam();
          if (this.operateType === "add") {
            this.add(isContinue);
          } else {
            this.update();
          }
        }
      });
    },
    //新增
    add(isContinue) {
      this.addParam.subList = this.tableData;
      this.addParam.itemMethodSubList = this.itemData
      add(this.addParam).then((response) => {
        if (response.code === 200) {
          this.$message({ message: "添加成功！", type: "success" });
          // 保存继续
          if (!isContinue) {
            this.close();
          }
          this.$emit("reload");
        }
      });
    },
    //编辑保存
    update() {
      this.addParam.subList = this.tableData;
      this.addParam.itemMethodSubList = this.itemData
      update(this.addParam, this.itemMethodId).then((response) => {
        if (response.code === 200) {
          this.$message({ message: "操作成功！", type: "success" });
          this.close();
          this.$emit("reload");
        }
      });
    },
    //初始化参数
    initAddParam() {
      //认证情况
      let authentications = this.selectedAuthentications.map((au) => {
        return {
          authentication: au.dictCode,
          authenticationLabel: au.dictLabel,
        };
      });

      this.addParam.authenticationList = authentications;
      //设备分类
      let equipmentTypes = this.selectedEquipmentType.map((type) => {
        return { equipmentType: type.dictCode, typeLabel: type.dictLabel };
      });
      this.addParam.equipmentTypeList = equipmentTypes;

      if (!this.addParam.postName) {
        this.addParam.detectPost = null;
      }
      if (!this.addParam.unitName) {
        this.addParam.detectUnit = null;
      }
    },
    //获取详情
    getDetail(itemMethodId) {
      this.itemMethodId = itemMethodId;
      getDetailById(itemMethodId).then((response) => {
        if (response.code === 200) {
          let data = response.data;
          this.addParam = response.data;
          this.addParam.commonMethod = Number(this.addParam.commonMethod)
          this.tableData = this.addParam.subList || []
          this.itemData = this.addParam.itemMethodSubList || []
          //初始化认证情况
          let authentications = data.authenticationList;
          if (
            authentications !== undefined &&
            authentications !== null &&
            authentications.length > 0
          ) {
            let authenticationIds = authentications.map(
              (au) => au.authentication
            );
            this.selectedAuthentications = this.allAuthentication.filter(
              (au) => authenticationIds.indexOf(au.dictCode) > -1
            );
          }

          //初始化设备分类
          let equipmentTypes = data.equipmentTypeList;
          if (
            equipmentTypes !== undefined &&
            equipmentTypes !== null &&
            equipmentTypes.length > 0
          ) {
            let equipmentTypeIds = equipmentTypes.map(
              (type) => type.equipmentType
            );
            this.equipmentTypeList.forEach((type) => {
              if (equipmentTypeIds.indexOf(type.dictCode) > -1) {
                type.isSelected = true;
              } else {
                type.isSelected = false;
              }
            });
            this.equipmentTypeList.reverse();
          }

          this.equipmentType = 2;
        }
      });
    },
  },
  computed: {
    //选中的设备类型
    selectedEquipmentType() {
      if (this.equipmentType === 1) {
        this.equipmentTypeList.forEach((type) => (type.isSelected = true));
        this.equipmentTypeList.reverse();
      }
      return this.equipmentTypeList.filter((type) => {
        return type.isSelected;
      });
    },
    equipmentTypeName() {
      let resultData = this.equipmentTypeList
        .filter((type) => {
          return type.isSelected;
        })
        .map((type) => type.dictLabel);
      return resultData.toLocaleString();
    },

    title() {
      switch (this.operateType) {
        case "add":
          return "新增项目";
        case "update":
          return "编辑项目";
        case "detail":
          return "项目详情";
      }
    },
  },
  watch: {
    activeName: {
      handler(val, oldval) {
        const msgDict = {
          "tableData": "项目组分信息",
          "itemData": "子项目信息"
        }
        let msg = msgDict[oldval] || '';
        // 两者都不是项目
        if (oldval !== 'first' && val !== 'first' && this[oldval].length > 0) {
          this.$message.error(`${msg}已含有数据,项目组分信息和子项目信息不能同时维护`);
          this.isMore[val] = true;
        } else {
          this.isMore.itemData = false;
          this.isMore.tableData = false;
        }
      }
    }
  },
  created() {

  },
};
</script>
<style></style>

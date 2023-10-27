<script>
import draggable from 'vuedraggable'
import ArrayUtil from "./components/arrayUtil";
import kevinTable from './kevinTable.vue'
import kevinTreeTable from './kevinTreeTable.vue';

Date.prototype.format = function (format) {
    var args = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var i in args) {
        var n = args[i];
        if (new RegExp("(" + i + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
    }
    return format;
}
export default {
    name: 'ml-form',
    components: {
        draggable,
        kevinTable,
        kevinTreeTable
    },
    props: {
        form: {
            typeof: Object,
            default: () => {
            }
        },
        formJSON: {
            typeof: Array,
            default: () => {
            }
        },
        configId: {
            typeof: String,
            default: ''
        },
        group: {
            typeof: Object,
            default: () => {
            }
        },
        blockInfo: {
            typeof: Object,
            default: () => {
            }
        },
        tabInfo: {
            typeof: Object,
            default: () => {
            }
        },
        ghostClass: {
            typeof: String,
            default: 'ghost'
        },
        env: {
            typeof: 'String',
            default: 'add'
        },
    },
    data() {
        return {
            layoutParamsList: [],
            showAddFormItem: false
        }
    },
    created() {
        window.KevinRenderthis = this
    },
    methods: {
        /**
         * @author Coder
         * @date 2023/1/4
         * @des 删除添加的扩展表单项
         */
        deleteExtItem(index) {
            this.$confirm('确定移除该扩展项?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.formJSON.splice(index, 1)
            })

        },
        addCloseIcon(index) {
            // 动态添加的dom 在jsx中应当使用箭头函数执行具体的执行方法 防止添加完dom后 方法自动执行
            if (!this.microStore.state.system.closeDrag) {
                return (
                    <div class="removearea">
                        <el-popover
                            placement="bottom"
                            width="50"
                            trigger="hover"
                        >
                            <div class="buttonArea">
                                <el-button type="text" style="color:red" size="mini"
                                    onClick={() => this.deleteExtItem(index)}>扩展字段删除
                                </el-button>
                                {/* <el-button type="text" size="mini">编辑</el-button> */}
                            </div>
                            <i
                                slot="reference"
                                class="el-icon-edit el-icon-setting"
                                style="color:#00000;cursor:pointer;font-size:18px;"
                            ></i>
                        </el-popover>

                    </div>
                )
            }
        },
        jsxInput(params, label) {
            if (params.eventsList && params.eventsList.input) {
                let evnets = params.eventsList.input
                this.$emit('jsxInput', { evnets, label })
            }

        },
        // input 获取
        mlInputFocus(params, label) {

        },
        /**
         * @author Coder
         * @date 2023/2/9
         * @des el-autocomplete 返回输入建议的方法
         */
        autoCompleteSugg(events, queryString, callback) {
            this.$emit('autoCompleteSugg', { events, queryString, callback })
        },
        /**
         * @author Coder
         * @date 2023/2/9
         * @des autocomplete 选择事件
         */
        autoCompleteSelect(events, data) {
            this.$emit('autoCompleteSelect', { events, data })
        },
        /**
         * @author Coder
         * @date 2023/2/9
         * @des 渲染el-autocomplete
         */
        renderELAutocomplete(params, index) {
            if (params.type == 'fixed') {
                return (
                    <el-col key={index} span={params.col}>
                        <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                            <el-autocomplete
                                disabled={params.disabled} class="inline-input"
                                v-model={this.form[params['prop']]}
                                ref="asd"
                                trigger-on-focus
                                fetch-suggestions={(queryString, callback) => {
                                    eval(params.events.fetchSuggestions)
                                }}
                                onSelect={(data) => eval(params.events.select)}
                                placeholder="请输入内容"
                            ></el-autocomplete>

                        </el-form-item>
                    </el-col>
                )
            } else {
                return (

                    <el-col key={index} span={params.col}>
                        {
                            this.addCloseIcon(index)
                        }
                        <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                            <el-autocomplete disabled={params.disabled} class="inline-input"
                                v-model={this.form.extData[params['prop']]} ref="asd"
                                trigger-on-focus fetch-suggestions={(queryString, callback) => {
                                    this.autoCompleteSugg(params.eventsList.fetchSuggestions, queryString, callback)
                                }}
                                onSelect={(data) => this.autoCompleteSelect(params.eventsList.select, data)}
                                placeholder="请输入内容"
                            ></el-autocomplete>

                        </el-form-item>
                    </el-col>
                )
            }

        },
        /**
         * @author Coder
         * @date 2023/2/10
         * @des input 查询按钮点击事件
         */
        inputBtnClick(events) {
            this.$emit('inputSlotEvents', events)
        },
        /**
         * @author Coder
         * @date 2023/2/10
         * @des input 插槽按钮渲染以及事件
         */
        appenInputSlot(options) {
            return (
                <el-button slot="append" icon="el-icon-search"
                    onClick={() => options.slotBtnFunc ? eval(options.slotBtnFunc) : ''}></el-button>
            )
        },
        /**
         * @author Coder
         * @date 2023/1/3
         * @des 渲染el-input
         */
         renderELInput(params, index) {
            if (params.isHide == true) {
                return ('')
            }

            // 该函数以及下方出现对type进行判断的地方  是为了区分该formItem是属于固定的项还是扩展的项  fixed固定 ext扩展
            if (params.type == 'fixed') {
                return (
                    <el-col key={index} span={params.col}>
                        {
                            this.addCloseIcon(index, params)
                        }
                        <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                            <el-input style={params.style} type={params.inputType ? params.inputType : 'text'} readonly={params.readonly} disabled={params.disabled} v-model={this.form[params['prop']]}
                                placeholder={params.placeholder ? params.placeholder : ''}
                                onBlur={() => {
                                    params.events && params.events.blur ? eval(params.events.blur) : ''
                                }}
                                onFocus={() => {
                                    params.options && params.options.focus ? eval(params.options.focus) : ''
                                }}


                            >
                                {
                                    !params.disabled && params.options && params.options.showSlotBtn ? this.appenInputSlot(params.options) : ''
                                }
                            </el-input>
                        </el-form-item>
                    </el-col>
                )
            } else {
                return (
                    <el-col key={index} span={params.col}>
                        {
                            this.addCloseIcon(index, params)
                        }
                        <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                            <el-input type={params.inputType ? params.inputType : 'text'} readonly={params.readonly} disabled={params.disabled}
                                placeholder={params.placeholder ? params.placeholder : ''}
                                v-model={this.form.extData[params['prop']]}
                                onBlur={() => {
                                    params.events && params.events.blur ? eval(params.events.blur) : ''
                                }}
                                onFocus={() => {
                                    params.options && params.options.focus ? eval(params.options.focus) : ''
                                }}

                            >
                                {
                                    params.options && params.options.showSlotBtn ? this.appenInputSlot(params.options) : ''
                                }
                            </el-input>
                        </el-form-item>
                    </el-col>
                )
            }

        },
        /**
         * @author Coder
         * @date 2023/1/30
         * @des 渲染el-input-number
         */
        renderELInputNumber(params, index) {
            if (params.isHide == true) {
                return ('')
            }
            if (params.type == 'fixed') {
                return (
                    <el-col key={index} span={params.col}>
                        <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                            <el-input-number disabled={params.disabled} min={params.options.min}
                                max={params.options.max}
                                v-model={this.form[params['prop']]}
                            ></el-input-number>
                        </el-form-item>
                    </el-col>
                )
            } else {
                return (
                    <el-col key={index} span={params.col}>
                        {
                            this.addCloseIcon(index)
                        }
                        <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                            <el-input-number disabled={params.disabled} min={params.options.min}
                                max={params.options.max}
                                v-model={this.form.extData[params['prop']]}
                            ></el-input-number>
                        </el-form-item>
                    </el-col>
                )
            }
        },
        //selectchange
        el_selectChange(e) {
            this.$forceUpdate()
        },
        /**
         * @author Coder
         * @date 2023/1/3
         * @des 渲染el-select
         */
        renderELSelect(params, index) {
            if (params.isHide == true) {
                return ('')
            }
            if (params.type == 'fixed') {
                return (
                    <el-col key={index} span={params.col}>
                        <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                            <el-select disabled={params.disabled} v-model={this.form[params['prop']]}
                                placeholder={params.placeholder}
                                allow-create={params.options.allowCreate}
                                filterable={params.options.filterable}
                                onChange={(e) => {
                                    (params.events && params.events.change) ? eval(params.events.change) : ''
                                }}
                            >
                                {
                                    params.options.options.map((item, index) => {
                                        return (
                                            <el-option label={item.label}
                                                value={item.value}
                                            ></el-option>
                                        )
                                    })

                                }
                            </el-select>
                        </el-form-item>
                    </el-col>
                )
            } else {
                return (
                    <el-col key={index} span={params.col}>
                        {
                            this.addCloseIcon(index)
                        }
                        <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                            <el-select disabled={params.disabled} v-model={this.form.extData[params['prop']]}
                                placeholder={params.placeholder}
                                allow-create={params.options.allowCreate}
                                filterable={params.options.filterable}
                                onChange={(e) => {
                                    (params.events && params.events.change) ? eval(params.events.change) : ''
                                }}
                            >
                                {
                                    params.options.options.map((item, index) => {
                                        return (
                                            <el-option label={item.label}
                                                value={item.value}
                                            ></el-option>
                                        )
                                    })
                                }

                            </el-select>
                        </el-form-item>
                    </el-col>
                )
            }

        },
        //刷新datePicker
        updateDatePicker() {
            this.$forceUpdate()
        },
        /**
         * @author Coder
         * @date 2023/1/3
         * @des 渲染el-date-picker
         */
        renderELDatePicker(params, index) {
            if (params.isHide == true) {
                return ('')
            }
            if (!params.options) {
                params.options = {
                    showCurrentTime: false,
                    format: 'yyyy-MM-dd'
                }
            }
            let currentDate;
            if (params.options && params.options.showCurrentTime) {
                currentDate = new Date().format(params.options.format ? params.options.format : 'yyyy-MM-dd')
            }
            if (params.type == 'fixed') {
                if (!this.form[params['prop']] && params.options.showCurrentTime) {
                    this.form[params['prop']] = currentDate
                }
                return (
                    <el-col key={index} span={params.col}>
                        <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                            <el-date-picker disabled={params.disabled}
                                v-model={this.form[params['prop']]}
                                type={params.options.type ? params.options.type : 'date'}
                                placeholder="选择日期"
                                value-format={params.options.format ? params.options.format : 'yyyy-MM-dd'}
                                onInput={() => {
                                    this.updateDatePicker()
                                }}
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                )
            } else {
                if (!this.form.extData[params['prop']] && params.options.showCurrentTime) {
                    this.form.extData[params['prop']] = currentDate
                }
                return (
                    <el-col key={index} span={params.col}>
                        {
                            this.addCloseIcon(index)
                        }
                        <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                            <el-date-picker disabled={params.disabled}
                                v-model={this.form.extData[params['prop']]}
                                type={params.options.type ? params.options.type : 'date'}
                                placeholder="选择日期"
                                value-format={params.options.format ? params.options.format : 'yyyy-MM-dd'}
                                onInput={() => {
                                    this.updateDatePicker()
                                }}
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                )
            }

        },
        /**
         * @author Coder
         * @date 2023/1/30
         * @des 渲染time选择
         */
        renderELTimeSelct(params, index) {
            if (params.isHide == true) {
                return ('')
            }
            if (params.type == 'fixed') {
                return (
                    <el-col key={index} span={params.col}>
                        <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                            <el-time-select disabled={params.disabled}
                                v-model={this.form[params['prop']]}
                                placeholder="选择时间"
                            >
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                )
            } else {
                return (
                    <el-col key={index} span={params.col}>
                        {
                            this.addCloseIcon(index)
                        }
                        <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                            <el-time-select disabled={params.disabled}
                                v-model={this.form.extData[params['prop']]}
                                placeholder="选择时间"
                            >
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                )
            }
        },
        /**
         * @author Coder
         * @date 2023/1/4
         * @des 渲染el-radio
         */
        renderELRadio(params, index) {
            if (params.isHide == true) {
                return ('')
            }
            if (params.type == 'fixed') {
                return (
                    <el-col key={index} span={params.col}>
                        <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                            <el-radio-group disabled={params.disabled} v-model={this.form[params['prop']]}
                                onInput={(e) => {
                                    (params.events && params.events.input) ? eval(params.events.input) : ''
                                }}>
                                {
                                    params.options.options.map((item, index) => {
                                        return (
                                            <el-radio label={item.value}
                                            >{item.label}</el-radio>
                                        )
                                    })
                                }
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                )
            } else {
                return (
                    <el-col key={index} span={params.col}>
                        {
                            this.addCloseIcon(index)
                        }
                        <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                            <el-radio-group disabled={params.disabled} v-model={this.form.extData[params['prop']]}
                                onInput={(e) => {
                                    (params.events && params.events.input) ? eval(params.events.input) : ''
                                }}>

                                {
                                    params.options.options.map((item, index) => {
                                        return (
                                            <el-radio label={item.value}
                                            >{item.label}</el-radio>
                                        )
                                    })
                                }
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                )
            }

        },
        /**
         * @author Coder
         * @date 2023/1/4
         * @des 渲染el-switch
         */
        renderELSwitch(params, index) {
            if (params.isHide == true) {
                return ('')
            }
            if (params.type == 'fixed') {
                return (
                    <el-col key={index} span={params.col}>
                        <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                            <el-switch disabled={params.disabled} v-model={this.form[params['prop']]}></el-switch>
                        </el-form-item>
                    </el-col>
                )
            } else {
                return (
                    <el-col key={index} span={params.col}>
                        {
                            this.addCloseIcon(index)
                        }
                        <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                            <el-switch disabled={params.disabled}
                                v-model={this.form.extData[params['prop']]}></el-switch>
                        </el-form-item>
                    </el-col>
                )
            }

        },
        /**
         * @author Coder
         * @date 2023/1/30
         * @des 渲染el-checkbox
         */
        renderELCheckBox(params, index) {
            if (params.isHide == true) {
                return ('')
            }
            if (params.type == 'fixed') {
                return (
                    <el-col key={index} span={params.col}>
                        <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                            <el-checkbox-group disabled={params.disabled} v-model={this.form[params['prop']]}>
                                {
                                    params.options.options.map((item, index) => {
                                        return (
                                            <el-checkbox label={item.value}
                                            >{item.label}</el-checkbox>
                                        )
                                    })
                                }
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                )
            } else {
                return (
                    <el-col key={index} span={params.col}>
                        {
                            this.addCloseIcon(index)
                        }
                        <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                            <el-checkbox-group disabled={params.disabled} v-model={this.form.extData[params['prop']]}>

                                {
                                    params.options.options.map((item, index) => {
                                        return (
                                            <el-checkbox label={item.value}
                                            >{item.label}</el-checkbox>
                                        )
                                    })
                                }
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                )
            }

        },
        /**
         * @author Coder
         * @date 2023/2/10
         * @des 上传组件 上传
         */
        fileUploadOnSuccess(events, res, file) {
            this.$emit('fileUploadOnSuccess', { events, res, file })
        },
        /**
         * @author Coder
         * @date 2023/2/10
         * @des 上传组件 删除
         */
        filebeforeRemove(evnets, file) {
            this.$emit('filebeforeRemove', { evnets, file })
        },
        fileOnRemove(events, file, fileList) {
            // events(file, fileList)
            // this.$emit('fileOnRemove', {events, file, fileList})
        },
        fileBeforeUpload(events, file) {
            this.$emit('fileBeforeUpload', { events, file })
        },
        fielOnPreview(events, file) {
            this.$emit('fielOnPreview', { events, file })
        },
        e_showUploadFile(events, file) {

            this.$emit('showUploadFile', { events, file })
        },
        e_removeUploadFile(events, file, params) {
            var arrayUtil = new ArrayUtil()
            params.options.fujianList = arrayUtil.arrRemoveJson(params.options.fujianList, 'uid', file.uid)
            this.$emit('removeUploadFile', { events, file })
        },
        /**
         * @author Coder
         * @date 2023/2/10
         * @des 渲染上传文件
         */
        renderELUpload(params, index) {
            if (params.isHide == true) {
                return ('')
            }
            var scopedSlots = {
                file: (prop) => {
                    return (
                        <div>
                            <span style="padding-right: 20px">{prop.file.name}</span>
                            <el-button type="text" size="small" onClick={() => {
                                eval(params.events.downloadFile)
                            }}>下载
                            </el-button>

                            <el-button v-show={this.env != 'detail' && !params.options.shouldHidenDelete} style="color:red" type="text" size="small" onClick={() => {
                                eval(params.events.removeUploadFile)
                            }}>删除
                            </el-button>
                        </div>
                    )
                }
            }
            if (params.type == 'fixed') {
                return (
                    <el-col key={index} span={params.col}>
                        <el-form-item label={params.label}>
                            <el-upload action={this.$BASE_API + params.options.action}
                                disabled={params.disabled}
                                accept={params.options.accept ? params.options.accept : '-'}
                                headers={params.options.headers}
                                drag={params.options.drag}
                                scopedSlots={scopedSlots}
                                before-upload={(file) => {
                                    eval(params.events.beforeUpload)
                                }}
                                // 这块需要尤其注意  在upload中 on-事件 是以属性来定义的
                                {...{
                                    props: {
                                        "on-success": (res, file) => {
                                            eval(params.events.onSuccess)
                                        }
                                    }
                                }}
                                multiple={true}
                                showFileList={true}
                                file-list={params.options.fileList}
                            >
                                {
                                    params.options.drag ?
                                        <div className="el-upload__text">将文件拖到此处，或<em>点击上传</em></div> : ''
                                }

                                <el-button type="primary" size="small" disabled={params.disabled}>上传</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                )
            }
        },
        /**
         * @author Coder
         * @date 2023/1/4
         * @des 关闭新增表单项
         */
        e_closeAddFormItem() {
            this.showAddFormItem = false
        },
        /**
         * @author Coder
         * @date 2023/1/4
         * @des 确定选择的表单项
         */
        e_selFormItem(row) {
            this.showAddFormItem = false
            this.$emit('addExtForm', row)
        },
                /**
         * @author Coder
         * @date 2023/5/23
         * @des 主表 操作列 按钮操作限制
         */
         checkMainTableActionEvents(slotButtonInfo, item, columnInfo, scope) {
            if (!slotButtonInfo.actionStatusEvents) {
                return false
            } else {
                var that = this
                return new Function('that', 'item', 'columnInfo', 'scope', slotButtonInfo.actionStatusEvents)(that, item, columnInfo, scope)
            }
        }, 
        renderELTreeTable(item, index) {
            if (item.isHide == true) {
                return ('')
            }
            var scopedSlots = {}
            item.tableColumns.forEach((columnInfo, columnIndex) => {
                if (!columnInfo.valueType) {
                    columnInfo.valueType = 'fixed'
                }
                if (columnInfo.slotName == 'action') {
                    scopedSlots['action'] = (scope) => {
                        return (
                            <div>
                                {
                                    item.tableSlotButtons.map(slotButtonInfo => {
                                        if (!slotButtonInfo.isHide) {
                                            return (
                                                <el-button type="text"
                                                    disabled={this.checkMainTableActionEvents(slotButtonInfo, item, columnInfo, scope)}
                                                    onClick={() => {
                                                        slotButtonInfo.events ? eval(slotButtonInfo.events) : ''
                                                    }}>{slotButtonInfo.label}</el-button>
                                            )
                                        }

                                    })
                                }
                            </div>
                        )
                    }
                } else {
                    scopedSlots[columnInfo['slotName']] = (scope) => {
                        if (!scope.row.extData) {
                            scope.row.extData = {}
                        }
                        return (
                            columnInfo.valueType == 'fixed' ?
                                <span>{scope.row[columnInfo.prop]}</span> :
                                <span>{scope.row.extData[columnInfo.prop]}</span>
                        )
                    }
                }

            })
            return (
                <el-col span={item.col}>

                    <kevinTreeTable tree-props={item.treeProps} row-key="id" ref={item.anchorPoint} setColumn={true} key={item.anchorPoint}
                        height={item.height ? item.height : '300'}
                        columns={item.tableColumns}
                        data={item.tableData}
                        style="width:100%;" border
                        scopedSlots={scopedSlots}
                        onSelectionChange={(e) => {
                            item.tableSelections = e
                        }}></kevinTreeTable>

                </el-col>
            )
        },
        /**
         * @author Coder
         * @date 2023/3/22
         * @des 渲染el-table
         */
        renderELTable(item, index) {
            if (item.isHide == true) {
                return ('')
            }
            /**
             * @author Coder
             * @date 2023/3/21
             * @des eltable 插槽定义
             */
            var scopedSlots = {}
            item.tableColumns.forEach((columnInfo, columnIndex) => {
                if (!columnInfo.valueType) {
                    columnInfo.valueType = 'fixed'
                }

                if (columnInfo.slotName == 'action') {
                    scopedSlots['action'] = (scope) => {
                        return (
                            <div>
                                {
                                    item.tableSlotButtons.map(slotButtonInfo => {
                                        if (!slotButtonInfo.isHide) {
                                            return (
                                                <el-button type="text" onClick={() => {
                                                    slotButtonInfo.events ? eval(slotButtonInfo.events) : ''
                                                }}>{slotButtonInfo.label}</el-button>
                                            )
                                        }

                                    })
                                }
                            </div>
                        )
                    }
                } else if (columnInfo.slotName == 'index') {
                    scopedSlots['index'] = (scope) => {
                        return (
                            <div>
                                {++scope.$index}
                            </div>
                        )
                    }
                } else {
                    if (columnInfo.editType) {
                        scopedSlots[columnInfo['slotName']] = (scope) => {
                            if (!scope.row.extData) {
                                scope.row.extData = {}
                            }
                            switch (columnInfo.editType) {
                                case 'span':
                                    return (
                                        <span>{eval(columnInfo.slotRenderEvents)}</span>
                                    )
                                    break;
                                case 'el-input':
                                    return (
                                        columnInfo.valueType == 'fixed' ?
                                            <el-input className="tableSlotInput"
                                                key={columnIndex}
                                                disabled={columnInfo.disabled}
                                                v-model={scope.row[columnInfo['prop']]}></el-input>
                                            :
                                            <el-input class="tableSlotInput"
                                                key={columnIndex}
                                                disabled={columnInfo.disabled}
                                                v-model={scope.row.extData[columnInfo['prop']]}></el-input>
                                    )
                                    break;
                                case 'el-input-number':
                                    return (
                                        columnInfo.valueType == 'fixed' ?
                                            <el-input-number className="tableSlotInput"
                                                key={columnIndex}
                                                min={columnInfo.min * 1}
                                                disabled={columnInfo.disabled}
                                                v-model={scope.row[columnInfo['prop']]}></el-input-number>
                                            :
                                            <el-input-number class="tableSlotInput"
                                                key={columnIndex}
                                                min={columnInfo.min * 1}
                                                disabled={columnInfo.disabled}
                                                v-model={scope.row.extData[columnInfo['prop']]}></el-input-number>
                                    )
                                    break;
                                case 'el-link':
                                    return (
                                        columnInfo.valueType == 'fixed' ?
                                            <el-link underline={false}
                                                type="primary" onClick={() => {
                                                    eval(columnInfo.linkEvents)
                                                }}>{columnInfo.slotRenderEvents ? eval(columnInfo.slotRenderEvents) : scope.row[columnInfo['prop']]}</el-link>
                                            :
                                            <el-link underline={false}
                                                type="primary" onClick={() => {
                                                    eval(columnInfo.linkEvents)
                                                }}>{columnInfo.slotRenderEvents ? eval(columnInfo.slotRenderEvents) : scope.row.extData[columnInfo['prop']]}</el-link>
                                    )
                                    break;
                            }
                        }
                    } else {
                        // 展开行渲染
                        if (columnInfo['type'] == 'expand') {
                            scopedSlots[columnInfo['slotName']] = (scope) => {
                                return (this.renderELTableChild(item, columnInfo, scope))
                            }
                        } else {
                            scopedSlots[columnInfo['slotName']] = (scope) => {
                                if (!scope.row.extData) {
                                    scope.row.extData = {}
                                }
                                return (
                                    columnInfo.valueType == 'fixed' ?
                                        <span>{scope.row[columnInfo.prop]}</span> :
                                        <span>{scope.row.extData[columnInfo.prop]}</span>
                                )
                            }
                        }

                    }
                }
            })
            return (
                <el-col span={item.col}>
                    {
                        this.renderTableTopButton(item)
                    }
                    {
                        item.title ? <el-divider content-position="center">{item.title}</el-divider> : ""
                    }
                    <kevinTable height={item.tableHeight ? item.tableHeight : '-'} key={Math.random()}
                        columns={item.tableColumns} data={item.tableData}
                        style="width:100%;" border
                        scopedSlots={scopedSlots} onSelectionChange={(e) => {
                            item.tableSelections = e
                        }}></kevinTable>

                </el-col>

            )
        },
        /**
         * @author Coder
         * @date 2023/3/24
         * @des 渲染展开行table
         */
        renderELTableChild(item, columnInfo, parentScope) {
            let scopedSlots = {}
            item.childTableColums.forEach(childColumsInfo => {
                if (childColumsInfo.slotName == 'action') {
                    scopedSlots['action'] = (childScope) => {
                        return (
                            <div>
                                {
                                    item.childTableSlotButtons.map(slotButtonInfo => {
                                        if (!slotButtonInfo.isHide) {
                                            return (
                                                <el-button type="text" onClick={() => {
                                                    slotButtonInfo.events ? eval(slotButtonInfo.events) : ''
                                                }}>{slotButtonInfo.label}</el-button>
                                            )
                                        }

                                    })
                                }
                            </div>
                        )
                    }
                } else if (childColumsInfo.slotName == 'index') {
                    scopedSlots['index'] = (childScope) => {
                        return (
                            <div>
                                {++childScope.$index}
                            </div>
                        )
                    }
                } else {
                    scopedSlots[childColumsInfo['slotName']] = (childScope) => {
                        if (!childScope.row.extData) {
                            childScope.row.extData = {}
                        }
                        return (
                            childColumsInfo.valueType == 'fixed' ?
                                <span>{childScope.row[childColumsInfo.prop]}</span> :
                                <span>{childScope.row.extData[childColumsInfo.prop]}</span>
                        )
                    }
                }
            })
            return (
                <kevinTable key={Math.random()} scopedSlots={scopedSlots} columns={item.childTableColums}
                    data={parentScope.row.subInfoGiveList} style="width:100%;"></kevinTable>
            )
        },
        /**
         * @author Coder
         * @date 2023/3/21
         * @des 列渲染方法
         */
        doSlotRenderEvents(events, row) {
            var doEvents = new Function('row', events)
            return doEvents(row)
        },
        //table内按钮事件实现
        tableButtonEvents(events, scope, item) {
            let doEvents = new Function('item', 'index', events)
            doEvents(item, scope.$index)
            console.log(this.bolckFormParams)

        },
        /**
         * @author Coder
         * @date 2023/3/21
         * @des 表单link点击事件实现
         */
        e_linkEvents(events, scope, item, blockInfo) {
            var doEvents = new Function('blockInfo', 'item', 'row', events)
            doEvents(blockInfo, item, scope.row)
        },
        /**
         * @author Coder
         * @date 2023/3/21
         * @des 渲染table上方的按钮
         */
        renderTableTopButton(item) {
            if (item.tableButtons && item.tableButtons.length > 0) {
                return (
                    item.tableButtons.map(tbInfo => {
                        if (!tbInfo.isHide) {
                            return (
                                <el-button style="margin-bottom:10px" type="primary"
                                    size="mini" onClick={() => {
                                        eval(tbInfo.events)
                                    }}>{tbInfo.label}</el-button>
                            )
                        }

                    })
                )

            }
        },
        /**
         * @author Coder
         * @date 2023/3/21
         * @des table顶部按钮事件
         */
        e_tableTopButtonEvents(events, tbInfo) {
            var that = this
            this.dialogWidget = tbInfo.widgetBody
            var dd = new Function(['that', 'tbInfo'], events)
            dd(that)
        },
        /**
         * @author Coder
         * @date 2023/3/22
         * @des 渲染el-button
         */
        renderELButton(item, index) {
            if (item.formList && item.formList.length > 0) {
                return (
                    <el-col span={item.col}>
                        {
                            item.formList.map(buttonInfo => {
                                if (buttonInfo.isHide == true) {
                                    return ('')
                                } else {
                                    return (
                                        <el-button type={buttonInfo.type ? buttonInfo.type : '-'}
                                            size={buttonInfo.size ? buttonInfo.size : '-'}
                                            onClick={() => {
                                                buttonInfo.events ? eval(buttonInfo.events) : ''
                                            }}

                                        >
                                            {buttonInfo.label}
                                        </el-button>
                                    )
                                }
                            })
                        }
                    </el-col>
                )
            }
        },
        renderKevinImage(params, index) {
            console.log('装配图渲染', params)
            return (
                <el-col key={index} span={params.col}>
                    <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                        <el-row>
                            <el-col span={24}>
                                <div class="kevinimagearea">
                                    {
                                        params.options.fileList.length != 0 ? params.options.fileList.map((fileInfo, fileIndex) => {
                                            return (
                                                <div class="ki-list">
                                                    <el-image
                                                        style="width: 150px; height: 150px"
                                                        preview-src-list={[fileInfo.showUrl]}
                                                        src={fileInfo.showUrl}
                                                    ></el-image>
                                                    <el-row>
                                                        <el-col span={24}>
                                                            <i class="el-icon-download kil-icon ki-upload" onClick={() => { this.downloadKevinImage(fileInfo) }}></i>
                                                        </el-col>
                                                    </el-row>

                                                </div>
                                            )
                                        }) : ''
                                    }
                                </div>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            )
        },
        //下载
        downloadKevinImage(fileInfo) {
            if (fileInfo.type == 'file') {
                // window.location.href = window.globalEnv.VUE_APP_BASE_API + '/common/uploadFileDownload?fileName=' + fileInfo.fileName + '&filePath=' + fileInfo.url
                this.downloadFileByName(fileInfo)
            } else if (fileInfo.type == 'base64') {
                this.downloadBase64Image(fileInfo.showUrl, new Date().getTime() + '.jpg');
            }
        },

    },
    render(createElement, context) {
        return (
            <div class="container">
                <draggable list={this.formJSON} animation={340} group={this.group} ghostClass={this.ghostClass}
                    disabled={this.microStore.state.system.closeDrag}
                    className="drag-wrapper"
                >
                    {
                        this.formJSON.map((item, index) => {
                            switch (item.component) {
                                case 'el-autocomplete':
                                    return (this.renderELAutocomplete(item, index))
                                    break
                                case 'el-input':
                                case 'input':
                                case 'textarea':
                                    return (this.renderELInput(item, index))
                                    break
                                case 'el-input-number':
                                case 'number':
                                    return (this.renderELInputNumber(item, index))
                                    break
                                case 'el-select':
                                case 'select':
                                    return (this.renderELSelect(item, index))
                                    break
                                case 'el-date-picker':
                                case 'date':
                                    return (this.renderELDatePicker(item, index))
                                    break
                                case 'el-time-select':
                                case 'time':
                                    return (this.renderELTimeSelct(item, index))
                                    break
                                case 'el-radio':
                                case 'radio':
                                    return (this.renderELRadio(item, index))
                                    break
                                case 'el-switch':
                                    return (this.renderELSwitch(item, index))
                                    break
                                case 'el-checkbox':
                                case 'checkbox':
                                    return (this.renderELCheckBox(item, index))
                                    break
                                case 'el-upload':
                                    return (this.renderELUpload(item, index))
                                    break;
                                case 'el-table':
                                    return (this.renderELTable(item, index))
                                    break
                                case 'el-table-tree':
                                    return (this.renderELTreeTable(item, index))
                                    break
                                case 'el-button':
                                    return (this.renderELButton(item, index))
                                    break;
                                case 'kevin-image':
                                    return (this.renderKevinImage(item, index))
                                    break;
                            }
                        })
                    }
                </draggable>
            </div>
        )
    }
}
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    background-color: #fff;
}

.el-row>div {
    width: 100%;
}

.el-col {
    position: relative;

    .deleteItemIcon {
        width: 15px;
        height: 15px;
        position: absolute;
        left: -4px;
        top: -2px;
        cursor: pointer;
    }
}

.ghost {
    background-color: #66b1ff !important;
}

.removearea {
    width: 100%;
    height: 44px;
    background: rgba(255, 255, 255, 0.4);
    position: absolute;
    z-index: 22;
    border-radius: 6px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.buttonArea {
    display: flex;
    flex-direction: column;
    align-items: center;

    .el-button+.el-button,
    .el-checkbox.is-bordered+.el-checkbox.is-bordered {
        margin-left: 0;
        margin-top: 10px
    }
}

/deep/ .tableSlotInput .el-input__inner {
    text-align: center;
}

.kevinimagearea {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 20px 0;

    .ki-list {
        margin-right: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;

        .kil-icon {
            font-size: 18px;
            display: inline-block;
            margin-top: 25px;
            cursor: pointer;
        }

        .ki-upload {
            color: green;
            margin-right: 20px;
        }

        .ki-delete {
            color: red;
        }
    }
}</style>

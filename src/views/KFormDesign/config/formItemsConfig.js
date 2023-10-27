/*
 * author kcz
 * date 2019-11-20
 * description 表单控件项
 */
// 基础控件
export const basicsList = [
	{
		type: "input", // 表单类型
		label: "输入框", // 标题文字
		icon: "icon-write",
		options: {
			type: "text",
			width: "100%", // 宽度
			defaultValue: "", // 默认值
			placeholder: "请输入", // 没有输入时，提示文字
			clearable: false,
			maxLength: null,
			hidden: false, // 是否隐藏，false显示，true隐藏
			disabled: false, // 是否禁用，false不禁用，true禁用
			showOnList: true,
			showOnQuery: true,
			tableColumn: false,
			dynamicUrl: "",
		},
		model: "", // 数据字段
		key: "",
		rules: [
			//验证规则
			{
				required: false, // 必须填写
				message: "必填项"
			}
		]
	},
	{
		type: "search", // 表单类型
		label: "查询框", // 标题文字
		icon: "icon-write",
		options: {
			type: "text",
			handle: "dynamic",
			dynamicFun: "",
			width: "100%", // 宽度
			defaultValue: "", // 默认值
			placeholder: "请输入", // 没有输入时，提示文字
			clearable: false,
			maxLength: null,
			hidden: false, // 是否隐藏，false显示，true隐藏
			disabled: false, // 是否禁用，false不禁用，true禁用
			showOnList: true,
			showOnQuery: true,
			tableColumn: false,
			readonly: false,
			dynamicUrl: "",
		},
		model: "", // 数据字段
		key: "",
		rules: [
			//验证规则
			{
				required: false, // 必须填写
				message: "必填项"
			}
		]
	},
	{
		type: "textarea", // 表单类型
		label: "文本框", // 标题文字
		icon: "icon-edit",
		options: {
			width: "100%", // 宽度
			minRows: 4,
			maxRows: 6,
			maxLength: null,
			defaultValue: "",
			clearable: false,
			hidden: false, // 是否隐藏，false显示，true隐藏
			disabled: false,
			placeholder: "请输入",
			showOnList: true,
			showOnQuery: true,
			tableColumn: false,
		},
		model: "", // 数据字段
		key: "",
		rules: [
			{
				required: false,
				message: "必填项"
			}
		]
	},
	{
		type: "number", // 表单类型
		label: "数字输入框", // 标题文字
		icon: "icon-number",
		options: {
			width: "100%", // 宽度
			defaultValue: 0, // 默认值
			min: null, // 可输入最小值
			max: null, // 可输入最大值
			precision: null,
			step: 1, // 步长，点击加减按钮时候，加减多少
			hidden: false, // 是否隐藏，false显示，true隐藏
			disabled: false, //是否禁用
			placeholder: "请输入",
			showOnList: true,
			showOnQuery: true,
			tableColumn: false,
		},
		model: "", // 数据字段
		key: "",
		rules: [
			{
				required: false,
				message: "必填项"
			}
		]
	},
	{
		type: "select", // 表单类型
		label: "下拉选择器", // 标题文字
		icon: "icon-xiala",
		options: {
			width: "100%", // 宽度
			defaultValue: undefined, // 下拉选框请使用undefined为默认值
			multiple: false, // 是否允许多选
			disabled: false, // 是否禁用
			clearable: false, // 是否显示清除按钮
			hidden: false, // 是否隐藏，false显示，true隐藏
			placeholder: "请选择", // 默认提示文字
			dynamicKey: "",
			dynamic: false,
			dynamicGetUrl: "",
			dynamicGetKey: "dictValue",
			dynamicGetValue: "dictLabel",
			options: [
				// 下拉选择项配置
				{
					value: 1,
					label: "下拉框1"
				}
			],
			showSearch: false // 是否显示搜索框，搜索选择的项的值，而不是文字
			,
			showOnList: true,
			showOnQuery: true,
			tableColumn: false,
			tags: false,
		},
		model: "",
		key: "",
		rules: [
			{
				required: false,
				message: "必填项"
			}
		]
	},
	{
		type: "checkbox",
		label: "多选框",
		icon: "icon-duoxuan1",
		options: {
			disabled: false, //是否禁用
			hidden: false, // 是否隐藏，false显示，true隐藏
			defaultValue: [],
			dynamicUrl: "",
			dynamicKey: "",
			dynamicGetUrl: "",
			dynamicGetKey: "dictValue",
			dynamicGetValue: "dictLabel",
			dynamic: false,
			options: [
				{
					value: 1,
					label: "选项1"
				},
				{
					value: 2,
					label: "选项2"
				},
				{
					value: 3,
					label: "选项3"
				}
			],
			showOnList: true,
			showOnQuery: true,
			tableColumn: false,
		},
		model: "",
		key: "",
		rules: [
			{
				required: false,
				message: "必填项"
			}
		]
	},
	{
		type: "radio", // 表单类型
		label: "单选框", // 标题文字
		icon: "icon-danxuan-cuxiantiao",
		options: {
			disabled: false, //是否禁用
			hidden: false, // 是否隐藏，false显示，true隐藏
			defaultValue: "", // 默认值
			dynamicKey: "",
			dynamic: false,
			options: [
				{
					value: 1,
					label: "选项1"
				},
				{
					value: 2,
					label: "选项2"
				},
				{
					value: 3,
					label: "选项3"
				}
			],
			showOnList: true,
			showOnQuery: true,
			tableColumn: false,
		},
		model: "",
		key: "",
		rules: [
			{
				required: false,
				message: "必填项"
			}
		]
	},
	{
		type: "date", // 表单类型
		label: "日期选择框", // 标题文字
		icon: "icon-calendar",
		options: {
			width: "100%", // 宽度
			defaultValue: "", // 默认值，字符串 12:00:00
			rangeDefaultValue: [], // 默认值，字符串 12:00:00
			range: false, // 范围日期选择，为true则会显示两个时间选择框（同时defaultValue和placeholder要改成数组），
			showTime: false, // 是否显示时间选择器
			disabled: false, // 是否禁用
			hidden: false, // 是否隐藏，false显示，true隐藏
			clearable: false, // 是否显示清除按钮
			placeholder: "请选择",
			rangePlaceholder: ["开始时间", "结束时间"],
			format: "YYYY-MM-DD" // 展示格式  （请按照这个规则写 YYYY-MM-DD HH:mm:ss，区分大小写）
			,
			showOnList: true,
			showOnQuery: true,
			tableColumn: false,
		},
		model: "",
		key: "",
		rules: [
			{
				required: false,
				message: "必填项"
			}
		]
	},
	{
		type: "time", // 表单类型
		label: "时间选择框", // 标题文字
		icon: "icon-time",
		options: {
			width: "100%", // 宽度
			defaultValue: "", // 默认值，字符串 12:00:00
			disabled: false, // 是否禁用
			hidden: false, // 是否隐藏，false显示，true隐藏
			clearable: false, // 是否显示清除按钮
			placeholder: "请选择",
			format: "HH:mm:ss" // 展示格式
			,
			showOnList: true,
			showOnQuery: true,
			tableColumn: false,
		},
		model: "",
		key: "",
		rules: [
			{
				required: false,
				message: "必填项"
			}
		]
	},
	{
		type: "rate", // 表单类型
		label: "评分", // 标题文字
		icon: "icon-pingfen_moren",
		options: {
			defaultValue: 0,
			max: 5, // 最大值
			disabled: false, // 是否禁用
			hidden: false, // 是否隐藏，false显示，true隐藏
			allowHalf: false // 是否允许半选
			,
			showOnList: true,
			showOnQuery: true,
			tableColumn: false,
		},
		model: "",
		key: "",
		rules: [
			{
				required: false,
				message: "必填项"
			}
		]
	},
	{
		type: "slider", // 表单类型
		label: "滑动输入条", // 标题文字
		icon: "icon-menu",
		options: {
			width: "100%", // 宽度
			defaultValue: 0, // 默认值， 如果range为true的时候，则需要改成数组,如：[12,15]
			disabled: false, // 是否禁用
			hidden: false, // 是否隐藏，false显示，true隐藏
			min: 0, // 最小值
			max: 100, // 最大值
			step: 1, // 步长，取值必须大于 0，并且可被 (max - min) 整除
			showInput: false // 是否显示输入框，range为true时，请勿开启
			// range: false // 双滑块模式
			,
			showOnList: true,
			showOnQuery: true,
			tableColumn: false,
		},
		model: "",
		key: "",
		rules: [
			{
				required: false,
				message: "必填项"
			}
		]
	},
	{
		type: "uploadFile", // 表单类型
		label: "上传文件", // 标题文字
		icon: "icon-upload",
		options: {
			defaultValue: "[]",
			multiple: false,
			disabled: false,
			hidden: false, // 是否隐藏，false显示，true隐藏
			drag: false,
			downloadWay: "a",
			dynamicFun: "",
			width: "100%",
			limit: 3,
			data: "{}",
			fileName: "image",
			headers: {},
			action: "/common/uploadImg",
			placeholder: "上传"
			,
			showOnList: true,
			showOnQuery: true,
			tableColumn: false,
		},
		model: "",
		key: "",
		rules: [
			{
				required: false,
				message: "必填项"
			}
		]
	},
	{
		type: "uploadImg",
		label: "上传图片",
		icon: "icon-image",
		options: {
			defaultValue: "[]",
			multiple: false,
			hidden: false, // 是否隐藏，false显示，true隐藏
			disabled: false,
			width: "100%",
			data: "{}",
			limit: 3,
			placeholder: "上传",
			fileName: "image",
			headers: {},
			action: "/common/uploadImg",
			listType: "picture-card"
			,
			showOnList: true,
			showOnQuery: true,
			tableColumn: false,
		},
		model: "",
		key: "",
		rules: [
			{
				required: false,
				message: "必填项"
			}
		]
	},
	{
		type: "treeSelect", // 表单类型
		label: "树选择器", // 标题文字
		icon: "icon-tree",
		options: {
			disabled: false, //是否禁用
			defaultValue: undefined, // 默认值
			multiple: false,
			hidden: false, // 是否隐藏，false显示，true隐藏
			clearable: false, // 是否显示清除按钮
			showSearch: false, // 是否显示搜索框，搜索选择的项的值，而不是文字
			treeCheckable: false,
			placeholder: "请选择",
			dynamicKey: "",
			dynamic: true,
			options: [
				{
					value: 1,
					label: "选项1",
					children: [
						{
							value: 11,
							label: "选项11"
						}
					]
				},
				{
					value: 2,
					label: "选项2",
					children: [
						{
							value: 22,
							label: "选项22"
						}
					]
				}
			]
		},
		model: "",
		key: "",
		rules: [
			{
				required: false,
				message: "必填项"
			}
		]
	},
	{
		type: "cascader", // 表单类型
		label: "级联选择器", // 标题文字
		icon: "icon-guanlian",
		options: {
			disabled: false, //是否禁用
			hidden: false, // 是否隐藏，false显示，true隐藏
			defaultValue: undefined, // 默认值
			showSearch: false, // 是否显示搜索框，搜索选择的项的值，而不是文字
			placeholder: "请选择",
			clearable: false, // 是否显示清除按钮
			dynamicKey: "",
			dynamic: true,
			options: [
				{
					value: 1,
					label: "选项1",
					children: [
						{
							value: 11,
							label: "选项11"
						}
					]
				},
				{
					value: 2,
					label: "选项2",
					children: [
						{
							value: 22,
							label: "选项22"
						}
					]
				}
			]
		},
		model: "",
		key: "",
		rules: [
			{
				required: false,
				message: "必填项"
			}
		]
	},
	{
		type: "batch",
		label: "动态表格",
		icon: "icon-biaoge",
		list: [],
		options: {
			scrollY: 0,
			disabled: false,
			hidden: false, // 是否隐藏，false显示，true隐藏
			showLabel: false,
			hideSequence: false,
			width: "100%"
		},
		model: "",
		key: ""
	},
	{
		type: "editor",
		label: "富文本",
		icon: "icon-LC_icon_edit_line_1",
		list: [],
		options: {
			height: 300,
			placeholder: "请输入",
			defaultValue: "",
			chinesization: true,
			hidden: false, // 是否隐藏，false显示，true隐藏
			disabled: false,
			showLabel: false,
			width: "100%"
		},
		model: "",
		key: "",
		rules: [
			{
				required: false,
				message: "必填项"
			}
		]
	},
	{
		type: "switch", // 表单类型
		label: "开关", // 标题文字
		icon: "icon-kaiguan3",
		options: {
			defaultValue: false, // 默认值 Boolean 类型
			hidden: false, // 是否隐藏，false显示，true隐藏
			disabled: false // 是否禁用
			,
			showOnList: true,
			showOnQuery: true,
			tableColumn: false,
		},
		model: "",
		key: "",
		rules: [
			{
				required: false,
				message: "必填项"
			}
		]
	},
	{
		type: "button", // 表单类型
		label: "按钮", // 标题文字
		icon: "icon-button-remove",
		options: {
			type: "primary",
			handle: "submit",
			dynamicFun: "",
			hidden: false, // 是否隐藏，false显示，true隐藏
			disabled: false // 是否禁用，false不禁用，true禁用
		},
		key: ""
	},
	{
		type: "alert",
		label: "警告提示",
		icon: "icon-zu",
		options: {
			type: "success",
			description: "",
			showIcon: false,
			banner: false,
			hidden: false, // 是否隐藏，false显示，true隐藏
			closable: false
		},
		key: ""
	},
	{
		type: "text",
		label: "文字",
		icon: "icon-zihao",
		options: {
			textAlign: "left",
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false
		},
		key: ""
	},
	{
		type: "html",
		label: "HTML",
		icon: "icon-ai-code",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			defaultValue: "<strong>HTML</strong>"
		},
		key: ""
	}, {
		type: "plan",
		label: "执行计划",
		icon: "icon-biaoge",
		list: [
			//采样默认值
			{
				type: "input", // 表单类型
				label: "点位名称", // 标题文字
				icon: "icon-write",
				options: {
					type: "text",
					width: "100%", // 宽度
					defaultValue: "", // 默认值
					placeholder: "请输入", // 没有输入时，提示文字
					clearable: false,
					maxLength: null,
					hidden: false, // 是否隐藏，false显示，true隐藏
					disabled: false, // 是否禁用，false不禁用，true禁用
					showOnList: true,
					showOnQuery: true,
					tableColumn: true,
				},
				model: "pointName", // 数据字段
				key: "pointName",
				rules: [
					//验证规则
					{
						required: true, // 必须填写
						message: "必填项"
					}
				],
				planType: 1
			},
			{
				type: "input", // 表单类型
				label: "位置说明", // 标题文字
				icon: "icon-write",
				options: {
					type: "text",
					width: "100%", // 宽度
					defaultValue: "", // 默认值
					placeholder: "请输入", // 没有输入时，提示文字
					clearable: false,
					maxLength: null,
					hidden: false, // 是否隐藏，false显示，true隐藏
					disabled: false, // 是否禁用，false不禁用，true禁用
					showOnList: true,
					showOnQuery: true,
					tableColumn: true,
				},
				model: "placeExplain", // 数据字段
				key: "placeExplain",
				rules: [
					//验证规则
					{
						required: false, // 必须填写
						message: "必填项"
					}
				],
				planType: 1
			},
			{
				type: "input", // 表单类型
				label: "布点意义", // 标题文字
				icon: "icon-write",
				options: {
					type: "text",
					width: "100%", // 宽度
					defaultValue: "", // 默认值
					placeholder: "请输入", // 没有输入时，提示文字
					clearable: false,
					maxLength: null,
					hidden: false, // 是否隐藏，false显示，true隐藏
					disabled: false, // 是否禁用，false不禁用，true禁用
					showOnList: true,
					showOnQuery: true,
					tableColumn: true,
				},
				model: "pointMeaning", // 数据字段
				key: "pointMeaning",
				rules: [
					//验证规则
					{
						required: false, // 必须填写
						message: "必填项"
					}
				],
				planType: 1
			},
			{
				type: "input", // 表单类型
				label: "检测天数", // 标题文字
				icon: "icon-write",
				options: {
					type: "text",
					width: "100%", // 宽度
					defaultValue: "", // 默认值
					placeholder: "请输入", // 没有输入时，提示文字
					clearable: false,
					maxLength: null,
					hidden: false, // 是否隐藏，false显示，true隐藏
					disabled: false, // 是否禁用，false不禁用，true禁用
					showOnList: true,
					showOnQuery: true,
					tableColumn: true,
				},
				model: "detectDays", // 数据字段
				key: "detectDays",
				rules: [
					//验证规则
					{
						required: true, // 必须填写
						message: "必填项"
					}
				],
				planType: 1
			},
			{
				type: "input", // 表单类型
				label: "检测项目", // 标题文字
				icon: "icon-write",
				options: {
					type: "text",
					width: "100%", // 宽度
					defaultValue: "", // 默认值
					placeholder: "请输入", // 没有输入时，提示文字
					clearable: false,
					maxLength: null,
					hidden: false, // 是否隐藏，false显示，true隐藏
					disabled: false, // 是否禁用，false不禁用，true禁用
					showOnList: true,
					showOnQuery: true,
					tableColumn: true,
				},
				model: "detectItem", // 数据字段
				key: "detectItem",
				rules: [
					//验证规则
					{
						required: false, // 必须填写
						message: "必填项"
					}
				],
				planType: 1
			},
			//送样默认值
			{
				key: "search_1605854507694",
				icon: "icon-write",
				type: "search",
				label: "检测类别",
				model: "detectType",
				rules: [
					{
						message: "必填项",
						required: true
					}
				],
				options: {
					type: "text",
					width: "100%",
					handle: "dynamic",
					hidden: false,
					disabled: false,
					clearable: false,
					maxLength: null,
					dynamicFun: "",
					dynamicUrl: "",
					showOnList: false,
					placeholder: "请输入",
					showOnQuery: false,
					tableColumn: true,
					defaultValue: ""
				},
				planType: 2
			},
			{
				key: "input_1605854537442",
				icon: "icon-write",
				type: "input",
				label: "样品名称",
				model: "sampleName",
				rules: [
					{
						message: "必填项",
						required: true
					}
				],
				options: {
					type: "text",
					width: "100%",
					hidden: false,
					disabled: false,
					clearable: false,
					maxLength: null,
					dynamicUrl: "",
					showOnList: false,
					placeholder: "请输入",
					showOnQuery: false,
					tableColumn: true,
					defaultValue: ""
				},
				planType: 2
			},
			{
				key: "number_1605854567874",
				icon: "icon-number",
				type: "input",
				label: "样品数量",
				model: "sampleNumber",
				rules: [
					{
						message: "必填项",
						required: false
					}
				],
				options: {
					max: null,
					min: null,
					step: 1,
					width: "100%",
					hidden: false,
					disabled: false,
					precision: null,
					showOnList: false,
					placeholder: "请输入",
					showOnQuery: false,
					tableColumn: true,
					defaultValue: 0
				},
				planType: 2
			},
			{
				key: "select_1605854595686",
				icon: "icon-xiala",
				type: "select",
				label: "样品状态",
				model: "sampleStatus",
				rules: [
					{
						message: "必填项",
						required: false
					}
				],
				options: {
					tags: false,
					width: "100%",
					hidden: false,
					dynamic: false,
					options: [
						{
							label: "液态",
							value: 1
						},
						{
							label: "固态",
							value: "2"
						}
					],
					disabled: false,
					multiple: false,
					clearable: false,
					dynamicKey: "",
					showOnList: false,
					showSearch: false,
					placeholder: "请选择",
					showOnQuery: false,
					tableColumn: true,
					defaultValue: 1
				},
				planType: 2
			},
			{
				key: "select_1605855214589",
				icon: "icon-xiala",
				type: "select",
				label: "保存条件",
				model: "saveConditionId",
				rules: [
					{
						message: "必填项",
						required: false
					}
				],
				options: {
					tags: false,
					width: "100%",
					hidden: false,
					dynamic: true,
					disabled: false,
					multiple: true,
					clearable: false,
					dynamicKey: "",
					showOnList: false,
					showSearch: false,
					placeholder: "请选择",
					showOnQuery: false,
					tableColumn: true,
					dynamicGetKey: "dictCode",
					dynamicGetUrl: "/v1/detectSchemes/conditionsList",
					dynamicGetValue: "dictLabel"
				},
				planType: 2
			},
			{
				key: "input_1605855439431",
				icon: "icon-write",
				type: "input",
				label: "送样信息",
				model: "sampleInfo",
				rules: [
					{
						"message": "必填项",
						"required": false
					}
				],
				options: {
					type: "text",
					width: "100%",
					hidden: false,
					disabled: false,
					clearable: false,
					maxLength: null,
					dynamicUrl: "",
					showOnList: true,
					placeholder: "请输入",
					showOnQuery: true,
					tableColumn: true,
					defaultValue: ""
				},
				planType: 2
			},
			{
				type: "input", // 表单类型
				label: "检测项目", // 标题文字
				icon: "icon-write",
				options: {
					type: "text",
					width: "100%", // 宽度
					defaultValue: "", // 默认值
					placeholder: "请输入", // 没有输入时，提示文字
					clearable: false,
					maxLength: null,
					hidden: false, // 是否隐藏，false显示，true隐藏
					disabled: false, // 是否禁用，false不禁用，true禁用
					showOnList: true,
					showOnQuery: true,
					tableColumn: true,
				},
				model: "detectItem", // 数据字段
				key: "detectItem",
				rules: [
					//验证规则
					{
						required: false, // 必须填写
						message: "必填项"
					}
				],
				planType: 2
			}
		],
		options: {
			scrollY: 0,
			disabled: false,
			hidden: false, // 是否隐藏，false显示，true隐藏
			showLabel: false,
			hideSequence: false,
			width: "100%"
		},
		model: "",
		key: ""
	},
	//委托协议分包
	{
		type: "selectEntrustPackage",
		//text
		label: "委托协议分包",
		icon: "icon-zihao",
		options: {
			textAlign: "left",
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false
		},
		key: ""
	},
	//分包委托
	{
		type: "subcontractCommissioned",
		//text
		label: "分包委托",
		icon: "icon-zihao",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false
		},
		key: ""
	},
	//仪器使用记录
	{
		type: "instrumentUseRecord",
		label: "仪器使用记录",
		icon: "icon-zihao",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	//标准物质使用记录
	{
		type: "referenceMaterialRecord",
		label: "标准物质使用记录",
		icon: "icon-zihao",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	//色谱文件
	{
		type: "chromatographicFile",
		label: "色谱文件",
		icon: "icon-zihao",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},

	//记录单控件 start

	// 气象信息1
	{
		"type": "grid",
		"vType": "meteorologicalGas",
		"label": "气象信息",
		"columns": [
			{
				"span": 24,
				"list": [
					{
						"type": "divider",
						"label": "气象信息",
						"icon": "icon-fengexian",
						"options": {
							"orientation": ""
						},
						"key": "divider_1629190475837"
					},
					{
						"type": "grid",
						"label": "栅格布局",
						"columns": [
							{
								"span": 4,
								"list": [
									{
										"type": "input",
										"label": "气温(℃)",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "temperature",
										"key": "input_1629190339148",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							},
							{
								"span": 4,
								"list": [
									{
										"type": "input",
										"label": "湿度",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "humidity",
										"key": "input_1629190342519",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							},
							{
								"span": 4,
								"list": [
									{
										"type": "input",
										"label": "气压(hPa)",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "atmosphericPressure",
										"key": "input_1629190344385",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							},
							{
								"span": 4,
								"list": [
									{
										"type": "input",
										"label": "风速(m/s)",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "windVelocity",
										"key": "input_1629190346453",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							},
							{
								"span": 4,
								"list": [
									{
										"type": "input",
										"label": "风向",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "windDirection",
										"key": "input_1629190348605",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							},
							{
								"span": 4,
								"list": [
									{
										"type": "input",
										"label": "天气情况",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "weatherCondition",
										"key": "input_1629190350825",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							}
						],
						"options": {
							"gutter": 0
						},
						"key": "grid_1629190202323"
					}
				]
			}
		],
		"options": {
			"gutter": 0
		},
		"key": "grid_1629190267223"
	},
	// 2021年8月20日 Start
	// 水质
	{
		"type": "grid",
		"vType": "waterQuality",
		"label": "水质信息",
		"columns": [
			{
				"span": 24,
				"list": [
					{
						"type": "divider",
						"label": "水质信息",
						"icon": "icon-fengexian",
						"options": {
							"orientation": ""
						},
						"key": "divider_1629250174950"
					},
					{
						"type": "grid",
						"label": "栅格布局",
						"icon": "icon-zhage",
						"columns": [
							{
								"span": 4,
								"list": [
									{
										"type": "input",
										"label": "水温(℃)",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "waterTemperature",
										"key": "waterTemperature",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							},
							{
								"span": 4,
								"list": [
									{
										"type": "input",
										"label": "流量(m³/h)",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "waterFlow",
										"key": "waterFlow",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							},
							{
								"span": 4,
								"list": [
									{
										"type": "input",
										"label": "流速(m/s)",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "waterVelocityFlow",
										"key": "waterVelocityFlow",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							},
							{
								"span": 3,
								"list": [
									{
										"type": "input",
										"label": "河宽（m）",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "waterRiverWidth",
										"key": "waterRiverWidth",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							},
							{
								"span": 3,
								"list": [
									{
										"type": "input",
										"label": "河深（m）",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "waterRiverDepth",
										"key": "waterRiverDepth",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							},
							{
								"span": 3,
								"list": [
									{
										"type": "input",
										"label": "井深（m）",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "waterWellDepth",
										"key": "waterWellDepth",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							},
							{
								"span": 3,
								"list": [
									{
										"type": "input",
										"label": "埋深（m）",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "waterBuriedDepth",
										"key": "waterBuriedDepth",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							}
						],
						"options": {
							"gutter": 0
						},
						"key": "grid_1629250187960"
					}
				]
			}
		],
		"options": {
			"gutter": 0
		},
		"key": "grid_1629250161613"
	},
	// 车辆
	{
		"type": "grid",
		"vType": "carInfo",
		"label": "车辆信息",
		"columns": [
			{
				"span": 24,
				"list": [
					{
						"type": "divider",
						"label": "车辆信息",
						"icon": "icon-fengexian",
						"options": {
							"orientation": ""
						},
						"key": "divider_1629340026444"
					},
					{
						"type": "grid",
						"label": "栅格布局",
						"icon": "icon-zhage",
						"columns": [
							{
								"span": 8,
								"list": [
									{
										"type": "input",
										"label": "大型(辆)",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "carQuantityLarge",
										"key": "input_1629340059578",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							},
							{
								"span": 8,
								"list": [
									{
										"type": "input",
										"label": "中型(辆)",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "carQuantityMiddle",
										"key": "input_1629340061362",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							},
							{
								"span": 8,
								"list": [
									{
										"type": "input",
										"label": "小型(辆)",
										"icon": "icon-write",
										"options": {
											"type": "text",
											"width": "100%",
											"defaultValue": "",
											"placeholder": "请输入",
											"clearable": false,
											"maxLength": null,
											"hidden": false,
											"disabled": false,
											"showOnList": true,
											"showOnQuery": true,
											"tableColumn": false,
											"dynamicUrl": ""
										},
										"model": "carQuantitySmall",
										"key": "input_1629340063554",
										"rules": [
											{
												"required": false,
												"message": "必填项"
											}
										]
									}
								]
							}
						],
						"options": {
							"gutter": 0
						},
						"key": "grid_1629340048784"
					}
				]
			}
		],
		"options": {
			"gutter": 0
		},
		"key": "grid_1629340017475"
	},
	// 锅炉/炉窑信息
	{
		"type": "grid",
		"vType": "boilerInformation",
		"label": "锅炉/炉窑信息",
		"columns": [
			{
				"span": 24,
				"list": [
					{
						"type": "divider",
						"label": "锅炉/炉窑信息",
						"options": {
							"orientation": ""
						},
						"key": "divider_1644808971396"
					}
				]
			},
			{
				"span": 4,
				"list": [
					{
						"type": "input",
						"label": "锅炉/窑炉吨数",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "boilerTonnes",
						"key": "input_1644808876926",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 4,
				"list": [
					{
						"type": "input",
						"label": "燃料类型",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "boilerFuelType",
						"key": "input_1644808879896",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 4,
				"list": [
					{
						"type": "input",
						"label": "锅炉编号",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "boilerNumber",
						"key": "input_1644808882133",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 4,
				"list": [
					{
						"type": "input",
						"label": "锅炉型号",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "boilerModel",
						"key": "input_1644808884516",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 4,
				"list": [
					{
						"type": "input",
						"label": "使用时间",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "boilerUsageTime",
						"key": "input_1644808887436",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 4,
				"list": [
					{
						"type": "input",
						"label": "采样嘴直径",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "boilerDiameter",
						"key": "input_1644808889511",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 4,
				"list": [
					{
						"type": "input",
						"label": "锅炉（炉窑）负荷",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "boilerLoad",
						"key": "input_1644808889555",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 4,
				"list": [
					{
						"type": "input",
						"label": "治理设施",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "boilerControl",
						"key": "input_1644808891608",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 4,
				"list": [
					{
						"type": "input",
						"label": "烟囱高度",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "boilerChimneyHeight",
						"key": "input_1644808893893",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 4,
				"list": [
					{
						"type": "input",
						"label": "截面规格",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "boilerSectionSpecifications",
						"key": "input_1644808896312",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 4,
				"list": [
					{
						"type": "input",
						"label": "截面面积",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "boilerSectionalArea",
						"key": "input_1644808898998",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			}
		],
		"options": {
			"gutter": 0
		},
		"key": "grid_1644808823287"
	},
	// 油烟信息
	{
		"type": "grid",
		"vType": "fumeInformation",
		"label": "油烟信息",
		"columns": [
			{
				"span": 24,
				"list": [
					{
						"type": "divider",
						"label": "油烟信息",
						"icon": "icon-fengexian",
						"options": {
							"orientation": ""
						},
						"key": "divider_1644816763792"
					}
				]
			},
			{
				"span": 5,
				"list": [
					{
						"type": "input",
						"label": "处理装置名称",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "fumeName",
						"key": "input_1644816811893",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 5,
				"list": [
					{
						"type": "input",
						"label": "风机风量",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "fumeAirVolume",
						"key": "input_1644816814009",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 5,
				"list": [
					{
						"type": "input",
						"label": "治理设施",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "fumeControl",
						"key": "input_1644816816628",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 4,
				"list": [
					{
						"type": "input",
						"label": "基准灶头",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "fumeBenchmarkBurner",
						"key": "input_1644816818997",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 5,
				"list": [
					{
						"type": "input",
						"label": "燃料类型",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "fumeFuelType",
						"key": "input_1644816821500",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 5,
				"list": [
					{
						"type": "input",
						"label": "排风罩面积",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "fumeHoodArea",
						"key": "input_1644816824020",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 5,
				"list": [
					{
						"type": "input",
						"label": "烟囱高度",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "fumeChimneyHeight",
						"key": "input_1644816826455",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 5,
				"list": [
					{
						"type": "input",
						"label": "截面规格",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "fumeSectionSpecifications",
						"key": "input_1644816829859",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 4,
				"list": [
					{
						"type": "input",
						"label": "截面面积",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "fumeSectionalArea",
						"key": "input_1644816832995",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			},
			{
				"span": 5,
				"list": [
					{
						"type": "input",
						"label": "炉数详情",
						"icon": "icon-write",
						"options": {
							"type": "text",
							"width": "100%",
							"defaultValue": "",
							"placeholder": "请输入",
							"clearable": false,
							"maxLength": null,
							"hidden": false,
							"disabled": false,
							"showOnList": true,
							"showOnQuery": true,
							"tableColumn": false,
							"dynamicUrl": ""
						},
						"model": "fumeDetail",
						"key": "input_1644816835364",
						"rules": [
							{
								"required": false,
								"message": "必填项"
							}
						]
					}
				]
			}
		],
		"options": {
			"gutter": 0
		},
		"key": "grid_1644816755432"
	},

	// 气象信息2
	// {
	// 	type: "meteorologicalSound",
	// 	label: "气象信息2",
	// 	icon: "icon-zihao",
	// 	options: {
	// 		hidden: false, // 是否隐藏，false显示，true隐藏
	// 		showRequiredMark: false,
	// 		showOnList: false,
	// 		showOnQuery: false,
	// 		tableColumn: false
	// 	},
	// 	key: ""
	// },

	// 仪器信息
	{
		type: "instrumentInfo",
		label: "仪器信息",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// 环境空气采样信息
	{
		type: "sampleAirInfo",
		label: "环境空气采样",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// 气态污染物采样
	{
		type: "gaseousPollutants",
		label: "气态污染物采样",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// 恶臭采样
	{
		type: "stench",
		label: "恶臭采样",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// 水质采样
	{
		type: "waterQuality",
		label: "水质采样",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// 土壤采样
	{
		type: "soil",
		label: "土壤采样",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// 固废采样
	{
		type: "solidWaste",
		label: "固废采样",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},


	// 2021年8月20日 End
	// 2021年11月29日 start
	{
		type: "noiseScene",
		label: "噪声现场监测",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	{
		type: "smokePollution",
		label: "烟气监测",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	{
		type: "particulates",
		label: "颗粒物检测",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	{
		type: "lampblack",
		label: "油烟检测",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	{
		type: "smokeBlackness",
		label: "烟气黑度监测",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// 2021年11月29日 end
	// 地表水采样信息
	// {
	// 	type: "sampleWaterSurfaceInfo",
	// 	label: "地表水采样",
	// 	options: {
	// 		hidden: false, // 是否隐藏，false显示，true隐藏
	// 		showRequiredMark: false,
	// 		showOnList: false,
	// 		showOnQuery: false,
	// 		tableColumn: false
	// 	},
	// 	key: ""
	// },
	// // 地下水采样信息
	// {
	// 	type: "sampleWaterGround",
	// 	label: "地下水采样",
	// 	options: {
	// 		hidden: false, // 是否隐藏，false显示，true隐藏
	// 		showRequiredMark: false,
	// 		showOnList: false,
	// 		showOnQuery: false,
	// 		tableColumn: false
	// 	},
	// 	key: ""
	// },
	// // 废水采样信息
	// {
	// 	type: "sampleWaterWaste",
	// 	label: "废水采样",
	// 	options: {
	// 		hidden: false, // 是否隐藏，false显示，true隐藏
	// 		showRequiredMark: false,
	// 		showOnList: false,
	// 		showOnQuery: false,
	// 		tableColumn: false
	// 	},
	// 	key: ""
	// },
	// // 土壤采样信息
	// {
	// 	type: "sampleTerra",
	// 	label: "土壤采样",
	// 	options: {
	// 		hidden: false, // 是否隐藏，false显示，true隐藏
	// 		showRequiredMark: false,
	// 		showOnList: false,
	// 		showOnQuery: false,
	// 		tableColumn: false
	// 	},
	// 	key: ""
	// },
	// // 现场检测结果
	{
		type: "sceneDetect",
		label: "检测结果",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// 声级计
	{
		type: "soundLevelMeter",
		label: "声级计校正",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// 标气校准记录
	{
		type: "calibrationGas",
		label: "标气校准(电解)",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// 标气校准记录
	{
		type: "calibrationGasInfrared",
		label: "标气校准(红外)",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// PH计仪器校准
	{
		type: "calibrationPh",
		label: "PH计仪器校准",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// 浊度仪器校准
	{
		type: "calibrationTurbidity",
		label: "浊度仪器校准",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// 电导率仪器校准
	{
		type: "calibrationConductivity",
		label: "电导率仪器校准",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// 氧化还原电仪器校准
	{
		type: "calibrationOxidation",
		label: "氧化还原电校准",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// 溶解氧仪器校准
	{
		type: "calibrationDissolvedOxygen",
		label: "溶解氧仪器校准",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false
		},
		key: ""
	},
	// 嗓声校准值
	// {
	// 	type: "sceneNoiseCalibration",
	// 	label: "嗓声校准值",
	// 	options: {
	// 		hidden: false, // 是否隐藏，false显示，true隐藏
	// 		showRequiredMark: false,
	// 		showOnList: false,
	// 		showOnQuery: false,
	// 		tableColumn: false
	// 	},
	// 	key: ""
	// },
	// 嗓声检测信息
	// {
	// 	type: "sceneNoiseDetect",
	// 	label: "嗓声检测信息",
	// 	options: {
	// 		hidden: false, // 是否隐藏，false显示，true隐藏
	// 		showRequiredMark: false,
	// 		showOnList: false,
	// 		showOnQuery: false,
	// 		tableColumn: false
	// 	},
	// 	key: ""
	// },
	// 废气颗粒物检测信息
	// {
	// 	type: "sceneExhaustDetect",
	// 	label: "废气颗粒物检测信息",
	// 	options: {
	// 		hidden: false, // 是否隐藏，false显示，true隐藏
	// 		showRequiredMark: false,
	// 		showOnList: false,
	// 		showOnQuery: false,
	// 		tableColumn: false
	// 	},
	// 	key: ""
	// },
	// 颗粒物采样&现场-称量环境
	// {
	// 	type: "sceneWeighingEnvironment",
	// 	label: "称量环境",
	// 	options: {
	// 		hidden: false, // 是否隐藏，false显示，true隐藏
	// 		showRequiredMark: false,
	// 		showOnList: false,
	// 		showOnQuery: false,
	// 		tableColumn: false
	// 	},
	// 	key: ""
	// },
	//烟气黑度采样&现场
	// {
	// 	type: "sceneBlackness",
	// 	label: "烟气黑度",
	// 	options: {
	// 		hidden: false, // 是否隐藏，false显示，true隐藏
	// 		showRequiredMark: false,
	// 		showOnList: false,
	// 		showOnQuery: false,
	// 		tableColumn: false
	// 	},
	// 	key: ""
	// },
	//记录单控件 end

	// 公用表单
	{
		type: "sharedForm",
		label: "公用表单",
		icon: "icon-zihao",
		options: {
			hidden: false, // 是否隐藏，false显示，true隐藏
			showRequiredMark: false,
			showOnList: false,
			showOnQuery: false,
			tableColumn: false,
			hideOnMultipleInput: false,
		},
		key: ""
	},

];

// 高级控件
// export const highList = [];

// import { Alert } from "ant-design-vue";

// 自定义组件
export const customComponents = {
	title: "系统组件",
	list: [
		//动态公式容器
		{
			type: "dynamicFormula",
			label: "公式",
			icon: "icon-biaoge",
			list: [],
			options: {
				scrollY: 0,
				disabled: false,
				hidden: false, // 是否隐藏，false显示，true隐藏
				showLabel: false,
				hideSequence: false,
				width: "100%"
			},
			model: "",
			key: "",
			formType: 2,
		}, {
			type: "brackets",
			label: "括号",
			icon: "icon-biaoge",
			list: [],
			options: {
				scrollY: 0,
				disabled: false,
				hidden: false, // 是否隐藏，false显示，true隐藏
				showLabel: false,
				hideSequence: false,
				width: "100%"
			},
			model: "",
			key: "",
			formType: 2,
		}, {
			type: "symbol",
			label: "符号",
			icon: "icon-zihao",
			options: {
				textAlign: "center",
				hidden: false, // 是否隐藏，false显示，true隐藏
				showRequiredMark: false,
				options: [{
					value: '+', label: '加'
				}, {
					value: '-', label: '减'
				}, {
					value: '*', label: '乘'
				}, {
					value: '/', label: '除'
				}]
			},
			key: "",
			formType: 2,
			selected: {}
		}, {
			type: "function",
			label: "函数",
			columns: [],
			options: {
				gutter: 0,
				options: [{
					value: 'getLogValue', label: '对数'
				}, {
					value: 'getPowValue', label: '幂函数'
				}, {
					value: 'getRadicalValue', label: '根运算'
				}, {
					value: 'getAvgValue', label: '平均值'
				}, {
					value: 'getAbsValue', label: '绝对值'
				}]
			},
			key: "",
			formType: 2,
			selected: {}
		}, {
			type: "variable",
			label: "变量",
			icon: "icon-zihao",
			options: {
				textAlign: "center",
				hidden: false, // 是否隐藏，false显示，true隐藏
				showRequiredMark: false
			},
			key: "",
			formType: 2,
			selected: {}
		}, {
			type: "constant", // 表单类型
			label: "常量", // 标题文字
			value: 0,
			icon: "icon-number",
			options: {
				width: "100%", // 宽度
				defaultValue: 0, // 默认值
				min: null, // 可输入最小值
				max: null, // 可输入最大值
				precision: null,
				step: 1, // 步长，点击加减按钮时候，加减多少
				hidden: false, // 是否隐藏，false显示，true隐藏
				disabled: false, //是否禁用
				placeholder: "请输入",
				showOnList: true,
				showOnQuery: true,
				tableColumn: false,
			},
			model: "", // 数据字段
			key: "",
			formType: 2,
			rules: [
				{
					required: false,
					message: "必填项"
				}
			]
		}
	]
};
// window.$customComponentList = customComponents.list;

// 布局控件
export const layoutList = [
	{
		type: "divider",
		label: "分割线",
		icon: "icon-fengexian",
		options: {
			orientation: "left"
		},
		key: "",
		model: ""
	},
	{
		type: "card",
		label: "卡片布局",
		icon: "icon-qiapian",
		list: [],
		key: "",
		model: ""
	},
	{
		type: "grid",
		label: "栅格布局",
		icon: "icon-zhage",
		columns: [
			{
				span: 12,
				list: []
			},
			{
				span: 12,
				list: []
			}
		],
		options: {
			gutter: 0
		},
		key: "",
		model: ""
	},
	{
		type: "table",
		label: "表格布局",
		icon: "icon-biaoge",
		trs: [
			{
				tds: [
					{
						colspan: 1,
						rowspan: 1,
						list: []
					},
					{
						colspan: 1,
						rowspan: 1,
						list: []
					}
				]
			},
			{
				tds: [
					{
						colspan: 1,
						rowspan: 1,
						list: []
					},
					{
						colspan: 1,
						rowspan: 1,
						list: []
					}
				]
			}
		],
		options: {
			width: "100%",
			bordered: true,
			bright: false,
			small: true,
			customStyle: ""
		},
		key: "",
		model: ""
	},
//tab布局
	{
		type: "tabs",
		label: "Tabs布局",
		icon: "icon-zhage",
		columns: [
			{
				key: "1",
				tabName: "tab1",
				list: []
			},
			{
				key: "2",
				tabName: "tab2",
				list: []
			}
		],
		options: {
			gutter: 0
		},
		key: "",
		model: ""
	},
];

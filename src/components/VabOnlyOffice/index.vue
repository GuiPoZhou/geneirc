<template>
    <div id='vabOnlyOffice'></div>
</template>

<script>
    export default {
        name: 'VabOnlyOffice',
        props: {
            option: {
                type: Object,
                default: () => {
                    return {}
                },
            },
        },
        data() {
            return {
                doctype: '',
                docEditor: null,
            }
        },
        beforeDestroy() {
            if (this.docEditor !== null) {
                this.docEditor.destroyEditor();
                this.docEditor = null;
            }
        },
        watch: {
            option: {
                handler: function (n) {
                    this.setEditor(n)
                    this.doctype = this.getFileType(n.fileType)
                },
                deep: true,
            },
        },
        mounted() {
            if (this.option.url) {
                this.setEditor(this.option)
            }
        },
        methods: {
            async setEditor(option) {
                if (this.docEditor !== null) {
                    this.docEditor.destroyEditor();
                    this.docEditor = null;
                }
                this.doctype = this.getFileType(option.fileType)
                let config = {
                    document: {
                        key: "Khirz6zTPdfd7",
                        fileType: option.fileType,
                        key: option.key || '',
                        title: option.title,
                        permissions: {
                            edit: option.isEdit,
                            print: option.isPrint,
                            download: false,
                            "userInfoGroups": [""],
                            "reviewGroups": [""],
                            review: false
                        },
                        url: option.url,
                    },
                    documentType: this.doctype,
                    editorConfig: {
                        callbackUrl: option.editUrl,
                        lang: option.lang,

                        "customer": {
                            "address": "My City, 123a-45",
                            "info": "Some additional information",
                            "logo": "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
                            "logoDark": "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
                            "mail": "john@example.com",
                            "name": "John Smith and Co.",
                            "phone": "123456789",
                            "www": "example.com"
                        },
                        //定制
                        customization: {

                            "customer": {
                                "address": "My City, 123a-45",
                                "info": "Some additional information",
                                "logo": "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
                                "logoDark": "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
                                "mail": "john@example.com",
                                "name": "John Smith and Co.",
                                "phone": "123456789",
                                "www": "example.com"
                            },
                            "logo": {
                                "image": "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
                                "imageDark": "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
                                "url": "http://www.baidu.com"
                            },
                            autosave: false,
                            chat: false,
                            comments: true,
                            help: false,
                            plugins: option.usePlugins === false ? false : true,
                            macros: false,
                            macrosMode: 'warn',
                            showReviewChanges: false,
                        },
                        coEditing: {
                            mode: "strict",
                            change: false
                        },
                        user: {
                            id: option.user.id,
                            name: option.user.name,
                            group: "",
                        },
                        mode: option.model ? option.model : 'edit',
                        plugins: {
                          // autostart: ['asc.{6B6715E5-A558-4F70-8058-40704CD659AA}'],
                          pluginsData: [
                            // "helloworld/config.json",
                            // "templates/config.json",
                            "invoices/config.json",
                            "bookmarks/config.json",
                            "page/config.json",
                            // "example_move_cursor/config.json",
                              // "dataSource/config.json",
                              // "example_search_replace/config.json",
                              // "example_customfields_load/config.json",
                              // "example_customfields_add/config.json",
                              // "example_work_with_content_controls_combo/config.json",
                              // "example_work_with_content_controls/config.json",
                              // "example_add_content_controls/config.json",
                              // "DataRender/config.json",
                              // "example_controls/config.json",
                            // "example_customfields_load/config.json",
                            // "example_extended_comments/config.json",
                          ]
                        }
                    },
                    width: '100%',
                    height: '100%',
                    token: option.token || ''
                }

                // eslint-disable-next-line no-undef,no-unused-vars
                this.docEditor = new DocsAPI.DocEditor('vabOnlyOffice', config)

            },
            getFileType(fileType) {
                let docType = ''
                let fileTypesDoc = [
                    'doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'epub', 'fodt', 'htm', 'html', 'mht', 'odt', 'ott', 'pdf', 'rtf', 'txt', 'djvu', 'xps',
                ]
                let fileTypesCsv = [
                    'csv', 'fods', 'ods', 'ots', 'xls', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx',
                ]
                let fileTypesPPt = [
                    'fodp', 'odp', 'otp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx',
                ]
                if (fileTypesDoc.includes(fileType)) {
                    docType = 'text'
                }
                if (fileTypesCsv.includes(fileType)) {
                    docType = 'spreadsheet'
                }
                if (fileTypesPPt.includes(fileType)) {
                    docType = 'presentation'
                }
                return docType
            }
        },
    }
</script>

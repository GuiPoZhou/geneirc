<template>
  <div>
    <BoDialog :dia-log-show="showLog" dia-log-title="标签设计器" dia-log-width="80%" @close="e_close">
      <template slot="bologbody" ref="bologbody">
        <div class="tag_design_earea">
          <div class="tse-left">
            <div class="tl-block"
                 :style="{width:coa(tageConfig.tagWidth)+'px',height:coa(tageConfig.tagHeight)+'px'}"
            >
                            <span v-for="(v,i) in text" :key="i" class="tlb-text1"
                                  :style="{left:coa(v.abscissa)+'px',top:coa(v.ordinate)+'px',fontSize:coa(v.fontHeight)+'px'}"
                            >{{ v.content }}</span>
              <!--条形码-->
              <svg v-for="(v,i) in barcodeList" :key="i" class="barCode" :id="`barCode${i}`"
                   :style="{left:coa(v.abscissa)+'px',top:coa(v.ordinate)+'px'}"
              ></svg>
              <!--二维码-->
              <div v-for="(v,i) in qrcodeList" :key="i"
                   :style="{left:coa(v.abscissa)+'px',top:coa(v.ordinate)+'px'}" class="qrcode-pic"
                   ref="codeItem"
              ></div>
              <!--图片-->
              <img class="tagbmp" v-for="(v,i) in bmp" :key="i"
                   :style="{left:coa(v.abscissa)+'px',top:coa(v.ordinate)+'px',width:v.width+'px',height:v.height+'px'}"
                   :src="`data:image/bmp;base64,${v.base64Str}`" alt=""
              >
              <!--线条-->
              <div class="tagline" v-for="(v,i) in diagonal" :key="i"
                   :style="{...lineStyle(v.abscissa,v.ordinate,v.abscissa1,v.ordinate1)}"
              ></div>
            </div>
          </div>
          <div class="tse-right">
            <el-form ref="form" :model="form" label-width="130px">
              <el-card class="tageConfig-card">
                <div slot="header" class="clearfix">
                  <span>标签属性</span>
                </div>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="标签名称:">
                      <el-input size="smalll" v-model="name"
                                :disabled="showType=='see'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="标签宽度(mm):">
                      <el-input size="smalll" v-model="tageConfig.tagWidth"
                                :disabled="showType=='see'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="标签高度(mm):">
                      <el-input size="smalll" v-model="tageConfig.tagHeight"
                                :disabled="showType=='see'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="标签浓度:">
                      <el-input-number v-model="tageConfig.density" :min="3" :max="15" :disabled="showType=='see'"></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-card>
            </el-form>
            <el-form ref="form" :model="paramsForm" label-width="120px">
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="文本" name="text">
                  <div class="cardArea">
                    <el-card v-for="(v,i) in text" :key="i" class="text-card">
                      <img class="deleteIcon" src="./delete.png" alt=""
                           v-show="showType != 'see'" @click="e_deleteText(i)">
                      <el-form-item label="内容:">
                        <el-input v-model="v.content" :disabled="showType=='see'"></el-input>
                      </el-form-item>
                      <el-form-item label="字体大小(mm):">
                        <el-input-number :min="0" v-model="v.fontHeight"
                                         :disabled="showType=='see'"></el-input-number>
                      </el-form-item>
                      <el-form-item label="网格大小(mm):">
                        <el-input-number :min="0" v-model="v.xMultiplication"
                                         @change="v.yMultiplication = v.xMultiplication"
                                         :disabled="showType=='see'"></el-input-number>
                      </el-form-item>
                      <el-form-item label="左偏移(mm):">
                        <el-input-number :min="1" :precision="0"
                                         v-model="v.abscissa"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                      <el-form-item label="上偏移(mm):">
                        <el-input-number :min="1" :precision="0"
                                         v-model="v.ordinate"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                    </el-card>
                  </div>
                  <el-button size="mini" type="primary" @click="e_addText"
                             :disabled="showType=='see'">新增文本
                  </el-button>
                </el-tab-pane>

                <el-tab-pane label="条形码" name="barcode">
                  <div class="cardArea">
                    <el-card v-for="(v,i) in barcodeList" :key="i" class="text-card">
                      <img class="deleteIcon" src="./delete.png" alt=""
                           @click="e_deleteBarCode(i)" v-show="showType != 'see'"
                      >
                      <el-form-item label="内容:">
                        <el-input v-model="v.content" :disabled="showType=='see'"
                                  @change="changeBarCodeHight"></el-input>
                      </el-form-item>
                      <el-form-item label="条码位置(mm):">
                        <el-input-number :min="0" :precision="0" v-model="v.alignment"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                      <el-form-item label="条码宽比(mm):">
                        <el-input-number :min="0" :precision="0" v-model="v.wide"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                      <el-form-item label="条码密度(mm):">
                        <el-input-number :min="0" :precision="0" v-model="v.narrow"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                      <el-form-item label="条码高度(mm):">
                        <el-input-number :min="0" :precision="0" v-model="v.height"
                                         @change="changeBarCodeHight"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                      <el-form-item label="左偏移(mm):">
                        <el-input-number :min="1" :precision="0"
                                         v-model="v.abscissa"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                      <el-form-item label="上偏移(mm):">
                        <el-input-number :min="1" :precision="0"
                                         v-model="v.ordinate"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                      <el-form-item label="标签角度(°):">
                        <el-input-number :min="0" :precision="0"
                                         v-model="v.rotation"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                    </el-card>
                  </div>
                  <el-button size="mini" type="primary" @click="e_addBarCode"
                             :disabled="showType=='see'">新增条形码
                  </el-button>
                </el-tab-pane>
                <el-tab-pane label="二维码" name="qrcode">
                  <div class="cardArea">
                    <el-card v-for="(v,i) in qrcodeList" :key="i" class="text-card">
                      <img class="deleteIcon" src="./delete.png" alt=""
                           @click="e_deleteQRCode(i)" v-show="showType != 'see'"
                      >
                      <el-form-item label="内容:">
                        <el-input v-model="v.content" :disabled="showType=='see'"
                                  @change="changeQRCodeHight"></el-input>
                      </el-form-item>
                      <el-form-item label="大小(mm):">
                        <el-input-number :min="1" :precision="0" :max="10" v-model="v.cellWidth"
                                         @change="changeQRCodeHight" :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                      <el-form-item label="左偏移(mm):">
                        <el-input-number :min="1" :precision="0"
                                         v-model="v.abscissa"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                      <el-form-item label="上偏移(mm):">
                        <el-input-number :min="1" :precision="0"
                                         v-model="v.ordinate"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                    </el-card>
                  </div>
                  <el-button size="mini" type="primary" @click="e_addQRCode"
                             :disabled="showType=='see'">新增二维码
                  </el-button>

                </el-tab-pane>
                <el-tab-pane label="线条" name="line">
                  <div class="cardArea">
                    <el-card v-for="(v,i) in diagonal" :key="i" class="text-card">
                      <img class="deleteIcon" src="./delete.png" v-show="showType != 'see'"
                           alt="" @click="e_deleteLine(i)">
                      <el-form-item label="x轴起点:">
                        <el-input-number :min="0" :disabled="showType=='see'"
                                         v-model="v.abscissa"></el-input-number>
                      </el-form-item>
                      <el-form-item label="x轴末点(mm):">
                        <el-input-number :min="0" :disabled="showType=='see'"
                                         v-model="v.abscissa1"></el-input-number>
                      </el-form-item>
                      <el-form-item label="y轴起点(mm):">
                        <el-input-number :min="1" :precision="0"
                                         v-model="v.ordinate"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                      <el-form-item label="y轴末点(mm):">
                        <el-input-number :min="1" :precision="0"
                                         v-model="v.ordinate1"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                    </el-card>
                  </div>
                  <el-button size="mini" type="primary" :disabled="showType=='see'"
                             @click="e_addLine">新增线条
                  </el-button>
                </el-tab-pane>
                <el-tab-pane label="图片" name="bmp">
                  <div class="cardArea">
                    <el-card v-for="(v,i) in bmp" :key="i" class="text-card">
                      <img class="deleteIcon" src="./delete.png" alt=""
                           @click="e_deleteBmp(i)" v-show="showType != 'see'"
                      >
                      <el-form-item label="预览:">
                        <img style="width: 100px;height: 100px"
                             :src="`data:image/bmp;base64,${v.base64Str}`" alt=""
                        >
                      </el-form-item>
                      <el-form-item label="左偏移(mm):">
                        <el-input-number :min="0" :precision="0"
                                         v-model="v.abscissa"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                      <el-form-item label="上偏移(mm):">
                        <el-input-number :min="0" :precision="0"
                                         v-model="v.ordinate"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                    </el-card>
                    <el-card v-for="(v,i) in pcx" :key="i" class="text-card">
                      <img class="deleteIcon" src="./delete.png" alt=""
                           @click="e_deleteBmp(i)"
                           v-show="showType != 'see'"
                      >
                      <el-form-item label="预览:">
                        <img style="width: 100px;height: 100px"
                             :src="`data:image/pcx;base64,${v.base64Str}`" alt=""
                        >
                      </el-form-item>
                      <el-form-item label="左偏移(mm):">
                        <el-input-number :min="0" :precision="0"
                                         v-model="v.abscissa"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                      <el-form-item label="上偏移(mm):">
                        <el-input-number :min="0" :precision="0"
                                         v-model="v.ordinate"
                                         :disabled="showType=='see'"
                        ></el-input-number>
                      </el-form-item>
                    </el-card>
                  </div>
                  <el-popover
                    placement="right"
                    width="400"
                    trigger="click"
                  >
                    <el-table
                      :data="bmpList"
                      style="width: 100%"
                    >
                      <el-table-column
                        prop="fileName"
                        align="center"
                        label="文件名"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="file"
                        align="center"
                        label="文件预览"
                      >
                        <template slot-scope="scope">
                          <img style="width: 100px;height: 100px"
                               :src="`data:image/bmp;base64,${scope.row.file}`" alt=""
                          >
                        </template>
                      </el-table-column>
                      <el-table-column
                        align="center"
                        label="选择"
                      >
                        <template slot-scope="scope">
                          <el-button type="text" :disabled="showType=='see'"
                                     @click="e_selBMP(scope.row)">选择
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-button size="mini" type="primary" :disabled="showType=='see'"
                               slot="reference">新增图片
                    </el-button>
                  </el-popover>
                </el-tab-pane>
              </el-tabs>
            </el-form>
          </div>
        </div>
      </template>
      <template slot="bologfooter">
        <el-button size="small" type="primary" @click="e_print">打印</el-button>
        <el-button size="small" type="primary" v-if="showType != 'see'" @click="e_preservation">保存</el-button>
        <el-button size="small" @click="e_close">取消</el-button>
      </template>
    </BoDialog>
  </div>
</template>
<script>
  import axios from 'axios'
  import QRCode from 'qrcodejs2'
  import JsBarcode from 'jsbarcode'

  export default {
    data() {
      return {
        showLog: false,
        text: [],
        tageConfig: {
          'printerType': 'tsc',
          density: 3,
          'tagHeight': '50',
          'tagWidth': '60',
          gap: '0.3 mm,0.3 mm',
          copies: 1
        },
        name: null,
        barcodeList: [],
        qrcodeList: [],
        form: {},
        paramsForm: {},
        paramsData: {},
        activeName: 'text',
        bmpList: [],
        bmp: [],
        pcx: [],
        showType: 'add',
        diagonal: []
      }
    },
    components: {},
    methods: {
      init(type, data) {
        this.showType = type
        if (type == 'see' || type == 'edit') {
          this.paramsData = data
          this.name = this.paramsData.name
          this.tageConfig.density = this.paramsData.contentObj.density
          this.tageConfig.tagHeight = this.paramsData.contentObj.tagHeight
          this.tageConfig.tagWidth = this.paramsData.contentObj.tagWidth
          this.text = this.paramsData.contentObj.text ? this.paramsData.contentObj.text : []
          this.bmp = this.paramsData.contentObj.bmp ? this.paramsData.contentObj.bmp : []
          this.barcodeList = this.paramsData.contentObj.barcode ? this.paramsData.contentObj.barcode : []
          this.qrcodeList = this.paramsData.contentObj.qrcode ? this.paramsData.contentObj.qrcode : []
          this.diagonal = this.paramsData.contentObj.diagonal ? this.paramsData.contentObj.diagonal : []
          setTimeout(() => {
            this.changeQRCodeHight()
          }, 0)
        }
        this.showLog = true
        this.getLabelPictureAddress()
      },
      // 获取标签图片地址
      async getLabelPictureAddress() {
        let getData = await this.$net('system/dict/data/type/LabelPictureAddress', 'get')
        if (getData.code == 200) {
          let arr = []
          getData.data.map((item) => {
            let obj = {
              label: item.dictLabel,
              value: item.dictValue
            }
            arr.push(obj)
          })
          this.e_getServerTageBMP(arr)
        }
      },
      /**
       * @author Coder
       * @date 2022/12/13
       * @des 新增线条
       */
      e_addLine() {
        let params = {
          abscissa: 0,
          ordinate: 10,
          abscissa1: 50,
          ordinate1: 10
        }
        this.diagonal.push(params)
      },
      /**
       * @author Coder
       * @date 2022/12/13
       * @des 根据两点坐标进行划线
       */
      lineStyle(x1, y1, x2, y2, lineWidth = 1, color = 'black') {
        let rectX = x1 < x2 ? x1 : x2
        let rectY = y1 < y2 ? y1 : y2
        let rectWidth = Math.abs(x1 - x2)
        let rectHeight = Math.abs(y1 - y2)
        //弦长
        let stringWidth = Math.ceil(Math.sqrt((rectWidth * rectWidth) + (rectHeight * rectHeight)))
        let xPad = (rectWidth - stringWidth) / 2
        let yPad = (rectHeight - lineWidth) / 2
        let radNum = Math.atan2((y1 - y2), (x1 - x2))
        console.log('stringWidth', stringWidth)
        return {
          width: `${this.coa(stringWidth)}px`,
          height: `${lineWidth}px`,
          transform: `translate(${this.coa(rectX + xPad)}px, ${this.coa(rectY + yPad)}px) rotate(${radNum}rad)`
        }
      },
      /**
       * @author Coder
       * @date 2022/12/6
       * @des 新增bmp
       */
      async e_selBMP(row) {
        let type = row.fileName.split('.')[1]
        let params = {
          abscissa: 1,
          ordinate: 1,
          base64Str: row.file,
          width: 0,
          height: 0,
          filename: row.fileName
        }
        let imgInfo = await this.getBase64(`data:image/bmp;base64,${row.file}`)
        params.width = parseInt(Number(imgInfo.width) / 2)
        params.height = parseInt(Number(imgInfo.height) / 2)
        if (type == 'bmp') {
          this.bmp.push(params)
        } else {
          this.pcx.push(params)
        }

      },
      /**
       * @author Coder
       * @date 2022/12/6
       * @des 获取图片的分辨率
       */
      getBase64(img) {
        const image = new Image()
        image.crossOrigin = ''
        image.src = img
        return new Promise((resolve, reject) => {
          image.onload = function () {
            const {width, height} = image
            resolve({width, height})
          }
        })
      },
      /**
       * @author Coder
       * @date 2022/12/6
       * @des 删除bmp
       */
      e_deleteBmp(i) {
        this.$confirm('确定删除标签上面的该张图片?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.bmp.splice(i, 1)
        })
      },
      /**
       * @author Coder
       * @date 2022/12/5
       * @des 获取服务器标签图片
       */
      e_getServerTageBMP(arr) {
        let url = `http://${arr[0].value}/api/v1/listReadableFile`
        axios.get(url).then(re => {
          let fileList = re.data.data
          console.log(fileList)
          let arr = []
          for (let key in fileList) {
            let obj = {
              fileName: key,
              file: fileList[key]
            }
            arr.push(obj)
          }
          this.bmpList = arr
        })
      },
      /**
       * @author Coder
       * @date 2022/12/5
       * @des 重新渲染二维码内容
       */
      changeQRCodeHight() {
        for (let index = 0; index < this.qrcodeList.length; index++) {
          this.$refs.codeItem[index].innerHTML = ''
        }
        this.generateQRCode()
      },
      /**
       * @author Coder
       * @date 2022/12/13
       * @des 删除线条
       */
      e_deleteLine(i) {
        this.$confirm('确定删除标签上面的该条线？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.diagonal.splice(i, 1)
        })
      },
      /**
       * @author Coder
       * @date 2022/12/5
       * @des 删除二维码
       */
      e_deleteQRCode(i) {
        this.$confirm('确定删除标签上面的该二维码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.qrcodeList.splice(i, 1)
        })
      },
      /**
       * @author Coder
       * @date 2022/12/5
       * @des 新增二维码
       */
      e_addQRCode() {
        let params = {
          abscissa: 0,
          ordinate: 0,
          cellWidth: 4,
          content: '#2001-SP-05001221200037'//二维码内容填充
        }
        this.qrcodeList.push(params)
        this.$nextTick(() => {
          this.generateQRCode()
        })
      },
      generateQRCode() {
        this.qrcodeList.map((item, index) => {
          new QRCode(this.$refs.codeItem[index], {
            text: item.content, //二维码内容
            width: item.cellWidth * 10 + 15,
            height: item.cellWidth * 10 + 15
            // colorDark: "#333333", //二维码颜色
            // colorLight: "#ffffff", //二维码背景色
          })
        })

      },
      /**
       * @author Coder
       * @date 2022/12/5
       * @des 删除条形码
       */
      e_deleteBarCode(i) {
        this.$confirm('确定删除标签上面的该条形码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.barcodeList.splice(i, 1)
        })
      },
      /**
       * @author Coder
       * @date 2022/12/5
       * @des 新增条形码
       */
      e_addBarCode() {
        let params =
          {
            abscissa: 1,
            ordinate: 1,
            height: 8,
            codeType: '128',//EAN128
            humanReadable: 0,
            narrow: 1,
            wide: 2,
            domHeight: 2,
            alignment:2,
            rotation:0,
            content: '#2001-SP-05001221200037'
          }
        this.barcodeList.push(params)
        this.$nextTick(() => {
          this.generateBarCode()
        })

      },
      /**
       * @author Coder
       * @date 2022/12/5
       * @des 删除文本
       */
      e_deleteText(i) {
        this.$confirm('确定删除标签上面的该项内容?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.text.splice(i, 1)
        })
      },
      /**
       * @author Coder
       * @date 2022/12/5
       * @des 更改条形码的高度重新进行渲染
       */
      changeBarCodeHight(e) {
        console.log('e', e)
        this.generateBarCode()
      },
      /**
       * @author Coder
       * @date 2022/12/5
       * @des 新增文本
       */
      e_addText() {
        let params = {
          'abscissa': 2,
          ordinate: 7,
          'fontHeight': 3,//字体大大小
          'xMultiplication': 1, //网格x大小
          'yMultiplication': 1, //网格y大小
          'fontStyle': 2,//加粗
          'content': '文本'
        }
        this.text.push(params)
      },
      coa(height) {
        // 实际宽（高）*3.78*2 为所需像素
        // 实际宽（高）*2/10 为所需大小尺寸（cm）
        return height * 3.78
      },
      generateBarCode() {
        this.barcodeList.map((item, index) => {
          JsBarcode('#barCode' + index, item.content, {
            format: 'CODE128',
            lineColor: '#000',
            background: '#fff',
            displayValue: false,
            margin: 1,
            width: 1,
            height: item.height * 4 - 2
          })
        })
      },
      // 取消
      e_close() {
        this.showLog = false
        this.$emit('cancel')
      },
      // 保存
      async e_preservation() {
        // 标签样式
        let obj = {
          ...this.tageConfig,
          text: this.text
        }
        if (this.barcodeList.length != 0) {
          obj['barcode'] = this.barcodeList
        }
        if (this.qrcodeList.length != 0) {
          obj['qrcode'] = this.qrcodeList
        }
        if (this.bmp.length != 0) {
          obj['bmp'] = this.bmp
        }
        if (this.diagonal.length != 0) {
          obj['diagonal'] = this.diagonal
        }
        let method = 'post'
        let params = {}
        // 修改
        if (this.showType == 'edit') {
          method = 'put'
          params = {
            ...this.paramsData
          }
          params.contentObj = obj
          params.name = this.name
        } else { //新增
          method = 'post'
          params.contentObj = {...obj}
          params.name = this.name
        }
        let getData = await this.$net(`/base/v1/label/manage`, method, params)
        if (getData.code == 200) {
          this.$message.success('保存成功')
          this.showLog = false
          this.$emit('reload')
        }
      },
      // 打印
      e_print() {
        let params = {
          ...this.tageConfig,
          text: this.text
        }
        if (this.barcodeList.length != 0) {
          params['barcode'] = this.barcodeList
        }
        if (this.qrcodeList.length != 0) {
          params['qrcode'] = this.qrcodeList
        }
        if (this.bmp.length != 0) {
          params['bmp'] = this.bmp
        }
        console.log(this.diagonal)
        if (this.diagonal.length != 0) {
          params['diagonal'] = this.diagonal
        }
        let printArr = JSON.parse(localStorage.getItem('printServes'))
        console.log('params',JSON.stringify(params))
        axios.post('http://192.168.36.229:28080/api/v1/autoPrint', [params], {headers: {'Content-type': 'application/json;charset=utf-8'}})
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tag_design_earea {
    width: 100%;
    height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .tse-left {
      width: 30%;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .tl-block {
        position: relative;
        border: 1px solid #000;
        overflow: hidden;

        .tlb-text1 {
          position: absolute;
          left: 0mm;
          z-index: 2;
        }

        .barCode {
          position: absolute;
          z-index: 2;
        }

        .qrcode-pic {
          position: absolute;
          z-index: 2;
        }

        .tagbmp {
          position: absolute;
          z-index: 1;
        }

        .tagline {
          position: absolute;
          z-index: 1;
          height: 1px;
          background-color: #000;
        }
      }
    }

    .tse-right {
      flex: 1;
      border-left: 1px solid #e8e8e8;
      height: 100%;
      overflow: scroll;
      padding: 5px;

      .tageConfig-card {
        width: 40%;
        margin-bottom: 20px;
      }

      .cardArea {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-bottom: 20px;

        .text-card {
          width: 45%;
          margin-right: 5%;
          margin-bottom: 20px;
          position: relative;

          .deleteIcon {
            width: 20px;
            height: 20px;
            left: 4px;
            top: 4px;
            position: absolute;
            cursor: pointer;
          }

        }
      }
    }

  }
</style>

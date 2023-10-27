<template>
  <div>
    <a-row>
      <a-col :span="12">
        <div :style="{ textAlign: 'center' }">
          <label >观测值记录</label>
        </div>
        <a-table  :columns="leftColumns" :data-source="extendedProperties.blacknessObservedList" size="small" :pagination="false" :customRow="leftRowClick" >
<!--          sangelxiu1 黑度 行编辑-->
          <template
            v-for="col in ['second0', 'second15', 'second30', 'second45']"
            :slot="col"
            slot-scope="text, record, index"
          >
            <div :key="col">
              <a-input
                v-if="record.editable && extendedProperties.formShowType === 0"
                style="margin: -5px 0"
                :value="text"
                @change="e => leftRowChange(e.target.value, record.key, col, index)"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>
        </a-table>
      </a-col>
      <a-col :span="12">
        <a-form :form="formData">
          <div :style="{ textAlign: 'center' }">
            <label >观测点位置与观测条件</label>
          </div>
          <a-row>
            <a-col :span="12">
              <a-form-item label="烟囱距离" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input placeholder="请输入烟囱距离" v-model="formData.chimneyDistance"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="烟囱所在方向" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input placeholder="请输入烟囱所在方向" v-model="formData.direction"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="烟囱高度" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input placeholder="请输入烟囱高度" v-model="formData.chimneyHeight"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="烟囱出口形状" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input placeholder="请输入烟囱出口形状" v-model="formData.exportShape"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="风向" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input placeholder="请输入风向" v-model="formData.windDirection"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="风速" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input placeholder="请输入风速" v-model="formData.windSpeed"/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="烟羽背景" :labelCol="{span:6, offset:0}" :wrapperCol="{span:18, offset:0}" >
                <a-radio-group button-style="solid" default-value="无云" v-model="formData.smokePlume">
                  <a-radio-button value="无云">无云</a-radio-button>
                  <a-radio-button value="薄云">薄云</a-radio-button>
                  <a-radio-button value="白云">白云</a-radio-button>
                  <a-radio-button value="灰云">灰云</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="天气状况" :labelCol="{span:6, offset:0}" :wrapperCol="{span:18, offset:0}" >
                <a-radio-group button-style="solid" default-value="晴朗" v-model="formData.weather">
                  <a-radio-button value="晴朗">晴朗</a-radio-button>
                  <a-radio-button value="少云">少云</a-radio-button>
                  <a-radio-button value="多云">多云</a-radio-button>
                  <a-radio-button value="阴天">阴天</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="备注" :labelCol="{span:6, offset:0}" :wrapperCol="{span:18, offset:0}" >
                <a-textarea
                  placeholder="备注"
                  :auto-size="{ minRows: 3, maxRows: 5 }" v-model="formData.remark"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <div :style="{ textAlign: 'center' }">
            <label >观测累计次数及时间</label>
          </div>
          <a-col :span="12">
            <a-form-item label="观测开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入观测开始时间"  v-model="formData.startTime"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="观测结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入观测结束时间"  v-model="formData.endTime"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-table :columns="rightColumns" :data-source="rightData" size="middle" :pagination="false" :customRow="rightRowClick" >
              <template
                v-for="col in ['frequency', 'time']"
                :slot="col"
                slot-scope="text, record, index"
              >
                <div :key="col">
                  <a-input
                    v-if="record.editable && extendedProperties.formShowType === 0"
                    style="margin: -5px 0"
                    :value="text"
                    @change="e => rightRowChange(e.target.value, record.key, col, index)"
                  />
                  <template v-else>
                    {{ text }}
                  </template>
                </div>
              </template>
            </a-table>
          </a-col>
        </a-form>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
          <a-table :columns="footerColumns" :data-source="footerData" size="middle" :pagination="false" >
            <template
              slot="blackness"
              slot-scope="text, record, index"
            >
                <a-input
                  style="margin: -5px 0"
				  :value="record.blackness"
                  @change="e => footerRowChange(e.target.value, record.key, index)"
                />
            </template>
          </a-table>
      </a-col>
    </a-row>
  </div>

</template>

<script>
  export default {
    name: 'sceneBlackness',
    props:{
      extendedProperties: {
        // blackness: {},
        // blacknessObservedList:[],
      }
    },
    created() {
    },
    mounted() {
      this.init();
    },
    data() {
      return {
        formData:{
          chimneyDistance : null,
          direction : null,
          chimneyHeight : null,
          exportShape : null,
          windDirection : null,
          windSpeed : null,
          smokePlume : '无云',
          weather : '晴朗',
          remark : null,
          startTime : null,
          endTime : null,
          frequency0 : null,
          frequency1 : null,
          frequency2 : null,
          frequency3 : null,
          frequency4 : null,
          frequency5 : null,
          time0 : null,
          time1 : null,
          time2 : null,
          time3 : null,
          time4 : null,
          time5 : null,
          blackness: null,
        },
        //Left
        leftData: [],
        leftColumns: [{
          title: '分/秒',
          width: '60px',
          dataIndex: 'minute'
        },{
          title: '0',
          dataIndex: 'second0',
          scopedSlots: { customRender: 'second0' },
        },{
            title: '15',
            dataIndex: 'second15',
          scopedSlots: { customRender: 'second15' },
        },{
            title: '30',
            dataIndex: 'second30',
          scopedSlots: { customRender: 'second30' },
        },{
            title: '45',
            dataIndex: 'second45',
          scopedSlots: { customRender: 'second45' },
        }],
        //Right
        labelCol:{
          span:12, offset:0
        },
        wrapperCol:{
          span:12, offset:0
        },
        rightData: [{
          level: "5级",
          frequency: 0,
          time: 0,
          editable: false,
        },{
          level: "≥4级",
          frequency: 0,
          time: 0,
          editable: false,
        },{
          level: "≥3级",
          frequency: 0,
          time: 0,
          editable: false,
        },{
          level: "≥2级",
          frequency: 0,
          time: 0,
          editable: false,
        },{
          level: "≥1级",
          frequency: 0,
          time: 0,
          editable: false,
        },{
          level: "<1级",
          frequency: 0,
          time: 0,
          editable: false,
        }],
        rightColumns: [{
          title: '等级',
          width: '60px',
          dataIndex: 'level',
        },{
          title: '次数',
          dataIndex: 'frequency',
          scopedSlots: { customRender: 'frequency' },
        },{
          title: '累计时间',
          dataIndex: 'time',
          scopedSlots: { customRender: 'time' },
        }],
        //Footer
        footerData: [{}],
        footerColumns: [{
          title: '频次',
          dataIndex: 'rate'
        },{
          title: '样品编码',
          dataIndex: 'sampleCode'
        },{
          title: '检测项目',
          dataIndex: 'detectItem'
        },{
          title: '现场检测',
          dataIndex: 'sceneDetect'
        },{
          title: '检测方法编号',
          dataIndex: 'itemCode'
        },{
          title: '烟气黑度(林格曼级)',
          dataIndex: 'blackness',
          scopedSlots: { customRender: 'blackness' },
        }],
      }
    },
    watch: {
      'extendedProperties.editType': {
        handler: function(val, oldVal) {
          if (this.extendedProperties.blackness) {
            this.formData = this.extendedProperties.blackness;
            this.rightData.forEach((item, index) => {
              item.frequency = this.extendedProperties.blackness['frequency' + index];
              item.time = this.extendedProperties.blackness['time' + index];
            });
            this.footerData.splice(0);
            this.footerData.push({
            blackness: this.extendedProperties.blackness.blackness,
            rate: this.extendedProperties.blackness.rate,
            sampleCode: this.extendedProperties.blackness.sampleCode,
            detectItem: this.extendedProperties.blackness.detectItem,
            sceneDetect: this.extendedProperties.blackness.sceneDetect,
            itemCode: this.extendedProperties.blackness.itemCode,
          });
          }
        },
      }
    },
    methods:{
      init() {
        console.log('init', this.extendedProperties);
        this.$set(this.extendedProperties, 'blacknessObservedList', []);
        for (let i = 0; i < 30; i++) {
            this.extendedProperties.blacknessObservedList.push({
              minute: i,
              second0: 0,
              second15: 0,
              second30: 0,
              second45: 0,
              editable: false,
            });
        }
        this.$set(this.extendedProperties, 'blackness', this.formData);
        if (this.extendedProperties.itemInfoList) {
          this.footerData = this.extendedProperties.itemInfoList;
        }
      },
      leftRowClick(record, index) {
        return {
          on: {
            click: (event) => {},       // 点击行
            dblclick: (event) => {},
            contextmenu: (event) => {},
            mouseenter: (event) => {
              record.editable = true;
              this.extendedProperties.blacknessObservedList[index].editable = true;
              // console.log('移入 ', record.editable, index, record, this.extendedProperties.blacknessObservedList[index]);
            },  // 鼠标移入行
            mouseleave: (event) => {
              record.editable = false;
              this.extendedProperties.blacknessObservedList[index].editable = false;
              // console.log('移出 ', record.editable, index);
            }
          }
        };
      },
      leftRowChange(value, key, col, e){
        this.extendedProperties.blacknessObservedList[e][col] = value;
      },


      rightRowClick(record, index) {
        return {
          on: {
            click: (event) => {},       // 点击行
            dblclick: (event) => {},
            contextmenu: (event) => {},
            mouseenter: (event) => {
              record.editable = true;
            },  // 鼠标移入行
            mouseleave: (event) => {
              record.editable = false;
            }
          }
        };
      },
      rightRowChange(value, key, col, e){
        this.rightData[e][col] = value;
        this.extendedProperties.blackness[col + e] = value;
      },
      footerRowChange(value, key, index){
        console.log(this.footerData[index]);
        this.$set(this.extendedProperties.blackness, 'blackness', value);
        this.$set(this.extendedProperties.blackness, 'rate', this.footerData[index].rate);
        this.$set(this.extendedProperties.blackness, 'sampleCode', this.footerData[index].sampleCode);
        this.$set(this.extendedProperties.blackness, 'detectItem', this.footerData[index].detectItem);
        this.$set(this.extendedProperties.blackness, 'sceneDetect', this.footerData[index].sceneDetect);
        this.$set(this.extendedProperties.blackness, 'itemCode', this.footerData[index].itemCode);
      }
    },
  }
</script>

<style scoped>
  /deep/ .ant-table {
    line-height: 0.4
  }
  /deep/ .ant-form-item-label {
    text-align: center;
  }
</style>

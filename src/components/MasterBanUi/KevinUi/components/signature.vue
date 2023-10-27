<template>
    <el-dialog title="签名" :visible.sync="dialogShow" @clos="close" width="50%" append-to-body :close-on-click-modal="false">
        <img id="signimg" width="100%" height="400"/>
        <div class="signtime-area">
            <span style="margin-right:0.7rem">签字日期</span>
            <el-date-picker v-model="ruleForm.signTime" :clearable="false" type="datetime" format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
            </el-date-picker>
        </div>

        <el-button @click="buttonHWInit" size="small" type="primary">开始签名</el-button>
        <el-button @click="buttonClearSign" size="small">清空笔记</el-button>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleOk" size="small" type="primary">保存</el-button>
            <el-button @click="close" size="small">取消</el-button>
        </div>
    </el-dialog>
  </template>

  <script>
  export default {
      data() {
          return {
              websock: null,
              dialogShow: false,
              signimg: '',
              ruleForm: {
                signTime: '',
            }
          }
      },
      mounted(){
        this.setSignTime()
      },
      methods: {
        setSignTime() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，并且补零
            const day = String(now.getDate()).padStart(2, '0'); // 补零
            const hours = String(now.getHours()).padStart(2, '0'); // 补零
            const minutes = String(now.getMinutes()).padStart(2, '0'); // 补零
            const seconds = String(now.getSeconds()).padStart(2, '0'); // 补零
            this.ruleForm.signTime =
                year +
                '-' +
                month +
                '-' +
                day +
                ' ' +
                hours +
                ':' +
                minutes +
                ':' +
                seconds;
        },
          // 初始化weosocket
          initWebSocket(){
              this.dialogShow = true
              if(typeof(WebSocket) === "undefined"){
                  console.log("您的浏览器不支持WebSocket")
              }else{
                  const wsurl = "ws://127.0.0.1:29999";
                  // 实例化 WebSocket
                  this.websock = new WebSocket(wsurl);
                  // 监听 WebSocket 连接
                  this.websock.onopen = this.websocketonopen;
                  // 监听 WebSocket 错误信息
                  this.websock.onerror = this.websocketonerror;
                  // 监听 WebSocket 消息
                  this.websock.onmessage = this.websocketonmessage;

                  this.websock.onclose = this.websocketclose;
              }
          },
          // 连接建立之后执行send方法发送数据
          websocketonopen(){
              console.log("socket连接成功")
          },
          // 连接建立失败重连
          websocketonerror(){
              console.log("连接错误");
              this.initWebSocket();
          },
          // 数据接收
          websocketonmessage(msg){
              try{
                  var obj = JSON.parse(msg.data);
                  var msgID = obj.msgID;
                  var HWPenSign = obj.HWPenSign;
                  console.log(obj)
                  console.log(msgID)
                  if (msgID=="0") {
                      if (HWPenSign == "HWGetStatus")
                      {
                          var DeviceStatus = obj.DeviceStatus;
                          if(DeviceStatus==1)
                          {
                              alert("设备已连接");
                          }
                          else
                              alert("设备未连接");
                      }
                      else if(HWPenSign == "HWInitialize")
                      {
                          var message = obj.message;
                          console.log(message);
                          console.log("初始化成功，可以开始签字");
                      }
                      else if (HWPenSign=="HWGetSign") {
                          console.log(obj.message)
                          document.getElementById("signimg").src=obj.message;
                          this.signimg = obj.message
                      }
                      else if (HWPenSign=="HWClearSign") {
                          document.getElementById("signimg").src= '';
                          this.signimg = ''
                      }
                      else
                      {
                          console.log(obj.message);
                      }
                  }
                  else
                  {
                      console.log(obj.message);
                  }
              }catch(e){
                  console.log(msg.data);
              }
          },
          // 数据发送
          websocketsend(Data){
              this.websock.send(Data);
          },
          // 关闭
          websocketclose(e){
              console.log('WebSocket 断开连接',e);
          },
          buttonHWInit() {
              this.websock.send("{\"HWPenSign\":\"HWInitialize\",\"nLogo\":\"签名\" "+
                  ",\"width\":\"620\",\"height\":\"370\", \"nOrgX\":\"380\" "+
                  ",\"nOrgY\":\"305\",\"backcolor\":\"ffffff\",\"bordercolor\":\"cccccc\""+
                  ",\"fingerFap\":\"0\",\"key\":\"D9063E7FE567E09E84B00B5ECDE9B3F2\"}");
          },
          buttonClearSign() {
              this.websock.send("{\"HWPenSign\":\"HWClearSign\"}");
          },
          handleOk () {
              this.$emit('imgBase64',  { signimg: this.signimg, signTime: this.ruleForm.signTime })
              this.websock.close();
              this.close()
          },
          close () {
              this.$emit('close')
          }
      },
      beforeMount() {
          this.initWebSocket();
      },
      destroyed() {
          //离开路由之后断开 websocket 连接
          this.websock.close();
      },
  }
  </script>

  <style scoped>
  img[src=''],img:not([src]) {
      opacity: 0;
  }
  .signtime-area{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 0.7rem;
  }
  </style>

var currentPort='';
var SerialPort = require("serialport");
var express=require('express');
var bodyparser=require('body-parser');
var app=express();
SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
      if(port.pnpId==undefined){
          currentPort=port.comName;
          return currentPort
        }
    })
    
var serialPort = new SerialPort("COM21", {
    baudrate: 921600,  
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
//Transmission Problem NBP 2075 CS BNK-4548 Tando Ghulam Ali  Baden - Sindh Tech:Shajeel Branch:0297851250 Manzoor Mngr:03068372751
serialPort.on("open", function () {  
    console.log("COM connected");
});
function gsm_message_sending(serial, message, phone_no) {
    serial.write("AT+CMGF=1");
    serial.write('\r');
    serial.write("AT+CMGS=\"");
    serial.write(phone_no);
    serial.write('"')
    serial.write('\r');
    serial.write(message); 
    serial.write(Buffer([0x1A]));
    serial.write('^z');
}

app.post('/',function(req,res){
   console.log(req.body.sms+req.body.contact)
             gsm_message_sending(serialPort,req.body.sms,req.body.contact);
             console.log('Serial communication open');
             serialPort.write("AT^SYSCFG=13,1,3FFFFFFF,2,4");
             serialPort.write('\r');
             serialPort.on('data', function(data) {
                 console.log("Received data: " + data);
                 res.send()
                });      
})

var port=process.env.PORT||3000;
var server=app.listen(port,function () {
    var listenport=server.address().port;
    console.log("server is listening at port: "+listenport);
})
})

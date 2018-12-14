var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");

// マウス初期値
var mouse={x:0,y:0,x1:0,y1:0,color:"black"};
var draw=false;

// EventListenerでcanvas上のマウスの座標を取得
canvas.addEventListener("mousemove",function(e){
  var rect=e.target.getBoundingClientRect();
  ctx.lineWidth=document.getElementById("lineWidth").value;
  ctx.globalAlpha=document.getElementById("alpha").value/100;
  mouseX=e.clientX-rect.left;
  mouseY=e.clientY-rect.top;
  if(draw===true){
    ctx.beginPath();
    ctx.moveTo(mouseX1,mouseY1);
    ctx.lineTo(mouseX,mouseY);
    ctx.lineCap="round";
    ctx.stroke();
    mouseX1=mouseX;
    mouseY1=mouseY;
  }
});

// canvas内でマウスが押された時(描画開始時)
canvas.addEventListener("mousedown",function(e){
  draw=true;
  mouseX1=mouseX;
  mouseY1=mouseY;
  undoImage=ctx.getImageData(0,0,canvas.width,canvas.height);
});

// canvas内でマウスが離された時(描画終了時)
canvas.addEventListener("mouseup",function(e){
  draw=false;
});

// ペンコントロールの動作
lineWidth.addEventListener("mousemove",function(){
  var lineNum=document.getElementById("lineWidth").value;
  document.getElementById("lineNum").innerHTML=lineNum;
});
alpha.addEventListener("mousemove",function(){
  var alphaNum=document.getElementById("alpha").value;
  document.getElementById("alphaNum").innerHTML=alphaNum;
});

// ペン選択
$('li').click(function(){
  ctx.strokeStyle=$(this).css('background-color');
  var lineNum=$(this).css('--pen-size');
  document.getElementById("lineWidth").value=lineNum;
  document.getElementById("lineNum").innerHTML=lineNum; // 文字表示変更
});

// 消すボタン動作
$('#clear').click(function(e){
  if(!confirm('本当に消去しますか？'))return;
  e.preventDefault();
  ctx.clearRect(0,0,canvas.width,canvas.height);
});

$('#undo').click(function(e){
  ctx.putImageData(undoImage,0,0);
});

// 保存ボタン
function save(){
  var can=canvas.toDataURL("image/png");
  can=can.replace("image/png","image/octet-stream");
  window.open(can,"save");
}


// スマホ用動作対応----------------------------------------
var finger=new Array;
for(var i=0;i<10;i++){
  finger[i]={
    x:0,y:0,x1:0,y1:0,
    color:"rgb("
    +Math.floor(Math.random()*16)*15+","
    +Math.floor(Math.random()*16)*15+","
    +Math.floor(Math.random()*16)*15
    +")"
  };
}

// タッチ座標を取得
canvas.addEventListener("touchstart",function(e){
  e.preventDefault();
  var rect=e.target.getBoundingClientRect();
  ctx.lineWidth=document.getElementById("lineWidth").value;
  ctx.globalAlpha=document.getElementById("alpha").value/100;
  undoImage=ctx.getImageData(0,0,canvas.width,canvas.height);
  for(var i=0;i<finger.length;i++){
    finger[i].x1=e.touches[i].clientX-rect.left;
    finger[i].y1=e.touches[i].clientY-rect.top;
  }
});

// タッチが動き出したら描画開始
canvas.addEventListener("touchmove",function(e){
  e.preventDefault();
  var rect=e.target.getBoundingClientRect();
  for(var i=0;i<finger.length;i++){
    finger[i].x=e.touches[i].clientX-rect.left;
    finger[i].y=e.touches[i].clientY-rect.top;
    ctx.beginPath();
    ctx.moveTo(finger[i].x1,finger[i].y1);
    ctx.lineTo(finger[i].x,finger[i].y);
    ctx.lineCap="round";
    ctx.stroke();
    finger[i].x1=finger[i].x;
    finger[i].y1=finger[i].y;
  }
});

//線の太さを変える
lineWidth.addEventListener("touchmove",function(){
  var lineNum=document.getElementById("lineWidth").value;
  document.getElementById("lineNum").innerHTML=lineNum;
});

// 透明度を変える
alpha.addEventListener("touchmove",function(){
  var alphaNum=document.getElementById("alpha").value;
  document.getElementById("alphaNum").innerHTML=alphaNum;
});
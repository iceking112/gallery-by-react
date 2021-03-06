require('normalize.css/normalize.css');
//require('styles/App.css');
require('styles/App.scss');
import React from 'react';
var ControllerUnit = require('./ControllerUnit');
var ImgFigure = require('./ImgFigure');
// 获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');
// 利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas=(function getImageURL(imageDatasArr){
    for(var i=0,j=imageDatasArr.length;i<j;i++){
        var singleImageData=imageDatasArr[i];

        singleImageData.imageURL=require('../images/'+singleImageData.fileName);
        imageDatasArr[i]=singleImageData;
    }
    return imageDatasArr;
})(imageDatas);

/*
 * 获取区间内的一个随机值
 */
function getRangeRandom(low,high){
  return Math.ceil(Math.random()*(high-low)+low);
}
/*
 * 获取0~30之间的一个任意正负值
 */
function get30DegRotate(){
  return Math.random()>0.5 ? '':'-' + Math.ceil((Math.random()*30));
}


class AppComponent extends React.Component {
  constructor(props) {
     super(props)
     this.state = {
       imgsArrangeArr: [
         /*
         {
           pos: {
             left: 0,
             right: 0
           },
           rotate: 0,
           isInverse: false //图片正反面
         },
         isCenter:false //图片默认不居中
         */
     ]
     };

     this.Constant = { //常量的key ？
       centerPos: {
         left: 0,
         right: 0
       },
       hPosRange: { //水平方向取值范围
         leftSecX: [0, 0],
         rightSecX: [0, 0],
         y: [0, 0]
       },
       vPosRange: { //垂直方向取值范围
         x: [0, 0],
         topY: [0, 0]
       }
     }
  }

  /*
   *  翻转图片
   *  @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
   *  @return {Function}这是一个闭包函数，其内return一个真正待被执行的函数
   */
   inverse (index){
     return function(){
       var imgsArrangeArr=this.state.imgsArrangeArr;

       imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
       console.log("in setState");
       this.setState({
         imgsArrangeArr:imgsArrangeArr
       });
     }.bind(this);
   }
   /*
    *  利用rearrange函数，居中对应index的图片
    *  @param index 需要被居中的图片对应的图片信息数组的index值
    *  @return {Function}这是一个闭包函数，其内return一个真正待被执行的函数
    */
    center(index){
      return function(){
        this.rearrange(index);
      }.bind(this);
    }
  /*
   * 重新布局图片，传入居中的index
     指定居中排布哪个照片
   */
  rearrange (centerIndex){
    var imgsArrangeArr=this.state.imgsArrangeArr,
        Constant=this.Constant,
        centerPos=Constant.centerPos,
        hPosRange=Constant.hPosRange,
        vPosRange=Constant.vPosRange,
        hPosRangeLeftSecX=hPosRange.leftSecX,
        hPosRangeRightSecx=hPosRange.rightSecX,
        hPosRangeY=hPosRange.y,
        vPosRangeTopY=vPosRange.topY,
        vPosRangex=vPosRange.x,

        imgsArrangeTopArr=[],
        //取一个或者不取
        topImgNum=Math.floor(Math.random()*2),
        topImgSpliceIndex=0,

        imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);
        //首先居中 centerIndex的图片,居中的centerIndex的图片不需要旋转
        imgsArrangeCenterArr[0]={
          pos:centerPos,
          rotate:0,
          isCenter:true

        }
        //取出要布局上侧的图片的状态信息
        topImgSpliceIndex=Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum));
        imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function (value,index){
          imgsArrangeTopArr[index]={
            pos:{
              top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
              left:getRangeRandom(vPosRangex[0],vPosRangex[1])
            },
            rotate:get30DegRotate(),
            isCenter:false
          };
        });

        for (var i = 0,j=imgsArrangeArr.length,k=j/2; i < j; i++) {
          var hPosRangeLORX=[];
          //前半部分布局左边，有半部分布局右边
          if(i<k){
            hPosRangeLORX=hPosRangeLeftSecX;
          }else {
            hPosRangeLORX=hPosRangeRightSecx;
          }
          imgsArrangeArr[i]={
            pos:{
              top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
              left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
            },
            rotate:get30DegRotate(),
            isCenter:false
          };
        }

        if (imgsArrangeArr && imgsArrangeTopArr[0]) {
          imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

        this.setState({
          imgsArrangeArr:imgsArrangeArr
        });
  }

  //组件加载后，为每张图片计算其位置的范围
  componentDidMount(){
    //首先拿到舞台的大小
    var stageDOM=this.refs.stage,
        stageW=stageDOM.scrollWidth,
        stageH=stageDOM.scrollHeight,
        halfStageW=Math.ceil(stageW/2),
        halfStageH=Math.ceil(stageH/2);

    //拿到一个imageFigure的大小
    var imgFigureDOM=this.refs.imgFigure0.refs.figure,
        imgW=imgFigureDOM.scrollWidth,
        imgH=imgFigureDOM.scrollHeight,
        halfImgW=Math.ceil(imgW/2),
        halfImgH=Math.ceil(imgH/2);
    //计算中间图片的位置
    this.Constant.centerPos={
      left:halfStageW-halfImgW,
      top:halfStageH-halfImgH
    };
    //计算左右侧，图片位置取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧，图片位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    this.rearrange(0);
  }

  render() {
    console.log("in main render");
    var controllerUnits=[],imgFigures=[];
    imageDatas.forEach(function (value,index){
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index]={
          pos:{
            left:'0',
            top:'0'
          },
          rotate:0,
          isInverse:false,
          isCenter:false
        };
      }
       imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} key={index}
                        arrange={this.state.imgsArrangeArr[index]}
                        inverse={this.inverse(index).bind(this)}
                        center={this.center(index).bind(this)}/>);

       controllerUnits.push(<ControllerUnit key={index}
                             arrange={this.state.imgsArrangeArr[index]}
                             inverse={this.inverse(index).bind(this)}
                             center={this.center(index).bind(this)}/>);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
          <section className="img-sec">
            {imgFigures}
          </section>
          <nav className="controller-nav">
            {controllerUnits}
          </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

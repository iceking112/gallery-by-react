require('normalize.css/normalize.css');
//require('styles/App.css');
require('styles/App.scss');
import React from 'react';
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

function getRangeRandom(low,high){
  return Math.ceil(Math.random()*(high-low)+low);
}
class ImgFigure extends React.Component {
  render() {
    var styleObj={};

    if(this.props.arrange.pos){
      styleObj=this.props.arrange.pos;
    }
    return (
      <figure className="img-figure" style={styleObj} ref="figure">
          <img src={this.props.data.imageURL} alt={this.props.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
          </figcaption>
      </figure>
    )
  }
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
   * 重新布局图片，传入居中的index
     指定居中排布哪个照片
   */
  rearrange(centerIndex){
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
        topImgNum=Math.ceil(Math.random()*2),
        topImgSpliceIndex=0,

        imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);
        //首先居中 centerIndex的图片
        imgsArrangeCenterArr[0].pos=centerPos;
        //取出要布局上侧的图片的状态信息
        topImgSpliceIndex=Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum));
        imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function (value,index){
          imgsArrangeTopArr[index].pos={
            top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
            left:getRangeRandom(vPosRangex[0],vPosRangex[1])
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
            }
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
    var controllerUnits=[],imgFigures=[];
    imageDatas.forEach(function (value,index){
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index]={
          pos:{
            left:'0',
            top:'0'
          }
        };
      }
       imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} key={index}
                        arrange={this.state.imgsArrangeArr[index]}/>);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
          <section className="img-sec">
            {imgFigures}
          </section>
          <nav className="controller-nav">
          </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

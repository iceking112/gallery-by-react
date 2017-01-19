var React = require('react')

class ImgFigure extends React.Component {
  /*
   * imgFigure的点击处理函数
   */
  //  console.log("执行了render以外的东西");
   handleClick(e){
    console.log("调用click函数");
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else {
      this.props.center();
    }
     e.stopPropagation();
     e.preventDefault();
   }
  render() {
    console.log("in imgFigure render");
    var styleObj={};

    if(this.props.arrange.pos){
      styleObj=this.props.arrange.pos;
    }

    //如果图片的旋转角度有值且不为0，添加旋转角度
    if(this.props.arrange.rotate){
      (['Moz','ms','Webkit','']).forEach(function(value){
        styleObj[value+'Transform']='rotate('+this.props.arrange.rotate+'deg)';
      }.bind(this));
    }

    if(this.props.arrange.isCenter){
      styleObj.zIndex=11;
    }

    var imgFigureClassName="img-figure";
        imgFigureClassName+=this.props.arrange.isInverse ? ' is-inverse':'';
    return (
      <figure className={imgFigureClassName} style={styleObj} ref="figure" onClick={this.handleClick.bind(this)}>
          <img src={this.props.data.imageURL} alt={this.props.data.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
            <div className="img-back" onClick={this.handleClick.bind(this)}>
              <p>
                {this.props.data.desc}
              </p>
            </div>
          </figcaption>
      </figure>
    )
  }
}

module.exports = ImgFigure;

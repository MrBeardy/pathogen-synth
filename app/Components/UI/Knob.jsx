import { ArcUtils } from '../../Utils.jsx'
import React from 'react';

export default class Knob extends React.Component {
  constructor(props) {
    super(props);

    this.handleDocumentMouseUp = this.handleDocumentMouseUp.bind(this);
    this.handleDocumentMouseMove = this.handleDocumentMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);

    this.curveStart = 40;
    this.curveEnd = 320;

    this.width = this.props.radius;
    this.height = this.props.radius + ((this.props.fontSize + 3) * 2);

    this.state = {
      dragging: false
    }
  }

  get normalizedValue() {
    let slope = (this.curveEnd - this.curveStart) / (this.props.maxValue - this.props.minValue);

    return this.curveStart + slope * (this.state.value - this.props.minValue);
  }

  componentWillMount() {
    this.setValue(this.props.initialValue);
  }

  setValue(value) {
    this.setState({
      value: this.clamp(parseInt(value))
    });

    if (this.props.onUpdate) {
      this.props.onUpdate(value)
    }
  }

  clamp(v) {
    return (v < this.props.minValue) ? this.props.minValue : ((v > this.props.maxValue) ? this.props.maxValue : v);
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleDocumentMouseUp);
    document.addEventListener("mousemove", this.handleDocumentMouseMove);
  }

  handleMouseDown(e) {
    this.setState({
      dragging: true
    })
  }

  handleDocumentMouseUp(e) {
    this.setState({
      dragging: false
    })
  }

  handleDocumentMouseMove(e) {
    if (this.state.dragging) {
      e.preventDefault();

      this.setValue(this.state.value + -e.movementY);
    }
  }

  arc(curveStart, curveEnd, color = this.props.baseColor) {
    let { radius, strokeWidth } = this.props;
    let { height } = this;

    let halfRadius = radius / 2;

    return (
      <path
        d={ ArcUtils.describeArc(halfRadius, halfRadius, halfRadius - strokeWidth, curveStart, curveEnd) }
        fill="none"
        stroke={ color }
        strokeWidth={ strokeWidth }
        transform={ `rotate(180, ${halfRadius},${halfRadius}), translate(0, ${halfRadius - height/2})` }
      />
    )
  }

  text(text, x, y, color = this.props.textColor, fontFamily = this.props.fontFamily) {
    let { fontSize } = this.props;

    return (
      <text textAnchor="middle" x={ x } y={ y } fontFamily={ fontFamily } fill={ color } fontWeight="bold" fontSize={ fontSize }>
        { text }
      </text>
    )
  }

  render() {
    let Components = {};

    let { value } = this.state;
    let { valueSuffix, title, baseColor, minValue, maxValue, color, fontSize, radius, strokeWidth } = this.props;
    let { width, height, normalizedValue, curveStart, curveEnd } = this;

    Components.title = this.text(title, width/2, fontSize);
    Components.valueText = this.text(value + valueSuffix, width/2, height - fontSize/2);

    Components.valueLine = (
      <path
        d={ `M${radius/2} ${height/2} l${-(strokeWidth*3-2)} ${strokeWidth*3}` }
        fill="none"
        stroke={ baseColor }
        strokeWidth={ strokeWidth }
        strokeLinecap="round"
        transform={ `rotate(${normalizedValue - curveStart}, ${radius/2}, ${height/2})` }
      />
    )

    if (value > minValue) {
      Components.valueArc = this.arc(curveStart, normalizedValue, color);
    }

    if (value < maxValue - strokeWidth/2) {
      Components.outlineArc = this.arc(normalizedValue+1, curveEnd);
    }

    return (
      <svg ref="svg" width={ width } height={ height } onMouseDown={ this.handleMouseDown }>
        { Components.title      }
        { Components.valueArc   }
        { Components.outlineArc }
        { Components.valueLine  }
        { Components.valueText  }
      </svg>
    )
  }
}

Knob.defaultProps = {
  initialValue: 0,
  minValue: 0,
  maxValue: 256,
  fontSize: 14,
  radius: 50,
  strokeWidth: 5,

  title: "",
  valueSuffix: "",

  baseColor: "#333",
  color: "#e17923",
  fontFamily: "arial",
  textColor: "#333",
}

Knob.propTypes = {
  initialValue: React.PropTypes.number,
  minValue: React.PropTypes.number,
  maxValue: React.PropTypes.number,
  fontSize: React.PropTypes.number,
  radius: React.PropTypes.number,
  strokeWidth: React.PropTypes.number,

  title: React.PropTypes.string,
  valueSuffix: React.PropTypes.string,
  baseColor: React.PropTypes.string,
  color: React.PropTypes.string,
  fontFamily: React.PropTypes.string,
  textColor: React.PropTypes.string,
}

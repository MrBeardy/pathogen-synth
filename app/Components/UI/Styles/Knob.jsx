import { ArcUtils } from '../../Utils.jsx'
import React from 'react';

export default class Knob extends React.Component {
  constructor(props) {
    super(props);
    this.handleDocumentMouseUp = this.handleDocumentMouseUp.bind(this);
    this.handleDocumentMouseMove = this.handleDocumentMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);

    this.fontSize = 14;

    this.radius = 50;
    this.strokeWidth = 5;

    this.minValue = 0;
    this.maxValue = 256;

    this.curveStart = 40;
    this.curveEnd = 320;

    this.width = this.radius;
    this.height = this.radius + ((this.fontSize + 3) * 2);
  }

  get clampedValue() {
    let v = this.props.value;
    return (v < this.minValue) ? this.minValue : ((v > this.maxValue) ? this.maxValue : v);
  }

  get normalizedValue() {
    let v = this.clampedValue;
    let slope = (this.curveEnd - this.curveStart) / (this.maxValue - this.minValue);

    return this.curveStart + slope * (v - this.minValue);
  }

  handleMouseDown(e) {
    this.dragging = true;
  }

  handleDocumentMouseUp(e) {
    this.dragging = false;
  }

  handleDocumentMouseMove(e) {
    if (this.dragging) {
      console.log("Moving");
    }
  }

  arc(curveStart, curveEnd, color = this.props.baseColor) {
    return (
      <path
        d={ArcUtils.describeArc(this.radius/2, this.radius/2, this.radius/2 - this.strokeWidth, curveStart, curveEnd)}
        fill="none"
        stroke={color}
        strokeWidth={this.strokeWidth}
        transform={`rotate(180, ${this.radius/2},${this.radius/2}), translate(0, ${this.radius/2 - this.height/2})`}
      />
    )
  }

  text(text, x, y, color = this.props.textColor, fontFamily = this.props.fontFamily) {
    return (
      <text textAnchor="middle" x={x} y={y} fontFamily={fontFamily} fill={color} fontWeight="bold" fontSize={this.fontSize}>
        { text }
      </text>
    )
  }

  render() {
    let title, valueText, valueLine, valueArc, outlineArc;

    title = this.text(this.props.title, this.width/2, this.fontSize);
    valueText = this.text(this.props.clampText ? this.clampedValue : this.props.value, this.width/2, this.height - this.fontSize/2);

    valueLine = (
      <path
        d={`M${this.radius/2} ${this.height/2} l${-(this.strokeWidth*3-2)} ${this.strokeWidth*3}`}
        fill="none"
        stroke={this.props.baseColor}
        strokeWidth={this.strokeWidth}
        strokeLinecap="round"
        transform={`rotate(${this.normalizedValue - this.curveStart}, ${this.radius/2}, ${this.height/2})`}
      />
    )

    if (this.props.value > this.minValue) {
      valueArc = this.arc(this.curveStart, this.normalizedValue, this.props.color);
    }

    if (this.props.value < this.maxValue - this.strokeWidth/2) {
      outlineArc = this.arc(this.normalizedValue+1, this.curveEnd);
    }

    return (
      <svg width={this.width} height={this.height} onMouseDown={ this.handleMouseDown }>
        { title      }
        { valueArc   }
        { outlineArc }
        { valueLine  }
        { valueText  }
      </svg>
    )
  }
}

Knob.defaultProps = {
  title: "",
  baseColor: "#333",
  color: "#e17923",
  value: 0,

  fontFamily: "arial",
  textColor: "#333",
  clampText: false,
}

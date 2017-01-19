
import _ from 'lodash';
import $ from 'jquery';

import React from 'react';
import Radium from 'radium';

import { render } from 'react-dom';

import Knob from './Components/UI/Knob.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.state = {
      title: "Knob"
    }
  }

  handleKeyDown(event) {
    this.setState({
      title: event.target.value
    })
  }

  render() {
    return (
      <div>
        <input defaultValue={ this.state.title } type="text" onKeyDown={ this.handleKeyDown } />
        <Knob title={ this.state.title } theme="Ableton" />
      </div>
    )
  }
}

render(<App />, document.getElementById('app'));


import _ from 'lodash';
import $ from 'jquery';

import React from 'react';
import { render } from 'react-dom';

import Knob from './Components/UI/Knob.jsx'

import Tone from 'tone';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.handleGainUpdate = this.handleGainUpdate.bind(this);
    this.handleReverbRoomSizeUpdate = this.handleReverbRoomSizeUpdate.bind(this);
    this.handleDetuneUpdate = this.handleDetuneUpdate.bind(this);

    this.synth = new Tone.PolySynth(6, Tone.Synth).toMaster();
    this.synth.set("detune", -1200);

    this.reverb = new Tone.JCReverb(0.2).connect(Tone.Master);

    this.synth.connect(this.reverb);

    this.state = {
      roomSizeAlpha: .45
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(e) {
    let noteMap = {
      KeyQ:   "A3",
      Digit2: "A#3",
      KeyW:   "B3",
      Digit3: "B#3",
      KeyE:   "C4",
      Digit4: "C#4",
      KeyR:   "D4",
      Digit5: "D#4",
      KeyT:   "E4",
      Digit6: "E#4",
      KeyY:   "F4",
      Digit7: "F#4",
      KeyU:   "G4",
      Digit8: "G#4",
      KeyI:   "A4",
      Digit9: "A#4",
      KeyO:   "B4",
      Digit0: "B#4",
      KeyP:   "C5",
    }

    this.synth.triggerAttackRelease(noteMap[e.code], "8n");
  }

  handleGainUpdate(value) {
    Tone.Master.volume.value = value;
  }

  handleDetuneUpdate(value) {
    this.synth.set("detune", value);
  }

  handleReverbRoomSizeUpdate(value) {
    this.reverb.set("roomSize", value / 100);
    this.setState({
      roomSizeAlpha: value / 100
    })
  }

  render() {
    return (
      <div>
        <div>
          <div>Press any key on the top row to play a note</div>
        </div>
        <div>
          <Knob
            onUpdate={ this.handleGainUpdate }
            fontSize={ 10 }
            title="Master"
            valueSuffix=" dB"
            initialValue={ -30 }
            minValue={ -100 }
            maxValue={ -10 }
          />

          <Knob
            onUpdate={ this.handleDetuneUpdate }
            fontSize={ 10 }
            title="Detune"
            valueSuffix=" cts."
            initialValue={ 550 }
            maxValue={ 1440 }
          />

          <Knob
            onUpdate={ this.handleReverbRoomSizeUpdate }
            fontSize={ 10 }
            color={`hsla(200, 99%, 34%, ${this.state.roomSizeAlpha})`}
            title="Room Size"
            initialValue={ 45 }
            maxValue={ 100 }
          />
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById('app'));

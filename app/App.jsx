
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
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(e) {
    let noteMap = {
      KeyQ:   "A2",
      Digit2: "A#2",
      KeyW:   "B2",
      Digit3: "B#2",
      KeyE:   "C3",
      Digit4: "C#3",
      KeyR:   "D3",
      Digit5: "D#3",
      KeyT:   "E3",
      Digit6: "E#3",
      KeyY:   "F3",
      Digit7: "F#3",
      KeyU:   "G3",
      Digit8: "G#3",
      KeyI:   "A3",
      Digit9: "A#3",
      KeyO:   "B3",
      Digit0: "B#3",
      KeyP:   "C4",
    }

    this.synth.triggerAttackRelease(Tone.Frequency(noteMap[e.code]).harmonize([0, 3, 7]).toFrequency(), "4n");
  }

  handleGainUpdate(value) {
    Tone.Master.volume.value = value;
  }

  handleDetuneUpdate(value) {
    this.synth.set("detune", value);
  }

  handleReverbRoomSizeUpdate(value) {
    this.reverb.set("roomSize", value / 100);
  }

  render() {
    return (
      <div>
        <div>
          <div>Press any key on the top row to play a harmonized note</div>
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
            color="#aa0000"
            title="Detune"
            valueSuffix=" cts."
            initialValue={ 550 }
            maxValue={ 1440 }
          />

          <Knob
            onUpdate={ this.handleReverbRoomSizeUpdate }
            fontSize={ 10 }
            color="#aa0000"
            title="Room Size"
            initialValue={ 90 }
            maxValue={ 100 }
          />
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById('app'));

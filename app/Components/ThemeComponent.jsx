import React from 'react';

export default class ThemeComponent extends React.Component {
  static Themes = {}

  constructor(props) {
    super(props);
  }

  render() {
    let { Themes } = this.constructor;

    if (Themes.hasOwnProperty(this.props.theme)) {
      return Themes[this.props.theme].render();
    } else if (Themes.hasOwnProperty("Default")) {
      return Themes["Default"].render();
    } else {
      return null;
    }
  }
}

import React, { Component } from 'react';

import Title from 'components/title';
import LocationData from 'components/locationData';

export default class App extends Component { // eslint-disable-line
  render() {
    return (
      <div>
        <Title />
        <LocationData />
      </div>
    );
  }
}

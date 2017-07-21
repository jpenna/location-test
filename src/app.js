import React, { Component } from 'react';

import Title from 'components/title';
import LocationData from 'components/locationData';
import InputUrl from 'components/inputUrl';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
    };

    this.handleUrlSubmit = this.handleUrlSubmit.bind(this);
  }

  handleUrlSubmit(url) {
    return this.setState({ url });
  }

  render() {
    return (
      <div>
        <Title />
        <InputUrl onSubmit={this.handleUrlSubmit} />
        <LocationData title="Your Location" />
        <LocationData title="Webpage Location" url={this.state.url} hideButton />
      </div>
    );
  }
}

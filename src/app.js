import React, { Component } from 'react';

import Title from 'components/title';
import LocationData from 'components/locationData';
import InputUrl from 'components/inputUrl';
import Map from 'components/map';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      locations: { user: {}, web: {} },
    };

    this.handleUrlSubmit = this.handleUrlSubmit.bind(this);
    this.setLocationData = this.setLocationData.bind(this);
  }

  setLocationData(prop, data) {
    const locations = Object.assign({}, this.state.locations, { [prop]: data });
    return this.setState({ locations });
  }

  handleUrlSubmit(url) {
    return this.setState({ url });
  }

  render() {
    return (
      <div className="section">
        <div className="container">
          <Title />
          <InputUrl onSubmit={this.handleUrlSubmit} />
          <div className="columns">
            <div className="column has-text-right">
              <LocationData
                title="Your Location"
                locationData={this.state.locations.user}
                setLocationData={this.setLocationData}
                type={'user'}
              />
            </div>
            <div className="column">
              <Map
                locations={this.state.locations}
                url={this.state.url}
              />
            </div>
            <div className="column">
              <LocationData
                title="Webpage Location"
                url={this.state.url}
                locationData={this.state.locations.web}
                setLocationData={this.setLocationData}
                type={'web'}
                hideButton
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

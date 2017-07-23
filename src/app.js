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
          <div className="margin-bottom-2">
            <Title />
          </div>
          <div className="margin-bottom-2">
            <InputUrl onSubmit={this.handleUrlSubmit} />
          </div>
          <div className="is-flex root-columns">
            <div className="column is-4 user-column">
              <LocationData
                title="Your Location"
                locationData={this.state.locations.user}
                setLocationData={this.setLocationData}
                type={'user'}
              />
            </div>
            <div className="column is-4 map-column">
              <Map
                locations={this.state.locations}
              />
            </div>
            <div className="column is-4 web-column">
              <LocationData
                title="Webpage Location"
                url={this.state.url}
                locationData={this.state.locations.web}
                setLocationData={this.setLocationData}
                type={'web'}
                hideButtons
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

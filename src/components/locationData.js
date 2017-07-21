/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

export default class LocationData extends Component {
  static renderLocationData(locationData) {
    return _(locationData)
      .omitBy(value => value === '')
      .map((value, key) => (
        <div key={key}>
          <span>{key}</span>
          <span>{value}</span>
        </div>
      ))
      .value();
  }

  constructor(props) {
    super(props);

    this.state = {
      locationData: {},
      error: '',
    };

    this.getMyLocation = this.getMyLocation.bind(this);
  }

  getMyLocation() {
    axios.get(`http://${process.env.API_URL}/json/`)
      .then(({ data }) => this.setState({ locationData: data }))
      .catch(() => this.setState({ error: 'Sorry, couldn\'t fecth data.' }));
  }

  render() {
    return (
      <div>
        <div>
          <h2>Estimated Location</h2>
        </div>
        <div>
          <button onClick={this.getMyLocation}>My Location</button>
        </div>
        <div>
          {LocationData.renderLocationData(this.state.locationData)}
          <div>{this.state.error}</div>
        </div>
      </div>
    );
  }
}

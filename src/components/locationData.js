/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

    this.getLocation = this.getLocation.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) this.getLocation();
  }

  getLocation() {
    axios.get(`http://${process.env.API_URL}/json/${this.props.url}`)
      .then(({ data }) => this.setState({ locationData: data }))
      .catch(() => this.setState({ error: 'Sorry, couldn\'t fecth data.' }));
  }

  render() {
    return (
      <div>
        <div>
          <h2>{this.props.title}</h2>
        </div>
        <div hidden={this.props.hideButton}>
          <button onClick={this.getLocation}>My Location</button>
        </div>
        <div>
          {LocationData.renderLocationData(this.state.locationData)}
          <div>{this.state.error}</div>
        </div>
      </div>
    );
  }
}

LocationData.propTypes = {
  url: PropTypes.string,
  hideButton: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

LocationData.defaultProps = {
  url: '',
  hideButton: false,
};

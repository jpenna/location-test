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
      error: '',
    };

    this.getLocation = this.getLocation.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) this.getLocation();
  }

  getLocation() {
    axios.get(`http://freegeoip.net/json/${this.props.url}`)
      .then(({ data }) => {
        this.props.setLocationData(this.props.type, data);
        this.setState({ error: '' });
      })
      .catch(() => this.setState({ error: 'Sorry, couldn\'t fecth data.' }));
  }

  reset() {
    this.props.setLocationData(this.props.type, {});
  }

  render() {
    return (
      <div>
        <div>
          <h2>{this.props.title}</h2>
          <button
            type="button"
            className="reset"
            onClick={this.reset}
            hidden={this.props.hideButton || !Object.keys(this.props.locationData).length}
          >
            Reset
          </button>
        </div>
        <div hidden={this.props.hideButton || Object.keys(this.props.locationData).length}>
          <button
            className="get-data"
            onClick={this.getLocation}
          >
            My Location
          </button>
        </div>
        <div>
          {LocationData.renderLocationData(this.props.locationData)}
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
  setLocationData: PropTypes.func.isRequired,
  locationData: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  type: PropTypes.string.isRequired,
};

LocationData.defaultProps = {
  url: '',
  hideButton: false,
  locationData: {},
};

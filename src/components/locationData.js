/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import _ from 'lodash';

export default class LocationData extends Component {
  static renderLocationData(locationData) {
    return _(locationData)
      .omitBy(value => value === '')
      .map((value, key) => {
        const keyName = key === 'ip' ? 'IP' : key.replace('_', ' ');
        return (
          <div key={key} className="margin-bottom-half">
            <div className="title is-7 is-bold is-capitalized">{keyName}</div>
            <div className="subtitle is-6">{value}</div>
          </div>
        );
      })
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
    return axios.get(`http://freegeoip.net/json/${this.props.url}`)
      .then(({ data }) => {
        this.props.setLocationData(this.props.type, data);
        this.setState({ error: '' });
      })
      .catch((err) => {
        // TODO remove console.log
        console.log(err); // eslint-disable-line
        this.setState({ error: 'Sorry, couldn\'t fecth data.' });
      });
  }

  reset() {
    this.props.setLocationData(this.props.type, {});
  }

  render() {
    return (
      <div>
        <div>
          <div>
            <h3 className="title is-5 is-inline-block">{this.props.title}</h3>
            <span
              className="field"
              hidden={this.props.hideButton || !Object.keys(this.props.locationData).length}
            >
              <button
                type="button"
                className="reset-button button is-small is-borderless is-danger inverted"
                onClick={this.reset}
              >
                <span className="icon is-small">
                  <i className="fa fa-trash" />
                </span>
              </button>
            </span>
          </div>
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

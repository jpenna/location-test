/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import _ from 'lodash';

export default class LocationData extends Component {
  static renderLocationData(locationData) {
    const dataToShow = [
      'ip', 'country_name', 'region_name', 'city', 'zip_code', 'latitude', 'longitude',
    ];

    return _(locationData)
      .pickBy((value, key) => dataToShow.indexOf(key) >= 0)
      .map((value, key) => {
        const keyName = key === 'ip' ? 'IP' : key.replace('_', ' ');
        return (
          <div key={key} className="margin-bottom-half">
            <div className="title is-7 is-bold is-capitalized">{keyName}</div>
            <div className="subtitle is-6">{value || '-'}</div>
          </div>
        );
      })
      .value();
  }

  constructor(props) {
    super(props);

    this.state = {
      error: '',
      infoDate: '',
      showBalloon: false,
      fetching: false,
    };

    this.getLocation = this.getLocation.bind(this);
    this.clearLocationData = this.clearLocationData.bind(this);
    this.toggleInfoLabel = this.toggleInfoLabel.bind(this);
    this.hideInfoLabel = this.hideInfoLabel.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) this.getLocation();
  }

  getLocation() {
    this.setState({ fetching: true });
    return axios.get(`http://freegeoip.net/json/${this.props.url}`)
      .then(({ data }) => {
        this.props.setLocationData(this.props.type, data);
        this.setState({ error: '', infoDate: new Date().toLocaleString('pt-br'), fetching: false });
      })
      .catch(({ response }) => {
        // Reset locationData
        this.clearLocationData();

        let error;
        if (!response) error = 'Check your internet connection.';
        else if (response.status === 404) error = `${this.props.url}\ndoesn't exist.`;
        else error = 'Sorry, couldn\'t fecth data.\nPlease try again.';

        return this.setState({ error, fetching: false });
      });
  }

  clearLocationData() {
    this.props.setLocationData(this.props.type, {});
    this.setState({ infoDate: '' });
  }

  toggleInfoLabel() {
    this.setState({ showBalloon: !this.state.showBalloon });
  }

  hideInfoLabel() {
    this.setState({ showBalloon: false });
  }

  render() {
    const { locationData, hideButtons, type, title } = this.props;
    const { infoDate, error, showBalloon } = this.state;

    return (
      <div>
        <div>
          <div className="is-relative">

            {/* Info balloon */}
            <div className={`notification is-primary info-balloon ${showBalloon ? '' : 'is-hidden'}`}>
              <button className="delete" onClick={this.hideInfoLabel} />
              This is your data according to freejeoip.net at {infoDate}
            </div>

            {/* Title */}
            <button
              className={`js-showInfo is-buttonless ${infoDate ? 'pointer' : ''}`}
              disabled={!infoDate}
              onClick={this.toggleInfoLabel}
            >
              <h3 className="title is-5 is-inline-block">{title}</h3>
              <span className={`icon info-sign ${infoDate ? '' : 'is-hidden'}`}>
                <i className="fa fa-info-circle" />
              </span>
            </button>

            {/* Reset button */}
            <span
              className="field"
              hidden={hideButtons || !Object.keys(locationData).length}
            >
              <button
                type="button"
                className="reset-button button is-small is-borderless
                is-danger inverted text-bottom-align"
                onClick={this.clearLocationData}
              >
                <span className="icon">
                  <i className="fa fa-trash" />
                </span>
              </button>
            </span>

          </div>
        </div>

        {/* Spinner */}
        <div className="section mobile-paddingless" hidden={!this.state.fetching}>
          <div className="spinner">
            <div className="bounce1" />
            <div className="bounce2" />
            <div className="bounce3" />
          </div>
        </div>

        {/* Column content */}
        <div hidden={this.state.fetching}>

          {/* My Location button (User Column) */}
          <div
            hidden={hideButtons || Object.keys(locationData).length}
            className="section mobile-paddingless"
          >
            <button
              className="get-location-button is-buttonless pointer"
              onClick={this.getLocation}
            >
              <div className="icon button is-info is-rounded margin-bottom-half">
                <i className="fa fa-map-marker" />
              </div>
              <div className="title is-6">
                My Location
              </div>
            </button>
          </div>

          {/* Message (Web Column) */}
          <div
            hidden={type === 'user' || Object.keys(locationData).length}
            className="section mobile-paddingless"
          >
            <div className="content has-text-centered" hidden={error}>
              Let&apos;s get some page info?<br />Type in a URL above
            </div>
          </div>

          {/* Request error message */}
          <div className="is-danger has-text-centered help title is-6 pre-formatted is-marginless">
            {error}
          </div>

          {/* Info */}
          <div hidden={error}>
            {LocationData.renderLocationData(locationData)}
          </div>
        </div>

      </div>
    );
  }
}

LocationData.propTypes = {
  url: PropTypes.string,
  hideButtons: PropTypes.bool,
  title: PropTypes.string.isRequired,
  setLocationData: PropTypes.func.isRequired,
  locationData: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  type: PropTypes.string.isRequired,
};

LocationData.defaultProps = {
  url: '',
  hideButtons: false,
  locationData: {},
};

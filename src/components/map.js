import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Script from 'react-load-script';
import _ from 'lodash';

export default class Map extends Component {

  constructor(props) {
    super(props);

    this.markers = [];

    this.getScript = this.getScript.bind(this);
    this.renderMap = this.renderMap.bind(this);
    this.updateMap = this.updateMap.bind(this);
  }

  componentDidUpdate() {
    this.updateMap();
  }

  getScript() {
    return (
      <Script
        url={`https://maps.googleapis.com/maps/api/js?key=${process.env.GMAPS_KEY}&libraries=geometry`}
        onLoad={this.renderMap}
      />
    );
  }

  updateMap() {
    const url = this.props.url;

    const pins = _.reduce(this.props.locations, (acc, data, type) => {
      if (!Object.keys(data).length) return acc;
      const name = type === 'user' ? 'You' : url;
      return acc.concat([[name, data.latitude, data.longitude]]);
    }, []);

    // The calculation with index is only possible with 2 values,
    // if there is more this calc should change
    const center = pins
      .reduce(
        (acc, data) => [acc[0] + data[1], acc[1] + data[2]],
        [0, 0] // eslint-disable-line comma-dangle
      )
      .map((val) => {
        const quantity = pins.length || 1;
        return (val / quantity).toFixed(5);
      });

    this.map.panTo(new google.maps.LatLng(center[0], center[1]));

    let zoom = 6;
    if (pins.length > 1) {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(pins[0][1], pins[0][2]),
        new google.maps.LatLng(pins[1][1], pins[1][2]) // eslint-disable-line comma-dangle
      );

      const base = (1 / Math.pow(distance, 0.05)); // eslint-disable-line
      // Use different formular depending on distance
      zoom = distance > 3000000 ? base * 6 : base * 10;
      zoom = parseInt(zoom, 10);
    }

    this.map.setZoom(zoom);

    // remove all markers
    this.markers.map((marker) => {
      marker.setMap(null);
      return null;
    });

    // set new markers
    this.markers = pins.map(place => (
      new google.maps.Marker({
        position: new google.maps.LatLng(place[1], place[2]),
        map: this.map,
      })
    ));

    // add new markers
    this.markers.forEach((marker) => {
      marker.setMap(this.map);
      // TODO Not working, fix later
      // google.maps.event.addListener(marker, 'click',
      //   () => {
      //     this.infowindow.setContent(pins[index][0]);
      //     this.infowindow.open(this.map, index);
      //   });
    });
  }

  renderMap() {
    // Center Brazil
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: new google.maps.LatLng(-15, -50),
    });

    this.infowindow = new google.maps.InfoWindow();
  }

  render() {
    return (
      <div>
        <div id="map" className="map-frame" />
        <div>
          {this.getScript()}
        </div>
      </div>
    );
  }
}


Map.propTypes = {
  locations: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  url: PropTypes.string.isRequired,
};

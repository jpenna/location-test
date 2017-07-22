import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Script from 'react-load-script';

import * as mapUtils from 'utils/map_utils';

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
    const locations = this.props.locations;

    const pins = mapUtils.getPins(locations, url);
    const center = mapUtils.getMapCenter(pins);
    const zoom = mapUtils.getMapZoom(pins);

    this.map.panTo(new google.maps.LatLng(center[0], center[1]));
    this.map.setZoom(zoom);

    mapUtils.removeMarkers(this.markers);
    this.markers = mapUtils.getNewMarkers(pins, this.map);
    mapUtils.addMarkers(this.markers, this.map);
  }

  renderMap() {
    // Center Brazil
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: new google.maps.LatLng(-15, -50),
      mapTypeControl: false,
      streetViewControl: false,
      rotateControl: false,
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

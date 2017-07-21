import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Script from 'react-load-script';

export default class Map extends Component {
  static getScript() {
    return (
      <Script
        url={`https://maps.googleapis.com/maps/api/js?key=${process.env.GMAPS_KEY}`}
        onLoad={Map.renderMap}
      />
    );
  }

  static renderMap() {
    const locations = [
      ['Bondi Beach', -33.890542, 151.274856, 4],
      ['Coogee Beach', -33.923036, 151.259052, 5],
      ['Cronulla Beach', -34.028249, 151.157507, 3],
      ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
      ['Maroubra Beach', -33.950198, 151.259302, 1],
    ];

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: new google.maps.LatLng(-33.92, 151.25),
    });

    const infowindow = new google.maps.InfoWindow();

    locations.forEach((place, key) => {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(place[1], place[2]),
        map,
      });

      google.maps.event.addListener(marker, 'click',
        ((pin, i) => (
          () => {
            infowindow.setContent(locations[i][0]);
            infowindow.open(map, pin);
          }
        )
      )(marker, key));
    });
  }

  render() {
    return (
      <div>
        <div id="map" className="map-frame" />
        <div>
          {Map.getScript()}
        </div>
      </div>
    );
  }
}


Map.propTypes = {
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,
};

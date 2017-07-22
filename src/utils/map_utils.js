import _ from 'lodash';

export function getPins(locations, url) {
  return _.reduce(locations, (acc, data, type) => {
    if (!Object.keys(data).length) return acc;
    const name = type === 'user' ? 'You' : url;
    return acc.concat([[name, data.latitude, data.longitude]]);
  }, []);
}

export function getMapZoom(pins) {
  if (pins.length > 1) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(pins[0][1], pins[0][2]),
      new google.maps.LatLng(pins[1][1], pins[1][2]) // eslint-disable-line comma-dangle
    );

    const base = (1 / Math.pow(distance, 0.05)); // eslint-disable-line
    // Use different formula depending on distance
    const multiplier = distance > 3000000 ? 6 : 10;

    return parseInt(base * multiplier, 10);
  }
  return 6;
}

export function getMapCenter(pins) {
  return pins
    .reduce(
      (acc, data) => [acc[0] + data[1], acc[1] + data[2]],
      [0, 0] // eslint-disable-line comma-dangle
    )
    .map((val) => {
      const quantity = pins.length || 1;
      return (val / quantity).toFixed(5);
    });
}

export function removeMarkers(markers) {
  return markers.map((marker) => {
    marker.setMap(null);
    return null;
  });
}

export function getNewMarkers(pins, map) {
  return pins.map(place => (
    new google.maps.Marker({
      position: new google.maps.LatLng(place[1], place[2]),
      map,
    })
  ));
}

export function addMarkers(markers, map) {
  return markers.forEach((marker) => {
    marker.setMap(map);
    // TODO Not working, fix later
    // google.maps.event.addListener(marker, 'click',
    //   () => {
    //     infowindow.setContent(pins[index][0]);
    //     infowindow.open(map, index);
    //   });
  });
}

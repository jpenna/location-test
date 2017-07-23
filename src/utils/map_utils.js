import _ from 'lodash';

export function getPins(locations) {
  return _.reduce(locations, (acc, data) => {
    if (!Object.keys(data).length) return acc;
    return acc.concat([[data.latitude, data.longitude]]);
  }, []);
}

export function getMapZoom(pins) {
  if (pins.length > 1) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(pins[0][0], pins[0][1]),
      new google.maps.LatLng(pins[1][0], pins[1][1]) // eslint-disable-line comma-dangle
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
      (acc, data) => [
        acc[0] + data[0] || acc[0],
        acc[1] + data[1] || acc[1],
      ],
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
      position: new google.maps.LatLng(place[0], place[1]),
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

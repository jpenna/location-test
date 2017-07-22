/* eslint import/no-extraneous-dependencies: "off" */
/*  eslint import/no-unresolved: "off" */

import * as mapUtils from 'src/utils/map_utils';

describe('Map Utils', () => {
  let locations;
  let pins;
  let url;
  let calcDistance;
  let markerFactory;

  beforeAll(() => {
    url = 'google.com';
    calcDistance = jest.fn();
    markerFactory = jest.fn();

    locations = {
      user: {
        city: 'Belo Horizonte',
        latitude: 1123,
        longitude: 2124,
      },
      web: {
        city: 'Mountain View',
        latitude: 31234,
        longitude: 21354,
      },
    };

    const user = locations.user;
    const web = locations.web;
    pins = [
      [user.city, user.latitude, user.longitude],
      [url, web.latitude, web.longitude],
    ];

    global.google = {
      maps: {
        geometry: { spherical: { computeDistanceBetween: calcDistance } },
        LatLng: (lat, lng) => ({ lat, lng }),
        Marker: markerFactory,
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getPins(): should return pins with name, lat and lng', () => {
    const result = mapUtils.getPins(locations, url);
    expect(result).toEqual(pins);
  });

  it('getPins(): should return null if there is no locations', () => {
    const emptyLocations = { user: {}, web: {} };
    const result = mapUtils.getPins(emptyLocations, url);
    expect(result).toEqual([]);
  });

  it('getMapZoom(): should return zoom number (considering small distance)', () => {
    calcDistance.mockReturnValue(1000);
    const expected = parseInt((1 / Math.pow(1000, 0.05)) * 10, 10); // eslint-disable-line
    const zoom = mapUtils.getMapZoom(pins);
    expect(zoom).toEqual(expected);
  });

  it('getMapZoom(): should return zoom number (considering huge distance)', () => {
    calcDistance.mockReturnValue(5000000);
    const expected = parseInt((1 / Math.pow(5000000, 0.05)) * 6, 10); // eslint-disable-line
    const zoom = mapUtils.getMapZoom(pins);
    expect(zoom).toEqual(expected);
  });

  it('getMapZoom(): should return zoom number (considering one location)', () => {
    const altPins = Object.assign({}, pins.web);
    const zoom = mapUtils.getMapZoom(altPins);
    expect(zoom).toEqual(6);
  });

  it('getMapCenter(): should return [lat, lng] as mean, when there are 2 positions', () => {
    const expected = [
      ((pins[0][1] + pins[1][1]) / 2).toFixed(5),
      ((pins[0][2] + pins[1][2]) / 2).toFixed(5),
    ];
    const center = mapUtils.getMapCenter(pins);
    expect(center).toEqual(expected);
  });

  it('getMapCenter(): should return [lat, lng] when there is one single position', () => {
    const expected = [pins[0][1].toFixed(5), pins[0][2].toFixed(5)];
    const center = mapUtils.getMapCenter([pins[0]]);
    expect(center).toEqual(expected);
  });

  it('getMapCenter(): should return [0, 0] when pins are empty', () => {
    const expected = ['0.00000', '0.00000'];
    const emptyPin = [];
    const center = mapUtils.getMapCenter(emptyPin);
    expect(center).toEqual(expected);
  });

  it('getMapCenter(): should [0, 0] when content is NaN', () => {
    const expected = ['0.00000', '0.00000'];
    const emptyPin = [];
    const center = mapUtils.getMapCenter([emptyPin]);
    expect(center).toEqual(expected);
  });

  it('removeMarkers(): should remove all markers and return array with empty contents', () => {
    const mocked = { setMap: jest.fn() };
    const markers = [mocked, mocked, mocked];
    const returned = mapUtils.removeMarkers(markers);
    expect(mocked.setMap).toHaveBeenCalledTimes(3);
    expect(returned).toEqual([null, null, null]);
  });

  it('getNewMarkers(): should return array with markers for each pinned position', () => {
    const map = 'map';
    markerFactory.mockImplementation(param => param);
    const markers = mapUtils.getNewMarkers(pins, map);
    expect(markers[0]).toEqual({ map: 'map', position: { lat: pins[0][1], lng: pins[0][2] } });
    expect(markers[1]).toEqual({ map: 'map', position: { lat: pins[1][1], lng: pins[1][2] } });
  });

  it('addMarkers(): should set each maker on map', () => {
    const map = 'map';
    const mocked = { setMap: jest.fn(param => param) };
    const markers = [mocked, mocked, mocked];
    mapUtils.addMarkers(markers, map);
    expect(mocked.setMap).toHaveBeenCalledTimes(3);
    expect(mocked.setMap.mock.calls).toEqual([[map], [map], [map]]);
  });
});

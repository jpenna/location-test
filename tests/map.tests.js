/* eslint import/no-extraneous-dependencies: "off" */
/*  eslint import/no-unresolved: "off" */

import React from 'react';
import { render, shallow, mount } from 'enzyme';
import * as mapUtils from 'src/utils/map_utils';

import Map from 'src/components/map';

jest.mock('src/utils/map_utils');


describe('<Map />', () => {
  let rendered;
  let context;
  let mapMock;
  let locations;
  let infoWindowMock;

  beforeAll(() => {
    locations = { web: { name: 'ops' }, user: {} };
    rendered = render(<Map locations={locations} url="" />);
    mapMock = jest.fn();
    infoWindowMock = jest.fn();

    mapUtils.getMapCenter = jest.fn(() => [0, 0]);
    mapUtils.getPins = jest.fn(() => 'pins');
    mapUtils.getMapZoom = jest.fn(() => 1);
    mapUtils.getNewMarkers = jest.fn(() => 'newMarkers');

    global.google = {
      maps: {
        Map: mapMock,
        LatLng: (lat, lng) => [lat, lng],
        InfoWindow: infoWindowMock,
      },
    };
  });

  beforeEach(() => {
    context = {
      props: { url: 'url', locations },
      map: { panTo: jest.fn(), setZoom: jest.fn() },
      markers: 'markers',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have #map <div> with class map-frame', () => {
    expect(rendered.find('#map').length).toEqual(1);
    expect(rendered.find('#map').hasClass('map-frame')).toBeTruthy();
  });

  it('should call getScript', () => {
    const spy = jest.spyOn(Map.prototype, 'getScript');
    shallow(<Map locations={locations} url="" />);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('getScript() should render a Script component with right props', () => {
    global.process.env.GMAPS_KEY = 'key';
    const Script = Map.prototype.getScript.bind({});
    const shallowScript = shallow(<Script />);
    expect(shallowScript.prop('url')).toEqual('https://maps.googleapis.com/maps/api/js?key=key&libraries=geometry');
    delete global.process.env.GMAPS_KEY;
  });

  it('getScript() Script should call renderMap() on startup', () => {
    const renderMap = jest.fn();
    const Script = Map.prototype.getScript.bind({ renderMap });
    const shallowScript = shallow(<Script />);
    expect(shallowScript.prop('onLoad')).toEqual(renderMap);
  });

  it('should call updateMap() on update', () => {
    const spy = jest.spyOn(Map.prototype, 'updateMap').mockImplementation(() => {});
    const remounted = mount(<Map locations={locations} url="" />);
    remounted.update();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('renderMap() should set this.map and this.infowindow', () => {
    Map.prototype.renderMap();
    expect(mapMock.mock.calls).toEqual([[
      null,
      {
        center: [-15, -50],
        zoom: 4,
        mapTypeControl: false,
        rotateControl: false,
        streetViewControl: false,
      },
    ]]);
    expect(infoWindowMock).toHaveBeenCalledTimes(1);
  });

  it('updateMap() should call removeMarkers() and leave method', () => {
    const missing = Object.assign(context, {
      props: {
        url: 'url',
        locations: { user: {}, web: {} },
      },
    });
    Map.prototype.updateMap.call(missing);
    expect(mapUtils.removeMarkers.mock.calls).toEqual([['markers']]);
    expect(mapUtils.getPins).toHaveBeenCalledTimes(0);
  });

  it('updateMap() should call getPins(), getMapCenter() and getMapZoom()', () => {
    Map.prototype.updateMap.call(context);
    expect(mapUtils.getPins).toHaveBeenCalledTimes(1);
    expect(mapUtils.getMapCenter.mock.calls).toEqual([['pins']]);
    expect(mapUtils.getMapZoom.mock.calls).toEqual([['pins']]);
  });

  it('updateMap() should set map position and zoom', () => {
    Map.prototype.updateMap.call(context);
    expect(context.map.panTo.mock.calls).toEqual([[[0, 0]]]);
    expect(context.map.setZoom.mock.calls).toEqual([[1]]);
  });

  it('updateMap() should call removeMarkers(), getNewMarkers(), addMarkers() and set markers', () => {
    Map.prototype.updateMap.call(context);
    expect(mapUtils.removeMarkers.mock.calls).toEqual([['markers']]);
    expect(mapUtils.getNewMarkers.mock.calls).toEqual([['pins', context.map]]);
    expect(mapUtils.addMarkers.mock.calls).toEqual([['newMarkers', context.map]]);
  });

  it('should have the correct PropTypes', () => {
    expect(Map.propTypes.locations).toBeTruthy();
    expect(Object.keys(Map.propTypes).length).toEqual(1);
  });
});

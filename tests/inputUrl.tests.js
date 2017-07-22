/* eslint import/no-extraneous-dependencies: "off" */
/*  eslint import/no-unresolved: "off" */

import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import InputUrl from 'src/components/inputUrl';

describe('<InputUrl />', () => {
  let shallowed;
  let handleSubmit;

  beforeAll(() => {
    handleSubmit = jest.fn();
    shallowed = shallow(<InputUrl onSubmit={handleSubmit} />);
  });

  afterEach(() => {
    shallowed.setState({ url: '' });
    jest.clearAllMocks();
  });

  it('should have form, input and a button', () => {
    expect(shallowed.find('form').length).toEqual(1);
    expect(shallowed.find('input').length).toEqual(1);
    expect(shallowed.find('button').length).toEqual(1);
  });

  it('should submit url', () => {
    const url = 'url.com';
    const input = shallowed.find('input');
    input.simulate('change', { target: { value: url } });
    shallowed.find('form').simulate('submit', { preventDefault: () => {} });
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('input should validate url', () => {
    const pattern = shallowed.find('input').prop('pattern');
    const regex = new RegExp(pattern);
    expect(regex.test('url')).toBeFalsy();
    expect(regex.test('http://url.com')).toBeFalsy();
    expect(regex.test('')).toBeFalsy();
  });

  it('should render correctly', () => {
    const rendered = renderer.create(<InputUrl onSubmit={handleSubmit} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});

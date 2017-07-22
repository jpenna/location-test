/* eslint import/no-extraneous-dependencies: "off" */
/*  eslint import/no-unresolved: "off" */

import React from 'react';
import renderer from 'react-test-renderer';
import { render } from 'enzyme';

import Title from 'src/components/title';

describe('<Title />', () => {
  it('should have H1 title', () => {
    const component = render(<Title />);
    expect(component.find('h1').length).toEqual(1);
  });

  it('should have H2 title', () => {
    const component = render(<Title />);
    expect(component.find('h2').length).toEqual(1);
  });

  it('should render correctly', () => {
    const rendered = renderer.create(<Title />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});

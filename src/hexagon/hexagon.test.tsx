import React from 'react';
import ReactDOM from 'react-dom';
import Hexagon from './hexagon';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Hexagon/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

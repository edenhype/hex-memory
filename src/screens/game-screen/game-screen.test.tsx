import React from 'react';
import ReactDOM from 'react-dom';
import GameScreen from './game-screen';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<GameScreen />, div);
  ReactDOM.unmountComponentAtNode(div);
});

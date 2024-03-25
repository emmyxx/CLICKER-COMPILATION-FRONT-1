import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import WebSocketComponent from './WebSocketComponent';
import WS from 'jest-websocket-mock';

describe('WebSocketComponent', () => {
  let server;

  beforeEach(async () => {
    server = new WS("ws://localhost:8080/game");
    render(<WebSocketComponent />);
    await server.connected;
  });

  afterEach(() => {
    WS.clean();
  });

  it('should display initial score correctly', () => {
    expect(screen.getByText(/Score: 0/)).toBeInTheDocument();
  });

  it('sends correct message to server on fruit click', async () => {
    act(() => {
      server.send('1,100,200,;2,150,250,💩;');
    });

   
    const fruit = await screen.findByText('🍒');
    fireEvent.click(fruit);

    
    await expect(server).toReceiveMessage('100,200');
  });

  it('updates score when receiving score update message from server', async () => {
    act(() => {
      server.send('Score: 1');
    });

    expect(await screen.findByText(/Score: 1/)).toBeInTheDocument();
  });

  it('rejouer button resets score and sends message to server', async () => {
    
    act(() => {
      server.send('Score: 5');
    });

    const button = screen.getByText(/Rejouer/);
    fireEvent.click(button);

   
    expect(await screen.findByText(/Score: 0/)).toBeInTheDocument();

   
    await expect(server).toReceiveMessage('Rejouer');
  });

});

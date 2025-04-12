import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Position, Signal, MarketData } from '../types/trading';
import { socketService } from '../services/socket.service';
import {
  fetchOpenPositions,
  fetchClosedPositions,
  fetchSignals,
  createPosition,
  updatePosition,
  closePosition,
  createSignal
} from '../slices/tradingSlice';
import { RootState } from '../store';

export const useTrading = () => {
  const dispatch = useDispatch();
  const { positions, signals, loading, error } = useSelector((state: RootState) => state.trading);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);
    }

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Socket event handlers
  useEffect(() => {
    const handlePositionUpdate = (position: Position) => {
      dispatch(updatePosition(position));
    };

    const handleSignalUpdate = (signal: Signal) => {
      dispatch(createSignal(signal));
    };

    const handleMarketUpdate = (data: MarketData) => {
      // Handle market data updates
      console.log('Market update:', data);
    };

    socketService.onPositionUpdate(handlePositionUpdate);
    socketService.onSignalUpdate(handleSignalUpdate);
    socketService.onMarketUpdate(handleMarketUpdate);

    return () => {
      socketService.offPositionUpdate(handlePositionUpdate);
      socketService.offSignalUpdate(handleSignalUpdate);
      socketService.offMarketUpdate(handleMarketUpdate);
    };
  }, [dispatch]);

  // Trading actions
  const openPosition = useCallback(async (positionData: Partial<Position>) => {
    return dispatch(createPosition(positionData));
  }, [dispatch]);

  const modifyPosition = useCallback(async (positionData: Partial<Position>) => {
    return dispatch(updatePosition(positionData));
  }, [dispatch]);

  const closePosition = useCallback(async (positionId: string) => {
    return dispatch(closePosition(positionId));
  }, [dispatch]);

  const addSignal = useCallback(async (signalData: Partial<Signal>) => {
    return dispatch(createSignal(signalData));
  }, [dispatch]);

  const loadPositions = useCallback(async () => {
    await Promise.all([
      dispatch(fetchOpenPositions()),
      dispatch(fetchClosedPositions())
    ]);
  }, [dispatch]);

  const loadSignals = useCallback(async () => {
    await dispatch(fetchSignals());
  }, [dispatch]);

  const subscribeToMarket = useCallback((symbol: string) => {
    socketService.subscribeToMarket(symbol);
  }, []);

  const unsubscribeFromMarket = useCallback((symbol: string) => {
    socketService.unsubscribeFromMarket(symbol);
  }, []);

  return {
    positions,
    signals,
    loading,
    error,
    openPosition,
    modifyPosition,
    closePosition,
    addSignal,
    loadPositions,
    loadSignals,
    subscribeToMarket,
    unsubscribeFromMarket
  };
}; 
import backtestReducer, {
  fetchBacktests,
  fetchBacktest,
  createBacktest,
  runBacktest,
  deleteBacktest,
  clearError,
  initialState
} from '../backtestSlice';
import { Backtest, BacktestRequest } from '../../types/backtest';

describe('backtestSlice', () => {
  describe('reducers', () => {
    it('should handle initial state', () => {
      expect(backtestReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle clearError', () => {
      const state = {
        ...initialState,
        error: 'Some error'
      };

      expect(backtestReducer(state, clearError())).toEqual({
        ...state,
        error: null
      });
    });
  });

  describe('extraReducers', () => {
    describe('fetchBacktests', () => {
      it('should handle pending state', () => {
        const action = { type: fetchBacktests.pending.type };
        const state = backtestReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          loading: true,
          error: null
        });
      });

      it('should handle fulfilled state', () => {
        const mockBacktests: Backtest[] = [
          {
            _id: '1',
            userId: 'user1',
            strategyId: 'strategy1',
            symbol: 'BTC/USDT',
            timeframe: '1h',
            startDate: new Date('2023-01-01'),
            endDate: new Date('2023-01-31'),
            initialBalance: 1000,
            finalBalance: 1200,
            totalTrades: 10,
            winningTrades: 6,
            losingTrades: 4,
            winRate: 0.6,
            profitFactor: 1.5,
            maxDrawdown: 0.1,
            sharpeRatio: 1.2,
            sortinoRatio: 1.3,
            trades: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];

        const action = {
          type: fetchBacktests.fulfilled.type,
          payload: mockBacktests
        };

        const state = backtestReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          backtests: mockBacktests,
          loading: false,
          error: null
        });
      });

      it('should handle rejected state', () => {
        const error = 'Failed to fetch backtests';
        const action = {
          type: fetchBacktests.rejected.type,
          error: { message: error }
        };

        const state = backtestReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          loading: false,
          error
        });
      });
    });

    describe('fetchBacktest', () => {
      it('should handle pending state', () => {
        const action = { type: fetchBacktest.pending.type };
        const state = backtestReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          loading: true,
          error: null
        });
      });

      it('should handle fulfilled state', () => {
        const mockBacktest: Backtest = {
          _id: '1',
          userId: 'user1',
          strategyId: 'strategy1',
          symbol: 'BTC/USDT',
          timeframe: '1h',
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-01-31'),
          initialBalance: 1000,
          finalBalance: 1200,
          totalTrades: 10,
          winningTrades: 6,
          losingTrades: 4,
          winRate: 0.6,
          profitFactor: 1.5,
          maxDrawdown: 0.1,
          sharpeRatio: 1.2,
          sortinoRatio: 1.3,
          trades: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const action = {
          type: fetchBacktest.fulfilled.type,
          payload: mockBacktest
        };

        const state = backtestReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          currentBacktest: mockBacktest,
          loading: false,
          error: null
        });
      });

      it('should handle rejected state', () => {
        const error = 'Failed to fetch backtest';
        const action = {
          type: fetchBacktest.rejected.type,
          error: { message: error }
        };

        const state = backtestReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          loading: false,
          error
        });
      });
    });

    describe('createBacktest', () => {
      it('should handle pending state', () => {
        const action = { type: createBacktest.pending.type };
        const state = backtestReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          loading: true,
          error: null
        });
      });

      it('should handle fulfilled state', () => {
        const mockBacktest: Backtest = {
          _id: '1',
          userId: 'user1',
          strategyId: 'strategy1',
          symbol: 'BTC/USDT',
          timeframe: '1h',
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-01-31'),
          initialBalance: 1000,
          finalBalance: 1200,
          totalTrades: 10,
          winningTrades: 6,
          losingTrades: 4,
          winRate: 0.6,
          profitFactor: 1.5,
          maxDrawdown: 0.1,
          sharpeRatio: 1.2,
          sortinoRatio: 1.3,
          trades: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const action = {
          type: createBacktest.fulfilled.type,
          payload: mockBacktest
        };

        const state = backtestReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          backtests: [mockBacktest],
          loading: false,
          error: null
        });
      });

      it('should handle rejected state', () => {
        const error = 'Failed to create backtest';
        const action = {
          type: createBacktest.rejected.type,
          error: { message: error }
        };

        const state = backtestReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          loading: false,
          error
        });
      });
    });

    describe('runBacktest', () => {
      it('should handle pending state', () => {
        const action = { type: runBacktest.pending.type };
        const state = backtestReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          loading: true,
          error: null
        });
      });

      it('should handle fulfilled state', () => {
        const mockBacktest: Backtest = {
          _id: '1',
          userId: 'user1',
          strategyId: 'strategy1',
          symbol: 'BTC/USDT',
          timeframe: '1h',
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-01-31'),
          initialBalance: 1000,
          finalBalance: 1200,
          totalTrades: 10,
          winningTrades: 6,
          losingTrades: 4,
          winRate: 0.6,
          profitFactor: 1.5,
          maxDrawdown: 0.1,
          sharpeRatio: 1.2,
          sortinoRatio: 1.3,
          trades: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const action = {
          type: runBacktest.fulfilled.type,
          payload: mockBacktest
        };

        const state = backtestReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          currentBacktest: mockBacktest,
          loading: false,
          error: null
        });
      });

      it('should handle rejected state', () => {
        const error = 'Failed to run backtest';
        const action = {
          type: runBacktest.rejected.type,
          error: { message: error }
        };

        const state = backtestReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          loading: false,
          error
        });
      });
    });

    describe('deleteBacktest', () => {
      it('should handle pending state', () => {
        const action = { type: deleteBacktest.pending.type };
        const state = backtestReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          loading: true,
          error: null
        });
      });

      it('should handle fulfilled state', () => {
        const existingBacktests: Backtest[] = [
          {
            _id: '1',
            userId: 'user1',
            strategyId: 'strategy1',
            symbol: 'BTC/USDT',
            timeframe: '1h',
            startDate: new Date('2023-01-01'),
            endDate: new Date('2023-01-31'),
            initialBalance: 1000,
            finalBalance: 1200,
            totalTrades: 10,
            winningTrades: 6,
            losingTrades: 4,
            winRate: 0.6,
            profitFactor: 1.5,
            maxDrawdown: 0.1,
            sharpeRatio: 1.2,
            sortinoRatio: 1.3,
            trades: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];

        const initialStateWithBacktests = {
          ...initialState,
          backtests: existingBacktests
        };

        const action = {
          type: deleteBacktest.fulfilled.type,
          payload: '1'
        };

        const state = backtestReducer(initialStateWithBacktests, action);

        expect(state).toEqual({
          ...initialState,
          backtests: [],
          loading: false,
          error: null
        });
      });

      it('should handle rejected state', () => {
        const error = 'Failed to delete backtest';
        const action = {
          type: deleteBacktest.rejected.type,
          error: { message: error }
        };

        const state = backtestReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          loading: false,
          error
        });
      });
    });
  });
}); 
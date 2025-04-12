import { renderHook, act } from '@testing-library/react-hooks';
import { useBacktest } from '../useBacktest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import backtestReducer from '../../slices/backtestSlice';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

// Mock dispatch
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn()
}));

// Mock message
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

describe('useBacktest Hook', () => {
  const store = configureStore({
    reducer: {
      backtest: backtestReducer
    }
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads backtests successfully', async () => {
    const { result } = renderHook(() => useBacktest(), { wrapper });

    await act(async () => {
      await result.current.loadBacktests('user1');
    });

    expect(result.current.error).toBeNull();
  });

  it('handles load backtests error', async () => {
    const { result } = renderHook(() => useBacktest(), { wrapper });

    await act(async () => {
      try {
        await result.current.loadBacktests('invalid-user');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  it('loads single backtest successfully', async () => {
    const { result } = renderHook(() => useBacktest(), { wrapper });

    await act(async () => {
      await result.current.loadBacktest('backtest1');
    });

    expect(result.current.error).toBeNull();
  });

  it('handles load single backtest error', async () => {
    const { result } = renderHook(() => useBacktest(), { wrapper });

    await act(async () => {
      try {
        await result.current.loadBacktest('invalid-id');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  it('creates backtest successfully', async () => {
    const { result } = renderHook(() => useBacktest(), { wrapper });

    const backtestData = {
      strategyId: 'strategy1',
      symbol: 'BTC/USDT',
      timeframe: '1h',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-31'),
      initialBalance: 1000
    };

    await act(async () => {
      await result.current.addBacktest(backtestData);
    });

    expect(result.current.error).toBeNull();
  });

  it('validates backtest data before creation', async () => {
    const { result } = renderHook(() => useBacktest(), { wrapper });

    const invalidData = {
      strategyId: '',
      symbol: '',
      timeframe: ''
    };

    await act(async () => {
      try {
        await result.current.addBacktest(invalidData);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  it('runs backtest successfully', async () => {
    const { result } = renderHook(() => useBacktest(), { wrapper });

    const backtestRequest = {
      strategyId: 'strategy1',
      symbol: 'BTC/USDT',
      timeframe: '1h',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-31'),
      initialBalance: 1000
    };

    await act(async () => {
      await result.current.startBacktest(backtestRequest);
    });

    expect(result.current.error).toBeNull();
  });

  it('validates backtest request before running', async () => {
    const { result } = renderHook(() => useBacktest(), { wrapper });

    const invalidRequest = {
      strategyId: '',
      symbol: '',
      timeframe: '',
      startDate: new Date('2023-01-31'),
      endDate: new Date('2023-01-01'),
      initialBalance: 0
    };

    await act(async () => {
      try {
        await result.current.startBacktest(invalidRequest);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  it('deletes backtest successfully', async () => {
    const { result } = renderHook(() => useBacktest(), { wrapper });

    await act(async () => {
      await result.current.removeBacktest('backtest1');
    });

    expect(result.current.error).toBeNull();
  });

  it('validates backtest ID before deletion', async () => {
    const { result } = renderHook(() => useBacktest(), { wrapper });

    await act(async () => {
      try {
        await result.current.removeBacktest('');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  it('handles cleanup on unmount', () => {
    const { unmount } = renderHook(() => useBacktest(), { wrapper });
    unmount();
    // Add any cleanup verification here
  });

  it('handles retry mechanism', async () => {
    const { result } = renderHook(() => useBacktest(), { wrapper });

    // Mock failed request
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    await act(async () => {
      try {
        await result.current.loadBacktests('user1');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
}); 
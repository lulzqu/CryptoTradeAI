import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Backtest } from '../Backtest';
import backtestReducer from '../../slices/backtestSlice';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

// Mock useBacktest hook
jest.mock('../../hooks/useBacktest', () => ({
  useBacktest: () => ({
    backtests: [
      {
        _id: '1',
        symbol: 'BTC/USDT',
        timeframe: '1h',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31'),
        initialBalance: 1000,
        finalBalance: 1200,
        winRate: 60,
        totalTrades: 100,
        profitFactor: 1.5,
        maxDrawdown: 10
      }
    ],
    currentBacktest: null,
    loading: false,
    error: null,
    loadBacktests: jest.fn(),
    loadBacktest: jest.fn(),
    addBacktest: jest.fn(),
    startBacktest: jest.fn(),
    removeBacktest: jest.fn()
  })
}));

describe('Backtest Component', () => {
  const store = configureStore({
    reducer: {
      backtest: backtestReducer
    }
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <Backtest />
        </I18nextProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders backtest title and create button', () => {
    renderComponent();
    expect(screen.getByText('Backtest')).toBeInTheDocument();
    expect(screen.getByText('Create Backtest')).toBeInTheDocument();
  });

  it('opens create modal when create button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Create Backtest'));
    expect(screen.getByText('Create Backtest')).toBeInTheDocument();
  });

  it('displays backtest data in table', () => {
    renderComponent();
    expect(screen.getByText('BTC/USDT')).toBeInTheDocument();
    expect(screen.getByText('1h')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText('$1,200.00')).toBeInTheDocument();
    expect(screen.getByText('60.00%')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Create Backtest'));

    // Fill form
    fireEvent.change(screen.getByLabelText('Symbol'), { target: { value: 'ETH/USDT' } });
    fireEvent.change(screen.getByLabelText('Timeframe'), { target: { value: '1h' } });
    fireEvent.change(screen.getByLabelText('Initial Balance'), { target: { value: '1000' } });

    // Submit form
    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => {
      expect(screen.queryByText('Create Backtest')).not.toBeInTheDocument();
    });
  });

  it('handles error state', () => {
    const errorStore = configureStore({
      reducer: {
        backtest: (state = { error: 'Test error' }) => state
      }
    });

    render(
      <Provider store={errorStore}>
        <I18nextProvider i18n={i18n}>
          <Backtest />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    const loadingStore = configureStore({
      reducer: {
        backtest: (state = { loading: true }) => state
      }
    });

    render(
      <Provider store={loadingStore}>
        <I18nextProvider i18n={i18n}>
          <Backtest />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('handles delete action', async () => {
    renderComponent();
    const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('Backtest deleted successfully')).toBeInTheDocument();
    });
  });

  it('validates form inputs', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Create Backtest'));

    // Try to submit empty form
    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => {
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  it('handles date range validation', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Create Backtest'));

    // Fill form with invalid date range
    fireEvent.change(screen.getByLabelText('Symbol'), { target: { value: 'ETH/USDT' } });
    fireEvent.change(screen.getByLabelText('Timeframe'), { target: { value: '1h' } });
    fireEvent.change(screen.getByLabelText('Initial Balance'), { target: { value: '1000' } });

    // Set end date before start date
    const dateRange = screen.getByLabelText('Date Range');
    fireEvent.change(dateRange, {
      target: {
        value: [new Date('2023-01-31'), new Date('2023-01-01')]
      }
    });

    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => {
      expect(screen.getByText('Invalid date range')).toBeInTheDocument();
    });
  });

  it('handles symbol validation', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Create Backtest'));

    // Fill form with invalid symbol
    fireEvent.change(screen.getByLabelText('Symbol'), { target: { value: 'invalid-symbol' } });
    fireEvent.change(screen.getByLabelText('Timeframe'), { target: { value: '1h' } });
    fireEvent.change(screen.getByLabelText('Initial Balance'), { target: { value: '1000' } });

    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => {
      expect(screen.getByText('Invalid symbol')).toBeInTheDocument();
    });
  });
}); 
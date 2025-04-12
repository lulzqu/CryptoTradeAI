import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  fetchBacktests,
  fetchBacktest,
  createBacktest,
  runBacktest,
  deleteBacktest,
  clearError
} from '../slices/backtestSlice';
import { Backtest, BacktestRequest } from '../types/backtest';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';

export const useBacktest = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const abortController = useRef<AbortController | null>(null);
  
  const { backtests, currentBacktest, loading, error } = useSelector(
    (state: RootState) => state.backtest
  );

  // Cleanup function
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
      dispatch(clearError());
    };
  }, [dispatch]);

  // Error handling wrapper
  const handleAsyncAction = async <T,>(
    action: () => Promise<T>,
    errorMessage: string
  ): Promise<T | undefined> => {
    try {
      return await action();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error(errorMessage);
      }
      console.error(errorMessage, error);
      return undefined;
    }
  };

  // Memoized actions with error handling
  const loadBacktests = useCallback(async (userId: string) => {
    // Cancel previous request if exists
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    return handleAsyncAction(
      async () => {
        const result = await dispatch(fetchBacktests(userId)).unwrap();
        return result;
      },
      t('backtest.loadError')
    );
  }, [dispatch, t]);

  const loadBacktest = useCallback(async (id: string) => {
    return handleAsyncAction(
      async () => {
        const result = await dispatch(fetchBacktest(id)).unwrap();
        return result;
      },
      t('backtest.loadDetailError')
    );
  }, [dispatch, t]);

  const addBacktest = useCallback(async (backtestData: Partial<Backtest>) => {
    // Validate input data
    if (!backtestData.strategyId || !backtestData.symbol || !backtestData.timeframe) {
      throw new Error(t('backtest.invalidData'));
    }

    return handleAsyncAction(
      async () => {
        const result = await dispatch(createBacktest(backtestData)).unwrap();
        message.success(t('backtest.createSuccess'));
        return result;
      },
      t('backtest.createError')
    );
  }, [dispatch, t]);

  const startBacktest = useCallback(async (backtestRequest: BacktestRequest) => {
    // Validate request data
    if (!backtestRequest.strategyId || !backtestRequest.symbol || !backtestRequest.timeframe) {
      throw new Error(t('backtest.invalidRequest'));
    }

    if (backtestRequest.startDate >= backtestRequest.endDate) {
      throw new Error(t('backtest.invalidDateRange'));
    }

    if (backtestRequest.initialBalance <= 0) {
      throw new Error(t('backtest.invalidBalance'));
    }

    return handleAsyncAction(
      async () => {
        const result = await dispatch(runBacktest(backtestRequest)).unwrap();
        message.success(t('backtest.runSuccess'));
        return result;
      },
      t('backtest.runError')
    );
  }, [dispatch, t]);

  const removeBacktest = useCallback(async (id: string) => {
    if (!id) {
      throw new Error(t('backtest.invalidId'));
    }

    return handleAsyncAction(
      async () => {
        await dispatch(deleteBacktest(id)).unwrap();
        message.success(t('backtest.deleteSuccess'));
      },
      t('backtest.deleteError')
    );
  }, [dispatch, t]);

  return {
    backtests,
    currentBacktest,
    loading,
    error,
    loadBacktests,
    loadBacktest,
    addBacktest,
    startBacktest,
    removeBacktest
  };
}; 
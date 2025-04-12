import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import NotificationService, { Notification, NotificationFilter, NotificationSettings } from '../../services/NotificationService';
import { RootState } from '../store';

interface NotificationState {
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  notificationsLoading: boolean;
  notificationsError: string | null;
  
  // Settings
  settings: NotificationSettings | null;
  settingsLoading: boolean;
  settingsError: string | null;
  
  // Current selections
  selectedNotification: Notification | null;
  
  // Filters
  filters: NotificationFilter;
}

const initialState: NotificationState = {
  // Notifications
  notifications: [],
  unreadCount: 0,
  notificationsLoading: false,
  notificationsError: null,
  
  // Settings
  settings: null,
  settingsLoading: false,
  settingsError: null,
  
  // Current selections
  selectedNotification: null,
  
  // Filters
  filters: {},
};

// Notification Thunks
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (filters: NotificationFilter = {}, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return NotificationService.getMockNotifications();
      }
      
      const notifications = await NotificationService.getNotifications(filters);
      return notifications;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchNotificationById = createAsyncThunk(
  'notification/fetchNotificationById',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const notification = await NotificationService.getNotification(notificationId);
      return notification;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch notification');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const notification = await NotificationService.markAsRead(notificationId);
      return notification;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const result = await NotificationService.markAllAsRead();
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark all notifications as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const result = await NotificationService.deleteNotification(notificationId);
      if (result.success) {
        return notificationId;
      }
      return rejectWithValue('Failed to delete notification');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete notification');
    }
  }
);

export const clearAllNotifications = createAsyncThunk(
  'notification/clearAllNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const result = await NotificationService.clearAllNotifications();
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clear all notifications');
    }
  }
);

// Notification Settings Thunks
export const fetchNotificationSettings = createAsyncThunk(
  'notification/fetchNotificationSettings',
  async (_, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return NotificationService.getMockNotificationSettings();
      }
      
      const settings = await NotificationService.getNotificationSettings();
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch notification settings');
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'notification/updateNotificationSettings',
  async (settings: Partial<NotificationSettings>, { rejectWithValue }) => {
    try {
      const updatedSettings = await NotificationService.updateNotificationSettings(settings);
      return updatedSettings;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update notification settings');
    }
  }
);

// Subscribe to real-time notifications
let notificationSubscription: (() => void) | null = null;

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setSelectedNotification: (state, action: PayloadAction<Notification | null>) => {
      state.selectedNotification = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<NotificationFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {};
    },
    addRealTimeNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications = [action.payload, ...state.notifications];
      
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    startNotificationSubscription: () => {
      // This is handled in the middleware
    },
    stopNotificationSubscription: () => {
      // This is handled in the middleware
    },
  },
  extraReducers: (builder) => {
    // Notifications reducers
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.notificationsLoading = true;
        state.notificationsError = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notificationsLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(notification => !notification.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.notificationsLoading = false;
        state.notificationsError = action.payload as string;
      })
      .addCase(fetchNotificationById.pending, (state) => {
        state.notificationsLoading = true;
        state.notificationsError = null;
      })
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.notificationsLoading = false;
        state.selectedNotification = action.payload;
        
        // Update the notification in the list if it exists
        const index = state.notifications.findIndex(notification => notification.id === action.payload.id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.notificationsLoading = false;
        state.notificationsError = action.payload as string;
      })
      .addCase(markAsRead.pending, (state) => {
        state.notificationsLoading = true;
        state.notificationsError = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.notificationsLoading = false;
        
        // Update the notification in the list
        state.notifications = state.notifications.map(notification => 
          notification.id === action.payload.id ? action.payload : notification
        );
        
        if (state.selectedNotification?.id === action.payload.id) {
          state.selectedNotification = action.payload;
        }
        
        // Recalculate unread count
        state.unreadCount = state.notifications.filter(notification => !notification.read).length;
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.notificationsLoading = false;
        state.notificationsError = action.payload as string;
      })
      .addCase(markAllAsRead.pending, (state) => {
        state.notificationsLoading = true;
        state.notificationsError = null;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notificationsLoading = false;
        
        // Mark all notifications as read
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          read: true,
        }));
        
        if (state.selectedNotification) {
          state.selectedNotification = {
            ...state.selectedNotification,
            read: true,
          };
        }
        
        state.unreadCount = 0;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.notificationsLoading = false;
        state.notificationsError = action.payload as string;
      })
      .addCase(deleteNotification.pending, (state) => {
        state.notificationsLoading = true;
        state.notificationsError = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notificationsLoading = false;
        
        // Remove the deleted notification
        const deletedNotification = state.notifications.find(notification => notification.id === action.payload);
        state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
        
        if (state.selectedNotification?.id === action.payload) {
          state.selectedNotification = null;
        }
        
        // Update unread count if needed
        if (deletedNotification && !deletedNotification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.notificationsLoading = false;
        state.notificationsError = action.payload as string;
      })
      .addCase(clearAllNotifications.pending, (state) => {
        state.notificationsLoading = true;
        state.notificationsError = null;
      })
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.notificationsLoading = false;
        state.notifications = [];
        state.selectedNotification = null;
        state.unreadCount = 0;
      })
      .addCase(clearAllNotifications.rejected, (state, action) => {
        state.notificationsLoading = false;
        state.notificationsError = action.payload as string;
      });
    
    // Notification Settings reducers
    builder
      .addCase(fetchNotificationSettings.pending, (state) => {
        state.settingsLoading = true;
        state.settingsError = null;
      })
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.settings = action.payload;
      })
      .addCase(fetchNotificationSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.settingsError = action.payload as string;
      })
      .addCase(updateNotificationSettings.pending, (state) => {
        state.settingsLoading = true;
        state.settingsError = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.settings = action.payload;
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.settingsError = action.payload as string;
      });
  },
});

// Middleware for real-time notification subscription
export const notificationMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action.type === 'notification/startNotificationSubscription' && !notificationSubscription) {
    notificationSubscription = NotificationService.subscribeToNotifications((notification) => {
      store.dispatch(notificationSlice.actions.addRealTimeNotification(notification));
    });
  } else if (action.type === 'notification/stopNotificationSubscription' && notificationSubscription) {
    notificationSubscription();
    notificationSubscription = null;
  }
  
  return next(action);
};

export const {
  setSelectedNotification,
  updateFilters,
  resetFilters,
  addRealTimeNotification,
  startNotificationSubscription,
  stopNotificationSubscription,
} = notificationSlice.actions;

// Selectors
export const selectNotifications = (state: RootState) => state.notification.notifications;
export const selectUnreadCount = (state: RootState) => state.notification.unreadCount;
export const selectNotificationsLoading = (state: RootState) => state.notification.notificationsLoading;
export const selectNotificationsError = (state: RootState) => state.notification.notificationsError;

export const selectNotificationSettings = (state: RootState) => state.notification.settings;
export const selectSettingsLoading = (state: RootState) => state.notification.settingsLoading;
export const selectSettingsError = (state: RootState) => state.notification.settingsError;

export const selectSelectedNotification = (state: RootState) => state.notification.selectedNotification;

export const selectFilters = (state: RootState) => state.notification.filters;

export default notificationSlice.reducer; 
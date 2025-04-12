import { Signal } from '../models/Signal';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { EmailService } from './email.service';

// Enum cho loại chia sẻ
enum ShareType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FOLLOWERS = 'followers'
}

// Interface cho chi tiết chia sẻ
interface SignalShareDetails {
  signalId: string;
  sharedBy: string;
  sharedWith: string[];
  type: ShareType;
  message?: string;
}

export class SocialSignalService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  // Chia sẻ tín hiệu với người dùng khác
  async shareSignal(
    signalId: string, 
    sharedById: string, 
    shareDetails: {
      type: ShareType;
      sharedWith?: string[];
      message?: string;
    }
  ): Promise<boolean> {
    try {
      // Kiểm tra tín hiệu
      const signal = await Signal.findById(signalId);
      if (!signal) {
        logger.error(`Không tìm thấy tín hiệu: ${signalId}`);
        return false;
      }

      // Kiểm tra người dùng chia sẻ
      const sharedByUser = await User.findById(sharedById);
      if (!sharedByUser) {
        logger.error(`Người dùng không tồn tại: ${sharedById}`);
        return false;
      }

      // Xác định người được chia sẻ
      let sharedWithUsers: string[] = [];

      switch (shareDetails.type) {
        case ShareType.PUBLIC:
          // Chia sẻ công khai với tất cả người dùng
          const allUsers = await User.find({});
          sharedWithUsers = allUsers.map(user => user._id.toString());
          break;

        case ShareType.FOLLOWERS:
          // Chia sẻ với những người theo dõi
          sharedWithUsers = sharedByUser.followers.map(
            follower => follower.toString()
          );
          break;

        case ShareType.PRIVATE:
          // Chia sẻ với những người được chỉ định
          if (!shareDetails.sharedWith || shareDetails.sharedWith.length === 0) {
            logger.error('Không có người dùng được chỉ định để chia sẻ');
            return false;
          }
          sharedWithUsers = shareDetails.sharedWith;
          break;
      }

      // Loại bỏ người chia sẻ khỏi danh sách
      sharedWithUsers = sharedWithUsers.filter(
        userId => userId !== sharedById
      );

      // Lưu chi tiết chia sẻ
      const shareRecord: SignalShareDetails = {
        signalId,
        sharedBy: sharedById,
        sharedWith: sharedWithUsers,
        type: shareDetails.type,
        message: shareDetails.message
      };

      // Cập nhật tín hiệu với thông tin chia sẻ
      signal.shares.push(shareRecord);
      await signal.save();

      // Gửi thông báo cho những người được chia sẻ
      await this.sendShareNotifications(shareRecord);

      logger.info(`Chia sẻ tín hiệu thành công: ${signalId}`);
      return true;
    } catch (error) {
      logger.error(`Lỗi chia sẻ tín hiệu: ${error}`);
      return false;
    }
  }

  // Gửi thông báo cho những người được chia sẻ
  private async sendShareNotifications(
    shareDetails: SignalShareDetails
  ): Promise<void> {
    try {
      // Lấy thông tin người chia sẻ
      const sharedByUser = await User.findById(shareDetails.sharedBy);
      const signal = await Signal.findById(shareDetails.signalId);

      if (!sharedByUser || !signal) {
        logger.error('Không tìm thấy người dùng hoặc tín hiệu');
        return;
      }

      // Gửi thông báo cho từng người được chia sẻ
      for (const userId of shareDetails.sharedWith) {
        const user = await User.findById(userId);
        
        if (!user) continue;

        // Tạo thông báo
        const notification = {
          type: 'SIGNAL_SHARED',
          title: 'Tín Hiệu Giao Dịch Mới',
          content: `${sharedByUser.name} đã chia sẻ một tín hiệu giao dịch: ${signal.symbol}`,
          data: {
            signalId: signal._id,
            sharedBy: sharedByUser._id,
            shareType: shareDetails.type
          },
          read: false
        };

        // Thêm thông báo vào người dùng
        user.notifications.push(notification);
        await user.save();

        // Gửi email thông báo
        await this.emailService.sendSignalNotificationEmail(
          user.email, 
          {
            symbol: signal.symbol,
            type: signal.type,
            price: signal.entryPrice
          }
        );
      }

      logger.info(`Đã gửi thông báo chia sẻ tín hiệu`);
    } catch (error) {
      logger.error(`Lỗi gửi thông báo chia sẻ: ${error}`);
    }
  }

  // Theo dõi người dùng
  async followUser(
    followerId: string, 
    followedId: string
  ): Promise<boolean> {
    try {
      const follower = await User.findById(followerId);
      const followed = await User.findById(followedId);

      if (!follower || !followed) {
        logger.error('Người dùng không tồn tại');
        return false;
      }

      // Kiểm tra xem đã theo dõi chưa
      if (follower.following.includes(followedId)) {
        logger.info('Người dùng đã được theo dõi');
        return false;
      }

      // Thêm vào danh sách theo dõi
      follower.following.push(followedId);
      followed.followers.push(followerId);

      await follower.save();
      await followed.save();

      logger.info(`${follower.name} đã theo dõi ${followed.name}`);
      return true;
    } catch (error) {
      logger.error(`Lỗi theo dõi người dùng: ${error}`);
      return false;
    }
  }

  // Bỏ theo dõi người dùng
  async unfollowUser(
    followerId: string, 
    followedId: string
  ): Promise<boolean> {
    try {
      const follower = await User.findById(followerId);
      const followed = await User.findById(followedId);

      if (!follower || !followed) {
        logger.error('Người dùng không tồn tại');
        return false;
      }

      // Loại bỏ khỏi danh sách theo dõi
      follower.following = follower.following.filter(
        id => id.toString() !== followedId
      );
      followed.followers = followed.followers.filter(
        id => id.toString() !== followerId
      );

      await follower.save();
      await followed.save();

      logger.info(`${follower.name} đã bỏ theo dõi ${followed.name}`);
      return true;
    } catch (error) {
      logger.error(`Lỗi bỏ theo dõi người dùng: ${error}`);
      return false;
    }
  }

  // Lấy tín hiệu được chia sẻ
  async getSharedSignals(
    userId: string, 
    options?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<Signal[]> {
    try {
      const { limit = 10, offset = 0 } = options || {};

      // Tìm tín hiệu được chia sẻ với người dùng
      const sharedSignals = await Signal.find({
        'shares.sharedWith': userId
      })
      .populate('user')
      .populate('strategy')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

      return sharedSignals;
    } catch (error) {
      logger.error(`Lỗi lấy tín hiệu được chia sẻ: ${error}`);
      return [];
    }
  }
} 
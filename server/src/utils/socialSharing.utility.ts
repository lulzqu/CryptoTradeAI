import { User } from '../models/User';
import { Signal } from '../models/Signal';
import { logger } from '../utils/logger';

export enum ShareType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FOLLOWERS = 'followers'
}

export interface ShareOptions {
  message?: string;
  tags?: string[];
}

export class SocialSharingUtility {
  // Chia sẻ tín hiệu giao dịch
  static async shareSignal(
    signalId: string, 
    userId: string, 
    shareWith: string[], 
    type: ShareType = ShareType.FOLLOWERS,
    options: ShareOptions = {}
  ): Promise<boolean> {
    try {
      // Kiểm tra tín hiệu
      const signal = await Signal.findById(signalId);
      if (!signal) {
        logger.error(`Không tìm thấy tín hiệu: ${signalId}`);
        return false;
      }

      // Kiểm tra người dùng
      const sharedBy = await User.findById(userId);
      if (!sharedBy) {
        logger.error(`Không tìm thấy người dùng: ${userId}`);
        return false;
      }

      // Xác định người nhận
      let recipients: string[] = [];
      switch (type) {
        case ShareType.PUBLIC:
          // Lấy tất cả người dùng
          const allUsers = await User.find({});
          recipients = allUsers.map(u => u._id.toString());
          break;

        case ShareType.PRIVATE:
          // Chỉ những người được chỉ định
          recipients = shareWith;
          break;

        case ShareType.FOLLOWERS:
          // Chỉ những người theo dõi
          recipients = sharedBy.followers.map(f => f.toString());
          break;
      }

      // Lọc và loại bỏ trùng lặp
      recipients = [...new Set(recipients)].filter(
        id => id !== userId
      );

      // Tạo thông báo chia sẻ
      const shareNotification = {
        type: 'SIGNAL_SHARED',
        title: `${sharedBy.name} đã chia sẻ một tín hiệu`,
        content: options.message || `Tín hiệu ${signal.symbol}`,
        data: {
          signalId: signal._id,
          sharedBy: userId,
          shareType: type,
          tags: options.tags
        }
      };

      // Cập nhật thông báo cho từng người nhận
      await Promise.all(
        recipients.map(async (recipientId) => {
          await User.findByIdAndUpdate(
            recipientId, 
            { $push: { notifications: shareNotification } }
          );
        })
      );

      // Lưu lịch sử chia sẻ
      signal.shares.push({
        user: userId,
        type,
        recipients,
        message: options.message,
        tags: options.tags
      });
      await signal.save();

      logger.info(`Chia sẻ tín hiệu thành công: ${signalId}`);
      return true;
    } catch (error) {
      logger.error(`Lỗi chia sẻ tín hiệu: ${error}`);
      return false;
    }
  }

  // Theo dõi người dùng
  static async followUser(
    followerId: string, 
    followedId: string
  ): Promise<boolean> {
    try {
      // Kiểm tra người theo dõi
      const follower = await User.findById(followerId);
      if (!follower) {
        logger.error(`Không tìm thấy người theo dõi: ${followerId}`);
        return false;
      }

      // Kiểm tra người được theo dõi
      const followed = await User.findById(followedId);
      if (!followed) {
        logger.error(`Không tìm thấy người được theo dõi: ${followedId}`);
        return false;
      }

      // Kiểm tra đã theo dõi chưa
      if (follower.following.includes(followedId)) {
        logger.warn(`Người dùng đã theo dõi: ${followedId}`);
        return false;
      }

      // Cập nhật danh sách theo dõi
      follower.following.push(followedId);
      followed.followers.push(followerId);

      await Promise.all([
        follower.save(),
        followed.save()
      ]);

      // Tạo thông báo
      await User.findByIdAndUpdate(
        followedId, 
        { 
          $push: { 
            notifications: {
              type: 'USER_FOLLOWED',
              title: 'Người dùng mới theo dõi',
              content: `${follower.name} đã theo dõi bạn`,
              data: { followerId }
            } 
          } 
        }
      );

      logger.info(`Theo dõi người dùng thành công: ${followedId}`);
      return true;
    } catch (error) {
      logger.error(`Lỗi theo dõi người dùng: ${error}`);
      return false;
    }
  }

  // Bỏ theo dõi người dùng
  static async unfollowUser(
    followerId: string, 
    followedId: string
  ): Promise<boolean> {
    try {
      // Kiểm tra người theo dõi
      const follower = await User.findById(followerId);
      if (!follower) {
        logger.error(`Không tìm thấy người theo dõi: ${followerId}`);
        return false;
      }

      // Kiểm tra người được theo dõi
      const followed = await User.findById(followedId);
      if (!followed) {
        logger.error(`Không tìm thấy người được theo dõi: ${followedId}`);
        return false;
      }

      // Cập nhật danh sách theo dõi
      follower.following = follower.following.filter(
        id => id.toString() !== followedId
      );
      followed.followers = followed.followers.filter(
        id => id.toString() !== followerId
      );

      await Promise.all([
        follower.save(),
        followed.save()
      ]);

      logger.info(`Bỏ theo dõi người dùng thành công: ${followedId}`);
      return true;
    } catch (error) {
      logger.error(`Lỗi bỏ theo dõi người dùng: ${error}`);
      return false;
    }
  }
} 
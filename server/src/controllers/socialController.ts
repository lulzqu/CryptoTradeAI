import { Request, Response } from 'express';
import { StrategyShare, IStrategyShare } from '../models/Social';
import { TradingStrategy } from '../models/TradingStrategy';
import { User } from '../models/User';

export const shareStrategy = async (req: Request, res: Response) => {
  try {
    const { strategyId, isPublic } = req.body;
    const userId = req.user._id;

    const strategy = await TradingStrategy.findById(strategyId);
    if (!strategy) {
      return res.status(404).json({ message: 'Chiến lược không tồn tại' });
    }

    if (strategy.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền chia sẻ chiến lược này' });
    }

    const existingShare = await StrategyShare.findOne({ strategy: strategyId });
    if (existingShare) {
      existingShare.isPublic = isPublic;
      await existingShare.save();
      return res.json(existingShare);
    }

    const strategyShare = new StrategyShare({
      strategy: strategyId,
      user: userId,
      isPublic
    });

    await strategyShare.save();
    res.json(strategyShare);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getPublicStrategies = async (req: Request, res: Response) => {
  try {
    const strategies = await StrategyShare.find({ isPublic: true })
      .populate('user', 'username')
      .populate('strategy')
      .sort({ createdAt: -1 });

    res.json(strategies);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { strategyShareId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const strategyShare = await StrategyShare.findById(strategyShareId);
    if (!strategyShare) {
      return res.status(404).json({ message: 'Chiến lược không tồn tại' });
    }

    strategyShare.comments.push({
      user: userId,
      content
    });

    await strategyShare.save();
    res.json(strategyShare);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const addRating = async (req: Request, res: Response) => {
  try {
    const { strategyShareId } = req.params;
    const { score, comment } = req.body;
    const userId = req.user._id;

    const strategyShare = await StrategyShare.findById(strategyShareId);
    if (!strategyShare) {
      return res.status(404).json({ message: 'Chiến lược không tồn tại' });
    }

    const existingRating = strategyShare.ratings.find(r => r.user.toString() === userId.toString());
    if (existingRating) {
      existingRating.score = score;
      existingRating.comment = comment;
    } else {
      strategyShare.ratings.push({
        user: userId,
        score,
        comment
      });
    }

    await strategyShare.save();
    res.json(strategyShare);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const followStrategy = async (req: Request, res: Response) => {
  try {
    const { strategyShareId } = req.params;
    const userId = req.user._id;

    const strategyShare = await StrategyShare.findById(strategyShareId);
    if (!strategyShare) {
      return res.status(404).json({ message: 'Chiến lược không tồn tại' });
    }

    const isFollowing = strategyShare.followers.includes(userId);
    if (isFollowing) {
      strategyShare.followers = strategyShare.followers.filter(id => id.toString() !== userId.toString());
    } else {
      strategyShare.followers.push(userId);
    }

    await strategyShare.save();
    res.json(strategyShare);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updatePerformance = async (req: Request, res: Response) => {
  try {
    const { strategyShareId } = req.params;
    const { performance } = req.body;
    const userId = req.user._id;

    const strategyShare = await StrategyShare.findById(strategyShareId);
    if (!strategyShare) {
      return res.status(404).json({ message: 'Chiến lược không tồn tại' });
    }

    if (strategyShare.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền cập nhật hiệu suất' });
    }

    strategyShare.performance = performance;
    await strategyShare.save();
    res.json(strategyShare);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
}; 
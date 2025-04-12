import { Request, Response } from 'express';
import * as profileService from '../services/profileService';
import { handleError } from '../utils/errorHandler';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await profileService.getProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    handleError(error, res);
  }
};

export const createProfile = async (req: Request, res: Response) => {
  try {
    const profile = await profileService.createProfile({
      userId: req.user.id,
      ...req.body
    });
    res.status(201).json(profile);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const profile = await profileService.updateProfile(req.user.id, req.body);
    res.json(profile);
  } catch (error) {
    handleError(error, res);
  }
};

export const updatePreferences = async (req: Request, res: Response) => {
  try {
    const profile = await profileService.updatePreferences(req.user.id, req.body);
    res.json(profile);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateSocialLinks = async (req: Request, res: Response) => {
  try {
    const profile = await profileService.updateSocialLinks(req.user.id, req.body);
    res.json(profile);
  } catch (error) {
    handleError(error, res);
  }
}; 
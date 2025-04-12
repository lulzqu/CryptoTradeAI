import Profile, { IProfile } from '../models/profile';
import { NotFoundError } from '../utils/errors';

export const getProfile = async (userId: string): Promise<IProfile> => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new NotFoundError('Profile not found');
  }
  return profile;
};

export const createProfile = async (profileData: Partial<IProfile>): Promise<IProfile> => {
  const profile = new Profile(profileData);
  return await profile.save();
};

export const updateProfile = async (userId: string, profileData: Partial<IProfile>): Promise<IProfile> => {
  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $set: profileData },
    { new: true, runValidators: true }
  );
  if (!profile) {
    throw new NotFoundError('Profile not found');
  }
  return profile;
};

export const updatePreferences = async (userId: string, preferences: Partial<IProfile['preferences']>): Promise<IProfile> => {
  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $set: { preferences } },
    { new: true, runValidators: true }
  );
  if (!profile) {
    throw new NotFoundError('Profile not found');
  }
  return profile;
};

export const updateSocialLinks = async (userId: string, socialLinks: Partial<IProfile['socialLinks']>): Promise<IProfile> => {
  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $set: { socialLinks } },
    { new: true, runValidators: true }
  );
  if (!profile) {
    throw new NotFoundError('Profile not found');
  }
  return profile;
}; 
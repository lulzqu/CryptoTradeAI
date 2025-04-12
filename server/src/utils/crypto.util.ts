/**
 * Tiện ích mã hóa
 * Cung cấp các hàm mã hóa an toàn cho ứng dụng
 */

import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';

// Khóa bí mật cho mã hóa AES (giả định)
const CRYPTO_SECRET_KEY = process.env.CRYPTO_SECRET_KEY || 'default_crypto_secret_key_32bytes_len';
// Sử dụng jwt secret từ config
const JWT_SECRET_KEY = config.app.jwtSecret;

/**
 * Tạo chuỗi hash bcrypt từ mật khẩu
 * @param password Mật khẩu cần hash
 * @param saltRounds Số vòng muối (mặc định: 10)
 * @returns Promise với chuỗi hash
 */
export const hashPassword = async (password: string, saltRounds: number = 10): Promise<string> => {
  if (!password) {
    throw new Error('Mật khẩu không được để trống');
  }
  return bcrypt.hash(password, saltRounds);
};

/**
 * Kiểm tra mật khẩu với hash bcrypt
 * @param password Mật khẩu cần kiểm tra
 * @param hash Chuỗi hash để so sánh
 * @returns Promise với kết quả so sánh (boolean)
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  if (!password || !hash) {
    return false;
  }
  return bcrypt.compare(password, hash);
};

/**
 * Tạo JWT token
 * @param payload Dữ liệu cần mã hóa trong token
 * @param expiresIn Thời gian hết hạn (mặc định: '1d')
 * @returns JWT token
 */
export const generateToken = (
  payload: Record<string, any>,
  expiresIn: string = '1d'
): string => {
  if (!payload) {
    throw new Error('Payload không được để trống');
  }
  
  const options: jwt.SignOptions = { expiresIn };
  // Chuyển đổi thành Buffer để tránh lỗi kiểu dữ liệu
  return jwt.sign(payload, Buffer.from(JWT_SECRET_KEY), options);
};

/**
 * Xác minh và giải mã JWT token
 * @param token JWT token cần xác minh
 * @returns Payload đã giải mã hoặc null nếu token không hợp lệ
 */
export const verifyToken = (token: string): any | null => {
  if (!token) {
    return null;
  }
  
  try {
    // Chuyển đổi thành Buffer để tránh lỗi kiểu dữ liệu
    return jwt.verify(token, Buffer.from(JWT_SECRET_KEY));
  } catch (error) {
    return null;
  }
};

/**
 * Tạo chuỗi ngẫu nhiên với độ dài chỉ định
 * @param length Độ dài chuỗi (mặc định: 32)
 * @returns Chuỗi ngẫu nhiên
 */
export const generateRandomString = (length: number = 32): string => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

/**
 * Tạo UUID v4
 * @returns Chuỗi UUID v4
 */
export const generateUUID = (): string => {
  return crypto.randomUUID();
};

/**
 * Mã hóa một chuỗi với thuật toán AES-256-GCM
 * @param text Chuỗi cần mã hóa
 * @param secretKey Khóa bí mật (mặc định: từ biến môi trường)
 * @returns Đối tượng chứa chuỗi đã mã hóa, iv và authTag
 */
export const encryptAES = (
  text: string,
  secretKey: string = CRYPTO_SECRET_KEY
): { encrypted: string; iv: string; authTag: string } => {
  if (!text) {
    throw new Error('Chuỗi cần mã hóa không được để trống');
  }
  
  // Tạo vector khởi tạo ngẫu nhiên
  const iv = crypto.randomBytes(16);
  
  // Tạo cipher với AES-256-GCM
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(secretKey.padEnd(32, '0').slice(0, 32)),
    iv
  );
  
  // Mã hóa dữ liệu
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Lấy tag xác thực
  const authTag = cipher.getAuthTag().toString('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag
  };
};

/**
 * Giải mã một chuỗi đã mã hóa với thuật toán AES-256-GCM
 * @param encrypted Chuỗi đã mã hóa
 * @param iv Vector khởi tạo dưới dạng hex
 * @param authTag Tag xác thực dưới dạng hex
 * @param secretKey Khóa bí mật (mặc định: từ biến môi trường)
 * @returns Chuỗi đã giải mã
 */
export const decryptAES = (
  encrypted: string,
  iv: string,
  authTag: string,
  secretKey: string = CRYPTO_SECRET_KEY
): string => {
  if (!encrypted || !iv || !authTag) {
    throw new Error('Thiếu thông tin cần thiết để giải mã');
  }
  
  try {
    // Tạo decipher với AES-256-GCM
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      Buffer.from(secretKey.padEnd(32, '0').slice(0, 32)),
      Buffer.from(iv, 'hex')
    );
    
    // Đặt tag xác thực
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    // Giải mã dữ liệu
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error('Giải mã thất bại: Dữ liệu không hợp lệ hoặc đã bị giả mạo');
  }
};

/**
 * Tạo hash SHA-256 cho chuỗi đầu vào
 * @param data Chuỗi cần hash
 * @returns Chuỗi hash SHA-256
 */
export const sha256Hash = (data: string): string => {
  if (!data) {
    throw new Error('Dữ liệu hash không được để trống');
  }
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Tạo mã HMAC (Hash-based Message Authentication Code)
 * @param data Dữ liệu cần xác thực
 * @param secret Khóa bí mật
 * @param algorithm Thuật toán hash (mặc định: sha256)
 * @returns Chuỗi HMAC
 */
export const generateHmac = (
  data: string,
  secret: string,
  algorithm: string = 'sha256'
): string => {
  if (!data || !secret) {
    throw new Error('Dữ liệu và khóa bí mật không được để trống');
  }
  return crypto.createHmac(algorithm, secret).update(data).digest('hex');
};

/**
 * Mã hóa dữ liệu với RSA public key
 * @param data Dữ liệu cần mã hóa
 * @param publicKey Public key dạng PEM
 * @returns Chuỗi đã mã hóa dưới dạng hex
 */
export const encryptRSA = (data: string, publicKey: string): string => {
  if (!data || !publicKey) {
    throw new Error('Dữ liệu và public key không được để trống');
  }
  
  const encryptedBuffer = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    Buffer.from(data, 'utf8')
  );
  
  return encryptedBuffer.toString('hex');
};

/**
 * Giải mã dữ liệu với RSA private key
 * @param encryptedData Dữ liệu đã mã hóa dưới dạng hex
 * @param privateKey Private key dạng PEM
 * @returns Chuỗi đã giải mã
 */
export const decryptRSA = (encryptedData: string, privateKey: string): string => {
  if (!encryptedData || !privateKey) {
    throw new Error('Dữ liệu và private key không được để trống');
  }
  
  try {
    const decryptedBuffer = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
      },
      Buffer.from(encryptedData, 'hex')
    );
    
    return decryptedBuffer.toString('utf8');
  } catch (error) {
    throw new Error('Giải mã RSA thất bại: Dữ liệu không hợp lệ hoặc private key không khớp');
  }
};

/**
 * Tạo cặp khóa RSA
 * @param modulusLength Độ dài modulus (mặc định: 2048 bits)
 * @returns Đối tượng chứa public key và private key
 */
export const generateRSAKeyPair = (modulusLength: number = 2048): { publicKey: string; privateKey: string } => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
  
  return { publicKey, privateKey };
};

/**
 * Tạo chữ ký số cho dữ liệu với RSA private key
 * @param data Dữ liệu cần ký
 * @param privateKey Private key dạng PEM
 * @returns Chữ ký số dưới dạng hex
 */
export const signData = (data: string, privateKey: string): string => {
  if (!data || !privateKey) {
    throw new Error('Dữ liệu và private key không được để trống');
  }
  
  const signer = crypto.createSign('SHA256');
  signer.update(data);
  return signer.sign(privateKey, 'hex');
};

/**
 * Xác minh chữ ký số với RSA public key
 * @param data Dữ liệu gốc
 * @param signature Chữ ký số dưới dạng hex
 * @param publicKey Public key dạng PEM
 * @returns Kết quả xác minh (boolean)
 */
export const verifySignature = (data: string, signature: string, publicKey: string): boolean => {
  if (!data || !signature || !publicKey) {
    return false;
  }
  
  try {
    const verifier = crypto.createVerify('SHA256');
    verifier.update(data);
    return verifier.verify(publicKey, Buffer.from(signature, 'hex'));
  } catch (error) {
    return false;
  }
}; 
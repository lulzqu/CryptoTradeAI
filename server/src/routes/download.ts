import { Router } from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const router = Router();

/**
 * @route GET /api/download/source-code
 * @desc Tải xuống toàn bộ mã nguồn dự án dưới dạng file zip
 * @access Public
 */
router.get('/source-code', (req, res) => {
  const projectRoot = path.resolve(__dirname, '../../../');
  const tempDir = path.join(projectRoot, 'temp');
  const zipFilename = 'crypto-trade-ai-source.zip';
  const zipPath = path.join(tempDir, zipFilename);

  // Tạo thư mục temp nếu chưa tồn tại
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Lệnh để tạo file zip, loại bỏ node_modules và các file tạm
  const cmd = `cd ${projectRoot} && zip -r ${zipPath} . -x "*/node_modules/*" -x "*/dist/*" -x "*/build/*" -x "*/temp/*" -x "*/logs/*" -x "*.git*" -x "*.env*"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Lỗi khi tạo file zip: ${error.message}`);
      return res.status(500).json({ message: 'Không thể tạo file zip' });
    }

    res.download(zipPath, zipFilename, (err) => {
      if (err) {
        console.error(`Lỗi khi tải xuống file: ${err.message}`);
        return res.status(500).json({ message: 'Không thể tải xuống file' });
      }

      // Xóa file zip sau khi đã tải xuống
      fs.unlink(zipPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Lỗi khi xóa file tạm: ${unlinkErr.message}`);
        }
      });
    });
  });
});

export default router; 
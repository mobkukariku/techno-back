import { diskStorage, Options } from 'multer';
import { Request, Express } from 'express';
import * as path from 'path';
import * as fs from 'fs';

export const multerConfig: Options = {
  storage: diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
      const uploadPath = 'images/news';
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),

  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(
        new Error('Only image files are allowed!') as unknown as null,
        false,
      );
    }
    cb(null, true);
  },
};

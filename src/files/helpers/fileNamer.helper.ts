import { v4 as uuid } from 'uuid';

export function fileNamer(
  req: Express.Request,
  file: Express.Multer.File,
  callback: (erro: Error | null, fileName: string) => void,
) {
  if (!file) return callback(new Error('file empty'), '');
  const fileExtension = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${fileExtension}`;
  callback(null, fileName);
}

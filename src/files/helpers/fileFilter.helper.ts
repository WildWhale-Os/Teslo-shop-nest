export function fileFilter(
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, fileAccept: boolean) => void,
) {
  if (!file) return callback(new Error('file is empty'), false);
  const fileExtension = file.mimetype.split('/')[1];
  const validExtension = ['jpg', 'jpeg', 'png', 'gif'];
  if (validExtension.includes(fileExtension)) {
    callback(null, true);
  }
  callback(null, false);
}

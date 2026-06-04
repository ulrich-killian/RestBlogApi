import multer from 'multer';

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';


  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        status: 'fail',
        message: "Upload failed. Invalid form-data key name. Please send your file using the key 'file'."
      });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'fail',
        message: 'Upload failed. File size is too large. Maximum limit is 2MB.'
      });
    }
  }


  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }


  console.error(' SYSTEM ERROR OCCURRED:', err);


  return res.status(500).json({
    status: 'error',
    message: 'Something went completely wrong on our end!'
  });
};
export type UploadedFile = {
  filename: string;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

export type ImageProperties = {
  resolutionWidth?: number;
  resolutionHeight?: number;
  aspectRatio?: number;
  fileFormat?: string;
};

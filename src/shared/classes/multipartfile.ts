import { Readable } from "stream";

export default class MultipartFile implements Express.Multer.File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
  stream: Readable;

  constructor({
    fieldname,
    originalname,
    encoding,
    mimetype,
    size,
    destination,
    filename,
    path,
    buffer,
    stream,
  }: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
    stream: Readable;
  }) {
    this.fieldname = fieldname;
    this.originalname = originalname;
    this.encoding = encoding;
    this.mimetype = mimetype;
    this.size = size;
    this.destination = destination;
    this.filename = filename;
    this.path = path;
    this.buffer = buffer;
    this.stream = stream;
  }
}

import 'source-map-support/register';
import { S3Service } from '../services/s3.service';

export const importFileParser = (event: any, _context) => {
  console.log("event: ", event);

  try {

    const s3Service = new S3Service();
    s3Service.parseFiles(event.Records, 'uploaded', 'parsed');
    
  } catch(error) {
    console.error(error);
  }
}



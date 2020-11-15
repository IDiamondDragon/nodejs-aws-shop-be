import { S3 } from 'aws-sdk';
const csvParser = require('csv-parser');

export class S3Service {

    private BUCKET = 'import-service-s3-bucket';
    private s3;

    constructor() {
        this.s3 = new S3({
            region: "eu-west-1"
          });
    }

    async getSignedUrlPromise(filePath) {
  
        const params = {
          Bucket: this.BUCKET,
          Key: filePath,
          Expires: 60000,
          ContentType: 'text/csv'
        }
    
        return this.s3.getSignedUrlPromise('putObject', params);
    }

    parseFiles(files: any, sourceFolder: string, destinationFolder: string) {

        files.forEach( (record) => {
        console.log("record: ", record);
    
        const s3Stream = this.s3.getObject({
            Bucket: this.BUCKET,
            Key: record.s3.object.key
            }).createReadStream();
    
        s3Stream.pipe(csvParser())
            .on('error', function(error) {
                console.error(error);
            })
            .on('data', (data) => {
                console.log(data);
            })
            .on('end', async () => {
                console.log('Copy from ' + this.BUCKET + '/' + record.s3.object.key);
    
                await this.s3.copyObject({
                    Bucket: this.BUCKET,
                    CopySource: this.BUCKET + '/' + record.s3.object.key,
                    Key: record.s3.object.key.replace(sourceFolder, destinationFolder)
                }).promise();
        
                console.log('Copied into: ' + this.BUCKET + '/' + record.s3.object.key.replace(sourceFolder, destinationFolder));
                
                await this.s3.deleteObject({
                    Bucket: this.BUCKET,
                    Key: record.s3.object.key
                }).promise();     
                
                console.log('Deleted : ' + this.BUCKET + '/' + record.s3.object.key);
            });
    
        });
    }
    
}
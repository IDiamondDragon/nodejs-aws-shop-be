import { Product } from '../interfaces/product';
import { SQS } from 'aws-sdk';
import { SQSRecord } from 'aws-lambda';

export class SQSService {
    private sqs;

    constructor() {
        this.sqs = new SQS({region: 'eu-west-1'});
    }

    public deleteMessage(sqsRecord: SQSRecord) {
        let params: SQS.DeleteMessageRequest = {
            QueueUrl: process.env.SQS_URL,
            ReceiptHandle: sqsRecord.receiptHandle
        }

        this.sqs.deleteMessage( params, (error, data) => {

            if (error) { 
                console.log(error, error.stack); 
            } else {
                console.log(`message with id ${sqsRecord.messageId} was deleted`);
                console.log('response: ', data);
            }

        });
    }
}
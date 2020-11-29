import { Product } from '../interfaces/product';
import { SQS } from 'aws-sdk';

export class SQSService {
    private sqs;

    constructor() {
        this.sqs = new SQS({region: 'eu-west-1'});
    }

    public sendMessageProduct(product: Product) {
        const now = Date.now().toString();

        this.sqs.sendMessage(
            {
              QueueUrl: process.env.SQS_URL,
              MessageBody: JSON.stringify(product),
              MessageGroupId: "products",
              MessageDeduplicationId: product.id + now
            }, 
            (error, product: SQS.SendMessageResult) => {
              
              if (error) {
                  console.log("Error: ", error);
              } else {
                  console.log('Send message for: ', product.MD5OfMessageBody);
              }
            }
        );
    }
}
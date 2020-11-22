import { Product } from '../interfaces/product';
import { SNS } from 'aws-sdk';

export class SNSService {
    private sns;

    constructor() {
        this.sns = new SNS({region: 'eu-west-1'});
    }

    public publishMessageProduct(product: Product) {

        this.sns.publish({
            Subject: 'Product was added to the database',
            Message: JSON.stringify(product),
            TopicArn: process.env.SNS_ARN,
            MessageAttributes: {
                'price': {
                    DataType: 'String',
                    StringValue: product.price.toString()
                },
            }
        }, () => {
            console.log('Added product to the database: ',  JSON.stringify(product));
        })
    }
}
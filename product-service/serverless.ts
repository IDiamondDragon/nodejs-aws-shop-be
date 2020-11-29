import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    documentation: {
      api: {
        info: {
          version: '1.0.0',
          title: 'product-service-api',
          description: 'Product Service API'
        }
      },
      models: [{
        name: 'Product',
        description: 'Product model',
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'Product id',
            },
            title: {
              type: 'string',
              description: 'Product title',
            },
            description: {
              type: 'string',
              description: 'Product description',
            },
            price: {
              type: 'number',
              description: 'Product price',
            }
          }
        }
      },
      {
        name: 'ProductList',
        description: 'Product list',
        contentType: 'application/json',
        schema: {
          type: 'array',
          items: {
            $ref: '{{model: Product}}'
          }
        }
      },
      {
        name: 'ServiceError',
        description: 'Service error',
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              description: 'Status code of error'
            },
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }]
    },
    'serverless-offline': {
      httpPort: 4000
    }
  },
  // Add the serverless-webpack plugin
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-aws-documentation'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    profile: 'personalAccount',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: '${file(config/environments.json):PG_HOST}',
      PG_PORT: '${file(config/environments.json):PG_PORT}',
      PG_DATABASE: '${file(config/environments.json):PG_DATABASE}',
      PG_USERNAME: '${file(config/environments.json):PG_USERNAME}',
      PG_PASSWORD: '${file(config/environments.json):PG_PASSWORD}',
      SNS_ARN: {
        Ref: 'SNSTopic'
      },
      SQS_URL: {
        Ref: 'SQSQueue'
      }
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: {
          'Fn::GetAtt': ['SQSQueue', 'Arn'] 
        }
      },
      {
        Effect: "Allow",
        Action: "sns:*",
        Resource: {
          Ref: 'SNSTopic'
        }
      }
    ]
  },
  functions: {
    addProduct: {
      handler: 'handler.addProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true,
            // @ts-ignore
            documentation: {
              description: 'Add product to database',
              methodResponses: [{
                  statusCode: '200',
                  responseModels: {
                    'application/json': 'Product'
                  },
                },
                {
                  statusCode: '500',
                  responseModels: {
                    'application/json': 'ServiceError'
                  }
                }
              ]
            }
          }
        }
      ]
    },
    getProductsList: {
      handler: 'handler.getProductsList',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true,
            // @ts-ignore
            documentation: {
              description: 'Get all products',
              methodResponses: [{
                statusCode: '200',
                responseModels: {
                  'application/json': 'ProductList'
                }
              },
              {
                statusCode: '500',       
                responseModels: {
                  'application/json': 'ServiceError'
                }
              }
            ]
            }
          }
        }
      ]
    },
    getProductsById: {
      handler: 'handler.getProductsById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{productId}',
            cors: true,
            request: {
              parameters: {
                paths: {
                  productId: true
                }
              }
            },
            // @ts-ignore
            documentation: {
              description: 'Get product by productId',
              pathParams: [{
                name: 'productId',
                description: 'Product id'
              }],
              methodResponses: [{
                statusCode: '200',
                responseModels: {
                  'application/json': 'Product'
                }
              },
              {
                statusCode: '404',
                responseModels: {
                  'application/json': 'ServiceError'
                }
              },
              {
                statusCode: '500',       
                responseModels: {
                  'application/json': 'ServiceError'
                }
              }]
            }
          }
        }
      ]
    },
    getDataFromFakeAPI: {
      handler: 'handler.getDataFromFakeAPI',
      events: [
        {
          http: {
            method: 'get',
            path: 'fake-api',
            cors: true
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: {
              'Fn::GetAtt': ['SQSQueue', 'Arn']
            }      
          }
        }
      ]
    }
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalog-items-queue.fifo',
          FifoQueue: true,
          ReceiveMessageWaitTimeSeconds: 1 //need to test
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'create-product-topic',
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'diamonddragontp@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          },
          FilterPolicy: {
            "price": [
              "10",
              "2",
              "4"
            ]
          }
        }
      },
      SNSSubscription2: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'michaelmarkeevaws@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          },
          FilterPolicy: {
            "price": [
              "25",
              "0"
            ]
          }
        }
      }
    }
  },
}

module.exports = serverlessConfiguration;

import type { Serverless } from 'serverless/aws';
import { config } from './config/environments';


const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-pseudo-parameters'],
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
      ACCESS_KEY_ID: config.ACCESS_KEY_ID,
      SECRET_ACCESS_KEY: config.SECRET_ACCESS_KEY,
      SQS_URL: config.SQS_QUEUE_URL
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "s3:ListBucket",
        Resource: "arn:aws:s3:::import-service-s3-bucket"
      },
      {
        Effect: "Allow",
        Action: "s3:GetObject",
        Resource: "arn:aws:s3:::import-service-s3-bucket"
      },
      {
        Effect: "Allow",
        Action: "s3:PutObject",
        Resource: "arn:aws:s3:::import-service-s3-bucket"
      },
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource: "arn:aws:s3:::import-service-s3-bucket/*"
      },
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: config.SQS_QUEUE_ARN
      }
    ]
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: true,
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            },
            authorizer: {
              name: "tokenAuthorizer",
              arn: "arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:authorization-service-dev-basicAuthorizer",
              resultTtlInSeconds: 0,
              identitySource: "method.request.header.Authorization",
              type: "token"
            }
          }
        }
      ]
    },
    importFileParser: {
      handler: 'handler.importFileParser',
      events: [
        {
          s3: {
            bucket: 'import-service-s3-bucket',
            event: 's3:ObjectCreated:Put',
            rules: [
              {
                suffix: '.csv',
                prefix: 'uploaded'
              }
            ],
            existing: true         
          }
        }
      ]
    }
  },
  resources: {
    Resources: {
      GatewayResponseDenied: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'"
          },
          ResponseType: "ACCESS_DENIED",
          RestApiId: {
            "Ref": "ApiGatewayRestApi"
          }
        }
      },
      GatewayResponseUnauthorized: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'"
          },
          ResponseType: "UNAUTHORIZED",
          RestApiId: {
            "Ref": "ApiGatewayRestApi"
          }
        }
      }
    }
  }
}

module.exports = serverlessConfiguration;

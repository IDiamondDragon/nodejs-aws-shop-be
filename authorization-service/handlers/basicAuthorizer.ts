import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerHandler } from 'aws-lambda';
import 'source-map-support/register';

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = (event, _context, callback) => {
  console.log("event: ", event);

  console.log("event.type: ", event.type, event.type == "TOKEN")
  if (event.type !== "TOKEN") {
    callback('Unauthorized');
  }

  try {
    const authorizationToken = event.authorizationToken;
    console.log("authorizationToken: ", authorizationToken);
    const encodedCreds = authorizationToken.split(' ')[1];

    console.log("encodedCreds: ", encodedCreds);
    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreds = buff.toString('utf-8').split(':');

    console.log("plainCreds: ", plainCreds);

    const username = plainCreds[0];
    const password = plainCreds[1];

    console.log(`username: ${username} and password: ${password}`);

    const storedUserPassword = process.env[username];
    const effect = !storedUserPassword || storedUserPassword != password ? 'Deny' : 'Allow';

    const policy = generatePolice(encodedCreds, event.methodArn, effect)

    console.log('police: ');
    console.dir(policy,);

    callback(null, policy);
  } catch(error) {
    callback('Unauthorized: ', error);
  }   
}

const generatePolice = (principalId: string, resource: string, effect = 'Allow'): APIGatewayAuthorizerResult => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}
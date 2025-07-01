# PingPong Lambda Function

A simple AWS Lambda function that returns a "ping-pong" response.

## Project Structure

```
project-02/
├── index.js              # Lambda handler function
├── package.json          # Project configuration
├── .github/workflows/    # GitHub Actions workflows
│   └── deploy-lambda.yml # Auto-deployment workflow
└── .gitignore           # Git ignore rules
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build deployment package:
   ```bash
   npm run build
   ```

3. Test locally (optional):
   ```bash
   node index.js
   ```

## Deployment

### Manual Deployment
1. Build the package: `npm run build`
2. Upload `function.zip` to AWS Lambda console
3. Set handler to: `index.handler`

### Automated Deployment (GitHub Actions)
The project is configured with GitHub Actions for automatic deployment on every push to `main` or `master` branch.

#### Required GitHub Secrets
Make sure these secrets are configured in your GitHub repository:

- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `AWS_REGION` - AWS region (e.g., `us-east-1`)
- `LAMBDA_FUNCTION_NAME` - Your Lambda function name
- `LAMBDA_HANDLER` - Handler path (e.g., `index.handler`)

#### How it works
1. Push code to `main` or `master` branch
2. GitHub Actions automatically:
   - Sets up Node.js environment
   - Installs dependencies
   - Builds deployment package
   - Configures AWS credentials
   - Updates Lambda function code
   - Updates Lambda configuration
   - Verifies deployment

## Lambda Function

The function returns a JSON response:
```json
{
  "statusCode": 200,
  "body": "{\"message\": \"Ping-pong pong-ping\"}"
}
```

## Available Scripts

- `npm run build` - Clean and create deployment package
- `npm run zip` - Create deployment package
- `npm run clean` - Remove deployment package
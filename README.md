# Subscription Saver Plaid Demo

Personal fintech app project demonstrating Plaid API integration concepts for a subscription-tracking app.

This project is a small Node.js backend used to test and understand Plaid account-linking workflows, REST API behavior, webhook handling, and troubleshooting patterns. It is not a production application and does not contain real user data or live financial credentials.

## What This Demonstrates

- Local Node.js backend setup
- Plaid API connectivity testing
- Plaid Link/token flow structure
- REST API request and response handling
- JSON payload handling
- HTTP status code and Plaid error-code troubleshooting
- Webhook endpoint structure
- Basic troubleshooting separation between user input issues, developer request issues, and Plaid-side/system issues

## Why I Built This

I built this as part of a consumer fintech app project focused on helping users identify and manage recurring subscription charges.

The project also helped me gain hands-on familiarity with Plaid workflows from a support and troubleshooting perspective, including how account-linking issues can come from different layers such as user input, app implementation, API request formatting, or Plaid-side responses.

## Tech Used

- Node.js
- Express
- Plaid API
- REST APIs
- JSON
- Webhooks
- Environment variables for API credentials

## Security Note

API credentials are not included in this repository. The project uses environment variables for Plaid credentials, and `.env` files are excluded through `.gitignore`.

## Project Status

In active development. This repository is intended to demonstrate technical support troubleshooting knowledge, API familiarity, and fintech product interest.

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8787;

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// Local dev only. In production, store this per user in a database.
let accessToken = null;
let itemId = null;
let syncCursor = null;

function healthResponse() {
  return {
    ok: true,
    service: "subscription-saver-plaid-backend",
    environment: process.env.PLAID_ENV || "sandbox",
    mode: process.env.PLAID_ENV || "sandbox",
  };
}

app.get("/health", (req, res) => {
  res.json(healthResponse());
});

app.get("/api/health", (req, res) => {
  res.json(healthResponse());
});

async function createPlaidLinkToken(req, res) {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: "local-test-user-001",
      },
      client_name: "Subscription Saver",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
    });

    res.json({
      linkToken: response.data.link_token,
      link_token: response.data.link_token,
    });
  } catch (error) {
    console.error("create link token failed:", error.response?.data || error.message);
    res.status(500).json({
      error: "link_token_failed",
      detail: error.response?.data || error.message,
    });
  }
}

// Both routes are supported so your app and manual tests both work.
app.post("/api/create_link_token", createPlaidLinkToken);
app.post("/api/plaid/link-token", createPlaidLinkToken);

async function exchangePublicToken(req, res) {
  try {
    const { public_token, publicToken } = req.body;
    const tokenToExchange = public_token || publicToken;

    if (!tokenToExchange) {
      return res.status(400).json({ error: "missing_public_token" });
    }

    const response = await plaidClient.itemPublicTokenExchange({
      public_token: tokenToExchange,
    });

    accessToken = response.data.access_token;
    itemId = response.data.item_id;
    syncCursor = null;

    res.json({
  ok: true,
  item_id: itemId,
  itemId: itemId,
  candidates: [],
});
  } catch (error) {
    console.error("exchange public token failed:", error.response?.data || error.message);
    res.status(500).json({
      error: "exchange_public_token_failed",
      detail: error.response?.data || error.message,
    });
  }
}

// Both routes are supported.
app.post("/api/exchange_public_token", exchangePublicToken);
app.post("/api/plaid/exchange-public-token", exchangePublicToken);
app.post("/api/plaid/exchange", exchangePublicToken);
app.post("/api/plaid/recurring", async (req, res) => {
  try {
    if (!accessToken) {
      return res.status(400).json({
        error: "no_access_token",
        message: "Connect a bank account first.",
        candidates: [],
      });
app.post("/api/plaid/disconnect", async (req, res) => {
  accessToken = null;
  itemId = null;
  syncCursor = null;

  res.json({
    ok: true,
    message: "Plaid connection removed.",
    candidates: [],
  });
});
    }

    res.json({
      ok: true,
      candidates: [],
    });
  } catch (error) {
    console.error("plaid recurring failed:", error.response?.data || error.message);
    res.status(500).json({
      error: "plaid_recurring_failed",
      detail: error.response?.data || error.message,
      candidates: [],
    });
  }
});
app.get("/api/transactions", async (req, res) => {
  try {
    if (!accessToken) {
      return res.status(400).json({
        error: "no_access_token",
        message: "Connect a bank account first.",
      });
    }

    let added = [];
    let modified = [];
    let removed = [];
    let hasMore = true;
    let cursor = syncCursor;

    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
        cursor,
        count: 100,
      });

      added = added.concat(response.data.added || []);
      modified = modified.concat(response.data.modified || []);
      removed = removed.concat(response.data.removed || []);

      hasMore = response.data.has_more;
      cursor = response.data.next_cursor;
    }

    syncCursor = cursor;

    res.json({
      ok: true,
      added,
      modified,
      removed,
      cursor: syncCursor,
    });
  } catch (error) {
    console.error("transactions failed:", error.response?.data || error.message);
    res.status(500).json({
      error: "transactions_failed",
      detail: error.response?.data || error.message,
    });
  }
});
app.post("/api/plaid/disconnect", async (req, res) => {
  accessToken = null;
  itemId = null;
  syncCursor = null;

  res.json({
    ok: true,
    message: "Plaid connection removed.",
    candidates: [],
  });
});
app.listen(PORT, () => {
  console.log(`Plaid backend running at http://localhost:${PORT}`);
});

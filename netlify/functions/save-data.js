/** Netlify Function: save-data (GitHub Contents API) */
const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: HEADERS, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: "Method Not Allowed" }) };

  const {
    GITHUB_TOKEN,
    DATA_OWNER = "PopielSeba",
    DATA_REPO = "prostysklep-data",
    DATA_PATH = "data.json",
    DATA_BRANCH = "main",
    NETLIFY_DEPLOY_HOOK
  } = process.env;

  if (!GITHUB_TOKEN) {
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: "Missing GITHUB_TOKEN" }) };
  }

  let payload;
  try {

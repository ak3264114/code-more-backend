let fetch = require("node-fetch");

const fetchGraphQLUtils = async (query, variables) => {
  const URL = process.env.GRAPHQL_URL;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables : variables,
    }),
  };

  try {
    const response = await fetch(URL, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = fetchGraphQLUtils;

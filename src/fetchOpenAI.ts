const API_KEY = "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";

export function OpenAIFetchAPI() {
  console.log("Calling GPT3");
  var url = "https://api.openai.com/v1/engines/davinci/completions";
  var bearer = "Bearer " + API_KEY;
  fetch(url, {
    method: "POST",
    headers: {
      Authorization: bearer,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: "Once upon a time",
      max_tokens: 5,
      temperature: 1,
      top_p: 1,
      n: 1,
      stream: false,
      logprobs: null,
      stop: "\n",
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      console.log(typeof data);
      console.log(Object.keys(data));
      console.log(data["choices"][0].text);
    })
    .catch((error) => {
      console.log("Something bad happened " + error);
    });
}

import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useDebounce, useDebouncedCallback } from "use-debounce";
import { useLocalStorage, useDebounce } from "usehooks-ts";

const TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJhbHZpbmxldW5nMjAwOUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZ2VvaXBfY291bnRyeSI6IkNBIn0sImh0dHBzOi8vYXBpLm9wZW5haS5jb20vYXV0aCI6eyJ1c2VyX2lkIjoidXNlci1XZ3ptMmhBM0dMU1U1QUx2NVdLQ2xFQ3QifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA4MDQ2NTUwNzc0NDU0NTE3MzEzIiwiYXVkIjpbImh0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEiLCJodHRwczovL29wZW5haS5vcGVuYWkuYXV0aDBhcHAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY3NjY2OTY3NCwiZXhwIjoxNjc3ODc5Mjc0LCJhenAiOiJUZEpJY2JlMTZXb1RIdE45NW55eXdoNUU0eU9vNkl0RyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgbW9kZWwucmVhZCBtb2RlbC5yZXF1ZXN0IG9yZ2FuaXphdGlvbi5yZWFkIG9mZmxpbmVfYWNjZXNzIn0.KLDAXKXSw-ZS8Y-aRJvyryqjxEOVkJUSC1ObsPGVXQeahvSZgX0h3alShlB0qV_ynY9X1IDsSRTHlEfl8s3DnlIrmppjR3k2AeE4LjFHwpi2ULWnVPnqWMUZCdQ1dMaiKEjtOFz0RzinuvnIifILRKEJib4gda7o0yqh0B7qaA3IDXSxinc7S7yYVnJPpa6bM0cKNqwo3IIindAZwiU6nOVtSXu98r-IAUhCfAjewA0tjxM4REWhuyeL345P09OUxHJzMroNbxaElG9S_fzR6NTmoUu4j8Bg3NN1pQFGIc5AnKK2LyIZXPOJB5kKj6kOfAiD7IJw_QFZ_lGw2PbvNg";

const App: React.FC = () => {
  const [queryInput, setQueryInput] = useLocalStorage("query", "");

  const DEBOUNCE_TIMER = 1000;
  const query = useDebounce(queryInput, DEBOUNCE_TIMER);

  const [result, setResult] = useState("");
  const [isFindingAns, setIsFindingAns] = useState(false);

  const submitPrompt = useCallback(() => {
    if (query === "") {
      setIsFindingAns(false);
      return;
    }

    async function beginQuery() {
      if (!result) {
      }

      setIsFindingAns(false);
      setQueryInput(""); // empty the query
    }

    setIsFindingAns(true);
    beginQuery();
  }, [query]);

  return (
    <div className="flex flex-col bg-gray-800 text-gray-300">
      <div className="m-4  min-h-screen">
        <div className="mt-4">
          <input
            name="query"
            className="w-full p-4 text-4xl block bg-gray-700 rounded-xl outline-none"
            placeholder="Ask a Question"
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                // submit
                submitPrompt();
                e.preventDefault();
              }
            }}
            value={queryInput}
          />
        </div>
        <div>
          {isFindingAns ? (
            <div>Loading</div>
          ) : (
            <div>
              {result !== "" && (
                <div className="w-full mt-4 p-2 text-4xl block bg-slate-100 rounded">
                  <div className="opacity-30 text-sm uppercase">Answer</div>
                  <div>{result}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

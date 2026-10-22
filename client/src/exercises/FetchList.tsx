import { useEffect, useState } from "react";

const LIMIT = 10;
type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

type Result = {
  page: number;
  lastPage: number;
  items: Todo[];
  error: string | null;
};

type GetDataResponse = {
  total: number;
  items: Todo[];
};

const getData = async (page: number): Promise<GetDataResponse> => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=${LIMIT}`,
  );
  if (!response.ok) {
    throw new Error(`Error fetching data (${response.status})`);
  }
  const total = Number(response.headers.get("X-Total-Count"));
  return { total, items: await response.json() };
};

type DisplayDataProps = {
  loading: boolean;
  result: Result | null;
};

const DisplayData = ({ loading, result }: DisplayDataProps) => {
  let content;
  if (!result || loading) {
    content = <p>Loading</p>;
  } else if (result.items.length === 0) {
    content = <p>No Items</p>;
  } else if (result.error) {
    content = <p>Error: {result.error}</p>;
  } else {
    content = (
      <>
        <ul>
          {result.items.map((d) => (
            <li key={d.id}>
              <span>Id: {d.id}</span>
              <span>Title: {d.title}</span>
            </li>
          ))}
        </ul>
        <p>
          Page {result.page} of {result.lastPage}
        </p>
      </>
    );
  }
  return content;
};

export const FetchList = () => {
  const [result, setResult] = useState<Result | null>(null);
  const [page, setPage] = useState(1);
  const loading = result === null || result.page !== page;

  useEffect(() => {
    let ignore = false;
    getData(page)
      .then((data) => {
        if (!ignore)
          setResult({
            page,
            lastPage: Math.ceil(data.total / LIMIT),
            items: data.items,
            error: null,
          });
      })
      .catch((err) => {
        if (!ignore)
          setResult({ page, lastPage: 0, items: [], error: err.message });
      });
    return () => {
      ignore = true;
    };
  }, [page]);

  return (
    <>
      <h2>Data</h2>
      <button
        type="button"
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
      >
        Previous
      </button>
      <button
        type="button"
        onClick={() => setPage((p) => p + 1)}
        disabled={page >= (result?.lastPage ?? 0)}
      >
        Next
      </button>
      <DisplayData result={result} loading={loading} />
    </>
  );
};

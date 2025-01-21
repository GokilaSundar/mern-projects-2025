import "./App.css";

import { ListBooks } from "./ListBooks/ListBooks";
import { NewBook } from "./NewBook/NewBook";

export const App = () => {
  return (
    <>
      <NewBook />
      <ListBooks />
    </>
  );
};

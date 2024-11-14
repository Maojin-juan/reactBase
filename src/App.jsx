import { useState, useEffect } from "react";

const api = "https://api.unsplash.com/search/photos/";
const accessKey = "coNDSSoNoGGxRxcRA8wxmXNEfFk9Gfnhq6UxJmkCmCI";
const SearchBox = ({ onSearchHandler, filterString }) => {
  return (
    <>
      <label htmlFor="filter">搜尋</label>
      <input
        id="filter"
        type="text"
        className="rounded-md border-2 p-2"
        value={filterString}
        onChange={onSearchHandler}
      />
    </>
  );
};

const App = () => {
  // 加減陣列
  // const [arr, setArr] = useState([1, 2, 3]);
  // function removeArrData() {
  //   setArr((arr) => arr.filter((i) => i !== arr.length));
  // }
  // function addArrData() {
  //   setArr([...arr, arr.length + 1]);
  // }

  const [filterString, setFilterString] = useState("animal");
  const [jsonData, setJsonData] = useState([]);
  const onSearchHandler = (e) => {
    setFilterString(e.target.value);
  };

  useEffect(() => {
    (async () => {
      try {
        const result = await axios.get(
          `${api}?client_id=${accessKey}&query=${filterString}`,
        );
        console.log(result);
        setJsonData(result.data.results);
      } catch (error) {
        console.log(error);
      }
      // console.log(`${api}?client_id=${accessKey}&query=${filterString}`);
    })();
  }, []);

  return (
    <>
      <SearchBox
        onSearchHandler={onSearchHandler}
        filterString={filterString}
      />
      <div>
        {jsonData.map((item) => {
          <img src={item.urls.regular} alt="" />;
        })}
      </div>

      {/* 加減陣列 */}
      {/* <ul>
        {arr.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      <div className="flex gap-2">
        <button type="button" onClick={addArrData}>
          新增陣列資料
        </button>
        <button type="button" onClick={removeArrData}>
          移除陣列資料
        </button>
      </div> */}
    </>
  );
};

export default App;

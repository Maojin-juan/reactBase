import { useState, useEffect } from "react";

const api = "https://api.unsplash.com/search/photos/";
const accessKey = "coNDSSoNoGGxRxcRA8wxmXNEfFk9Gfnhq6UxJmkCmCI";

// 舊搜尋
// const SerachBox = ({ text, onSearchHandler, id }) => {
//   return (
//     <>
//       <label htmlFor={id}></label>
//       <input
//         id="search"
//         type="text"
//         className="rounded-md border-2 p-2"
//         value={text}
//         onChange={onSearchHandler}
//       />

//       <hr className="w-full" />
//       <p className="p-2">{text}</p>
//     </>
//   );
// };

// 新搜尋
const SerachBox = ({ onSearchHandler, filterString }) => {
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

  // 舊搜尋
  // const [text, setText] = useState("這是一段文字");
  // const onSearchHandler = (e) => {
  //   console.log(e.target.value);
  //   setText(e.target.value);
  // };

  const [filterString, setFilterString] = useState("animal");

  const onSearchHandler = (e) => {
    setFilterString(e.target.value);
  };

  const getPhotos = async () => {
    const result = await axios.get(
      `${api}?client_id=${accessKey}&query=${filterString}`,
    );
    console.log(result);
    // console.log(`${api}?client_id=${accessKey}&query=${filterString}`);
  };
  getPhotos();

  return (
    <>
      <SerachBox
        onSearchHandler={onSearchHandler}
        filterString={filterString}
      />

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

      {/* 舊搜尋 */}
      {/* <label htmlFor="search"></label>
      <input
        id="search"
        type="text"
        className="rounded-md border-2 p-2"
        value={text}
        onChange={onSearchHandler}
      />
      <hr className="w-full" />
      <p className="p-2">{text}</p>
      <SerachBox text={text} onChange={onSearchHandler} id="search2" /> */}
    </>
  );
};

export default App;

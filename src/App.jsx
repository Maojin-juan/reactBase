import { useState, useEffect, useRef } from "react";
import "./assets/loading.css";

const api = "https://api.unsplash.com/search/photos/";
const accessKey = "coNDSSoNoGGxRxcRA8wxmXNEfFk9Gfnhq6UxJmkCmCI";

const Card = ({ item }) => {
  return (
    <div className="overflow-hidden rounded-xl border-2">
      <img
        src={item.urls.regular}
        alt=""
        className="h-[400px] w-full object-cover"
      />
    </div>
  );
};

const SearchBox = ({ onSearchHandler, filterString }) => {
  return (
    <>
      <label htmlFor="filter">搜尋</label>
      <input
        id="filter"
        type="text"
        className="rounded-md border-2 p-2"
        defaultValue={filterString}
        onKeyDown={onSearchHandler}
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

  const [filterString, setFilterString] = useState("cat");
  const [jsonData, setJsonData] = useState([]);
  const [ratelimitRemaining, setRatelimitRemaining] = useState(50);
  const isLoading = useRef(false);
  const currentPage = useRef(1);
  const onSearchHandler = (e) => {
    if (e.key === "Enter") {
      setFilterString(e.target.value);
    }
  };

  const getPhotos = async (page = 1, isNew = true) => {
    // 搜尋特定需要加入 query
    try {
      isLoading.current = true;
      const result = await axios.get(
        `${api}?client_id=${accessKey}&query=${filterString}&page=${page}`,
      );

      console.log(result);

      setJsonData((preData) => {
        if (isNew) return [...result.data.results];
        return [...preData, ...result.data.results];
      });

      setRatelimitRemaining(result.headers["x-ratelimit-remaining"]);

      currentPage.current = page; // 每次都需要確認當前頁面

      setTimeout(() => {
        isLoading.current = false;
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const listRef = useRef(null);
  useEffect(() => {
    getPhotos(1, true);

    const scrollEvent = () => {
      console.log("scroll", window.scrollY); // 垂直滾動的位置
      const height =
        listRef.current.offsetHeight +
        listRef.current.offsetTop -
        window.innerHeight;

      // 需要滾動到下方，並且沒有在讀取中
      if (!isLoading.current && window.scrollY >= height) {
        currentPage.current++;
        getPhotos(currentPage.current, false); // 應該是頁數增加1
      }
    };

    // 滾動監聽
    window.addEventListener("scroll", scrollEvent);
    // 移除舊有的滾動監聽
    return () => window.removeEventListener("scroll", scrollEvent);
  }, [filterString]);

  return (
    <>
      <div className="loading">
        <div className="pong-loader"></div>
      </div>
      <SearchBox
        onSearchHandler={onSearchHandler}
        filterString={filterString}
      />

      <p>剩餘請求次數：{ratelimitRemaining}</p>

      <div className="grid grid-cols-2 gap-4 p-10" ref={listRef}>
        {jsonData.map((item) => (
          <div key={item.id}>
            <Card item={item} />
          </div>
        ))}
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

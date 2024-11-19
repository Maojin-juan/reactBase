import { useState, useEffect, useRef } from "react";
import "./assets/loading.css";

const api = "https://api.unsplash.com/search/photos/";
const accessKey = "coNDSSoNoGGxRxcRA8wxmXNEfFk9Gfnhq6UxJmkCmCI";

const Card = ({ item, getSinglePhoto }) => {
  return (
    <a
      href="#"
      className="block overflow-hidden rounded-xl border-2"
      onClick={(e) => {
        e.preventDefault();
        getSinglePhoto(item.id);
      }}
    >
      <img
        src={item.urls.regular}
        alt=""
        className="h-[400px] w-full object-cover"
      />
    </a>
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

const Loading = ({ isLoading }) => {
  return (
    <div
      className={`fixed inset-0 z-10 items-center justify-center bg-white bg-opacity-25 backdrop-blur-sm ${isLoading ? "flex" : "hidden"}`}
    >
      <div className="pong-loader"></div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null; // 如果 Modal 沒有開啟，則不渲染任何內容

  return (
    <div
      className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-80"
      onClick={onClose} // 點擊背景時關閉 Modal
    >
      <div
        className="flex flex-col gap-3 bg-slate-50 p-5 shadow-md shadow-stone-400"
        onClick={(e) => e.stopPropagation()} // 點擊內容時不關閉 Modal
      >
        <img
          src={imageUrl}
          alt=""
          className="max-h-[80vh] max-w-[80vw] object-contain" // 限制圖片大小並留出空間
        />
        <button onClick={onClose} className="mt-2">
          關閉
        </button>
      </div>
    </div>
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
  const [photoUrl, setPhotoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const currentPage = useRef(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onSearchHandler = (e) => {
    if (e.key === "Enter") {
      setFilterString(e.target.value);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getSinglePhoto = async (id) => {
    const api = "https://api.unsplash.com/photos/";
    try {
      const result = await axios.get(`${api}${id}?client_id=${accessKey}`);
      console.log(result);
      setPhotoUrl(result.data.urls.regular);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getPhotos = async (page = 1, isNew = true) => {
    // 搜尋特定需要加入 query
    try {
      isLoadingRef.current = true;
      setIsLoading(true);
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
        isLoadingRef.current = false;
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const listRef = useRef(null);
  useEffect(() => {
    getPhotos(1, true);

    const scrollEvent = () => {
      // console.log("scroll", window.scrollY); // 垂直滾動的位置
      const height =
        listRef.current.offsetHeight +
        listRef.current.offsetTop -
        window.innerHeight;

      // 需要滾動到下方，並且沒有在讀取中
      if (!isLoadingRef.current && window.scrollY >= height) {
        currentPage.current++;
        getPhotos(currentPage.current, false); // 應該是頁數增加1
      }
    };

    // 滾動監聽
    window.addEventListener("scroll", scrollEvent);
    // 移除舊有的滾動監聽
    return () => window.removeEventListener("scroll", scrollEvent);
  }, [filterString]);

  useEffect(() => {
    const body = document.querySelector("body");
    if (isLoading) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
  }, [isLoading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalElement = document.querySelector(".modal-content"); // 確保選擇正確的 Modal 內容
      if (modalElement && !modalElement.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal} imageUrl={photoUrl} />
      <Loading isLoading={isLoading} />
      <SearchBox
        onSearchHandler={onSearchHandler}
        filterString={filterString}
      />

      <p>剩餘請求次數：{ratelimitRemaining}</p>

      <div className="grid grid-cols-2 gap-4 p-10" ref={listRef}>
        {jsonData.map((item) => (
          <div key={item.id}>
            <Card item={item} getSinglePhoto={getSinglePhoto} />
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

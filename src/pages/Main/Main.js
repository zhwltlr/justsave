import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { firestore } from "../firebase";
import { getDocs, collection } from "firebase/firestore";
import { postIdState } from "../../atom";
import { useSetRecoilState } from "recoil";
import "./main.css";

const Main = () => {
  const navigate = useNavigate();
  const clickedTitle = useSetRecoilState(postIdState);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const handlePageChange = (page) => {
    searchParams.set("limit", "10");
    searchParams.set("offset", ((page - 1) * 10).toString());
    setSearchParams(searchParams);
    setPage(page);
  };

  const goToDetail = (postTitle, id) => {
    clickedTitle(postTitle);
    navigate(`/post/${id}`);
  };

  const [postList, setPostList] = useState([]);
  const listRef = collection(firestore, "list");
  useEffect(() => {
    const readPostList = async () => {
      const data = await getDocs(listRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    readPostList();
  }, []);

  return (
    <main>
      <section className="mainInner">
        <div className="mainTitle">
          <h2>글로벌 널리지 위키</h2>
        </div>
        <section id="mainList">
          <table>
            <colgroup>
              <col width="100px" />
              <col width="200px" />
              <col width="600px" />
              <col width="200px" />
            </colgroup>
            <thead>
              <tr>
                <th>No.</th>
                <th>관련 강좌</th>
                <th>제목</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              {postList &&
                postList.map((list, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{list.lecture}</td>
                      <td
                        className="listTitle"
                        onClick={() => goToDetail(list.postTitle, list.postId)}
                      >
                        {list.postTitle}
                      </td>
                      <td>{list.createAt}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </section>
        <div className="mainBottom">
          <Pagination
            activePage={page}
            pageRangeDisplayed={5}
            totalItemsCount={100}
            prevPageText="‹"
            nextPageText="›"
            onChange={handlePageChange}
          />
          <button className="postCreate" onClick={() => navigate("/register")}>
            등록
          </button>
        </div>
      </section>
    </main>
  );
};

export default Main;

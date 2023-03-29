import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import { getDocs, collection } from "firebase/firestore";
import { postIdState } from "../../atom";
import { useSetRecoilState } from "recoil";
import "./main.css";

const Main = () => {
  const [totalCnt, setTotalCnt] = useState(0);
  const [clickedButton, setClickedButton] = useState(1);

  const navigate = useNavigate();
  const clickedTitle = useSetRecoilState(postIdState);

  const goToDetail = (postTitle, id) => {
    clickedTitle(postTitle);
    navigate(`/post/${id}`);
  };

  const [allList, setAllList] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [page, setPage] = useState(1);
  const listRef = collection(firestore, "list");

  useEffect(() => {
    const getCount = async () => {
      const q = collection(firestore, "list");
      const querySnapshot = await getDocs(q);
      const count = querySnapshot.size;
      setTotalCnt(count);
    };
    getCount();
    const readPostList = async () => {
      const data = await getDocs(listRef);
      setAllList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    readPostList();
  }, []);

  const Paging = (page) => {
    const clickNum = (page - 1) * 5;
    let clickPage = allList.slice(clickNum, clickNum + 5);
    setCurrentList(clickPage);
  };
  useEffect(() => {
    Paging(page);
  }, [allList, page]);

  const pageCount = Math.ceil(totalCnt / 5);

  if (!allList) return null;

  return (
    <main>
      <section className="mainInner">
        <div className="mainTitle">
          <h2
            onClick={() => {
              navigate("/");
            }}
          >
            글로벌 널리지 위키
          </h2>
        </div>
        <section id="mainList">
          <table>
            <colgroup>
              <col width="100px" />
              <col width="600px" />
              <col width="200px" />
              <col width="200px" />
            </colgroup>
            <thead>
              <tr>
                <th>No.</th>
                <th>널리지 위키</th>
                <th>관련 강좌</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              {currentList?.map((list, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td
                      className="listTitle"
                      onClick={() => goToDetail(list.postTitle, list.postId)}
                    >
                      {list.postTitle}
                    </td>
                    <td className="tdLecture">{list.lecture}</td>
                    <td>{list.createAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
        <div className="mainBottom">
          <button className="postCreate" onClick={() => navigate("/register")}>
            등록
          </button>
        </div>
        <>
          <div className="pagination">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                className={
                  clickedButton === index + 1 ? "paginationBtn" : "pagination"
                }
                onClick={(e) => {
                  setPage(Number(e.target.innerText));
                  setClickedButton(Number(e.target.innerText));
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      </section>
    </main>
  );
};

export default Main;

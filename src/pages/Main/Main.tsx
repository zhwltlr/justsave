import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { postIdState } from "../../atom";
import { useSetRecoilState } from "recoil";
import { WekiListType } from "../../../@types/AllType";
import wekiListConverter from "pages/FirestoreDataConverter";
import "./main.css";

const Main = () => {
  const [totalCnt, setTotalCnt] = useState<number>(0);
  const [clickedButton, setClickedButton] = useState<number>(1);

  const navigate = useNavigate();
  const clickedTitle = useSetRecoilState(postIdState);

  const goToDetail = (postTitle: string, id: number) => {
    clickedTitle(postTitle);
    navigate(`/post/${id}`);
  };

  const [allList, setAllList] = useState<WekiListType[]>([]);
  const [currentList, setCurrentList] = useState<WekiListType[]>([]);
  const [page, setPage] = useState<number>(1);
  const listRef = collection(firestore, "list").withConverter(
    wekiListConverter
  );

  useEffect(() => {
    const getCount = async () => {
      const q = collection(firestore, "list");
      const querySnapshot = await getDocs(q);
      const count = querySnapshot.size;
      setTotalCnt(count);
    };
    getCount();
    const readPostList = async () => {
      const list = query(listRef, orderBy("postTitle"));
      const trimList = await getDocs(list);
      setAllList(trimList.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    readPostList();
  }, []);

  const paging = (page: number) => {
    const clickNum: number = (page - 1) * 5;
    setCurrentList(allList.slice(clickNum, clickNum + 5));
  };

  useEffect(() => {
    paging(page);
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
                onClick={(
                  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ) => {
                  const text = e.target as HTMLElement;
                  setPage(Number(text.innerText));
                  setClickedButton(Number(text.innerText));
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

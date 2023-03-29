import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { postIdState, writeCnt } from "../../atom";
import { useRecoilState, useRecoilValue } from "recoil";
import "./postWrite.css";
import { useNavigate, useParams } from "react-router-dom";

function PostWrite() {
  const editId = useParams();
  const navigate = useNavigate();
  const [writeList, setWriteList] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [changeWriteCnt, setChangeWriteCnt] = useRecoilState(writeCnt);
  const clickedId = useRecoilValue(postIdState);
  const [detailWeki, setDetailWeki] = useState([]);

  const updateGet = async (clickedId) => {
    const q = query(
      collection(firestore, "list"),
      where("postTitle", "==", clickedId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setCurrentId(doc.id);
      setDetailWeki(doc.data());
    });
  };
  useEffect(() => {
    updateGet(clickedId);
  }, []);

  const newPost = (e) => {
    const { name, value } = e.target;
    setWriteList((prev) => ({ ...prev, [name]: value }));
  };
  const editPost = (e) => {
    const { name, value } = e.target;
    setDetailWeki((prev) => ({ ...prev, [name]: value }));
  };
  const postTime = new Date().toLocaleDateString();
  console.log(postTime);
  const createPost = () => {
    const postTime = new Date().toLocaleDateString();
    const currentId = localStorage.getItem("postId");
    setChangeWriteCnt(changeWriteCnt + 1);
    if (
      writeList.title !== "" &&
      writeList.content !== "" &&
      writeList.lecture !== ""
    ) {
      try {
        addDoc(collection(firestore, "list"), {
          postTitle: writeList.title,
          postContent: writeList.content,
          lecture: writeList.lecture,
          postId: currentId,
          createAt: postTime,
        });
      } catch (err) {
        alert(err);
      }
    } else {
      alert("글을 작성해주세요");
    }
  };

  const updatePost = async () => {
    const postTime = new Date().toLocaleDateString();
    const updateRef = doc(firestore, "list", currentId);
    await updateDoc(updateRef, {
      postTitle: detailWeki.postTitle,
      postContent: detailWeki.postContent,
      lecture: detailWeki.lecture,
      createAt: postTime,
    });
  };

  useEffect(() => {
    if (!editId.id) {
      const cnt = Number(localStorage.getItem("postId"));
      localStorage.setItem("postId", cnt + 1);
    }
  }, []);

  return (
    <section id="write">
      <div className="writeInner">
        <div className="writeTitle">
          <h2> 위키 등록하기</h2>
        </div>
        <div className="writeContent">
          {editId.id ? (
            <>
              <input
                type="text"
                placeholder="관련강좌"
                name="lecture"
                className="writeInput"
                onChange={editPost}
                value={detailWeki.lecture || ""}
              />
              <input
                type="text"
                placeholder="제목"
                name="postTitle"
                className="writeInput"
                onChange={editPost}
                value={detailWeki.postTitle || ""}
              />
              <textarea
                name="postContent"
                id="writeTextarea"
                placeholder="내용을 입력하세요"
                rows="20"
                onChange={editPost}
                value={detailWeki.postContent || ""}
              ></textarea>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="관련강좌"
                name="lecture"
                className="writeInput"
                onChange={newPost}
              />
              <input
                type="text"
                placeholder="제목"
                name="title"
                className="writeInput"
                onChange={newPost}
              />
              <textarea
                name="content"
                id="writeTextarea"
                placeholder="내용을 입력하세요"
                rows="20"
                onChange={newPost}
              ></textarea>
            </>
          )}
          {/* <span className="writeCreatedAt">2023.03.12</span> */}
        </div>

        <section id="registerPost">
          {editId.id ? (
            <div>
              <button
                className="cancleBtn"
                onClick={() => {
                  navigate("/");
                }}
              >
                취소
              </button>
              <button
                onClick={() => {
                  updatePost();
                  navigate("/");
                }}
              >
                수정
              </button>
            </div>
          ) : (
            <div>
              <button
                className="cancleBtn"
                onClick={() => {
                  navigate("/");
                }}
              >
                취소
              </button>
              <button
                onClick={() => {
                  createPost();
                  navigate("/");
                }}
              >
                등록
              </button>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default PostWrite;

import React, { useEffect, useState } from "react";
import { postIdState } from "../../atom";
import { useRecoilValue } from "recoil";
import "./detail.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";

function Detail() {
  const params = useParams();
  const navigate = useNavigate();
  const clickedId = useRecoilValue(postIdState);
  const [detailWeki, setDetailWeki] = useState([]);
  const [titleList, setTitleList] = useState([]);

  const updateGet = async () => {
    const q = query(
      collection(firestore, "list"),
      where("postId", "==", params.id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setDetailWeki(doc.data());
    });
  };

  const goToOtherDetail = async (postTitle) => {
    const q = query(
      collection(firestore, "list"),
      where("postTitle", "==", postTitle)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      navigate(`/post/${doc.data().postId}`);
    });
  };

  const [postList, setPostList] = useState([]);
  const listRef = collection(firestore, "list");
  useEffect(() => {
    const readPostList = async () => {
      const data = await getDocs(listRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setTitleList(data.docs.map((doc) => doc.data().postTitle));
    };
    readPostList();
  }, []);

  useEffect(() => {
    updateGet(clickedId);
  }, [params.id]);

  const getHighlightText = (text) => {
    let delimiter = titleList;
    const wekiWord = text?.split(new RegExp(`(${delimiter.join("|")})`));
    if (!wekiWord) return null;

    if (wekiWord.length === 1) {
      return <span key={0}>{wekiWord[0]}</span>;
    }

    return wekiWord.map((word, i) => {
      if (delimiter.includes(word)) {
        return (
          <span
            key={i}
            className="delimiter"
            onClick={() => {
              goToOtherDetail(word);
            }}
          >
            {word}
          </span>
        );
      }
      return <span key={i}>{word}</span>;
    });
  };

  if (!detailWeki) return null;

  return (
    <section id="detail">
      <div className="detailInner">
        <div className="detailTitle">
          <h2>[{detailWeki.lecture}]</h2>
          <span>{detailWeki.postTitle}</span>
          <button
            onClick={() => {
              navigate(`/register/${detailWeki.postId}`);
            }}
            className="alginLeft"
          >
            수정
          </button>
        </div>
        <div className="detailContent">
          <p>{getHighlightText(detailWeki.postContent)}</p>
          <span className="detailCreatedAt">{detailWeki.createAt}</span>
        </div>

        <button
          className="goList"
          onClick={() => {
            navigate("/");
          }}
        >
          목록
        </button>
      </div>

      <article id="relatedPost">
        <h3 className="relatedPostTitle">관련 글</h3>
        {postList.map((post, i) => {
          return (
            <ul className="relatedPostlist" key={i}>
              {post.postContent.includes(clickedId) ? (
                <li
                  onClick={() => {
                    navigate(`/post/${post.postId}`);
                  }}
                >
                  {post.postTitle}
                </li>
              ) : null}
            </ul>
          );
        })}
      </article>
    </section>
  );
}

export default Detail;

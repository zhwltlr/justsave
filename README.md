# Knowledge Weki System

<div align="center">
<img src="https://ifh.cc/g/4hH094.gif" width="800" align="center" />
</div>

In the project directory, you can run: `npm start`

<br />

## 기술스텍

JavaScript, React, Firebase, TypeScript

<br/>

## 구현 기능

1. 목록 페이지
   - Firebase에 저장된 데이터 베이스를 `getDocs()`를 이용하여 가져온 후 5개가 넘어가는 데이터는 페이지네이션을 통해 구현
   - 목록 타이틀 클릭시 `react-router-dom`을 이용하여 용어 정의가 되어있는 상세 페이지로 이동
   - 용어 등록이 가능한 등록 페이지로 이동할 수 있는 등록 버튼 구현

<br />

2. 상세 페이지

   - 용어에 대한 설명 중 firebase 내에 저장된 데이터 title 값과 일치할 경우 해당 페이지로 이동할 수 있게 구현

   ```
   const listRef = collection(firestore, "list");
   useEffect(() => {
       const readPostList = async () => {
       const data = await getDocs(listRef);
       setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
       setTitleList(data.docs.map((doc) => doc.data().postTitle));
       };
       readPostList();
   }, []);
   ```

   - post Content를 담은 후, post Title만의 데이터 리스트를 따로 관리하여 관련 글 목록 생성

   ```
   const getHighlightText = (text) => {
   let delimiter = titleList;

   // 본문 설명에 delmiter 내용이 포함 될 경우, 해당 내용 기준으로 spilt (정규표현식 이용)
   const wekiWord = text?.split(new RegExp(`(${delimiter.join("|")})`));
    // split 된 내용들을 포함할 경우, 해당 상세 페이지로 이동할 수 있게 해줌
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

   ```

   - `getHighlightText(text)` 를 이용하여 키워드와 아닌 것을 구분하여 ui를 구현

<br/>

3. 등록 및 수정 페이지

   - postId 값이 있을 경우 수정 페이지로, postId 값이 없을 경우 등록 페이지로 구현하여 하나의 컴포넌트로 효율적으로 관리

   ```
    <Route path="/register/:id?" element={<PostWrite />} />
   ```

   <br />

    <img src="https://user-images.githubusercontent.com/100506719/228567772-5fcc7706-afe6-4a07-8afb-5a1c9b8b88fb.png" width="800" align="center" />

     <br />

   - 수정 버튼 클릭시 해당 Id 값과 일치하는 내용을 불러와 사용자가 편하게 수정할 수 있도록 `updateGet()` 작성

   ```
     const updateGet = async (clickedId) => {
    // Id 값과 일치하는 내용을 detailWeki 리스트에 담기
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
   ```

## 변경사항

- TypeScript 적용 완료 (23.04)
- 위키 목록 가나다순 정렬 적용 (23.04)

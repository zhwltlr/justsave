import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Detail from "./pages/Detail/Detail.js";
import Main from "./pages/Main/Main.js";
import PostWrite from "./pages/Write/PostWrite.js";
import { RecoilRoot } from "recoil";

const Router = () => {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/post/:id" element={<Detail />} />
          <Route path="/register/:id?" element={<PostWrite />} />
        </Routes>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default Router;

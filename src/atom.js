import { atom } from "recoil";

const postIdState = atom({
  key: "postIdState",
  default: "",
});

const writeCnt = atom({
  key: "writeCnt",
  default: 2,
});

export { postIdState, writeCnt };

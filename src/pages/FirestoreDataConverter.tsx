import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { WekiListType } from "../../@types/AllType";

const wekiListConverter: FirestoreDataConverter<WekiListType> = {
  toFirestore(list: WekiListType): DocumentData {
    return {
      postTitle: list.postTitle,
      postId: list.postId,
      lecture: list.lecture,
      createAt: list.createAt,
      postContent: list.postContent,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): WekiListType {
    const data = snapshot.data();
    return {
      postTitle: data.postTitle,
      postId: data.postId,
      lecture: data.lecture,
      id: data.id,
      createAt: data.createAt,
      postContent: data.postContent,
    };
  },
};

export default wekiListConverter;

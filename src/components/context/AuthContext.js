import {
  createContext,
  useContext,
  useEffect,
  useState,
  serverTimestamp,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const createUser = (email, password) => {
    const create = createUserWithEmailAndPassword(auth, email, password);
    return create;
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const createPost = (postData) => {
    const collectionRef = collection(db, "posts");
    return addDoc(collectionRef, { ...postData });
  };

  return (
    <UserContext.Provider
      value={{
        createUser,
        user,
        logout,
        signIn,
        createPost,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};

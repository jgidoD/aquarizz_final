import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, doc, query, where } from "firebase/firestore";
import { Box, Heading, useCardStyles } from "@chakra-ui/react";
import { db } from "../../firebase/firebaseConfig";
import { UserAuth } from "../context/AuthContext";

function ProfilePage() {
  const { userId } = useParams();
  const { user } = UserAuth();
  const [userData, setUserData] = useState(null);

  //check the location
  let getUrl = window.location.href;
  //take out every `/` to array
  let splitUrl = getUrl.split("/");

  const loadData = async () => {
    if (!userId) return; // Handle missing ID

    // const docRef = doc(db, "users1", splitUrl[4]); // Replace "db" with  Firestore instance
    // const userDataVar = await getDocs(docRef);
    // console.log(userDataVar.data());

    // const docRef = collection(db, "users1"); // Replace "db" with  Firestore instance
    // const docSnap = query(docRef, where("userID", "==", splitUrl[4]));
    // const userDataVar = await getDocs(docSnap);
    // let testData = userDataVar.forEach((doc) => doc.id);
    // console.log(testData);

    const docRef = collection(db, "users1"); // Replace "db" with  Firestore instance
    const docSnap = query(docRef, where("userID", "==", userId));
    const userDataVar = await getDocs(docSnap);
    let tempArr = [];
    let testData = userDataVar.forEach((doc) => {
      tempArr.push(doc.data());
    });
    setUserData(...tempArr);
    console.log(testData);
    // const q = query(
    //   collection(db, "users1"),
    //   where("userID", "==", splitUrl[4])
    // );
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
    // });

    // let sanitizeUserData = db
    //   .collection("users1")
    //   .where("userID", splitUrl[4])
    //   .get();
    // console.log(sanitizeUserData);

    // const docRef = collection(db, "users1"); // Replace "db" with  Firestore instance
    // const docSnap = query(docRef, where("userID", "==", splitUrl[4]));
    // const userDataVar = await getDocs(docSnap);
    // console.log(userDataVar);
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  return (
    <Box>
      {userData ? (
        <Box>
          <Heading>{userData.name}'s Profile</Heading>
          {/* ... display other user's information */}
          {userData.userID}
        </Box>
      ) : (
        <Box>Loading user profile...</Box>
      )}
    </Box>
  );
}

export default ProfilePage;

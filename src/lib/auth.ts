import { getFirebaseAuth, getFirestoreDatabase } from "./firebase";

export type DemoMemberSession = {
  uid: string;
  isFirebaseSession: boolean;
};

export async function signInDemoMember(): Promise<DemoMemberSession> {
  const auth = await getFirebaseAuth();
  if (!auth) {
    return {
      uid: "demo-member",
      isFirebaseSession: false
    };
  }

  const { signInAnonymously } = await import("firebase/auth");
  const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
  const database = await getFirestoreDatabase();

  if (database) {
    const { doc, serverTimestamp, setDoc } = await import("firebase/firestore");
    await setDoc(
      doc(database, "users", user.uid),
      {
        role: "member",
        name: "김예림",
        phone: null,
        isDemo: true,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  }

  return {
    uid: user.uid,
    isFirebaseSession: true
  };
}

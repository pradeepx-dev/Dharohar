import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,

  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  increment,
  query,
  where
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { Project } from "../types";

// --- Configuration ---
// TODO: Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Auth for Context
export { auth };
export type User = FirebaseUser;

// --- Authentication Services ---

export const onAuthStateChanged = (authInstance: any, callback: (user: FirebaseUser | null) => void) => {
  return firebaseOnAuthStateChanged(authInstance, callback);
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};



export const logout = async () => {
  return signOut(auth);
};

// --- Firestore (Database) Services ---

const PROJECTS_COLLECTION = "projects";

// Helper to convert Firestore doc to Project type
const convertDocToProject = (docSnap: any): Project => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    // Ensure createdAt is a number (Firestore stores it as Timestamp)
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now())
  } as Project;
};

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    return querySnapshot.docs.map(convertDocToProject);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const fetchUserProjects = async (userId: string): Promise<Project[]> => {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDocToProject);
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return [];
  }
};

export const fetchLikedProjects = async (userId: string): Promise<Project[]> => {
  try {
    // Firestore doesn't support array-contains for multiple items easily without advanced queries,
    // but simple array-contains works for "Does 'likedBy' contain 'userId'?"
    const q = query(collection(db, PROJECTS_COLLECTION), where("likedBy", "array-contains", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDocToProject);
  } catch (error) {
    console.error("Error fetching liked projects:", error);
    return [];
  }
};

export const fetchProjectById = async (id: string): Promise<Project | null> => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return convertDocToProject(docSnap);
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return null;
  }
};

export const createProject = async (projectData: Omit<Project, "id" | "likes" | "likedBy">): Promise<string> => {
  try {
    // Add default fields
    const newProject = {
      ...projectData,
      likes: 0,
      likedBy: [],
      // Store date as timestamp if preferred, or number. Using number for consistency with type.
      createdAt: Date.now()
    };

    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), newProject);
    return docRef.id;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const updateProject = async (projectId: string, data: Partial<Project>): Promise<void> => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const toggleProjectLike = async (projectId: string, userId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return false;

    const data = docSnap.data();
    const likedBy = data.likedBy || [];
    const isLiked = likedBy.includes(userId);

    if (isLiked) {
      // Unlike
      await updateDoc(docRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId)
      });
      return false;
    } else {
      // Like
      await updateDoc(docRef, {
        likes: increment(1),
        likedBy: arrayUnion(userId)
      });
      return true;
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

// --- Storage (Image) Services ---

// Image upload moved to imgbb.ts
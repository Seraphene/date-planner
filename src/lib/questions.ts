import { db } from "./firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, getDoc } from "firebase/firestore";
import { Question } from "./types";

export const COLLECTION_NAME = "questions";

export const MOCK_QUESTIONS: Question[] = [
    // Section 1: The Vibe Check (Binary Decisions)
    {
        id: "q1",
        order: 1,
        text: "Where do you want to wake up?",
        type: "binary",
        options: [
            { id: "vibe1_a", label: "City Luxury & Convenience", value: "city_luxury", imageUrl: "/images/city-luxury.jpg" },
            { id: "vibe1_b", label: "Private Nature Hideaway", value: "nature_hideaway", imageUrl: "/images/nature-hideaway.jpg" },
        ],
    },
    {
        id: "q2",
        order: 2,
        text: "How much sweat can we handle?",
        type: "binary",
        options: [
            { id: "vibe2_a", label: "Full Adrenaline", value: "adrenaline", imageUrl: "/images/adrenaline.jpg" },
            { id: "vibe2_b", label: "Chill & Float", value: "chill_float", imageUrl: "/images/chill-float.jpg" },
        ],
    },
    // Section 2: Tastes & Flavors (Selection)
    {
        id: "q3",
        order: 3,
        text: "How brave are your tastebuds?",
        type: "selection",
        options: [
            { id: "taste3_1", label: "Volcano Level Sili Ice Cream 🌶️🍦", value: "sili_ice_cream" },
            { id: "taste3_2", label: "Spicy Bicol Express 🥘", value: "bicol_express" },
            { id: "taste3_3", label: "Safe & Sweet (No Chili!) 🍯", value: "no_chili" },
            { id: "taste3_4", label: "Street Food Date 🍢", value: "street_food" },
        ],
    },
    {
        id: "q4",
        order: 4,
        text: "Pick our dinner vibe.",
        type: "selection",
        options: [
            { id: "taste4_1", label: "Rooftop with a View 🌆", value: "rooftop" },
            { id: "taste4_2", label: "Lakeside Sunset 🌅", value: "lakeside" },
            { id: "taste4_3", label: "Private Room Service 🥂", value: "room_service" },
        ],
    },
    // Section 3: The "Spicy" Menu (Intimacy)
    {
        id: "q5",
        order: 5,
        text: "Build our 'Nightstand Kit' (Choose one):",
        type: "selection",
        options: [
            { id: "spicy5_1", label: "Blindfold (Heighten the touch)", value: "blindfold" },
            { id: "spicy5_2", label: "Ice Cubes (Temperature play)", value: "ice_cubes" },
            { id: "spicy5_3", label: "Massage Oil (Slippery fun)", value: "massage_oil" },
            { id: "spicy5_4", label: "Remote Control (For public teasing)", value: "remote_control" },
        ],
    },
    {
        id: "q6",
        order: 6,
        text: "If we play pretend, who are we?",
        type: "selection",
        options: [
            { id: "spicy6_1", label: "Strangers at a Bar 🍸", value: "strangers" },
            { id: "spicy6_2", label: "Masseuse & Client 💆‍♀️", value: "masseuse" },
            { id: "spicy6_3", label: "Room Service (I'm here to fix the AC...) 🛠️", value: "room_service_rp" },
        ],
    },
    {
        id: "q7",
        order: 7,
        text: "What is one specific thing you want me to do to you on this trip? (I promise to say yes).",
        type: "text",
        placeholder: "Type your fantasy here...",
    },
];

export async function getQuestions(): Promise<Question[]> {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const questions: Question[] = [];
        querySnapshot.forEach((doc) => {
            questions.push({ id: doc.id, ...doc.data() } as Question); // Use doc.id from Firestore
        });

        // Fallback to MOCK if DB is empty (for development/testing without DB)
        if (questions.length === 0) {
            console.warn("No questions found in Firestore, using MOCK_QUESTIONS");
            return MOCK_QUESTIONS;
        }

        return questions;
    } catch (error) {
        console.error("Error fetching questions:", error);
        return MOCK_QUESTIONS; // Fail safe
    }
}

export async function addQuestion(question: Omit<Question, "id">) {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), question);
        return docRef.id;
    } catch (e) {
        console.error("Error adding question: ", e);
        throw e;
    }
}

export async function updateQuestion(id: string, question: Partial<Question>) {
    try {
        const questionRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(questionRef, question);
    } catch (e) {
        console.error("Error updating question: ", e);
        throw e;
    }
}

export async function deleteQuestion(id: string) {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
        console.error("Error deleting question: ", e);
        throw e;
    }
}

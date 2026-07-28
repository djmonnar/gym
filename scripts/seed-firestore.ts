import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { facilities, plans, shopProducts } from "../src/data/returnpass";

const projectId = process.env.FIREBASE_PROJECT_ID ?? "returnpass-d3000";

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
    projectId
  });
}

const database = getFirestore();
const batch = database.batch();

for (const facility of facilities) {
  batch.set(
    database.collection("facilities").doc(facility.id),
    {
      ...facility,
      seededAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );
}

for (const plan of plans) {
  batch.set(
    database.collection("plans").doc(plan.id),
    {
      ...plan,
      facilityId: "muscle-factory",
      type: "single",
      period: "month",
      active: true,
      seededAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );
}

for (const product of shopProducts) {
  batch.set(
    database.collection("products").doc(product.id),
    {
      ...product,
      seededAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );
}

await batch.commit();

console.log(
  `Seeded ${facilities.length} facilities, ${plans.length} plans and ${shopProducts.length} products into ${projectId}.`
);

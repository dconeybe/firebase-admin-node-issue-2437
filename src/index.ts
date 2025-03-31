import * as admin from 'firebase-admin';
import type {
  PartialWithFieldValue,
  QueryDocumentSnapshot
} from 'firebase-admin/firestore';

export const firebaseConverter = <T>() => ({
  toFirestore: (data: PartialWithFieldValue<T>) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T
});

interface User {
  id: string;
  name: string;
}

async function main(): Promise<void> {
  admin.initializeApp();
  const snapshot = await admin
    .firestore()
    .collection('users')
    .doc('foobar')
    .withConverter(firebaseConverter<User>())
    .get();

  const data: PartialWithFieldValue<User> | undefined = snapshot.data();
  if (!data) {
    console.log('document does not exist');
  } else {
    console.log(`id=${data.id} name=${data.name}`);
  }
}

main();

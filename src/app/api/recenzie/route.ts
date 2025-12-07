import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const { nume, telefon, recenzie, rating } = await request.json();

    if (!nume || !telefon || !recenzie || !rating) {
      return NextResponse.json(
        { mesaj: 'Toate câmpurile sunt obligatorii.' },
        { status: 400 }
      );
    }

    const ultimele8 = telefon.slice(-8);
    let furnizorRef = null;

    // Search for existing provider by phone or name
    const snapshot = await adminDb.collection('furnizori').limit(100).get();
    snapshot.forEach((doc) => {
      const data = doc.data();
      const telFinal = (data.telefon || '').slice(-8);
      const numeFinal = (data.nume || '').toLowerCase();
      if (telFinal === ultimele8 || numeFinal === nume.toLowerCase()) {
        furnizorRef = doc.ref;
      }
    });

    // Create new provider if not found
    if (!furnizorRef) {
      const nouProfil = await adminDb.collection('furnizori').add({
        nume,
        telefon,
        creat_la: new Date().toISOString(),
      });
      furnizorRef = nouProfil;
    }

    // Add the review
    await furnizorRef.collection('recenzii').add({
      mesaj: recenzie,
      data: new Date().toISOString(),
      rating: parseFloat(rating),
      timestamp: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ mesaj: 'Recenzia ta a fost trimisă cu succes!' });
  } catch (error) {
    console.error('Eroare la trimiterea recenziei:', error);
    return NextResponse.json(
      { mesaj: 'A apărut o eroare la salvarea recenziei.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cautare = (searchParams.get('cautare') || '').toLowerCase();
    const toateRecenziile: Array<{
      nume_furnizor: string;
      telefon: string;
      mesaj: string;
      data: string;
      rating: number | null;
    }> = [];

    const snapshot = await adminDb.collection('furnizori').get();

    for (const doc of snapshot.docs) {
      const furnizor = doc.data();
      const nume = (furnizor.nume || '').toLowerCase();
      const telefon = (furnizor.telefon || '').toLowerCase();
      const potriveste = !cautare || nume.includes(cautare) || telefon.includes(cautare);

      if (!potriveste) continue;

      const recenziiSnapshot = await doc.ref.collection('recenzii').get();
      recenziiSnapshot.forEach((recenzieDoc) => {
        const rec = recenzieDoc.data();
        toateRecenziile.push({
          nume_furnizor: furnizor.nume,
          telefon: furnizor.telefon,
          mesaj: rec.mesaj,
          data: rec.data,
          rating: rec.rating || null,
        });
      });
    }

    return NextResponse.json(toateRecenziile);
  } catch (error) {
    console.error('Eroare la căutarea recenziilor:', error);
    return NextResponse.json(
      { mesaj: 'Eroare la încărcarea recenziilor.' },
      { status: 500 }
    );
  }
}

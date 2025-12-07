import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { checkRateLimit } from '@/lib/utils/rateLimit';

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await checkRateLimit(request, 'review');
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const { nume, telefon, recenzie, rating, furnizorId } = await request.json();

    // Validate required fields
    if (!nume || !telefon || !recenzie || rating === undefined) {
      return NextResponse.json(
        { mesaj: 'Toate câmpurile sunt obligatorii.' },
        { status: 400 }
      );
    }

    // Validate rating (must be 1-5)
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { mesaj: 'Rating-ul trebuie să fie între 1 și 5.' },
        { status: 400 }
      );
    }

    // Validate name length
    if (nume.length < 2 || nume.length > 100) {
      return NextResponse.json(
        { mesaj: 'Numele trebuie să aibă între 2 și 100 caractere.' },
        { status: 400 }
      );
    }

    // Validate phone format (basic check)
    const phoneRegex = /^[\d\s\+\-\(\)]{6,20}$/;
    if (!phoneRegex.test(telefon)) {
      return NextResponse.json(
        { mesaj: 'Numărul de telefon nu este valid.' },
        { status: 400 }
      );
    }

    // Validate review length
    if (recenzie.length < 10 || recenzie.length > 2000) {
      return NextResponse.json(
        { mesaj: 'Recenzia trebuie să aibă între 10 și 2000 caractere.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedNume = nume.trim().substring(0, 100);
    const sanitizedTelefon = telefon.trim().substring(0, 20);
    const sanitizedRecenzie = recenzie.trim().substring(0, 2000);

    let furnizorRef = null;

    // If furnizorId provided, use it directly (from autocomplete selection)
    if (furnizorId) {
      const existingDoc = await adminDb.collection('furnizori').doc(furnizorId).get();
      if (existingDoc.exists) {
        furnizorRef = existingDoc.ref;
      }
    }

    // If no furnizorId or not found, search by phone or name
    if (!furnizorRef) {
      const ultimele8 = sanitizedTelefon.slice(-8);
      const snapshot = await adminDb.collection('furnizori').limit(100).get();
      
      for (const doc of snapshot.docs) {
        const data = doc.data();
        const telFinal = (data.telefon || '').slice(-8);
        const numeFinal = (data.nume || '').toLowerCase();
        if (telFinal === ultimele8 || numeFinal === sanitizedNume.toLowerCase()) {
          furnizorRef = doc.ref;
          break;
        }
      }
    }

    // Create new provider if not found
    if (!furnizorRef) {
      const nouProfil = await adminDb.collection('furnizori').add({
        nume: sanitizedNume,
        telefon: sanitizedTelefon,
        creat_la: new Date().toISOString(),
      });
      furnizorRef = nouProfil;
    }

    // Add the review
    await furnizorRef.collection('recenzii').add({
      mesaj: sanitizedRecenzie,
      data: new Date().toISOString(),
      rating: parsedRating,
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
  // Rate limiting for search
  const rateLimitResult = await checkRateLimit(request, 'search');
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const cautare = (searchParams.get('cautare') || '').toLowerCase().trim().substring(0, 100);
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

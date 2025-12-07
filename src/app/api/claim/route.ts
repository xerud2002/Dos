import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      furnizorId, 
      furnizorNume, 
      userId, 
      userEmail, 
      userName,
      numeReprezentant,
      functie,
      telefon,
      cui,
      adresa,
      message,
      documents 
    } = body;

    if (!furnizorId || !userId || !userEmail || !numeReprezentant || !telefon || !cui) {
      return NextResponse.json(
        { error: 'Date lipsă. Completați câmpurile obligatorii.' },
        { status: 400 }
      );
    }

    // Save claim request to Firestore
    const claimData = {
      furnizorId,
      furnizorNume: furnizorNume || '',
      userId,
      userEmail,
      userName: userName || '',
      numeReprezentant,
      functie: functie || '',
      telefon,
      cui,
      adresa: adresa || '',
      message: message || '',
      documents: documents || [],
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toISOString(),
    };

    await adminDb.collection('claim_requests').add(claimData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing claim:', error);
    return NextResponse.json(
      { error: 'Eroare la procesarea cererii' },
      { status: 500 }
    );
  }
}

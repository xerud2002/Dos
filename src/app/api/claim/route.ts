import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { checkRateLimit } from '@/lib/utils/rateLimit';

export async function POST(request: NextRequest) {
  // Rate limiting for claims (stricter: 3 per hour)
  const rateLimitResult = await checkRateLimit(request, 'claim');
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

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

    // Validate required fields
    if (!furnizorId || !userId || !userEmail || !numeReprezentant || !telefon || !cui) {
      return NextResponse.json(
        { error: 'Date lipsă. Completați câmpurile obligatorii.' },
        { status: 400 }
      );
    }

    // Validate CUI format (Romanian company ID)
    const cuiRegex = /^(RO)?[0-9]{2,10}$/i;
    if (!cuiRegex.test(cui.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'CUI/CIF-ul nu este valid.' },
        { status: 400 }
      );
    }

    // Validate phone format
    const phoneRegex = /^[\d\s\+\-\(\)]{6,20}$/;
    if (!phoneRegex.test(telefon)) {
      return NextResponse.json(
        { error: 'Numărul de telefon nu este valid.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { error: 'Adresa de email nu este validă.' },
        { status: 400 }
      );
    }

    // Validate representative name
    if (numeReprezentant.length < 2 || numeReprezentant.length > 100) {
      return NextResponse.json(
        { error: 'Numele reprezentantului trebuie să aibă între 2 și 100 caractere.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      furnizorId: String(furnizorId).substring(0, 50),
      furnizorNume: String(furnizorNume || '').trim().substring(0, 100),
      userId: String(userId).substring(0, 50),
      userEmail: String(userEmail).trim().substring(0, 100),
      userName: String(userName || '').trim().substring(0, 100),
      numeReprezentant: String(numeReprezentant).trim().substring(0, 100),
      functie: String(functie || '').trim().substring(0, 50),
      telefon: String(telefon).trim().substring(0, 20),
      cui: String(cui).replace(/\s/g, '').toUpperCase().substring(0, 15),
      adresa: String(adresa || '').trim().substring(0, 200),
      message: String(message || '').trim().substring(0, 1000),
      documents: Array.isArray(documents) ? documents.slice(0, 5).map(d => String(d).substring(0, 500)) : [],
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toISOString(),
    };

    await adminDb.collection('claim_requests').add(sanitizedData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing claim:', error);
    return NextResponse.json(
      { error: 'Eroare la procesarea cererii' },
      { status: 500 }
    );
  }
}

import Link from 'next/link';

export const metadata = {
  title: 'Politica de confidențialitate - daiostea.ro',
  description: 'Politica de confidențialitate a platformei daiostea.ro',
};

export default function PoliticaConfidentialitate() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-sky-500 mb-8">
        Politica de confidențialitate
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            1. Introducere
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            daiostea.ro respectă confidențialitatea utilizatorilor săi. Această politică descrie 
            modul în care colectăm, folosim și protejăm informațiile personale.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            2. Datele colectate
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Colectăm următoarele categorii de date:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Date de autentificare (email, nume de utilizator)</li>
            <li>Informații despre furnizori (nume, telefon, email)</li>
            <li>Recenzii și rating-uri publicate</li>
            <li>Date tehnice (adresa IP, tipul browserului)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            3. Scopul utilizării datelor
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Utilizăm datele colectate pentru:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Furnizarea și îmbunătățirea serviciilor platformei</li>
            <li>Afișarea recenziilor și rating-urilor</li>
            <li>Comunicarea cu utilizatorii</li>
            <li>Prevenirea fraudelor și abuzurilor</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            4. Partajarea datelor
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Nu vindem și nu partajăm datele personale cu terți, cu excepția cazurilor prevăzute 
            de lege sau pentru furnizarea serviciilor (ex: Firebase pentru autentificare și stocare).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            5. Drepturile utilizatorilor
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Conform GDPR, aveți dreptul la:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Accesul la datele personale</li>
            <li>Rectificarea datelor inexacte</li>
            <li>Ștergerea datelor (&quot;dreptul de a fi uitat&quot;)</li>
            <li>Portabilitatea datelor</li>
            <li>Retragerea consimțământului</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            6. Contact
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Pentru orice întrebări privind datele personale, ne puteți contacta la adresa de email 
            specificată pe platformă.
          </p>
        </section>
      </div>

      <div className="mt-12">
        <Link href="/" className="text-violet-500 hover:underline">
          ← Înapoi la pagina principală
        </Link>
      </div>
    </div>
  );
}

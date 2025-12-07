import Link from 'next/link';

export const metadata = {
  title: 'Politica de ștergere date - daiostea.ro',
  description: 'Politica de ștergere a datelor personale pe platforma daiostea.ro',
};

export default function PoliticaStergereDate() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-cyan-500 mb-8">
        Politica de ștergere a datelor
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            1. Dreptul la ștergerea datelor
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Conform Regulamentului General privind Protecția Datelor (GDPR), aveți dreptul să 
            solicitați ștergerea datelor personale deținute de daiostea.ro.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            2. Cum să solicitați ștergerea datelor
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Pentru a solicita ștergerea datelor personale:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Trimiteți un email la adresa de contact de pe platformă</li>
            <li>Specificați în subiect &quot;Cerere ștergere date&quot;</li>
            <li>Includeți adresa de email asociată contului</li>
            <li>Descrieți ce date doriți să fie șterse</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            3. Date care vor fi șterse
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            La cererea dumneavoastră, vom șterge:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Datele de autentificare (cont, email)</li>
            <li>Recenziile publicate de dumneavoastră</li>
            <li>Orice alte date personale asociate contului</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            4. Timpul de procesare
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Cererile de ștergere vor fi procesate în termen de 30 de zile de la primire. 
            Veți primi o confirmare pe email după finalizarea procesului.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            5. Excepții
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            În anumite situații, putem reține unele date conform obligațiilor legale sau pentru 
            protejarea intereselor legitime ale platformei (ex: prevenirea fraudei).
          </p>
        </section>
      </div>

      <div className="mt-12 flex gap-4">
        <Link href="/politica-confidentialitate" className="text-emerald-500 hover:underline">
          Politica de confidențialitate
        </Link>
        <span className="text-gray-400">|</span>
        <Link href="/" className="text-emerald-500 hover:underline">
          ← Înapoi la pagina principală
        </Link>
      </div>
    </div>
  );
}

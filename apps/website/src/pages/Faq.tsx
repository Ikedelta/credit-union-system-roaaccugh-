import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function Faq() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  const faqs = [
    { q: "Is ROAACCU recognized by Bank of Ghana (BOG)?", a: "Yes. ROAACCU is affiliated to Ghana Co-operatives Credit Unions Association (CUA) and registered by Department of Co-operatives (DOC)." },
    { q: "Can I save with ROAACCU without acquiring the minimum shares?", a: "Yes. However, you have up to six months to acquire the minimum shares." },
    { q: "Is acquisition of shares compulsory?", a: "Yes. It makes you a full member of ROAACCU who will enjoy all the benefits entitled to a member." },
    { q: "Can I access my account balances on my phone?", a: "Yes. You can use our USSD code (*889*55#) with default pin 1234 to access your account balances." },
    { q: "Does ROAACCU provide SMS alerts on transactions?", a: "Yes. Members receive SMS alerts on all their transactions at NO cost." }
  ];

  return (
    <main className="section container">
      <div className="text-center" style={{ marginBottom: '4rem' }}>
        <h2>F.A.Q</h2>
        <p className="card-text">Frequently Asked Questions</p>
      </div>
      <ul className="faq-list" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {faqs.map((faq, index) => (
          <li key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
            <button className="faq-question" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
              {faq.q}
              {activeFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <div className="faq-answer">
              {faq.a}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

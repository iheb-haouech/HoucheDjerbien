import { Mail, MessageCircle, Phone, Send } from 'lucide-react';
import LOCAL_ASSETS from '../assets/images';

export default function Contact() {
  const whatsappNumber = '216XXXXXXXX';

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get('name');
    const email = form.get('email');
    const message = form.get('message');
    const subject = encodeURIComponent(`Contact request from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:contact@djerba-houches.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10">
          <img src={LOCAL_ASSETS.hero1} alt="Houches Djerbien courtyard" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/78 via-navy-900/55 to-primary-900/20" />
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="text-white">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold-300">Contact</p>
            <h1 className="mt-3 font-display text-5xl font-bold">Talk to Houches Djerbien</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/82">
              Send us a request by email or contact us directly on WhatsApp for stays, services, cleaning, or renovation projects.
            </p>

            <div className="mt-8 space-y-3 text-white/86">
              <a href="mailto:contact@djerba-houches.com" className="flex items-center gap-3 hover:text-gold-300">
                <Mail className="h-5 w-5" />
                contact@djerba-houches.com
              </a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-gold-300">
                <MessageCircle className="h-5 w-5" />
                WhatsApp: +216 XX XXX XXX
              </a>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                +216 XX XXX XXX
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[30px] border border-white/70 bg-white/95 p-6 shadow-2xl">
            <div className="grid gap-4">
              <input name="name" className="admin-input" placeholder="Your name" required />
              <input name="email" className="admin-input" type="email" placeholder="Your email" required />
              <textarea name="message" className="min-h-40 rounded-2xl border border-sand-300 px-4 py-3 font-semibold outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100" placeholder="How can we help?" required />
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 font-bold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-700">
                <Send className="h-4 w-4" />
                Send Email
              </button>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 font-bold text-white shadow-lg hover:bg-green-700">
                <MessageCircle className="h-4 w-4" />
                Contact on WhatsApp
              </a>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

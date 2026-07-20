import Nav from "@/components/home/Nav";
import HeroCarousel from "@/components/home/HeroCarousel";
import ColetivasSection from "@/components/home/ColetivasSection";
import Modalidades from "@/components/home/Modalidades";
import PlanosTeaser from "@/components/home/PlanosTeaser";
import Unidades from "@/components/home/Unidades";
import Faq from "@/components/home/Faq";
import CtaBanner from "@/components/home/CtaBanner";
import Footer from "@/components/home/Footer";
import WhatsFloat from "@/components/home/WhatsFloat";
import { UNIDADES } from "@/lib/unidades";
import { FAQ } from "@/lib/faq";
import { getBanners } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ExerciseGym",
        name: "Academia Belfort",
        url: SITE_URL,
        image: `${SITE_URL}/images/logo.png`,
        location: UNIDADES.map((u) => ({
          "@type": "Place",
          name: u.nome,
          telephone: u.telefone,
          address: {
            "@type": "PostalAddress",
            streetAddress: `${u.logradouro} - ${u.bairroNome}`,
            addressLocality: u.cidade,
            addressRegion: u.estado,
            addressCountry: "BR",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "06:00",
              closes: "22:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Saturday"],
              opens: "08:00",
              closes: "16:00",
            },
          ],
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((item) => ({
          "@type": "Question",
          name: item.pergunta,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.resposta,
          },
        })),
      },
    ],
  };
}

export default async function Home() {
  const banners = await getBanners();

  return (
    <div className="theme-home overflow-x-hidden bg-[var(--blue)] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      <Nav />
      <HeroCarousel banners={banners} />
      <PlanosTeaser />
      <section id="modalidades" className="bg-[var(--cream)] px-8 py-24">
        <ColetivasSection />
        <Modalidades />
      </section>
      <Unidades />
      <Faq />
      <CtaBanner />
      <Footer />
      <WhatsFloat />
    </div>
  );
}

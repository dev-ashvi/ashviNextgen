import { CompanyCard } from "@/components/landing/CompanyCard";

const VENTURES = [
  {
    title: "PokerForge",
    link: "https://molt-poker-ldzy.vercel.app/",
    image: "/companies/pokerforge-preview.png",
    description:
      "Simulation and strategy systems for decision-making.",
    status: "LIVE" as const,
  },
  {
    title: "WYZ",
    link: "https://website-cfo.vercel.app/",
    image: "/companies/wyz-preview.png",
    description:
      "Financial intelligence platform for modern businesses.",
    status: "LIVE" as const,
  },
  {
    title: "HeroDuo",
    link: "https://heroduo.com",
    image: "/companies/heroduo-preview.png",
    description: "Human + technology collaboration system.",
    status: "BUILDING" as const,
  },
];

export function CompaniesShowcase() {
  return (
    <section
      className="ac-companies"
      id="products"
      aria-labelledby="companies-heading"
    >
      <header className="ac-companies-head">
        <p className="ac-companies-eyebrow ac-fi">Companies</p>
        <h2 className="ac-companies-title ac-fi ac-fi-d1" id="companies-heading">
          Companies built through this system.
        </h2>
        <p className="ac-companies-lead ac-fi ac-fi-d2">
          From research to venture creation, these products are active
          expressions of the Ashvi loop.
        </p>
      </header>

      <div className="ac-companies-grid">
        {VENTURES.map((v, i) => (
          <div
            key={v.link}
            className={`ac-company-wrap ac-fi ac-fi-d${Math.min(2 + i, 6)}`}
          >
            <CompanyCard
              title={v.title}
              description={v.description}
              status={v.status}
              image={v.image}
              link={v.link}
            />
          </div>
        ))}
      </div>

      <div className="ac-companies-foot ac-fi ac-fi-d3">
        <div className="ac-companies-foot-divider" aria-hidden />
        <a href="#story" className="ac-companies-foot-link">
          Explore the system
          <span className="ac-companies-foot-ico" aria-hidden>
            →
          </span>
        </a>
      </div>
    </section>
  );
}

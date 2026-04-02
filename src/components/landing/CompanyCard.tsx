import Image from "next/image";

export type CompanyStatus = "LIVE" | "BUILDING";

export interface CompanyCardProps {
  title: string;
  description: string;
  status: CompanyStatus;
  /** Path under `/public`, e.g. `/companies/pokerforge-preview.png` */
  image: string;
  link: string;
  /** Pixel size of screenshot file (for layout; avoids letterboxing) */
  imageWidth?: number;
  imageHeight?: number;
}

export function CompanyCard({
  title,
  description,
  status,
  image,
  link,
  imageWidth = 2560,
  imageHeight = 1600,
}: CompanyCardProps) {
  const statusClass =
    status === "LIVE"
      ? "ac-company-status ac-company-status--live"
      : "ac-company-status ac-company-status--building";

  return (
    <article className="ac-company-card">
      <div className="ac-company-tile">
        <div className="ac-company-preview">
          <Image
            src={image}
            alt={`${title} website preview`}
            width={imageWidth}
            height={imageHeight}
            className="ac-company-shot"
            sizes="(max-width: 900px) 100vw, 33vw"
            priority={false}
          />
        </div>
      </div>
      <div className="ac-company-copy">
        <h3 className="ac-company-heading">
          <span className="ac-company-name">{title}</span>
          <span className="ac-company-dash" aria-hidden>
            {" "}
            —{" "}
          </span>
          <span className={statusClass}>{status}</span>
        </h3>
        <p className="ac-company-desc">{description}</p>
        <a
          href={link}
          className="ac-company-cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open site →
        </a>
      </div>
    </article>
  );
}

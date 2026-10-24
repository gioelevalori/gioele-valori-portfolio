export const HOME_SCHEMA={
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://gioelevalori.dev/#person",
      "name": "Gioele Valori",
      "url": "https://gioelevalori.dev/",
      "jobTitle": "Full-Stack Developer",
      "description": "Sviluppatore full-stack Angular e C#/.NET a Penne, Italia.",
      "sameAs": [
        "https://www.linkedin.com/in/gioelevalori/",
        "https://github.com/gioelevalori"
      ],
      "knowsAbout": [
        "Angular",
        "TypeScript",
        "C#",
        "ASP.NET Core",
        "PostgreSQL",
        "Sviluppo web"
      ],
      "homeLocation": {
        "@type": "Place",
        "name": "Penne, Italia"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://gioelevalori.dev/#website",
      "url": "https://gioelevalori.dev/",
      "name": "Gioele Valori",
      "inLanguage": [
        "it",
        "en"
      ],
      "publisher": {
        "@id": "https://gioelevalori.dev/#person"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://gioelevalori.dev/#webpage",
      "url": "https://gioelevalori.dev/",
      "name": "Gioele Valori — Sviluppatore Full Stack Angular e C#/.NET",
      "isPartOf": {
        "@id": "https://gioelevalori.dev/#website"
      },
      "about": {
        "@id": "https://gioelevalori.dev/#person"
      }
    }
  ]
};

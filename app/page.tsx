// import { SocialTag } from "@/components/SocialTag";
import { UserPortrait } from "@/components/UserPortrait";

export default function Home() {
  const links = [
    {
      href: "https://www.linkedin.com/in/skalidin",
      title: "Linkedin: skalidin",
      label: "skalidin",
    },
    {
      href: "https://www.github.com/skalidin",
      title: "GitHub: skalidindi",
      label: "skalidindi",
    },
  ];

  return (
    <main className="grid place-items-center h-screen">
      <section className="relative z-10 flex flex-col gap-1.5">
        <UserPortrait />
        {/* <ul>
          {links.map((link) => (
            <li key={link.label}>
              <SocialTag
                href={link.href}
                title={link.title}
                label={link.label}
              />
            </li>
          ))}
        </ul> */}
      </section>
    </main>
  );
}

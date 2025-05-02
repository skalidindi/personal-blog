import { LinkedInIcon } from "@/components/LinkedInIcon";
import { SocialTag } from "@/components/SocialTag";
import { UserPortrait } from "@/components/UserPortrait";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import { Mail, Rss } from "lucide-react";

export default function Home() {
  const links = [
    {
      href: "https://www.linkedin.com/in/skalidin",
      title: "Linkedin: skalidin",
      label: "skalidin",
      svgIcon: <LinkedInIcon />,
    },
    {
      href: "https://github.com/skalidindi",
      title: "GitHub: skalidindi",
      label: "skalidindi",
      svgIcon: <SiGithub size={16} />,
    },
    {
      href: "https://x.com/skalidin",
      title: "X: skalidin",
      label: "skalidin",
      svgIcon: <SiX size={14} />,
    },
    {
      href: "mailto:skalidindi8@gmail.com?subject=Hello%20there&body=I%20wanted%20to%20reach%20out%20to%20you.",
      title: "Email: skalidindi8@gmail.com",
      label: "Email",
      svgIcon: <Mail size={16} />,
    },
    {
      href: "blog",
      title: "Blog",
      label: "Blog",
      svgIcon: <Rss size={16} />,
    },
  ];

  return (
    <main className="grid place-items-center h-screen p-8">
      <section className="relative z-10 flex flex-col gap-4">
        <UserPortrait />
        <ul className="flex flex-row flex-wrap gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <SocialTag
                href={link.href}
                title={link.title}
                label={link.label}
                svgIcon={link.svgIcon ?? null}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

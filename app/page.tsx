import { SocialTag } from "@/components/SocialTag";
import { UserPortrait } from "@/components/UserPortrait";
import { EmailIcon } from "@/components/icons/EmailIcon";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon";
import { XIcon } from "@/components/icons/XIcon";

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
      svgIcon: <GithubIcon />,
    },
    {
      href: "https://x.com/skalidin",
      title: "X: skalidin",
      label: "skalidin",
      svgIcon: <XIcon />,
    },
    {
      href: "mailto:skalidindi8@gmail.com?subject=Hello%20there&body=I%20wanted%20to%20reach%20out%20to%20you.",
      title: "Email: skalidindi8@gmail.com",
      label: "Email",
      svgIcon: <EmailIcon />,
    },
  ];

  return (
    <main className="grid place-items-center h-screen">
      <section className="relative z-10 flex flex-col gap-4">
        <UserPortrait />
        <ul className="flex flex-row flex-wrap gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <SocialTag
                href={link.href}
                title={link.title}
                label={link.label}
                svgIcon={link.svgIcon}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

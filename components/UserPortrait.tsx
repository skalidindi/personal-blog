import Image from "next/image";

export function UserPortrait() {
  return (
    <figure className="flex flex-row items-center gap-2">
      <Image
        alt="Self-portrait of Santosh Kalidindi"
        src="/santosh.jpg"
        width={100}
        height={100}
        className="rounded-lg object-cover shadow-lg dark:shadow-gray-800 w-24 h-24"
      />
      <figcaption>
        <p className="text-lg font-semibold">Santosh Kalidindi</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Software Engineer at <span className="text-red-500">Netflix</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Spicy food enthusiast 🌶️
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <em>
            Probably <span className="text-red-500">debugging</span> code and
            dinner
          </em>
        </p>
      </figcaption>
    </figure>
  );
}

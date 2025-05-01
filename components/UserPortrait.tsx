import Image from "next/image";

export function UserPortrait() {
  return (
    <figure className="flex flex-row items-center gap-2">
      <Image
        alt="Self-portrait of Santosh Kalidindi"
        src="/santosh.jpg"
        width={100}
        height={100}
        priority
        className="rounded-lg object-cover shadow-lg dark:shadow-gray-800 w-24 h-24"
        placeholder="blur"
        blurDataURL="data:image/[object Object];base64,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"
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
          <em className="inline-flex items-center gap-1">
            More importantly,{" "}
            <Image
              src="https://static.wikia.nocookie.net/dota2_gamepedia/images/0/00/Shadow_Fiend_minimap_icon.png/revision/latest?cb=20140924021543"
              alt="Shadow Fiend"
              width={16}
              height={16}
              title="Dota 2 Hero: Shadow Fiend"
            />{" "}
            mid lane
          </em>
        </p>
      </figcaption>
    </figure>
  );
}

import Image from "next/image";

export default function Home() {
  return (
    <div className="p-8">
      <div className="text-3xl font-bold underline bg-neutral-900">scraper</div>
      <div className="bg-neutral-200 h-80 w-60 mx-auto mt-32 md:mt-[20vh] pt-5" >
        <div className="bg-neutral-900 h-60 w-55 mx-auto" >
          <Image src="/images/scraper.png" alt="scraper" width={200} height={200} />
        </div>
      </div>
    </div>
  );
}

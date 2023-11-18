/* eslint-disable @next/next/no-img-element */

/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const stats = [
  { label: "NFC Interactions at Events", value: "🎪 2.5 million" },
  { label: "Votes Cast via Smart Contract", value: "🗳️ 120,000" },
  { label: "POAPs Minted", value: "🎀 350,000" },
  { label: "Unique Blockchain Identities Created", value: "✨ 85,000" },
  { label: "Event Organizers Onboarded", value: "🎟️ 1,500" },
  { label: "Gasless Transactions Processed", value: "🕊️ 500,000" },
];

const values = [
  {
    name: "Arx NFC Chip",
    description:
      "Utilizing Arx NFC chips for seamless and secure physical-digital interaction, enabling quick and convenient access control and identification.",
  },
  {
    name: "Account Abstractions",
    description:
      "Implementing Account Abstractions to simplify user interactions with the blockchain, offering a frictionless experience even for those without native cryptocurrency knowledge.",
  },
  {
    name: "Base Blockchain",
    description:
      "Partnering with Base for its focus on real-use case projects, leveraging their robust and scalable blockchain infrastructure for all our decentralized applications.",
  },
  {
    name: "Ethereum Ecosystem",
    description:
      "Building on the Ethereum ecosystem for its security and widespread adoption, ensuring reliable and transparent transactions.",
  },
  {
    name: "Ethereum Attestation Service",
    description:
      "Using Ethereum Attestation Service for issuing verified credentials, enhancing trust and authenticity in digital interactions.",
  },
  {
    name: "Alchemy Infrastructure",
    description:
      "Employing Alchemy's infrastructure for enhanced scalability and reliability in our blockchain interactions.",
  },
];
const team = [
  {
    name: "Valerio Leo",
    role: "Co-Founder",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  },
  {
    name: "Michalis G",
    role: "Co-Founder",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  },
  {
    name: "Nikos Fotiatis",
    role: "Co-Founder",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  },
];

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="bg-white">
        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-50">
          <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">TapTrust</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <Link href="/admin" className="text-sm font-semibold leading-6 text-gray-900">
                Organiser login <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </nav>
        </header>

        <main className="isolate">
          {/* Hero section */}
          <div className="relative isolate -z-10">
            <svg
              className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                  width={200}
                  height={200}
                  x="50%"
                  y={-1}
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M.5 200V.5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                <path
                  d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                  strokeWidth={0}
                />
              </svg>
              <rect width="100%" height="100%" strokeWidth={0} fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" />
            </svg>
            <div
              className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
              aria-hidden="true"
            >
              <div
                className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                style={{
                  clipPath:
                    "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
                }}
              />
            </div>
            <div className="overflow-hidden">
              <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
                <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                  <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                      TapTrust 🌐
                      <span className="text-gray-500">Event Interactions Redefined with NFC & Blockchain</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                      Seamless & Secure 🛡️ - Experience Events Like Never Before!
                    </p>

                    <div className="mt-10 flex items-center gap-x-6">
                      <Link
                        href="/participant"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Get started
                      </Link>
                      <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                        Learn more <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                  <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                    <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                          alt=""
                          className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                      </div>
                    </div>
                    <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                          alt=""
                          className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                      </div>
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80"
                          alt=""
                          className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                      </div>
                    </div>
                    <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=left&w=400&h=528&q=80"
                          alt=""
                          className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                      </div>
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                          alt=""
                          className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our mission</h2>
              <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
                <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                  <p className="text-xl leading-8 text-gray-600">
                    TapTrust combines cutting-edge NFC technology with the Ethereum blockchain, creating a unique event
                    experience that's both secure and private. Our partnership with Arx, Base, and Alchemy ensures
                    top-notch functionality and seamless user experience.
                  </p>
                  <div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
                    <p>
                      Our NFC chips, courtesy of Arx, act as your personal, secure gateway to a range of interactive
                      event experiences. With Base's blockchain platform, every transaction is transparent and
                      immutable, while Alchemy's Account Abstraction allows for gasless transactions, even without
                      Ether.
                    </p>
                    <p className="mt-10">
                      From gasless voting in hackathons to accessing exclusive event areas, your privacy is always
                      protected with a unique Ethereum address tied to each NFC chip. TapTrust is where technology meets
                      convenience, opening doors to a new realm of event interactions.
                    </p>
                  </div>
                </div>
                <div className="lg:flex lg:flex-auto lg:justify-center">
                  <dl className="w-64 space-y-8 xl:w-80">
                    {stats.map(stat => (
                      <div key={stat.label} className="flex flex-col-reverse gap-y-4">
                        <dt className="text-base leading-7 text-gray-600">{stat.label}</dt>
                        <dd className="text-5xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Image section */}
          <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
              alt=""
              className="aspect-[5/2] w-full object-cover xl:rounded-3xl"
            />
          </div>

          {/* Values section */}
          <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Tech Stack</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                TapTrust leverages cutting-edge technologies to redefine event experiences, focusing on security,
                efficiency, and user privacy.
              </p>
            </div>
            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {values.map(value => (
                <div key={value.name}>
                  <dt className="font-semibold text-gray-900">{value.name}</dt>
                  <dd className="mt-1 text-gray-600">{value.description}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Logo cloud */}
          <div className="relative isolate -z-10 mt-32 sm:mt-48">
            <div className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden [mask-image:radial-gradient(50%_45%_at_50%_55%,white,transparent)]">
              <svg className="h-[40rem] w-[80rem] flex-none stroke-gray-200" aria-hidden="true">
                <defs>
                  <pattern
                    id="e9033f3e-f665-41a6-84ef-756f6778e6fe"
                    width={200}
                    height={200}
                    x="50%"
                    y="50%"
                    patternUnits="userSpaceOnUse"
                    patternTransform="translate(-100 0)"
                  >
                    <path d="M.5 200V.5H200" fill="none" />
                  </pattern>
                </defs>
                <svg x="50%" y="50%" className="overflow-visible fill-gray-50">
                  <path d="M-300 0h201v201h-201Z M300 200h201v201h-201Z" strokeWidth={0} />
                </svg>
                <rect width="100%" height="100%" strokeWidth={0} fill="url(#e9033f3e-f665-41a6-84ef-756f6778e6fe)" />
              </svg>
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
                Trusted by the world’s most innovative teams
              </h2>
              <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
                <img
                  className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                  src="https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg"
                  alt="Transistor"
                  width={158}
                  height={48}
                />
                <img
                  className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                  src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg"
                  alt="Reform"
                  width={158}
                  height={48}
                />
                <img
                  className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                  src="https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg"
                  alt="Tuple"
                  width={158}
                  height={48}
                />
                <img
                  className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
                  src="https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg"
                  alt="SavvyCal"
                  width={158}
                  height={48}
                />
                <img
                  className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
                  src="https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg"
                  alt="Statamic"
                  width={158}
                  height={48}
                />
              </div>
            </div>
          </div>

          {/* Team section */}
          <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-48 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet the Innovators</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Our team of experts in blockchain, NFC technology, and event management are the driving force behind
                TapTrust. Get to know the faces behind this revolutionary platform.
              </p>
            </div>
            <ul
              role="list"
              className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-5 xl:grid-cols-6"
            >
              {team.map(person => (
                <li key={person.name}>
                  <img className="mx-auto h-24 w-24 rounded-full" src={person.imageUrl} alt="" />
                  <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">{person.name}</h3>
                  <p className="text-sm leading-6 text-gray-600">{person.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;

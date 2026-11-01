
import SectionHeading from "../components/SectionHeading";
import {
  Heart,
  Leaf,
  Utensils,
  Award,
  Clock,
  Users,
} from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description:
      "We believe great food starts with quality ingredients. Every dish is thoughtfully prepared to deliver freshness and flavor.",
  },
  {
    icon: Heart,
    title: "Made with Passion",
    description:
      "From classic favorites to satisfying meals, we put care and attention into every part of your dining experience.",
  },
  {
    icon: Award,
    title: "Quality First",
    description:
      "We focus on delicious food, consistent quality, and an experience that makes every order worth enjoying.",
  },
  {
    icon: Clock,
    title: "Convenience Matters",
    description:
      "Explore the menu, choose your favorites, and place your order through a simple and convenient experience.",
  },
];

export default function About() {
  return (
    <main className="container max-w-6xl py-14">

      {/* Hero Section */}
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-bold tracking-[0.25em] text-[#ffd65a]">
            OUR STORY
          </p>

          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            Good Food.
            <span className="block text-[#ffd65a]">
              Great Moments.
            </span>
          </h1>

          <p className="muted mt-6 leading-8">
            At FoodieHub, we believe food is more than just a meal.
            It brings people together, creates memories, and makes
            everyday moments special. Our goal is to make discovering
            and enjoying your favorite food simple, convenient, and
            delightful.
          </p>

          <p className="muted mt-4 leading-8">
            Whether you're craving a cheesy pizza, a juicy burger,
            comforting pasta, or a flavorful biryani, FoodieHub
            brings a variety of delicious choices together in one place.
          </p>
        </div>

        <div className="relative">
          <img
            className="h-[380px] w-full rounded-3xl object-cover shadow-2xl"
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=85"
            alt="A delicious spread of freshly prepared food"
          />
          <div className="absolute bottom-5 left-5 rounded-2xl bg-[#080d0f]/90 px-5 py-4 backdrop-blur">
            <p className="font-display text-xl font-bold text-[#ffd65a]">
              FoodieHub
            </p>
            <p className="text-sm text-white">
              Good Food • Great Mood
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="panel mt-20 grid gap-8 rounded-3xl p-8 md:grid-cols-2 md:p-12">
        <div>
          <p className="text-sm font-bold tracking-widest text-[#ffd65a]">
            OUR MISSION
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold">
            Making every food experience special.
          </h2>
        </div>

        <p className="muted leading-8">
          Our mission is to bring delicious food and convenient ordering
          together through a welcoming online experience. We want every
          visitor to discover something they love, navigate the menu
          effortlessly, and enjoy a smooth journey from browsing to checkout.
        </p>
      </section>

      {/* Values Section */}
      <section className="mt-20">
        <SectionHeading
          eyebrow="WHAT WE BELIEVE IN"
          title="The values behind every bite"
          description="The little things that make a food experience memorable."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="panel rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-[#ffd65a]/40"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffd65a]/10 text-[#ffd65a]">
                  <Icon size={25} />
                </div>

                <h3 className="font-display text-xl font-bold">
                  {item.title}
                </h3>

                <p className="muted mt-3 text-sm leading-7">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Closing Section */}
      <section className="relative mt-20 overflow-hidden rounded-3xl">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85"
          alt="Warm restaurant dining atmosphere"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/75" />

        <div className="relative px-6 py-16 text-center sm:px-12">
          <Utensils
            className="mx-auto mb-5 text-[#ffd65a]"
            size={38}
          />

          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Your Cravings, Our Passion.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-300">
            Discover your favorites, explore new flavors, and make
            every meal a little more special with FoodieHub.
          </p>
        </div>
      </section>

    </main>
  );
}

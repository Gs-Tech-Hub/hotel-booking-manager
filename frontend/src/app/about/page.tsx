import AboutSection from '@/components/about-section';

const aboutData = {
  title: "About Us",
  description: "The passage experienced a surge in popularity during the 1960s when Letraset used it on their dry-transfer sheets, and again during the 90s as desktop publishers bundled the text with their software.",
  image: "/images/about.png"
};

export default function AboutPage() {
  return
   <AboutSection {...aboutData} />;

}
  
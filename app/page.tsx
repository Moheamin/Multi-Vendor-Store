import Main from "@/app/_components/content/Main";

import "./styles/globals.css";

export const metadata = {
  title: "متجر متعدد البائعين",
  description: "منصة تجمع بين المتاجر والبائعين في مكان واحد",
};

export default function Home() {
  return (
    <main dir="rtl">
      <Main />
    </main>
  );
}

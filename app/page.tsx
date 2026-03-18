import Main from "@/app/_components/content/Main";

import Header from "./_components/content/Header";
import "./styles/globals.css";

export const metadata = {
  title: "لنك الصناعة",
  description: "منصة تجمع بين المتاجر والبائعين في مكان واحد",
};

export default function Home() {
  return (
    <main dir="rtl">
      <Header />
      <Main />
    </main>
  );
}

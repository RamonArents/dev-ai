import { Search } from "~/pages/Search";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "dev-ai" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Search />;
}

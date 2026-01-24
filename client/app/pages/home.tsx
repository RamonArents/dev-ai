import { Search } from "~/pages/Search";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "dev-ai" },
    { name: "description", content: "Welcome to dev-ai!" },
  ];
}

export default function Home() {
  return <Search />;
}

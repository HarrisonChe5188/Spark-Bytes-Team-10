import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
      <AuthButton />
      this is a built in component we can use
      <ThemeSwitcher />
    </div>
  );
}

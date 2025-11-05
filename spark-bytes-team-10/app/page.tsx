import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { NewFoodButton } from "@/components/new-food-button";
export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
      <AuthButton />
      this is a built in component we can use
      <ThemeSwitcher />
      <NewFoodButton />
    </div>
  );
}

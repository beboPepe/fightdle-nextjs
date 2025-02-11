import GuessChar from "@/components/GuessChar";
import Link from "next/link";

const Page = async () => {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <Link href="/guessingGame">Go to the Game</Link>
    </div>
  );
};

export default Page;

import { auth } from "@/features/auth/auth"; // Adjust this path based on your project structure

const HomePage = async () => {
  const session = await auth();

  if (session) {
    console.log("LOGGED_IN_USER_DATA:", session.user);
  }

  return <div className='text-white pt-24 px-10'></div>;
};

export default HomePage;

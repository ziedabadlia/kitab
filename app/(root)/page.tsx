import { auth } from "@/features/auth/auth"; // Adjust this path based on your project structure

const HomePage = async () => {
  const session = await auth();

  if (session) {
    console.log("LOGGED_IN_USER_DATA:", session.user);
  }

  return (
    <div className='text-white pt-24 px-10'>
      <h1 className='text-3xl font-bold'>
        Welcome back, {session?.user?.name || "User"}
      </h1>
      <pre className='mt-4 bg-slate-900 p-4 rounded text-xs text-green-400'>
        {JSON.stringify(session?.user, null, 2)}
      </pre>
    </div>
  );
};

export default HomePage;

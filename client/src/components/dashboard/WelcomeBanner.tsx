import { FolderPlus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function WelcomeBanner() {
  const { user } = useAuth();

  return (
    <section>
      <h1 className="text-5xl font-bold tracking-tight">
        Welcome back
        {user?.displayName && (
          <span className="text-blue-500">
            {" "}
            {user.displayName}
          </span>
        )}
        👋
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
        Import a GitHub repository and deploy your applications
        through your automated CI/CD pipeline powered by GitHub
        Actions, Amazon S3 and CloudFront.
      </p>

      <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-[1.02] hover:bg-zinc-200">
        <FolderPlus size={18} />
        Import Repository
      </button>
    </section>
  );
}
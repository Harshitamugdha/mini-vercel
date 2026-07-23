import {
    FolderGit2,
    GitBranch,
    Cloud,
    Globe,
    ArrowRight,
  } from "lucide-react";
  export default function Pipeline() {
    const items = [
      {
        icon: <FolderGit2 size={22} />,
        label: "GitHub",
      },
      {
        icon: <GitBranch size={22} />,
        label: "Actions",
      },
      {
        icon: <Cloud size={22} />,
        label: "AWS S3",
      },
      {
        icon: <Globe size={22} />,
        label: "Live",
      },
    ];
  
    return (
      <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
        {items.map((item, index) => (
          <div
            key={item.label}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
              <div className="text-blue-500">
                {item.icon}
              </div>
  
              <span className="text-sm font-medium text-zinc-300">
                {item.label}
              </span>
            </div>
  
            {index !== items.length - 1 && (
              <ArrowRight
                className="text-zinc-600"
                size={18}
              />
            )}
          </div>
        ))}
      </div>
    );
  }
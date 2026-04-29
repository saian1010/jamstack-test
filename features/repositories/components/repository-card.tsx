import { ForkIcon, RepoIcon, StarIcon } from "./icons";
import type { Repository } from "../data/github";

type RepositoryCardProps = {
  repository: Repository;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1
  }).format(value);
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <article className="flex flex-col gap-5 rounded-[24px] border border-slate-400/25 bg-linear-to-b from-white to-[#fdfefe] px-[18px] py-[18px] transition duration-200 hover:-translate-y-0.5 hover:border-blue-600/24 hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)] sm:px-6 sm:py-[22px] lg:flex-row lg:items-center lg:justify-between">
      <div className="grid min-w-0 gap-[18px]">
        <div className="flex items-start gap-[14px]">
          <RepoIcon className="mt-[3px] h-5 w-5 shrink-0 text-blue-600" />
          <div>
            <h3 className="text-[1.2rem] font-bold tracking-[-0.04em] sm:text-[1.45rem]">
              <a
                className="text-blue-600 underline-offset-[0.16em] hover:underline focus-visible:underline"
                href={repository.htmlUrl}
                target="_blank"
                rel="noreferrer"
              >
                {repository.name}
              </a>
            </h3>
            <p className="mt-2 max-w-[62ch] leading-[1.65] text-slate-600">
              {repository.description ?? "No description provided."}
            </p>
          </div>
        </div>

        <dl className="flex flex-wrap gap-x-4 gap-y-3 sm:gap-x-[18px]">
          <div className="flex items-center gap-[10px] text-[0.95rem] text-slate-500">
            <dt className="sr-only">Language</dt>
            <dd className="inline-flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)]"
                style={{ backgroundColor: repository.languageColor }}
                aria-hidden="true"
              />
              {repository.language ?? "Not specified"}
            </dd>
          </div>
          <div className="flex items-center gap-[10px] text-[0.95rem] text-slate-500">
            <dt className="sr-only">Stars</dt>
            <dd className="inline-flex items-center gap-2">
              <StarIcon className="h-[14px] w-[14px] text-slate-500" />
              {formatCount(repository.stargazersCount)}
            </dd>
          </div>
          <div className="flex items-center gap-[10px] text-[0.95rem] text-slate-500">
            <dt className="sr-only">Forks</dt>
            <dd className="inline-flex items-center gap-2">
              <ForkIcon className="h-[14px] w-[14px] text-slate-500" />
              {formatCount(repository.forksCount)}
            </dd>
          </div>
        </dl>
      </div>

      <a
        className="self-start font-semibold text-blue-600 underline-offset-[0.16em] hover:underline focus-visible:underline lg:self-center"
        href={repository.htmlUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`View ${repository.fullName} on GitHub`}
      >
        View repository
      </a>
    </article>
  );
}

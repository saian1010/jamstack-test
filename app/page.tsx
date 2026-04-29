import { PaginationControls } from "@/features/repositories/components/pagination-controls";
import { RepositoryCard } from "@/features/repositories/components/repository-card";
import { getRepositories, PAGE_SIZE } from "@/features/repositories/data/github";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type HomePageProps = {
  searchParams?: SearchParams;
};

function parsePage(value: string | string[] | undefined) {
  // Repeated query params can arrive as arrays; only the first page value matters here.
  const rawValue = Array.isArray(value) ? value[0] : value;
  const pageNumber = Number.parseInt(rawValue ?? "1", 10);

  if (!Number.isFinite(pageNumber)) {
    return 1;
  }

  return Math.max(pageNumber, 1);
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = searchParams ? await searchParams : undefined;
  const requestedPage = parsePage(params?.page);
  const initialResult = await getRepositories(requestedPage);
  // When someone lands on a page beyond the available range, render the last real page instead of an empty shell.
  const result =
    !initialResult.error && requestedPage > initialResult.totalPages
      ? await getRepositories(initialResult.totalPages)
      : initialResult;
  const currentPage =
    !result.error && requestedPage > result.totalPages
      ? result.totalPages
      : requestedPage;
  const pageStart = (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = pageStart + Math.max(result.repositories.length - 1, 0);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(191,219,254,0.55),transparent_28%),radial-gradient(circle_at_right_15%,rgba(226,232,240,0.8),transparent_25%),linear-gradient(180deg,#f6f8fb_0%,#eef2f7_100%)] px-5 py-12 text-slate-950 sm:px-6 sm:py-18">
      <section
        className="mx-auto max-w-[1140px] rounded-[36px] border border-white/65 bg-linear-to-b from-white/82 to-white/68 p-4 shadow-[0_26px_60px_rgba(15,23,42,0.09)] backdrop-blur-[14px] sm:p-5"
        aria-labelledby="page-title"
      >
        <div
          className="mb-7 inline-flex items-center gap-3 px-2 py-1.5"
          aria-hidden="true"
        >
          <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-slate-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
            <svg viewBox="0 0 16 16" role="img" focusable="false">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.67 0 8.19c0 3.62 2.29 6.69 5.47 7.77.4.08.55-.18.55-.39 0-.19-.01-.82-.01-1.49-2.01.38-2.53-.5-2.69-.96-.09-.24-.48-.96-.81-1.15-.27-.15-.66-.53-.01-.54.61-.01 1.04.57 1.18.81.7 1.22 1.82.88 2.27.67.07-.52.27-.88.49-1.08-1.78-.21-3.64-.91-3.64-4.03 0-.89.31-1.62.82-2.19-.08-.21-.36-1.05.08-2.18 0 0 .67-.22 2.2.84a7.39 7.39 0 0 1 4 0c1.53-1.06 2.2-.84 2.2-.84.44 1.13.16 1.97.08 2.18.51.57.82 1.29.82 2.19 0 3.13-1.87 3.82-3.65 4.03.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.47.55.39A8.21 8.21 0 0 0 16 8.19C16 3.67 12.42 0 8 0Z"
              />
            </svg>
          </div>
          <span className="text-[1.55rem] font-bold tracking-[-0.03em]">
            GitHub
          </span>
        </div>

        <header className="flex flex-col gap-6 px-1 py-2 pb-8 lg:flex-row lg:items-start lg:justify-between lg:px-3">
          <div>
            <h1
              id="page-title"
              className="max-w-[12ch] text-[2.4rem] leading-[0.95] font-bold tracking-[-0.06em] sm:text-[3.25rem] lg:text-[4.4rem]"
            >
              GitHub Repository Listing
            </h1>
            <p className="mt-[18px] max-w-[60ch] text-base leading-7 text-slate-600 sm:text-[1.06rem]">
              Browse public repositories from the GitHub organization in a
              paginated, accessible list inspired by GitHub&apos;s own overview
              pages.
            </p>
          </div>
          <div
            className="w-full min-w-0 self-start rounded-[20px] border border-slate-400/25 bg-white/84 px-[22px] py-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] lg:w-auto lg:min-w-[220px]"
            aria-label={`Showing page ${currentPage}`}
          >
            <span className="mb-2 block text-[1.15rem] font-bold tracking-[-0.03em]">
              Page {currentPage} of {result.totalPages}
            </span>
            <span className="block text-[0.95rem] leading-6 text-slate-600">
              Showing {pageStart}-{pageEnd} repositories
            </span>
          </div>
        </header>

        {result.error ? (
          <section
            className="rounded-[32px] border border-slate-400/25 bg-white/90 p-[26px] shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
            role="alert"
            aria-live="polite"
          >
            <h2 className="text-[1.2rem] font-bold tracking-[-0.03em]">
              Unable to load repositories
            </h2>
            <p className="mt-2 leading-7 text-slate-600">{result.error}</p>
            <p className="mt-[10px] text-[0.95rem] leading-7 text-slate-600">
              Check your network connection or provide a `GITHUB_TOKEN` to raise
              the API rate limit for local development.
            </p>
          </section>
        ) : (
          <>
            <section
              className="rounded-[32px] border border-slate-400/25 bg-white/90 p-[18px] shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-[26px]"
              aria-labelledby="repositories-heading"
              aria-live="polite"
            >
              <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-baseline sm:justify-between">
                <h2
                  id="repositories-heading"
                  className="text-[1.2rem] font-bold tracking-[-0.03em]"
                >
                  Repositories
                </h2>
                <p className="leading-7 text-slate-600">
                  10 results per page, sorted by repository name.
                </p>
              </div>

              {result.repositories.length === 0 ? (
                <div className="rounded-[32px] border border-dashed border-slate-400/25 bg-slate-50 p-[18px] shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-[26px]">
                  <h2 className="text-[1.2rem] font-bold tracking-[-0.03em]">
                    No repositories found
                  </h2>
                  <p className="mt-2 leading-7 text-slate-600">
                    This page returned no repositories. Try a different page.
                  </p>
                </div>
              ) : (
                <ul className="grid gap-4" role="list">
                  {result.repositories.map((repository) => (
                    <li key={repository.id}>
                      <RepositoryCard repository={repository} />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <PaginationControls
              currentPage={currentPage}
              totalPages={result.totalPages}
            />
          </>
        )}
      </section>
    </main>
  );
}

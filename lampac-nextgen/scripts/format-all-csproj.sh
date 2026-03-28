#!/usr/bin/env bash
# Run dotnet format across the repository.
#
# Default: one `dotnet format <path>` per *.csproj (skips bin/obj).
#
#   ./scripts/format-all-csproj.sh --solution
#   — `dotnet format NextGen.sln` once (faster: one restore/load).
#
# --include:
#   Space-separated paths relative to the repo root. Limits which files are
#   formatted; you still need a project or solution so MSBuild can load the
#   workspace. If omitted, every file in that workspace is eligible.
#
#   ./scripts/format-all-csproj.sh --solution --include "Core/ Modules/"
#   FORMAT_INCLUDE="Core/" ./scripts/format-all-csproj.sh --solution
#
# Extra dotnet-format options after -- :
#   ./scripts/format-all-csproj.sh -- --verify-no-changes

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

use_solution=false
include_list=""
dotnet_extra=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --solution|-s)
      use_solution=true
      shift
      ;;
    --include)
      [[ -n "${2:-}" ]] || {
        printf 'error: --include requires a path list\n' >&2
        exit 1
      }
      include_list=$2
      shift 2
      ;;
    --)
      shift
      dotnet_extra=("$@")
      break
      ;;
    *)
      printf 'error: unknown argument: %s\n' "$1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$include_list" && -n "${FORMAT_INCLUDE:-}" ]]; then
  include_list=$FORMAT_INCLUDE
fi

fmt_args=()
if [[ -n "$include_list" ]]; then
  fmt_args+=(--include "$include_list")
fi
# With set -u, "${arr[@]}" on an empty array errors on some Bash versions.
if ((${#dotnet_extra[@]} > 0)); then
  fmt_args+=("${dotnet_extra[@]}")
fi

run_format() {
  if ((${#fmt_args[@]} > 0)); then
    dotnet format "$@" "${fmt_args[@]}"
  else
    dotnet format "$@"
  fi
}

if $use_solution; then
  if [[ ! -f NextGen.sln ]]; then
    printf 'error: NextGen.sln not found in %s\n' "$ROOT" >&2
    exit 1
  fi
  printf 'Formatting solution: NextGen.sln\n'
  run_format NextGen.sln
  exit $?
fi

exitcode=0
while IFS= read -r csproj; do
  printf 'Formatting: %s\n' "$csproj"
  if ! run_format "$csproj"; then
    exitcode=1
  fi
done < <(
  find "$ROOT" -name '*.csproj' \
    -not -path '*/bin/*' \
    -not -path '*/obj/*' \
    | sort
)

exit "$exitcode"

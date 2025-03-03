export function humanFileSize(size: bigint) {
  const i = Math.floor(Math.log(Number(size)) / Math.log(1024));
  return (
    Number((Number(size) / Math.pow(1024, i)).toFixed(2)) +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
}

export async function copyToClipboard(text: string) {
  try {
    if (!navigator.clipboard) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    } else {
      await navigator.clipboard.writeText(text);
    }
    console.log("Text copied to clipboard");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
}

export function createEd2kLink(file: {
  name?: string | null;
  size?: bigint | null;
  hash: string;
}) {
  return `ed2k://|file|${encodeURIComponent(file.name || "")}|${file.size || 0}|${file.hash}|/`;
}

export function sortArray<T>(arr: T[], key: string, desc?: boolean) {
  return Array.from(arr).sort((a: any, b: any) => {
    if (a[key] < b[key]) {
      return desc ? 1 : -1;
    }
    if (a[key] > b[key]) {
      return desc ? -1 : 1;
    }
    return 0;
  });
}

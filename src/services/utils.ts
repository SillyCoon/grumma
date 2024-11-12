export const fetchJson = async <T>(url: string) => {
  return (await (await fetch(url)).json()) as T;
};

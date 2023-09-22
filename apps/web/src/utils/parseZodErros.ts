export default function (errors: { [key: string]: string[] } | undefined) {
  if (!errors) return {};
  const fieldErros: Record<string, string> = {};
  Object.entries(errors).map(([key, val]) => {
    const itemError = val?.pop();
    if (itemError) fieldErros[key] = itemError;
  });
  return fieldErros;
}

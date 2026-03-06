export function formatContext(context: any) {
  return {
    url: context.url,
    title: context.title,
    inputs: context.inputs?.slice(0, 5),
    buttons: context.buttons?.slice(0, 5),
    links: context.links?.slice(0, 10),
    headings: context.headings?.slice(0, 5),
  };
}

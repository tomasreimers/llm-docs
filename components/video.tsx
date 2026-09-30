export function Video({ src, title }: { src: string, title: string }) {
  return <iframe className="mt-6 w-full aspect-video" src={src} title={title} frameBorder={0} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen></iframe>;
}
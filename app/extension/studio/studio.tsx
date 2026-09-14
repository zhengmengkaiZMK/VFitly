"use client";

import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

type Account = { user: { email: string; membershipType: string; defaultModelImageUrl?: string }; credits: { balance: number } };
type Job = { id: string; status: string; resultImageUrl?: string; metadata?: { walkVideoUrl?: string } };
type Garment = { imageUrl: string; label?: string };

function safeUrl(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === "https:" && !url.username && !url.password && value.length <= 4096 && host.includes(".") && !host.endsWith(".local") && !host.endsWith(".localhost") && !host.includes(":") && !/^\d+(\.\d+){3}$/.test(host) ? url.href : "";
  } catch { return ""; }
}

async function request(path: string, init?: RequestInit) {
  const response = await fetch(path, { ...init, credentials: "same-origin", cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : `Request failed (${response.status}).`);
  return data;
}

export default function ExtensionStudio() {
  const [account, setAccount] = useState<Account | null>(null);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [product, setProduct] = useState("");
  const [garments, setGarments] = useState<Garment[]>([]);
  const [selected, setSelected] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [result, setResult] = useState<{ jobId: string; resultUrl: string } | null>(null);
  const [video, setVideo] = useState("");
  const running = useRef(false);
  const [confirmed, setConfirmed] = useState(false);

  async function refresh() {
    const data = await request("/api/me");
    setAccount(data);
    const history = await request("/api/try-on/jobs?pageSize=12");
    setJobs(Array.isArray(history.jobs) ? history.jobs : []);
  }

  useEffect(() => {
    const params = new URLSearchParams(location.hash.slice(1));
    const image = safeUrl(params.get("image") || "");
    if (image) { setGarments([{ imageUrl: image, label: (params.get("label") || "Product").slice(0, 160) }]); setSelected(image); }
    setProduct(safeUrl(params.get("product") || ""));
    refresh().catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load account.")).finally(() => setChecked(true));
  }, []);

  useEffect(() => {
    if (!busy) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);

  async function perform(label: string, action: () => Promise<void>) {
    if (running.current) return;
    running.current = true; setBusy(label); setError("");
    try { await action(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Operation failed. Do not automatically retry an uncertain generation; check history first."); }
    finally { running.current = false; setBusy(""); }
  }

  const button = "rounded-xl bg-emerald-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40";
  return <main className="mx-auto max-w-5xl px-6 py-12">
    <div className="mb-8 flex items-center justify-between"><div><p className="text-xs uppercase tracking-widest text-emerald-700">VFitly / Extension preview</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Your personal fitting room</h1></div><Link href="/" className="text-sm underline">Back to website</Link></div>
    <p className="mb-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">This preview uses your existing website account and credits. Keep this tab open during generation. Closing the tab or a network interruption may leave the result uncertain; check history before retrying. Only select images you have permission to use.</p>
    {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
    {!checked ? <p>Loading account…</p> : !account ? <div className="rounded-2xl border p-8"><h2 className="mb-3 text-xl font-semibold">Use your existing VFitly account</h2><p className="mb-5 text-sm">Login stays on the official website. Your password and session are never copied into the extension.</p><button className={button} onClick={() => void signIn(undefined, { callbackUrl: window.location.href })}>Sign in to VFitly</button></div> : <>
      <div className="mb-7 flex flex-wrap items-center gap-4 rounded-2xl border p-5"><span>{account.user.email}</span><span className="text-sm">{account.user.membershipType} · {account.credits.balance} credits</span><a href="/pricing" className="ml-auto text-sm underline">Manage plan</a></div>
      <div className="grid gap-8 md:grid-cols-2"><section className="space-y-5 rounded-2xl border p-6"><h2 className="text-xl font-semibold">1. Choose your product</h2><label className="block text-sm">Product page URL<input className="mt-2 w-full rounded-lg border p-3" value={product} onChange={(event) => setProduct(event.target.value)} placeholder="https://store.com/product" disabled={!!busy} /></label><button className={button} disabled={!!busy || !safeUrl(product)} onClick={() => void perform("Extracting product images…", async () => {
        const data = await request("/api/product-try-on/extract", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productUrl: safeUrl(product) }) });
        const items: Garment[] = Array.isArray(data.garments) ? data.garments.filter((item: Garment) => safeUrl(item.imageUrl || "")) : [];
        setGarments(items); setSelected("");
        if (!items.length) throw new Error("No supported product images found. Select an image using the extension instead.");
      })}>Extract images</button><p className="text-xs text-gray-500">Link extraction follows the website preview allowance.</p><div className="grid grid-cols-2 gap-3">{garments.map((item) => <button key={item.imageUrl} disabled={!!busy} aria-pressed={selected === item.imageUrl} onClick={() => setSelected(item.imageUrl)} className={`overflow-hidden rounded-xl border-2 p-2 ${selected === item.imageUrl ? "border-emerald-700" : "border-transparent"}`}><Image unoptimized width={640} height={960} src={item.imageUrl}  referrerPolicy="no-referrer" className="h-48 w-full object-contain" alt="VFitly，AI virtual try-on，generate try-on image and try-on video" /></button>)}</div></section>
      <section className="space-y-5 rounded-2xl border p-6"><h2 className="text-xl font-semibold">2. Add your full-body photo</h2>{account.user.defaultModelImageUrl && <Image unoptimized width={640} height={960} src={account.user.defaultModelImageUrl} referrerPolicy="no-referrer"  className="h-56 w-full rounded-xl object-contain" alt="VFitly，AI virtual try-on，generate try-on image and try-on video" />}<label className="block text-sm">{account.user.defaultModelImageUrl ? "Use a different photo for this generation" : "Upload a full-body photo"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={!!busy} className="mt-3 block w-full text-sm" onChange={(event) => { const file = event.target.files?.[0] || null; if (file && (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024)) { setError("Choose a JPEG, PNG or WebP photo under 10 MB."); event.target.value = ""; setPhoto(null); return; } setPhoto(file); }} /></label><p className="text-xs text-gray-500">Photos are sent only when you generate. If you have no saved photo, the website saves this as your default photo. Storage and retention follow the website policy.</p><label className="flex gap-3 text-sm"><input type="checkbox" checked={confirmed} disabled={!!busy} onChange={(event) => setConfirmed(event.target.checked)} />I agree to upload these images and use my website credits. Product-link generation requires Plus or Ultra; the existing website rules apply.</label><button className={button} disabled={!!busy || !selected || !confirmed || (!photo && !account.user.defaultModelImageUrl) || account.user.membershipType === "FREE"} onClick={() => void perform("Generating your try-on image. Keep this tab open…", async () => {
        setResult(null); setVideo("");
        const body = new FormData(); body.set("garments", JSON.stringify([{ imageUrl: selected, label: "Extension selection" }])); if (photo) body.set("personImage", photo);
        const data = await request("/api/product-try-on/generate", { method: "POST", body });
        const generated = data.results?.[0];
        if (generated?.status !== "success") throw new Error(generated?.error || "Generation failed. Check history before retrying.");
        setResult(generated); await refresh();
      })}>Generate try-on</button></section></div>
      {busy && <p role="status" aria-live="polite" className="my-6 rounded-xl bg-emerald-50 p-5">{busy}</p>}
      {result && <section className="my-8 space-y-5 rounded-2xl border p-6"><h2 className="text-xl font-semibold">Your new look</h2><Image unoptimized width={640} height={960} src={result.resultUrl}  className="max-h-[580px] w-full object-contain" alt="VFitly，AI virtual try-on，generate try-on image and try-on video" /><a href={result.resultUrl} target="_blank" rel="noopener noreferrer" className="mr-5 underline">Open image / save</a><button className={button} disabled={!!busy || !!video} onClick={() => { if (!window.confirm("Generate a video using your website video allowance? Keep this tab open until it finishes.")) return; void perform("Generating video. This can take several minutes…", async () => { const data = await request("/api/try-on/walk-video", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId: result.jobId }) }); setVideo(data.videoUrl); await refresh(); }); }}>Generate walking video</button>{video && <video src={video} controls className="max-h-[580px] w-full" />}</section>}
      <section className="mt-10"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">Recent website history</h2><button className="text-sm underline" disabled={!!busy} onClick={() => void perform("Refreshing history…", refresh)}>Refresh history</button></div><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{jobs.map((job) => <article key={job.id} className="rounded-xl border p-3">{job.resultImageUrl && <a href={job.resultImageUrl} target="_blank" rel="noopener noreferrer"><Image unoptimized width={640} height={960} src={job.resultImageUrl}  loading="lazy" className="h-48 w-full object-contain" alt="VFitly，AI virtual try-on，generate try-on image and try-on video" /></a>}<p className="mt-2 text-xs">{job.status}</p>{job.metadata?.walkVideoUrl && <a className="text-sm underline" href={job.metadata.walkVideoUrl} target="_blank" rel="noopener noreferrer">Open video</a>}</article>)}</div>{!jobs.length && <p className="text-sm text-gray-500">No previous jobs yet.</p>}</section>
    </>}
  </main>;
}

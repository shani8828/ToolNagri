import ToolLayout from "@/components/ToolLayout";
import MediaDownloader from "@/components/MediaDownloader";
import { isResolverConfigured } from "@/lib/media/resolver";

/**
 * Server component so the resolver's availability is known at render time and
 * the page can say so honestly, rather than letting the visitor paste a link
 * and wait for a failure.
 */
export default function InstagramReelDownloaderPage() {
  const available = isResolverConfigured();

  const howToUse = [
    "Open the reel in Instagram, tap the share icon and choose \"Copy link\".",
    "Paste the link into the box above — or press the paste button to pull it from your clipboard.",
    "Press Get video. The reel is fetched and its available files are listed.",
    "Pick the quality you want and press it to save the file to your device.",
  ];

  const benefits = [
    "Downloads reels, video posts and IGTV in the highest quality the post offers.",
    "No watermark added to the file, and no account or app install needed.",
    "Works on phones, tablets and desktop — the file saves straight to your downloads.",
    "Tracking parameters in the link are stripped before the request is made.",
    "Nothing you download is stored on our servers.",
  ];

  const faqs = [
    {
      question: "Can I download private Instagram reels?",
      answer:
        "No. Only public posts can be fetched. If an account is private, or the post has been deleted or restricted, there is no way for this tool — or any other — to reach it without logging in as someone who has access.",
    },
    {
      question: "Is the downloaded video watermarked?",
      answer:
        "No watermark is added by this tool. If the creator burned a watermark into the video themselves, it stays part of the footage.",
    },
    {
      question: "Am I allowed to download someone else's reel?",
      answer:
        "Saving a public video for your own personal viewing is generally accepted, but the video remains the creator's copyrighted work. Reposting, monetising or editing it without permission can infringe their rights and breach Instagram's terms. Get permission, or stick to your own content.",
    },
    {
      question: "Does this work on mobile?",
      answer:
        "Yes. Copy the reel link from the Instagram app's share sheet, paste it here in your mobile browser and the file saves to your device like any other download.",
    },
    {
      question: "Why did my link fail?",
      answer:
        "The usual causes are a private account, a deleted post, or a link to a profile rather than a specific reel. Make sure the URL contains /reel/, /p/ or /tv/ and that you can open it in a logged-out browser.",
    },
  ];

  return (
    <ToolLayout
      title="Instagram Reel Downloader"
      description="Paste a public Instagram reel link and save the video in the best quality available. No watermark, no signup and no app to install."
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
    >
      <MediaDownloader platform="instagram" available={available} />
    </ToolLayout>
  );
}

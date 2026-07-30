import ToolLayout from "@/components/ToolLayout";
import MediaDownloader from "@/components/MediaDownloader";
import { isResolverConfigured } from "@/lib/media/resolver";

export default function FacebookReelDownloaderPage() {
  const available = isResolverConfigured();

  const howToUse = [
    "Open the reel or video on Facebook and copy its link from the share menu.",
    "Paste the link above, or press the paste button to pull it from your clipboard.",
    "Press Get video to fetch the available files.",
    "Choose a quality and press it to save the video to your device.",
  ];

  const benefits = [
    "Handles reels, page videos, watch links and fb.watch short links.",
    "Saves in the best quality the original post provides, with no added watermark.",
    "No Facebook account, browser extension or app install required.",
    "Tracking parameters such as fbclid are removed before the request is made.",
    "Nothing you download is stored on our servers.",
  ];

  const faqs = [
    {
      question: "Which Facebook links are supported?",
      answer:
        "Public reels (facebook.com/reel/…), page and profile videos (facebook.com/name/videos/…), watch links and fb.watch short links. The post has to be visible without logging in.",
    },
    {
      question: "Can I download private or friends-only videos?",
      answer:
        "No. If a video is restricted to friends, a private group or a specific audience, it cannot be fetched. Only content Facebook serves publicly is reachable.",
    },
    {
      question: "Why does fb.watch sometimes fail?",
      answer:
        "fb.watch links are short redirects, and some expire or point at content that has since been restricted. Open the link in your browser first, then copy the full facebook.com URL it lands on and use that instead.",
    },
    {
      question: "Is downloading Facebook videos legal?",
      answer:
        "Saving a public video for personal offline viewing is widely treated as acceptable, but the video stays the copyright of whoever made it. Republishing or monetising it without permission can infringe their rights and breaches Facebook's terms. Download your own content, or get the creator's permission.",
    },
    {
      question: "Does it work on mobile?",
      answer:
        "Yes. Use the Facebook app's share sheet to copy the link, paste it here in your mobile browser, and the video saves to your device.",
    },
  ];

  return (
    <ToolLayout
      title="Facebook Reel Downloader"
      description="Paste a public Facebook reel or video link and save it in the best quality available. No watermark, no signup and no extension required."
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
    >
      <MediaDownloader platform="facebook" available={available} />
    </ToolLayout>
  );
}

"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Download, RefreshCw, AlertCircle, Info, MapPin, EyeOff } from "lucide-react";
import confetti from "canvas-confetti";

interface ExifMetadata {
  make?: string;
  model?: string;
  dateTime?: string;
  software?: string;
  exposureTime?: string;
  fNumber?: string;
  iso?: string;
  focalLength?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
}

export default function ExifViewer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [metadata, setMetadata] = useState<ExifMetadata | null>(null);
  const [hasCheckedMetadata, setHasCheckedMetadata] = useState(false);
  
  const [convertedSrc, setConvertedSrc] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setConvertedSrc(null);
    setConvertedSize(0);
    setMetadata(null);
    setHasCheckedMetadata(false);

    // Read preview
    const previewReader = new FileReader();
    previewReader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
      }
    };
    previewReader.readAsDataURL(file);

    // Read array buffer to parse EXIF binary tags
    const binaryReader = new FileReader();
    binaryReader.onload = (event) => {
      if (event.target?.result) {
        try {
          const buffer = event.target.result as ArrayBuffer;
          const parsed = getExifTags(buffer);
          setMetadata(parsed);
        } catch (err) {
          console.warn("Exif parsing error:", err);
          setMetadata(null);
        }
        setHasCheckedMetadata(true);
      }
    };
    binaryReader.readAsArrayBuffer(file);
  };

  const handleStripMetadata = () => {
    if (!imageSrc) return;

    setLoading(true);
    setError("");

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Failed to create canvas drawing context.");
        setLoading(false);
        return;
      }

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // Re-exporting as the original format strips EXIF headers automatically
      const format = fileName.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";

      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            setError("Failed to compile image blob.");
            setLoading(false);
            return;
          }
          const url = URL.createObjectURL(blob);
          setConvertedSrc(url);
          setConvertedSize(blob.size);
          setLoading(false);

          confetti({
            particleCount: 50,
            spread: 40,
            origin: { y: 0.7 },
            colors: ["#2563eb", "#22c55e"],
          });
        }, format);
      } catch (err) {
        console.error(err);
        setError("Your browser does not support metadata stripping for this format.");
        setLoading(false);
      }
    };
    img.onerror = () => {
      setError("Failed to process source image.");
      setLoading(false);
    };
  };

  const handleReset = () => {
    setImageSrc(null);
    setFileName("");
    setFileSize(0);
    setMetadata(null);
    setHasCheckedMetadata(false);
    setConvertedSrc(null);
    setConvertedSize(0);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Custom binary TIFF/EXIF parser
  const getExifTags = (buffer: ArrayBuffer): ExifMetadata | null => {
    const view = new DataView(buffer);
    if (view.byteLength < 2 || view.getUint16(0) !== 0xFFD8) {
      return null; // Not a JPEG SOI marker
    }

    let offset = 2;
    const length = view.byteLength;

    while (offset < length - 2) {
      const marker = view.getUint16(offset);
      if (marker === 0xFFE1) { // APP1 segment
        const segmentLength = view.getUint16(offset + 2);
        // check for "Exif" header (0x45786966)
        if (view.getUint32(offset + 4) === 0x45786966) {
          return parseTiffData(view, offset + 10, segmentLength - 8);
        }
        break;
      }
      offset += 2 + view.getUint16(offset + 2);
    }
    return null;
  };

  const parseTiffData = (view: DataView, tiffOffset: number, segmentLength: number): ExifMetadata | null => {
    const isLittle = view.getUint16(tiffOffset) === 0x4949; // "II" vs "MM"
    if (view.getUint16(tiffOffset + 2, isLittle) !== 0x002A) {
      return null; // Invalid TIFF signature
    }

    const firstIFDOffset = view.getUint32(tiffOffset + 4, isLittle);
    if (firstIFDOffset >= segmentLength) return null;

    return readIFD(view, tiffOffset, tiffOffset + firstIFDOffset, isLittle);
  };

  const readIFD = (view: DataView, tiffOffset: number, ifdOffset: number, isLittle: boolean): ExifMetadata => {
    const numEntries = view.getUint16(ifdOffset, isLittle);
    const metadata: ExifMetadata = {};
    let gpsOffset = 0;

    for (let i = 0; i < numEntries; i++) {
      const entryOffset = ifdOffset + 2 + i * 12;
      const tag = view.getUint16(entryOffset, isLittle);
      const type = view.getUint16(entryOffset + 2, isLittle);
      const count = view.getUint32(entryOffset + 4, isLittle);
      const valueOffset = view.getUint32(entryOffset + 8, isLittle) + tiffOffset;

      let val: any = undefined;
      if (type === 2) { // ASCII string
        const offset = view.getUint32(entryOffset + 8, isLittle) + tiffOffset;
        const chars = [];
        for (let j = 0; j < count - 1; j++) {
          chars.push(String.fromCharCode(view.getUint8(offset + j)));
        }
        val = chars.join("").trim();
      } else if (type === 3) { // SHORT
        val = view.getUint16(entryOffset + 8, isLittle);
      } else if (type === 4) { // LONG
        val = view.getUint32(entryOffset + 8, isLittle);
      } else if (type === 5 || type === 10) { // RATIONAL or SRATIONAL
        const offset = view.getUint32(entryOffset + 8, isLittle) + tiffOffset;
        const num = view.getUint32(offset, isLittle);
        const den = view.getUint32(offset + 4, isLittle);
        val = den === 0 ? num : parseFloat((num / den).toFixed(3));
      }

      if (tag === 0x010F) metadata.make = val;
      else if (tag === 0x0110) metadata.model = val;
      else if (tag === 0x0132) metadata.dateTime = val;
      else if (tag === 0x0131) metadata.software = val;
      else if (tag === 0x829A) metadata.exposureTime = `1/${Math.round(1 / val)}s`;
      else if (tag === 0x829D) metadata.fNumber = `f/${val}`;
      else if (tag === 0x8827) metadata.iso = val?.toString();
      else if (tag === 0x920A) metadata.focalLength = `${val}mm`;
      else if (tag === 0x8825) {
        gpsOffset = view.getUint32(entryOffset + 8, isLittle) + tiffOffset;
      }
    }

    if (gpsOffset > 0) {
      try {
        const gpsData = readGPSInfo(view, tiffOffset, gpsOffset, isLittle);
        if (gpsData.lat !== undefined && gpsData.lon !== undefined) {
          metadata.gpsLatitude = gpsData.lat;
          metadata.gpsLongitude = gpsData.lon;
        }
      } catch (e) {}
    }

    return metadata;
  };

  const readGPSInfo = (view: DataView, tiffOffset: number, gpsOffset: number, isLittle: boolean) => {
    const numEntries = view.getUint16(gpsOffset, isLittle);
    let latRef = "N";
    let lonRef = "E";
    let latDegrees: number[] = [];
    let lonDegrees: number[] = [];

    for (let i = 0; i < numEntries; i++) {
      const entryOffset = gpsOffset + 2 + i * 12;
      const tag = view.getUint16(entryOffset, isLittle);
      const valueOffset = view.getUint32(entryOffset + 8, isLittle) + tiffOffset;

      if (tag === 1) {
        latRef = String.fromCharCode(view.getUint8(entryOffset + 8));
      } else if (tag === 2) {
        latDegrees = readRationalArray(view, valueOffset, 3, isLittle);
      } else if (tag === 3) {
        lonRef = String.fromCharCode(view.getUint8(entryOffset + 8));
      } else if (tag === 4) {
        lonDegrees = readRationalArray(view, valueOffset, 3, isLittle);
      }
    }

    let lat: number | undefined = undefined;
    let lon: number | undefined = undefined;

    if (latDegrees.length === 3) {
      lat = latDegrees[0] + latDegrees[1] / 60 + latDegrees[2] / 3600;
      if (latRef === "S") lat = -lat;
    }
    if (lonDegrees.length === 3) {
      lon = lonDegrees[0] + lonDegrees[1] / 60 + lonDegrees[2] / 3600;
      if (lonRef === "W") lon = -lon;
    }

    return { lat, lon };
  };

  const readRationalArray = (view: DataView, offset: number, count: number, isLittle: boolean): number[] => {
    const vals = [];
    for (let i = 0; i < count; i++) {
      const num = view.getUint32(offset + i * 8, isLittle);
      const den = view.getUint32(offset + i * 8 + 4, isLittle);
      vals.push(den === 0 ? num : num / den);
    }
    return vals;
  };

  const howToUse = [
    "Select or drop a photo taken by a smartphone or camera into the upload container.",
    "The EXIF metadata is parsed client-side instantly.",
    "Review camera settings, software version, capture date, and GPS coordinates.",
    "If coordinates are detected, examine the photo's approximate capture location on the interactive map.",
    "Click Strip Metadata & Download to save a secure, metadata-free version of your photo."
  ];

  const benefits = [
    "Protects your location privacy by stripping GPS metadata before sharing online.",
    "100% Client-Side processing: Photos never upload to a third-party server.",
    "Decodes detailed camera telemetry (ISO, Exposure, F-stop, Focal length) natively.",
    "Displays visual, interactive coordinates map overlays with no API keys."
  ];

  const faqs = [
    {
      question: "What is EXIF metadata?",
      answer: "Exchangeable Image File Format (EXIF) is a standard that specifies the formats for images and sound taken by digital devices. It embeds camera settings, dates, and sometimes GPS location coordinates directly inside the image file."
    },
    {
      question: "Why doesn't my image show EXIF data?",
      answer: "Screenshots, web assets, and edited files usually lack EXIF data because their creation programs do not populate camera tags, or social networks (like Facebook and WhatsApp) automatically strip them to protect privacy before posting."
    }
  ];

  const relatedTools = [
    { name: "Image Resizer", url: "/image-resizer", description: "Crop and resize image dimensions." },
    { name: "Universal Image Converter", url: "/image-converter", description: "Convert between image formats." }
  ];

  // Helper to determine if metadata object is empty
  const hasMetadataValues = (meta: ExifMetadata | null): boolean => {
    if (!meta) return false;
    return !!(meta.make || meta.model || meta.dateTime || meta.software || meta.exposureTime || meta.fNumber || meta.iso || meta.gpsLatitude);
  };

  return (
    <ToolLayout
      title="EXIF Viewer & Stripper"
      description="Inspect image binary EXIF headers locally in your browser. View camera maker, lens metrics, date taken, and GPS locations on an interactive map. Strip all metadata to secure your privacy."
      category="Image Tools"
      categoryUrl="/#image"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Upload Block */}
        {!imageSrc ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border-color hover:border-accent rounded-2xl p-12 text-center bg-secondary-bg/30 hover:bg-hover-bg/30 cursor-pointer transition-all duration-200"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/jpg"
              className="hidden"
            />
            <Upload className="h-10 w-10 text-secondary-text/60 mx-auto mb-4" />
            <p className="font-heading font-semibold text-primary-text text-base">
              Upload JPEG Photo
            </p>
            <p className="text-xs text-secondary-text mt-1.5">
              Read and strip EXIF blocks. Works 100% locally in your browser.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Photo Preview Container */}
              <div className="border border-border-color rounded-2xl p-4 bg-secondary-bg/30 flex flex-col items-center justify-center">
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider mb-2 self-start">
                  Uploaded Photo Preview
                </span>
                <div className="relative border border-border-color bg-white rounded-lg overflow-hidden max-h-75 flex items-center justify-center select-none w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt="Loaded file"
                    className="max-h-75 w-auto object-contain"
                  />
                </div>
                <div className="mt-3 text-center w-full">
                  <p className="text-xs text-secondary-text font-semibold truncate px-2">{fileName}</p>
                  <p className="text-[10px] text-secondary-text mt-0.5 font-mono">Size: {formatSize(fileSize)}</p>
                </div>
              </div>

              {/* EXIF Metadata Card */}
              <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-75">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5 font-heading">
                    <Info className="h-4 w-4 text-accent" />
                    Embedded Metadata
                  </span>

                  {!hasCheckedMetadata ? (
                    <div className="text-xs text-secondary-text animate-pulse">Reading EXIF binary blocks...</div>
                  ) : hasMetadataValues(metadata) ? (
                    <div className="space-y-3 text-sm">
                      {metadata?.make && (
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-secondary-text text-xs">Manufacturer</span>
                          <span className="font-semibold text-primary-text text-right">{metadata.make}</span>
                        </div>
                      )}
                      {metadata?.model && (
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-secondary-text text-xs">Camera Model</span>
                          <span className="font-semibold text-primary-text text-right">{metadata.model}</span>
                        </div>
                      )}
                      {metadata?.dateTime && (
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-secondary-text text-xs">Date Taken</span>
                          <span className="font-semibold text-primary-text text-right font-mono text-xs">{metadata.dateTime}</span>
                        </div>
                      )}
                      {metadata?.exposureTime && (
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-secondary-text text-xs">Exposure Time</span>
                          <span className="font-semibold text-primary-text font-mono text-xs">{metadata.exposureTime}</span>
                        </div>
                      )}
                      {metadata?.fNumber && (
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-secondary-text text-xs">Aperture</span>
                          <span className="font-semibold text-primary-text font-mono text-xs">{metadata.fNumber}</span>
                        </div>
                      )}
                      {metadata?.iso && (
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-secondary-text text-xs">ISO Speed</span>
                          <span className="font-semibold text-primary-text font-mono text-xs">{metadata.iso}</span>
                        </div>
                      )}
                      {metadata?.focalLength && (
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-secondary-text text-xs">Focal Length</span>
                          <span className="font-semibold text-primary-text font-mono text-xs">{metadata.focalLength}</span>
                        </div>
                      )}
                      {metadata?.software && (
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-secondary-text text-xs">Creator Software</span>
                          <span className="font-semibold text-primary-text text-right truncate max-w-[50%]" title={metadata.software}>{metadata.software}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center space-y-2">
                      <EyeOff className="h-7 w-7 text-secondary-text/40 mx-auto" />
                      <p className="text-xs text-secondary-text font-semibold">No EXIF tags detected</p>
                      <p className="text-[10px] text-secondary-text/80 px-2 leading-relaxed">
                        This JPEG has no embedded EXIF metadata (camera specs, GPS, or dates).
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* GPS Coordinates Map Overlay */}
              <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-75">
                <div className="space-y-3 w-full h-full flex flex-col">
                  <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5 font-heading">
                    <MapPin className="h-4 w-4 text-accent" />
                    GPS Location
                  </span>

                  {metadata?.gpsLatitude && metadata?.gpsLongitude ? (
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div className="text-[10px] font-mono text-secondary-text font-semibold bg-secondary-bg p-1.5 rounded text-center">
                        GPS: {metadata.gpsLatitude.toFixed(5)}, {metadata.gpsLongitude.toFixed(5)}
                      </div>
                      <div className="w-full flex-1 min-h-40 rounded-lg overflow-hidden border border-border-color shadow-xs relative">
                        <iframe
                          title="Capture Geolocation Map"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          scrolling="no"
                          marginHeight={0}
                          marginWidth={0}
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${metadata.gpsLongitude - 0.01}%2C${metadata.gpsLatitude - 0.01}%2C${metadata.gpsLongitude + 0.01}%2C${metadata.gpsLatitude + 0.01}&layer=mapnik&marker=${metadata.gpsLatitude}%2C${metadata.gpsLongitude}`}
                          className="filter contrast-95 opacity-90 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-2">
                      <MapPin className="h-7 w-7 text-secondary-text/30" />
                      <p className="text-xs text-secondary-text font-semibold">No GPS coordinates</p>
                      <p className="text-[10px] text-secondary-text/80 px-2 leading-relaxed">
                        This photo does not contain geo-location tagging logs.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Error feedback */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleStripMetadata}
                disabled={loading}
                className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Stripping..." : "Strip EXIF Metadata"}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                title="Upload another file"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>

            {/* Output Download */}
            {convertedSrc && (
              <div className="pt-5 space-y-4 flex flex-col items-center bg-success/5 p-4 rounded-xl border border-success/20 animate-fade-in">
                <div className="text-sm font-semibold text-primary-text flex flex-wrap justify-center items-center gap-2">
                  Metadata stripped successfully! Clean Size: <span className="text-success font-bold">{formatSize(convertedSize)}</span>
                  <span className="text-xs text-secondary-text font-normal">
                    ({Math.round(((convertedSize - fileSize) / fileSize) * 100)}% size change)
                  </span>
                </div>

                <a
                  href={convertedSrc}
                  download={`clean_${fileName}`}
                  className="flex items-center gap-1.5 px-6 py-3 bg-success hover:bg-success/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="h-4.5 w-4.5" /> Download Clean Image
                </a>
              </div>
            )}

          </div>
        )}

      </div>
    </ToolLayout>
  );
}

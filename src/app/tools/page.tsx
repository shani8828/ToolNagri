import { permanentRedirect } from "next/navigation";

/**
 * /tools has no content of its own - /all-tools is the directory. A 308 keeps
 * the two from competing and passes any link equity to the canonical version.
 */
export default function ToolsIndex(): never {
  permanentRedirect("/all-tools");
}

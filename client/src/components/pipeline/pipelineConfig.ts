export type StageId =
  | "hero"
  | "github"
  | "actions"
  | "build"
  | "s3"
  | "cloudfront"
  | "production";

export interface StageConfig {
  id: StageId;
  nodeType: "git" | "runner" | "build" | "storage" | "cdn" | "production";
  nodeX: number;
  eyebrow: string;
  title: string;
  accent: string;
  copy: string;
  evidence: EvidenceConfig;
}

export interface EvidenceConfig {
  system: string;
  lines: EvidenceLine[];
}

export interface EvidenceLine {
  prefix: string;
  text: string;
  type: "cmd" | "info" | "success" | "url" | "dim";
}

export const PIPELINE_STAGES: readonly StageConfig[] = [
  {
    id: "hero",
    nodeType: "git",
    nodeX: 720,
    eyebrow: "Mini Vercel",
    title: "Push once.",
    accent: "Watch it ship.",
    copy: "A single git push becomes a live global deployment.",
    evidence: {
      system: "Terminal",
      lines: [{ prefix: "$", text: "git push origin main", type: "cmd" }],
    },
  },
  {
    id: "github",
    nodeType: "git",
    nodeX: 1060,
    eyebrow: "01 / GitHub Webhook",
    title: "GitHub receives",
    accent: "the push.",
    copy: "The repository accepts the commit and verifies the webhook signature.",
    evidence: {
      system: "GitHub",
      lines: [
        { prefix: ">", text: "POST /webhooks/github push", type: "info" },
        { prefix: ">", text: "branch: main sha:a3f91c2", type: "dim" },
        { prefix: "+", text: "x-hub-signature verified", type: "success" },
        { prefix: ">", text: "dispatch workflow deploy.yml", type: "info" },
      ],
    },
  },
  {
    id: "actions",
    nodeType: "runner",
    nodeX: 300,
    eyebrow: "02 / GitHub Actions",
    title: "Actions wakes",
    accent: "the runners.",
    copy: "A clean runner starts the checks that decide whether this release can move forward.",
    evidence: {
      system: "GitHub Actions",
      lines: [
        { prefix: ">", text: "allocating runner ubuntu-24.04", type: "info" },
        { prefix: ">", text: "matrix: node=20 region=us-east-1", type: "dim" },
        { prefix: "+", text: "lint passed 0 errors", type: "success" },
        { prefix: "+", text: "tests passed 42/42", type: "success" },
        { prefix: ">", text: "build job dispatched", type: "info" },
      ],
    },
  },
  {
    id: "build",
    nodeType: "build",
    nodeX: 980,
    eyebrow: "03 / Build",
    title: "The build forms",
    accent: "the artifact.",
    copy: "Dependencies resolve, modules transform, and the deployable bundle takes shape.",
    evidence: {
      system: "Build",
      lines: [
        { prefix: "$", text: "npm ci --prefer-offline", type: "cmd" },
        { prefix: ">", text: "resolved 847 packages", type: "dim" },
        { prefix: ">", text: "transforming 126 modules", type: "info" },
        { prefix: ">", text: "rendering chunks and assets", type: "info" },
        { prefix: "+", text: "dist ready 2.1 MB", type: "success" },
      ],
    },
  },
  {
    id: "s3",
    nodeType: "storage",
    nodeX: 260,
    eyebrow: "04 / S3 Upload",
    title: "Assets land",
    accent: "in S3.",
    copy: "The immutable bundle is uploaded to the origin bucket without interrupting production.",
    evidence: {
      system: "S3",
      lines: [
        { prefix: "$", text: "aws s3 sync dist/ s3://mini-vercel-prod", type: "cmd" },
        { prefix: ">", text: "upload: index.html", type: "info" },
        { prefix: ">", text: "upload: assets/index.js 100%", type: "info" },
        { prefix: ">", text: "312 objects scanned", type: "dim" },
        { prefix: "+", text: "sync complete us-east-1", type: "success" },
      ],
    },
  },
  {
    id: "cloudfront",
    nodeType: "cdn",
    nodeX: 1120,
    eyebrow: "05 / CloudFront",
    title: "CloudFront carries",
    accent: "it worldwide.",
    copy: "The edge cache invalidates and the new release propagates across the global CDN.",
    evidence: {
      system: "CloudFront",
      lines: [
        { prefix: "$", text: "aws cloudfront create-invalidation --paths /*", type: "cmd" },
        { prefix: ">", text: "invalidation I2J8QK accepted", type: "info" },
        { prefix: ">", text: "warming iad, fra, sin, syd", type: "dim" },
        { prefix: "+", text: "edge propagation complete", type: "success" },
      ],
    },
  },
  {
    id: "production",
    nodeType: "production",
    nodeX: 720,
    eyebrow: "06 / Production",
    title: "Your app is",
    accent: "live.",
    copy: "HTTPS is active, the CDN is warm, and the deployment has reached the world.",
    evidence: {
      system: "Production",
      lines: [
        { prefix: ">", text: "GET / 200 OK", type: "success" },
        { prefix: "+", text: "SSL active TLS 1.3", type: "success" },
        { prefix: ">", text: "cdn-cache: HIT latency 43ms", type: "info" },
        { prefix: "+", text: "https://your-app.cloudfront.net", type: "url" },
      ],
    },
  },
] as const;

export const NODE_R_PRIMARY = 7;
export const NODE_R_SECONDARY = 5;

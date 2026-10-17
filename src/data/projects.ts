export type Install =
  | { kind: 'link'; label: string; href: string }
  | { kind: 'copy'; label: string; command: string }
  | { kind: 'pending'; label: string };

export interface Project {
  name: string;
  logo: string;
  platform: string;
  github?: string;
  install: Install[];
  stack: string[];
  description: string;
  status?: string;
}

// Newest first: the order I started building them in.
export const projects: Project[] = [
  {
    name: 'herdr-sheepdog',
    logo: '/projects/herdr-sheepdog.png?v=2',
    platform: 'macOS · Linux · iOS',
    github: 'https://github.com/kccarlos/herdr-sheepdog',
    install: [
      { kind: 'copy', label: 'herdr plugin', command: 'herdr plugin install kccarlos/herdr-sheepdog' },
      { kind: 'copy', label: 'brew install', command: 'brew install kccarlos/tap/sheepdog' },
      { kind: 'link', label: 'iOS TestFlight', href: 'https://testflight.apple.com/join/bjCaFYgK' },
    ],
    stack: ['Go', 'Swift', 'JavaScript'],
    description: 'Manage your herdr coding agents by voice, hands-free: hear who is stuck, approve with a word, ask what broke. A voice-first agent harness with an iPhone companion app.',
  },
  {
    name: 'KVoice',
    logo: '/projects/kvoice.png',
    platform: 'macOS 15+',
    github: 'https://github.com/kccarlos/kvoice',
    install: [
      { kind: 'copy', label: 'brew install', command: 'brew install --cask kccarlos/tap/kvoice' },
      { kind: 'link', label: 'Download DMG', href: 'https://github.com/kccarlos/kvoice/releases/latest' },
    ],
    stack: ['Swift', 'SwiftUI', 'Core ML'],
    description:
      'Hold a hotkey, speak, and get finished text in any Mac app. Private on-device speech-to-text (Whisper, Parakeet, Apple Speech) with optional AI actions.',
  },
  {
    name: 'forumind',
    logo: '/projects/forumind.png',
    platform: 'iOS · iPadOS',
    github: 'https://github.com/kccarlos/forumind',
    // When the TestFlight link is ready, add { kind: 'link', label: 'TestFlight', href: '…' }.
    // Once approved, replace the pending item with the App Store link.
    install: [{ kind: 'pending', label: 'App Store: review in progress' }],
    stack: ['Swift', 'SwiftUI', 'Foundation Models', 'CloudKit'],
    description:
      'An AI reading companion for Discourse forums: summaries, chat, and "Ask the forum" answers with sources.',
  },
  {
    name: 'DiscourseCopilot',
    logo: '/projects/discoursecopilot.png',
    platform: 'Chrome',
    github: 'https://github.com/kccarlos/DiscourseCopilot',
    install: [
      {
        kind: 'link',
        label: 'Chrome Web Store',
        href: 'https://chromewebstore.google.com/detail/discoursecopilot/dpngnaiiofobfjleabbhnfmdflddnhac',
      },
    ],
    stack: ['JavaScript', 'Manifest V3'],
    description:
      'AI summaries, follow-up chat and a cited research copilot for any Discourse forum, in a Chrome side panel. Bring your own AI provider.',
  },
  {
    name: 'delphicourier',
    logo: '/projects/delphicourier.png',
    platform: 'MCP server · Node 22+',
    github: 'https://github.com/kccarlos/delphicourier',
    install: [{ kind: 'copy', label: 'npx', command: 'npx -y delphicourier' }],
    stack: ['TypeScript', 'MCP'],
    description: 'Lets a coding agent delegate hard queries to more powerful models.',
  },
  {
    name: 'gitcontext',
    logo: '/projects/gitcontext.png',
    platform: 'Web · macOS · Windows · Linux',
    github: 'https://github.com/kccarlos/gitcontext',
    install: [
      { kind: 'copy', label: 'brew install', command: 'brew install --cask kccarlos/tap/gitcontext' },
      { kind: 'link', label: 'Open web app', href: 'https://kccarlos.github.io/gitcontext/' },
      { kind: 'link', label: 'Download', href: 'https://github.com/kccarlos/gitcontext/releases/latest' },
    ],
    stack: ['TypeScript', 'React', 'Tauri'],
    description: 'Build the perfect context of your codebase for your AI chatbot.',
  },
];

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

export const projectGroups: { title: string; projects: Project[] }[] = [
  {
    title: '📱 Apps',
    projects: [
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
    ],
  },
  {
    title: '🧰 AI developer tools',
    projects: [
      {
        name: 'herdr-sheepdog',
        logo: '/projects/herdr-sheepdog.png',
        platform: 'CLI · iOS',
        install: [],
        stack: ['Go', 'Swift'],
        status: 'under construction',
        description: 'A voice supervisor for fleets of coding agents, with an iOS companion app.',
      },
      {
        name: 'gitcontext',
        logo: '/projects/gitcontext.png',
        platform: 'Web · macOS · Windows',
        github: 'https://github.com/kccarlos/gitcontext',
        install: [
          { kind: 'copy', label: 'brew install', command: 'brew install --cask kccarlos/tap/gitcontext' },
          { kind: 'link', label: 'Open web app', href: 'https://gitcontext.xyz/' },
          { kind: 'link', label: 'Download', href: 'https://github.com/kccarlos/gitcontext/releases/latest' },
        ],
        stack: ['TypeScript', 'React', 'Tauri'],
        description: 'Build the perfect context of your codebase for your AI chatbot.',
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
    ],
  },
];

---
title: Gemini 3.8 Live Remembers Exactly One Resume
date: 2026-10-06 21:00:00
description: "Resume a Gemini 3.8 Live session twice and the model wakes up with nothing but its system prompt. How I found it, the three wrong guesses on the way, and the other undocumented things I learned building a voice supervisor for coding agents."
category: AI-Engineering
tags:
- Gemini 3.8 Live
- Vertex AI
- Voice Agents
- Harness Engineering
- herdr
---

> **Context:** On September 15, 2026, Google [released Gemini 3.8 Live and 3.8 Live Extended Thinking](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-gemini-3-8-live-extended-thinking/). This post is what I learned from trying the new model in my own project. Everything here was run on **Vertex AI** (not AI Studio or the Gemini Developer API), with the standard `gemini-3.8-live` model rather than the Extended Thinking variant, so details like regions and auth may differ on other platforms.

**tl;dr:** A Gemini 3.8 Live session survives one resume. Say anything on the resumed connection, resume again, and the model comes back with its system prompt and whatever was said on the previous connection. Everything older is gone. Reproduced 9 times out of 9. **Resume once, then start fresh and re-seed.**

![Three Gemini 3.8 Live connections: the first resume keeps 5,191 tokens and 8 of 8 facts, the second drops to 167 tokens and 0 of 8](/uploads/gemini-live-resume/resume-chain.svg)

*Measured on Vertex AI, `us-central1`, `gemini-3.8-live`, Go SDK `google.golang.org/genai` v1.71.0, on 2026-10-03 and 2026-10-04. Platforms change; this one changed under me at least once already (more on that below).*

## What I'm building

For the last three weeks I've been building **sheepdog**: a voice supervisor for the coding agents I run in [herdr](https://github.com/herdrdev/herdr). I talk to my phone. It tells me what Claude Code and Codex are doing, reads out an agent's approval prompt when one gets stuck, takes my "yes, go ahead", and passes on new instructions. The whole point is to manage a handful of agents without touching a keyboard.

<div style="display:flex;gap:16px;align-items:flex-start;max-width:620px;margin:0 auto">
<img src="/uploads/gemini-live-resume/review-dark-conversation-approval.png" alt="Sheepdog conversation tab with an approval card for a git push" style="width:50%;min-width:0;margin:1.2rem 0">
<img src="/uploads/gemini-live-resume/review-light-flock.png" alt="Sheepdog flock tab listing agents and their state" style="width:50%;min-width:0;margin:1.2rem 0">
</div>

*The iOS companion. Left: an agent asks to force-push and the approval lands in the conversation. Right: the flock.*

It's also an experiment in how I work. sheepdog is about 230 commits old across its three repos, and coding agents wrote nearly all of them: one orchestrating Claude Code session that farms out work to sub-agents. I set direction, make the calls, and test on my phone. Most of the experiments in this post were written and run by those agents. The decisions, and the uncomfortable phone sessions, were mine.

Gemini 3.8 Live is sheepdog's ears and mouth. This post is about what I learned the hard way about it.

## A voice model is not a speaker

Day one, the Live model had seven tools that did things. Day two, I put on a headset, an agent hit a prompt, and **Gemini answered five of the agent's approval prompts by itself, `git apply` and `git add -p` among them, two while my mic was muted.** It had read "say yes and it will finish the commit" in a status update as a cue.

So I took the tools away. The voice model got two: hand my words to a slower text model (the "brain") and `stop`. The brain wrote the sentences; Gemini 3.8 Live was supposed to read them out.

It doesn't read. It's an LLM with ears. Every sentence it speaks is regenerated, so it paraphrased, cut things short, said "On it." instead of the answer, and sometimes handed the brain's answer *back to the brain* as if I'd said it. The last one has a simple cause: **mid-session, Live has no system role.** Any text you inject is either a user turn or a tool result. We were sending the brain's answers as user turns marked `[system event, not spoken by the user]`, and the model reasonably took them for requests.

We spent a while building detectors for this: word lists for "On it.", coverage thresholds for "did the user actually hear it", re-queues. That was the wrong direction. What fixed it was changing the channel. Answers now come back as **function responses**, including responses to calls the model never made (a fabricated id under an undeclared name `briefing`; Live accepts it). On a 70-runs-per-arm A/B, answers relayed back as my words went from 7 of 147 to 0 of 134.

![sheepdog's dual-brain design: Gemini 3.8 Live as the fast brain with no tool that acts, a text LLM as the slow brain that acts on herdr panes, briefings sent as function responses](/uploads/gemini-live-resume/dual-brain.svg)

That became the design we kept: Gemini 3.8 Live as a **fast brain** that gets facts instead of scripts and answers simple things itself, a slow brain that holds every action, and the detectors deleted. (The full story of how the voice model swung from operator to mouthpiece to something in between is the next post.)

There's a catch. Once the voice model answers from what it was told, **its memory matters.**

## Then it started forgetting

Gemini 3.8 Live connections don't last. About nine minutes in, the server sends a `GoAway`, and you reconnect with the latest session resumption handle. Done right, the conversation continues as if nothing happened.

The daemon logs `usageMetadata.promptTokenCount` on every turn. After resumes, it kept falling:

- 10,699 → 3,874 tokens
- 11,883 → 5,522
- 7,610 → **1,192**

Fewer tokens isn't automatically fewer facts. But in a phone session the voice told me an agent was "still analysing" after it had finished, and got "what did we talk about first?" wrong. I wanted to know.

## Wrong guess #1: the server compresses on resume

The obvious theory. So a Claude session wrote a ~200-line standalone client with the daemon's exact setup: generate 8 spoken facts with macOS `say` ("the blue key is in drawer seven"), stream them in at 16 kHz, resume, then ask about each one.

- Manual close, resume with the latest handle: **1,082 → 1,117 tokens.** The +35 is the probe question. 8 of 8 recalled.
- Wait for a real `GoAway` (it came at 541 s, with 30 s of warning): **1,510 → 1,541.** 8 of 8.
- `transparent` resumption on or off: no difference.

A clean client loses nothing. Two side findings from that afternoon:

- A new resumption handle arrives **after every completed turn**. Our own notes from day one said one arrived after setup and none after. Either we got it wrong or the platform changed. That's the reason this post comes with dates.
- Context you add with `clientContent` and `turnComplete: false` *after* the last completed turn has no handle covering it. **It's lost on resume.** We now re-send it.

## Wrong guess #2: the daemon resumes with a stale handle

If the server is fine, maybe we were presenting an old handle. The daemon started logging every handle update: whether it was resumable, whether we kept it, and the token count when it arrived.

Next phone session: every resume used the freshest handle. The token count when that handle arrived matched the count just before the resume. And it still dropped, 11,883 → 5,522.

## Wrong guesses #3 to #6: something only the daemon does

So it had to be something in real sessions that the clean client never did. The agent turned the probe into a canary with one arm per suspect:

| Suspect | Recall after resume |
|---|---|
| Real tool-call round trips | 11 / 11 |
| Barge-in cutting a long answer | 11 / 11 |
| 5 minutes of continuous mic noise | 8 / 8 |
| 13.5k tokens of context, below the compression trigger | 9 / 9 |
| Past the 16k compression trigger | 1 / 9, **with or without a resume** |

The last row is real, but it's by design: the sliding window drops the oldest turns, resume or not. It didn't explain the logs.

Was audio being converted to text? `promptTokensDetails` splits tokens by modality. In a bad resume, TEXT went 952 → 144 and AUDIO 4,239 → 23. Both collapsed.

## The actual bug: handles don't inherit

The arm that broke was the boring one: **resume, say one thing, resume again.** It failed 9 of 9 runs.

```text
conn 1 (fresh)       8 facts ...........  handle H1   5,153 tokens
conn 2 = resume(H1)  everything there, one "Ok."  →  H2   5,191 tokens
conn 3 = resume(H2)  system prompt + conn 2's "Ok."      167 tokens
```

A handle issued by a connection that was itself resumed restores **only what was said on that connection**, not the context it inherited. Seven turns on connection 2 before the next resume? 1,444 → 364: the ~145-token system prompt plus the ~210 tokens connection 2 added. Tell one new fact per connection? After three resumes, only the fact from the last connection survives.

One qualifier matters. If nothing is said on the resumed connection, no new handle is issued, and the old one keeps working: the canary reused a first-generation handle four times without losing a thing, and my daemon idled through hours of `GoAway`s the same way. **The trap is the first completed turn after a resume.** That turn mints a handle that only knows its own connection.

In sketch form (the helpers stand in for the usual send-audio-and-wait-for-`turnComplete` plumbing):

```go
live := func(handle string) *genai.LiveConnectConfig {
	return &genai.LiveConnectConfig{
		ResponseModalities: []genai.Modality{genai.ModalityAudio},
		SessionResumption:  &genai.SessionResumptionConfig{Handle: handle},
		// system instruction, transcription, compression: as usual
	}
}

s1, _ := client.Live.Connect(ctx, "gemini-3.8-live", live(""))
tellFacts(s1, facts)             // 8 facts, each turn completes
h1 := latestHandle(s1)           // one arrives after every completed turn
s1.Close()

s2, _ := client.Live.Connect(ctx, "gemini-3.8-live", live(h1))
ask(s2, "Where is the blue key?") // "In drawer seven."  (first resume: fine)
h2 := latestHandle(s2)
s2.Close()

s3, _ := client.Live.Connect(ctx, "gemini-3.8-live", live(h2))
ask(s3, "Where is the blue key?") // "I don't know."
```

The daemon's history agreed once it was split the right way. Over 30 real resumes, the **7 first resumes** of a session kept their tokens (ratios 1.00 to 1.35). The **23 later ones** had a median ratio of 0.73, and every resume below 0.8 was a later one. A back-of-envelope model (system prompt plus what the last connection added) predicted 3.8k tokens for the 10,699 → 3,874 drop. My clean client never saw any of this because it only ever resumed once.

## The fix: resume once

Four options came back to me: never resume a resumed session; resume once and re-seed on the second; ignore it and lean on the slow brain; report it upstream and do one of the first two meanwhile. I picked the first.

Now every handle carries the generation of the connection that issued it. A reconnect only presents a handle from a fresh connection. Otherwise the daemon opens a **fresh session and re-seeds it** from its own records: the recent conversation, the last 8 briefings, and the current roster of agents. On a bench scenario that forces two resumes and then asks about facts from before both, the fix recalled both facts in 5 of 5 runs. Before the fix it was 2 of 3.

The deeper lesson is about where truth lives. **Gemini 3.8 Live's memory is a cache, not a database.** The daemon owns the facts. Every briefing has to make sense on its own, with who it came from and when, because you can't assume the model still has the one before it.

## The rest of the list

Everything else I wish I'd known on day one, same model, same dates:

- **Audio out only.** `gemini-3.8-live` rejects `TEXT` as the response modality (close 1007). For tests, take audio and read `outputTranscription`.
- **There are two ways to inject text mid-session, and neither is a system message:**

  | You send | The model treats it as | Speaks? |
  |---|---|---|
  | `realtimeInput.text` | the user talking | yes |
  | `clientContent`, `turnComplete: true` | a user turn | yes, within a second |
  | `clientContent`, `turnComplete: false` | a user turn, context only | no |
  | function response + `scheduling` | a tool result | `INTERRUPT`, `WHEN_IDLE` or `SILENT` |

- **`clientContent` sent while the model is speaking interrupts it.** There's no "after this sentence" for client content; you queue it yourself.
- **Answer a `NON_BLOCKING` call too early and the result is dropped.** Wait for the `turnComplete` of the turn that issued the call before sending the response.
- **`willContinue` is rejected** (close 1007). We also tried keeping one "updates" call open for repeated answers; the model didn't re-open it after its second answer. Fabricated one-shot briefing responses work.
- **Compression is silent.** No server event. The suffix is kept, cut at a user turn, and the system instruction always stays. You only see it as a `promptTokenCount` drop, and past the trigger the oldest facts are gone.
- **`promptTokensDetails` splits AUDIO and TEXT.** The model's own earlier spoken replies come back as AUDIO in later prompts. Log it; it's how we ruled out a whole class of theories.
- **On Vertex, Live isn't served from `global`.** `us-central1` worked. With an API key the Go SDK defaults to the global host and doesn't put the key on the WebSocket, so set the regional base URL and an `x-goog-api-key` header yourself.
- **About 3% of answers stall for a flat 7.0 s mid-sentence** on Vertex `gemini-3.8-live`, on the bench and on my phone. AI Studio's `gemini-3.8-live` and Vertex's `gemini-live-2.5-flash-native-audio` showed none in 62 and 64 answers, which at a 3% rate doesn't prove much.
- **The Go session isn't goroutine-safe.** One reader, a mutex around every send. Expect empty keep-alive frames, the buffered `setupComplete` as your first `Receive()`, and an empty `SessionID`.

## Verdict

Gemini 3.8 Live is a great pair of ears and a surprisingly good mouth. Most of my pain came from treating it as something it isn't: a text-to-speech engine with tools at first, then a reliable memory. It's neither. It's an LLM that hears.

Give it facts, not scripts. Keep the truth outside it. Assume it forgets, and measure when. Run a canary on a schedule, because the platform will keep changing under you.

And never resume twice.

*sheepdog's daemon is a private project for now. Next up: how the voice model went from operator to mouthpiece to fast brain, and how our evals quietly trained it to be lazy.*

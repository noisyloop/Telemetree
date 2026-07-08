# Windows GDID — Research Notes

**How a persistent Windows device identifier (GDID) let Microsoft hand the FBI a device's IP history, web activity, and timestamps — the Scattered Spider case, what's real, and what the viral version got wrong.**

> Companion to the TELEMETREE telemetry research. This one drills into a single, concrete mechanism inside the Microsoft/Windows node: the **Global Device Identifier (GDID)**.
>
> Redactions: the defendant's name is redacted throughout (referred to as **"the defendant"**). The infosec account that popularized the summary thread is also redacted (referred to as **"the research collective"**) per request — credit still owed, just not named here.
>
> Sourcing note: this is built from the unsealed DOJ criminal complaint (quoted in reporting), Microsoft's own public Azure Monitor documentation, and an independent researcher's reverse-engineering writeup that reproduced the mechanism on a live Windows 11 machine. Where the popular retelling drifted from the evidence, that's flagged explicitly. Full credits at the bottom.

---

## Table of Contents

1. [TL;DR](#1-tldr)
2. [What Happened (The Case)](#2-what-happened-the-case)
3. [The Viral Claim vs. What's Actually True](#3-the-viral-claim-vs-whats-actually-true)
4. [What a GDID Actually Is](#4-what-a-gdid-actually-is)
5. [The Technical Chain — How the ID Is Born and Reported](#5-the-technical-chain--how-the-id-is-born-and-reported)
6. [What Investigators Got, and How They Used It](#6-what-investigators-got-and-how-they-used-it)
7. [Why This Exists (The Non-Conspiracy Explanation)](#7-why-this-exists-the-non-conspiracy-explanation)
8. [What You Can and Can't Do About It](#8-what-you-can-and-cant-do-about-it)
9. [Where This Fits in TELEMETREE](#9-where-this-fits-in-telemetree)
10. [Open Questions and Honest Caveats](#10-open-questions-and-honest-caveats)
11. [References and Credits](#11-references-and-credits)

---

## 1. TL;DR

In July 2026 the U.S. DOJ unsealed a criminal complaint against a 19-year-old alleged member of the **Scattered Spider** cybercrime group (also tracked as Octo Tempest / UNC3944 / 0ktapus). Buried in the affidavit was a mechanism that set the security world on fire: Microsoft supplied the FBI with records tied to a **Global Device Identifier (GDID)** — a persistent, per-installation Windows identifier — that let investigators link one physical Windows machine to its **IP-address history, some of its web activity, tool usage, and timestamps**, even though the defendant used a VPN and a tunneling service.

The important nuance, established by a researcher who actually traced the binaries: **the GDID is not a magic hardware-hash supercookie.** It's a 64-bit **MSA Device PUID** — an identifier Microsoft's servers assign when Windows provisions itself against `login.live.com` — that gets registered into Microsoft's device graph and surfaced in one public place: the **`UCDOStatus.GlobalDeviceId`** column in Azure Monitor's Delivery Optimization reporting. Persistent across updates, regenerated on a clean reinstall, and — the uncomfortable part — **not fully avoidable even with a local account.**

The case is a near-perfect illustration of the TELEMETREE thesis: an identifier built for mundane, defensible engineering reasons (update delivery, device sync, licensing) becomes, under a lawful court order, a person-tracking tool.

---

## 2. What Happened (The Case)

- The defendant, a dual U.S.–Estonian citizen, was arrested on **April 10** by Finnish police while attempting to board a flight to Japan from Helsinki, and later extradited to the U.S. He faces multiple counts including conspiracy, cyber intrusion, and fraud; four charges relate to an alleged **$8 million ransom demand** against a U.S. luxury-goods retailer (May 2025). The case is part of the FBI's **Operation Riptide** targeting Scattered Spider, a group tied to 100+ attacks and $100M+ in extortion.
- The FBI affidavit (from Special Agent Ali Sadiq) states that **"criminal referrals from Microsoft"** were part of the evidence, and that Microsoft security researchers have access to "computer machine IDs, IP addresses, and malware samples associated with sophisticated cybergroups."
- The defendant attempted to hide behind a **VPN**, then used that VPN to open an account on **ngrok** (a legitimate secure-tunneling service, here allegedly used to maintain unauthorized access into corporate networks). The VPN masked the network layer — but **not the GDID of the Windows installation**.
- Microsoft's GDID records tied that one Windows install to activity across **Tallinn, New York, and Thailand**, matching the defendant's real travel. The GDID showed the device accessing the same servers as the ngrok-identified IP.
- **The GDID didn't work alone.** Investigators corroborated nearly every IP-address hit by pairing the GDID with a **Snapchat login** within minutes; **Apple** records matched two (New York, Thailand); **Facebook** added a Tallinn overlap from June 2024. The defendant also undermined himself by posting Snapchat photos from luxury hotels (one match tied to a New York hotel rental) and using the same machine to play the game **Growtopia** and log into personal accounts. Two hard drives of evidence were reportedly seized at the airport.

**Takeaway:** the GDID was the *spine* that made a pile of otherwise-disconnected logs collapse into one person — but attribution still came from **cross-referencing multiple providers** (Microsoft, Snap, Apple, Facebook, ngrok). No single company had the whole picture; the court order assembled it.

---

## 3. The Viral Claim vs. What's Actually True

The summary thread that spread fastest compressed the story into punchy bullets. Most were directionally right, a few were wrong in ways that matter for real telemetry research. Crediting the independent researcher who reproduced the mechanism on a live Windows 11 (build 26200) machine and confidence-tagged every claim:

| Viral claim | Reality | Verdict |
|---|---|---|
| GDID is a 128-bit ID derived from hardware serial numbers | It's a **64-bit MSA Device PUID assigned by Microsoft's servers**, not a hardware-serial hash. A reinstall yields a *new* one — proof it isn't derived from hardware. | ❌ Wrong |
| GDID is assigned to each OS install and is unique per device | True — one install → one GDID; persistent across updates; new value on clean reinstall. | ✅ Right |
| GDID only changes if the OS is wiped | Essentially true (a full reinstall regenerates it). | ✅ Right |
| Delivery Optimization / "OCDOStatus" is where it lives | Close: the column is **`UCDOStatus.GlobalDeviceId`** (Update Compliance/Delivery Optimization table in **Azure Monitor**). Delivery Optimization only *reports* it — it doesn't own it. | ⚠️ Right idea, wrong name |
| It's mentioned in only one MSDN/Microsoft document | Fair: **Azure Monitor's `UCDOStatus` schema is the one public place** Microsoft names the value ("Microsoft global device identifier… used by Microsoft internally"). | ✅ Basically right |
| GDID reported the defendant's IP address, web activity, timestamps, game played | Supported by the complaint — IP history, some web/tool activity, timestamps; Growtopia + accounts came from cross-referencing. | ✅ Right |
| Using a local account avoids it | **No.** The Connected Devices Platform has an **anonymous device path**; even offline-first setups generate a GDID (the researcher issued an explicit correction on this). A local account only avoids tying it to a *Microsoft Account*. | ❌ Wrong |

**Why the corrections matter:** if you tell people "it's a hardware hash you can never escape," you get fatalism. If you tell them "it's a server-assigned identity-graph key that a local account decouples from your name but doesn't eliminate," you get an accurate threat model — which is the whole point of TELEMETREE.

---

## 4. What a GDID Actually Is

Per the complaint, quoting a Microsoft representative:

> *A Global Device Identifier in the Windows ecosystem is a persistent, device-level identifier designed to uniquely identify an installation of a Windows operating system on a device — either a physical device (e.g., a mobile phone or laptop) or a virtual machine — across certain Microsoft services and scenarios.* (paraphrased from the affidavit)

Properties that fall out of the mechanism:
- **Server-assigned, not hardware-derived.** It originates as a **Device PUID** (Passport Unique ID) handed back by `login.live.com` during provisioning. Because it's minted server-side, a fresh install gets a fresh ID.
- **64-bit**, in a device-PUID namespace (observed values in the `0x0018…` high-word class).
- **Persistent across OS updates**, regenerated on clean reinstall.
- **Registered into Microsoft's device graph** (the Device Directory Service, the same graph behind Phone Link, cloud clipboard, and cross-device activity sync).
- **Surfaced publicly** only as `UCDOStatus.GlobalDeviceId` in Azure Monitor, sitting in a table right next to `LastCensusSeenTime`, `ISP`, `City`, and `Country` — i.e., a device ID lined up with geo and network metadata by design.
- **Infrastructure age:** the underlying plumbing reportedly dates to the Windows 10 era (2015); the identifier itself doesn't appear much in public docs until ~2021.

Framed in the TELEMETREE taxonomy, GDID is a **Class-5 (fingerprinting / identity infrastructure)** node — the connective tissue that lets otherwise-separate telemetry streams be joined to one device and, via the Microsoft Account, one person.

---

## 5. The Technical Chain — How the ID Is Born and Reported

Reconstructed from the researcher's live reproduction (ETW capture on Windows 11 26200, public PDB symbols) plus Microsoft docs. Bottom to top:

**1. Identity layer — `wlidsvc` (Microsoft Account service):**
- Provisions the device against `login.live.com` via a Passport **PPCRL SOAP** request.
- The server assigns a **Device PUID** (parsed from the `<ps:DevicePUID>` / `HWPUIDFlipped` response field).
- Stored in the registry (cleartext) at `HKCU\SOFTWARE\Microsoft\IdentityCRL\ExtendedProperties\LID` (and related identity-store keys).
- Issues device tokens for `dds.microsoft.com` and `activity.windows.com`.

**2. Device-graph client — Connected Devices Platform (`cdp.dll` / `CDPSvc`):**
- Calls `GetStableDeviceId…` → receives the PUID string.
- `DdsClient::RegisterUserDeviceAsync()` → registers the device into the **Device Directory Service (DDS)**. (Observed live: HTTP 200 registration response, `Account Type: MSA`.)

**3. Server — Device Directory Service (DDS):**
- Keys `g:<PUID>` to the Microsoft Account, plus **activity and IP history** over time. This is where "one device, seen from many IPs across months" gets accumulated.

**4. Reporting — Delivery Optimization:**
- Surfaces the value as **`UCDOStatus.GlobalDeviceId`** in Azure Monitor / Windows Update for Business reports. (This is the *visible tip*; the actual identity/graph work happens in layers 1–3.)

```
login.live.com ──assigns──▶ Device PUID
        │
   wlidsvc.dll  ──stores──▶ registry (IdentityCRL\...\LID)
        │
   cdp.dll / CDPSvc ──registers──▶ Device Directory Service (DDS)
        │                              │ keys g:PUID → MSA account + IP/activity history
        ▼                              ▼
 dds.microsoft.com            Delivery Optimization ──reports──▶ UCDOStatus.GlobalDeviceId (Azure Monitor)
 activity.windows.com
```

The elegant, unsettling part: **every property the complaint attributes to "the GDID"** — persistent per install, survives updates, new on reinstall, tied to a Microsoft Account, trackable across IPs and browsing — **falls naturally out of this being a server-assigned identity-graph key**, not out of any bespoke surveillance feature. It's identity infrastructure doing exactly what identity infrastructure does.

---

## 6. What Investigators Got, and How They Used It

From the complaint and reporting, the GDID-linked records Microsoft provided (under lawful process) included:
- **IP-address history** for the device over time (the geo/ISP columns that live alongside the ID).
- **Some web activity and URLs**, with **timestamps**. (See the caveat below on *why* URLs were present.)
- **Tool usage** — notably the ngrok session, tied to the same device in the same session as personal-account logins.

**Crucial caveat on the web activity (credit: Tom's Hardware's analysis):** Windows telemetry does **not** send your full browsing history by default. The URL-level data most likely appeared because the device's diagnostic level was set to **Optional/Full** rather than **Required/Basic** — in the extended modes, URLs analyzed by **SmartScreen** and **Defender** can be uploaded alongside the GDID, and using **Edge** in that configuration can send every visited URL. The court documents don't specify the exact trigger. So "GDID tracks all your web activity" is an overstatement; "GDID + Optional-tier telemetry + SmartScreen/Defender/Edge can associate visited URLs with your device ID and timestamps" is the accurate version.

**How the attribution was actually assembled:** the GDID gave investigators a stable anchor; they then matched its IP hits against **Snapchat, Apple, and Facebook login logs** (and the defendant's own geotagged social posts). The multi-provider correlation — not the GDID alone — is what produced courtroom-grade attribution.

---

## 7. Why This Exists (The Non-Conspiracy Explanation)

The identifier wasn't built to catch hackers. It exists because a modern OS has to answer boring questions:
- **Update delivery & peer caching (Delivery Optimization):** to do P2P/CDN update distribution and report bandwidth savings per device, the system needs a stable per-device key. That's literally what `UCDOStatus` is for.
- **Cross-device features (DDS / CDP):** Phone Link, cloud clipboard, "resume on another device," and activity sync all require a device-identity graph. You can't sync across devices you can't name.
- **Licensing & activation:** device tokens tie an install to entitlements (which is why swapping a motherboard can de-activate Windows).
- **Security & abuse detection:** unfamiliar-device login flags, trial-abuse detection, and threat-actor tracking all lean on persistent device IDs.

All four are legitimate Class-1/3/5 engineering needs. The problem TELEMETREE exists to surface isn't that the ID is evil — it's that **the same key that makes cloud clipboard work also makes lawful (or unlawful) tracking trivial**, there's no user-facing off switch, and its existence was effectively undocumented outside one Azure Monitor schema page. Capability plus opacity is the risk, not malice.

**Balancing note:** every major platform has equivalents. Apple maintains a hardware UUID and a **DSID** tied to iCloud; Linux has `/etc/machine-id`; advertising IDs do this on mobile. Any provider holding such an ID can be compelled to produce records. The GDID is notable mainly because this is the **first public case where a Windows GDID was used both as a tracking anchor and as a carrier of URL-level telemetry** — and because it's Microsoft-account-linked at population scale.

---

## 8. What You Can and Can't Do About It

Accurate mitigations (not the fatalistic "there's nothing you can do," nor the false "just use a local account"):

- **Use a local account** → the GDID still exists (CDP's anonymous path), but it's **not tied to a Microsoft Account identity**, which breaks the easiest human-attribution step. Meaningful, not total.
- **Lower telemetry to Required/Basic** (and on Enterprise/Education, to Security/0) → strips the **URL-level** SmartScreen/Defender/Edge data that made web activity visible. Doesn't remove the device ID, but removes much of what made it *interesting*.
- **Don't use Edge**; use a browser that isn't wired into Windows diagnostics.
- **Block `dds.microsoft.com` and `activity.windows.com`** (firewall/hosts) → disrupts the device-graph registration/sync path. May break Phone Link / cross-device features. (Test before relying on it; behavior changes across builds.)
- **Clear the stored PUID** by deleting the `IdentityCRL\...\ExtendedProperties` keys → it's **recreated on next MSA sign-in**, so this is a reset, not a removal.
- **What does NOT help:** a VPN (network layer only — that's the entire lesson of this case), deleting `%LOCALAPPDATA%\ConnectedDevicesPlatform` alone (the PUID returns from the identity store), or assuming "debloat scripts" removed it (most don't touch this path; activation/UWP break if you fully sever it).

**For your own research:** you can read your own GDID with a single registry lookup under the IdentityCRL path, and observe the DDS registration live via ETW on the CDP providers — a clean, reproducible demo for the TELEMETREE "how we know" material, and squarely in your detection-engineering wheelhouse.

---

## 9. Where This Fits in TELEMETREE

This case is the ideal **worked example** for the main map — it makes the abstract taxonomy concrete:

- **Node:** `identifier: GDID (MSA Device PUID)` — a Class-5 diamond, the join key.
- **Edges into it:** `wlidsvc → PUID`, `CDP → DDS`, `Delivery Optimization → UCDOStatus`. Each edge labeled with its *real* purpose (updates, sync, licensing) and its `optionality` = **always-on / no user off-switch**.
- **Join edges (the hot ones):** `GDID → Microsoft Account → person`, and `GDID ⟷ Snapchat/Apple/Facebook logins` via shared IP+timestamp. This is the literal picture of §14 of the main doc ("four vendors resolve to one human via shared identifiers") — except here it's *five providers resolving to one human via a device ID + login-log correlation*, validated in federal court.
- **Governance node:** `court order / lawful process` as the mechanism that activates the join — the reminder that telemetry's risk isn't only corporate; it's "whoever can compel the holder."
- **Cross-platform siblings to draw:** Apple DSID/hardware-UUID, Linux `machine-id`, mobile advertising IDs — so the map shows GDID isn't uniquely sinister, just uniquely *documented-by-a-court-case*.

Suggested tagline for the node when the site gets built: *"The identifier that makes your cloud clipboard work is the identifier that put a Scattered Spider suspect on a plane in handcuffs."*

---

## 10. Open Questions and Honest Caveats

- **Exact upload trigger unknown.** The court filing doesn't state which mechanism (SmartScreen, Defender, Edge, or another) uploaded the URL-level data, or what diagnostic tier the device was on. The Optional/Full inference is well-reasoned but not court-confirmed.
- **Allegations, not convictions.** As of these notes the defendant is charged, not convicted; the affidavit describes the government's version.
- **Moving target.** Registry paths, service internals, and blockable endpoints shift across Windows builds. The reproduction was on build 26200; re-verify before publishing anything prescriptive.
- **Independent-researcher dependency.** Much of the deep mechanism comes from one careful reverse-engineering writeup (confidence-tagged and reproducible, which is why it's trustworthy) plus corroborating outlets. Re-derive the ETW/registry steps yourself before treating them as settled for TELEMETREE.
- **"Only one MSDN doc" is a soft claim.** It's the one place the *value* is named publicly (Azure Monitor `UCDOStatus`); related concepts (CDP, DDS, Delivery Optimization) are documented elsewhere without naming the GDID as such.

---

## 11. References and Credits

Primary and best sources (credit prominently if any of this reaches the site):

- **U.S. DOJ criminal complaint** (*United States v. [defendant redacted]*, N.D. Ill., unsealed ~July 1, 2026) — the affidavit by FBI Special Agent Ali Sadiq is the primary source for the GDID quote, the ngrok linkage, and the cross-provider matches.
- **Independent researcher reverse-engineering writeup** (`gdid-reversal`, published to GitHub, July 2026) — the single most valuable technical source: traces `wlidsvc → CDP/DDS → Delivery Optimization`, reproduced live on Windows 11 (26200) with public PDB symbols and ETW capture, every claim confidence-tagged `[COURT]/[OBSERVED]/[STATIC]/[ASSESSED]`, and it *debunks* the 128-bit-hardware-hash and local-account myths. This corrected the record.
- **Microsoft Learn — Azure Monitor `UCDOStatus` schema** and *Delivery Optimization data in Windows Update for Business reports* — first-party confirmation of the `GlobalDeviceId` column ("Microsoft global device identifier… used by Microsoft internally") sitting alongside ISP/City/Country.
- **The Register** — *"Windows is watching: Anti-piracy tool fingers Scattered Spider suspect"* — clearest write-up of the full `wlidsvc → cdp.dll → DDS → UCDOStatus` chain and the Apple-DSID / Linux-`machine-id` comparison.
- **iTnews** — *"Microsoft device telemetry key to unmasking alleged Scattered Spider hacker"* — the Snapchat/Apple/Facebook cross-referencing detail and affidavit quotes.
- **Tom's Hardware** — two pieces; source for the crucial **Optional/Full telemetry + SmartScreen/Defender/Edge** explanation of *why* URLs were present, and the "GDID is one fingerprint among many" framing.
- **Cybernews** — the community/backlash angle and the Massgrave note that a local account and blocking won't fully prevent a GDID without breaking activation/UWP.
- The infosec **research collective** whose summary thread first drew mass attention to the affidavit detail — redacted here by request; credit still owed for surfacing it.

*Compiled July 2026 as a deep-dive companion to TELEMETREE. Describes allegations and a fast-moving technical story; verify specifics at build time. Not legal advice.*

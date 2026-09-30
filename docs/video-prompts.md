# How to make the website videos (easy guide)

Follow this page from top to bottom. Do one clip at a time. Don't skip ahead.

## Where we are

| Clip | Status | What it shows |
|---|---|---|
| flow | ✅ Done | Glass fibres with data pulses (home page top) |
| flow-portrait | ✅ Done | The same, tall, for phones |
| plan | ✅ Done | A laser tracing an engraved plate ("Plan & Estimate") |
| build | ✅ Done | Blocks rising in a wave ("Build & Deploy") |
| **process** | 🆕 **Make now** | Four stations on one light path ("How we work") |
| **discover** | 🔁 **Make again** | A system diagram drawn in light ("Discovery") |
| **run** | 🔁 **Make again** | Server lights breathing ("Support & Iterate") |

**Why these three?** The old *discover* (floating dust) and *run* (light under liquid) looked nice but didn't say "software". The new ones show things software people recognise: a system diagram and a running server. *process* is new. Before, the "How we work" intro reused the Discovery video, so the same clip played twice in a row. Now it gets its own.

---

## Words you'll see

- **Flow**: the Google website where you make the pictures and videos.
- **Prompt**: the words you paste into Flow. They tell it what to make.
- **Keyframe**: a *picture* that shows how the video should look. You make the picture first, then Flow turns it into a moving video.
- **Start frame / End frame**: the first and last picture of the video. We use the **same picture** for both, so the video ends where it started and can repeat forever.
- **Generate**: the button that makes Flow create something.
- **Style picture**: your `flow.png` from Clip 1. You add it to every new picture so all the videos look like one family.

## Where files go

- Put each clip in its own folder inside `/home/shahriar/Desktop/Projects/SomokolonLabs/video-src/`:
  - `clip 7` for **process**
  - `clip 8` for **discover**
  - `clip 9` for **run**
- Put **both** the picture (`.png`) and the video (`.mp4`) for that clip in its folder.
- Name them exactly as the steps say (small letters). If you make more than one, add `-1`, `-2` (for example `discover-1.mp4`). Kiro will pick the best one.

Your style picture is here: `video-src/clip1/flow.png`

---

# CLIP 7: process ("How we work")

**What it is:** one thin glowing thread with **four** small rings on it, one for each step. A light travels along the thread and each ring lights up in turn. The last ring is red.
**Where it plays:** the home page, on the "How we work / From first call to running system" screen, before step 01.

## Part A: Make the picture

1. Open your Flow project **Somokolon site footage**.
2. Click the **model name** on the prompt box.
3. Choose **Image**.
4. Choose the model **Nano Banana Pro**.
5. Open the settings (⚙ or ☰ next to the prompt box) and set:
   - **Aspect ratio**: **16:9** (wide)
   - **Number of outputs**: **4**
   - **Resolution**: **2K** (if you see it)
6. **Add the style picture:** drag `flow.png` from your computer (`video-src/clip1/flow.png`) into the prompt box. A small copy of it appears in the box.
7. Click inside the prompt box. Delete any old words, but keep the small picture.
8. Copy **all** of the text in the grey box and paste it in:

```
Cinematic photograph, 16:9, matching the lighting, colour grade and lens of the reference image. A single thin optical fibre runs across a dark, matte surface in a black studio, rising gently from the lower middle of the frame toward the upper right. Exactly four small machined aluminium rings sit on the fibre at even distances, like four stations along one path. The fibre glows faintly in cool steel-blue (#3a62aa). The first three rings glow softly blue-white from inside. The fourth ring, at the upper right, glows signal red (#d92d20). Shallow depth of field: the middle two rings are razor sharp, the first and last fall slightly soft. The left 45% of the frame is near-black and empty. The bottom third of the frame is dark and quiet. Background deep navy-black (#0b1524). Large-format digital cinema camera, 100mm macro lens, subtle fine film grain. Photoreal, minimal, precise, calm, expensive. No text, no letters, no numbers, no logos, no screens, no holograms, no people, no lens flares, no sparks, no purple, teal or orange.
```

9. Click **Generate**.
10. Wait. You'll get **4 pictures**.

## Part B: Pick the best picture

Click each picture to see it big. A **good** picture has **all** of these:

- ✅ **Count the rings: exactly 4.** Not 3, not 5.
- ✅ One thin thread goes from the lower middle up to the upper right, through all 4 rings
- ✅ Only the **last** ring (top right) is red. The others are soft blue-white.
- ✅ The **left side is dark** and empty
- ✅ The **bottom is dark** and quiet
- ✅ No words, letters or numbers anywhere (zoom in)

If **none** are good:
- Click **Generate** again.
- Wrong number of rings? Add this to the **end** of the prompt, then Generate: `There are exactly four rings, evenly spaced.`
- Left side too bright? Add: `The left half is completely dark and empty.`

When you find a good one:

11. Click it, then click **Download (↓)**. Choose **2K**.
12. In your **Downloads** folder, rename the file to **`process.png`**.
13. Make a folder called **`clip 7`** inside `video-src`, and move `process.png` into it.

## Part C: Turn the picture into a video

1. Click the **model name** on the prompt box.
2. Click **Video**.
3. Click **Frames**.
4. If there are old pictures in **+ Add start frame** or **+ Add end frame**, click their small **X** to remove them.
5. Find your new ring picture in the Flow project (it's with your results on the screen).
6. **Drag** it onto **+ Add start frame**.
7. **Drag the same picture** onto **+ Add end frame**.
   Both boxes should now show the **same** picture.
8. Open the settings and set:
   - **Model**: **Veo 3.1 Quality**
   - **Aspect ratio**: **16:9**
   - **Length**: **8s**
   - **Number of outputs**: **2**
9. Delete any old words in the prompt box.
10. Copy and paste this:

```
One continuous 8-second shot with no cuts, locked-off camera with very slight focus breathing. A soft pulse of light travels slowly along the optical fibre from the first ring at the lower middle to the fourth ring at the upper right. As the pulse reaches each ring, that ring brightens for a moment and then settles back to its soft glow, one after another, in order. When the pulse reaches the fourth ring, its red glow swells gently and then settles. The journey takes about six seconds; the last two seconds are calm. The fibre and rings never move; only the light moves. The left side and bottom third stay dark. The final frame returns exactly to the opening frame. Photoreal macro cinematography, shallow depth of field, deep navy-black with cool steel-blue light and one red ring, subtle film grain. No text, no numbers, no logos, no people, no camera shake, no speed ramps, no flashes, no sparks. No music, no dialogue.
```

11. Click **Generate**.
12. Wait a few minutes. You'll get **2 videos**.

## Part D: Pick the best video

Play each video **two times in a row**. A **good** video has **all** of these:

- ✅ A light slides along the thread from the bottom ring to the top ring
- ✅ The rings light up **one after another, in order**
- ✅ The last (red) ring glows a bit brighter when the light arrives
- ✅ The rings and thread don't move, bend or melt
- ✅ Still exactly 4 rings all the way through
- ✅ No words or strange shapes appear

**If the video barely moves:** click the small **X** on **+ Add end frame** to remove the end picture (keep the start picture), then click **Generate** again. Kiro will fix the loop.

**If it looks wrong:** click **Generate** again.

## Part E: Save the video

1. Click the best video, then click **Download (↓)**.
2. Choose **1080p**.
3. In your **Downloads** folder, rename the file to **`process.mp4`**.
4. Move it into the **`clip 7`** folder (next to `process.png`).

## Part F: Tell Kiro

Tell Kiro: *"clip 7 is in video-src."* Kiro will check it, make it loop, match its colours to the others and put it on the site.

(Doing it yourself? In the Kiro terminal: `npm run video -- process "video-src/clip 7/process.mp4" --loop`)

✅ **Clip 7 done.** Go to Clip 8.

---

# CLIP 8: discover (new version)

**What it is:** a dark glass wall with a **system diagram** drawn on it in thin lines of blue light: small circles (the parts of a system) joined by lines. Little lights travel along the lines and meet at one red circle. It says "we map out how your system fits together."
**Where it plays:** step 01 "Discovery" on the home page, and at the top of the About, Insights and AI pages.

## Part A: Make the picture

1. Click the **model name** on the prompt box.
2. Choose **Image**.
3. Choose the model **Nano Banana Pro**.
4. Open the settings and set:
   - **Aspect ratio**: **16:9** (wide)
   - **Number of outputs**: **4**
   - **Resolution**: **2K** (if you see it)
5. **Add the style picture:** drag `flow.png` (`video-src/clip1/flow.png`) into the prompt box.
6. Delete any old words in the prompt box (keep the small picture).
7. Copy and paste this:

```
Cinematic photograph, 16:9, matching the lighting, colour grade and lens of the reference image. A large pane of dark smoked glass stands in a black studio, seen at a slight angle. On the glass, a clean system diagram is drawn in thin lines of cool steel-blue (#3a62aa) light: about a dozen small hollow circles connected by straight and gently curved lines, like an engineer's sketch of how the parts of a software system connect. One circle right of centre glows signal red (#d92d20), and several lines lead into it. The lines look like fine light etched into the glass, precise and elegant. The diagram sits in the right half of the frame. The left 45% of the frame is near-black and empty, and the bottom third is dark and quiet. Shallow depth of field: the red circle and the lines around it are razor sharp, the far edges of the diagram fall softly out of focus. Background deep navy-black (#0b1524). Large-format digital cinema camera, 50mm lens, subtle fine film grain. Photoreal, minimal, precise, calm, expensive. The diagram contains only circles and lines, with no labels. No text, no letters, no numbers, no logos, no icons, no screens, no user interface, no holograms, no people, no hands, no lens flares, no purple, teal or orange.
```

8. Click **Generate** and wait for **4 pictures**.

## Part B: Pick the best picture

A **good** picture has **all** of these:

- ✅ A dark glass wall with thin blue lines joining small circles, like a map of connected parts
- ✅ **Exactly one red circle**, a little right of the middle, with lines going into it
- ✅ It looks like a **drawing on glass**, not stars in the sky and not a floating sci-fi hologram
- ✅ **No words, letters, numbers or little icons** next to the circles. Zoom in close. This is the most common mistake.
- ✅ The left side and bottom are dark

If **none** are good:
- Click **Generate** again.
- Words or icons appear? Add this to the end of the prompt: `The circles are completely empty and unlabeled, with nothing written anywhere.`
- Looks like stars or space? Add: `It is clearly a technical line drawing on a glass pane, not a night sky.`

When you find a good one:

9. Click it, then **Download (↓)**, choosing **2K**.
10. Rename it to **`discover.png`**.
11. Make a folder called **`clip 8`** inside `video-src`, and move `discover.png` into it.

## Part C: Turn the picture into a video

1. Click the **model name**, then **Video**, then **Frames**.
2. Remove any old pictures from **+ Add start frame** and **+ Add end frame** (click their small **X**).
3. Drag your new **diagram** picture onto **+ Add start frame**.
4. Drag the **same picture** onto **+ Add end frame**.
5. Open the settings and set:
   - **Model**: **Veo 3.1 Quality**
   - **Aspect ratio**: **16:9**
   - **Length**: **8s**
   - **Number of outputs**: **2**
6. Delete any old words in the prompt box.
7. Copy and paste this:

```
One continuous 8-second shot with no cuts, locked-off camera with very slight focus breathing. Small, soft pulses of blue-white light travel slowly along the lines of the diagram from circle to circle, like signals moving through a system, and gather at the red circle, which brightens gently each time a pulse arrives and then settles. The circles and lines themselves never move or change; only the light travels along them. Slow, even, unhurried motion. The left side and bottom third stay dark. The final frame returns exactly to the opening frame. Photoreal cinematography, shallow depth of field, deep navy-black with cool steel-blue light and one red circle, subtle film grain. No text, no numbers, no labels, no icons, no logos, no people, no hands, no camera shake, no flashes, no sparks. No music, no dialogue.
```

8. Click **Generate** and wait for **2 videos**.

## Part D: Pick the best video

Play each one **two times in a row**. A **good** video has **all** of these:

- ✅ Little lights slide along the lines, slowly and smoothly
- ✅ They travel **toward the red circle**, which glows a bit brighter when they arrive
- ✅ The drawing itself doesn't wiggle, grow, melt or change shape
- ✅ No words, numbers or icons appear at any moment
- ✅ The left side and bottom stay dark

**If it barely moves:** remove the end picture (click **X** on **+ Add end frame**) and click **Generate** again.

**If it looks wrong:** click **Generate** again.

## Part E: Save the video

1. Click the best video, then **Download (↓)**, choosing **1080p**.
2. Rename it to **`discover.mp4`**.
3. Move it into the **`clip 8`** folder.

## Part F: Tell Kiro

Tell Kiro: *"clip 8 is in video-src."* It replaces the old dust video everywhere.

(Doing it yourself: `npm run video -- discover "video-src/clip 8/discover.mp4" --loop`)

✅ **Clip 8 done.** Go to Clip 9.

---

# CLIP 9: run (new version)

**What it is:** a close-up of the front of a row of dark computer servers. Their small blue status lights breathe slowly and steadily, and a red pulse of light runs along one cable. It says "your system is live and healthy, and we're looking after it."
**Where it plays:** step 04 "Support & Iterate" on the home page, and at the top of the Contact, Cloud and Infrastructure pages.

> **Why is the red on a cable and not on a server light?** On real servers, a red light means something is broken. We only want the red to mean "data is moving".

## Part A: Make the picture

1. Click the **model name** on the prompt box.
2. Choose **Image**.
3. Choose the model **Nano Banana Pro**.
4. Open the settings and set:
   - **Aspect ratio**: **16:9** (wide)
   - **Number of outputs**: **4**
   - **Resolution**: **2K** (if you see it)
5. **Add the style picture:** drag `flow.png` (`video-src/clip1/flow.png`) into the prompt box.
6. Delete any old words in the prompt box (keep the small picture).
7. Copy and paste this:

```
Cinematic photograph, 16:9, matching the lighting, colour grade and lens of the reference image. Low-angle close-up along the front of a neat row of unbranded dark server units in a quiet, dark room, receding to the right into soft focus. Plain matte black faceplates with fine perforated metal mesh, stacked evenly. Small round status lights on the faceplates glow soft cool steel-blue (#3a62aa). A few thin dark cables run neatly along the right side of the frame, and one of them carries a small point of signal-red (#d92d20) light inside it. The left 45% of the frame is near-black and empty, and the bottom third is dark and quiet. Background deep navy-black (#0b1524). Large-format digital cinema camera, 100mm macro lens, shallow depth of field, subtle fine film grain. Photoreal, minimal, precise, calm, expensive. The faceplates are completely plain with no markings of any kind. Every status light is blue; the only red is the small light inside the cable. No text, no letters, no numbers, no labels, no stickers, no logos, no screens, no displays, no people, no lens flares, no purple, teal, green or orange.
```

8. Click **Generate** and wait for **4 pictures**.

## Part B: Pick the best picture

A **good** picture has **all** of these:

- ✅ The dark front of servers, with small round lights, fading into blur on the right
- ✅ **All the small lights are blue**
- ✅ The only red is **one small light inside a cable**
- ✅ **No words, numbers, labels, stickers or logos** on the metal. Zoom in close and check every part.
- ✅ It looks calm and expensive, not like a busy sci-fi corridor
- ✅ The left side and bottom are dark

If **none** are good:
- Click **Generate** again.
- Labels or numbers appear? Add this to the end: `The metal is perfectly plain and clean, with nothing printed on it.`
- Red server lights? Add: `All status lights are blue. Red appears only inside one cable.`
- Green lights? Add: `There is no green anywhere.`

When you find a good one:

9. Click it, then **Download (↓)**, choosing **2K**.
10. Rename it to **`run.png`**.
11. Make a folder called **`clip 9`** inside `video-src`, and move `run.png` into it.

## Part C: Turn the picture into a video

1. Click the **model name**, then **Video**, then **Frames**.
2. Remove any old pictures from **+ Add start frame** and **+ Add end frame** (click their small **X**).
3. Drag your new **server** picture onto **+ Add start frame**.
4. Drag the **same picture** onto **+ Add end frame**.
5. Open the settings and set:
   - **Model**: **Veo 3.1 Quality**
   - **Aspect ratio**: **16:9**
   - **Length**: **8s**
   - **Number of outputs**: **2**
6. Delete any old words in the prompt box.
7. Copy and paste this:

```
One continuous 8-second shot with no cuts, locked-off camera with very slight focus breathing. The blue status lights breathe slowly and steadily, some gently brightening while others dim, in a calm, regular rhythm, like a healthy system that is running. Small points of blue-white light travel smoothly along the thin cables, and a single signal-red pulse runs along one cable from the bottom of the frame to the top. Nothing blinks fast or flickers. The servers and cables never move. The left side and bottom third stay dark. The final frame returns exactly to the opening frame. Photoreal cinematography, shallow depth of field, deep navy-black with cool steel-blue lights and one red pulse, subtle film grain. No text, no numbers, no labels, no logos, no screens, no people, no camera shake, no fast blinking, no flashes. No music, no dialogue.
```

8. Click **Generate** and wait for **2 videos**.

## Part D: Pick the best video

Play each one **two times in a row**. A **good** video has **all** of these:

- ✅ The blue lights slowly glow brighter and dimmer, calm and steady, like breathing
- ✅ **Nothing blinks fast.** Fast blinking looks like an alarm.
- ✅ A red light moves along a cable
- ✅ The servers don't move, bend or melt
- ✅ No words, numbers or labels appear at any moment

**If it barely moves:** remove the end picture (click **X** on **+ Add end frame**) and click **Generate** again.

**If it looks wrong:** click **Generate** again.

## Part E: Save the video

1. Click the best video, then **Download (↓)**, choosing **1080p**.
2. Rename it to **`run.mp4`**.
3. Move it into the **`clip 9`** folder.

## Part F: Tell Kiro

Tell Kiro: *"clip 9 is in video-src."* It replaces the old liquid video everywhere.

(Doing it yourself: `npm run video -- run "video-src/clip 9/run.mp4" --loop`)

✅ **Clip 9 done. That's the full set!** 🎉

---

## If something goes wrong

| What you see | What to do |
|---|---|
| The video hardly moves | Remove the end picture (click **X** on **+ Add end frame**) and Generate again. Kiro fixes the loop. |
| Words, numbers, labels or icons appear | Make a new picture first (Part A). The video copies whatever is in the picture, so zoom in before you animate. |
| Wrong number of rings (Clip 7) | Add `There are exactly four rings, evenly spaced.` to the picture prompt |
| The diagram looks like stars (Clip 8) | Add `It is clearly a technical line drawing on a glass pane, not a night sky.` |
| Red lights on the servers (Clip 9) | Add `All status lights are blue. Red appears only inside one cable.` |
| The left side is too bright or busy | Add `The left half is completely dark and empty.` to the picture prompt |
| The movement is too fast | Add `extremely slow, barely perceptible motion` to the end of the video prompt |
| It doesn't match the other videos | Make sure you dragged `flow.png` into the prompt box before making the picture |
| You're stuck | Tell Kiro which clip and which step, and what you see |

---

# Finished clips (for reference)

You don't need to make these again. Their prompts are here in case you ever want to redo one. Follow the same Parts A–F as above.

## flow (home page top), 16:9

**Picture prompt**
```
Cinematic macro photograph, 16:9. Hundreds of hair-thin optical fibres stretched across a dark void, running from the left edge of the frame to the right edge. They gather into a tight, slightly twisted bundle just right of centre, then fan out again toward the right edge. The fibres are dark glass, and their edges catch a faint cool steel-blue light. Tiny points of light glow inside some of the fibres, mostly cool blue-white, and exactly three of them are signal red. The left 45% of the frame falls away into near-black, with only a few faint out-of-focus strands. The bottom third of the frame is dark and quiet. Background is deep navy-black (#0b1524). Shallow depth of field: the nearest and farthest fibres dissolve into soft bokeh while the bundle is razor sharp. Low-key lighting from a single cool steel-blue (#3a62aa) key light at the upper right. Signal red (#d92d20) appears only in the three small points of light. Shot on a large-format digital cinema camera with a 100mm macro lens, subtle fine film grain. Photoreal, minimal, precise, calm, expensive. No text, no letters, no numbers, no logos, no screens, no user interface, no holograms, no people, no lens flares, no sparks, no purple, teal or orange.
```

**Video prompt**
```
One continuous 8-second shot with no cuts, locked-off camera with an almost imperceptible slow push in. Small points of light travel steadily along the optical fibres from left to right, like data moving through a network. Most pulses are blue-white, with a few signal-red pulses among them. The pulses move at an even, unhurried speed, entering at the left edge and leaving at the right edge. The fibres themselves stay perfectly still. The left side of the frame and the bottom third stay dark and calm the whole time. The final frame returns exactly to the opening frame. Photoreal macro cinematography, shallow depth of field, deep navy-black with cool steel-blue light and small signal-red accents, subtle film grain. No text, no logos, no people, no camera shake, no speed ramps, no flashes, no lens flares, no sparks. No music, no dialogue.
```

## flow-portrait (home page top on phones), 9:16

**Picture prompt**
```
Cinematic macro photograph, vertical 9:16 frame, matching the lighting, colour grade and lens of the reference image. Hundreds of hair-thin optical fibres crossing a dark void diagonally from the lower left to the upper right. They gather into a tight, slightly twisted bundle in the upper-middle of the frame, then fan out again toward the top right. Dark glass fibres whose edges catch a faint cool steel-blue light. Tiny points of light glow inside some fibres, mostly cool blue-white, three of them signal red. The entire bottom half of the frame falls away into near-black and stays empty and quiet. Background is deep navy-black (#0b1524). Shallow depth of field, the nearest and farthest fibres dissolving into soft bokeh while the bundle is razor sharp. Low-key lighting from a single cool steel-blue (#3a62aa) key light at the top. Signal red (#d92d20) only in the small points of light. Large-format digital cinema camera, 100mm macro lens, subtle fine film grain. Photoreal, minimal, precise, calm, expensive. No text, no letters, no numbers, no logos, no screens, no user interface, no holograms, no people, no lens flares, no sparks, no purple, teal or orange.
```

**Video prompt**
```
One continuous 8-second vertical shot with no cuts, locked-off camera with an almost imperceptible slow push in. Small points of light travel steadily along the optical fibres from the lower left to the upper right, like data moving through a network, mostly blue-white with a few signal-red pulses. Even, unhurried speed. The fibres stay perfectly still. The bottom half of the frame stays dark and empty the whole time. The final frame returns exactly to the opening frame. Photoreal macro cinematography, shallow depth of field, deep navy-black with cool steel-blue light and small signal-red accents, subtle film grain. No text, no logos, no people, no camera shake, no speed ramps, no flashes, no lens flares, no sparks. No music, no dialogue.
```

## plan (Plan & Estimate), 16:9

**Picture prompt**
```
Cinematic photograph, 16:9, matching the lighting, colour grade and lens of the reference image. Low-angle close-up looking across a matte, dark anodised aluminium plate. The plate is engraved with a fine, precise grid and thin technical construction lines: arcs, offset lines and small alignment marks, pure engraved geometry. The engraving catches cool steel-blue (#3a62aa) light from a low raking angle, so the grooves glint faintly. Shallow depth of field: the foreground and far edge fall soft, and a horizontal band across the middle of the frame is razor sharp. Deep navy-black (#0b1524) shadows, with the left third almost black and the bottom third dark and quiet. Large-format digital cinema camera, 100mm macro lens, subtle fine film grain. Photoreal, minimal, precise, engineered, expensive. The engraving contains only lines and arcs, with no characters of any kind. No text, no letters, no numbers, no logos, no screens, no holograms, no people, no lens flares, no sparks, no purple, teal or orange.
```

**Video prompt**
```
One continuous 8-second shot with no cuts, static camera with very slight focus breathing. A thin, clean line of signal-red (#d92d20) light sweeps slowly across the aluminium plate from left to right, like a precision laser scanner. As it passes, the engraved lines it touches glow red for a moment, then return to dim blue. The sweep takes about five seconds and leaves the frame on the right. Before and after the sweep the plate is lit only by the dim steel-blue light, so the final frame matches the opening frame exactly. Photoreal macro cinematography, shallow depth of field, deep navy-black with cool steel-blue light and a single red line, subtle film grain. No text, no numbers, no logos, no people, no sparks, no smoke, no sci-fi beams, no camera shake, no flashes. No music, no dialogue.
```

## build (Build & Deploy), 16:9

**Picture prompt**
```
Cinematic photograph, 16:9, matching the lighting, colour grade and lens of the reference image. Low-angle macro of a dense field of small square columns made of dark matte graphite, like a pin-art sculpture, rising from a flat plane at slightly different heights. Crisp machined edges and matte surfaces, with a cool steel-blue (#3a62aa) rim light along the tops of the columns. A soft signal-red (#d92d20) glow comes from below, between the columns near the centre-right, as if something is being built underneath. The depth of field falls off into soft bokeh toward the back. The left third of the frame is in deep shadow and the bottom third is dark and quiet. Background deep navy-black (#0b1524). Large-format digital cinema camera, 100mm macro lens, subtle fine film grain. Photoreal, minimal, precise, engineered, expensive. No windows, no buildings, no toy bricks, no text, no letters, no numbers, no logos, no screens, no holograms, no people, no lens flares, no purple, teal or orange.
```

**Video prompt**
```
One continuous 8-second shot with no cuts, static camera. The columns rise and settle slowly in a gentle wave that travels from left to right across the field, precise and mechanical, like a system being assembled piece by piece. Each column moves smoothly with weight, never fast or bouncy. The red glow underneath swells softly as the wave passes and dims again behind it. The left third and bottom third stay dark. By the final frame every column is back at its starting height and the frame matches the opening frame exactly. Photoreal macro cinematography, shallow depth of field, deep navy-black with cool steel-blue rim light and a soft red glow, subtle film grain. No text, no logos, no people, no camera shake, no speed ramps, no flashes, no sparks. No music, no dialogue.
```

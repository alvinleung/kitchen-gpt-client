import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
// import { useDebounce, useDebouncedCallback } from "use-debounce";
import {useLocalStorage, useDebounce} from "usehooks-ts";
import {createMessageStore, Message, MessageRole} from "./chatapi/MessageStore";
import {Ingredients} from "./components/Ingredients";
import Video from "./components/Video";
import VoiceInput from "./components/VoiceInput";
import {useChat} from "./hooks/useChat";
import {useMessageStore} from "./hooks/useMessageStore";
import {useOptimizeTranscript} from "./hooks/useOptimizeTranscript";
import {useSpeech} from "./hooks/useSpeech";
import {useTextToSpeeh} from "./hooks/useTextToSpeech";

const App: React.FC = () => {
  const [prompt, setPrompt] = useLocalStorage("prompt", "");

  // reference this videoTime for the whole app
  const [videoTime, setVideoTime] = useState(NaN);

  //backend
  const {isWaitingResponse, submitPrompt, messages, clearMessages} = useChat();
  //stop speech
  const {
    startSpeechRecognition,
    abortSpeechRecognition,
    stopSpeechRecognition,
  } = useSpeech();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const promptValue = (e.target as HTMLInputElement).value as string;

      if (promptValue === "reset") {
        clearMessages();
        setPrompt("");
        e.preventDefault();
        return;
      }

      // submit
      submitPrompt(promptValue);
      setPrompt("");
      e.preventDefault();
    }
  };

  const handleSubmit = (prompt: string) => {
    if (prompt === "") return;
    submitPrompt(prompt);
  };

  const {speak, isSpeaking, stopSpeaking} = useTextToSpeeh();
  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];

    const wordcount = latestMessage.content.split(" ").length;

    const [summarized, expanded] = latestMessage.content.split("~");

    // if it's too long, like 50 words, provide a summary.
    // if (wordcount > 50) {
    //   speak(summarized);
    //   return;
    // }

    if (latestMessage.role === MessageRole.ASSISTANT) {
      speak(summarized);
      return;
    }
  }, [messages]);

  const latestAssistantMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      let currentMessage = messages[i];
      if (currentMessage.role === MessageRole.ASSISTANT)
        return currentMessage.content;
    }
    return "";
  }, [messages]);

  function handleTimeValueChange(time: number) {
    setVideoTime(time);
  }

  //now that we have the variable for time
  // videoTime
  //get the transcript array

  const arr = useOptimizeTranscript(VIDEO_TRANSCRIPT);

  useEffect(() => {
    if (Number.isNaN(videoTime)) return;

    const videoTimeNormalized = Math.floor(videoTime);
    console.log(arr.find((f) => f[0] === videoTimeNormalized));
  }, [videoTime]);

  return (
    <>
      <div className="grid grid-cols-2">
        <Video onCurrentTimeChange={handleTimeValueChange} />
        <Ingredients phrase={latestAssistantMessage} />
        <div className="flex flex-colbg-gray-800 text-gray-300 mt-10">
          <button onClick={stopSpeaking}>shutup</button>
          <div className="m-4 mt-4 ">
            <div className="mt-4 top-0 fixed">
              <VoiceInput
                onStartRecognition={() => {
                  stopSpeaking();
                }}
                onStopRecognition={() => {
                  stopSpeaking();
                }}
                onSubmit={handleSubmit}
                disabled={isWaitingResponse || isSpeaking}
              />
            </div>
            <div className="flex flex-col-reverse mt-4">
              {messages.map((message, index) => (
                <div className="mt-15" key={index}>
                  <div className="text-normal opacity-50">{message.role}</div>
                  <div className="text-2xl">{message.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const VIDEO_TRANSCRIPT = `
[00:00:00]- [Babish] This episode is sponsored by Cash App.
[00:00:02]When your personal finances connect you to your funds
[00:00:04]and the things that matter, that's money
[00:00:05]and that's Cash App.
[00:00:06]You know what else is money?
[00:00:07]Citrus splash protection,
[00:00:09]getting to feel like an archeologist at work
[00:00:11]and cinnamon stick chimneys.
[00:00:12]That's money, that's Cash App.
[00:00:14]Download Cash App from the App Store or Google Play Store
[00:00:16]to add your $Cashtag to the 80 million and counting.
[00:00:19](dramatic music)
[00:00:28]- Hmm.
[00:00:30]I pronounce this batch delicious.
[00:00:36]- [Babish] Hey, what's up, guys?
[00:00:37]Welcome back to Binging with Babish
[00:00:38]where this week we're taking a look
[00:00:39]at Jack Horner's plum pies
[00:00:41]from Puss in Boots: The Last Wish.
[00:00:43]Now, stone fruit is in season in the summer
[00:00:45]which makes plum pies an excellent use for underripe
[00:00:47]or under delicious plumbs that are not yet in season
[00:00:50]but first things first, we gotta make pie dough.
[00:00:52]For a double crust,
[00:00:53]we're combining 375 grams of all-purpose flour
[00:00:56]plus one and a half teaspoons of kosher salt
[00:00:58]in a relatively medium bowl.
[00:00:59]Toss it around a little bit
[00:01:00]to make sure that the salt is evenly distributed
[00:01:02]then we're adding 275 grams or two and a half sticks
[00:01:05]of refrigerator cold unsalted butter.
[00:01:07]Now, for every pie episode of this show,
[00:01:09]I've put to work a shredder, machine or gadget of some sort
[00:01:12]but I wanted to see how much harder it was
[00:01:13]to just break up the butter between your fingertips
[00:01:15]and as it turns out, it was really easy
[00:01:17]to just rub and crush the butter into
[00:01:19]let's call them larger than average blueberry sized pieces.
[00:01:22]Then the only thing that's left to do
[00:01:23]is to hydrate the dough.
[00:01:25]Now, you wanna keep everything as cold as possible
[00:01:27]to maintain a state of matter separation
[00:01:29]between your butter and your flour
[00:01:30]so I'm starting by adding a quarter cup of ice water,
[00:01:33]mixing everything together and then continuing
[00:01:35]one roughly tablespoon size splash at a time
[00:01:37]until the dough just barel ystarts to hold itself together
[00:01:40]then we're turning it out onto a work surface
[00:01:42]and gently kneading until all the flour's hydrated
[00:01:44]and the dough stops being so crumbly all the time
[00:01:46]then this being a double pie crust,
[00:01:48]we must now subdivide it in two equally sized pieces,
[00:01:50]patting each piece into a big old puck,
[00:01:53]wrapping in plastic wrap
[00:01:54]and refrigerating for at least an hour or up to three days
[00:01:56]during which time we can make our plum filling.
[00:01:58]Now, as it turns out, plums can be deceiving
[00:02:01]and once you've run your knife pole to pole around its pit
[00:02:04]and twisted it open like a purple red avocado,
[00:02:06]you may discover that it's the wrong color because silly me,
[00:02:09]I forgot that not all plums are cartoon purple throughout.
[00:02:12]For that, we're gonna need
[00:02:13]some of the more fantastically named plum varieties,
[00:02:15]Dapple Dandys, Elephant Hearts
[00:02:17]or these guys, Dinosaur Egg plums
[00:02:20]which once cracked open weren't exactly the violent shade
[00:02:23]of violet that I was hoping for
[00:02:24]but they're the best I'm gonna do this time of year.
[00:02:26]So we're splitting and pitting three pounds
[00:02:28]or 1.4 kilograms,
[00:02:29]cutting each half into three or four apple slice like slices
[00:02:32]which we're gonna dump into a wide high walled saute pan
[00:02:35]which is then headed for the stove top
[00:02:37]where we're gonna place it over medium low heat
[00:02:38]adding 145 grams of light brown sugar,
[00:02:41]the juice of one small orange
[00:02:43]less the amount thats quirts all over your person
[00:02:45]and a present but restrained pinch of kosher salt
[00:02:47]then we're bringing this guy up to a simmer
[00:02:49]and maintaining over low heat for 10 to 12 minutes
[00:02:52]until the plums are soft and tender
[00:02:53]and becoming more liquid than plum.
[00:02:55]As such much like blueberry pie,
[00:02:57]our filling needs to be thickened.
[00:02:58]So stage right, we're combining a quarter cup of cornstarch
[00:03:01]with six tablespoons of water tiny whisking into a slurry,
[00:03:04]pouring over our plums and stirring immediately
[00:03:06]to make sure that things don't clump up,
[00:03:07]continuing to cook for another one to three minutes
[00:03:09]or until nice and super duper thick.
[00:03:11]Giving a taste for seasoning.
[00:03:13]Mine was pretty tart
[00:03:14]so I'm gonna add two tablespoons of plain old sugar.
[00:03:16]Give it another taste, make sure it's got enough salt
[00:03:18]and allow to cool completely to room temperature,
[00:03:20]at least two hours.
[00:03:21]Now it's time to generously flour our worktop
[00:03:23]and get ready to start rolling out some dough
[00:03:25]starting with whichever piece is slightly bigger
[00:03:27]for the bottom shell.
[00:03:28]First, I'm gonna generously flour it on both sides
[00:03:30]and then start to press it out
[00:03:32]sort of like croissant or puff pastry
[00:03:34]which should help prevent the edges from cracking
[00:03:36]as we roll it out to an even thickness
[00:03:38]of one sixth of an inchor about half a centimeter
[00:03:40]then we're gonna give both sides
[00:03:41]a well and good brushing off.
[00:03:42]Gently pick up the round
[00:03:43]and drape it over our intended pie plate
[00:03:46]and then you wanna sort of lift and drop the dough down
[00:03:48]into the corners of the plate, not press or stretch
[00:03:51]which can cause problemsl ater on in the oven.
[00:03:53]Once it's evenly all up in there,
[00:03:54]we're gonna wrap it in plastic wrap
[00:03:55]and refrigerate until ready to use or at least an hour.
[00:03:58]Next, rinse and repeat
[00:03:59]the rollout process with the top crust.
[00:04:01]It can be a little thicker but you want it to be wide enough
[00:04:03]to generously cover the pie and to prevent making a mess,
[00:04:05]I'm gonna pre cut the X shaped vent
[00:04:07]in the center of the round.
[00:04:08]Fill up the bottom crust
[00:04:09]with our electric colored fully cooled plum filling
[00:04:12]and then I discovered that pre-cutting the vent
[00:04:14]almost caused the top layer to rip
[00:04:15]prompting me to deliver it by virtue of a pizza peel
[00:04:18]which by proxy makes this a pizza pie.
[00:04:21]Sorry, I had to and you know it.
[00:04:22]Once we've slid the lid on there
[00:04:24]trying to keep the vent dead in the center,
[00:04:25]that's when we're gonna remember
[00:04:26]that we forgot to brush the excess flour
[00:04:28]from our adjoining pie surfaces.
[00:04:30]So now's a good time to lift the lip and give it a brush
[00:04:32]to make sure that this guy doesn't explode in the oven.
[00:04:35]Next up, we're trimming off the excess
[00:04:36]to the edge of the pie plate
[00:04:37]reserving the scraps to toss in butter and cinnamon sugar
[00:04:40]and baked as a delicious treat all their own.
[00:04:42]Then as one final safeguard,
[00:04:43]we're gonna work our way around the perimeter of the pie
[00:04:46]pinching, almost smearing shut
[00:04:47]which will hopefully stop the crust
[00:04:49]from springing any leaks.
[00:04:50]Then it's time to crimp
[00:04:51]so that our pie has that signature cartoon pie shape.
[00:04:54]Basically just press one finger Hot and sexy in between two other fingers
[00:04:57]and that's really all there is to it.
[00:04:58]You can also pinch the edges
[00:04:59]to give the pie a more starlike look than wavy.
[00:05:01]Now, this guy's headed back into the fridge one more time
[00:05:04]before going into the oven.
[00:05:05]Then after a final 20 minute chill,
[00:05:07]we're brushing it down with a mixture of one egg yolk
[00:05:09]tiny whisked together with a tablespoon of heavy cream.
[00:05:12]Brush down every single square inch.
[00:05:13]Leave no patch of pie unpainted.
[00:05:15]Place the pie on a large rimmed baking sheet
[00:05:17]to catch any potential drips
[00:05:19]and then we're gonna very carefully
[00:05:20]open the flaps of the vents
[00:05:21]so that we can insert a pie chimney
[00:05:24]in the form of a cinnamon stick.
[00:05:25]This is gonna give bubbling steam
[00:05:27]a means by which to escape the crust
[00:05:29]which will hopefully prevent
[00:05:30]any dreaded crust ruining pie overflow,
[00:05:32]something that most of my pies have.
[00:05:34]This guy's headed directly onto a preheated pizza stone
[00:05:37]in a 400 degree Fahrenheit oven
[00:05:38]where it's going to bake with the occasional rotation
[00:05:40]for 45 to 55 minutes until the crust is deeply golden brown.
[00:05:44]Now, I sprung some leaks on the side
[00:05:46]but it appears as though the pie chimney did its job
[00:05:49]keeping gummy fruit pools
[00:05:50]from forming on my hard won pie crust.
[00:05:52]Now, once this guy has cooled completely,
[00:05:54]at least four hours on the tray or three on a windowsill,
[00:05:56]it's time to test it like little Jack Dorsey
[00:05:59]mercilessly thumbing the center of the pie
[00:06:01]in what would be a very unsanitary taste testing measure
[00:06:03]in a commercial pie making environment
[00:06:05]and the filling tasted great before.
[00:06:07]Tastes great now.
[00:06:08]I'm not sure what lesson was to be learned
[00:06:09]from that nursery rhyme.
[00:06:10]Maybe cut yourself a slice
[00:06:11]and eat your pie like an adult, Jack.
[00:06:14]Now, as you can see, the filling was still pretty runny
[00:06:16]and I didn't cut through it very well so I lost some.
[00:06:18]If your pie ends up too runny,
[00:06:19]you can always fridge it and serve once chilled
[00:06:21]and I gotta say this was a pretty top-notch pie.
[00:06:23]All my past pie dough tricks might save you five minutes
[00:06:26]but by hand seems like the way to go.
[00:06:28]The bottom of the crust was crispy
[00:06:29]in spite of the wet filling and the top and edges
[00:06:31]were a veritable catacomb of buttery layers.
[00:06:33]Maybe use a little bit more cornstarch next time
[00:06:35]but apart from that, I pronounce this batch delicious.
[00:06:39]Maybe just don't shove your thumb in it.
[00:06:40]Thanks again to Cash App.
[00:06:41]That's money, that's Cash App.
[00:06:43]Download Cash App from theApp Store or Google Play Store
[00:06:45]to add your $Cashtag to the80 million and counting.
[00:06:48](calm music)
`;

export default App;

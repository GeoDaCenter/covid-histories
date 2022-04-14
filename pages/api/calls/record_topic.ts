import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import { prompts } from "./_prompts";
import { getOrCreateUserRecord, createOrUpdateUserRecord } from "./_s3_utils";
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === "POST") {
    const selection = parseInt(req.query.topic_id as string);
    const category = parseInt(req.query.category_id as string);
    const section = prompts[selection];
    const doNext = () => {
      const twiml = new VoiceResponse();

      if (category < section.categories.length) {
        twiml.say(section.categories[category]);
        twiml.record({
          maxLength: 60,
          finishOnKey: "#",
          action: `https://covid-histories.vercel.app/api/calls/record_topic?topic_id=${selection}&category_id=${
            category + 1
          }`,
        });
      } else {
        twiml.say(
          "Thanks for submitting your entry. Select another topic to record another story or simply hangup to end your submission"
        );
        twiml.redirect(
          { method: "POST" },
          "https://covid-histories.vercel.app/api/calls/prompt_topic"
        );
      }

      res.setHeader("content-type", "text/xml");
      res.send(twiml.toString());
    };

    getOrCreateUserRecord(req.body.From).then((user) => {
      console.log("Selected topic ", req.body, req.query, user);

      if (req.body.RecordingUrl) {
        createOrUpdateUserRecord(req.body.From, {
          ...user,
          recordings: [
            ...user.recordings,
            {
              topic_id: selection,
              category: category,
              url: req.body.RecordingUrl,
              ssid: req.body.RecordingSid,
              duration: req.body.RecordingDuration,
            },
          ],
        }).then(() => {
          doNext();
        });
      } else {
        doNext();
      }
    });
  }
}

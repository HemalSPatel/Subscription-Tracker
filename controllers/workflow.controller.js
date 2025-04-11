import { createRequire } from "module";
import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";

const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

const REMINDERS = [7, 2, 1]; // TODO: make this configurable by the user

export const sendReminders = serve(async (context) => {
  console.log("Workflow Context:", {
    disabled: context.disabled,
    workflowRunId: context.workflowRunId,
    requestPayload: context.requestPayload,
  });
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  // If we don't find the subscription or we see that it is not active we do not trigger the workflow
  if (!subscription || subscription.status !== "Active") {
    console.log(
      "Subscription not found or not active",
      subscriptionId,
      "Stopping workflow",
    );
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      "Renewal date has passed for subscription",
      subscriptionId,
      "Stopping workflow",
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `Reminder ${daysBefore} days before`,
        reminderDate,
      );
    }
    await triggerReminder(context, `Reminder ${daysBefore} days before`);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (contxt, label, date) => {
  console.log("Sleeping until", label, "reminder at", date);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {
  return await context.run(label, () => {
    console.log("Triggering", label, "reminder");
    //here we send email or any form of notification to the user
  });
};

"use server";

import { revalidatePath } from "next/cache";

import {
  createUser,
  findUserByCredentials,
  updateInterest,
  updateGoing,
  getEventById,
} from "@/db/queries";

import { redirect } from "next/navigation";
import { Resend } from "resend";
import EmailTemplate from "@/components/payment/EmailTemplate";

const registerUser = async (formData) => {
  const user = Object.fromEntries(formData);

  const created = await createUser(user);

  redirect("/login");
};

const performLogin = async (formData) => {
  try {
    const credential = {};
    credential.email = formData.get("email");
    credential.password = formData.get("password");
    const found = await findUserByCredentials(credential);

    return found;
  } catch (error) {
    throw error;
  }
};

const addInterestedEvent = async (eventId, authId) => {
  try {
    await updateInterest(eventId, authId);
  } catch (error) {
    throw error;
  }
  revalidatePath("/");
};

const addGoingEvent = async (eventId, user) => {
  try {
    await updateGoing(eventId, user?.id);
    await sendEmail(eventId, user);
  } catch (error) {
    throw error;
  }
  revalidatePath("/");
  redirect(`/details/${eventId}`);
};

const sendEmail = async (eventId, user) => {
  const event = await getEventById(eventId);

  const resend = new Resend(process.env.RESEND_API_KEY);
  const message = `Dear ${user?.name}, you have been successfully registered for the event, ${event?.name}. Please carry this email and your official id to the venue. We are excited to have you here.`;

  const sent = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: user?.email,
    subject: "Successfully Registered for the event!",
    react: EmailTemplate({ message }),
  });
};

export {
  registerUser,
  performLogin,
  addInterestedEvent,
  addGoingEvent,
  sendEmail,
};

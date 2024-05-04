"use client";

import { addInterestedEvent } from "@/app/actions";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const ActionButtons = ({
  eventId,
  interestedUsersIds,
  goingUserIds,
  fromDetails,
}) => {
  const { auth } = useAuth();
  const router = useRouter();

  const isInterested = interestedUsersIds?.find((id) => id === auth?.id);
  const isGoing = goingUserIds?.find((id) => id === auth?.id);

  const [interested, setInterested] = useState(isInterested);
  const [going, setGoing] = useState(isGoing);
  const [isPending, startTransition] = useTransition();

  const toggleInterest = async () => {
    if (auth) {
      await addInterestedEvent(eventId, auth?.id);
      setInterested(!interested);
    } else {
      router.push("/login");
    }
  };

  const markGoing = () => {
    if (auth) {
      router.push(`/payment/${eventId}`);
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <div className={`w-full flex gap-4 mt-4 ${fromDetails && "flex-1"}`}>
        {/* <!-- bg-indigo-600 indicating Active --> */}
        <button
          className={`w-full ${
            interested && "bg-indigo-600 hover:bg-indigo-800"
          }`}
          onClick={() =>
            startTransition(() => {
              toggleInterest();
            })
          }
        >
          Interested
        </button>

        {/* <!-- bg-green-600 indicating Active --> */}
        <button
          disabled={auth && going}
          onClick={markGoing}
          className={`w-full `}
        >
          Going
        </button>
      </div>
    </>
  );
};

export default ActionButtons;

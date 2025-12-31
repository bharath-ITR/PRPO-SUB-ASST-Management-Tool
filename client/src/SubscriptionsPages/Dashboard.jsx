import { useState } from "react";
import SliderNav from "../SubscriptionsComponents/SliderNav";
import Subscriptions from "./Subscriptions";
import Assets from "./Assets";

export default function Dashboard() {
  const [active, setActive] = useState("Subscriptions");

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <SliderNav active={active} setActive={setActive} />
      {active === "Subscriptions" ? <Subscriptions /> : <Assets />}
    </div>
  );
}


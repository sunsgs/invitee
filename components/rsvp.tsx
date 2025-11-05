import { useState } from "react";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Switch } from "./ui/switch";

export default function RSVP() {
  const [isActivated, setIsActivated] = useState(false);

  const handleToggle = () => {
    setIsActivated((prev) => !prev);
  };

  return (
    <div className="flex flex-col mt-4 mb-4 items-center justify-center">
      <div>
        <Switch
          id="airplane-mode"
          checked={isActivated}
          onCheckedChange={handleToggle}
        />{" "}
        activate rsvp
      </div>

      {isActivated && (
        <div id="inner">
          <h2 className="mb-2 font-bold text-center">Are u coming?</h2>
          <ButtonGroup
            style={{
              opacity: 1,
              pointerEvents: "auto",
            }}
          >
            <Button variant={"outline"}>not going</Button>
            <Button variant={"outline"}>maybe</Button>
            <Button variant={"outline"}>going</Button>
          </ButtonGroup>
        </div>
      )}
    </div>
  );
}

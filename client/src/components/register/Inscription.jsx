import { Fragment, useState } from "react";
import { RegisterProvider } from "@/context/RegisterContext";

import { Tab } from "@headlessui/react";
import classNames from "classnames";

import IdStep from "@/components/register/IdStep";
import InfoStep from "@/components/register/InfoStep";
import PasswordStep from "@/components/register/PasswordStep";
import clamp from "@/util/clamp";
import Success from "./Success";

function Inscription() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const handleNextStep = () => setSelectedTabIndex(selectedTabIndex + 1);
  const handlePreviousStep = () => setSelectedTabIndex(selectedTabIndex - 1);

  return (
    <RegisterProvider>
      <div
        className={classNames(
          "absolute top-0 left-0 min-h-2 bg-brand-400 duration-300",
          {
            "min-w-0": selectedTabIndex <= 0,
          },
          {
            "min-w-[33%]": selectedTabIndex === 1,
          },
          {
            "min-w-[66%]": selectedTabIndex === 2,
          },
          {
            "min-w-full": selectedTabIndex >= 3,
          }
        )}
      ></div>
      <Tab.Group
        selectedIndex={clamp(selectedTabIndex, 0, 3)}
        as="div"
        className="lg:wrapper"
      >
        <Tab.List className="hidden">
          <Tab></Tab>
          <Tab></Tab>
          <Tab></Tab>
          <Tab></Tab>
        </Tab.List>
        <Tab.Panels as="div" className="wrapper">
          <Tab.Panel as="div" className="wrapper">
            <IdStep onNextStep={handleNextStep} />
          </Tab.Panel>
          <Tab.Panel as="div" className="wrapper">
            <InfoStep
              onNextStep={handleNextStep}
              onPreviousStep={handlePreviousStep}
            />
          </Tab.Panel>
          <Tab.Panel as="div" className="wrapper">
            <PasswordStep
              onNextStep={handleNextStep}
              onPreviousStep={handlePreviousStep}
            />
          </Tab.Panel>
          <Tab.Panel as="div" className="wrapper">
            <Success />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </RegisterProvider>
  );
}

export default Inscription;

import React from "react";

const Success = () => {
  return (
    <div className="h-full grid place-items-center text-center space-y-8">
      <h1 className="text-3xl lg:text-5xl font-semibold">
        Inscription réussie !
      </h1>
      <p className="text-lg lg:text-xl">
        Veuillez vous authentifier{" "}
        <a
          href="/auth"
          className="text-brand-300 hover:text-brand-400 transition duration-100"
        >
          ici
        </a>
        .
      </p>
    </div>
  );
};

export default Success;

import LoadingSpinner from "./icons/LoadingSpinner";

const SubmitButton = ({ isLoading, shouldDisable, formId, children }) => {
  return (
    <button
      className="text-center mb-0 mt-auto py-3 rounded-lg bg-brand-400 text-neutral-50 font-semibold active:bg-brand-500 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-brand-300 focus:ring-opacity-75 cursor-pointer disabled:cursor-not-allowed disabled:bg-foreground-100 hover:bg-brand-300 transition duration-300 ease-in-out"
      disabled={isLoading || shouldDisable}
      form={formId}
    >
      {isLoading ? (
        <LoadingSpinner classnames="size-6 mx-auto stroke-neutral-50 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButton;

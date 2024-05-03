const Error = ({ message }) => {
  return (
    <div className="bg-destructive text-destructive-foreground max-w-screen-md text-center py-12 px-4 rounded-2xl">
      <h2>Erreur !</h2>
      <p className="text-muted-foreground italic text-sm mt-6">{message}</p>
    </div>
  );
};

export default Error;

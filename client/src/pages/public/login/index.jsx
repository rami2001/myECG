import AuthForm from "./AuthForm";

const index = () => {
  return (
    <Section className="flex flex-col lg:flex-row place-items-center py-14 px-8 lg:py-0x md:px-8 lg:px-14">
      <aside className="md:w-[75%] lg:w-1/2 text-center">
        <h1>Ravi de vous revoir !</h1>
        <h5>Mot de passe oublié ? </h5>
        <Button variant="link" disabled={loading}>
          Demandez-un autre.
        </Button>
      </aside>
      <Separator className="lg:hidden mt-2" />
      <AuthForm />
    </Section>
  );
};

export default index;

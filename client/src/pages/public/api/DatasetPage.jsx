import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import Loading from "@/pages/Loading";

const DatasetPage = () => {
  const { token } = useParams();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getValidation = async () => {
      try {
        const response = await axios.get(`public/dataset`);

        window.location.href = response.data.downloadUrl;
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      getValidation();
    }
  }, [token]);

  return (
    <section className="w-full min-h-[85vh] grid place-items-center">
      {token ? (
        <div className="text-center">
          <h1 className="text-primary">Téléchargement du Dataset</h1>
          <h4>Votre téléchargement commencera bientôt.</h4>
          <br />
          <p className="text-muted-foreground text-sm italic">
            Merci de patienter pendant le téléchargement.
          </p>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-primary">Erreur !</h1>
          <h4>Impossible de télécharger le Dataset.</h4>
          <br />
          <p className="text-muted-foreground text-sm italic">
            Ce lien est expiré ou inéxistant.
          </p>
        </div>
      )}
    </section>
  );
};

export default DatasetPage;

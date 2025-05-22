import { useEffect } from "react";

const Livechat = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src =
      "https://s01.live2support.com/dashboardv2/chatwindow/?stid=245114"; // Bonne URL

    script.onload = () => console.log("Live Chat ProProfs chargé !");
    script.onerror = () =>
      console.error(" Erreur lors du chargement du Live Chat.");

    document.body.appendChild(script);

    return () => {
      console.log("🧹 Suppression du script Live Chat...");
      document.body.removeChild(script);
    };
  }, []);

  return <></>;
};
export default Livechat;

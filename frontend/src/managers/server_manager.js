import axios from 'axios';

//Modulo para manejo del servidor
const ServerManager = (function() {
  //Funcion para enviar las configuraciones del servidor
  const StartServer = (model, langEntrada, langSalida, SetEnabled, setErrorText) => {
    //Se preparan los datos para enviarse
    const formData = new FormData();
    formData.append('Modelo', model);
    formData.append('LangEntrada', langEntrada);
    formData.append('LangSalida', langSalida);

    //Se envian los datos
    axios.post(`http://localhost:3000/start`,
      formData
    ).then((response) => {
      //Se guarda la respuesta
      if (response.status === 200) {
        SetEnabled(true);
      } else {
        SetEnabled(false);
        setErrorText(response.data);
      }
    }).catch((error) => {
      //En caso de error se imprime
      console.log("Error")
      console.log(error);
    })
  }

  //Funcion para solicitar la informacion del servidor
  const GetData = (setLanguageList, setReductedLanguageList, setModelList) => {
    //Se envian los datos
    axios.get(`http://localhost:3000/get_data`
    ).then((response) => {
      //Se guarda la respuesta
      setLanguageList(response.data.lang);
      setReductedLanguageList(response.data.lang_min);
      setModelList(response.data.models);

    }).catch((error) => {
      //En caso de error se imprime
      console.log("Error")
      console.log(error);
    })
  }

  return {
    StartServer: StartServer,
    GetData: GetData
  }
})();

export default ServerManager;
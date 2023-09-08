import axios from 'axios';

//Modulo para manejo de audio
const AudioManager = (function() {
  //Funcion para enviar el audio
  const SendAudio = (Audio, setResponseText) => {
    //Se preparan los datos para enviarse
    const formData = new FormData();
    formData.append('audio', Audio);
    console.log("Enviando audio - >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>") 
    //Se envian los datos
    axios.post(`http://localhost:3000/`,
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Methods': 'GET, POST',
        }
      }
    ).then((response) => {
      //Se guarda larespuesta
      setResponseText(response.data);
    }).catch((error) => {
      //En caso de error se imprime
      console.log("Error")
      console.log(error);
    })
  }

  return {
    SendAudio: SendAudio
  }
})();

export default AudioManager;
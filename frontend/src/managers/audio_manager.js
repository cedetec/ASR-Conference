import axios from 'axios';

//Modulo para manejo de audio
const AudioManager = (function() {
  //Funcion para enviar el audio
  const SendAudio = (Audio, setResponseText) => {
    //Se preparan los datos para enviarse
    const formData = new FormData();
    formData.append('audio', Audio);

    //Se envian los datos
    axios.post(`http://localhost:3000`,
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    ).then((response) => {
      //Se guarda la respuesta
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
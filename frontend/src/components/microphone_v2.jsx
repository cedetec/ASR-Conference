import React, { useEffect, useState, useRef } from 'react';
import './components.css';

//Componente del microfono
function Microphone(props) {
  const { sendAudio, Enabled } = props;

  /**********************Listado de variables**********************************
   * sendAudio: Conexion al audio manager                                     *
   * stream: Contenedor del stream de datos de audio                          *
   * started: Switch de boton para grabar audio                               *
   * domainData: Datos obtenidos de stream de audio                           *
   * micActivo: Switch de activacion de microfono                             *
   * audioChunks: Listado de bloques de audio obtenido                        *
   * bufferLength: Tamaño de buffer para analisis de audio                    *
   * analyserGlobal: Contenedor del analizador de datos de audio              *
   * noiseChecker: Contenedor del repetidor para la deteccion de sonido       *
   * soundDetected: Switch de deteccion de tiempo                             *
   * tiempoCumplido: Switch de tiempo para envio de bloque de audio           *
   * mediaRecorder: Contenedor del grabador de audio                          *
   * globalSoundDetected: Switch de deteccion global de sonido                *
   ****************************************************************************/
  const [stream, setStream] = useState(null);
  const [started, setStarted] = useState(false);
  const [domainData, setDomainData] = useState([]);
  const [micActivo, setMicActivo] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [bufferLength, setBufferLength] = useState(0);
  const [analyserGlobal, setAnalyser] = useState(null);
  const [noiseChecker, setNoiseChecker] = useState(null);
  const [soundDetected, setSoundDetected] = useState(false);
  const [tiempoCumplido, setTiempoCumplido] = useState(false);
  const [globalSoundDetected, setGlobalSoundDetected] = useState(false);

  const mediaRecorder = useRef(null);

  let localChunks = [];
  
  //Efecto de iniciacion, solicita y genera stream de audio
  useEffect(()=>{
    if ("MediaRecorder" in window) {
      try {
        navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        }).then((Stream) => {
          setStream(Stream);

          //Creacion de analizador
          const audioContext = new AudioContext();
          const audioStreamSource = audioContext.createMediaStreamSource(Stream);
          const analyser = audioContext.createAnalyser();
          analyser.minDecibels = -60;
          audioStreamSource.connect(analyser);
            
          const buffLength = analyser.frequencyBinCount;
          const domaData = new Uint8Array(buffLength);
            
          setAnalyser(analyser);
          setBufferLength(buffLength);
          setDomainData(domaData);
          console.log("Iniciando intervalo");
          //setInterval(() => {detectSound()}, 10);
        });
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  }, []);

  //Efecto para el cambio de los chunks de audio obtenido, se encarga de enviar el audio en caso de que no este vacio
  useEffect(()=>{
    if (audioChunks.length > 0){    
      console.log("Global sound: "+globalSoundDetected);
      if (globalSoundDetected){
        const audioBlob = new Blob(audioChunks, { type: "audio/wav; codecs=0" });
        sendAudio(audioBlob);
      }
      setGlobalSoundDetected(false);

      localChunks = [];
      setAudioChunks([]);
    }
  },[audioChunks]);

  //Efecto encargado de desactivar el audio si pasa el tiempo minimo y no se detecta sonido
  useEffect(()=>{
    if (tiempoCumplido){
      if (!soundDetected){
        DesactivarMicrofono();
      }
    }
  }, [tiempoCumplido, soundDetected]);

  //Efecto encargado de cortar y continuar la grabacion de audio
  useEffect(()=>{
    if (started){
      if (micActivo){
        setTimeout(() => {setTiempoCumplido(true)}, 2000);
        setNoiseChecker(setInterval(() => {detectSound()}, 10));
      } else {
        ActivarMicrofono();
        clearInterval(noiseChecker);
        setNoiseChecker(null);
      }
    }else{
      clearInterval(noiseChecker);
      setNoiseChecker(null);
    }
  },[micActivo, started]);

  //Funcion que genera el grabador de audio y el analizador de ruido y comienza la grabacion
  const ActivarMicrofono = async () => {
    //Creacion del grabador
    const media = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorder.current = media;

    localChunks = [];
    setAudioChunks(localChunks);

    mediaRecorder.current.ondataavailable = dataAvailableFunc;
    mediaRecorder.current.onstop = stopFunc;

    setMicActivo(true);
    setTiempoCumplido(false);

    mediaRecorder.current.start();
  };

  //Funcion encargada de desactivar la grabacion
  const DesactivarMicrofono = () => {
    mediaRecorder.current.stop();
    setMicActivo(false);
  };

  //Funcion encargada de detectar el ruido
  const detectSound = () => {
    if(analyserGlobal && bufferLength && domainData){
      var Sound = false;
      analyserGlobal.getByteFrequencyData(domainData);
      for(let i = 0; i < bufferLength; i++){
        if(domainData[i] > 0){
          Sound = true;
        }
      }
      setSoundDetected(Sound);
      if (Sound){
        setGlobalSoundDetected(true);
      }
    }
  };

  //Funcion "ondataavailable" para el media recorder
  const dataAvailableFunc = (event) => {
    if (typeof event.data === "undefined"){ 
      return;
    }

    if (event.data.size === 0){ 
      return;
    }

    localChunks.push(event.data);
  };

  //Funcion "onstop" para el media recorder
  const stopFunc = () => {
    setAudioChunks(localChunks);
  };

  return (
    <>
    {
      started ?
        <img src="img/Microfono.svg" className={Enabled ? 'microphone' : 'microphone desactivate'} title='Desactivar microfono' alt="" onClick={(e) => {
                                                                                                    if (Enabled){
                                                                                                      DesactivarMicrofono(e);
                                                                                                      setStarted(false);
                                                                                                    }
                                                                                                    
                                                                                                  }} />
          :
        <img src="img/MicrofonoMute.svg" className={Enabled ? 'microphone' : 'microphone desactivate'} title='Activar microfono' alt="" onClick={(e) => {
                                                                                                    if (Enabled){
                                                                                                      ActivarMicrofono(e);
                                                                                                      setStarted(true);
                                                                                                    }
                                                                                                  }} />
    }
    <div className={soundDetected?"voicePrinter voiceOn":"voicePrinter voiceOff"} />
    </>
  );
}

export default Microphone;

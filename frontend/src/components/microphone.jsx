import React, { useEffect, useState, useRef } from 'react';
import './components.css';

//Componente del microfono
function Microphone(props) {
  const { sendAudio } = props;

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
      const audioBlob = new Blob(audioChunks, { type: "audio/wav; codecs=0" });
      console.log( "audioChunks.length: " )
      console.log( audioChunks.length)
      sendAudio(audioBlob);

      localChunks = [];
      console.log( "localChunks.length: " )
      console.log( localChunks.length)
      setAudioChunks([]);
    }
    console.log( "audioChunks.length 2: " )
    console.log( audioChunks.length)

  },[audioChunks]);

  //Efecto encargado de desactivar el audio si pasa el tiempo minimo y no se detecta sonido
  useEffect(()=>{
    if (tiempoCumplido){
      if (!soundDetected){
        DesactivarMicrofono();
        console.log('Microfono desactivado');
    //    localChunks = [];//nuevo
    //    setAudioChunks(localChunks);//nuevo
      }
    }
  }, [tiempoCumplido, soundDetected]);

  //Efecto encargado de cortar y continuar la grabacion de audio
  useEffect(()=>{
    if (started){
      if (micActivo){
        setNoiseChecker(setInterval(() => {detectSound()}, 10));
        setTimeout(() => {setTiempoCumplido(true)}, 4000);
        console.log('1');
      } else {
        ActivarMicrofono()
        clearInterval(noiseChecker);
        setNoiseChecker(null);
        console.log('2');
      }
    }else{
      clearInterval(noiseChecker);
      setNoiseChecker(null);
      console.log('3');
    }
  },[micActivo, started]);

  //Funcion que genera el grabador de audio y el analizador de ruido y comienza la grabacion
  const ActivarMicrofono = async () => {
    console.log('Grabando: ');
    //Creacion del grabador
    const media = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorder.current = media;

    localChunks = [];
    setAudioChunks(localChunks);

    mediaRecorder.current.ondataavailable = dataAvailableFunc;
    mediaRecorder.current.onstop = stopFunc;

    //Creacion de analizador
    const audioContext = new AudioContext();
    const audioStreamSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.minDecibels = -60;
    audioStreamSource.connect(analyser);
      
    const buffLength = analyser.frequencyBinCount;
    const domaData = new Uint8Array(buffLength);
      
    setAnalyser(analyser);
    setBufferLength(buffLength);
    setDomainData(domaData);

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
    var Sound = false;
    analyserGlobal.getByteFrequencyData(domainData);
    for(let i = 0; i < bufferLength; i++){
      if(domainData[i] > 0){
        Sound = true;
        console.log('Detectando sonido - verdadero: ');
      }
     // else{console.log('Detectando sonido - false: '); }
    }
    //console.log('Detectando sonido: ');
    //console.log(Sound);
    setSoundDetected(Sound);
  };

  //Funcion "ondataavailable" para el media recorder
  const dataAvailableFunc = (event) => {
    if (typeof event.data === "undefined"){ 
      return;
    }

    if (event.data.size === 0){ 
      return;
    }
    console.log("localChunks.push -----------");
    console.log(event.data.size);
    localChunks.push(event.data);
    console.log( localChunks.length)
  };

  //Funcion "onstop" para el media recorder
  const stopFunc = () => {

    console.log("localChunks.stopFunc -----------");
    console.log(localChunks.length);
    setAudioChunks(localChunks);


  };

  return (
    <>
    {
      started ?
        <img src="img/Microfono.svg" className='microphone' title='Desactivar microfono' alt="" onClick={(e) => {
                                                                                                    DesactivarMicrofono(e);
                                                                                                    setStarted(false);
                                                                                                  }} />
          :
        <img src="img/MicrofonoMute.svg" className='microphone' title='Activar microfono' alt="" onClick={(e) => {
                                                                                                    ActivarMicrofono(e);
                                                                                                    setStarted(true);
                                                                                                  }} />
    }
    <div className={soundDetected?"voicePrinter voiceOn":"voicePrinter voiceOff"} />
    </>
  );
}

export default Microphone;

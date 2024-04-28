import './components.css';
import React, { useState, useEffect } from 'react';

//Componente tipeador de texto
const Configurations = (props) => {
  const { soundDetected, minDecibels, setMinDecibels, setTickResetMic, micReady, serverReady, selectedInputDevice, setSelectedInputDevice } = props;

  /**********************Listado de variables**********************************
   * SetEnabled: Funcion para determinar si se puede detectar el microfono    *
   * languageList: Listado de lenguajes para deteccion/traduccion             *
   * reductedLanguageList: Listado de lenguajes minimizado                    *
   * modelList: Listado de modelos                                            *
   * selectedInLanguage: Lenguaje de entrada seleccionado                     *
   * selectedOutLanguage: Lenguaje de salida seleccionado                     *
   * selectedModel: Modelo seleccionado                                       *
   * loaded: Switch que determina si los listados cargaron                    *
   * errorText: Variable con texto de error                                   *
   ****************************************************************************/

  const [inputDevices, setInputDevices] = useState([]);

  useEffect(() => {
    async function getMediaDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
        setInputDevices(audioInputDevices);
      } catch (error) {
        console.error('Error al enumerar dispositivos:', error);
      }
    }

    getMediaDevices();
  }, []);

  const seleccionarEntrada = (event) => {
    setSelectedInputDevice(event.target.value);
  };

  const cambiarDecibelios = (e) => {
    setMinDecibels(e.target.value);
  }

  const resetearMicrofono = () => {
    setTickResetMic(true);
  }

  return (
    <div className='configurations'>
      <h3>Opciones de microfono</h3>
      <div className='optionDiv'>
        Microfono listo: 
        <div className={micReady?"switchPrinter TrueOption":"switchPrinter FalseOption"} />
      </div>

      <div className='optionDiv'>
        Servidor listo: 
        <div className={serverReady?"switchPrinter TrueOption":"switchPrinter FalseOption"} />
      </div>

      <div className='optionDiv'>
        Sensor sonido: 
        <div className={soundDetected?"voicePrinter TrueOption":"voicePrinter FalseOption"} />
      </div>
      
      <div className='optionDiv'>
        Decibeles minimos: {minDecibels}dB
        <input type='range' min="-100" max="-31" defaultValue={minDecibels} onChange={(e)=>{cambiarDecibelios(e)}}/> 
      </div>

      <div className='optionDiv'>
        Dispositivo de entrada: 
        <select className='selectStyle' value={selectedInputDevice} onChange={seleccionarEntrada}>
          <option value="">Seleccione</option>
          {inputDevices.map((device, index) => (
            <option key={index} value={device.deviceId}>{device.label || `Dispositivo ${index + 1}`}</option>
          ))}
        </select>
      </div>
      
      <button className='butonStyle' onClick={resetearMicrofono}>Reiniciar microfono</button>
    </div>
  );
};

export default Configurations;